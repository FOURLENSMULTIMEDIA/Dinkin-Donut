// Courtcall clubs.
//   GET  ?slug=x                public branding + access state
//   GET  ?available=x           is this link free?
//   GET  ?stats                 founding spots left
//   POST {create:{...}}         sign up (club starts LOCKED until the owner approves it on WhatsApp)
//   POST {slug, code}           enter the activation PIN the owner sent on WhatsApp → 14-day trial starts
//   Owner (Dinkin' Donut host token): GET ?all, POST {slug, owner: "approve"|"paid"|"extend"|"suspend"|"unsuspend"|"pin"|"delete", months, plan}
const crypto = require("crypto");
const { isHost: isOwner, hashPin } = require("./_auth");
const { TRIAL_DAYS, PLANS, FOUNDING_SPOTS, SALES, slugify, RESERVED, getClub, saveClub, listClubs, access, publicClub } = require("./_clubs");
const { getGlobal, setGlobal } = require("./_store");

const clean = (s, n = 60) => String(s ?? "").replace(/[<>]/g, "").replace(/\s+/g, " ").trim().slice(0, n);
const hex = c => /^#[0-9a-f]{6}$/i.test(c || "") ? c.toUpperCase() : null;
const digits = p => String(p || "").replace(/\D/g, "");
const day = 864e5;
const ipOf = req => String(req.headers["x-forwarded-for"] || req.socket?.remoteAddress || "?").split(",")[0].trim();
const signups = globalThis.__ccSignups || (globalThis.__ccSignups = new Map());
const codeTries = globalThis.__ccCodeTries || (globalThis.__ccCodeTries = new Map());

