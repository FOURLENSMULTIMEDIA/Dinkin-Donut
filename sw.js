// Dink Different app: offline support.
// Pages: network first, fall back to the saved copy (so new deploys show up straight away when online).
// Scripts, styles, fonts, images: served from the cache and refreshed in the background.
// Academy content: network first, then the copy saved when you last watched it.
// Live data (queue, payments, host actions) is never cached.
const V = "dd-v14", CORE = [
  "/", "/queue", "/academy", "/loyalty", "/offline.html", "/css/style.css", "/css/fonts.css", "/js/icons.js",
  "/js/common.js", "/js/config.js", "/js/theme.js", "/js/coach.js", "/js/pwa.js", "/js/social.js", "/js/motion.js", "/js/sound.js",
  "/assets/logo.svg", "/assets/favicon.svg", "/assets/app/icon-192.png", "/assets/fonts/fraunces-normal.woff2", "/assets/fonts/fraunces-italic.woff2", "/assets/brand/mark.svg", "/assets/fonts/dm-sans-700.woff2", "/assets/fonts/dm-sans-500.woff2",
];
self.addEventListener("install", e => { e.waitUntil(caches.open(V).then(c => Promise.all(CORE.map(u => c.add(u).catch(() => {})))).then(() => self.skipWaiting())); });
self.addEventListener("activate", e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== V).map(k => caches.delete(k)))).then(() => self.clients.claim())); });

const save = (req, res) => { if (res && res.ok && res.type !== "opaque") { const c = res.clone(); caches.open(V).then(x => x.put(req, c)); } return res; };
self.addEventListener("fetch", e => {
  const req = e.request, url = new URL(req.url);
  if (req.method !== "GET" || url.origin !== location.origin) return;
  // Academy lessons / drills / tips / rules: keep the last copy for offline
  if (url.pathname === "/api/academy" && !url.searchParams.has("keys")) {
    e.respondWith(fetch(req).then(r => save(req, r)).catch(() => caches.match(req).then(r => r || new Response(JSON.stringify({ error: "You're offline. Open this once online to save it for offline use.", offline: true }), { status: 503, headers: { "Content-Type": "application/json" } }))));
    return;
  }
  if (url.pathname.startsWith("/api/")) return; // live data: always from the network
  if (/\.(mp4|mp3)$/.test(url.pathname)) return; // large media streams normally
  if (req.mode === "navigate") {
    e.respondWith(fetch(req).then(r => save(req, r)).catch(() => caches.match(req, { ignoreSearch: true }).then(r => r || caches.match("/offline.html"))));
    return;
  }
  e.respondWith(caches.match(req).then(hit => { const net = fetch(req).then(r => save(req, r)).catch(() => hit); return hit || net; }));
});
