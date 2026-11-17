// Photo mockups: real tee and polo photos, dyed to each colourway, with the print laid into the fabric.
// Layers: photo (white) → colour multiplied in → print → the photo's folds multiplied over the print.
// Mockup.render(kind, opts, ways) returns SVG markup, so it drops in anywhere the vector shirts were used.
(function () {
  var IMG = {
    "tee-front": [882, 926], "tee-back": [896, 938],
    "polo-front": [897, 1114], "polo-back": [885, 1108],
  };
  // Print zones as fractions of the image (chest = wearer's left, so viewer's right)
  var ZONE = {
    tee: { chest: [0.62, 0.27, 0.11], name: 0.2, num: 0.3, numH: 0.22, tag: 0.86, mid: 0.5 },
    polo: { chest: [0.66, 0.30, 0.1], name: 0.19, num: 0.3, numH: 0.2, tag: 0.88, mid: 0.5 },
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
    return { body: body, ink: ink, line: line, accent: accent };
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
    s += '<rect width="' + W + '" height="' + H + '" fill="' + c.body + '" style="mix-blend-mode:multiply"/>';
    // 3) the print, inside the shirt only
    s += '<g><g filter="url(#' + id + 'ink)">';
    // The Kitchen Line: one stripe at the height of the 7 ft non-volley line, front and back.
    // 1-of-1: a single pickleball sits on the line, at a spot set by the player's name.
    var r = rng(code + (o.name || "")), ly = H * (back ? 0.68 : 0.7), lh = H * 0.02, gold = "url(#" + id + "g)", line = o.edition ? gold : c.accent;
    s += '<rect x="0" y="' + ly.toFixed(1) + '" width="' + W + '" height="' + lh.toFixed(1) + '" fill="' + line + '"/>';
    s += '<rect x="0" y="' + (ly + lh * 1.7).toFixed(1) + '" width="' + W + '" height="' + (lh * 0.18).toFixed(1) + '" fill="' + c.ink + '" opacity=".55"/>';
    s += '<text x="' + (W * (back ? 0.27 : 0.73)).toFixed(1) + '" y="' + (ly + lh * 0.72).toFixed(1) + '" text-anchor="middle" font-family="DM Sans, sans-serif" font-weight="700" font-size="' + (lh * 0.62).toFixed(1) + '" letter-spacing="' + (lh * 0.22).toFixed(1) + '" fill="' + c.ink + '" opacity=".8">NON-VOLLEY · 7 FT</text>';
    if (back) {
      var bx = W * (0.5 + (r() - 0.5) * 0.36), br = lh * 1.05, holes = "";
      for (var k = 0; k < 6; k++) { var an = k * 60 + r() * 20, rr = br * 0.55; holes += '<circle cx="' + (Math.cos(an * Math.PI / 180) * rr).toFixed(1) + '" cy="' + (Math.sin(an * Math.PI / 180) * rr).toFixed(1) + '" r="' + (br * 0.13).toFixed(1) + '"/>'; }
      s += '<g transform="translate(' + bx.toFixed(1) + " " + (ly - br * 0.62).toFixed(1) + ')"><circle r="' + br.toFixed(1) + '" fill="' + (o.edition ? gold : c.ink) + '"/><g fill="' + (o.edition ? c.ink : c.accent) + '">' + holes + '<circle r="' + (br * 0.13).toFixed(1) + '"/></g></g>';
    }
    if (!back) {
      var cx = W * z.chest[0], cy = H * z.chest[1], cw = W * z.chest[2];
      s += '<image href="/assets/logo.svg" xlink:href="/assets/logo.svg" x="' + (cx - cw / 2).toFixed(1) + '" y="' + (cy - cw / 2).toFixed(1) + '" width="' + cw.toFixed(1) + '" height="' + cw.toFixed(1) + '"/>';
      s += '<text x="' + cx.toFixed(1) + '" y="' + (cy + cw * 0.78).toFixed(1) + '" text-anchor="middle" font-family="Fredoka, sans-serif" font-weight="700" font-size="' + (cw * 0.2).toFixed(1) + '" fill="' + c.ink + '" letter-spacing="1">DINKIN’ DONUT</text>';
      if (o.edition) { var lw = W * 0.11, lx = W * 0.3, lyy = H * 0.86; s += '<g transform="translate(' + lx.toFixed(1) + " " + lyy.toFixed(1) + ')"><rect x="' + (-lw / 2) + '" y="' + (-lw * 0.2) + '" width="' + lw + '" height="' + lw * 0.4 + '" rx="' + lw * 0.06 + '" fill="' + gold + '"/><text y="' + (lw * 0.09).toFixed(1) + '" text-anchor="middle" font-family="Fredoka, sans-serif" font-weight="700" font-size="' + (lw * 0.22).toFixed(1) + '" fill="#3B2416" letter-spacing="1">THE 20</text></g>'; }
      if (o.print === "club" || o.tag) s += '<text x="' + cx.toFixed(1) + '" y="' + (cy + cw * 1.02).toFixed(1) + '" text-anchor="middle" font-family="DM Sans, sans-serif" font-weight="700" font-size="' + (cw * 0.13).toFixed(1) + '" fill="' + c.ink + '" opacity=".75" letter-spacing="3">' + esc(o.tag || "DOHA") + "</text>";
    } else {
      var name = String(o.name || "").toUpperCase().slice(0, 12), num = String(o.num == null ? "" : o.num).slice(0, 2), mid = W * z.mid;
      if (name) s += '<text x="' + mid + '" y="' + (H * z.name).toFixed(1) + '" text-anchor="middle" font-family="Fredoka, sans-serif" font-weight="700" font-size="' + (W * (name.length > 8 ? 0.05 : 0.058)).toFixed(1) + '" fill="' + c.ink + '" letter-spacing="' + (W * 0.016).toFixed(1) + '">' + esc(name) + "</text>";
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
