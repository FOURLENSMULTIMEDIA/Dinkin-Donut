// The First Serve: pre-registration for the very first open play.
// Each Dinker gets a numbered Founding spot and a free exclusive sticker, collected at check-in.
//   GET                      public: spots taken / left (no names)
//   GET  ?pass=CODE          one pass (for the sticker page)
//   POST {name,phone,level}  reserve a spot (same phone returns the same spot)
//   Host (x-host-token): GET ?list, POST {claim:CODE,on:bool}, POST {remove:CODE}
const crypto = require("crypto");
const { getDoc, setDoc, withLock } = require("./_store");
const { isHost } = require("./_auth");

const CAP = 48;
const DOC = "founders";
const clean = (s, n = 40) => String(s ?? "").replace(/[<>]/g, "").replace(/\s+/g, " ").trim().slice(0, n);
const phoneKey = p => { const d = String(p || "").replace(/\D/g, ""); return d.length >= 8 ? d.slice(-8) : ""; };
const LEVELS = ["new", "beginner", "intermediate", "advanced"];
const pub = e => ({ no: e.no, name: e.name, level: e.level, code: e.code, at: e.at, wait: !!e.wait });

module.exports = async (req, res) => {
  try {
    const q = req.query || {};
    const body = typeof req.body === "string" ? JSON.parse(req.body || "{}") : req.body || {};
    const host = isHost(req);
    const db = await getDoc(DOC, { list: [] });
    const spots = db.list.filter(e => !e.wait);
    const stats = { cap: CAP, taken: Math.min(spots.length, CAP), left: Math.max(0, CAP - spots.length), waitlist: db.list.length - spots.length };

    if (req.method === "GET") {
      if (q.list !== undefined) {
        if (!host) return res.status(401).json({ error: "Host only." });
        return res.json({ ...stats, list: db.list });
      }
      if (q.pass) {
        const e = db.list.find(x => x.code === String(q.pass).toUpperCase());
        return e ? res.json({ ...stats, pass: pub(e) }) : res.status(404).json({ error: "Pass not found." });
      }
      return res.json(stats);
    }
    if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed." });

    if (body.claim || body.remove) {
      if (!host) return res.status(401).json({ error: "Host only." });
      return res.json(await withLock(async () => {
        const d = await getDoc(DOC, { list: [] });
        if (body.remove) d.list = d.list.filter(x => x.code !== body.remove);
        else { const e = d.list.find(x => x.code === body.claim); if (e) e.claimed = body.on !== false ? Date.now() : 0; }
        await setDoc(DOC, d);
        return { ok: true, list: d.list };
      }));
    }

    const name = clean(body.name), phone = clean(body.phone, 30), key = phoneKey(phone);
    const level = LEVELS.includes(body.level) ? body.level : "new";
    if (name.length < 2) return res.status(400).json({ error: "Please add your name." });
    if (!key) return res.status(400).json({ error: "Please add a WhatsApp number (8 digits or more)." });

    const out = await withLock(async () => {
      const d = await getDoc(DOC, { list: [] });
      const had = d.list.find(x => x.key === key);
      if (had) return { again: true, e: had };
      const taken = d.list.filter(x => !x.wait).length;
      const wait = taken >= CAP;
      const e = {
        no: wait ? 0 : taken + 1, name, phone, key, level, wait,
        code: "FS-" + crypto.randomBytes(3).toString("hex").toUpperCase(),
        at: Date.now(), claimed: 0,
      };
      d.list.push(e);
      await setDoc(DOC, d);
      return { e };
    });
    const now = (await getDoc(DOC, { list: [] })).list.filter(x => !x.wait).length;
    return res.json({ ok: true, again: !!out.again, pass: pub(out.e), cap: CAP, taken: Math.min(now, CAP), left: Math.max(0, CAP - now) });
  } catch (err) {
    return res.status(500).json({ error: String(err.message || err) });
  }
};
