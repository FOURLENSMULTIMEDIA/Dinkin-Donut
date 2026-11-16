// Storage: Upstash Redis over REST (Vercel Marketplace → Upstash / "Redis").
// Falls back to memory for local testing, which does NOT persist on Vercel.
const URL = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
const TOKEN = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
const KEY = "dinkin:state", LOCK = "dinkin:lock", HALL = "dinkin:hall";
const mem = globalThis.__dinkin || (globalThis.__dinkin = { state: null, hall: [] });

async function redis(cmd) {
  const r = await fetch(URL, { method: "POST", headers: { Authorization: `Bearer ${TOKEN}` }, body: JSON.stringify(cmd) });
  const j = await r.json();
  if (j.error) throw new Error(j.error);
  return j.result;
}

const hasDb = () => Boolean(URL && TOKEN);

async function load() {
  if (!hasDb()) return mem.state;
  const raw = await redis(["GET", KEY]);
  return raw ? JSON.parse(raw) : null;
}

async function save(S) {
  if (!hasDb()) { mem.state = S; return; }
  await redis(["SET", KEY, JSON.stringify(S)]);
}

// Serialise writes so two hosts tapping at once never overwrite each other.
async function withLock(fn) {
  if (!hasDb()) return fn();
  const token = Math.random().toString(36).slice(2);
  for (let i = 0; i < 40; i++) {
    if (await redis(["SET", LOCK, token, "NX", "PX", "4000"])) {
      try { return await fn(); }
      finally { if ((await redis(["GET", LOCK])) === token) await redis(["DEL", LOCK]); }
    }
    await new Promise(r => setTimeout(r, 100));
  }
  throw new Error("The queue is busy. Try again.");
}

// Hall of Glaze: winners of past sessions, newest first, last 30 kept.
async function loadHall() {
  if (!hasDb()) return mem.hall;
  const raw = await redis(["GET", HALL]);
  return raw ? JSON.parse(raw) : [];
}
async function addHall(entry) {
  const h = [entry, ...(await loadHall())].slice(0, 30);
  if (!hasDb()) { mem.hall = h; return; }
  await redis(["SET", HALL, JSON.stringify(h)]);
}

// Generic JSON documents (members database, etc.)
async function getDoc(key, fallback) {
  if (!hasDb()) return mem[key] ?? fallback;
  const raw = await redis(["GET", "dinkin:" + key]);
  return raw ? JSON.parse(raw) : fallback;
}
async function setDoc(key, value) {
  if (!hasDb()) { mem[key] = value; return; }
  await redis(["SET", "dinkin:" + key, JSON.stringify(value)]);
}

module.exports = { load, save, withLock, hasDb, loadHall, addHall, getDoc, setDoc };