module.exports = async (req, res) => {
  res.setHeader("Cache-Control", "no-store");
  try {
    const q = req.query || {};
    const body = typeof req.body === "string" ? JSON.parse(req.body || "{}") : req.body || {};
    const owner = isOwner(req);

    if (req.method === "GET") {
      if (q.all !== undefined) {
        if (!owner) return res.status(401).json({ error: "Owner only." });
        const list = (await listClubs()).map(c => ({ ...c, pinHash: undefined, access: access(c) })).sort((a, b) => b.created - a.created);
        return res.json({ list, founding: await foundingLeft() });
      }
      if (q.available !== undefined) {
        const s = slugify(q.available);
        return res.json({ slug: s, ok: s.length >= 3 && !RESERVED.has(s) && !(await getClub(s)) });
      }
      if (q.stats !== undefined) return res.json({ founding: await foundingLeft(), foundingTotal: FOUNDING_SPOTS, plans: PLANS, trialDays: TRIAL_DAYS, sales: SALES });
      const c = await getClub(q.slug);
      return c ? res.json(publicClub(c)) : res.status(404).json({ error: "Club not found." });
    }
    if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed." });

    // ---- sign up
    if (body.create) {
      const f = body.create, ip = ipOf(req), now = Date.now();
      const recent = (signups.get(ip) || []).filter(t => now - t < day);
      if (recent.length >= 3) return res.status(429).json({ error: "Too many sign-ups from this connection today. Message us on WhatsApp instead." });
      const name = clean(f.name, 48), slug = slugify(f.slug || f.name), wa = digits(f.whatsapp);
      if (name.length < 3) return res.status(400).json({ error: "Please add your club name." });
      if (slug.length < 3 || RESERVED.has(slug)) return res.status(400).json({ error: "Please choose another club link." });
      if (await getClub(slug)) return res.status(409).json({ error: "That club link is taken. Try another." });
      if (wa.length < 8) return res.status(400).json({ error: "Please add the WhatsApp number we should verify." });
      if (String(f.pin || "").length < 6) return res.status(400).json({ error: "Host PIN must be at least 6 characters." });
      const logo = String(f.logo || "");
      if (logo && (!/^data:image\/(png|jpeg|webp|svg\+xml);base64,/.test(logo) || logo.length > 280000)) return res.status(400).json({ error: "Logo must be a PNG, JPG, WebP or SVG under 200 KB." });
      // One trial per WhatsApp number, ever.
      const used = await getGlobal("trialPhones", []);
      const wkey = wa.slice(-8);
      const c = {
        slug, name, short: clean(f.short || name, 20), city: clean(f.city, 40),
        color: hex(f.color) || "#FF5FA2", accent: hex(f.accent) || "#D7F03C", logo,
        contact: clean(f.contact, 40), whatsapp: "+" + (wa.length === 8 ? "974" + wa : wa), email: clean(f.email, 80),
        plan: PLANS[f.plan] ? f.plan : "club",
        pinHash: hashPin(f.pin), created: now, trialEnds: 0, paidUntil: 0, suspended: false,
        request: "CC-" + crypto.randomBytes(2).toString("hex").toUpperCase(),
        code: String(crypto.randomInt(100000, 1000000)), approved: false,
        repeat: used.includes(wkey), log: [{ t: now, txt: "Signed up" }],
      };
      await saveClub(c);
      signups.set(ip, [...recent, now]);
      return res.json({ ok: true, club: publicClub(c), request: c.request, repeat: c.repeat });
    }

    // ---- club enters the activation PIN they received on WhatsApp
    if (body.slug && body.code !== undefined && !body.owner) {
      const c = await getClub(body.slug);
      if (!c) return res.status(404).json({ error: "Club not found." });
      const k = c.slug + "|" + ipOf(req), t = codeTries.get(k) || { n: 0, until: 0 };
      if (t.until > Date.now()) return res.status(429).json({ error: "Too many tries. Wait 15 minutes or message us on WhatsApp." });
      if (!c.approved) return res.status(403).json({ error: "We haven’t approved this club yet. Send your WhatsApp request first." });
      if (String(body.code).trim() !== c.code) {
        t.n++; if (t.n >= 5) { t.n = 0; t.until = Date.now() + 15 * 60000; } codeTries.set(k, t);
        return res.status(401).json({ error: "That activation PIN didn’t match. Check the WhatsApp message from us." });
      }
      codeTries.delete(k);
      if (!c.trialEnds) {
        c.trialEnds = Date.now() + TRIAL_DAYS * day;
        c.log.push({ t: Date.now(), txt: "Trial started" });
        const used = await getGlobal("trialPhones", []); const w = digits(c.whatsapp).slice(-8);
        if (!used.includes(w)) { used.push(w); await setGlobal("trialPhones", used); }
        await saveClub(c);
      }
      return res.json({ ok: true, club: publicClub(c) });
    }

    // ---- owner controls
    if (body.owner) {
      if (!owner) return res.status(401).json({ error: "Owner only." });
      const c = await getClub(body.slug);
      if (!c) return res.status(404).json({ error: "Club not found." });
      const now = Date.now(), act = body.owner;
      if (act === "approve") { c.approved = true; c.log.push({ t: now, txt: "Approved on WhatsApp" }); }
      else if (act === "paid") {
        const months = Math.max(1, Math.min(24, Number(body.months) || 1));
        if (PLANS[body.plan]) c.plan = body.plan;
        if (!c.paidUntil && (await foundingLeft()) > 0) c.founding = true;
        c.approved = true; if (!c.trialEnds) c.trialEnds = now;
        c.paidUntil = Math.max(now, c.paidUntil || 0) + months * 30 * day;
        c.log.push({ t: now, txt: `Paid ${months} month${months > 1 ? "s" : ""} · ${PLANS[c.plan].name}` });
      }
      else if (act === "extend") { c.trialEnds = Math.max(now, c.trialEnds || now) + 7 * day; c.approved = true; c.log.push({ t: now, txt: "Trial extended 7 days" }); }
      else if (act === "suspend") { c.suspended = true; c.log.push({ t: now, txt: "Suspended" }); }
      else if (act === "unsuspend") { c.suspended = false; c.log.push({ t: now, txt: "Unsuspended" }); }
      else if (act === "pin") { c.code = String(crypto.randomInt(100000, 1000000)); c.log.push({ t: now, txt: "New activation PIN" }); }
      else if (act === "delete") {
        await setGlobal("club:" + c.slug, null);
        await setGlobal("clubs", (await getGlobal("clubs", [])).filter(s => s !== c.slug));
        return res.json({ ok: true, deleted: c.slug });
      }
      else return res.status(400).json({ error: "Unknown action." });
      await saveClub(c);
      return res.json({ ok: true, club: { ...c, pinHash: undefined, access: access(c) } });
    }
    return res.status(400).json({ error: "Nothing to do." });
  } catch (e) {
    return res.status(e.code || 500).json({ error: e.message || "Something went wrong." });
  }
};

async function foundingLeft() {
  const n = (await listClubs()).filter(c => c.founding).length;
  return Math.max(0, FOUNDING_SPOTS - n);
}
