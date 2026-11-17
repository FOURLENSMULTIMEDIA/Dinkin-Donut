// Matchmaking. Modes:
//   record – "Winners vs Winners": players with similar records tonight meet each other
//   mix    – "Winner + Loser": each team pairs a hot player with a cold one, so games stay close
// Options on top of any mode: mixed doubles (each team one man + one woman) and fixed partners.
//   order  – strict first come, first served
//   smart  – head of the queue always plays; the rest are the closest skill fit from the next few waiting,
//            nobody is skipped more than twice, teams are split for the most even game
//   levels – courts are tagged beginner / intermediate / advanced and fill with matching players,
//            borrowing from the next level only when someone has waited too long
const LEVELS = ["beginner", "intermediate", "advanced"];
const LEGACY = { new: "beginner", social: "intermediate", competitive: "advanced" };
const BASE = { beginner: 1, intermediate: 2, advanced: 3 };
const WINDOW = 8, MAX_SKIPS = 2;

function normLevel(l) {
  if (!l) return null;
  const k = String(l).toLowerCase();
  if (LEVELS.includes(k)) return k;
  if (LEGACY[k]) return LEGACY[k];
  if (/new|begin|2\.\d/.test(k)) return "beginner";
  if (/inter|3\.\d/.test(k)) return "intermediate";
  if (/adv|4\.\d|5\.\d|pro/.test(k)) return "advanced";
  return null;
}

// Level sets the base; tonight's results nudge it once a player has 3+ games.
function rating(p) {
  const base = BASE[normLevel(p && p.level)] || 2, g = p ? p.w + p.l : 0;
  return base + (g >= 3 ? (p.w / g - 0.5) * 0.8 : 0);
}

const avg = (S, ids) => ids.reduce((a, id) => a + rating(S.players[id]), 0) / Math.max(1, ids.length);

// Best split of 2 or 4 players into two teams
function split(S, ids, per) {
  if (per === 1) return [[ids[0]], [ids[1]]];
  const [a, b, c, d] = ids;
  let options = [[[a, b], [c, d]], [[a, c], [b, d]], [[a, d], [b, c]]];
  const g = id => (S.players[id] && S.players[id].g) || "";
  const partnered = id => { const p = S.players[id]; return p && p.partner && ids.includes(p.partner) && S.players[p.partner].partner === id ? p.partner : null; };
  const ok = o => o.every(t => {
    if (ids.some(id => partnered(id) && (t.includes(id) !== t.includes(partnered(id))))) return false;
    if (S.mixed && g(t[0]) && g(t[1]) && g(t[0]) === g(t[1])) return false;
    return true;
  });
  const valid = options.filter(ok); if (valid.length) options = valid;
  if (S.match === "mix") { // one of tonight's top two records with one of the bottom two, on each team
    const byRec = ids.slice().sort((x, y) => rec(S.players[y]) - rec(S.players[x])), top = byRec.slice(0, 2);
    const mixOk = options.filter(o => o.every(t => t.filter(id => top.includes(id)).length === 1));
    if (mixOk.length) options = mixOk;
  }
  let best = options[0], bestDiff = Infinity;
  const repeat = t => ((S.players[t[0]]?.partners || {})[t[1]] || 0);
  options.forEach(o => { const diff = Math.abs(avg(S, o[0]) - avg(S, o[1])) + 0.45 * (repeat(o[0]) + repeat(o[1])); if (diff < bestDiff - 1e-9) { best = o; bestDiff = diff; } });
  return best;
}

function quality(S, teams) {
  const d = Math.abs(avg(S, teams[0]) - avg(S, teams[1]));
  return d <= 0.35 ? "even" : d <= 0.8 ? "close" : "uneven";
}

// Record tonight: wins minus losses, nudged by win rate
const rec = p => p ? (p.w || 0) - (p.l || 0) + ((p.w || 0) + (p.l || 0) ? (p.w / (p.w + p.l) - 0.5) : 0) : 0;
const gOf = (S, id) => (S.players[id] && S.players[id].g) || "";
const partnerOf = (S, id) => { const p = S.players[id]; const q = p && p.partner && S.players[p.partner]; return q && q.partner === id ? q.id : null; };

