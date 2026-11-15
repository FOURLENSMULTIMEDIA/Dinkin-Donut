// Queue rules engine. Pure functions on a plain state object, shared by every API call.
const MAX_LOG = 150;

function fresh() {
  return {
    v: 0, updatedAt: Date.now(), nightTitle: "Open Play Night",
    format: 2, rotation: "winstay", maxWins: 2,
    players: {}, queue: [], bench: [], games: 0, nextId: 1, durSum: 0, durN: 0,
    courts: [1, 2, 3].map(id => ({ id, teams: null, start: null, stayers: null, streak: 0 })),
    log: [{ t: Date.now(), txt: "Night created. Paddles up!" }],
  };
}

const clean = s => String(s || "").replace(/[<>]/g, "").replace(/\s+/g, " ").trim().slice(0, 24);
const log = (S, txt) => { S.log.unshift({ t: Date.now(), txt }); S.log.length = Math.min(S.log.length, MAX_LOG); };
const names = (S, ids) => ids.map(id => S.players[id]?.name || "?").join(" & ");
const busy = S => new Set(S.courts.flatMap(c => [...(c.teams ? c.teams.flat() : []), ...(c.stayers || [])]));

function findByName(S, name) {
  return Object.values(S.players).find(p => p.name.toLowerCase() === name.toLowerCase());
}

const LEVELS = ["new", "social", "competitive"];
function addPlayer(S, rawName, level) {
  const name = clean(rawName);
  if (name.length < 2) throw new Error("Please enter a name with at least 2 letters.");
  let p = findByName(S, name);
  if (p) {
    if (S.queue.includes(p.id) || busy(S).has(p.id)) return p; // already in, just return them
    S.bench = S.bench.filter(id => id !== p.id);
  } else {
    if (Object.keys(S.players).length >= 300) throw new Error("Tonight's list is full.");
    const id = "p" + S.nextId++;
    p = S.players[id] = { id, name, w: 0, l: 0, streak: 0, pf: 0, pa: 0, joined: Date.now() };
  }
  if (LEVELS.includes(level)) p.level = level;
  S.queue.push(p.id);
  log(S, `${p.name} checked in`);
  return p;
}

function fillCourt(S, c) {
  if (c.teams) return;
  const need = S.format * 2, stay = c.stayers || [];
  const take = need - stay.length;
  if (S.queue.length < take) return;
  const incoming = S.queue.splice(0, take);
  c.teams = stay.length ? [stay, incoming] : [incoming.slice(0, S.format), incoming.slice(S.format)];
  c.stayers = null; c.start = Date.now();
  log(S, `Court ${c.id}: ${names(S, c.teams[0])} vs ${names(S, c.teams[1])}`);
}

function court(S, id) {
  const c = S.courts.find(c => c.id === Number(id));
  if (!c) throw new Error("That court no longer exists.");
  return c;
}

