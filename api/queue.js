const { fresh, apply, PUBLIC } = require("./_engine");
const { load, save, withLock, hasDb, loadHall, addHall } = require("./_store");
const { sendPass } = require("./_wa");

// What the public pages may see: no payments, no Fawran details, and only players who checked in.
function publicView(S) {
  const players = {};
  for (const p of Object.values(S.players)) if (p.in) { const { pin, phone, pinFails, ...safe } = p; players[p.id] = safe; }
  const { pay, fawran, fee, ...rest } = S;
  return { ...rest, players };
}

// Snapshot of the session for the website's Hall of Glaze.
function hallEntry(S) {
  const played = Object.values(S.players).filter(p => p.w + p.l > 0)
    .sort((a, b) => b.w - a.w || (b.w / (b.w + b.l)) - (a.w / (a.w + a.l)) || (b.pf - b.pa) - (a.pf - a.pa) || a.name.localeCompare(b.name));
  if (!played.length) return null;
  return {
    t: Date.now(), title: S.nightTitle, games: S.games, players: Object.values(S.players).filter(p => p.in).length,
    top: played.slice(0, 3).map(p => ({ name: p.name, w: p.w, l: p.l, diff: p.pf - p.pa, level: p.level || null })),
  };
}

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
      if (req.query && req.query.hall !== undefined) return res.status(200).json({ hall: await loadHall() });
      const S = (await load()) || fresh();
      const host = req.headers["x-host-pin"] ? checkPin(req) : false;
      return res.status(200).json({ ...(host ? S : publicView(S)), host, persistent: hasDb() });
    }
    if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

    const a = typeof req.body === "string" ? JSON.parse(req.body || "{}") : req.body || {};
    const isHost = req.headers["x-host-pin"] ? checkPin(req) : false;
    if (!PUBLIC.has(a.type) && !isHost) {
      return res.status(401).json({ error: "Wrong host PIN." });
    }
    const out = await withLock(async () => {
      const S = (await load()) || fresh();
      if (a.type === "reset" && a.publish !== false) { const e = hallEntry(S); if (e) await addHall(e); }
      const { state, result } = apply(S, a);
      await save(state);
      return { state, result };
    });
    let result = out.result || {};
    if (!isHost && result.player) { const { pin, phone, pinFails, ...safe } = result.player; result = { player: safe }; }
    // Glaze Pass: try to send automatically; otherwise the console opens WhatsApp with the message ready
    if (isHost && (a.type === "pass" || a.type === "newPin") && result.pin) result = { ...result, ...(await sendPass(result)) };
    return res.status(200).json({ ...(isHost ? out.state : publicView(out.state)), host: isHost, persistent: hasDb(), result });
  } catch (e) {
    return res.status(e.code || 400).json({ error: e.message || "Something went wrong." });
  }
};
