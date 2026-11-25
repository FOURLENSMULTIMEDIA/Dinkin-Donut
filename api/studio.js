// Organiser access: the Organisers hub, its files and Frame Studio all open with one organiser PIN.
// POST /api/studio?login {pin[, pin2]} -> { token } (or { step: 2 } when the host second PIN is needed)
// GET  /api/studio with x-studio-token (or a signed-in host's x-host-token) -> the studio app code.
// The studio PIN is STUDIO_PIN in Vercel, or the host second PIN (HOST_PIN_2) when STUDIO_PIN is not set.
// One PIN opens the studio only; host sign-in still needs both host PINs.
const crypto = require("crypto");
const auth = require("./_auth");
const APP = require("./_studio_app");
const fs = require("fs"), path = require("path");
// Organiser files: kept in api/_org (never a public static file), served only with a valid organiser token.
const FILES = [
  ["Guides", "brand-guidelines.pdf", "Brand guidelines for organisers", "How the brand works: logo, colours, type, voice, hosting."],
  ["Guides", "committee-code-A5.pdf", "The committee code", "How we look after players and each other. A5."],
  ["Guides", "night-run-sheet-A4.pdf", "Night run sheet", "Before, during and after an Open Play night. A4."],
  ["Guides", "weekly-rota-A4.pdf", "Weekly rota", "Who hosts which night. A4 landscape."],
  ["Guides", "organiser-ids.pdf", "Organiser IDs", "Every committee ID card, ready to print."],
  ["Partners & clients", "partnership-deck.pdf", "Partnership deck", "For sponsors and partners. Fill in the [brackets] first."],
  ["Partners & clients", "events-deck.pdf", "Events deck", "Corporate socials, team cups, parties, clinics."],
  ["Tournament", "draw-sheet-A3.pdf", "Draw sheet", "16-player bracket. A3 landscape."],
  ["Tournament", "scorecards-A4-2up.pdf", "Match scorecards", "Two per A4 sheet. Cut on the dashed line."],
  ["Tournament", "court-schedule-A4.pdf", "Court schedule", "Order of play, 4 courts. A4."],
  ["Tournament", "winner-certificate-A4.pdf", "Winner certificate", "Fill in by hand and sign. A4."],
];

const PIN = String(process.env.STUDIO_PIN || process.env.HOST_PIN_2 || "");
const DAYS = 90;
const KEY = crypto.createHash("sha256").update(["dd-studio", PIN, process.env.HOST_PIN || "", process.env.SESSION_SECRET || ""].join("|")).digest();
const tries = globalThis.__ddStudioTries || (globalThis.__ddStudioTries = new Map());
const sign = d => crypto.createHmac("sha256", KEY).update(d).digest("base64url");
const same = (a, b) => { const x = Buffer.from(String(a || "")), y = Buffer.from(String(b || "")); return x.length > 0 && x.length === y.length && crypto.timingSafeEqual(x, y); };
const ip = req => String(req.headers["x-forwarded-for"] || req.socket?.remoteAddress || "?").split(",")[0].trim();
function token() { const p = Buffer.from(JSON.stringify({ s: 1, exp: Date.now() + DAYS * 864e5, n: crypto.randomBytes(9).toString("base64url") })).toString("base64url"); return p + "." + sign(p); }
function valid(t) { if (!t || typeof t !== "string") return false; const [p, m] = t.split("."); if (!p || !m || !same(m, sign(p))) return false; try { return JSON.parse(Buffer.from(p, "base64url").toString()).exp > Date.now(); } catch { return false; } }

module.exports = async (req, res) => {
  res.setHeader("Cache-Control", "no-store");
  try {
    if (req.method === "POST" && req.query && req.query.login !== undefined) {
      const body = typeof req.body === "string" ? JSON.parse(req.body || "{}") : (req.body || {});
      if (PIN) {
        const t = tries.get(ip(req)) || { n: 0, until: 0 };
        if (t.until > Date.now()) return res.status(429).json({ error: `Too many wrong attempts. Try again in ${Math.ceil((t.until - Date.now()) / 60000)} min.` });
        if (!same(body.pin, PIN)) { t.n++; if (t.n >= 5) { t.n = 0; t.until = Date.now() + 10 * 60000; } tries.set(ip(req), t); return res.status(401).json({ error: "That PIN didn’t work. PINs are case-sensitive." }); }
        tries.delete(ip(req)); return res.status(200).json({ token: token(), days: DAYS });
      }
      const r = auth.login(req, body); // no studio PIN yet: the host PINs open it
      if (r.step === 2) return res.status(200).json({ step: 2 });
      return res.status(200).json({ token: token(), days: DAYS });
    }
    const q = req.query || {};
    if (req.method === "GET" && q.files !== undefined) {
      if (!valid(req.headers["x-studio-token"]) && !auth.isHost(req)) return res.status(401).json({ error: "Organisers only." });
      return res.status(200).json({ files: FILES.map(f => ({ group: f[0], file: f[1], name: f[2], note: f[3] })) });
    }
    if (req.method === "GET" && q.file !== undefined) {
      if (!valid(q.t) && !valid(req.headers["x-studio-token"])) return res.status(401).json({ error: "Organisers only." });
      const f = FILES.find(x => x[1] === q.file); if (!f) return res.status(404).json({ error: "Not found." });
      const buf = fs.readFileSync(path.join(__dirname, "_org", f[1]));
      res.setHeader("Content-Type", "application/pdf"); res.setHeader("Content-Disposition", (q.dl ? "attachment" : "inline") + '; filename="dink-different-' + f[1] + '"'); res.setHeader("Content-Length", buf.length);
      res.statusCode = 200; return res.end(buf);
    }
    if (req.method === "GET") {
      if (!valid(req.headers["x-studio-token"]) && !auth.isHost(req)) return res.status(401).json({ error: "Organisers only." });
      res.setHeader("Content-Type", "text/javascript; charset=utf-8");
      return res.status(200).send(APP);
    }
    return res.status(405).json({ error: "Method not allowed" });
  } catch (e) { return res.status(e.code || 500).json({ error: e.code ? e.message : "Something went wrong." }); }
};
