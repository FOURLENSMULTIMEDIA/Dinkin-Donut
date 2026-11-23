const { fresh, apply, PUBLIC, staleReason } = require("./_engine");
const { load, save, withLock, hasDb, loadHall, addHall, clearHall, runAsClub } = require("./_store");
const { getClub, access, publicClub, limitsOf } = require("./_clubs");
const { sendPass, configured } = require("./_wa");
const { login: ddLogin, isHost: ddHost, clubLogin, isClubHost } = require("./_auth");

// What the public pages may see: no payments, no Fawran details, and only players who checked in.
function publicView(S) {
  const players = {};
  for (const p of Object.values(S.players)) if (p.in) { const { pin, phone, pinFails, ...safe } = p; players[p.id] = safe; }
  const { pay, fawran, fee, ...rest } = S;
  return { ...rest, players };
}

// Snapshot of the session for the website's The Honours Board.
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

module.exports = async (req, res) => {
  res.setHeader("Cache-Control", "no-store");
  const slug = req.query && req.query.club;
  if (!slug) return handle(req, res, null);
  const club = await getClub(slug);
  if (!club) return res.status(404).json({ error: "This club link doesn’t exist.", club: null });
  const acc = access(club);
  if (!acc.ok) return res.status(402).json({ error: { pending: "This club isn’t activated yet.", approved: "This club isn’t activated yet.", suspended: "This club is paused." }[acc.phase] || "This club’s trial has ended.", locked: true, club: publicClub(club) });
  return runAsClub(club.slug, () => handle(req, res, club));
};

async function handle(req, res, club) {
  const hostOk = r => club ? isClubHost(r, club) : ddHost(r);
  const login = (r, body) => club ? clubLogin(r, body, club) : ddLogin(r, body);
  const tag = o => club ? { ...o, club: publicClub(club) } : o;
  // Auto-reset: results go to the Hall, the roster is kept, the courts are cleared
  async function sleepCheck() {
    const S0 = (await load()) || fresh();
    if (!staleReason(S0)) return S0;
    return withLock(async () => {
      const S = (await load()) || fresh(), why = staleReason(S);
      if (!why) return S;
      const e = hallEntry(S); if (e) await addHall(e);
      const games = S.games || 0, title = S.nightTitle || "";
      const { state } = apply(S, { type: "reset" });
      state.autoClosed = { at: Date.now(), why, games, title, last: S.updatedAt };
      await save(state); return state;
    });
  }
  try {
    if (req.method === "GET") {
      if (req.query && req.query.check !== undefined) return res.status(200).json({ ok: hostOk(req) });
      if (req.query && req.query.hall !== undefined) return res.status(200).json({ hall: await loadHall() });
      const S = await sleepCheck();
      if (club && !S.__cc) S.courts = S.courts.slice(0, limitsOf(club).courts);
      const host = hostOk(req);
      return res.status(200).json(tag({ ...(host ? { ...S, waAuto: !club && configured() && Boolean(process.env.WA_TEMPLATE), waFree: !club && configured() } : publicView(S)), host, persistent: hasDb() }));
    }
    if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

    const a = typeof req.body === "string" ? JSON.parse(req.body || "{}") : req.body || {};
    if (req.query && req.query.login !== undefined) return res.status(200).json(login(req, a));
    if (a.type === "clearHall") {
      if (!hostOk(req)) return res.status(401).json({ error: "Your host session has ended. Please sign in again.", signin: true });
      await clearHall(); return res.status(200).json({ ok: true, hall: [] });
    }
    const isHost = hostOk(req);
    if (!PUBLIC.has(a.type) && !isHost) {
      return res.status(401).json({ error: "Your host session has ended. Please sign in again.", signin: true });
    }
    if (a.type !== "dismissAuto") await sleepCheck();
    const out = await withLock(async () => {
      const S = (await load()) || fresh();
      if (a.type === "dismissAuto") { delete S.autoClosed; await save(S); return { state: S, result: {} }; }
      if (a.type === "reset" && a.publish !== false) { const e = hallEntry(S); if (e) await addHall(e); }
      if (club && !S.__cc) { const L = limitsOf(club); S.courts = S.courts.slice(0, L.courts); S.__cc = 1; }
      const { state, result } = apply(S, a);
      if (club) {
        const L = limitsOf(club);
        if (state.courts.length > L.courts) throw Object.assign(new Error(`Your ${L.label} plan includes ${L.courts} courts. Upgrade on WhatsApp to add more.`), { code: 402 });
        if (Object.keys(state.players).length > L.players && ["join", "add", "roster", "rosterOne"].includes(a.type)) throw Object.assign(new Error(`Your ${L.label} plan allows ${L.players} players a night. Upgrade on WhatsApp for more.`), { code: 402 });
      }
      await save(state);
      return { state, result };
    });
    let result = out.result || {};
    if (!isHost && result.player) { const { pin, phone, pinFails, ...safe } = result.player; result = { player: safe }; }
    // Club Pass: try to send automatically; otherwise the console opens WhatsApp with the message ready
    if (!club && isHost && (a.type === "pass" || a.type === "newPin") && result.pin) result = { ...result, ...(await sendPass(result)) };
    return res.status(200).json(tag({ ...(isHost ? out.state : publicView(out.state)), host: isHost, persistent: hasDb(), result }));
  } catch (e) {
    return res.status(e.code || 400).json({ error: e.message || "Something went wrong." });
  }
}
