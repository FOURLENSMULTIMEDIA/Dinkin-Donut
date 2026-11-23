const M = require("./_match");
// Queue rules engine. Pure functions on a plain state object, shared by every API call.
const MAX_LOG = 150;

function fresh() {
  return {
    v: 0, updatedAt: Date.now(), nightTitle: "Open Play Night",
    format: 2, rotation: "winstay", maxWins: 2, match: "smart", requirePin: true, autopilot: true, gameCap: 0, target: 11, gameLimit: "auto", sessionEnd: 1440, autoClose: 3, done: [],
    players: {}, queue: [], bench: [], games: 0, nextId: 1, durSum: 0, durN: 0,
    fee: 0, pay: {}, fawran: "",
    courts: [1, 2, 3].map(id => ({ id, teams: null, start: null, stayers: null, streak: 0 })),
    log: [{ t: Date.now(), txt: "Night created. Paddles up!" }],
  };
}

const clean = s => String(s || "").replace(/[<>]/g, "").replace(/\s+/g, " ").trim().slice(0, 24);
const log = (S, txt) => { S.log.unshift({ t: Date.now(), txt }); S.log.length = Math.min(S.log.length, MAX_LOG); };
const names = (S, ids) => ids.map(id => S.players[id]?.name || "?").join(" & ");
const busy = S => new Set(S.courts.flatMap(c => [...(c.teams ? c.teams.flat() : []), ...(c.stayers || [])]));

const norm = s => clean(s).toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g, "").replace(/[^\p{L}\p{N}]/gu, "");
function findByName(S, name) {
  const k = norm(name);
  return Object.values(S.players).find(p => norm(p.name) === k);
}
function newPlayer(S, name) {
  if (Object.keys(S.players).length >= 300) throw new Error("Tonight's list is full.");
  const id = "p" + S.nextId++;
  return (S.players[id] = { id, name, w: 0, l: 0, streak: 0, pf: 0, pa: 0, joined: Date.now(), in: false });
}

// Club Pass: 3-digit PIN, unique among tonight's players
function genPin(S) {
  const used = new Set(Object.values(S.players).map(p => p.pin).filter(Boolean));
  for (let i = 0; i < 200; i++) { const pin = String(100 + Math.floor(Math.random() * 900)); if (!used.has(pin)) return pin; }
  return String(Math.floor(Math.random() * 900) + 100);
}
const MAX_PIN_TRIES = 5;

// Public check-in only works for names the host has put on tonight's list.
function addPlayer(S, rawName, level, fromHost, pin) {
  const name = clean(rawName);
  if (name.length < 2) throw new Error("Please enter a name with at least 2 letters.");
  let p = findByName(S, name);
  if (!p && !fromHost) throw new Error("Your name isn’t on tonight’s list yet. Please see the host at the check-in table.");
  if (!p) p = newPlayer(S, name);
  if (!fromHost && S.requirePin !== false) {
    if (!p.pin) throw new Error("You don’t have a Club Pass yet. Pay at the check-in table and we’ll WhatsApp you a PIN.");
    if ((p.pinFails || 0) >= MAX_PIN_TRIES) throw new Error("Too many wrong PINs. Please see the host at the check-in table.");
    if (!String(pin || "").replace(/\D/g, "")) throw new Error("Enter the 3-digit PIN we sent to your WhatsApp.");
    if (String(pin || "").replace(/\D/g, "") !== p.pin) {
      p.pinFails = (p.pinFails || 0) + 1;
      const left = MAX_PIN_TRIES - p.pinFails;
      throw new Error(left > 0 ? `That PIN doesn’t match. ${left} ${left === 1 ? "try" : "tries"} left.` : "Too many wrong PINs. Please see the host at the check-in table.");
    }
    p.pinFails = 0;
  }
  if (S.queue.includes(p.id) || busy(S).has(p.id)) return p; // already in, just return them
  S.bench = S.bench.filter(id => id !== p.id);
  p.in = true;
  const lv = M.normLevel(level); if (lv && (!p.level || !fromHost || level)) p.level = lv;
  S.queue.push(p.id);
  log(S, `${p.name} checked in`);
  return p;
}

