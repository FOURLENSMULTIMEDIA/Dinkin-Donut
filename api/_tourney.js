// Tournament engine: divisions, team registration, single-elimination (with byes) and round-robin pools.
// Pure functions over a state object, like the queue engine.
const uid = S => (S.nextId = (S.nextId || 1) + 1);
const clean = (s, n = 40) => String(s ?? "").replace(/[<>]/g, "").replace(/\s+/g, " ").trim().slice(0, n);
const err = (m, code = 400) => Object.assign(new Error(m), { code });

function fresh() {
  return { name: "Club Tournament", date: "", venue: "", status: "registration", target: 11, finalTarget: 15, winBy: 2, divisions: [], nextId: 1, updatedAt: Date.now(), log: [] };
}

// Standard seeding order for a bracket of size n (1 v n, 2 v n-1 … arranged so top seeds meet last)
function seedOrder(n) {
  let o = [1, 2];
  while (o.length < n) { const m = o.length * 2 + 1; o = o.flatMap(s => [s, m - s]); }
  return o;
}
const roundName = (r, rounds) => { const left = rounds - r; return left === 0 ? "Final" : left === 1 ? "Semifinals" : left === 2 ? "Quarterfinals" : `Round of ${2 ** (left + 1)}`; };

function buildElim(S, d) {
  const teams = d.teams.slice().sort((a, b) => (a.seed || 999) - (b.seed || 999) || a.at - b.at);
  if (teams.length < 2) throw err("Add at least 2 teams first.");
  let size = 2; while (size < teams.length) size *= 2;
  const rounds = Math.log2(size), order = seedOrder(size), byId = [];
  d.matches = [];
  // create all rounds first so we can link winners forward
  for (let r = 1; r <= rounds; r++) for (let i = 0; i < size / 2 ** r; i++) {
    const m = { id: uid(S), round: r, slot: i, a: null, b: null, sa: null, sb: null, winner: null, court: "", label: roundName(r, rounds) };
    d.matches.push(m); (byId[r] = byId[r] || [])[i] = m;
  }
  for (let r = 1; r < rounds; r++) byId[r].forEach((m, i) => { m.next = { m: byId[r + 1][Math.floor(i / 2)].id, side: i % 2 ? "b" : "a" }; });
  byId[1].forEach((m, i) => {
    const sa = teams[order[i * 2] - 1], sb = teams[order[i * 2 + 1] - 1];
    m.a = sa ? sa.id : null; m.b = sb ? sb.id : null;
  });
  // byes: a lone team goes straight through
  byId[1].forEach(m => { if ((m.a && !m.b) || (!m.a && m.b)) { m.winner = m.a || m.b; m.bye = true; advance(d, m); } });
  d.rounds = rounds;
}

function buildRR(S, d) {
  const ids = d.teams.map(t => t.id);
  if (ids.length < 2) throw err("Add at least 2 teams first.");
  const list = ids.length % 2 ? [...ids, null] : ids.slice(), n = list.length;
  d.matches = [];
  for (let r = 0; r < n - 1; r++) {
    for (let i = 0; i < n / 2; i++) {
      const a = list[i], b = list[n - 1 - i];
      if (a && b) d.matches.push({ id: uid(S), round: r + 1, slot: i, a, b, sa: null, sb: null, winner: null, court: "", label: `Round ${r + 1}` });
    }
    list.splice(1, 0, list.pop()); // rotate all but the first
  }
  d.rounds = n - 1;
}

function advance(d, m) {
  if (!m.next) return;
  const nx = d.matches.find(x => x.id === m.next.m);
  if (!nx) return;
  nx[m.next.side] = m.winner;
}
// Clearing a result also clears anything downstream that depended on it (if not yet played)
function unadvance(d, m) {
  if (!m.next) return;
  const nx = d.matches.find(x => x.id === m.next.m);
  if (!nx) return;
  if (nx.winner) throw err("Clear the later match first.");
  nx[m.next.side] = null;
}

