// Host authentication.
// Sign-in needs two PINs: HOST_PIN, then HOST_PIN_2 (if set). On success the server issues a signed
// session token (HMAC-SHA256). Devices keep only the token, never the PINs. The signing key is derived
// from both PINs, so changing either PIN in Vercel signs every device out at once.
const crypto = require("crypto");

const PIN1 = process.env.HOST_PIN ? String(process.env.HOST_PIN) : "";
const PIN2 = process.env.HOST_PIN_2 ? String(process.env.HOST_PIN_2) : "";
const SESSION_DAYS = 180;
const KEY = crypto.createHash("sha256").update(["dinkin-donut-host", PIN1, PIN2, process.env.SESSION_SECRET || ""].join("|")).digest();
const tries = globalThis.__ddTries || (globalThis.__ddTries = new Map());

const b64 = buf => Buffer.from(buf).toString("base64url");
const sign = data => crypto.createHmac("sha256", KEY).update(data).digest("base64url");
const same = (a, b) => { const x = Buffer.from(String(a || "")), y = Buffer.from(String(b || "")); return x.length > 0 && x.length === y.length && crypto.timingSafeEqual(x, y); };
const err = (msg, code) => Object.assign(new Error(msg), { code });

function ipOf(req) { return String(req.headers["x-forwarded-for"] || req.socket?.remoteAddress || "?").split(",")[0].trim(); }

function guard(req) {
  const t = tries.get(ipOf(req)) || { n: 0, until: 0 };
  if (t.until > Date.now()) throw err(`Too many wrong attempts. Try again in ${Math.ceil((t.until - Date.now()) / 60000)} min.`, 429);
  return t;
}
function fail(req, t) { t.n++; if (t.n >= 5) { t.n = 0; t.until = Date.now() + 10 * 60000; } tries.set(ipOf(req), t); }

function makeToken() {
  const payload = b64(JSON.stringify({ v: 1, exp: Date.now() + SESSION_DAYS * 864e5, n: crypto.randomBytes(9).toString("base64url") }));
  return payload + "." + sign(payload);
}

function verifyToken(token) {
  if (!PIN1 || !token || typeof token !== "string") return false;
  const [payload, mac] = token.split(".");
  if (!payload || !mac || !same(mac, sign(payload))) return false;
  try { return JSON.parse(Buffer.from(payload, "base64url").toString()).exp > Date.now(); } catch { return false; }
}

// Step-by-step sign-in. Returns { token } on success or { step: 2 } when the second PIN is needed.
function login(req, body) {
  if (!PIN1) throw err("Host PIN isn't set yet. Add HOST_PIN in Vercel, then redeploy.", 503);
  const t = guard(req);
  if (!same(body.pin, PIN1)) { fail(req, t); throw err("That host PIN didn’t work. PINs are case-sensitive.", 401); }
  if (PIN2) {
    if (!body.pin2) return { step: 2 };
    if (!same(body.pin2, PIN2)) { fail(req, t); throw err("That second PIN didn’t work.", 401); }
  }
  tries.delete(ipOf(req));
  return { token: makeToken(), days: SESSION_DAYS, twoStep: Boolean(PIN2) };
}

const isHost = req => verifyToken(req.headers["x-host-token"]);

module.exports = { login, isHost, verifyToken };
