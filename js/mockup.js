// Photo mockups: real tee and polo photos, dyed to each colourway, with a quiet, premium finish.
// Layers: photo → colour multiplied in → tonal piqué texture → details & print → the photo's folds over everything.
// Design language: restraint. Small embroidered crest, fine double tipping, tonal texture, a woven hem flag,
// tracked small-caps name and a refined number on the back, and the Kitchen Line as a single hairline.
// Mockup.render(kind, opts, ways) returns SVG markup; Mockup.tee/pro/polo(opts) are shortcuts for the films.
(function () {
  var IMG = { "tee-front": [882, 926], "tee-back": [896, 938], "polo-front": [991, 1174], "polo-back": [974, 1173] };
  var Z = {
    tee: { crest: [0.635, 0.245, 0.085], flag: [0.27, 0.905], cuffs: [[[0.02, 0.215], [0.17, 0.265]], [[0.98, 0.215], [0.83, 0.265]]], neck: 0.075, name: 0.2, num: 0.255, numH: 0.15, line: 0.7, tag: 0.885 },
    polo: { crest: [0.685, 0.33, 0.08], flag: [0.25, 0.915], cuffs: [[[0.0, 0.405], [0.205, 0.455]], [[1.0, 0.405], [0.795, 0.455]]], neck: 0.085, name: 0.185, num: 0.24, numH: 0.15, line: 0.7, tag: 0.9 },
  };
  var uid = 0;
  var esc = function (s) { return String(s || "").replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); };
  function rng(str) { var h = 2166136261; for (var i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); } var x = h >>> 0 || 1; return function () { x ^= x << 13; x >>>= 0; x ^= x >>> 17; x ^= x << 5; x >>>= 0; return x / 4294967296; }; }
  function lum(hex) { var n = parseInt(String(hex || "#ffffff").slice(1), 16); return (0.299 * (n >> 16) + 0.587 * ((n >> 8) & 255) + 0.114 * (n & 255)) / 255; }

  function colours(w) {
    var body = w.body || "#F3EEE4";
    var ink = w.ink || w.num || (lum(body) > 0.55 ? "#16223A" : "#F3EDE2");
    if (Math.abs(lum(ink) - lum(body)) < 0.25) ink = lum(body) > 0.55 ? "#16223A" : "#F3EDE2";
    var tip = w.tip || w.glow || ink, tip2 = w.tip2 || w.sweep || "#C9A14A";
    return { body: body, ink: ink, tip: tip, tip2: tip2, sweep: w.sweep || tip2, glow: w.glow || tip, dots: w.dots || w.sweep || tip2, light: lum(body) > 0.55 };
  }

  function render(kind, o, ways) {
    o = o || {};
    var back = o.side === "back", key = kind + "-" + (back ? "back" : "front"), size = IMG[key], W = size[0], H = size[1];
    var w = (ways && ways[o.way]) || (ways && ways[Object.keys(ways)[0]]) || {}, c = colours(w), z = Z[kind], id = "mk" + (++uid);
    var src = "/assets/mockups/" + key + ".png", mask = "/assets/mockups/" + key + "-mask.png", code = o.code || "DD-0000";
    var ed = !!o.edition, gold = "url(#" + id + "g)", hair = ed ? gold : c.tip2;
    var P = function (x, y) { return (x * W).toFixed(1) + " " + (y * H).toFixed(1); };
    var s = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 ' + W + " " + H + '" class="mock" role="img" aria-label="' + esc((w.label || "") + " " + kind + (back ? " back" : " front")) + '"><desc>' + code + "</desc>";
    s += "<defs>" +
      '<mask id="' + id + 'm" maskUnits="userSpaceOnUse" x="0" y="0" width="' + W + '" height="' + H + '"><image href="' + mask + '" xlink:href="' + mask + '" width="' + W + '" height="' + H + '"/></mask>' +
      // tonal piqué: tiny pickleball holes in a staggered grid, same colour family as the fabric
      '<pattern id="' + id + 'pq" width="26" height="22" patternUnits="userSpaceOnUse"><circle cx="6" cy="6" r="3.1"/><circle cx="19" cy="17" r="3.1"/></pattern>' +
      '<linearGradient id="' + id + 'hg" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#fff"/><stop offset=".1" stop-color="#fff" stop-opacity=".6"/><stop offset=".24" stop-color="#fff" stop-opacity="0"/></linearGradient>' +
      '<mask id="' + id + 'hm" maskUnits="userSpaceOnUse" x="0" y="0" width="' + W + '" height="' + H + '"><rect width="' + W + '" height="' + H + '" fill="url(#' + id + 'hg)"/></mask>' +
      '<filter id="' + id + 'b1" filterUnits="userSpaceOnUse" x="' + -W + '" y="' + -H + '" width="' + 3 * W + '" height="' + 3 * H + '"><feGaussianBlur stdDeviation="' + (W * 0.05).toFixed(1) + '"/></filter>' +
      '<filter id="' + id + 'b2" filterUnits="userSpaceOnUse" x="' + -W + '" y="' + -H + '" width="' + 3 * W + '" height="' + 3 * H + '"><feGaussianBlur stdDeviation="' + (W * 0.035).toFixed(1) + '"/></filter>' +
      '<filter id="' + id + 'b0" filterUnits="userSpaceOnUse" x="' + -W + '" y="' + -H + '" width="' + 3 * W + '" height="' + 3 * H + '"><feGaussianBlur stdDeviation="1.4"/></filter>' +
      '<filter id="' + id + 'em" x="-10%" y="-10%" width="120%" height="120%"><feDropShadow dx="0" dy="1.2" stdDeviation=".8" flood-color="#000" flood-opacity=".35"/></filter>' +
      (ed ? '<linearGradient id="' + id + 'g" x1="0" x2="1" y1="0" y2=".3"><stop offset="0" stop-color="#B8862A"/><stop offset=".35" stop-color="#F6E3A1"/><stop offset=".6" stop-color="#D8A93E"/><stop offset=".85" stop-color="#FBEFC4"/><stop offset="1" stop-color="#A97A22"/></linearGradient>' : "") +
      "</defs>";
    s += '<g mask="url(#' + id + 'm)" style="isolation:isolate"><rect width="' + W + '" height="' + H + '" fill="#fff"/>';
    s += '<image href="' + src + '" xlink:href="' + src + '" width="' + W + '" height="' + H + '"/>';
    // THE GLAZE POUR: a sweep of glaze poured from one shoulder across the body, generated from the name
    var R2 = rng("pour|" + (o.name || code) + "|" + o.way), fromLeft = R2() < 0.5, flip = back ? !fromLeft : fromLeft;
    var x0 = flip ? -0.1 + R2() * 0.12 : 0.98 + R2() * 0.12, x1 = flip ? 0.55 + R2() * 0.45 : 0.45 - R2() * 0.45, bw = 0.2 + R2() * 0.12;
    var wob = function () { return (R2() - 0.5) * 0.18; };
    var band = function (k) { // centre line of the pour, offset by k (fraction of band width)
      var o2 = k * bw, ax = x0 + o2, bx = x1 + o2;
      return [[ax, -0.06], [ax + (bx - ax) * 0.33 + wob(), 0.3], [ax + (bx - ax) * 0.66 + wob(), 0.66], [bx, 1.08]];
    };
    var L = band(-0.5), Rt = band(0.5);
    var path = "M" + P(L[0][0], L[0][1]) + " C" + P(L[1][0], L[1][1]) + " " + P(L[2][0], L[2][1]) + " " + P(L[3][0], L[3][1]) + " L" + P(Rt[3][0], Rt[3][1]) + " C" + P(Rt[2][0], Rt[2][1]) + " " + P(Rt[1][0], Rt[1][1]) + " " + P(Rt[0][0], Rt[0][1]) + "Z";
    var core = band(0), corePath = "M" + P(core[0][0], core[0][1]) + " C" + P(core[1][0], core[1][1]) + " " + P(core[2][0], core[2][1]) + " " + P(core[3][0], core[3][1]);
    s += '<g style="mix-blend-mode:multiply"><rect width="' + W + '" height="' + H + '" fill="' + c.body + '"/>';
    s += '<path d="' + path + '" fill="' + c.sweep + '" filter="url(#' + id + 'b1)" opacity=".95"/>';
    s += '<path d="' + corePath + '" fill="none" stroke="' + (ed ? "#F6E3A1" : c.glow) + '" stroke-width="' + (W * bw * 0.32).toFixed(1) + '" stroke-linecap="round" filter="url(#' + id + 'b2)" opacity=".85"/>';
    // liquid flow lines along the pour
    for (var fl = -2; fl <= 2; fl++) { var b3 = band(fl * 0.17); s += '<path d="M' + P(b3[0][0], b3[0][1]) + " C" + P(b3[1][0], b3[1][1]) + " " + P(b3[2][0], b3[2][1]) + " " + P(b3[3][0], b3[3][1]) + '" fill="none" stroke="' + c.glow + '" stroke-width="' + (W * 0.0035).toFixed(1) + '" opacity="' + (0.16 + Math.abs(fl) * 0.03) + '" filter="url(#' + id + 'b0)"/>'; }
    // pickleball halftone rising from the hem
    s += '<g fill="' + c.sweep + '" mask="url(#' + id + 'hm)" opacity=".7"><rect width="' + W + '" height="' + H + '" fill="url(#' + id + 'pq)"/></g>';
    s += '</g>';

    // fine double tipping on both cuffs
    var sw = (W * 0.0045).toFixed(1);
    z.cuffs.forEach(function (cf) {
      s += '<path stroke="' + c.tip + '" stroke-width="' + sw + '" d="M' + P(cf[0][0], cf[0][1]) + " L" + P(cf[1][0], cf[1][1]) + '"/>';
      s += '<path stroke="' + hair + '" stroke-width="' + sw + '" d="M' + P(cf[0][0], cf[0][1] + 0.011) + " L" + P(cf[1][0], cf[1][1] + 0.011) + '"/>';
    });

    if (!back) {
      // small embroidered crest (gold ring for The 20)
      var cx = W * z.crest[0], cy = H * z.crest[1], cw = W * z.crest[2];
      if (ed) s += '<circle cx="' + cx.toFixed(1) + '" cy="' + cy.toFixed(1) + '" r="' + (cw * 0.62).toFixed(1) + '" fill="none" stroke="' + gold + '" stroke-width="' + (W * 0.004).toFixed(1) + '"/>';
      s += '<image filter="url(#' + id + 'em)" href="/assets/logo.svg" xlink:href="/assets/logo.svg" x="' + (cx - cw / 2).toFixed(1) + '" y="' + (cy - cw / 2).toFixed(1) + '" width="' + cw.toFixed(1) + '" height="' + cw.toFixed(1) + '"/>';
      if (o.tag) s += '<text x="' + cx.toFixed(1) + '" y="' + (cy + cw * 0.85).toFixed(1) + '" text-anchor="middle" font-family="DM Sans, sans-serif" font-weight="700" font-size="' + (W * 0.012).toFixed(1) + '" fill="' + c.ink + '" opacity=".75" letter-spacing="' + (W * 0.004).toFixed(1) + '">' + esc(o.tag) + "</text>";
    } else {
      var mid = W / 2, name = String(o.name || "").toUpperCase().slice(0, 12), num = String(o.num == null ? "" : o.num).slice(0, 2);
      s += '<text x="' + mid + '" y="' + (H * z.neck).toFixed(1) + '" text-anchor="middle" font-family="DM Sans, sans-serif" font-weight="700" font-size="' + (W * 0.013).toFixed(1) + '" fill="' + c.ink + '" opacity=".7" letter-spacing="' + (W * 0.006).toFixed(1) + '">DINKIN’ DONUT</text>';
      if (name) s += '<text x="' + mid + '" y="' + (H * z.name).toFixed(1) + '" text-anchor="middle" font-family="DM Sans, sans-serif" font-weight="700" font-size="' + (W * (name.length > 8 ? 0.036 : 0.042)).toFixed(1) + '" fill="' + c.ink + '" letter-spacing="' + (W * 0.02).toFixed(1) + '">' + esc(name) + "</text>";
      if (num) s += '<text x="' + mid + '" y="' + (H * (z.num + z.numH * 0.8)).toFixed(1) + '" text-anchor="middle" font-family="Fredoka, sans-serif" font-weight="600" font-size="' + (H * z.numH).toFixed(1) + '" fill="' + c.ink + '" stroke="' + hair + '" stroke-width="' + (W * 0.004).toFixed(1) + '" paint-order="stroke">' + esc(num) + "</text>";
      if (!name && !num) s += '<image filter="url(#' + id + 'em)" href="/assets/logo.svg" xlink:href="/assets/logo.svg" x="' + (mid - W * 0.06) + '" y="' + (H * 0.2) + '" width="' + W * 0.12 + '" height="' + W * 0.12 + '"/>';
      // the Kitchen Line: one hairline, and a ball whose spot is set by the player's name
      var r = rng(code + (o.name || "")), ly = H * z.line, bx = W * (0.5 + (r() - 0.5) * 0.36), br = W * 0.012;

      // woven code / edition tag at the hem
      var tw = W * (ed ? 0.2 : 0.12), th = H * 0.022, ty = H * z.tag;
      s += '<rect x="' + (mid - tw / 2).toFixed(1) + '" y="' + (ty - th / 2).toFixed(1) + '" width="' + tw.toFixed(1) + '" height="' + th.toFixed(1) + '" rx="' + (th * 0.2).toFixed(1) + '" fill="' + (ed ? gold : c.tip) + '"/>';
      s += '<text x="' + mid + '" y="' + (ty + th * 0.3).toFixed(1) + '" text-anchor="middle" font-family="DM Sans, sans-serif" font-weight="700" font-size="' + (th * 0.56).toFixed(1) + '" fill="' + (ed ? "#3B2416" : c.body) + '" letter-spacing="' + (th * 0.12).toFixed(1) + '">' + (ed ? "THE 20 · Nº " + (o.edNo ? String(o.edNo).padStart(2, "0") : "__") + " / 20" : esc(code)) + "</text>";
    }
    // woven hem flag (front left hem), gold for The 20
    if (!back) {
      var fx = W * z.flag[0], fy = H * z.flag[1], fw = W * 0.04, fh = H * 0.026;
      s += '<rect x="' + (fx - fw / 2).toFixed(1) + '" y="' + (fy - fh / 2).toFixed(1) + '" width="' + fw.toFixed(1) + '" height="' + fh.toFixed(1) + '" rx="' + (fh * 0.15).toFixed(1) + '" fill="' + (ed ? gold : c.tip) + '"/>';
      s += '<text x="' + fx.toFixed(1) + '" y="' + (fy + fh * 0.3).toFixed(1) + '" text-anchor="middle" font-family="Fredoka, sans-serif" font-weight="700" font-size="' + (fh * 0.62).toFixed(1) + '" fill="' + (ed ? "#3B2416" : c.body) + '">' + (ed ? "20" : "DD") + "</text>";
    }
    // the fabric's own folds over the print
    s += '<image href="' + src + '" xlink:href="' + src + '" width="' + W + '" height="' + H + '" opacity=".5" style="mix-blend-mode:multiply"/>';
    s += "</g></svg>";
    return s;
  }

  // Shortcuts that also compute the shirt's 1-of-1 code the same way the shop does
  function via(kind, waysKey, vecKey, extra) {
    return function (o) {
      var J = window.Jersey || {}, vec = J[vecKey], ways = J[waysKey];
      var code = vec ? ((vec(Object.assign({}, o, { side: "back" })).match(/DD-[0-9A-F]{4}/) || ["DD-0000"])[0]) : "DD-0000";
      return render(kind, Object.assign({}, extra || {}, o, { code: code }), ways);
    };
  }
  var PAL = {
    WAYS: {
      glaze: { label: "Glaze Rush", note: "Black · pink pour", body: "#0F0E12", sweep: "#FF3D8F", glow: "#FFC4DC", dots: "#FF5FA2", ink: "#FFFFFF", tip: "#FFFFFF", tip2: "#FF5FA2" },
      court: { label: "Court Fade", note: "Green · lime pour", body: "#0F2419", sweep: "#2FA36B", glow: "#D7F03C", dots: "#D7F03C", ink: "#F3EDE2", tip: "#F3EDE2", tip2: "#D7F03C" },
      midnight: { label: "Midnight Volt", note: "Navy · electric pour", body: "#0C1430", sweep: "#3A5BFF", glow: "#A9BAFF", dots: "#D7F03C", ink: "#FFFFFF", tip: "#FFFFFF", tip2: "#D7F03C" },
      cream: { label: "Pearl", note: "White · navy pour", body: "#F4F2EE", sweep: "#1C2A5C", glow: "#7E93D6", dots: "#1C2A5C", ink: "#1C2A5C", tip: "#1C2A5C", tip2: "#FF5FA2" },
      cocoa: { label: "Choco Glaze", note: "Chocolate · rose pour", body: "#24140C", sweep: "#E8487F", glow: "#F6C9A0", dots: "#D7F03C", ink: "#F6E9DA", tip: "#F6E9DA", tip2: "#E8487F" },
      sage: { label: "Lime Shock", note: "Black · lime pour", body: "#0E110F", sweep: "#B9E02A", glow: "#F2FFB2", dots: "#D7F03C", ink: "#FFFFFF", tip: "#FFFFFF", tip2: "#D7F03C" },
      blush: { label: "Sunset", note: "Plum · orange pour", body: "#1C0F22", sweep: "#FF5A36", glow: "#FFC07A", dots: "#FF5FA2", ink: "#FFF1E6", tip: "#FFF1E6", tip2: "#FF8A4C" },
    },
    PRO_WAYS: {
      bughaw: { label: "Bughaw", note: "Navy · royal & gold", body: "#0D1733", sweep: "#2D63FF", glow: "#F2C14E", dots: "#F2C14E", ink: "#FFFFFF", tip: "#FFFFFF", tip2: "#F2C14E" },
      perlas: { label: "Perlas", note: "Pearl · navy & gold", body: "#F5F3EE", sweep: "#16245A", glow: "#C9A14A", dots: "#16245A", ink: "#16245A", tip: "#16245A", tip2: "#C9A14A" },
      pula: { label: "Pula", note: "Claret · fire red", body: "#2E0A12", sweep: "#E3243B", glow: "#FFB199", dots: "#F2C14E", ink: "#FFF1E6", tip: "#FFF1E6", tip2: "#F2C14E" },
      glazepro: { label: "Gubat", note: "Forest · emerald", body: "#0B1F16", sweep: "#1FAF6E", glow: "#BFF5D6", dots: "#F2C14E", ink: "#F3EDE2", tip: "#F3EDE2", tip2: "#F2C14E" },
    },
    POLO_WAYS: {
      clubhouse: { label: "Clubhouse", note: "White · court green", body: "#F4F2EE", sweep: "#1F6B47", glow: "#9ED9B4", dots: "#1F6B47", ink: "#14301F", tip: "#14301F", tip2: "#FF5FA2" },
      night: { label: "Night", note: "Black · lime", body: "#0E0F10", sweep: "#9FD12A", glow: "#F2FFB2", dots: "#D7F03C", ink: "#FFFFFF", tip: "#FFFFFF", tip2: "#D7F03C" },
      glaze: { label: "Glaze", note: "Black · pink", body: "#120E12", sweep: "#FF3D8F", glow: "#FFC4DC", dots: "#FF5FA2", ink: "#FFFFFF", tip: "#FFFFFF", tip2: "#FF5FA2" },
    },
  };
  function applyPalette() { var J = window.Jersey; if (!J) return; Object.keys(PAL).forEach(function (k) { var m = J[k]; if (!m) return; Object.keys(PAL[k]).forEach(function (w) { if (m[w]) Object.assign(m[w], PAL[k][w]); }); }); }
  applyPalette();
  window.Mockup = { render: render, tee: via("tee", "WAYS", "render"), pro: via("polo", "PRO_WAYS", "renderPro", { tag: "MABUHAY" }), polo: via("polo", "POLO_WAYS", "renderPolo") };
})();
