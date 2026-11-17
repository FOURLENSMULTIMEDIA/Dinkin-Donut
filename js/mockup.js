// Photo mockups: real tee and polo photos, dyed to each colourway, with the print laid into the fabric.
// Layers: photo (white) → colour multiplied in → print → the photo's folds multiplied over the print.
// Mockup.render(kind, opts, ways) returns SVG markup, so it drops in anywhere the vector shirts were used.
(function () {
  var IMG = {
    "tee-front": [882, 926], "tee-back": [896, 938],
    "polo-front": [991, 1174], "polo-back": [974, 1173],
  };
  // Print zones as fractions of the image (chest = wearer's left, so viewer's right)
  var ZONE = {
    tee: { chest: [0.62, 0.27, 0.11], name: 0.2, num: 0.3, numH: 0.22, tag: 0.86, mid: 0.5 },
    polo: { chest: [0.69, 0.37, 0.1], badge: [0.355, 0.375], name: 0.165, num: 0.33, numH: 0.19, tag: 0.9, mid: 0.5 },
  };
  var uid = 0;
  var esc = function (s) { return String(s || "").replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); };
  function rng(str) { var h = 2166136261; for (var i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); } var x = h >>> 0 || 1; return function () { x ^= x << 13; x >>>= 0; x ^= x >>> 17; x ^= x << 5; x >>>= 0; return x / 4294967296; }; }
  function lum(hex) { var n = parseInt(String(hex || "#ffffff").slice(1), 16); return (0.299 * (n >> 16) + 0.587 * ((n >> 8) & 255) + 0.114 * (n & 255)) / 255; }

  function colours(w) {
    var body = w.body || "#FFFFFF";
    var ink = w.num || w.ink || "#3B2416";
    var line = w.numLine || w.tipA || w.trim || w.sash || "#FF5FA2";
    var accent = w.sash2 && w.sash2 !== body ? w.sash2 : w.yoke || w.sash || w.tipA || w.trim || "#FF5FA2";
    if (Math.abs(lum(ink) - lum(body)) < 0.25) ink = lum(body) > 0.5 ? "#3B2416" : "#FFF6EA";
    var panel = w.sash || w.yoke || w.tipA || "#FFF6EA";
    if (panel.toLowerCase() === body.toLowerCase()) panel = lum(body) > 0.5 ? "#3B2416" : "#FFF6EA";
    var pipe = w.sash2 || w.pipe || w.tipB || w.numLine || accent;
    return { body: body, ink: ink, line: line, accent: accent, panel: panel, pipe: pipe };
  }

  function render(kind, o, ways) {
    o = o || {};
    var back = o.side === "back", key = kind + "-" + (back ? "back" : "front"), size = IMG[key], W = size[0], H = size[1];
    var w = (ways && ways[o.way]) || (ways && ways[Object.keys(ways)[0]]) || {}, c = colours(w), z = ZONE[kind], id = "mk" + (++uid);
    var src = "/assets/mockups/" + key + ".png", mask = "/assets/mockups/" + key + "-mask.png";
    var code = o.code || "DD-0000";
    var s = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 ' + W + " " + H + '" class="mock" role="img" aria-label="' + esc((w.label || "") + " " + kind + (back ? " back" : " front")) + '">';
    s += "<desc>" + code + "</desc>";
    s += '<defs><mask id="' + id + 'm" maskUnits="userSpaceOnUse" x="0" y="0" width="' + W + '" height="' + H + '"><image href="' + mask + '" xlink:href="' + mask + '" width="' + W + '" height="' + H + '"/></mask>' +
      (o.edition ? '<linearGradient id="' + id + 'g" x1="0" x2="1" y1="0" y2="0.25"><stop offset="0" stop-color="#C9962A"/><stop offset=".3" stop-color="#FFF1B3"/><stop offset=".55" stop-color="#E9B52C"/><stop offset=".8" stop-color="#FFE9A0"/><stop offset="1" stop-color="#B8841F"/></linearGradient>' : '') +
      '<filter id="' + id + 'ink" x="-5%" y="-5%" width="110%" height="110%"><feTurbulence type="fractalNoise" baseFrequency="1.6" numOctaves="1" seed="3" result="n"/><feColorMatrix in="n" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -0.22 1.04" result="a"/><feComposite in="SourceGraphic" in2="a" operator="in"/></filter></defs>';
    // 1) the real photo   2) colour dyed into it
    // everything blends inside one isolated group, then the shirt silhouette cuts it out (clean dyed edges)
    s += '<g mask="url(#' + id + 'm)" style="isolation:isolate"><rect width="' + W + '" height="' + H + '" fill="#fff"/>';
    s += '<image href="' + src + '" xlink:href="' + src + '" width="' + W + '" height="' + H + '"/>';
    var P = function (pts) { return pts.map(function (v, i) { return (i % 2 ? v * H : v * W).toFixed(1); }).join(" "); };
    s += '<g style="mix-blend-mode:multiply"><rect width="' + W + '" height="' + H + '" fill="' + c.body + '"/>';
    if (kind === "polo") {
      if (!back) {
        // shoulders + sleeves + chest wings, with the collar and placket left in the body colour
        s += '<path fill="' + c.panel + '" d="M' + P([.38, .02]) + ' L' + P([.1, .1]) + ' L' + P([-.06, .25]) + ' L' + P([-.02, .44]) + ' L' + P([.21, .52]) + ' L' + P([.215, .315]) + ' Q' + P([.34, .29]) + ' ' + P([.41, .15]) + ' Z"/>';
        s += '<path fill="' + c.panel + '" d="M' + P([.64, .02]) + ' L' + P([.9, .1]) + ' L' + P([1.06, .25]) + ' L' + P([1.03, .46]) + ' L' + P([.815, .47]) + ' L' + P([.795, .315]) + ' Q' + P([.66, .29]) + ' ' + P([.6, .15]) + ' Z"/>';
      } else {
        s += '<path fill="' + c.panel + '" d="M' + P([.33, 0]) + ' L' + P([.08, .1]) + ' L' + P([-.06, .25]) + ' L' + P([-.02, .44]) + ' L' + P([.2, .52]) + ' L' + P([.2, .33]) + ' Q' + P([.5, .2]) + ' ' + P([.8, .33]) + ' L' + P([.8, .52]) + ' L' + P([1.02, .44]) + ' L' + P([1.06, .25]) + ' L' + P([.92, .1]) + ' L' + P([.68, 0]) + ' Z"/>';
      }
    }
    s += '</g>';
    if (kind === "polo") {
      var sw = (W * 0.006).toFixed(1);
      s += back ? '<path fill="none" stroke="' + c.pipe + '" stroke-width="' + sw + '" d="M' + P([.2, .335]) + ' Q' + P([.5, .205]) + ' ' + P([.8, .335]) + '"/>'
        : '<path fill="none" stroke="' + c.pipe + '" stroke-width="' + sw + '" d="M' + P([.215, .32]) + ' Q' + P([.34, .295]) + ' ' + P([.412, .155]) + ' M' + P([.79, .32]) + ' Q' + P([.66, .295]) + ' ' + P([.598, .155]) + '"/>';
      // tipped cuffs: two thin stripes on each sleeve end
      [[[.0, .405], [.205, .455]], [[1.0, .405], [.795, .455]]].forEach(function (cf) {
        [0, .014].forEach(function (dy) { s += '<path stroke="' + (dy ? c.pipe : c.body) + '" stroke-width="' + (W * 0.007).toFixed(1) + '" d="M' + P([cf[0][0], cf[0][1] + dy]) + ' L' + P([cf[1][0], cf[1][1] + dy]) + '"/>'; });
      });
    }
    // 3) the print, inside the shirt only
    s += '<g><g filter="url(#' + id + 'ink)">';
    // The Kitchen Line: one stripe at the height of the 7 ft non-volley line, front and back.
    // 1-of-1: a single pickleball sits on the line, at a spot set by the player's name.
    var r = rng(code + (o.name || "")), ly = H * (back ? 0.68 : 0.7), lh = H * 0.02, gold = "url(#" + id + "g)", line = o.edition ? gold : c.accent;
    var kl = back || kind !== "polo";
    if (kl) s += '<rect x="0" y="' + ly.toFixed(1) + '" width="' + W + '" height="' + lh.toFixed(1) + '" fill="' + line + '"/>';
    if (kl) s += '<rect x="0" y="' + (ly + lh * 1.7).toFixed(1) + '" width="' + W + '" height="' + (lh * 0.18).toFixed(1) + '" fill="' + c.ink + '" opacity=".55"/>';
    if (kl) s += '<text x="' + (W * (back ? 0.27 : 0.73)).toFixed(1) + '" y="' + (ly + lh * 0.72).toFixed(1) + '" text-anchor="middle" font-family="DM Sans, sans-serif" font-weight="700" font-size="' + (lh * 0.62).toFixed(1) + '" letter-spacing="' + (lh * 0.22).toFixed(1) + '" fill="' + c.ink + '" opacity=".8">NON-VOLLEY · 7 FT</text>';
    if (back) {
      var bx = W * (0.5 + (r() - 0.5) * 0.36), br = lh * 1.05, holes = "";
      for (var k = 0; k < 6; k++) { var an = k * 60 + r() * 20, rr = br * 0.55; holes += '<circle cx="' + (Math.cos(an * Math.PI / 180) * rr).toFixed(1) + '" cy="' + (Math.sin(an * Math.PI / 180) * rr).toFixed(1) + '" r="' + (br * 0.13).toFixed(1) + '"/>'; }
      s += '<g transform="translate(' + bx.toFixed(1) + " " + (ly - br * 0.62).toFixed(1) + ')"><circle r="' + br.toFixed(1) + '" fill="' + (o.edition ? gold : c.ink) + '"/><g fill="' + (o.edition ? c.ink : c.accent) + '">' + holes + '<circle r="' + (br * 0.13).toFixed(1) + '"/></g></g>';
    }
    if (!back) {
      var cx = W * z.chest[0], cy = H * z.chest[1], cw = W * z.chest[2];
      s += '<image href="/assets/logo.svg" xlink:href="/assets/logo.svg" x="' + (cx - cw / 2).toFixed(1) + '" y="' + (cy - cw / 2).toFixed(1) + '" width="' + cw.toFixed(1) + '" height="' + cw.toFixed(1) + '"/>';
      if (kind !== "polo") s += '<text x="' + cx.toFixed(1) + '" y="' + (cy + cw * 0.78).toFixed(1) + '" text-anchor="middle" font-family="Fredoka, sans-serif" font-weight="700" font-size="' + (cw * 0.2).toFixed(1) + '" fill="' + c.ink + '" letter-spacing="1">DINKIN’ DONUT</text>';
      if (kind === "polo" && z.badge) {
        var bx2 = W * z.badge[0], by2 = H * z.badge[1];
        s += '<text x="' + bx2.toFixed(1) + '" y="' + by2.toFixed(1) + '" text-anchor="middle" font-family="Fredoka, sans-serif" font-weight="700" font-size="' + (W * 0.026).toFixed(1) + '" fill="' + c.ink + '" letter-spacing="1">DINKIN’ DONUT</text>';
        s += '<text x="' + bx2.toFixed(1) + '" y="' + (by2 + W * 0.03).toFixed(1) + '" text-anchor="middle" font-family="DM Sans, sans-serif" font-weight="700" font-size="' + (W * 0.015).toFixed(1) + '" fill="' + c.ink + '" opacity=".8" letter-spacing="3">PICKLEBALL CLUB</text>';
        s += '<rect x="' + (bx2 - W * 0.07).toFixed(1) + '" y="' + (by2 + W * 0.044).toFixed(1) + '" width="' + (W * 0.14).toFixed(1) + '" height="' + (W * 0.004).toFixed(1) + '" fill="' + c.pipe + '"/>';
      }
      if (o.edition) { var lw = W * 0.11, lx = W * 0.3, lyy = H * 0.86; s += '<g transform="translate(' + lx.toFixed(1) + " " + lyy.toFixed(1) + ')"><rect x="' + (-lw / 2) + '" y="' + (-lw * 0.2) + '" width="' + lw + '" height="' + lw * 0.4 + '" rx="' + lw * 0.06 + '" fill="' + gold + '"/><text y="' + (lw * 0.09).toFixed(1) + '" text-anchor="middle" font-family="Fredoka, sans-serif" font-weight="700" font-size="' + (lw * 0.22).toFixed(1) + '" fill="#3B2416" letter-spacing="1">THE 20</text></g>'; }
      if (o.print === "club" || o.tag) s += '<text x="' + cx.toFixed(1) + '" y="' + (cy + (kind === "polo" ? cw * 0.8 : cw * 1.02)).toFixed(1) + '" text-anchor="middle" font-family="DM Sans, sans-serif" font-weight="700" font-size="' + (cw * 0.13).toFixed(1) + '" fill="' + c.ink + '" opacity=".75" letter-spacing="3">' + esc(o.tag || "DOHA") + "</text>";
    } else {
      var name = String(o.name || "").toUpperCase().slice(0, 12), num = String(o.num == null ? "" : o.num).slice(0, 2), mid = W * z.mid;
      var nameInk = kind === "polo" ? (Math.abs(lum(c.panel) - lum(c.body)) > 0.3 ? c.body : (lum(c.panel) > 0.5 ? "#3B2416" : "#FFF6EA")) : c.ink;
      if (name) s += '<text x="' + mid + '" y="' + (H * z.name).toFixed(1) + '" text-anchor="middle" font-family="Fredoka, sans-serif" font-weight="700" font-size="' + (W * (name.length > 8 ? 0.05 : 0.058)).toFixed(1) + '" fill="' + nameInk + '" letter-spacing="' + (W * 0.016).toFixed(1) + '">' + esc(name) + "</text>";
      if (num) s += '<text x="' + mid + '" y="' + (H * (z.num + z.numH * 0.62)).toFixed(1) + '" text-anchor="middle" font-family="Fredoka, sans-serif" font-weight="700" font-size="' + (H * z.numH).toFixed(1) + '" fill="' + c.ink + '" stroke="' + c.line + '" stroke-width="' + (W * 0.012).toFixed(1) + '" paint-order="stroke" stroke-linejoin="round">' + esc(num) + "</text>";
      if (!name && !num) s += '<image href="/assets/logo.svg" xlink:href="/assets/logo.svg" x="' + (mid - W * 0.14) + '" y="' + (H * 0.26) + '" width="' + W * 0.28 + '" height="' + W * 0.28 + '"/>';
      var ty = H * z.tag, tw = W * 0.26, th = H * 0.034;
      s += '<g transform="translate(' + mid + " " + ty.toFixed(1) + ')"><rect x="' + (-tw / 2) + '" y="' + (-th / 2) + '" width="' + tw + '" height="' + th + '" rx="' + th / 2 + '" fill="' + (o.edition ? gold : c.ink) + '" opacity=".95"/><text y="' + (th * 0.28).toFixed(1) + '" text-anchor="middle" font-family="DM Sans, sans-serif" font-weight="700" font-size="' + (th * 0.55).toFixed(1) + '" fill="' + (o.edition ? "#3B2416" : c.body) + '" letter-spacing="2">' + (o.edition ? "THE 20 · Nº " + (o.edNo ? String(o.edNo).padStart(2, "0") : "__") + " / 20" : esc(code)) + "</text></g>";
    }
    s += "</g></g>";
    // 4) the fabric's own folds and shadows over the print, so it reads as printed cloth
    s += '<image href="' + src + '" xlink:href="' + src + '" width="' + W + '" height="' + H + '" opacity=".55" style="mix-blend-mode:multiply"/>';
    s += "</g></svg>";
    return s;
  }
  window.Mockup = { render: render };
})();
