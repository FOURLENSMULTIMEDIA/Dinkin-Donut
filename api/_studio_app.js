// Frame Studio app code. Served only to organisers by /api/studio after a PIN check; never as a public file.
/* eslint-disable */
module.exports = function frameStudio() {
  // ---------------- brand ----------------
  var NAVY = ["#2E3D60", "#1D2742", "#141B2E"], BEIGE = ["#FBF6EC", "#EFE6D4", "#DFD1B6"], BR = "#C9A86B", BR2 = "#9C7A45", IV = "#F4EFE3", NV = "#1D2840";
  var MARK_L = new Path2D("M96 44H76a56 56 0 0 0 0 112h20zM81 62h-5a27 38 0 0 0 0 76h5z"), MARK_R = new Path2D("M104 44h20a56 56 0 0 1 0 112h-20zM119 62h5a27 38 0 0 1 0 76h-5z");
  var T = {
    trail: { name: "The Dink Trail", d: "Arched photos, with the dink’s trajectory running across every slide.", pano: 1, min: 3, max: 6, def: 4 },
    gallery: { name: "The Gallery Wall", d: "Framed prints on a navy wall, some hanging across the joins.", pano: 1, min: 3, max: 6, def: 4 },
    wide: { name: "The Wide Shot", d: "One photo stretched across every slide: a true panorama.", pano: 1, min: 2, max: 5, def: 3 },
    linen: { name: "Prints on Linen", d: "Your photos as prints with brass clips on the tablecloth.", pano: 1, min: 3, max: 6, def: 4 },
    contact: { name: "The Contact Sheet", d: "A vintage proof sheet with numbered frames.", pano: 1, min: 2, max: 5, def: 3 },
    single: { name: "Single post · 1:1", d: "One photo in the club frame, with the Different D.", pano: 0, min: 1, max: 1, def: 1 },
    story: { name: "Story · 9:16", d: "An arched photo with your title, for stories.", pano: 0, min: 1, max: 1, def: 1, story: 1 },
    motion: { name: "In Motion · 1:1", d: "Your photo streaked with motion blur, toned navy, the club mark sharp in the middle.", pano: 0, min: 1, max: 1, def: 1 },
    motionstory: { name: "In Motion · Story", d: "The motion look at 9:16, with your title under the mark.", pano: 0, min: 1, max: 1, def: 1, story: 1 },
    explained: { name: "Explained · 1:1", d: "Big condensed yellow headline over your photo, toned sky blue. Great for tips.", pano: 0, min: 1, max: 1, def: 1 },
    explainedstory: { name: "Explained · Story", d: "The Explained look at 9:16 for stories.", pano: 0, min: 1, max: 1, def: 1, story: 1 },
    gameday: { name: "Gameday · 1:1", d: "Your photo in motion, toned green, the title in an outlined badge.", pano: 0, min: 1, max: 1, def: 1 },
    grand: { name: "Grand · 1:1", d: "A huge script over your photo and a cream event band along the bottom.", pano: 0, min: 1, max: 1, def: 1 },
    season: { name: "New Season · 1:1", d: "Your photo in a circle, the title curved around it and a red patch.", pano: 0, min: 1, max: 1, def: 1 },
    stillness: { name: "Stillness · 1:1", d: "A dark, tilted headline across your photo with painted court lines.", pano: 0, min: 1, max: 1, def: 1 },
    polaroids: { name: "Instant Prints · 1:1", d: "Three photos as instant prints on the clubhouse table, captions written underneath.", pano: 0, min: 1, max: 1, def: 1, ph: 3 },
    filmstrip: { name: "Film Strip · Story", d: "Three photos on a strip of 35mm film, frame numbers and all.", pano: 0, min: 1, max: 1, def: 1, story: 1, ph: 3 },
    cover: { name: "Magazine Cover · 1:1", d: "Your photo as the cover of the club magazine, with a masthead and cover lines.", pano: 0, min: 1, max: 1, def: 1 },
    versus: { name: "Versus · 1:1", d: "Two photos split by the net line, with a VS badge. For finals and rivalries.", pano: 0, min: 1, max: 1, def: 1, ph: 2 },
    scorebar: { name: "Final Score · 1:1", d: "Your photo with a broadcast-style score bar. Title = the score, small line = the teams.", pano: 0, min: 1, max: 1, def: 1 },
    grid4: { name: "Four Up · 1:1", d: "Four photos in a neat grid with the club badge in the middle.", pano: 0, min: 1, max: 1, def: 1, ph: 4 },
  };
  var st = { t: "trail", n: 4, theme: "navy", photos: [] };
  var $ = function (id) { return document.getElementById(id); };
  // ---------------- UI ----------------
  $("tpls").innerHTML = Object.keys(T).map(function (k) { return '<button class="tpl" type="button" data-t="' + k + '" aria-pressed="' + (k === st.t) + '"><div class="ico" data-ico="' + k + '"></div><b>' + T[k].name + "</b><small>" + T[k].d + "</small></button>"; }).join("");
  document.querySelectorAll("[data-ico]").forEach(function (el) { var c = document.createElement("canvas"); c.width = 340; c.height = 108; c.style.cssText = "width:100%;height:100%;display:block"; el.appendChild(c); icon(c, el.dataset.ico); });
  $("tpls").onclick = function (e) { var b = e.target.closest("[data-t]"); if (!b) return; st.t = b.dataset.t; st.n = T[st.t].def; document.querySelectorAll("[data-t]").forEach(function (x) { x.setAttribute("aria-pressed", x === b); }); counts(); render(); };
  function counts() { var t = T[st.t], h = ""; if (t.pano) for (var i = t.min; i <= t.max; i++) h += '<button type="button" data-n="' + i + '" aria-pressed="' + (i === st.n) + '">' + i + " slides</button>"; $("count").innerHTML = h; $("count").hidden = !t.pano; }
  $("count").onclick = function (e) { var b = e.target.closest("[data-n]"); if (!b) return; st.n = +b.dataset.n; counts(); render(); };
  $("theme").onclick = function (e) { var b = e.target.closest("[data-v]"); if (!b) return; st.theme = b.dataset.v; document.querySelectorAll("#theme button").forEach(function (x) { x.setAttribute("aria-pressed", x === b); }); render(); };
  ["title", "kicker"].forEach(function (id) { $(id).oninput = render; });
  $("file").onchange = function (e) { addFiles([].slice.call(e.target.files)); e.target.value = ""; };
  ["dragover", "drop"].forEach(function (ev) { $("drop").addEventListener(ev, function (e) { e.preventDefault(); if (ev === "drop") addFiles([].slice.call(e.dataTransfer.files)); }); });
  function addFiles(fs) { var left = fs.filter(function (f) { return /^image\//.test(f.type); }).length; if (!left) return;
    fs.forEach(function (f) { if (!/^image\//.test(f.type)) return; var u = URL.createObjectURL(f), im = new Image(); im.onload = function () { st.photos.push(im); thumbs(); render(); }; im.src = u; }); }
  $("sample").onclick = function () { st.photos = []; ["/assets/academy-coach.jpg", "/assets/video/opening-soon-poster.jpg", "/assets/video/academy-poster.jpg", "/assets/loyalty/card-front.png", "/assets/video/courtcall-poster.jpg", "/assets/og.png"].forEach(function (u) { var im = new Image(); im.onload = function () { st.photos.push(im); thumbs(); render(); }; im.src = u; }); };
  function thumbs() { $("thumbs").innerHTML = st.photos.map(function (p, i) { return '<div><img src="' + p.src + '" alt=""><button type="button" data-x="' + i + '" aria-label="Remove">×</button><span class="mv"><button type="button" data-l="' + i + '" aria-label="Move earlier">‹</button><button type="button" data-r="' + i + '" aria-label="Move later">›</button></span></div>'; }).join(""); }
  $("thumbs").onclick = function (e) { var b = e.target.closest("button"); if (!b) return; var i;
    if (b.dataset.x != null) st.photos.splice(+b.dataset.x, 1);
    if (b.dataset.l != null && (i = +b.dataset.l) > 0) st.photos.splice(i - 1, 0, st.photos.splice(i, 1)[0]);
    if (b.dataset.r != null && (i = +b.dataset.r) < st.photos.length - 1) st.photos.splice(i + 1, 0, st.photos.splice(i, 1)[0]);
    thumbs(); render(); };
  // ---------------- drawing helpers ----------------
  var grainTile = (function () { var c = document.createElement("canvas"); c.width = c.height = 256; var x = c.getContext("2d"), d = x.createImageData(256, 256); for (var i = 0; i < d.data.length; i += 4) { var v = Math.random() * 255; d.data[i] = d.data[i + 1] = d.data[i + 2] = v; d.data[i + 3] = 22; } x.putImageData(d, 0, 0); return c; })();
  function bg(x, W, H, theme, lights) {
    var P = theme === "beige" ? BEIGE : NAVY, g = x.createLinearGradient(0, 0, 0, H); g.addColorStop(0, P[1]); g.addColorStop(1, P[2]); x.fillStyle = g; x.fillRect(0, 0, W, H);
    (lights || [W / 2]).forEach(function (lx) { var r = x.createRadialGradient(lx, H * .28, 0, lx, H * .28, 820); r.addColorStop(0, P[0]); r.addColorStop(1, "rgba(0,0,0,0)"); x.globalAlpha = theme === "beige" ? .9 : .75; x.fillStyle = r; x.fillRect(0, 0, W, H); x.globalAlpha = 1; });
    x.save(); x.globalCompositeOperation = theme === "beige" ? "multiply" : "screen"; x.globalAlpha = theme === "beige" ? .25 : .35; x.fillStyle = x.createPattern(grainTile, "repeat"); x.fillRect(0, 0, W, H); x.restore();
  }
  function rails(x, W, H, theme) { x.save(); x.strokeStyle = theme === "beige" ? "rgba(156,122,69,.5)" : "rgba(201,168,107,.45)"; x.lineWidth = 1.5; [[110, 1], [118, .45], [H - 110, 1], [H - 118, .45]].forEach(function (l) { x.globalAlpha = l[1]; x.beginPath(); x.moveTo(0, l[0]); x.lineTo(W, l[0]); x.stroke(); }); x.restore(); }
  function mark(x, cx, cy, size, ink, noBall) { var s = size / 200; x.save(); x.translate(cx - size / 2, cy - size / 2); x.scale(s, s); x.fillStyle = ink; x.fill(MARK_L, "evenodd"); x.fill(MARK_R, "evenodd");
    x.strokeStyle = BR; x.lineWidth = 2.6; x.lineCap = "round"; x.beginPath(); x.moveTo(100, 34); x.lineTo(100, 166); x.stroke();
    if (!noBall) { x.setLineDash([1.5, 4.5]); x.lineWidth = 1.5; x.beginPath(); x.moveTo(60, 30); x.quadraticCurveTo(98, 0, 130, 28); x.stroke(); x.setLineDash([]); ball(x, 134, 32, 8.5); }
    x.restore(); }
  function ball(x, cx, cy, r) { x.fillStyle = "#E3CF7E"; x.beginPath(); x.arc(cx, cy, r, 0, 7); x.fill(); x.fillStyle = "rgba(29,40,64,.5)"; [[-.33, -.33, .15], [.35, -.22, .15], [0, .38, .15]].forEach(function (h) { x.beginPath(); x.arc(cx + h[0] * r, cy + h[1] * r, h[2] * r, 0, 7); x.fill(); }); }
  function cover(x, im, X, Y, W, H) { if (!im) { placeholder(x, X, Y, W, H); return; } var r = Math.max(W / im.width, H / im.height), w = im.width * r, h = im.height * r; x.save(); x.beginPath(); x.rect(X, Y, W, H); x.clip(); x.drawImage(im, X + (W - w) / 2, Y + (H - h) / 2, w, h); x.restore(); }
  function placeholder(x, X, Y, W, H) { x.save(); x.fillStyle = "#2A3756"; x.fillRect(X, Y, W, H); x.strokeStyle = "rgba(201,168,107,.25)"; x.lineWidth = 2; for (var i = -H; i < W; i += 28) { x.beginPath(); x.moveTo(X + i, Y + H); x.lineTo(X + i + H, Y); x.stroke(); } x.fillStyle = "rgba(244,239,227,.75)"; x.font = "700 " + Math.max(18, W * .05) + "px 'DM Sans'"; x.textAlign = "center"; x.textBaseline = "middle"; x.fillText("YOUR PHOTO", X + W / 2, Y + H / 2); x.restore(); }
  function arch(x, X, Y, W, H) { var r = W / 2; x.beginPath(); x.moveTo(X, Y + H); x.lineTo(X, Y + r); x.arc(X + r, Y + r, r, Math.PI, 0); x.lineTo(X + W, Y + H); x.closePath(); }
  function rr(x, X, Y, W, H, r) { x.beginPath(); x.roundRect(X, Y, W, H, r); }
  function shadow(x, b, oy, a) { x.shadowColor = "rgba(0,0,0," + (a || .45) + ")"; x.shadowBlur = b; x.shadowOffsetY = oy; }
  function noShadow(x) { x.shadowColor = "transparent"; x.shadowBlur = 0; x.shadowOffsetY = 0; }
  function text(x, s, X, Y, o) { x.save(); x.fillStyle = o.c; x.textAlign = o.a || "center"; x.textBaseline = "alphabetic";
    x.font = (o.it ? "italic 700 " : o.sans ? "700 " : "800 ") + o.s + "px " + (o.sans ? "'DM Sans'" : "Fraunces");
    if (o.ls) { try { x.letterSpacing = o.ls + "px"; } catch (e) {} } x.fillText(s, X, Y); x.restore(); }
  function titleBlock(x, cx, cy, theme, size) {
    var ink = theme === "beige" ? NV : IV, acc = theme === "beige" ? BR2 : BR, words = ($("title").value || "").trim(), k = ($("kicker").value || "").toUpperCase();
    text(x, k, cx, cy - size * 1.25, { s: 17, sans: 1, c: acc, ls: 7 });
    var parts = words.split(" "), last = parts.length > 1 ? parts.pop() : "";
    text(x, parts.join(" "), cx, cy, { s: size, c: ink }); if (last) text(x, last, cx, cy + size * .98, { s: size, it: 1, c: acc });
  }
  function trajectory(x, pts, theme) { x.save(); x.strokeStyle = theme === "beige" ? BR2 : BR; x.lineWidth = 3; x.lineCap = "round"; x.setLineDash([4, 13]); x.beginPath(); x.moveTo(pts[0][0], pts[0][1]);
    for (var i = 1; i < pts.length; i++) { var p = pts[i - 1], q = pts[i], mx = (p[0] + q[0]) / 2; x.bezierCurveTo(mx, p[1] - 150, mx, q[1] - 150, q[0], q[1]); } x.stroke(); x.restore(); var e = pts[pts.length - 1]; ball(x, e[0], e[1], 20); }
  // ---------------- poster helpers (from the club's sport posters) ----------------
  var LIME = "#E2E070";
  function cond(x, s, X, Y, size, col, o) { o = o || {}; x.save(); x.fillStyle = col; x.textAlign = o.a || "center"; x.textBaseline = "alphabetic";
    x.font = (o.wide ? "" : "extra-condensed ") + (o.w || 900) + " " + size + "px Archivo"; try { if ("fontStretch" in x) x.fontStretch = o.wide ? "normal" : "extra-condensed"; } catch (e) {}
    if (o.ls) { try { x.letterSpacing = o.ls + "px"; } catch (e) {} } x.fillText(String(s).toUpperCase(), X, Y); x.restore(); }
  function blurred(x, im, W, H, spread, ang) { if (!im) { placeholder(x, 0, 0, W, H); return; } var n2 = 36; x.save(); try { x.filter = "blur(1.5px)"; } catch (e) {}
    for (var k2 = 0; k2 < n2; k2++) { var t2 = (k2 / (n2 - 1) - 0.5) * spread; x.globalAlpha = 1 / (k2 + 1); x.save(); x.translate(t2, t2 * ang); cover(x, im, -spread, -spread, W + 2 * spread, H + 2 * spread); x.restore(); } x.restore(); }
  function tone(x, W, H, col, a) { x.save(); x.globalCompositeOperation = "color"; x.globalAlpha = a; x.fillStyle = col; x.fillRect(0, 0, W, H); x.restore(); }
  function grain(x, W, H, a) { x.save(); x.globalCompositeOperation = "overlay"; x.globalAlpha = a || 0.8; x.fillStyle = x.createPattern(grainTile, "repeat"); x.fillRect(0, 0, W, H); x.restore(); }
  function arcText(x, str, cx, cy, r, start, size, col, font, inside) { x.save(); x.fillStyle = col; x.font = font.replace("SZ", size); x.textAlign = "center"; x.textBaseline = "middle";
    var chars = str.split(""), widths = chars.map(function (ch) { return x.measureText(ch).width; }), total = widths.reduce(function (a, b) { return a + b; }, 0), ang = start - (inside ? -1 : 1) * total / r / 2;
    chars.forEach(function (ch, i) { var w = widths[i], a = ang + (inside ? -1 : 1) * w / r / 2; x.save(); x.translate(cx + Math.cos(a) * r, cy + Math.sin(a) * r); x.rotate(a + (inside ? -Math.PI / 2 : Math.PI / 2)); x.fillText(ch, 0, 0); x.restore(); ang += (inside ? -1 : 1) * w / r; }); x.restore(); }
  function words2(t) { var w = (t || "").trim().replace(/[.]$/, "").split(/\s+/); if (w.length < 2) return [w[0] || "", ""]; var h = Math.ceil(w.length / 2); return [w.slice(0, h).join(" "), w.slice(h).join(" ")]; }
  function fitSize(x, str, maxW, size, font) { x.save(); x.font = font.replace("SZ", size); try { if ("fontStretch" in x) x.fontStretch = "extra-condensed"; } catch (e) {} var w = x.measureText(String(str).toUpperCase()).width; x.restore(); return w > maxW ? size * maxW / w : size; }
  // ---------------- the layouts ----------------
  function draw(c, W, H) {
    var x = c.getContext("2d"), n = st.n, th = st.theme, P = st.photos, ink = th === "beige" ? NV : IV, acc = th === "beige" ? BR2 : BR, lights = []; for (var i = 0; i < n; i++) lights.push(i * 1080 + 540);
    var ph = function (i) { return P.length ? P[i % P.length] : null; };
    if (st.t === "trail") {
      bg(x, W, H, th, lights); rails(x, W, H, th);
      mark(x, 540, 470, 300, ink, 1); titleBlock(x, 540, 780, th, 92);
      var pts = [[540, 315]];
      for (var s = 1; s < n; s++) { var ox = s * 1080, up = s % 2, X = ox + 240, Y = up ? 230 : 300, w = 600, h = 640;
        x.save(); shadow(x, 50, 30); arch(x, X, Y, w, h); x.fillStyle = "#111"; x.fill(); noShadow(x); x.clip(); cover(x, ph(s - 1), X, Y, w, h); x.restore();
        x.save(); x.strokeStyle = acc; x.lineWidth = 2; arch(x, X - 16, Y - 16, w + 32, h + 32); x.stroke(); x.restore();
        text(x, "NO. " + ["I", "II", "III", "IV", "V", "VI"][s - 1], ox + 540, Y + h + 78, { s: 16, sans: 1, c: acc, ls: 7 });
        pts.push([ox + 540, (up ? 200 : 270) - 40]); }
      pts[pts.length - 1] = [W - 160, 190]; trajectory(x, pts, th);
    } else if (st.t === "gallery") {
      bg(x, W, H, th, lights);
      x.save(); x.strokeStyle = th === "beige" ? "rgba(156,122,69,.6)" : "rgba(201,168,107,.55)"; x.lineWidth = 3; x.beginPath(); x.moveTo(0, 120); x.lineTo(W, 120); x.stroke(); x.restore();
      mark(x, 540, 450, 260, ink, 1); titleBlock(x, 540, 740, th, 88);
      var specs = [], k = 0; for (var g9 = 0; ; g9++) { var tall = g9 % 2 === 0, w9 = tall ? 470 : 520, cx9 = 1080 + 380 + g9 * 700; if (cx9 + w9 / 2 > W - 90) break; specs.push([cx9 - w9 / 2, tall ? 250 : 340, w9, tall ? 600 : 420]); }
      specs.forEach(function (sp) { if (sp[0] + sp[2] > W - 60) return; var X = sp[0], Y = sp[1], w = sp[2], h = sp[3], m = 34;
        x.save(); x.strokeStyle = "rgba(201,168,107,.5)"; x.lineWidth = 1.5; x.beginPath(); x.moveTo(X + w / 2 - 70, Y); x.lineTo(X + w / 2, 120); x.lineTo(X + w / 2 + 70, Y); x.stroke(); x.restore();
        x.save(); shadow(x, 40, 26, .55); x.fillStyle = "#B8955C"; x.fillRect(X - 14, Y - 14, w + 28, h + 28); noShadow(x); x.fillStyle = "#F6F0E2"; x.fillRect(X, Y, w, h); cover(x, ph(k), X + m, Y + m, w - 2 * m, h - 2 * m); x.restore();
        x.fillStyle = th === "beige" ? "#FBF7EE" : "#F4EFE3"; x.fillRect(X + w / 2 - 90, Y + h + 40, 180, 44); text(x, "DD · " + String(++k).padStart(2, "0"), X + w / 2, Y + h + 70, { s: 15, sans: 1, c: NV, ls: 5 }); });
    } else if (st.t === "wide") {
      bg(x, W, H, th, lights); x.save(); x.beginPath(); x.rect(0, 150, W, H - 300); x.clip(); cover(x, ph(0), 0, 150, W, H - 300);
      var g = x.createLinearGradient(0, 150, 0, H - 150); g.addColorStop(0, "rgba(20,27,46,0)"); g.addColorStop(.55, "rgba(20,27,46,0)"); g.addColorStop(1, "rgba(20,27,46,.85)"); x.fillStyle = g; x.fillRect(0, 150, W, H - 300); x.restore();
      rails(x, W, H, th); text(x, ($("kicker").value || "").toUpperCase(), 120, 92, { s: 17, sans: 1, c: acc, ls: 7, a: "left" });
      var t = ($("title").value || "").trim(); text(x, t, 120, H - 210, { s: 96, c: IV, a: "left" });
      mark(x, W - 240, H - 300, 220, IV, 0); text(x, "@DINKDIFFERENTQA", W - 120, 92, { s: 16, sans: 1, c: acc, ls: 6, a: "right" });
    } else if (st.t === "linen") {
      var g2 = x.createLinearGradient(0, 0, 0, H); g2.addColorStop(0, "#E4D8C1"); g2.addColorStop(1, "#D3C3A4"); x.fillStyle = g2; x.fillRect(0, 0, W, H);
      x.save(); x.globalAlpha = .12; for (var yy = 0; yy < H; yy += 3) { x.fillStyle = yy % 6 ? "#7A6440" : "#FFFFFF"; x.fillRect(0, yy, W, 1); } for (var xx = 0; xx < W; xx += 3) { x.fillStyle = "#7A6440"; x.globalAlpha = .05; x.fillRect(xx, 0, 1, H); } x.restore();
      mark(x, 540, 430, 280, NV, 1); titleBlock(x, 540, 730, "beige", 90);
      var rot = [-4, 3, -2.5, 4, -3, 2.5], q = 0;
      for (var s2 = 1; s2 < n; s2++) { var cx2 = s2 * 1080 + 540 + (s2 % 2 ? -60 : 60), cy2 = 520 + (s2 % 2 ? -30 : 40), pw = 540, phh = 640;
        x.save(); x.translate(cx2, cy2); x.rotate(rot[q % 6] * Math.PI / 180); shadow(x, 40, 24, .38); x.fillStyle = "#FBF7EE"; x.fillRect(-pw / 2, -phh / 2, pw, phh); noShadow(x);
        cover(x, ph(q), -pw / 2 + 26, -phh / 2 + 26, pw - 52, phh - 150);
        text(x, ["Opening night", "Court two", "Golden hour", "The rally", "Handshakes", "The Honours"][q % 6], 0, phh / 2 - 46, { s: 36, it: 1, c: "#5A4A30" });
        x.fillStyle = "#B8955C"; x.strokeStyle = "#8E6C38"; x.lineWidth = 2; rr(x, -26, -phh / 2 - 46, 52, 90, 20); x.fill(); x.stroke(); x.restore(); q++; }
    } else if (st.t === "contact") {
      bg(x, W, H, "navy", lights); x.fillStyle = "#0B0F1A"; x.fillRect(0, 170, W, H - 340);
      x.fillStyle = "rgba(244,239,227,.18)"; for (var sx = 20; sx < W; sx += 54) { rr(x, sx, 190, 26, 18, 4); x.fill(); rr(x, sx, H - 208, 26, 18, 4); x.fill(); }
      var fw = 560, fh = 500, gap = (1080 * n - 140) / Math.max(1, Math.floor((1080 * n - 140) / (fw + 60))), cnt = Math.floor((1080 * n - 140) / (fw + 60));
      for (var f = 0; f < cnt; f++) { var fx = 70 + f * gap + (gap - fw) / 2, fy = 290;
        if (f === 0 && n > 1) { x.fillStyle = "#141B2E"; x.fillRect(fx, fy, fw, fh); mark(x, fx + fw / 2, fy + 200, 180, IV, 1); text(x, ($("title").value || "").trim(), fx + fw / 2, fy + 410, { s: 56, it: 1, c: BR }); }
        else cover(x, ph(f - (n > 1 ? 1 : 0)), fx, fy, fw, fh);
        text(x, String(f + 1).padStart(2, "0") + "A", fx, fy + fh + 50, { s: 22, sans: 1, c: "#E3CF7E", a: "left", ls: 3 }); text(x, "DINK DIFFERENT · " + String(f + 1).padStart(3, "0"), fx + fw, fy + fh + 50, { s: 15, sans: 1, c: "rgba(244,239,227,.55)", a: "right", ls: 4 }); }
      text(x, ($("kicker").value || "").toUpperCase(), 70, 120, { s: 17, sans: 1, c: BR, a: "left", ls: 7 }); text(x, "PROOF SHEET · PLAY WELL", W - 70, 120, { s: 15, sans: 1, c: "rgba(201,168,107,.7)", a: "right", ls: 6 });
    } else if (st.t === "explained" || st.t === "explainedstory") {
      var im = ph(0), story = st.t === "explainedstory"; cover(x, im, 0, 0, W, H); if (!im) placeholder(x, 0, 0, W, H);
      tone(x, W, H, "#3B6FA0", 0.7); var gS = x.createLinearGradient(0, 0, 0, H); gS.addColorStop(0, "rgba(40,80,125,.75)"); gS.addColorStop(.55, "rgba(40,80,125,.15)"); gS.addColorStop(1, "rgba(20,35,60,.65)"); x.fillStyle = gS; x.fillRect(0, 0, W, H);
      var ln = words2($("title").value || "The Dink"), y0 = story ? 380 : 150, sz = story ? 300 : 230;
      cond(x, "Explained:", W / 2, y0, 34, LIME, { wide: 1, w: 800, ls: 1 });
      var f1 = fitSize(x, ln[0], W - 120, sz, "extra-condensed 900 SZpx Archivo"), f2 = fitSize(x, ln[1], W - 120, sz, "extra-condensed 900 SZpx Archivo"), fz = Math.min(f1, f2 || f1);
      cond(x, ln[0], W / 2, y0 + 30 + fz * 0.84, fz, LIME); if (ln[1]) cond(x, ln[1], W / 2, y0 + 30 + fz * 1.68, fz, LIME);
      x.save(); x.fillStyle = LIME; x.textAlign = "center"; x.font = "italic 700 " + (story ? 34 : 28) + "px Archivo"; x.fillText(($("kicker").value || "").trim(), W / 2, H - (story ? 260 : 130)); x.restore();
      mark(x, W / 2 - 110, H - (story ? 190 : 72), 34, IV, 1); text(x, "DINK DIFFERENT", W / 2 + 18, H - (story ? 183 : 65), { s: 18, sans: 1, c: IV, ls: 4 }); grain(x, W, H, 0.5);
    } else if (st.t === "gameday") {
      blurred(x, ph(0), W, H, W * 0.2, -0.3); tone(x, W, H, "#2B4A3A", 0.75); x.fillStyle = "rgba(18,30,24,.35)"; x.fillRect(0, 0, W, H);
      var t3 = ($("title").value || "Gameday").trim().replace(/[.]$/, ""), fz3 = fitSize(x, t3, W - 300, 130, "extra-condensed 900 SZpx Archivo"), tw3;
      x.save(); x.font = "extra-condensed 900 " + fz3 + "px Archivo"; try { if ("fontStretch" in x) x.fontStretch = "extra-condensed"; } catch (e) {} tw3 = x.measureText(t3.toUpperCase()).width; x.restore();
      var bw3 = Math.min(W - 120, tw3 + 140), bh3 = fz3 * 1.2; x.save(); x.strokeStyle = IV; x.lineWidth = 6; rr(x, W / 2 - bw3 / 2, H / 2 - bh3 / 2 - 20, bw3, bh3, bh3 / 2); x.stroke(); x.restore();
      cond(x, t3, W / 2, H / 2 - 20 + fz3 * 0.32, fz3, IV);
      text(x, ($("kicker").value || "").toUpperCase(), W / 2, H / 2 + bh3 / 2 + 50, { s: 18, sans: 1, c: IV, ls: 7 }); mark(x, W / 2, H - 110, 60, IV, 1); grain(x, W, H, 0.7);
    } else if (st.t === "grand") {
      cover(x, ph(0), 0, 0, W, H - 180); if (!ph(0)) placeholder(x, 0, 0, W, H - 180); tone(x, W, H - 180, "#8A5A3A", 0.35); x.fillStyle = "rgba(40,20,10,.18)"; x.fillRect(0, 0, W, H - 180);
      var tw = words2($("title").value || "Grand Pickleball"), first = (tw[0] || "Grand"), rest = tw[1] || "Pickleball";
      x.save(); x.globalAlpha = 0.92; x.fillStyle = "#EFE6CF"; x.textAlign = "left"; var fs = 380; x.font = "italic 600 " + fs + "px Fraunces"; while (x.measureText(first).width > W * 1.05 && fs > 120) { fs -= 10; x.font = "italic 600 " + fs + "px Fraunces"; } x.fillText(first, -20, fs * 0.82); x.restore();
      x.save(); x.fillStyle = "#F7F2E6"; x.textAlign = "right"; x.font = "300 100px Archivo"; x.fillText(rest.toUpperCase(), W - 50, fs * 0.82 + 110); x.restore();
      x.fillStyle = "#ECE4CB"; x.fillRect(0, H - 180, W, 180); x.save(); x.fillStyle = "#2B2016"; x.textAlign = "left"; x.font = "extra-condensed 400 80px Archivo"; try { if ("fontStretch" in x) x.fontStretch = "condensed"; } catch (e) {} x.fillText("DINK DIFFERENT CLUB", 50, H - 88); x.restore();
      var kp = ($("kicker").value || "").split("·").map(function (p) { return p.trim(); }).filter(Boolean); while (kp.length < 3) kp.push(kp.length === 1 ? "8:00 P.M." : "DOHA, QATAR");
      [["left", 50], ["center", W / 2], ["right", W - 50]].forEach(function (q, i) { x.save(); x.fillStyle = "#2B2016"; x.textAlign = q[0]; x.font = "600 18px Archivo"; x.fillText(kp[i].toUpperCase(), q[1], H - 40); x.restore(); }); grain(x, W, H, 0.6);
    } else if (st.t === "season") {
      blurred(x, ph(0), W, H, W * 0.06, 0.2); tone(x, W, H, "#2F5F92", 0.6); x.fillStyle = "rgba(20,40,70,.25)"; x.fillRect(0, 0, W, H);
      x.save(); shadow(x, 40, 20, .4); x.beginPath(); x.arc(W / 2, H / 2, 240, 0, 7); x.fillStyle = "#000"; x.fill(); noShadow(x); x.clip(); cover(x, ph(0), W / 2 - 240, H / 2 - 240, 480, 480); x.restore();
      x.save(); x.strokeStyle = IV; x.lineWidth = 3; x.beginPath(); x.arc(W / 2, H / 2, 252, 0, 7); x.stroke(); x.restore();
      arcText(x, ($("title").value || "Dink Different Club Tournament").trim(), W / 2, H / 2, 320, -Math.PI / 2, 52, IV, "500 SZpx Fraunces", false);
      arcText(x, ($("kicker").value || "Open · all levels").toUpperCase(), W / 2, H / 2, 330, Math.PI / 2, 22, IV, "700 SZpx Archivo", true);
      x.save(); x.translate(W / 2, H / 2 + 40); x.rotate(-0.17); x.fillStyle = "#9E2B2F"; x.fillRect(-170, -70, 340, 140); x.restore();
      x.save(); x.translate(W / 2, H / 2 + 40); x.rotate(-0.17); cond(x, "New", 0, -5, 76, "#F7F2E6"); cond(x, "Season", 0, 60, 76, "#F7F2E6"); x.restore();
      text(x, "DINK DIFFERENT", 70, 70, { s: 14, sans: 1, c: IV, ls: 5, a: "left" }); text(x, "@DINKDIFFERENTQA", W - 70, H - 60, { s: 14, sans: 1, c: IV, ls: 5, a: "right" }); grain(x, W, H, 0.6);
    } else if (st.t === "stillness") {
      cover(x, ph(0), 0, 0, W, H); if (!ph(0)) placeholder(x, 0, 0, W, H); tone(x, W, H, "#1D2840", 0.55); x.fillStyle = "rgba(10,14,28,.45)"; x.fillRect(0, 0, W, H);
      x.save(); x.strokeStyle = "rgba(237,231,185,.85)"; x.lineWidth = 6; x.beginPath(); x.moveTo(-40, 980); x.lineTo(W + 40, 520); x.moveTo(330, H + 40); x.lineTo(250, 620); x.stroke(); x.restore();
      var ls = words2($("title").value || "Stillness before the serve"); x.save(); x.translate(110, 560); x.rotate(-24 * Math.PI / 180);
      var fz5 = Math.min(fitSize(x, ls[0], 900, 130, "extra-condensed 900 SZpx Archivo"), ls[1] ? fitSize(x, ls[1], 900, 130, "extra-condensed 900 SZpx Archivo") : 999);
      cond(x, ls[0], 0, 0, fz5, "#EDE7B9", { a: "left" }); if (ls[1]) cond(x, ls[1], 0, fz5 * 0.88, fz5, "#EDE7B9", { a: "left" }); x.restore();
      x.save(); x.fillStyle = "#EDE7B9"; x.textAlign = "left"; x.font = "600 26px Fraunces"; x.fillText("The quiet before the point.", 620, 830); x.font = "500 16px 'DM Sans'"; x.fillText(($("kicker").value || "").trim(), 620, 862); x.restore();
      text(x, "POSTER · DINK DIFFERENT", 64, 70, { s: 12, sans: 1, c: "rgba(237,231,185,.8)", ls: 5, a: "left" }); grain(x, W, H, 0.7);
    } else if (st.t === "polaroids") {
      var gl = x.createLinearGradient(0, 0, 0, H); gl.addColorStop(0, th === "beige" ? "#E4D8C1" : "#1F2A47"); gl.addColorStop(1, th === "beige" ? "#D3C3A4" : "#141B2E"); x.fillStyle = gl; x.fillRect(0, 0, W, H); grain(x, W, H, 0.5);
      var caps = ((($("kicker").value || "").split("·").map(function (q) { return q.trim(); }).filter(Boolean)).concat(["Court two", "Golden hour", "Good game"])).slice(0, 3);
      [[300, 420, -7], [740, 380, 5], [520, 640, -2]].forEach(function (q, i) { x.save(); x.translate(q[0], q[1]); x.rotate(q[2] * Math.PI / 180); shadow(x, 34, 18, .4); x.fillStyle = "#FBF8F1"; x.fillRect(-190, -210, 380, 440); noShadow(x); cover(x, ph(i), -168, -188, 336, 330);
        x.fillStyle = "#3A3326"; x.font = "italic 500 30px Fraunces"; x.textAlign = "center"; x.fillText(caps[i], 0, 196); x.restore(); });
      text(x, ($("title").value || "").trim(), 70, 120, { s: 64, it: 1, c: th === "beige" ? NV : IV, a: "left" }); mark(x, W - 100, 100, 70, th === "beige" ? NV : IV, 1);
    } else if (st.t === "filmstrip") {
      x.fillStyle = "#121212"; x.fillRect(0, 0, W, H); var fx = 200, fw = 680;
      x.fillStyle = "#1A1A1A"; x.fillRect(fx - 90, 0, fw + 180, H);
      for (var y9 = 20; y9 < H; y9 += 56) { x.fillStyle = "#EDE6D6"; rr(x, fx - 66, y9, 34, 26, 5); x.fill(); rr(x, fx + fw + 32, y9, 34, 26, 5); x.fill(); }
      for (var f9 = 0; f9 < 3; f9++) { var fy = 120 + f9 * 560; cover(x, ph(f9), fx, fy, fw, 500); x.save(); x.fillStyle = "#E3B04B"; x.font = "700 18px 'DM Sans'"; x.textAlign = "left"; x.fillText(String(f9 * 2 + 12) + "A   DINK DIFFERENT 400", fx + 6, fy - 14); x.restore(); }
      x.fillStyle = "rgba(18,18,18,.85)"; x.fillRect(0, H - 230, W, 230); text(x, ($("title").value || "").trim(), W / 2, H - 130, { s: 66, it: 1, c: IV }); text(x, ($("kicker").value || "").toUpperCase(), W / 2, H - 78, { s: 16, sans: 1, c: BR, ls: 6 }); grain(x, W, H, 0.6);
    } else if (st.t === "cover") {
      cover(x, ph(0), 0, 0, W, H); if (!ph(0)) placeholder(x, 0, 0, W, H); var gc = x.createLinearGradient(0, 0, 0, H); gc.addColorStop(0, "rgba(12,16,30,.55)"); gc.addColorStop(.35, "rgba(12,16,30,0)"); gc.addColorStop(.7, "rgba(12,16,30,0)"); gc.addColorStop(1, "rgba(12,16,30,.75)"); x.fillStyle = gc; x.fillRect(0, 0, W, H);
      x.save(); x.fillStyle = IV; x.textAlign = "center"; x.font = "600 250px Fraunces"; x.fillText("Dink", W / 2, 240); x.restore();
      text(x, "THE CLUB MAGAZINE · ISSUE 01 · DOHA", W / 2, 300, { s: 15, sans: 1, c: IV, ls: 6 });
      x.fillStyle = BR; x.fillRect(64, H - 250, 6, 150);
      text(x, ($("title").value || "").trim(), 90, H - 190, { s: 62, c: IV, a: "left" }); text(x, ($("kicker").value || "").trim(), 90, H - 140, { s: 26, it: 1, c: "#E2D2A6", a: "left" });
      text(x, "DINKDIFFERENT.QA", W - 64, H - 64, { s: 14, sans: 1, c: IV, ls: 5, a: "right" }); x.save(); x.fillStyle = IV; for (var b9 = 0; b9 < 26; b9++) x.fillRect(64 + b9 * 4 + (b9 % 3), H - 100, b9 % 4 ? 2 : 3, 46); x.restore(); grain(x, W, H, 0.5);
    } else if (st.t === "versus") {
      x.save(); x.beginPath(); x.moveTo(0, 0); x.lineTo(W * .58, 0); x.lineTo(W * .42, H); x.lineTo(0, H); x.closePath(); x.clip(); cover(x, ph(0), 0, 0, W * .6, H); x.restore();
      x.save(); x.beginPath(); x.moveTo(W * .58, 0); x.lineTo(W, 0); x.lineTo(W, H); x.lineTo(W * .42, H); x.closePath(); x.clip(); cover(x, ph(1), W * .4, 0, W * .6, H); x.restore();
      x.save(); x.strokeStyle = IV; x.lineWidth = 10; x.beginPath(); x.moveTo(W * .58, 0); x.lineTo(W * .42, H); x.stroke(); x.restore();
      x.fillStyle = "rgba(12,16,30,.55)"; x.fillRect(0, H - 170, W, 170); x.save(); shadow(x, 20, 8, .4); x.beginPath(); x.arc(W / 2, H / 2, 86, 0, 7); x.fillStyle = NV; x.fill(); noShadow(x); x.strokeStyle = BR; x.lineWidth = 4; x.stroke(); x.restore();
      cond(x, "VS", W / 2, H / 2 + 30, 92, IV); text(x, ($("title").value || "").trim(), W / 2, H - 90, { s: 56, c: IV }); text(x, ($("kicker").value || "").toUpperCase(), W / 2, H - 44, { s: 15, sans: 1, c: "#E2D2A6", ls: 6 });
    } else if (st.t === "scorebar") {
      cover(x, ph(0), 0, 0, W, H); if (!ph(0)) placeholder(x, 0, 0, W, H); x.fillStyle = "rgba(12,16,30,.25)"; x.fillRect(0, 0, W, H);
      var sc = ($("title").value || "11–9").trim(), teams = ($("kicker").value || "Home · Visitors").split(/·|vs/i).map(function (q) { return q.trim(); }).filter(Boolean); while (teams.length < 2) teams.push("Visitors");
      var by = H - 210; x.fillStyle = NV; x.fillRect(60, by, W - 120, 120); x.fillStyle = BR; x.fillRect(60, by, 12, 120); x.fillStyle = IV; x.fillRect(W / 2 - 110, by - 16, 220, 152);
      x.save(); x.fillStyle = NV; x.textAlign = "center"; x.font = "600 92px Fraunces"; x.fillText(sc, W / 2, by + 92); x.restore();
      text(x, teams[0].toUpperCase(), 110, by + 74, { s: 26, sans: 1, c: IV, ls: 3, a: "left" }); text(x, teams[1].toUpperCase(), W - 100, by + 74, { s: 26, sans: 1, c: IV, ls: 3, a: "right" });
      x.fillStyle = "#9E2B2F"; x.fillRect(60, by - 46, 150, 40); text(x, "FINAL", 135, by - 17, { s: 18, sans: 1, c: IV, ls: 4 }); mark(x, W - 110, 110, 80, IV, 1); text(x, "DINK DIFFERENT", 64, 100, { s: 16, sans: 1, c: IV, ls: 6, a: "left" });
    } else if (st.t === "grid4") {
      x.fillStyle = th === "beige" ? "#F2ECDF" : "#141B2E"; x.fillRect(0, 0, W, H); var g4 = 16, c4 = (W - g4 * 3) / 2;
      for (var q4 = 0; q4 < 4; q4++) cover(x, ph(q4), g4 + (q4 % 2) * (c4 + g4), g4 + Math.floor(q4 / 2) * (c4 + g4), c4, c4);
      x.save(); shadow(x, 30, 10, .4); x.beginPath(); x.arc(W / 2, H / 2, 118, 0, 7); x.fillStyle = th === "beige" ? "#F2ECDF" : NV; x.fill(); noShadow(x); x.strokeStyle = BR; x.lineWidth = 3; x.stroke(); x.restore();
      mark(x, W / 2, H / 2 - 20, 100, th === "beige" ? NV : IV, 1); text(x, ($("title").value || "").trim().slice(0, 16), W / 2, H / 2 + 62, { s: 26, it: 1, c: th === "beige" ? BR2 : BR });
    } else if (st.t === "motion" || st.t === "motionstory") {
      // motion blur: the photo drawn many times along a diagonal at low opacity, then toned to the club palette
      var im = ph(0); x.fillStyle = "#141B2E"; x.fillRect(0, 0, W, H);
      if (im) { var n2 = 36, spread = W * 0.16, ang = -0.18; x.save(); try { x.filter = "blur(1.5px)"; } catch (e) {}
        for (var k2 = 0; k2 < n2; k2++) { var t2 = (k2 / (n2 - 1) - 0.5) * spread; x.globalAlpha = 1 / (k2 + 1); x.save(); x.translate(t2, t2 * ang); cover(x, im, -spread, -spread, W + 2 * spread, H + 2 * spread); x.restore(); } x.restore(); }
      else placeholder(x, 0, 0, W, H);
      x.save(); x.globalCompositeOperation = "color"; x.fillStyle = th === "beige" ? "#B89B72" : "#1D2840"; x.globalAlpha = 0.55; x.fillRect(0, 0, W, H); x.restore();
      x.save(); x.globalCompositeOperation = "multiply"; var gm = x.createLinearGradient(0, 0, 0, H); gm.addColorStop(0, "rgba(20,27,46,.25)"); gm.addColorStop(1, "rgba(20,27,46,.7)"); x.fillStyle = gm; x.fillRect(0, 0, W, H); x.restore();
      x.save(); x.globalCompositeOperation = "overlay"; x.globalAlpha = 0.9; x.fillStyle = x.createPattern(grainTile, "repeat"); x.fillRect(0, 0, W, H); x.fillRect(0, 0, W, H); x.restore();
      var cy2 = st.t === "motionstory" ? H * 0.44 : H * 0.44; mark(x, W / 2, cy2, st.t === "motionstory" ? 190 : 170, IV, 0);
      text(x, "Dink Different", W / 2, cy2 + 160, { s: st.t === "motionstory" ? 88 : 76, c: IV });
      text(x, ($("kicker").value || "Pickleball Club · Doha").toUpperCase(), W / 2, cy2 + 214, { s: 16, sans: 1, c: BR, ls: 7 });
      if (st.t === "motionstory") { var tt = ($("title").value || "").trim(); if (tt) text(x, tt, W / 2, H - 260, { s: 64, it: 1, c: IV }); }
      text(x, "@DINKDIFFERENTQA", W / 2, H - 80, { s: 14, sans: 1, c: "rgba(244,239,227,.75)", ls: 6 });
    } else if (st.t === "single") {
      bg(x, W, H, th); var m2 = 90; x.save(); shadow(x, 40, 24); x.fillStyle = "#000"; x.fillRect(m2, m2, W - 2 * m2, H - 300); noShadow(x); x.beginPath(); x.rect(m2, m2, W - 2 * m2, H - 300); x.clip(); cover(x, ph(0), m2, m2, W - 2 * m2, H - 300); x.restore();
      x.save(); x.strokeStyle = acc; x.lineWidth = 2; x.strokeRect(m2 - 14, m2 - 14, W - 2 * m2 + 28, H - 300 + 28); x.restore();
      mark(x, W - 150, H - 110, 110, ink, 1); var t2 = ($("title").value || "").trim(); text(x, t2, m2, H - 112, { s: 58, c: ink, a: "left" }); text(x, ($("kicker").value || "").toUpperCase(), m2, H - 66, { s: 14, sans: 1, c: acc, a: "left", ls: 5 });
    } else if (st.t === "story") {
      bg(x, W, H, th); var X3 = 150, Y3 = 300, w3 = 780, h3 = 1000;
      x.save(); shadow(x, 60, 30); arch(x, X3, Y3, w3, h3); x.fillStyle = "#000"; x.fill(); noShadow(x); x.clip(); cover(x, ph(0), X3, Y3, w3, h3); x.restore();
      x.save(); x.strokeStyle = acc; x.lineWidth = 2.5; arch(x, X3 - 18, Y3 - 18, w3 + 36, h3 + 36); x.stroke(); x.restore();
      mark(x, 540, 200, 120, ink, 0); titleBlock(x, 540, 1500, th, 104);
    }
  }
  function icon(c, k) { var x = c.getContext("2d"), W = c.width, H = c.height; x.fillStyle = "#1D2742"; x.fillRect(0, 0, W, H); x.strokeStyle = BR; x.fillStyle = "rgba(244,239,227,.85)"; x.lineWidth = 2;
    if (k === "trail") { for (var i = 0; i < 3; i++) { arch(x, 40 + i * 100, 30, 60, 64); x.fill(); } x.setLineDash([2, 5]); x.beginPath(); x.moveTo(20, 40); x.bezierCurveTo(120, -10, 220, 40, 320, 18); x.stroke(); }
    if (k === "gallery") { [[30, 26, 70, 60], [130, 34, 60, 44], [210, 22, 90, 66]].forEach(function (r) { x.fillStyle = "#B8955C"; x.fillRect(r[0] - 4, r[1] - 4, r[2] + 8, r[3] + 8); x.fillStyle = "rgba(244,239,227,.85)"; x.fillRect(r[0], r[1], r[2], r[3]); }); }
    if (k === "wide") { x.fillRect(0, 22, W, 64); x.fillStyle = "#1D2742"; x.font = "italic 700 22px Fraunces"; x.fillText("Opening night.", 16, 78); }
    if (k === "linen") { x.fillStyle = "#DCCFB6"; x.fillRect(0, 0, W, H); [[60, -5], [170, 4], [270, -3]].forEach(function (p) { x.save(); x.translate(p[0], 56); x.rotate(p[1] * Math.PI / 180); x.fillStyle = "#FBF7EE"; x.fillRect(-36, -40, 72, 82); x.fillStyle = "#9AA4B8"; x.fillRect(-30, -34, 60, 56); x.restore(); }); }
    if (k === "contact") { x.fillStyle = "#0B0F1A"; x.fillRect(0, 14, W, 80); x.fillStyle = "rgba(244,239,227,.8)"; for (var j = 0; j < 4; j++) x.fillRect(14 + j * 82, 28, 70, 52); }
    if (k === "single") { x.fillRect(110, 10, 120, 74); x.strokeRect(104, 4, 132, 86); }
    if (k === "story") { arch(x, 140, 6, 60, 96); x.fill(); }
    if (k === "explained" || k === "explainedstory") { x.fillStyle = "#4A7DAF"; x.fillRect(0, 0, W, H); cond(x, "Explained", W / 2, 66, 54, LIME); }
    if (k === "gameday") { x.fillStyle = "#2B4A3A"; x.fillRect(0, 0, W, H); x.strokeStyle = IV; x.lineWidth = 2; rr(x, W / 2 - 90, 34, 180, 42, 21); x.stroke(); cond(x, "Gameday", W / 2, 66, 32, IV); }
    if (k === "grand") { x.fillStyle = "#9A7A5E"; x.fillRect(0, 0, W, H); x.fillStyle = "#ECE4CB"; x.fillRect(0, 80, W, 28); x.fillStyle = "#EFE6CF"; x.font = "italic 600 58px Fraunces"; x.textAlign = "left"; x.fillText("Grand", 14, 60); }
    if (k === "season") { x.fillStyle = "#3D6E9E"; x.fillRect(0, 0, W, H); x.beginPath(); x.arc(W / 2, H / 2, 36, 0, 7); x.fillStyle = "#D6D55A"; x.fill(); x.fillStyle = "#9E2B2F"; x.fillRect(W / 2 - 26, H / 2 - 8, 52, 16); }
    if (k === "stillness") { x.fillStyle = "#1A2238"; x.fillRect(0, 0, W, H); x.save(); x.translate(40, 90); x.rotate(-0.3); cond(x, "Stillness", 0, 0, 50, "#EDE7B9", { a: "left" }); x.restore(); }
    if (k === "polaroids") { [[90, -6], [170, 4], [250, -3]].forEach(function (q) { x.save(); x.translate(q[0], 56); x.rotate(q[1] * Math.PI / 180); x.fillStyle = "#FBF8F1"; x.fillRect(-36, -42, 72, 84); x.fillStyle = "#9AA4B8"; x.fillRect(-30, -36, 60, 56); x.restore(); }); }
    if (k === "filmstrip") { x.fillStyle = "#1A1A1A"; x.fillRect(0, 0, W, H); x.fillStyle = "#9AA4B8"; for (var f8 = 0; f8 < 4; f8++) x.fillRect(30 + f8 * 76, 26, 66, 56); x.fillStyle = "#EDE6D6"; for (var s8 = 0; s8 < 16; s8++) { x.fillRect(10 + s8 * 21, 10, 10, 8); x.fillRect(10 + s8 * 21, 90, 10, 8); } }
    if (k === "cover") { x.fillStyle = "#7D8AA8"; x.fillRect(0, 0, W, H); x.fillStyle = IV; x.font = "600 58px Fraunces"; x.textAlign = "center"; x.fillText("Dink", W / 2, 60); }
    if (k === "versus") { x.fillStyle = "#7D8AA8"; x.fillRect(0, 0, W, H); x.fillStyle = "#A9B3C7"; x.beginPath(); x.moveTo(W * .58, 0); x.lineTo(W, 0); x.lineTo(W, H); x.lineTo(W * .42, H); x.fill(); x.beginPath(); x.arc(W / 2, H / 2, 26, 0, 7); x.fillStyle = "#1D2742"; x.fill(); cond(x, "VS", W / 2, H / 2 + 9, 26, IV); }
    if (k === "scorebar") { x.fillStyle = "#7D8AA8"; x.fillRect(0, 0, W, H); x.fillStyle = "#1D2742"; x.fillRect(20, 66, W - 40, 28); x.fillStyle = IV; x.fillRect(W / 2 - 30, 60, 60, 40); }
    if (k === "grid4") { x.fillStyle = "rgba(244,239,227,.85)"; [[96, 8], [174, 8], [96, 56], [174, 56]].forEach(function (r) { x.fillRect(r[0], r[1], 72, 44); }); x.beginPath(); x.arc(170, 54, 14, 0, 7); x.fillStyle = "#1D2742"; x.fill(); }
    if (k === "motion" || k === "motionstory") { var gg = x.createLinearGradient(0, 0, W, 0); gg.addColorStop(0, "rgba(244,239,227,.05)"); gg.addColorStop(.5, "rgba(244,239,227,.5)"); gg.addColorStop(1, "rgba(244,239,227,.05)"); x.fillStyle = gg; for (var r3 = 0; r3 < 6; r3++) x.fillRect(0, 12 + r3 * 15, W, 6); mark(x, W / 2, H / 2, 54, IV, 1); } }
  // ---------------- render & export ----------------
  var canvases = [];
  function render() {
    var t = T[st.t], n = t.pano ? st.n : 1, W = t.pano ? 1080 * n : 1080, H = t.story ? 1920 : 1080;
    var big = document.createElement("canvas"); big.width = W; big.height = H; draw(big, W, H);
    canvases = []; var strip = $("strip"); strip.innerHTML = "";
    for (var i = 0; i < n; i++) { var c = document.createElement("canvas"); c.width = 1080; c.height = H; c.getContext("2d").drawImage(big, i * 1080, 0, 1080, H, 0, 0, 1080, H); canvases.push(c); strip.appendChild(c); }
    var need = t.pano ? (st.t === "wide" ? 1 : st.t === "contact" ? Math.max(1, Math.floor((1080 * n - 140) / 620) - 1) : st.t === "gallery" ? n + 1 : n - 1) : (t.ph || 1);
    $("need").textContent = st.photos.length ? st.photos.length + " photo" + (st.photos.length === 1 ? "" : "s") + " added · this layout shows " + need : "This layout shows " + need + " photo" + (need === 1 ? "" : "s") + ". Photos repeat if you add fewer.";
    $("hint").textContent = t.pano ? "Post all " + n + " slides as one carousel, in order. They join into one picture as people swipe." : t.story ? "1080 × 1920 · story" : "1080 × 1080 · square post";
  }
  function blobs() { return Promise.all(canvases.map(function (c) { return new Promise(function (r) { c.toBlob(r, "image/jpeg", .94); }); })); }
  $("save").onclick = function () { blobs().then(function (bs) { bs.forEach(function (b, i) { var a = document.createElement("a"); a.href = URL.createObjectURL(b); a.download = "dink-different-" + st.t + "-" + String(i + 1).padStart(2, "0") + ".jpg"; document.body.appendChild(a); setTimeout(function () { a.click(); a.remove(); }, i * 350); }); }); };
  if (navigator.canShare) { $("share").hidden = false; $("share").onclick = function () { blobs().then(function (bs) { var files = bs.map(function (b, i) { return new File([b], "dink-different-" + String(i + 1).padStart(2, "0") + ".jpg", { type: "image/jpeg" }); }); if (navigator.canShare({ files: files })) navigator.share({ files: files }).catch(function () {}); else $("save").click(); }); }; }
  counts();
  (document.fonts && document.fonts.load ? Promise.all([document.fonts.load("800 40px Fraunces"), document.fonts.load("900 40px Archivo"), document.fonts.load("italic 700 40px Fraunces"), document.fonts.load("700 20px 'DM Sans'")]) : Promise.resolve()).then(render, render);
}.toString();
