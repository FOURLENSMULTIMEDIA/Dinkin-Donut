// Tournament API (Dinkin' Donut and every Courtcall club).
//   GET  [?club=slug]                    public bracket (host token → full view with phones)
//   POST {type:"register", ...}          public team sign-up while registration is open
//   POST {type:..., ...} + host token    setup, divisions, teams, generate, score, clearScore, court, reset
const { fresh: base, apply, PUBLIC, publicView, hostView } = require("./_tourney");
const { getDoc, setDoc, withLock, runAsClub } = require("./_store");
const { getClub, access, publicClub } = require("./_clubs");
const { isHost: ddHost, isClubHost } = require("./_auth");

module.exports = async (req, res) => {
  res.setHeader("Cache-Control", "no-store");
  try {
    const slug = req.query && req.query.club;
    let club = null;
    if (slug) {
      club = await getClub(slug);
      if (!club) return res.status(404).json({ error: "Club not found." });
      if (!access(club).ok) return res.status(402).json({ error: "This club isn’t active.", locked: true, club: publicClub(club) });
      if (club.plan === "starter") return res.status(402).json({ error: "Tournaments are part of the Club and Venue plans.", upgrade: true, club: publicClub(club) });
    }
    return await runAsClub(club ? club.slug : "", () => handle(req, res, club));
  } catch (e) {
    return res.status(e.code && Number.isInteger(e.code) ? e.code : 400).json({ error: e.message || "Something went wrong." });
  }
};

async function handle(req, res, club) {
  const fresh = () => Object.assign(base(), { name: club ? `${club.name} Open` : "The Glaze Cup" });
  const host = club ? isClubHost(req, club) : ddHost(req);
  if (req.method === "GET") {
    const S = (await getDoc("tournament", null)) || fresh();
    return res.json({ ...(host ? hostView(S) : publicView(S)), host });
  }
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed." });
  const a = typeof req.body === "string" ? JSON.parse(req.body || "{}") : req.body || {};
  if (!PUBLIC.has(a.type) && !host) return res.status(401).json({ error: "Host sign-in needed.", signin: true });
  const out = await withLock(async () => {
    const S = (await getDoc("tournament", null)) || fresh();
    const r = apply(S, a);
    await setDoc("tournament", r.state);
    return r;
  });
  return res.json({ ...(host ? hostView(out.state) : publicView(out.state)), host, result: out.result });
}
