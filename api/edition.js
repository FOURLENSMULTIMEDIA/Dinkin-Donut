// "The 20": the numbered 1-of-1 edition. Only 20 shirts are ever made.
//   GET                          { cap, taken, left }
//   POST { claim:{ name, ref, product, way } }   → { no }  holds the next free number for 48 h (same ref keeps its number)
//   Owner (Dinkin' Donut host token): GET ?list, POST { paid:no } | { release:no }
const { getDoc, setDoc, withLock } = require("./_store");
const { isHost } = require("./_auth");

const CAP = 20, HOLD = 48 * 3600e3;
const clean = (s, n = 40) => String(s ?? "").replace(/[<>]/g, "").replace(/\s+/g, " ").trim().slice(0, n);
// Unpaid holds expire so numbers go back on sale
const live = list => list.filter(e => e.paid || Date.now() - e.at < HOLD);

module.exports = async (req, res) => {
  res.setHeader("Cache-Control", "no-store");
  try {
    const owner = isHost(req), q = req.query || {};
    if (req.method === "GET") {
      const L = live((await getDoc("edition", { list: [] })).list);
      if (q.list !== undefined) { if (!owner) return res.status(401).json({ error: "Owner only." }); return res.json({ cap: CAP, list: L.sort((a, b) => a.no - b.no) }); }
      return res.json({ cap: CAP, taken: L.length, left: Math.max(0, CAP - L.length) });
    }
    if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed." });
    const b = typeof req.body === "string" ? JSON.parse(req.body || "{}") : req.body || {};

    if (b.paid !== undefined || b.release !== undefined) {
      if (!owner) return res.status(401).json({ error: "Owner only." });
      const out = await withLock(async () => {
        const d = await getDoc("edition", { list: [] }); d.list = live(d.list);
        if (b.release !== undefined) d.list = d.list.filter(e => e.no !== Number(b.release));
        else { const e = d.list.find(x => x.no === Number(b.paid)); if (e) e.paid = Date.now(); }
        await setDoc("edition", d); return d.list;
      });
      return res.json({ ok: true, list: out });
    }

    if (b.claim) {
      const c = b.claim, name = clean(c.name, 12).toUpperCase(), ref = clean(c.ref, 24);
      if (!name) return res.status(400).json({ error: "The 20 needs a name on the back." });
      if (!ref) return res.status(400).json({ error: "Missing order reference." });
      const out = await withLock(async () => {
        const d = await getDoc("edition", { list: [] }); d.list = live(d.list);
        const mine = d.list.find(e => e.ref === ref && e.name === name);
        if (mine) return { no: mine.no };
        if (d.list.length >= CAP) return { soldOut: true };
        const used = new Set(d.list.map(e => e.no)); let no = 1; while (used.has(no)) no++;
        d.list.push({ no, name, ref, product: clean(c.product, 20), way: clean(c.way, 20), at: Date.now(), paid: 0 });
        await setDoc("edition", d); return { no };
      });
      if (out.soldOut) return res.status(409).json({ error: "All 20 have been claimed. The 20 is sold out." });
      return res.json({ no: out.no, cap: CAP });
    }
    return res.status(400).json({ error: "Nothing to do." });
  } catch (e) {
    return res.status(500).json({ error: "Something went wrong. Please try again." });
  }
};
