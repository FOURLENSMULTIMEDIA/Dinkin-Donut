// Courtcall: the club registry. Each club is one global document; an index keeps the list of slugs.
const { getGlobal, setGlobal } = require("./_store");

const TRIAL_DAYS = 14;
const SALES = ["+974 3076 3431", "+974 3072 3503"];
// Plans in QAR per month. Founding Clubs (first 10 to pay) keep 50% off for life.
const PLANS = {
  starter: { name: "Starter", price: 149, courts: 2, blurb: "For a single weekly open play." },
  club: { name: "Club", price: 299, courts: 6, blurb: "Your brand, your nights, every week." },
  venue: { name: "Venue", price: 549, courts: 12, blurb: "Multi-court venues and leagues." },
};
const FOUNDING_SPOTS = 10;

const slugify = s => String(s || "").toLowerCase().normalize("NFKD").replace(/[^\w\s-]/g, "").trim().replace(/[\s_]+/g, "-").replace(/-+/g, "-").slice(0, 32);
const RESERVED = new Set(["api", "admin", "host", "tv", "queue", "clubs", "courtcall", "dinkin", "dinkindonut", "dinkin-donut", "www", "app", "help", "login"]);

async function getClub(slug) { slug = slugify(slug); return slug ? getGlobal("club:" + slug, null) : null; }
async function saveClub(c) { await setGlobal("club:" + c.slug, c); const idx = await getGlobal("clubs", []); if (!idx.includes(c.slug)) { idx.push(c.slug); await setGlobal("clubs", idx); } }
async function listClubs() { const idx = await getGlobal("clubs", []); return (await Promise.all(idx.map(s => getGlobal("club:" + s, null)))).filter(Boolean); }

function access(c) {
  const now = Date.now();
  if (!c) return { ok: false, phase: "missing" };
  if (c.suspended) return { ok: false, phase: "suspended" };
  if (!c.paidUntil) return { ok: false, phase: "pending" };
  if (c.paidUntil && c.paidUntil > now) return { ok: true, phase: "active", daysLeft: Math.ceil((c.paidUntil - now) / 864e5) };
  return { ok: false, phase: c.paidUntil ? "lapsed" : "expired", daysLeft: 0 };
}
// What each plan may use.
const LIMITS = { trial: { courts: 2, players: 20, label: "Trial" }, starter: { courts: 2, players: 40 }, club: { courts: 6, players: 80 }, venue: { courts: 12, players: 200 } };
const limitsOf = c => ({ ...(LIMITS[c.plan] || LIMITS.club), label: PLANS[c.plan]?.name || "Club" });
const publicClub = c => c && ({ limits: limitsOf(c), founding: !!c.founding, request: c.request, billing: c.billing || "manual", cancelAtPeriodEnd: !!c.cancelAtPeriodEnd, paymentIssue: !!c.paymentIssue, slug: c.slug, name: c.name, short: c.short, city: c.city, color: c.color, accent: c.accent, logo: c.logo || "", plan: c.plan, access: access(c), sales: SALES });

// Payments ledger: one record per payment (card invoices from Stripe, or manual Fawran/transfer).
// Kept forever in the database; the owner can export it as CSV.
async function recordPayment(p) {
  const L = await getGlobal("payments", []);
  if (p.id && L.some(x => x.id === p.id)) return false; // already recorded (webhooks can repeat)
  L.unshift({ at: Date.now(), ...p });
  await setGlobal("payments", L.slice(0, 5000));
  return true;
}
async function listPayments() { return getGlobal("payments", []); }

module.exports = { recordPayment, listPayments, LIMITS, limitsOf, TRIAL_DAYS, SALES, PLANS, FOUNDING_SPOTS, slugify, RESERVED, getClub, saveClub, listClubs, access, publicClub };