function fillCourt(S, c) {
  if (c.teams) return;
  const need = S.format * 2, stay = c.stayers || [];
  const take = need - stay.length;
  if (S.queue.length < take) return;
  // Winners stay only if there is a fair opponent; otherwise they rotate and a fresh game is built.
  if (stay.length && S.match !== "order") {
    const next = S.queue.find(id => (S.players[id].skips || 0) >= 1) || S.queue[0];
    if (next && Math.abs(M.rating(S.players[next]) - M.avgOf(S, stay)) > 1.1) {
      S.queue.push(...stay); c.stayers = null; c.streak = 0; c.lastWinners = null;
      log(S, `Court ${c.id}: winners rotate off for a fairer match`);
      return fillCourt(S, c);
    }
  }
  if (S.queue.length < take) topUp(S, take);
  const incoming = M.choose(S, c, take, stay);
  if (!incoming || incoming.length < take) return;
  M.markSkips(S, incoming);
  S.queue = S.queue.filter(id => !incoming.includes(id));
  c.teams = stay.length ? [stay, incoming] : M.split(S, incoming, S.format);
  c.balance = M.quality(S, c.teams);
  c.stayers = null; c.start = Date.now();
  log(S, `Court ${c.id}: ${names(S, c.teams[0])} vs ${names(S, c.teams[1])}${S.match !== "order" ? ` (${c.balance} match)` : ""}`);
}

function court(S, id) {
  const c = S.courts.find(c => c.id === Number(id));
  if (!c) throw new Error("That court no longer exists.");
  return c;
}

// Fair share: how many games each player gets tonight.
// Auto: (games still possible before the session ends × players per game) shared across everyone here,
// added to what the average player has already played. Recalculates as people join or leave.
const played = p => (p.w || 0) + (p.l || 0);
function activeIds(S) {
  const onCourt = S.courts.flatMap(c => [...(c.teams ? c.teams.flat() : []), ...(c.stayers || [])]);
  return [...new Set([...S.queue, ...onCourt, ...(S.done || [])])].filter(id => S.players[id]);
}
function minutesLeft(S) {
  const doha = new Date(Date.now() + 3 * 3600e3), now = doha.getUTCHours() * 60 + doha.getUTCMinutes();
  // Minutes until the session end, across midnight; more than 18 hours away means it has already passed
  const diff = ((S.sessionEnd || 1440) - now + 2880) % 1440;
  return diff > 18 * 60 ? 0 : diff;
}
function gameLimit(S) {
  if (!S.gameLimit) return 0;
  if (S.gameLimit !== "auto") return S.gameLimit;
  const ids = activeIds(S); if (ids.length < S.format * 2) return 0;
  const avgLen = S.durN >= 3 ? S.durSum / S.durN : 13;
  const gamesLeft = Math.floor(minutesLeft(S) / avgLen) * S.courts.length;
  const perPlayer = gamesLeft * S.format * 2 / ids.length;
  const playedAvg = ids.reduce((a, id) => a + played(S.players[id]), 0) / ids.length;
  return Math.max(3, Math.min(12, Math.round(playedAvg + perPlayer)));
}
// Move players who reached their share to "done"; bring them back if the share grows.
function applyLimit(S) {
  S.done = (S.done || []).filter(id => S.players[id]);
  const lim = gameLimit(S); S.limitNow = lim;
  if (!lim) { if (S.done.length) { S.queue.push(...S.done); S.done = []; } return; }
  S.queue = S.queue.filter(id => { if (played(S.players[id]) >= lim) { if (!S.done.includes(id)) { S.done.push(id); log(S, `${S.players[id].name} played ${lim} games. Done for tonight, thank you!`); } return false; } return true; });
  S.done = S.done.filter(id => { if (played(S.players[id]) < lim) { S.queue.push(id); return false; } return true; });
}
// Courts never sit empty: if too few are waiting, players who are done get a bonus game (fewest games first).
function topUp(S, need) {
  if (S.queue.length >= need || !(S.done || []).length) return;
  const extra = S.done.slice().sort((a, b) => played(S.players[a]) - played(S.players[b])).slice(0, need - S.queue.length);
  S.done = S.done.filter(id => !extra.includes(id)); S.queue.push(...extra);
  extra.forEach(id => { S.players[id].bonus = true; });
  if (extra.length) log(S, `Bonus game: ${extra.map(id => S.players[id].name).join(", ")}`);
}

