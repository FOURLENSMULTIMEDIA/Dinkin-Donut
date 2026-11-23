// Storage: Upstash Redis over REST (Vercel Marketplace → Upstash / "Redis").
// Falls back to memory for local testing, which does NOT persist on Vercel.
const URL = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
const TOKEN = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
const { AsyncLocalStorage } = require("async_hooks");
// Multi-club: every request can run "inside" a club, which prefixes all of its keys.
const als = globalThis.__ddAls || (globalThis.__ddAls = new AsyncLocalStorage());
const runAsClub = (slug, fn) => als.run(slug ? "c:" + slug + ":" : "", fn);
const pre = () => als.getStore() || "";
const K = name => "dinkin:" + pre() + name;
const memAll = globalThis.__dinkin || (globalThis.__dinkin = {});
const memOf = () => memAll[pre() || "_"] || (memAll[pre() || "_"] = { state: null, hall: [] });

async function redis(cmd) {
  const r = await fetch(URL, { method: "POST", headers: { Authorization: `Bearer ${TOKEN}` }, body: JSON.stringify(cmd) });
  const j = await r.json();
  if (j.error) throw new Error(j.error);
  return j.result;
}

const hasDb = () => Boolean(URL && TOKEN);

async function load() {
  if (!hasDb()) return memOf().state;
  const raw = await redis(["GET", K("state")]);
  return raw ? JSON.parse(raw) : null;
}

async function save(S) {
  if (!hasDb()) { memOf().state = S; return; }
  await redis(["SET", K("state"), JSON.stringify(S)]);
}

// Serialise writes so two hosts tapping at once never overwrite each other.
async function withLock(fn) {
  if (!hasDb()) return fn();
  const token = Math.random().toString(36).slice(2);
  for (let i = 0; i < 40; i++) {
    const LOCK = K("lock");
    if (await redis(["SET", LOCK, token, "NX", "PX", "4000"])) {
      try { return await fn(); }
      finally { if ((await redis(["GET", LOCK])) === token) await redis(["DEL", LOCK]); }
    }
    await new Promise(r => setTimeout(r, 100));
  }
  throw new Error("The queue is busy. Try again.");
}

// The Honours Board: winners of past sessions, newest first, last 30 kept.
async function loadHall() {
  if (!hasDb()) return memOf().hall;
  const raw = await redis(["GET", K("hall")]);
  return raw ? JSON.parse(raw) : [];
}
async function addHall(entry) {
  const h = [entry, ...(await loadHall())].slice(0, 30);
  if (!hasDb()) { memOf().hall = h; return; }
  await redis(["SET", K("hall"), JSON.stringify(h)]);
}

// Generic JSON documents (members database, etc.)
async function getDoc(key, fallback) {
  if (!hasDb()) return memOf()[key] ?? fallback;
  const raw = await redis(["GET", K(key)]);
  return raw ? JSON.parse(raw) : fallback;
}
async function setDoc(key, value) {
  if (!hasDb()) { memOf()[key] = value; return; }
  await redis(["SET", K(key), JSON.stringify(value)]);
}

async function clearHall() {
  if (!hasDb()) { memOf().hall = []; return; }
  await redis(["DEL", K("hall")]);
}

// Platform-wide documents (club registry): never prefixed by a club.
async function getGlobal(key, fallback) { return als.run("", () => getDoc(key, fallback)); }
async function setGlobal(key, value) { return als.run("", () => setDoc(key, value)); }

module.exports = { runAsClub, getGlobal, setGlobal, load, save, withLock, hasDb, loadHall, addHall, clearHall, getDoc, setDoc };
