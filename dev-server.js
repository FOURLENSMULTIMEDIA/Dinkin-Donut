// Local preview: `npm run dev` then open http://localhost:3000
// Uses in-memory storage unless KV_REST_API_URL / KV_REST_API_TOKEN are set.
const http = require("http"), fs = require("fs"), path = require("path");
const api = require("./api/queue"), members = require("./api/members"), wa = require("./api/whatsapp"), founders = require("./api/founders");
const types = { ".html": "text/html", ".css": "text/css", ".js": "text/javascript", ".svg": "image/svg+xml", ".png": "image/png", ".woff2": "font/woff2", ".mp4": "video/mp4", ".jpg": "image/jpeg", ".mp3": "audio/mpeg" };
http.createServer(async (req, res) => {
  const url = new URL(req.url, "http://x");
  if (["/api/queue", "/api/members", "/api/whatsapp", "/api/founders"].includes(url.pathname)) {
    let body = ""; for await (const c of req) body += c;
    req.body = body; req.query = Object.fromEntries(url.searchParams);
    res.status = c => { res.statusCode = c; return res; };
    res.json = o => { res.setHeader("Content-Type", "application/json"); res.end(JSON.stringify(o)); };
    res.send = b => res.end(String(b));
    return ({ "/api/members": members, "/api/whatsapp": wa, "/api/founders": founders }[url.pathname] || api)(req, res);
  }
  let f = path.join(__dirname, url.pathname === "/" ? "index.html" : url.pathname);
  if (!path.extname(f)) f += ".html";
  fs.readFile(f, (e, d) => { if (e) { res.statusCode = 404; return res.end("Not found"); } res.setHeader("Content-Type", types[path.extname(f)] || "text/plain"); res.end(d); });
}).listen(process.env.PORT || 3000, () => console.log("Dinkin' Donut on http://localhost:" + (process.env.PORT || 3000)));