// Who plays next: the game the matchmaker would build for the next free court, without changing anything.
function previewNext(S) {
  const take = S.format * 2;
  if (S.queue.length < take) return null;
  const free = S.courts.find(c => !c.teams && !c.stayers) || S.courts.slice().sort((x, y) => (x.start || 0) - (y.start || 0))[0] || { id: 0 };
  const ids = M.choose(S, { ...free, stayers: null }, take, []);
  if (!ids || ids.length < take) return null;
  const teams = M.split(S, ids, S.format);
  return { teams, balance: M.quality(S, teams), court: free.teams ? null : free.id };
}

const actions = {
  // public
  join: (S, a) => {
    const player = addPlayer(S, a.name, a.level, false, a.pin);
    const p = S.players[player.id];
    if (a.g === "m" || a.g === "f") p.g = a.g;
    const req = clean(a.partnerReq || "").slice(0, 40);
    if (req && !p.partner) { p.partnerReq = req; log(S, `${p.name} asked to play with ${req}`); }
    return { player };
  },
  leave: (S, a) => {
    const p = S.players[a.id]; if (!p) return;
    S.queue = S.queue.filter(id => id !== p.id); S.done = (S.done || []).filter(id => id !== p.id);
    if (!S.bench.includes(p.id)) S.bench.push(p.id);
    log(S, `${p.name} is taking a break`);
  },
  // host
  add: (S, a) => ({ player: addPlayer(S, a.name, a.level, true) }),
  // Paid at the door: record payment, create the player if needed, issue a fresh Club Pass PIN.
  pass: (S, a) => {
    const n = clean(a.name); if (n.length < 2) throw new Error("Enter the player’s name.");
    const phone = String(a.phone || "").replace(/[^\d+]/g, "");
    if (phone.replace(/\D/g, "").length < 8) throw new Error("Enter a WhatsApp number with at least 8 digits.");
    const p = findByName(S, n) || newPlayer(S, n);
    p.phone = phone; p.pin = genPin(S); p.pinFails = 0;
    const lv = M.normLevel(a.level); if (lv) p.level = lv;
    const amt = Math.round(Number(a.amt) * 100) / 100, r = S.pay[p.id] || (S.pay[p.id] = { items: [] });
    if (a.method === "free") { r.fee = 0; log(S, `${p.name} plays free tonight and got a Club Pass`); }
    else if (a.method === "later") { log(S, `${p.name} got a Club Pass, paying later`); }
    else { if (amt > 0) r.items.push({ amt, method: ["cash", "fawran", "card"].includes(a.method) ? a.method : "cash", ref: clean(a.ref), t: Date.now() }); log(S, `${p.name} paid and got a Club Pass`); }
    return { id: p.id, name: p.name, pin: p.pin, phone: p.phone, amount: amt > 0 ? amt : (S.pay[p.id]?.items || []).reduce((x, i) => x + i.amt, 0) };
  },
  newPin: (S, a) => { const p = S.players[a.id]; if (!p) throw new Error("Player not found."); p.pin = genPin(S); p.pinFails = 0; return { id: p.id, name: p.name, pin: p.pin, phone: p.phone || "", amount: (S.pay[p.id]?.items || []).reduce((x, i) => x + i.amt, 0) }; },
  rosterOne: (S, a) => { const n = clean(a.name); if (n.length < 2) throw new Error("Name is too short."); const p = findByName(S, n) || newPlayer(S, n); const lv = M.normLevel(a.level); if (lv) p.level = lv; return { id: p.id }; },
  setGender: (S, a) => { const p = S.players[a.id]; if (!p) throw new Error("Player not found."); p.g = a.g === "m" || a.g === "f" ? a.g : ""; },
  setPartner: (S, a) => {
    const p = S.players[a.id]; if (!p) throw new Error("Player not found.");
    const unlink = x => { const o = x && x.partner && S.players[x.partner]; if (o && o.partner === x.id) o.partner = null; if (x) x.partner = null; };
    if (!a.partner) { unlink(p); p.partnerReq = ""; return; }
    let q = S.players[a.partner] || Object.values(S.players).find(x => x.name.toLowerCase() === String(a.partner).trim().toLowerCase());
    if (!q) throw new Error("Couldn’t find that partner on tonight’s list. Add them first.");
    if (q.id === p.id) throw new Error("Pick a different player.");
    if (busy(S).has(p.id) || busy(S).has(q.id)) throw new Error("Wait until both are off court.");
    unlink(p); unlink(q);
    p.partner = q.id; q.partner = p.id; p.partnerReq = ""; q.partnerReq = "";
    log(S, `${p.name} & ${q.name} will play as fixed partners`);
  },
  setLevel: (S, a) => { const p = S.players[a.id]; if (!p) throw new Error("Player not found."); p.level = M.normLevel(a.level) || null; },
  courtLevel: (S, a) => { const c = court(S, a.court); c.level = ["beginner", "intermediate", "advanced"].includes(a.level) ? a.level : "any"; },
  // Roster: names allowed to check in. One per line or comma separated.
  roster: (S, a) => {
    const list = String(a.names || "").split(/[\n,;]+/).map(clean).filter(n => n.length >= 2);
    if (!list.length) throw new Error("Type at least one name.");
    let added = 0;
    list.forEach(n => { if (!findByName(S, n)) { newPlayer(S, n); added++; } });
    log(S, `${added} name${added === 1 ? "" : "s"} added to tonight’s list`);
    return { added, skipped: list.length - added };
  },
  rename: (S, a) => {
    const p = S.players[a.id]; if (!p) throw new Error("Player not found.");
    const n = clean(a.name); if (n.length < 2) throw new Error("Name is too short.");
    const other = findByName(S, n); if (other && other.id !== p.id) throw new Error("That name is already on the list.");
    p.name = n;
  },
  // Payments (host only, never sent to public pages)
  fee: (S, a) => {
    const v = Math.max(0, Math.round(Number(a.fee) || 0));
    if (a.id) { const r = S.pay[a.id] || (S.pay[a.id] = { items: [] }); r.fee = a.fee === "" || a.fee === null ? null : v; }
    else S.fee = v;
  },
  pay: (S, a) => {
    const p = S.players[a.id]; if (!p) throw new Error("Player not found.");
    const amt = Math.round(Number(a.amt) * 100) / 100;
    if (!(amt > 0)) throw new Error("Enter an amount above 0.");
    const method = ["cash", "fawran", "card", "other"].includes(a.method) ? a.method : "cash";
    const r = S.pay[a.id] || (S.pay[a.id] = { items: [] });
    r.items.push({ amt, method, ref: clean(a.ref), t: Date.now() });
  },
  unpay: (S, a) => { const r = S.pay[a.id]; if (r && r.items[a.i]) r.items.splice(Number(a.i), 1); },
  fawranInfo: (S, a) => { S.fawran = String(a.fawran || "").replace(/[<>]/g, "").slice(0, 60); },
  clearRoster: S => {
    const keep = busy(S); S.queue.forEach(id => keep.add(id));
    Object.keys(S.players).forEach(id => { if (!keep.has(id)) { delete S.players[id]; delete S.pay[id]; } });
    S.bench = [];
  },
  win: (S, a) => {
    const c = court(S, a.court); if (!c.teams) throw new Error("No game on that court.");
    const wi = Number(a.team) ? 1 : 0, W = c.teams[wi], L = c.teams[1 - wi];
    const ws = Number(a.ws) || 0, ls = Number(a.ls) || 0;
    W.forEach(id => { const p = S.players[id]; p.w++; p.streak = p.streak > 0 ? p.streak + 1 : 1; p.pf += ws; p.pa += ls; });
    L.forEach(id => { const p = S.players[id]; p.l++; p.streak = p.streak < 0 ? p.streak - 1 : -1; p.pf += ls; p.pa += ws; });
    S.games++;
    S.lastResult = { t: Date.now(), court: c.id, w: W.slice(), l: L.slice(), wn: W.map(id => S.players[id]?.name), ln: L.map(id => S.players[id]?.name), ws, ls };
    // Club Moments: highlights the TV and console celebrate
    const nm = ids => ids.map(id => S.players[id]?.name).join(" and "), gap = M.avgOf(S, L) - M.avgOf(S, W);
    const hot = W.map(id => S.players[id]).find(p => p && (p.streak === 3 || p.streak === 5 || p.streak === 7));
    let mo = null;
    if (ws >= 11 && ls === 0) mo = { kind: "bagel", title: "Bagel!", line: `${nm(W)} win 11–0 on Court ${c.id}`, say: `Bagel on court ${c.id}! ${nm(W)} win eleven, nil.` };
    else if (gap >= 0.6) mo = { kind: "upset", title: "Upset!", line: `${nm(W)} beat the favourites on Court ${c.id}`, say: `Upset on court ${c.id}! ${nm(W)} take it.` };
    else if (hot) mo = { kind: "fire", title: `${hot.name} is on fire`, line: `${hot.streak} wins in a row`, say: `${hot.name} is on fire! ${hot.streak} wins in a row.` };
    else if (ws >= 12) mo = { kind: "nail", title: "Nail-biter!", line: `${nm(W)} win ${ws}–${ls} on Court ${c.id}`, say: `What a game on court ${c.id}! ${ws}, ${ls}.` };
    if (mo) { S.moment = { ...mo, t: Date.now(), court: c.id }; log(S, `${mo.title} ${mo.line}`); }
    const pair = (t, k) => t.forEach(a => t.forEach(b => { if (a !== b) { const p = S.players[a]; if (p) { p[k] = p[k] || {}; p[k][b] = (p[k][b] || 0) + 1; } } }));
    pair(W, "partners"); pair(L, "partners");
    c.lastFour = [...W, ...L].sort().join(",");
    const mins = Math.max(1, Math.round((Date.now() - c.start) / 60000));
    if (mins <= 45) { S.durSum = (S.durSum || 0) + mins; S.durN = (S.durN || 0) + 1; }
    log(S, `Court ${c.id}: ${names(S, W)} beat ${names(S, L)}${ws ? ` ${ws}–${ls}` : ""} (${mins} min)`);
    const teamStreak = c.lastWinners && c.lastWinners.join() === [...W].sort().join() ? c.streak + 1 : 1;
    const capped = S.limitNow && W.some(id => played(S.players[id]) >= S.limitNow);
    if (S.rotation === "winstay" && teamStreak < S.maxWins && !capped) {
      c.streak = teamStreak; c.lastWinners = [...W].sort(); c.stayers = W.slice(); S.queue.push(...L);
    } else {
      if (S.rotation === "winstay") log(S, `${names(S, W)} hit ${S.maxWins} wins and rotate off. Fine run!`);
      c.streak = 0; c.lastWinners = null; c.stayers = null; S.queue.push(...W, ...L);
    }
    c.teams = null; c.start = null;
    fillCourt(S, c);
  },
  // Type the score; the winner is worked out and checked against the game rules (to 11, win by 2)
  score: (S, a) => {
    const x = parseInt(a.a, 10), y = parseInt(a.b, 10), T = S.target || 11;
    if (!(x >= 0) || !(y >= 0)) throw new Error("Enter both scores.");
    const hi = Math.max(x, y), lo = Math.min(x, y);
    if (hi < T) throw new Error(`A game goes to ${T}. Check the score.`);
    if (hi - lo < 2) throw new Error("A game must be won by 2 points.");
    if (hi > T && hi - lo !== 2) throw new Error(`After ${T - 1}–${T - 1}, the game ends as soon as someone leads by 2.`);
    return actions.win(S, { court: a.court, team: x > y ? 0 : 1, ws: hi, ls: lo });
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
    const pp = S.players[a.id] && S.players[a.id].partner && S.players[S.players[a.id].partner]; if (pp) pp.partner = null;
    delete S.players[a.id]; delete S.pay[a.id];
  },
  settings: (S, a) => {
    if (a.format && !S.courts.some(c => c.teams)) S.format = Number(a.format) === 1 ? 1 : 2;
    if (typeof a.requirePin === "boolean") S.requirePin = a.requirePin;
    if (typeof a.autopilot === "boolean") S.autopilot = a.autopilot;
    if (a.gameLimit !== undefined) S.gameLimit = a.gameLimit === "auto" ? "auto" : Math.max(0, Math.min(20, parseInt(a.gameLimit, 10) || 0));
    if (a.sessionEnd !== undefined) S.sessionEnd = Math.max(0, Math.min(1800, parseInt(a.sessionEnd, 10) || 1440));
    if (a.autoClose !== undefined) S.autoClose = [0, 1, 2, 3, 4, 6].includes(Number(a.autoClose)) ? Number(a.autoClose) : 3;
    if (a.target) S.target = [11, 15, 21].includes(Number(a.target)) ? Number(a.target) : 11;
    if (a.gameCap !== undefined) S.gameCap = Math.max(0, Math.min(40, Number(a.gameCap) || 0));
    if (a.match) S.match = ["order", "smart", "levels", "record", "mix"].includes(a.match) ? a.match : "smart";
    if (typeof a.mixed === "boolean") S.mixed = a.mixed;
    if (a.rotation) S.rotation = a.rotation === "all" ? "all" : "winstay";
    if (a.maxWins) S.maxWins = Math.min(5, Math.max(1, Number(a.maxWins)));
    if (typeof a.nightTitle === "string") S.nightTitle = clean(a.nightTitle) || S.nightTitle;
  },
  // End session: keep the roster names (regulars), clear everything else.
  reset: (S, a) => {
    const n = fresh();
    if (!a.clearRoster) Object.values(S.players).forEach(p => { n.players[p.id] = { id: p.id, name: p.name, level: p.level, g: p.g || "", w: 0, l: 0, streak: 0, pf: 0, pa: 0, joined: Date.now(), in: false }; });
    n.nextId = S.nextId; n.fee = S.fee || 0; n.fawran = S.fawran || ""; n.format = S.format; n.rotation = S.rotation; n.maxWins = S.maxWins; n.match = S.match || "smart"; n.mixed = !!S.mixed; n.requirePin = S.requirePin !== false; n.autopilot = S.autopilot !== false; n.gameCap = 0; n.target = S.target || 11; n.gameLimit = S.gameLimit ?? "auto"; n.sessionEnd = S.sessionEnd || 1440; n.autoClose = S.autoClose ?? 3;
    n.courts = S.courts.map(c => ({ id: c.id, teams: null, start: null, stayers: null, streak: 0, level: c.level || "any" }));
    return n;
  },
};

