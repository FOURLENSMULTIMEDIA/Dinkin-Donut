// Glaze Card members.
//   POST from Google Forms (Apps Script) with header x-members-secret: upsert one or many sign-ups.
//   GET / POST from the host console with a signed host session (x-host-token): list, issue cards, stamps, notes.
const crypto = require("crypto");
const { getDoc, setDoc, withLock, hasDb } = require("./_store");
const { normLevel } = require("./_match");
const { isHost } = require("./_auth");

const SECRET = process.env.MEMBERS_SECRET ? String(process.env.MEMBERS_SECRET) : "";
const STAMPS_FOR_FREE = 6;

const same = (a, b) => { const x = Buffer.from(String(a || "")), y = Buffer.from(String(b || "")); return x.length > 0 && x.length === y.length && crypto.timingSafeEqual(x, y); };
const clean = (s, n = 80) => String(s ?? "").replace(/[<>]/g, "").replace(/\s+/g, " ").trim().slice(0, n);
const phoneKey = p => { const d = String(p || "").replace(/\D/g, ""); return d.length >= 8 ? d.slice(-8) : ""; };

// Pull the fields we care about out of a form response, whatever the exact question wording.
function fromAnswers(ans) {
  const pick = re => { for (const [q, v] of Object.entries(ans || {})) if (re.test(q)) return Array.isArray(v) ? v.join(", ") : v; return ""; };
  return {
    name: clean(pick(/full name|^name|your name|pangalan/i), 40),
    phone: clean(pick(/whats ?app|phone|mobile|number|contact/i), 30),
    email: clean(pick(/e-?mail/i), 80),
    instagram: clean(pick(/insta/i), 40),
    level: normLevel(pick(/level|skill|experience|dupr rating/i)),
    levelRaw: clean(pick(/level|skill|experience/i), 60),
    plays: clean(pick(/which session|play|games/i), 60),
    dupr: clean(pick(/dupr id/i), 30),
  };
}

function upsert(db, raw) {
  const f = raw.answers ? fromAnswers(raw.answers) : raw;
  if (!f.name) return null;
  const key = phoneKey(f.phone) || "n:" + f.name.toLowerCase();
  const id = raw.responseId || key;
  const existing = Object.values(db.members).find(m => m.id === id || (key && m.key === key));
  const m = existing || { id, key, created: raw.timestamp ? Date.parse(raw.timestamp) || Date.now() : Date.now(), issued: false, no: null, stamps: 0, redeemed: 0, history: [] };
  Object.assign(m, { name: f.name, phone: f.phone || m.phone, email: f.email || m.email, instagram: f.instagram || m.instagram, level: f.level || m.level || null, levelRaw: f.levelRaw || m.levelRaw, plays: f.plays || m.plays, dupr: f.dupr || m.dupr });
  db.members[m.id] = m;
  return m;
}

const ACTIONS = {
  issue: (db, a) => { const m = db.members[a.id]; if (!m) throw new Error("Member not found."); if (!m.no) m.no = ++db.lastNo; m.issued = true; m.issuedAt = Date.now(); },
  unissue: (db, a) => { const m = db.members[a.id]; if (m) { m.issued = false; } },
  stamp: (db, a) => { const m = db.members[a.id]; if (!m) throw new Error("Member not found."); if (m.stamps >= STAMPS_FOR_FREE) throw new Error("Card is full. Redeem the free session first."); m.stamps++; m.history.unshift({ t: Date.now(), e: "stamp" }); },
  unstamp: (db, a) => { const m = db.members[a.id]; if (m && m.stamps > 0) { m.stamps--; m.history.unshift({ t: Date.now(), e: "unstamp" }); } },
  redeem: (db, a) => { const m = db.members[a.id]; if (!m) throw new Error("Member not found."); if (m.stamps < STAMPS_FOR_FREE) throw new Error("Not enough stamps yet."); m.stamps = 0; m.redeemed++; m.history.unshift({ t: Date.now(), e: "free session" }); },
  setNo: (db, a) => { const m = db.members[a.id]; if (!m) return; const n = parseInt(a.no, 10); if (n > 0) { m.no = n; db.lastNo = Math.max(db.lastNo, n); } },
  note: (db, a) => { const m = db.members[a.id]; if (m) m.note = clean(a.note, 140); },
  remove: (db, a) => { delete db.members[a.id]; },
  add: (db, a) => upsert(db, { name: clean(a.name, 40), phone: clean(a.phone, 30), level: normLevel(a.level) }),
};

module.exports = async (req, res) => {
  res.setHeader("Cache-Control", "no-store");
  try {
    const body = typeof req.body === "string" ? JSON.parse(req.body || "{}") : req.body || {};
    const fromForm = SECRET && same(req.headers["x-members-secret"], SECRET);
    const host = isHost(req);
    if (!fromForm && !host) return res.status(401).json({ error: "Not allowed." });

    if (req.method === "GET") {
      const db = await getDoc("members", { members: {}, lastNo: 0 });
      return res.status(200).json({ ...db, stampsForFree: STAMPS_FOR_FREE, persistent: hasDb() });
    }
    if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

    const out = await withLock(async () => {
      const db = await getDoc("members", { members: {}, lastNo: 0 });
      let result = null;
      if (fromForm && !body.type) {
        const list = Array.isArray(body.responses) ? body.responses : [body];
        result = { saved: list.map(r => upsert(db, r)).filter(Boolean).length };
      } else if (host) {
        const fn = ACTIONS[body.type]; if (!fn) throw new Error("Unknown action.");
        result = fn(db, body) || null;
      } else throw new Error("Not allowed.");
      await setDoc("members", db);
      return { db, result };
    });
    return res.status(200).json(fromForm ? { ok: true, ...out.result } : { ...out.db, stampsForFree: STAMPS_FOR_FREE, result: out.result });
  } catch (e) {
    return res.status(e.code || 400).json({ error: e.message || "Something went wrong." });
  }
};
