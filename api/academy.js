// Soft Hands Academy: paid coaching. Members unlock every lesson; the public sees a short preview.
// Access: an Academy key (x-academy-key) from a card subscription or issued by the owner,
// or the Dinkin' Donut host sign-in (x-host-token) for you and your team.
//   GET  ?lessons                       list + access state
//   GET  ?lesson=id                     full lesson for members, preview of the first lesson for everyone else
//   POST { checkout:{ interval } }      Stripe Checkout (subscription) → { url }
//   POST { claim: sessionId }           after paying → { key }
//   Owner: GET ?keys · POST { grant:{ name, days } } · POST { revoke: key }
const crypto = require("crypto");
const { LESSONS, FREE, TEASER, meta, HOME, SESSIONS, TIPS, PLANS, RULES, RULES_QUIZ, RULEBOOK_URL } = require("./_lessons");
const { getDoc, setDoc, withLock } = require("./_store");
const { isHost } = require("./_auth");
const { stripe, enabled, taxOn } = require("./_stripe");

const TRIAL_DAYS = 7, FOUNDER = "ACADEMY_FOUNDER", DAY = 864e5, RECHECK = 12 * 3600e3, GRACE = 3 * DAY;
const newKey = () => "SHA-" + crypto.randomBytes(2).toString("hex").toUpperCase() + "-" + crypto.randomBytes(2).toString("hex").toUpperCase();
const clean = (s, n = 40) => String(s ?? "").replace(/[<>]/g, "").trim().slice(0, n);
const originOf = req => { const h = req.headers["x-forwarded-host"] || req.headers.host || "dinkindonut.asia"; return `${/^localhost|^127\./.test(h) ? "http" : "https"}://${h}`; };

// Returns { ok, who } for the request
async function access(req) {
  if (isHost(req)) return { ok: true, who: "team" };
  const key = String(req.headers["x-academy-key"] || "").trim().toUpperCase();
  if (!/^SHA-[0-9A-F]{4}-[0-9A-F]{4}$/.test(key)) return { ok: false };
  const db = await getDoc("academyKeys", {}), k = db[key];
  if (!k || k.revoked) return { ok: false };
  const now = Date.now();
  if (k.kind === "stripe" && (!k.checked || now - k.checked > RECHECK || k.until < now) && enabled()) {
    try {
      const sub = await stripe().subscriptions.retrieve(k.sub);
      const end = (sub.current_period_end || sub.items?.data?.[0]?.current_period_end || 0) * 1000;
      k.until = ["active", "trialing", "past_due"].includes(sub.status) ? end + GRACE : Math.min(k.until || 0, now);
      k.checked = now; db[key] = k; await setDoc("academyKeys", db);
    } catch (e) { /* keep the cached state if Stripe is unreachable */ }
  }
  return k.until > now ? { ok: true, who: "member", until: k.until, name: k.name || "" } : { ok: false, expired: true };
}

// Founding Member spots left (25% off for life, first 50): read from the Stripe coupon, cached 5 min
let fc = { at: 0, left: null };
async function founderLeft() {
  if (!enabled()) return null;
  if (Date.now() - fc.at < 300e3) return fc.left;
  try { const c = await stripe().coupons.retrieve(FOUNDER); fc = { at: Date.now(), left: c.valid ? Math.max(0, (c.max_redemptions || 50) - (c.times_redeemed || 0)) : 0 }; } catch { fc = { at: Date.now(), left: null }; }
  return fc.left;
}
const strip = (l, team) => { const { notes, ...rest } = l; return team ? l : rest; };