const actions = {
  // public
  join: (S, a) => ({ player: addPlayer(S, a.name, a.level) }),
  leave: (S, a) => {
    const p = S.players[a.id]; if (!p) return;
    S.queue = S.queue.filter(id => id !== p.id);
    if (!S.bench.includes(p.id)) S.bench.push(p.id);
    log(S, `${p.name} is taking a break`);
  },
  // host
  add: (S, a) => ({ player: addPlayer(S, a.name, a.level) }),
  win: (S, a) => {
    const c = court(S, a.court); if (!c.teams) throw new Error("No game on that court.");
    const wi = Number(a.team) ? 1 : 0, W = c.teams[wi], L = c.teams[1 - wi];
    const ws = Number(a.ws) || 0, ls = Number(a.ls) || 0;
    W.forEach(id => { const p = S.players[id]; p.w++; p.streak = p.streak > 0 ? p.streak + 1 : 1; p.pf += ws; p.pa += ls; });
    L.forEach(id => { const p = S.players[id]; p.l++; p.streak = p.streak < 0 ? p.streak - 1 : -1; p.pf += ls; p.pa += ws; });
    S.games++;
    const mins = Math.max(1, Math.round((Date.now() - c.start) / 60000));
    if (mins <= 45) { S.durSum = (S.durSum || 0) + mins; S.durN = (S.durN || 0) + 1; }
    log(S, `Court ${c.id}: ${names(S, W)} beat ${names(S, L)}${ws ? ` ${ws}–${ls}` : ""} (${mins} min)`);
    const teamStreak = c.lastWinners && c.lastWinners.join() === [...W].sort().join() ? c.streak + 1 : 1;
    if (S.rotation === "winstay" && teamStreak < S.maxWins) {
      c.streak = teamStreak; c.lastWinners = [...W].sort(); c.stayers = W.slice(); S.queue.push(...L);
    } else {
      if (S.rotation === "winstay") log(S, `${names(S, W)} hit ${S.maxWins} wins and rotate off. Sweet run!`);
      c.streak = 0; c.lastWinners = null; c.stayers = null; S.queue.push(...W, ...L);
    }
    c.teams = null; c.start = null;
    fillCourt(S, c);
  },
  fill: (S, a) => fillCourt(S, court(S, a.court)),
  fillAll: S => S.courts.forEach(c => fillCourt(S, c)),
  cancel: (S, a) => {
    const c = court(S, a.court);
    const back = [...(c.teams ? c.teams.flat() : []), ...(c.stayers || [])];
    S.queue.unshift(...back);
    Object.assign(c, { teams: null, stayers: null, start: null, streak: 0, lastWinners: null });
  },
  addCourt: S => {
    if (S.courts.length >= 12) throw new Error("12 courts is the limit.");
    S.courts.push({ id: Math.max(0, ...S.courts.map(c => c.id)) + 1, teams: null, start: null, stayers: null, streak: 0 });
  },
  removeCourt: (S, a) => { actions.cancel(S, a); S.courts = S.courts.filter(c => c.id !== Number(a.court)); },
  move: (S, a) => {
    const i = S.queue.indexOf(a.id), j = i + (Number(a.dir) < 0 ? -1 : 1);
    if (i < 0 || j < 0 || j >= S.queue.length) return;
    [S.queue[i], S.queue[j]] = [S.queue[j], S.queue[i]];
  },
  toFront: (S, a) => { if (S.queue.includes(a.id)) S.queue = [a.id, ...S.queue.filter(id => id !== a.id)]; },
  bench: (S, a) => actions.leave(S, a),
  unbench: (S, a) => { if (S.bench.includes(a.id)) { S.bench = S.bench.filter(id => id !== a.id); S.queue.push(a.id); } },
  removePlayer: (S, a) => {
    if (busy(S).has(a.id)) throw new Error("Finish or cancel their game first.");
    S.queue = S.queue.filter(id => id !== a.id); S.bench = S.bench.filter(id => id !== a.id);
    delete S.players[a.id];
  },
  settings: (S, a) => {
    if (a.format && !S.courts.some(c => c.teams)) S.format = Number(a.format) === 1 ? 1 : 2;
    if (a.rotation) S.rotation = a.rotation === "all" ? "all" : "winstay";
    if (a.maxWins) S.maxWins = Math.min(5, Math.max(1, Number(a.maxWins)));
    if (typeof a.nightTitle === "string") S.nightTitle = clean(a.nightTitle) || S.nightTitle;
  },
  reset: () => fresh(),
};

const PUBLIC = new Set(["join", "leave"]);

function apply(S, a) {
  const fn = actions[a.type];
  if (!fn) throw new Error("Unknown action.");
  const out = fn(S, a) || {};
  const next = out && out.v !== undefined && out.players ? out : S; // reset returns a new state
  next.v = (S.v || 0) + 1; next.updatedAt = Date.now();
  return { state: next, result: next === S ? out : {} };
}

module.exports = { fresh, apply, PUBLIC };
