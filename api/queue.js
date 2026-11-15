const { fresh, apply, PUBLIC } = require("./_engine");
const { load, save, withLock, hasDb } = require("./_store");

const crypto = require("crypto");
// Set HOST_PIN in Vercel → Settings → Environment Variables. Never commit it.
const PIN = process.env.HOST_PIN ? String(process.env.HOST_PIN) : "";
const tries = globalThis.__ddTries || (globalThis.__ddTries = new Map());

// Constant-time PIN check with lockout: 5 wrong PINs from one device = 10 minute cool-down.
function checkPin(req) {
  if (!PIN) { const e = new Error("Host PIN isn't set yet. Add HOST_PIN in Vercel, then redeploy."); e.code = 503; throw e; }
  const ip = String(req.headers["x-forwarded-for"] || req.socket?.remoteAddress || "?").split(",")[0].trim();
  const t = tries.get(ip) || { n: 0, until: 0 };
  if (t.until > Date.now()) { const e = new Error(`Too many wrong PINs. Try again in ${Math.ceil((t.until - Date.now()) / 60000)} min.`); e.code = 429; throw e; }
  const given = Buffer.from(String(req.headers["x-host-pin"] || "")), want = Buffer.from(PIN);
  const ok = given.length === want.length && crypto.timingSafeEqual(given, want);
  if (ok) { tries.delete(ip); return true; }
  t.n++; if (t.n >= 5) { t.n = 0; t.until = Date.now() + 10 * 60000; }
  tries.set(ip, t);
  return false;
}

module.exports = async (req, res) => {
  res.setHeader("Cache-Control", "no-store");
  try {
    if (req.method === "GET") {
      if (req.query && req.query.check !== undefined) {
        return res.status(200).json({ ok: checkPin(req) });
      }
      const S = (await load()) || fresh();
      return res.status(200).json({ ...S, persistent: hasDb() });
    }
    if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

    const a = typeof req.body === "string" ? JSON.parse(req.body || "{}") : req.body || {};
    if (!PUBLIC.has(a.type) && !checkPin(req)) {
      return res.status(401).json({ error: "Wrong host PIN." });
    }
    const out = await withLock(async () => {
      const S = (await load()) || fresh();
      const { state, result } = apply(S, a);
      await save(state);
      return { state, result };
    });
    return res.status(200).json({ ...out.state, persistent: hasDb(), result: out.result });
  } catch (e) {
    return res.status(e.code || 400).json({ error: e.message || "Something went wrong." });
  }
};
