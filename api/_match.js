// Matchmaking. Three modes:
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
  const [a, b, c, d] = ids, options = [[[a, b], [c, d]], [[a, c], [b, d]], [[a, d], [b, c]]];
  let best = options[0], bestDiff = Infinity;
  options.forEach(o => { const diff = Math.abs(avg(S, o[0]) - avg(S, o[1])); if (diff < bestDiff - 1e-9) { best = o; bestDiff = diff; } });
  return best;
}

function quality(S, teams) {
  const d = Math.abs(avg(S, teams[0]) - avg(S, teams[1]));
  return d <= 0.35 ? "even" : d <= 0.8 ? "close" : "uneven";
}

// Returns the ids to bring on court, or null if the court should wait.
function choose(S, court, take, stay) {
  const q = S.queue;
  if (q.length < take) return null;
  const mode = S.match || "smart";
  if (mode === "order") return q.slice(0, take);

  if (mode === "levels" && court.level && court.level !== "any") {
    const want = BASE[court.level], picked = [];
    const lvl = id => BASE[normLevel(S.players[id].level)] || 2;
    // 1) exact level, queue order  2) players who have waited too long, one level away  3) nearest levels
    q.forEach(id => { if (picked.length < take && lvl(id) === want) picked.push(id); });
    q.forEach(id => { if (picked.length < take && !picked.includes(id) && (S.players[id].skips || 0) >= MAX_SKIPS && Math.abs(lvl(id) - want) === 1) picked.push(id); });
    if (picked.length < take) {
      // Do not starve the court: if the queue is long, borrow the closest levels
      if (q.length < take * 2) return null;
      q.filter(id => !picked.includes(id)).sort((x, y) => Math.abs(lvl(x) - want) - Math.abs(lvl(y) - want) || q.indexOf(x) - q.indexOf(y))
        .forEach(id => { if (picked.length < take) picked.push(id); });
    }
    return picked;
  }

  // smart
  const win = q.slice(0, Math.max(WINDOW, take * 2));
  const must = win.filter(id => (S.players[id].skips || 0) >= MAX_SKIPS);
  const picked = [];
  if (!stay.length) picked.push(win[0]);
  must.forEach(id => { if (picked.length < take && !picked.includes(id)) picked.push(id); });
  const target = stay.length ? avg(S, stay) : rating(S.players[win[0]]);
  win.filter(id => !picked.includes(id))
    .sort((x, y) => Math.abs(rating(S.players[x]) - target) - Math.abs(rating(S.players[y]) - target) || q.indexOf(x) - q.indexOf(y))
    .forEach(id => { if (picked.length < take) picked.push(id); });
  return picked;
}

// Everyone ahead of the last picked player who was passed over gets a skip mark.
function markSkips(S, picked) {
  const last = Math.max(...picked.map(id => S.queue.indexOf(id)));
  S.queue.slice(0, last + 1).forEach(id => { const p = S.players[id]; if (!p) return; p.skips = picked.includes(id) ? 0 : (p.skips || 0) + 1; });
}

module.exports = { LEVELS, normLevel, rating, split, quality, choose, markSkips, avgOf: avg };