function standings(d) {
  const t = {}; d.teams.forEach(x => (t[x.id] = { id: x.id, name: x.name, p: 0, w: 0, l: 0, pf: 0, pa: 0 }));
  d.matches.filter(m => m.winner && !m.bye).forEach(m => {
    const A = t[m.a], B = t[m.b]; if (!A || !B) return;
    A.p++; B.p++; A.pf += m.sa; A.pa += m.sb; B.pf += m.sb; B.pa += m.sa;
    if (m.winner === m.a) { A.w++; B.l++; } else { B.w++; A.l++; }
  });
  return Object.values(t).sort((a, b) => b.w - a.w || (b.pf - b.pa) - (a.pf - a.pa) || b.pf - a.pf || a.name.localeCompare(b.name));
}

function champion(d) {
  if (!d.matches || !d.matches.length) return null;
  if (d.format === "elim") { const f = d.matches.find(m => m.round === d.rounds); return f && f.winner ? f.winner : null; }
  return d.matches.every(m => m.winner) ? standings(d)[0]?.id || null : null;
}

const actions = {
  setup(S, a) {
    if (a.name !== undefined) S.name = clean(a.name, 60) || S.name;
    if (a.date !== undefined) S.date = clean(a.date, 40);
    if (a.venue !== undefined) S.venue = clean(a.venue, 60);
    if (a.target) S.target = [7, 11, 15, 21].includes(Number(a.target)) ? Number(a.target) : 11;
    if (a.winBy) S.winBy = Number(a.winBy) === 1 ? 1 : 2;
    if (a.finalTarget) S.finalTarget = [11, 15, 21].includes(Number(a.finalTarget)) ? Number(a.finalTarget) : 15;
    if (a.status && ["registration", "closed", "live", "done"].includes(a.status)) S.status = a.status;
  },
  addDivision(S, a) {
    const name = clean(a.name, 40); if (!name) throw err("Name the division.");
    if (S.divisions.length >= 8) throw err("8 divisions is the limit.");
    S.divisions.push({ id: uid(S), name, format: a.format === "rr" ? "rr" : "elim", cap: Math.max(2, Math.min(64, Number(a.cap) || 16)), teams: [], matches: [], rounds: 0 });
  },
  removeDivision(S, a) { S.divisions = S.divisions.filter(d => d.id !== Number(a.div)); },
  register(S, a) {
    if (S.status !== "registration") throw err("Registration is closed.");
    const d = S.divisions.find(x => x.id === Number(a.div)); if (!d) throw err("Choose a division.");
    if (d.matches.length) throw err("This division has already started.");
    const name = clean(a.team), p1 = clean(a.p1), p2 = clean(a.p2), phone = clean(a.phone, 24);
    if (!p1 || !p2) throw err("Add both players’ names.");
    if (phone.replace(/\D/g, "").length < 8) throw err("Add a WhatsApp number so we can reach your team.");
    if (d.teams.length >= d.cap) throw err("This division is full.");
    const key = phone.replace(/\D/g, "").slice(-8);
    if (d.teams.some(t => t.key === key)) throw err("This number already registered a team in this division.");
    const t = { id: uid(S), name: name || `${p1.split(" ")[0]} & ${p2.split(" ")[0]}`, p1, p2, phone, key, at: Date.now(), seed: null };
    d.teams.push(t);
    return { team: { id: t.id, name: t.name, div: d.name } };
  },
  addTeam(S, a) {
    const d = S.divisions.find(x => x.id === Number(a.div)); if (!d) throw err("Choose a division.");
    if (d.matches.length) throw err("Reset the bracket before adding teams.");
    const p1 = clean(a.p1), p2 = clean(a.p2); if (!p1 || !p2) throw err("Add both players’ names.");
    const t = { id: uid(S), name: clean(a.team) || `${p1.split(" ")[0]} & ${p2.split(" ")[0]}`, p1, p2, phone: clean(a.phone, 24), key: "h" + S.nextId, at: Date.now(), seed: null };
    d.teams.push(t); return { team: { id: t.id, name: t.name, div: d.name } };
  },
  removeTeam(S, a) { const d = S.divisions.find(x => x.id === Number(a.div)); if (!d) return; if (d.matches.length) throw err("Reset the bracket before removing teams."); d.teams = d.teams.filter(t => t.id !== Number(a.team)); },
  seed(S, a) { const d = S.divisions.find(x => x.id === Number(a.div)); const t = d && d.teams.find(x => x.id === Number(a.team)); if (t) t.seed = Number(a.seed) || null; },
  shuffle(S, a) { const d = S.divisions.find(x => x.id === Number(a.div)); if (!d || d.matches.length) return; for (let i = d.teams.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [d.teams[i], d.teams[j]] = [d.teams[j], d.teams[i]]; } d.teams.forEach(t => (t.seed = null)); },
  generate(S, a) {
    const d = S.divisions.find(x => x.id === Number(a.div)); if (!d) throw err("Division not found.");
    if (d.matches.some(m => m.winner && !m.bye)) throw err("Results are already in. Reset the bracket first.");
    if (d.format === "rr") buildRR(S, d); else buildElim(S, d);
    S.status = "live";
  },
  resetBracket(S, a) { const d = S.divisions.find(x => x.id === Number(a.div)); if (d) { d.matches = []; d.rounds = 0; } },
  score(S, a) {
    const d = S.divisions.find(x => x.id === Number(a.div)); const m = d && d.matches.find(x => x.id === Number(a.match));
    if (!m) throw err("Match not found."); if (!m.a || !m.b) throw err("Both teams aren’t set yet.");
    const sa = Math.round(Number(a.sa)), sb = Math.round(Number(a.sb));
    if (!Number.isFinite(sa) || !Number.isFinite(sb) || sa < 0 || sb < 0 || sa === sb) throw err("Enter a final score with a winner.");
    const hi = Math.max(sa, sb), lo = Math.min(sa, sb);
    const isFinal = d.format === "elim" && m.round === d.rounds, goal = isFinal ? (S.finalTarget || 15) : S.target;
    if (!a.force && (hi < goal || hi - lo < S.winBy)) throw err(`${isFinal ? "The final goes" : "Games go"} to ${goal}, win by ${S.winBy}. Check the score.`);
    const nextWinner = sa > sb ? m.a : m.b;
    if (m.winner && m.winner !== nextWinner) unadvance(d, m);
    m.sa = sa; m.sb = sb; m.winner = nextWinner; m.at = Date.now();
    advance(d, m);
    const ch = champion(d);
    if (ch && S.divisions.every(x => champion(x))) S.status = "done";
    return { champion: ch ? d.teams.find(t => t.id === ch)?.name : null };
  },
  clearScore(S, a) {
    const d = S.divisions.find(x => x.id === Number(a.div)); const m = d && d.matches.find(x => x.id === Number(a.match));
    if (!m || m.bye) return; unadvance(d, m); m.sa = m.sb = m.winner = null; if (S.status === "done") S.status = "live";
  },
  court(S, a) { const d = S.divisions.find(x => x.id === Number(a.div)); const m = d && d.matches.find(x => x.id === Number(a.match)); if (m) m.court = clean(a.court, 12); },
  reset(S) { const n = fresh(); n.name = S.name; return n; },
};
const PUBLIC = new Set(["register"]);

function apply(S, a) {
  const f = actions[a.type]; if (!f) throw err("Unknown action.");
  const out = f(S, a);
  const state = out && out.divisions ? out : S;
  state.updatedAt = Date.now();
  return { state, result: out && !out.divisions ? out : {} };
}

// What everyone may see: no phone numbers.
function publicView(S) {
  return { ...S, divisions: S.divisions.map(d => ({ ...d, teams: d.teams.map(({ phone, key, ...t }) => t), standings: standings(d), champion: champion(d) })) };
}
function hostView(S) { return { ...S, divisions: S.divisions.map(d => ({ ...d, standings: standings(d), champion: champion(d) })) }; }

module.exports = { fresh, apply, PUBLIC, publicView, hostView, seedOrder };
