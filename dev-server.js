// Local preview: `npm run dev` then open http://localhost:3000
// Uses in-memory storage unless KV_REST_API_URL / KV_REST_API_TOKEN are set.
const http = require("http"), fs = require("fs"), path = require("path");
const api = require("./api/queue"), members = require("./api/members"), wa = require("./api/whatsapp"), founders = require("./api/founders"), clubs = require("./api/clubs"), pay = require("./api/stripe"), hook = require("./api/stripe-webhook"), tour = require("./api/tournament"), edi = require("./api/edition"), aca = require("./api/academy"), studio = require("./api/studio");
const types = { ".html": "text/html", ".css": "text/css", ".js": "text/javascript", ".svg": "image/svg+xml", ".png": "image/png", ".woff2": "font/woff2", ".mp4": "video/mp4", ".jpg": "image/jpeg", ".mp3": "audio/mpeg", ".webmanifest": "application/manifest+json" };
http.createServer(async (req, res) => {
  const url = new URL(req.url, "http://x");
  if (url.pathname === "/api/stripe-webhook") { // raw body for the signature check
    res.status = c => { res.statusCode = c; return res; }; res.json = o => { res.setHeader("Content-Type", "application/json"); res.end(JSON.stringify(o)); }; res.send = b => res.end(String(b));
    return hook(req, res);
  }
  if (["/api/queue", "/api/members", "/api/whatsapp", "/api/founders", "/api/clubs", "/api/stripe", "/api/tournament", "/api/edition", "/api/academy", "/api/studio"].includes(url.pathname)) {
    let body = ""; for await (const c of req) body += c;
    req.body = body; req.query = Object.fromEntries(url.searchParams);
    res.status = c => { res.statusCode = c; return res; };
    res.json = o => { res.setHeader("Content-Type", "application/json"); res.end(JSON.stringify(o)); };
    res.send = b => res.end(String(b));
    return ({ "/api/members": members, "/api/whatsapp": wa, "/api/founders": founders, "/api/clubs": clubs, "/api/stripe": pay, "/api/tournament": tour, "/api/edition": edi, "/api/academy": aca, "/api/studio": studio }[url.pathname] || api)(req, res);
  }
  const cm = url.pathname.match(/^\/c\/[a-z0-9-]+(?:\/(host|tv|tournament))?\/?$/);
  let f = path.join(__dirname, cm ? (cm[1] || "queue") + ".html" : url.pathname === "/" ? "index.html" : url.pathname);
  if (!path.extname(f)) f += ".html";
  fs.readFile(f, (e, d) => { if (e) { res.statusCode = 404; return res.end("Not found"); } res.setHeader("Content-Type", types[path.extname(f)] || "text/plain"); res.end(d); });
}).listen(process.env.PORT || 3000, () => console.log("Dink Different on http://localhost:" + (process.env.PORT || 3000)));