const PUBLIC = new Set(["join", "leave"]);

function apply(S, a) {
  const fn = actions[a.type];
  if (!fn) throw new Error("Unknown action.");
  const out = fn(S, a) || {};
  const next = out && out.v !== undefined && out.players ? out : S; // reset returns a new state
  applyLimit(next);
  if (next.autopilot !== false && !["cancel", "removeCourt", "reset"].includes(a.type)) next.courts.forEach(c => fillCourt(next, c));
  next.upNext = previewNext(next);
  next.v = (S.v || 0) + 1; next.updatedAt = Date.now();
  return { state: next, result: next === S ? out : {} };
}

// Sleep mode: a night the host forgot to end closes itself.
// Idle for autoClose hours, or quiet for 45 min after the end time, with something still open.
function staleReason(S, now = Date.now()) {
  if (!S || !S.updatedAt || S.autoClose === 0) return "";
  const open = S.queue.length || S.courts.some(c => c.teams) || Object.values(S.players).some(p => p.in || p.w || p.l);
  if (!open) return "";
  const idle = (now - S.updatedAt) / 60000;
  if (idle >= (S.autoClose ?? 3) * 60) return "idle";
  const d = new Date(now + 3 * 3600e3), mins = d.getUTCHours() * 60 + d.getUTCMinutes(); // same clock as minutesLeft
  const past = ((mins % 1440) - (S.sessionEnd || 1440) % 1440 + 1440) % 1440;
  if ((S.sessionEnd || 1440) !== 1440 && past > 0 && past < 360 && idle >= 45) return "ended";
  return "";
}

module.exports = { fresh, apply, PUBLIC, staleReason };
