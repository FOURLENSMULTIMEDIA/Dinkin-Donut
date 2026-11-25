// Photo mockups: real tee and polo photos, dyed to each colourway, with real sportswear details (knit, stripe, tipping, crest).
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

  var MPATH = '<path d="M104 44h20a56 56 0 0 1 0 112h-20zM119 62h5a27 38 0 0 1 0 76h-5z"/><path d="M96 44H76a56 56 0 0 0 0 112h20zM81 62h-5a27 38 0 0 0 0 76h5z"/>';
  // Embroidered laurel crest: two laurel branches around the Different D, "PICKLEBALL CLUB" arched over, "EST 2026" under.
  function crest(cx, cy, r, ink, acc, uid) { var s = '<g transform="translate(' + cx.toFixed(1) + " " + cy.toFixed(1) + ')">', leaves = "";
    [-1, 1].forEach(function (d) { for (var i = 0; i < 8; i++) { var th = (104 + i * 16) * Math.PI / 180, R = r * 0.9, x = Math.cos(th) * R * d, y = Math.sin(th) * R, ang = (th * 180 / Math.PI + 90) * d + (d > 0 ? 180 : 0) + 25 * d;
      leaves += '<ellipse cx="' + x.toFixed(2) + '" cy="' + y.toFixed(2) + '" rx="' + (r * 0.15).toFixed(2) + '" ry="' + (r * 0.06).toFixed(2) + '" transform="rotate(' + ang.toFixed(1) + " " + x.toFixed(2) + " " + y.toFixed(2) + ')"/>'; } });
    s += '<g fill="' + acc + '">' + leaves + "</g>";
    s += '<g transform="scale(' + (r * 0.0052).toFixed(4) + ') translate(-100 -100)" fill="' + ink + '" fill-rule="evenodd">' + MPATH + '</g><path d="M0 ' + (-r * 0.34).toFixed(1) + "V" + (r * 0.34).toFixed(1) + '" stroke="' + acc + '" stroke-width="' + (r * 0.035).toFixed(2) + '"/>';
    s += '<path id="' + uid + 'ca" d="M' + (-r * 0.7).toFixed(1) + " 0A" + (r * 0.7).toFixed(1) + " " + (r * 0.7).toFixed(1) + " 0 0 1 " + (r * 0.7).toFixed(1) + ' 0" fill="none"/><text font-family="DM Sans, sans-serif" font-weight="700" font-size="' + (r * 0.17).toFixed(1) + '" letter-spacing="' + (r * 0.035).toFixed(1) + '" fill="' + ink + '"><textPath href="#' + uid + 'ca" xlink:href="#' + uid + 'ca" startOffset="50%" text-anchor="middle">PICKLEBALL CLUB</textPath></text>';
    s += '<text y="' + (r * 1.12).toFixed(1) + '" text-anchor="middle" font-family="DM Sans, sans-serif" font-weight="700" font-size="' + (r * 0.13).toFixed(1) + '" letter-spacing="' + (r * 0.03).toFixed(1) + '" fill="' + ink + '">EST · 2026</text>';
    return s + "</g>"; }
  // Varsity chest lockup for the Club Jersey (old club-whites spirit): small caps over a big script, a swash tail, a ball, crossed paddles.
  function lockup(W, H, ink, acc, ballCol) { var cx = W * 0.5, y = H * 0.3, sz = W * 0.105, s = "";
    s += '<text x="' + cx + '" y="' + (y - sz * 0.95).toFixed(1) + '" text-anchor="middle" font-family="DM Sans, sans-serif" font-weight="700" font-size="' + (W * 0.017).toFixed(1) + '" letter-spacing="' + (W * 0.008).toFixed(1) + '" fill="' + ink + '">PICKLEBALL CLUB</text>';
    s += '<text x="' + cx + '" y="' + y.toFixed(1) + '" text-anchor="middle" font-family="Fraunces, serif" font-style="italic" font-weight="700" font-size="' + sz.toFixed(1) + '" fill="' + ink + '" style="font-variation-settings:\'SOFT\' 100,\'WONK\' 1">Dink Different</text>';
    s += '<path d="M' + (cx - W * 0.25).toFixed(1) + " " + (y + sz * 0.2).toFixed(1) + "C" + (cx - W * 0.05).toFixed(1) + " " + (y + sz * 0.42).toFixed(1) + " " + (cx + W * 0.15).toFixed(1) + " " + (y + sz * 0.38).toFixed(1) + " " + (cx + W * 0.26).toFixed(1) + " " + (y + sz * 0.1).toFixed(1) + '" fill="none" stroke="' + acc + '" stroke-width="' + (W * 0.007).toFixed(1) + '" stroke-linecap="round"/>';
    var bx = cx + W * 0.325, by = y - sz * 0.32, br = W * 0.016; s += '<circle cx="' + bx.toFixed(1) + '" cy="' + by.toFixed(1) + '" r="' + br.toFixed(1) + '" fill="' + ballCol + '"/>' + [[-.4, -.3], [.35, -.35], [0, .2], [-.3, .45], [.45, .3]].map(function (q) { return '<circle cx="' + (bx + q[0] * br).toFixed(1) + '" cy="' + (by + q[1] * br).toFixed(1) + '" r="' + (br * 0.12).toFixed(2) + '" fill="' + ink + '" opacity=".45"/>'; }).join("");
    s += '<text x="' + cx + '" y="' + (y + sz * 0.78).toFixed(1) + '" text-anchor="middle" font-family="DM Sans, sans-serif" font-weight="700" font-size="' + (W * 0.0125).toFixed(1) + '" letter-spacing="' + (W * 0.006).toFixed(1) + '" fill="' + ink + '">ESTABLISHED 2026 · DOHA</text>';
    [-1, 1].forEach(function (d) { s += '<g transform="translate(' + cx + " " + (y + sz * 1.18).toFixed(1) + ") rotate(" + d * 36 + ')" fill="' + acc + '"><rect x="' + (-W * 0.011).toFixed(1) + '" y="' + (-W * 0.046).toFixed(1) + '" width="' + (W * 0.022).toFixed(1) + '" height="' + (W * 0.029).toFixed(1) + '" rx="' + (W * 0.01).toFixed(1) + '"/><rect x="' + (-W * 0.0028).toFixed(1) + '" y="' + (-W * 0.019).toFixed(1) + '" width="' + (W * 0.0056).toFixed(1) + '" height="' + (W * 0.036).toFixed(1) + '"/></g>'; });
    return s; }
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
      '<pattern id="' + id + 'rib" width="4" height="4" patternUnits="userSpaceOnUse"><rect width="1.6" height="4"/></pattern>' +
      (kind === "tee" ? '<linearGradient id="' + id + 'nf" gradientUnits="userSpaceOnUse" x1="' + W * 0.28 + '" x2="' + W * 0.62 + '"><stop offset="0" stop-color="#000"/><stop offset="1" stop-color="#fff"/></linearGradient>' +
        '<mask id="' + id + 'nk" maskUnits="userSpaceOnUse" x="0" y="0" width="' + W + '" height="' + H + '"><rect width="' + W + '" height="' + H + '" fill="url(#' + id + 'nf)"/></mask>' +
        '<linearGradient id="' + id + 'nh" gradientUnits="userSpaceOnUse" x1="' + W * 0.22 + '" x2="' + W * 0.6 + '"><stop offset="0" stop-color="#000"/><stop offset=".45" stop-color="#fff"/><stop offset="1" stop-color="#000"/></linearGradient>' +
        '<mask id="' + id + 'nj" maskUnits="userSpaceOnUse" x="0" y="0" width="' + W + '" height="' + H + '"><rect width="' + W + '" height="' + H + '" fill="url(#' + id + 'nh)"/></mask>' +
        '<filter id="' + id + 'ns" x="-30%" y="-30%" width="160%" height="160%" color-interpolation-filters="sRGB"><feGaussianBlur in="SourceAlpha" stdDeviation="' + (W * 0.012).toFixed(1) + '" result="b"/><feTurbulence type="fractalNoise" baseFrequency="1.6" numOctaves="1" seed="4" result="n"/><feColorMatrix in="n" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 0 0 0 0" result="na"/><feComposite in="b" in2="na" operator="arithmetic" k1="0" k2="1.9" k3="1" k4="-1.05" result="m"/><feFlood flood-color="' + c.ink + '"/><feComposite in2="m" operator="in"/></filter>' +
        '<filter id="' + id + 'mb1" x="-150%" y="-150%" width="400%" height="400%"><feGaussianBlur stdDeviation="' + (W * 0.008).toFixed(1) + " " + (W * 0.034).toFixed(1) + '"/></filter>' +
        '<filter id="' + id + 'mb2" x="-150%" y="-150%" width="400%" height="400%"><feGaussianBlur stdDeviation="' + (W * 0.013).toFixed(1) + " " + (W * 0.05).toFixed(1) + '"/></filter>' : "") +
      '<pattern id="' + id + 'bn" width="34" height="34" patternUnits="userSpaceOnUse"><path d="M17 1L33 17L17 33L1 17Z M17 9L25 17L17 25L9 17Z" fill="none" stroke="#000" stroke-width="2"/></pattern>' +
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
    // THE KNIT: tonal texture you'd see on real fabric (piqué on polos, a fine rib on the jersey, a banig weave on the Mabuhay)
    s += '<g style="mix-blend-mode:multiply"><rect width="' + W + '" height="' + H + '" fill="' + c.body + '"/>';
    if (kind === "polo") s += '<rect width="' + W + '" height="' + H + '" fill="url(#' + id + 'pq)" opacity=".07"/>';
    else s += '<rect width="' + W + '" height="' + H + '" fill="url(#' + id + 'rib)" opacity=".06"/>';
    if (o.tag) s += '<rect width="' + W + '" height="' + H + '" fill="url(#' + id + 'bn)" opacity=".12"/>';
    s += "</g>";
    // fine double tipping on both cuffs
    var sw = (W * 0.0045).toFixed(1);
    z.cuffs.forEach(function (cf) {
      s += '<path stroke="' + c.tip + '" stroke-width="' + sw + '" d="M' + P(cf[0][0], cf[0][1]) + " L" + P(cf[1][0], cf[1][1]) + '"/>';
      s += '<path stroke="' + hair + '" stroke-width="' + sw + '" d="M' + P(cf[0][0], cf[0][1] + 0.011) + " L" + P(cf[1][0], cf[1][1] + 0.011) + '"/>';
    });

    if (!back) {
      // chest art: the varsity lockup on the Club Jersey, an embroidered laurel crest on polos
      var cx = W * z.crest[0], cy = H * z.crest[1], cw = W * z.crest[2];
      if (kind === "tee") s += '<g filter="url(#' + id + 'em)">' + lockup(W, H, c.ink, ed ? "#D8A93E" : c.tip2, ed ? "#F6E3A1" : "#E3CF7E") + "</g>";
      else s += '<g filter="url(#' + id + 'em)">' + crest(cx, cy, cw * 0.78, c.ink, ed ? "#D8A93E" : c.tip2, id) + "</g>";
      if (o.tag) s += '<text x="' + cx.toFixed(1) + '" y="' + (cy + cw * 0.85).toFixed(1) + '" text-anchor="middle" font-family="DM Sans, sans-serif" font-weight="700" font-size="' + (W * 0.012).toFixed(1) + '" fill="' + c.ink + '" opacity=".75" letter-spacing="' + (W * 0.004).toFixed(1) + '">' + esc(o.tag) + "</text>";
    } else {
      var mid = W / 2, name = String(o.name || "").toUpperCase().slice(0, 12), num = String(o.num == null ? "" : o.num).slice(0, 2);
      s += '<text x="' + mid + '" y="' + (H * z.neck).toFixed(1) + '" text-anchor="middle" font-family="DM Sans, sans-serif" font-weight="700" font-size="' + (W * 0.013).toFixed(1) + '" fill="' + c.ink + '" opacity=".7" letter-spacing="' + (W * 0.006).toFixed(1) + '">DINK DIFFERENT</text>';
      if (name) s += '<text x="' + mid + '" y="' + (H * z.name).toFixed(1) + '" text-anchor="middle" font-family="DM Sans, sans-serif" font-weight="700" font-size="' + (W * (name.length > 8 ? 0.036 : 0.042)).toFixed(1) + '" fill="' + c.ink + '" letter-spacing="' + (W * 0.02).toFixed(1) + '">' + esc(name) + "</text>";
      if (num && kind === "tee") { var big = function (extra, fill) { return '<text x="' + mid + '" y="' + (H * 0.53).toFixed(1) + '" text-anchor="middle" font-family="Archivo, sans-serif" font-weight="800" font-size="' + (W * (num.length > 1 ? 0.34 : 0.4)).toFixed(1) + '" letter-spacing="' + (-W * 0.015).toFixed(1) + '" fill="' + fill + '" style="font-stretch:125%"' + extra + ">" + esc(num) + "</text>"; };
        s += big(' mask="url(#' + id + 'nk)"', ed ? gold : c.ink) + '<g mask="url(#' + id + 'nj)">' + big(' filter="url(#' + id + 'ns)"', "#000") + "</g>"; }
      else if (num) s += '<text x="' + mid + '" y="' + (H * (z.num + z.numH * 0.8)).toFixed(1) + '" text-anchor="middle" font-family="Fraunces, sans-serif" font-weight="600" font-size="' + (H * z.numH).toFixed(1) + '" fill="' + c.ink + '" stroke="' + hair + '" stroke-width="' + (W * 0.004).toFixed(1) + '" paint-order="stroke">' + esc(num) + "</text>";
      if (o.print === "court" && window.ClubTee) s += window.ClubTee.PRINTS.court(mid, H * 0.225, W * 0.82, { body: c.body, ink: c.ink, acc: c.tip2 }, id + "cm");
      else if (!name && !num) s += '<image filter="url(#' + id + 'em)" href="/assets/logo.svg" xlink:href="/assets/logo.svg" x="' + (mid - W * 0.06) + '" y="' + (H * 0.2) + '" width="' + W * 0.12 + '" height="' + W * 0.12 + '"/>';
      // the Kitchen Line: one hairline, and a ball whose spot is set by the player's name
      var r = rng(code + (o.name || "")), ly = H * z.line, bx = W * (0.5 + (r() - 0.5) * 0.36), br = W * 0.012;

      // woven code / edition tag at the hem
      var tw = W * (ed ? 0.2 : 0.12), th = H * 0.022, ty = H * z.tag;
      s += '<rect x="' + (mid - tw / 2).toFixed(1) + '" y="' + (ty - th / 2).toFixed(1) + '" width="' + tw.toFixed(1) + '" height="' + th.toFixed(1) + '" rx="' + (th * 0.2).toFixed(1) + '" fill="' + (ed ? gold : c.tip) + '"/>';
      s += '<text x="' + mid + '" y="' + (ty + th * 0.3).toFixed(1) + '" text-anchor="middle" font-family="DM Sans, sans-serif" font-weight="700" font-size="' + (th * 0.56).toFixed(1) + '" fill="' + (ed ? "#1D2840" : c.body) + '" letter-spacing="' + (th * 0.12).toFixed(1) + '">' + (ed ? "THE 20 · Nº " + (o.edNo ? String(o.edNo).padStart(2, "0") : "__") + " / 20" : esc(code)) + "</text>";
    }
    // woven hem flag (front left hem), gold for The 20
    if (!back) {
      var fx = W * z.flag[0], fy = H * z.flag[1], fw = W * 0.04, fh = H * 0.026;
      s += '<rect x="' + (fx - fw / 2).toFixed(1) + '" y="' + (fy - fh / 2).toFixed(1) + '" width="' + fw.toFixed(1) + '" height="' + fh.toFixed(1) + '" rx="' + (fh * 0.15).toFixed(1) + '" fill="' + (ed ? gold : c.tip) + '"/>';
      s += '<text x="' + fx.toFixed(1) + '" y="' + (fy + fh * 0.3).toFixed(1) + '" text-anchor="middle" font-family="Fraunces, sans-serif" font-weight="700" font-size="' + (fh * 0.62).toFixed(1) + '" fill="' + (ed ? "#1D2840" : c.body) + '">' + (ed ? "20" : "DD") + "</text>";
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
      glaze: { label: "Clubhouse Navy", note: "Navy · brass", body: "#1B2440", sweep: "#C9A86B", glow: "#EADBB8", dots: "#EDE4D3", ink: "#F4EFE3", tip: "#F4EFE3", tip2: "#C9A86B" },
      court: { label: "Oatmeal", note: "Oatmeal · navy", body: "#E6DAC4", sweep: "#1D2840", glow: "#8A97B8", dots: "#9C7A45", ink: "#1D2840", tip: "#1D2840", tip2: "#9C7A45" },
      midnight: { label: "Midnight Ivory", note: "Midnight · ivory", body: "#10162A", sweep: "#EDE4D3", glow: "#FFFFFF", dots: "#C9A86B", ink: "#F4EFE3", tip: "#F4EFE3", tip2: "#C9A86B" },
      cream: { label: "Pearl", note: "Pearl · navy", body: "#F6F3EC", sweep: "#1D2840", glow: "#B89B72", dots: "#1D2840", ink: "#1D2840", tip: "#1D2840", tip2: "#9C7A45" },
      cocoa: { label: "Camel", note: "Camel · ivory", body: "#B89B72", sweep: "#F4EFE3", glow: "#FFF7E6", dots: "#1D2840", ink: "#1D2840", tip: "#1D2840", tip2: "#F4EFE3" },
      sage: { label: "Stone", note: "Stone · oxblood", body: "#CFC2A8", sweep: "#8E2F2F", glow: "#E2B7A6", dots: "#1D2840", ink: "#1D2840", tip: "#1D2840", tip2: "#8E2F2F" },
      blush: { label: "Oxblood", note: "Oxblood · sand", body: "#4A1A1E", sweep: "#E6D3A8", glow: "#FFF1D6", dots: "#C9A86B", ink: "#F1EBDD", tip: "#F1EBDD", tip2: "#C9A86B" },
    },
    PRO_WAYS: {
      bughaw: { label: "Regatta", note: "Navy · ivory & brass", body: "#16213F", sweep: "#F4EFE3", glow: "#C9A86B", dots: "#C9A86B", ink: "#FFFFFF", tip: "#FFFFFF", tip2: "#C9A86B" },
      perlas: { label: "Perlas", note: "Pearl · navy & brass", body: "#F5F3EE", sweep: "#16245A", glow: "#B89B72", dots: "#16245A", ink: "#16245A", tip: "#16245A", tip2: "#9C7A45" },
      pula: { label: "Claret", note: "Claret · brass", body: "#3A1216", sweep: "#C9A86B", glow: "#F1DDB0", dots: "#C9A86B", ink: "#F1EBDD", tip: "#F1EBDD", tip2: "#C9A86B" },
      glazepro: { label: "Sandstone", note: "Sand · navy", body: "#D9CAAE", sweep: "#1D2840", glow: "#9C7A45", dots: "#1D2840", ink: "#1D2840", tip: "#1D2840", tip2: "#9C7A45" },
    },
    POLO_WAYS: {
      clubhouse: { label: "Clubhouse", note: "Ivory · navy", body: "#F4F2EE", sweep: "#1D2840", glow: "#8A97B8", dots: "#1D2840", ink: "#1D2840", tip: "#1D2840", tip2: "#9C7A45" },
      night: { label: "Night", note: "Navy · brass", body: "#141C33", sweep: "#C9A86B", glow: "#EADBB8", dots: "#EDE4D3", ink: "#FFFFFF", tip: "#FFFFFF", tip2: "#C9A86B" },
      glaze: { label: "Camel", note: "Camel · navy", body: "#B89B72", sweep: "#1D2840", glow: "#5B6788", dots: "#1D2840", ink: "#1D2840", tip: "#1D2840", tip2: "#F4EFE3" },
      oatmeal: { label: "Oatmeal", note: "Oatmeal · navy", body: "#E2D6C0", ink: "#1D2840", tip: "#1D2840", tip2: "#9C7A45" },
      oxblood: { label: "Oxblood", note: "Oxblood · sand", body: "#4A1A1E", ink: "#F1EBDD", tip: "#E6D3A8", tip2: "#C9A86B" },
      pearl: { label: "Pearl", note: "White · brass", body: "#F7F6F2", ink: "#1D2840", tip: "#9C7A45", tip2: "#1D2840" },
      stone: { label: "Stone", note: "Stone · navy", body: "#CFC4AE", ink: "#1D2840", tip: "#1D2840", tip2: "#7A2A2A" },
    },
  };
  function applyPalette() { var J = window.Jersey; if (!J) return; Object.keys(PAL).forEach(function (k) { var m = J[k]; if (!m) return; Object.keys(PAL[k]).forEach(function (w) { if (m[w]) Object.assign(m[w], PAL[k][w]); }); }); }
  applyPalette();
  window.Mockup = { crest: crest, render: render, tee: via("tee", "WAYS", "render"), pro: via("polo", "PRO_WAYS", "renderPro", { tag: "MABUHAY" }), polo: via("polo", "POLO_WAYS", "renderPolo") };
})();