// Preference order for the next game (before mixed / partner rules are applied).
function ranked(S, court, take, stay) {
  const q = S.queue, mode = S.match || "smart";
  if (mode === "order") return q.slice();
  if (mode === "levels" && court.level && court.level !== "any") {
    const want = BASE[court.level], lvl = id => BASE[normLevel(S.players[id].level)] || 2, out = [];
    q.forEach(id => { if (lvl(id) === want) out.push(id); });
    q.forEach(id => { if (!out.includes(id) && (S.players[id].skips || 0) >= MAX_SKIPS && Math.abs(lvl(id) - want) === 1) out.push(id); });
    if (out.length < take && q.length < take * 2) return out; // court waits for its level
    q.filter(id => !out.includes(id)).sort((x, y) => Math.abs(lvl(x) - want) - Math.abs(lvl(y) - want) || q.indexOf(x) - q.indexOf(y)).forEach(id => out.push(id));
    return out;
  }
  const win = q.slice(0, Math.max(WINDOW, take * 2)), out = [];
  if (!stay.length) out.push(win[0]);
  win.filter(id => (S.players[id].skips || 0) >= MAX_SKIPS).forEach(id => { if (!out.includes(id)) out.push(id); });
  const games = id => (S.players[id].w || 0) + (S.players[id].l || 0);
  const fewest = Math.min(...win.map(games));
  const fair = id => (S.gameLimit ? 0.6 : 0.25) * (games(id) - fewest);
  let score;
  if (mode === "record") {
    const target = stay.length ? stay.reduce((t, id) => t + rec(S.players[id]), 0) / stay.length : rec(S.players[win[0]]);
    score = id => Math.abs(rec(S.players[id]) - target) * 0.8 + fair(id);
  } else {
    const target = stay.length ? avg(S, stay) : rating(S.players[win[0]]);
    score = id => Math.abs(rating(S.players[id]) - target) + fair(id);
  }
  win.filter(id => !out.includes(id)).sort((x, y) => score(x) - score(y) || q.indexOf(x) - q.indexOf(y)).forEach(id => out.push(id));
  q.forEach(id => { if (!out.includes(id)) out.push(id); });
  return out;
}

// Take players in preference order, keeping fixed partners together and, for mixed doubles, 2 men + 2 women.
function pick(S, order, take, stay, mixed) {
  const inQ = new Set(S.queue), picked = [];
  const need = { m: 0, f: 0 };
  if (mixed) { need.m = take / 2; need.f = take / 2; stay.forEach(id => { const g = gOf(S, id); if (g) need[g] = Math.max(0, need[g] - 1); }); if (stay.length) { need.m = Math.min(need.m, 1); need.f = Math.min(need.f, 1); } }
  const fits = unit => {
    if (picked.length + unit.length > take) return false;
    if (!mixed) return true;
    const c = { m: 0, f: 0, x: 0 }; unit.forEach(id => { const g = gOf(S, id); c[g || "x"]++; });
    const have = { m: 0, f: 0, x: 0 }; picked.forEach(id => { const g = gOf(S, id); have[g || "x"]++; });
    if (have.m + c.m > need.m || have.f + c.f > need.f) return false;
    // an incoming fixed pair in mixed doubles must be one man + one woman
    if (unit.length === 2 && (c.m === 2 || c.f === 2)) return false;
    return true;
  };
  for (const id of order) {
    if (picked.includes(id)) continue;
    const pid = partnerOf(S, id);
    let unit = [id];
    if (pid) {
      if (stay.includes(pid)) unit = [id];               // partner already on court with the winners
      else if (!inQ.has(pid)) continue;                   // wait until the partner is free too
      else unit = [id, pid];
      // a pair must form a whole team: with winners staying, the incoming pair fills the court exactly
      if (unit.length === 2 && stay.length && take !== 2) continue;
    }
    if (fits(unit)) picked.push(...unit);
    if (picked.length === take) break;
  }
  return picked.length === take ? picked : null;
}

// Returns the ids to bring on court, or null if the court should wait.
function choose(S, court, take, stay) {
  if (S.queue.length < take) return null;
  const order = ranked(S, court, take, stay);
  if ((S.match || "smart") === "levels" && order.length < take) return null;
  const mixed = !!S.mixed && S.format === 2;
  let picked = pick(S, order, take, stay, mixed);
  if (!picked && mixed && S.queue.length >= take * 3) picked = pick(S, order, take, stay, false); // never let a court sit idle for long
  if (!picked) return null;
  // Never put the exact same four straight back on court
  const key = ids => [...ids].sort().join(",");
  if (!stay.length && court.lastFour && key(picked) === court.lastFour && !mixed && !picked.some(id => partnerOf(S, id))) {
    const swap = S.queue.find(id => !picked.includes(id) && !partnerOf(S, id));
    if (swap) picked[picked.length - 1] = swap;
  }
  return picked;
}

// Everyone ahead of the last picked player who was passed over gets a skip mark.
function markSkips(S, picked) {
  const last = Math.max(...picked.map(id => S.queue.indexOf(id)));
  S.queue.slice(0, last + 1).forEach(id => { const p = S.players[id]; if (!p) return; p.skips = picked.includes(id) ? 0 : (p.skips || 0) + 1; });
}

module.exports = { LEVELS, normLevel, rating, split, quality, choose, markSkips, avgOf: avg, rec, partnerOf };