module.exports = async (req, res) => {
  res.setHeader("Cache-Control", "no-store");
  try {
    const q = req.query || {};
    if (req.method === "GET") {
      const a = await access(req);
      if (q.keys !== undefined) {
        if (!isHost(req)) return res.status(401).json({ error: "Owner only." });
        const db = await getDoc("academyKeys", {});
        return res.json({ keys: Object.entries(db).map(([key, v]) => ({ key, ...v, active: !v.revoked && v.until > Date.now() })).sort((x, y) => y.created - x.created) });
      }
      if (q.lesson) {
        const L = LESSONS.find(l => l.id === q.lesson);
        if (!L) return res.status(404).json({ error: "Lesson not found." });
        if (a.ok) return res.json({ lesson: strip(L, a.who === "team"), access: a });
        if (FREE.includes(L.id)) return res.json({ lesson: { ...strip(L, false), free: true }, access: a });
        return res.json({ lesson: { ...meta(L), preview: true, scenes: L.scenes.slice(0, TEASER), keys: L.keys.slice(0, 1) }, access: a });
      }
      if (q.home !== undefined) return res.json(a.ok ? { home: HOME, sessions: SESSIONS, plans: PLANS, access: a } : { home: HOME.slice(0, 2), locked: HOME.length - 2, sessions: SESSIONS.map(x => ({ ...x, locked: true })), plans: PLANS.map(p => ({ id: p.id, title: p.title, for: p.for, weeks: p.weeks.map(w => ({ w: w.w, focus: w.focus })), locked: true })), access: a });
      if (q.rules !== undefined) return res.json({ rules: RULES, quiz: RULES_QUIZ, official: RULEBOOK_URL, access: a }); // free for everyone
      if (q.tips !== undefined) return res.json(a.ok ? { tips: TIPS, access: a } : { tips: TIPS.slice(0, 6), locked: TIPS.length - 6, access: a });
      return res.json({ lessons: LESSONS.map(meta), access: a, card: enabled(), trialDays: TRIAL_DAYS, founderLeft: await founderLeft(), counts: { lessons: LESSONS.length, home: HOME.length, tips: TIPS.length } });
    }
    if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed." });
    const b = typeof req.body === "string" ? JSON.parse(req.body || "{}") : req.body || {};

    if (b.checkout) {
      const interval = b.checkout.interval === "year" ? "year" : "month";
      const price = (await stripe().prices.list({ lookup_keys: [`academy_${interval}`], limit: 1 })).data[0];
      if (!price) return res.status(500).json({ error: "Academy plans aren’t set up in Stripe yet." });
      const s = await stripe().checkout.sessions.create({
        mode: "subscription", line_items: [{ price: price.id, quantity: 1 }],
        metadata: { product: "academy" }, subscription_data: { metadata: { product: "academy" }, trial_period_days: TRIAL_DAYS },
        billing_address_collection: "auto", automatic_tax: { enabled: taxOn() },
        ...((await founderLeft()) > 0 ? { discounts: [{ coupon: FOUNDER }] } : { allow_promotion_codes: true }),
        success_url: `${originOf(req)}/academy?paid={CHECKOUT_SESSION_ID}`, cancel_url: `${originOf(req)}/academy`,
      });
      return res.json({ url: s.url });
    }

    if (b.claim) {
      const s = await stripe().checkout.sessions.retrieve(String(b.claim));
      if (s.metadata?.product !== "academy" || s.status !== "complete" || !s.subscription) return res.status(402).json({ error: "We couldn’t confirm that payment yet. Refresh in a moment." });
      const out = await withLock(async () => {
        const db = await getDoc("academyKeys", {});
        const have = Object.entries(db).find(([, v]) => v.session === s.id);
        if (have) return have[0];
        const sub = await stripe().subscriptions.retrieve(s.subscription);
        const end = (sub.current_period_end || sub.items?.data?.[0]?.current_period_end || 0) * 1000;
        let key = newKey(); while (db[key]) key = newKey();
        db[key] = { kind: "stripe", session: s.id, sub: sub.id, customer: s.customer, email: s.customer_details?.email || "", name: s.customer_details?.name || "", created: Date.now(), until: end + GRACE, checked: Date.now() };
        await setDoc("academyKeys", db); return key;
      });
      return res.json({ key: out });
    }

    if (b.grant || b.revoke) {
      if (!isHost(req)) return res.status(401).json({ error: "Owner only." });
      const out = await withLock(async () => {
        const db = await getDoc("academyKeys", {});
        if (b.revoke) { if (db[b.revoke]) db[b.revoke].revoked = true; await setDoc("academyKeys", db); return { ok: true }; }
        const days = Math.max(1, Math.min(730, Number(b.grant.days) || 30));
        let key = newKey(); while (db[key]) key = newKey();
        db[key] = { kind: "manual", name: clean(b.grant.name), created: Date.now(), until: Date.now() + days * DAY };
        await setDoc("academyKeys", db); return { key, days };
      });
      return res.json(out);
    }
    return res.status(400).json({ error: "Nothing to do." });
  } catch (e) {
    return res.status(e.code && Number.isInteger(e.code) ? e.code : 500).json({ error: e.message || "Something went wrong." });
  }
};
