// Club Jersey renderer. Parametric SVG: colourway, side, name, number.
(function () {
  var WAYS = {
    glaze:    { label: "Brass", note: "Home", yoke: "#9C7A45", yokeDeep: "#7E6034", body: "#F4EFE3", bodyDeep: "#E6DAC4", sleeve: "#1D2840", trim: "#9C7A45", ink: "#1D2840", hole: "#1D2840", num: "#1D2840", numLine: "#B8955C" , yokeInk: "#1D2840" },
    court:    { label: "Ivory & Navy", note: "Away", yoke: "#1D2840", yokeDeep: "#141C30", body: "#F3EEE2", bodyDeep: "#EADFCF", sleeve: "#1D2840", trim: "#C9A86B", ink: "#1D2840", hole: "#1D2840", num: "#1D2840", numLine: "#F3EEE2" , yokeInk: "#F3EEE2" },
    midnight: { label: "Midnight", note: "Tournament", yoke: "#C9A86B", yokeDeep: "#9C7A45", body: "#161F33", bodyDeep: "#10162A", sleeve: "#10162A", trim: "#E2D2A6", ink: "#F3EEE2", hole: "#F3EEE2", num: "#E2D2A6", numLine: "#161F33" , yokeInk: "#1D2840" },
    cream:    { label: "Cream", note: "Minimal", yoke: "#E0D7C3", yokeDeep: "#D9C4A6", body: "#FBF6EE", bodyDeep: "#EDE3D4", sleeve: "#FBF6EE", trim: "#1D2840", ink: "#1D2840", hole: "#1D2840", num: "#1D2840", numLine: "#FBF6EE" , yokeInk: "#1D2840" },
    cocoa:    { label: "Navy Tonal", note: "Tonal", yoke: "#2A3756", yokeDeep: "#222C45", body: "#1D2840", bodyDeep: "#161F33", sleeve: "#1D2840", trim: "#E2D2A6", ink: "#E0D7C3", hole: "#E0D7C3", num: "#E2D2A6", numLine: "#1D2840" , yokeInk: "#E0D7C3" },
    sage:     { label: "Stone", note: "Soft", yoke: "#FBF6EE", yokeDeep: "#E9DFCF", body: "#D6C8AC", bodyDeep: "#C9B896", sleeve: "#C9B896", trim: "#1D2840", ink: "#1D2840", hole: "#1D2840", num: "#1D2840", numLine: "#D6C8AC" , yokeInk: "#2C4A33" },
    blush:    { label: "Oatmeal", note: "Soft", yoke: "#1D2840", yokeDeep: "#161F33", body: "#EDE4D3", bodyDeep: "#E3D8C3", sleeve: "#EDE4D3", trim: "#1D2840", ink: "#1D2840", hole: "#1D2840", num: "#1D2840", numLine: "#EDE4D3" , yokeInk: "#E6D8BC" },
  };

  var uid = 0;
  // 1 of 1: a pattern seed and a short code derived from the name, so every personalised shirt is unique
  function seed(str) {
    var h = 2166136261 >>> 0, t = String(str || "DINK").toUpperCase();
    for (var i = 0; i < t.length; i++) { h ^= t.charCodeAt(i); h = Math.imul(h, 16777619) >>> 0; }
    var a = h || 1, rng = function () { a ^= a << 13; a >>>= 0; a ^= a >> 17; a ^= a << 5; a >>>= 0; return a / 4294967296; };
    return { rng: rng, code: "DD-" + (h >>> 16).toString(16).toUpperCase().padStart(4, "0") };
  }
  function hemTag(x, y, code, ink) {
    return '<g opacity=".85"><rect x="' + (x - 34) + '" y="' + y + '" width="68" height="13" rx="2" fill="' + ink + '" opacity=".14"/><text x="' + x + '" y="' + (y + 9.2) + '" text-anchor="middle" font-family="DM Sans, sans-serif" font-weight="700" font-size="5.4" letter-spacing="1.2" fill="' + ink + '">1 OF 1 · ' + code + '</text></g>';
  }
  var BODY = "M152 34Q200 64 248 34L316 54L380 122L350 172L314 154L312 392L318 404Q262 434 200 436Q138 434 82 404L88 392L86 154L50 172L20 122L84 54Z";
  var BODY_BACK = "M152 34Q200 46 248 34L316 54L380 122L350 172L314 154L312 392L318 404Q262 434 200 436Q138 434 82 404L88 392L86 154L50 172L20 122L84 54Z";
  var SLEEVE_L = "M150 34L82 54L16 120L48 174L84 152Q114 88 156 38Z";
  var SLEEVE_R = "M250 34L318 54L384 120L352 174L316 152Q286 88 244 38Z";
  // Yoke: a clean heritage band across the shoulders with a gentle chevron at the centre
  function drip(y) {
    return "M40 " + (y - 140) + "L360 " + (y - 140) + "L360 " + y + "L212 " + y + "L200 " + (y + 12) + "L188 " + y + "L40 " + y + "Z";
  }

  var HOLES_BASE = [[110,250],[150,236],[196,262],[246,240],[292,256],[124,300],[172,292],[222,306],[270,296],[102,350],[148,342],[198,356],[250,344],[298,352],[128,394],[178,388],[230,396],[278,390]];

  function render(o) {
    var w = WAYS[o.way] || WAYS.glaze, back = o.side === "back", id = "j" + (++uid);
    var name = String(o.name || "").toUpperCase().slice(0, 12), num = String(o.num || "").replace(/\D/g, "").slice(0, 2);
    var outline = back ? BODY_BACK : BODY, yokeY = back ? 118 : 136;
    var s = '<svg viewBox="0 0 400 450" class="jersey" role="img" aria-label="' + w.label + ' jersey, ' + (back ? "back" : "front") + (name ? ", " + name : "") + (num ? " " + num : "") + '">';
    s += '<defs>' +
      '<clipPath id="' + id + 'c"><path d="' + outline + '"/></clipPath>' +
      '<linearGradient id="' + id + 'shade" x1="0" x2="1"><stop offset="0" stop-color="#000" stop-opacity=".30"/><stop offset=".22" stop-color="#000" stop-opacity=".04"/><stop offset=".5" stop-color="#000" stop-opacity="0"/><stop offset=".78" stop-color="#000" stop-opacity=".05"/><stop offset="1" stop-color="#000" stop-opacity=".32"/></linearGradient>' +
      '<linearGradient id="' + id + 'v" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".16"/><stop offset=".35" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".18"/></linearGradient>' +
      '<radialGradient id="' + id + 'hl" cx=".42" cy=".3" r=".55"><stop offset="0" stop-color="#fff" stop-opacity=".22"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient>' +
      '<filter id="' + id + 'n" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="1.1" numOctaves="2" seed="7"/><feColorMatrix type="saturate" values="0"/><feComponentTransfer><feFuncA type="table" tableValues="0 0.16"/></feComponentTransfer></filter>' +
      '<filter id="' + id + 'b"><feGaussianBlur stdDeviation="5"/></filter>' +
      '<filter id="' + id + 'sh" x="-20%" y="-20%" width="140%" height="150%"><feGaussianBlur stdDeviation="12"/></filter>' +
      '<pattern id="' + id + 'mesh" width="6" height="6" patternUnits="userSpaceOnUse"><circle cx="3" cy="3" r=".9" fill="#000" opacity=".1"/></pattern>' +
      '</defs>';
    // contact shadow
    s += '<ellipse cx="200" cy="428" rx="150" ry="14" fill="#1D2840" opacity=".28" filter="url(#' + id + 'sh)"/>';
    s += '<g clip-path="url(#' + id + 'c)">';
    s += '<rect width="400" height="450" fill="' + w.body + '"/>';
    // tonal pickleball holes, sublimated into the body
    var sd = seed(o.name), HOLES = HOLES_BASE.map(function (h) { return [h[0] + (sd.rng() - 0.5) * 34, h[1] + (sd.rng() - 0.5) * 26, 5 + sd.rng() * 7]; });
    s += '<g fill="' + w.hole + '" opacity=".07">' + HOLES.map(function (h) { return '<ellipse cx="' + h[0].toFixed(1) + '" cy="' + (h[1] + (back ? -8 : 0)).toFixed(1) + '" rx="' + h[2].toFixed(1) + '" ry="' + (h[2] * 0.83).toFixed(1) + '"/>'; }).join("") + '</g>';
    // side mesh panels
    s += '<path d="M82 154L118 160L112 414L77 412Z" fill="url(#' + id + 'mesh)"/><path d="M318 154L282 160L288 414L323 412Z" fill="url(#' + id + 'mesh)"/>';
    // yoke band + soft shadow
    s += '<path d="' + drip(yokeY) + '" fill="#000" opacity=".12" transform="translate(0 3)" filter="url(#' + id + 'b)"/>';
    s += '<path d="' + drip(yokeY) + '" fill="' + w.yoke + '"/>';
    s += '<path d="' + drip(yokeY) + '" fill="none" stroke="' + w.yokeDeep + '" stroke-width="1.5" opacity=".8"/>';
    // sleeves
    s += '<path d="' + SLEEVE_L + '" fill="' + w.sleeve + '"/><path d="' + SLEEVE_R + '" fill="' + w.sleeve + '"/>';
    // sleeve cuffs: brand stripe
    s += '<path d="M23 118L55 172L59 169.5L27 115.5Z" fill="' + w.trim + '"/><path d="M377 118L345 172L341 169.5L373 115.5Z" fill="' + w.trim + '"/>';
    if (!back) {
      // left-chest crest, right-chest place line, centre wordmark
      s += '<image href="/assets/logo.svg" x="240" y="172" width="36" height="36"/>';
      s += '<text x="258" y="222" text-anchor="middle" font-family="DM Sans, sans-serif" font-weight="700" font-size="6.5" letter-spacing="3" fill="' + w.ink + '" opacity=".75">DOHA</text>';
    } else {
      var mode = o.print || "full";
      s += '<image href="/assets/logo.svg" x="188" y="44" width="24" height="24"/>';
      s += '<text x="200" y="' + (mode === "plain" ? 100 : 92) + '" text-anchor="middle" font-family="Fraunces, sans-serif" font-weight="700" font-size="15" letter-spacing="1" fill="' + (w.yokeInk || w.ink) + '">Dink Different</text>';
      s += '<text x="200" y="' + (mode === "plain" ? 112 : 104) + '" text-anchor="middle" font-family="DM Sans, sans-serif" font-weight="700" font-size="6.5" letter-spacing="3.2" fill="' + (w.yokeInk || w.ink) + '" opacity=".8">PICKLEBALL CLUB · DOHA</text>';
      var esc = function (t) { return t.replace(/&/g, "&amp;").replace(/</g, "&lt;"); };
      if (mode === "plain") {
        // Plain back: oversized crest and wordmark
        s += '<circle cx="200" cy="262" r="62" fill="#000" opacity=".14" filter="url(#' + id + 'b)"/><image href="/assets/logo.svg" x="136" y="196" width="128" height="128"/>';
        s += '<text x="200" y="364" text-anchor="middle" font-family="Fraunces, sans-serif" font-weight="700" font-size="24" fill="' + w.ink + '">Dink Different</text>';
      } else if (mode === "name") {
        s += '<text x="200" y="262" text-anchor="middle" font-family="Fraunces, sans-serif" font-weight="700" font-size="' + (name.length > 8 ? 40 : 52) + '" fill="' + w.num + '" stroke="' + w.numLine + '" stroke-width="3" paint-order="stroke" stroke-linejoin="round">' + esc(name || "YOUR NAME") + '</text>';
      } else {
        s += '<text x="200" y="182" text-anchor="middle" font-family="DM Sans, sans-serif" font-weight="700" font-size="' + (name.length > 9 ? 21 : 25) + '" letter-spacing="' + (name.length > 9 ? 3 : 6) + '" fill="' + w.ink + '">' + esc(name || "YOUR NAME") + '</text>';
        var n = num || "00", big = '<text x="200" y="300" text-anchor="middle" font-family="Fraunces, sans-serif" font-weight="700" font-size="104" ';
        s += big + 'fill="none" stroke="' + w.numLine + '" stroke-width="7" stroke-linejoin="round" opacity=".9">' + n + '</text>';
        s += big + 'fill="' + w.num + '">' + n + '</text>';
      }
      s += '<text x="200" y="372" text-anchor="middle" font-family="DM Sans, sans-serif" font-weight="700" font-size="7" letter-spacing="4" fill="' + w.ink + '" opacity=".7">DINK DIFFERENT</text>';
      if (name) s += hemTag(200, 404, sd.code, w.ink);
    }
    // side vents
    s += '<g stroke="#000" stroke-opacity=".25" stroke-width="1.2"><path d="M88 392L84 404"/><path d="M312 392L316 404"/></g>';
    // construction: raglan seams + stitching, hem stitch
    s += '<g fill="none" stroke="#000" stroke-opacity=".28" stroke-width="1.4"><path d="M156 38Q114 88 84 152"/><path d="M244 38Q286 88 316 152"/></g>';
    s += '<g fill="none" stroke="#fff" stroke-opacity=".35" stroke-width=".9" stroke-dasharray="3 3"><path d="M160 42Q119 90 89 154"/><path d="M240 42Q281 90 311 154"/><path d="M90 400Q200 430 310 400"/></g>';
    // fabric folds
    s += '<g filter="url(#' + id + 'b)" fill="none" stroke-linecap="round"><path d="M128 330Q140 372 132 408" stroke="#000" stroke-opacity=".08" stroke-width="10"/><path d="M262 300Q252 352 268 404" stroke="#000" stroke-opacity=".08" stroke-width="12"/><path d="M146 318Q156 360 150 400" stroke="#fff" stroke-opacity=".14" stroke-width="7"/><path d="M98 168Q112 200 104 236" stroke="#000" stroke-opacity=".12" stroke-width="9"/></g>';
    // light
    s += '<rect width="400" height="450" fill="url(#' + id + 'shade)"/><rect width="400" height="450" fill="url(#' + id + 'v)"/><rect width="400" height="450" fill="url(#' + id + 'hl)"/>';
    s += '<rect width="400" height="450" filter="url(#' + id + 'n)"/>';
    s += '</g>';
    // collar: rib knit with inner back visible on the front view
    if (!back) {
      s += '<path d="M150 34Q200 66 250 34Q200 50 150 34Z" fill="' + w.bodyDeep + '"/><path d="M150 34Q200 66 250 34" fill="none" stroke="' + w.trim + '" stroke-width="7" stroke-linecap="round"/>';
      s += '<path d="M150 34Q200 66 250 34" fill="none" stroke="#000" stroke-opacity=".2" stroke-width="1"/>';
      s += '<text x="200" y="52" text-anchor="middle" font-family="DM Sans, sans-serif" font-size="5" font-weight="700" letter-spacing="1" fill="' + w.ink + '" opacity=".5">DD · M</text>';
    } else {
      s += '<path d="M150 34Q200 46 250 34" fill="none" stroke="' + w.trim + '" stroke-width="7" stroke-linecap="round"/>';
    }
    s += '<path d="' + outline + '" fill="none" stroke="#000" stroke-opacity=".22" stroke-width="1.5"/>';
    return s + "</svg>";
  }

  // Court Polo: tapered performance polo, quarter zip, contrast yoke with piping, mesh side panels.
  var POLO_WAYS = {
    clubhouse: { label: "Clubhouse", note: "Ivory & navy", body: "#F1EBDD", yoke: "#1D2840", side: "#1D2840", collar: "#1D2840", tipA: "#9C7A45", tipB: "#E2D2A6", pipe: "#9C7A45", ink: "#1D2840", inkOnYoke: "#F4EFE3", zip: "#9C7A45" },
    night:     { label: "Night", note: "Navy & brass", body: "#1D2840", yoke: "#161F33", side: "#161F33", collar: "#F1EBDD", tipA: "#9C7A45", tipB: "#E2D2A6", pipe: "#9C7A45", ink: "#F1EBDD", inkOnYoke: "#F1EBDD", zip: "#E2D2A6" },
    glaze:     { label: "Camel", note: "Camel & navy", body: "#B89B72", yoke: "#1D2840", side: "#1D2840", collar: "#1D2840", tipA: "#E2D2A6", tipB: "#F1EBDD", pipe: "#E2D2A6", ink: "#1D2840", inkOnYoke: "#F1EBDD", zip: "#E2D2A6" },
  };
  var P_BODY = "M160 40C176 50 224 50 240 40L300 56C318 60 330 70 338 84L374 152L332 174L312 142C312 170 314 200 310 240C308 300 314 360 318 404Q262 418 200 420Q138 418 82 404C86 360 92 300 90 240C86 200 88 170 88 142L68 174L26 152L62 84C70 70 82 60 100 56Z";
  function renderPolo(o) {
    var w = POLO_WAYS[o.way] || POLO_WAYS.clubhouse, back = o.side === "back", id = "p" + (++uid);
    var name = String(o.name || "").slice(0, 14), esc = function (t) { return t.replace(/&/g, "&amp;").replace(/</g, "&lt;"); }, sd = seed(o.name);
    var yokeEdge = back ? "M60 96Q200 120 340 96" : "M60 104Q200 132 340 104";
    var s = '<svg viewBox="0 0 400 450" class="jersey" role="img" aria-label="' + w.label + ' court polo, ' + (back ? "back" : "front") + '">';
    s += '<defs><clipPath id="' + id + 'c"><path d="' + P_BODY + '"/></clipPath>' +
      '<linearGradient id="' + id + 'shade" x1="0" x2="1"><stop offset="0" stop-color="#000" stop-opacity=".32"/><stop offset=".2" stop-color="#000" stop-opacity=".05"/><stop offset=".5" stop-color="#000" stop-opacity="0"/><stop offset=".8" stop-color="#000" stop-opacity=".06"/><stop offset="1" stop-color="#000" stop-opacity=".34"/></linearGradient>' +
      '<linearGradient id="' + id + 'v" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".16"/><stop offset=".4" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".2"/></linearGradient>' +
      '<radialGradient id="' + id + 'hl" cx=".4" cy=".32" r=".55"><stop offset="0" stop-color="#fff" stop-opacity=".2"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient>' +
      '<filter id="' + id + 'n" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="1.3" numOctaves="2" seed="3"/><feColorMatrix type="saturate" values="0"/><feComponentTransfer><feFuncA type="table" tableValues="0 0.17"/></feComponentTransfer></filter>' +
      '<pattern id="' + id + 'mesh" width="5" height="5" patternUnits="userSpaceOnUse"><circle cx="2.5" cy="2.5" r="1" fill="#000" fill-opacity=".28"/></pattern>' +
      '<filter id="' + id + 'b"><feGaussianBlur stdDeviation="5"/></filter><filter id="' + id + 'sh" x="-20%" y="-20%" width="140%" height="150%"><feGaussianBlur stdDeviation="12"/></filter>' +
      '<filter id="' + id + 'emb"><feDropShadow dx="0" dy="1" stdDeviation=".6" flood-color="#000" flood-opacity=".5"/></filter></defs>';
    s += '<ellipse cx="200" cy="430" rx="140" ry="13" fill="#1D2840" opacity=".3" filter="url(#' + id + 'sh)"/>';
    s += '<g clip-path="url(#' + id + 'c)"><rect width="400" height="450" fill="' + w.body + '"/>';
    var dots = ""; for (var di = 0; di < 22; di++) dots += '<circle cx="' + (110 + sd.rng() * 180).toFixed(1) + '" cy="' + (190 + sd.rng() * 190).toFixed(1) + '" r="' + (1 + sd.rng() * 1.8).toFixed(1) + '"/>';
    s += '<g fill="' + w.pipe + '" opacity=".25">' + dots + '</g>';
    // contrast yoke + piping
    s += '<path d="M0 0H400V' + (back ? 96 : 104) + yokeEdge.replace(/^M60 \d+/, "L340 " + (back ? 96 : 104)).replace("Q200", "Q200").replace(/L340 \d+Q200 (\d+) 340 \d+/, "L340 " + (back ? 96 : 104) + "Q200 $1 60 " + (back ? 96 : 104)) + 'L0 ' + (back ? 96 : 104) + 'Z" fill="' + w.yoke + '"/>';
    s += '<path d="' + yokeEdge + '" fill="none" stroke="' + w.pipe + '" stroke-width="3.2"/>';
    // mesh side panels
    s += '<path d="M88 142C88 200 92 300 82 404L112 410C116 300 112 200 114 150Z" fill="' + w.side + '"/><path d="M88 142C88 200 92 300 82 404L112 410C116 300 112 200 114 150Z" fill="url(#' + id + 'mesh)"/>';
    s += '<path d="M312 142C312 200 308 300 318 404L288 410C284 300 288 200 286 150Z" fill="' + w.side + '"/><path d="M312 142C312 200 308 300 318 404L288 410C284 300 288 200 286 150Z" fill="url(#' + id + 'mesh)"/>';
    s += '<g fill="none" stroke="' + w.pipe + '" stroke-width="1.6" opacity=".9"><path d="M114 150C112 200 116 300 112 410"/><path d="M286 150C288 200 284 300 288 410"/></g>';
    // sleeves: set-in seam, cuff band with tipping
    s += '<g fill="none" stroke="#000" stroke-opacity=".25" stroke-width="1.3"><path d="M100 56C96 90 92 116 88 142"/><path d="M300 56C304 90 308 116 312 142"/></g>';
    s += '<path d="M26 152L68 174L74 162L33 140Z" fill="' + w.yoke + '"/><path d="M31 145L71 167" stroke="' + w.tipA + '" stroke-width="2.4"/><path d="M34 140L73 161" stroke="' + w.tipB + '" stroke-width="1.4"/>';
    s += '<path d="M374 152L332 174L326 162L367 140Z" fill="' + w.yoke + '"/><path d="M369 145L329 167" stroke="' + w.tipA + '" stroke-width="2.4"/><path d="M366 140L327 161" stroke="' + w.tipB + '" stroke-width="1.4"/>';
    // hem with side slits
    s += '<path d="M84 398L94 384M316 398L306 384" stroke="#000" stroke-opacity=".3" stroke-width="1.4"/><path d="M86 396Q200 414 314 396" fill="none" stroke="#fff" stroke-opacity=".3" stroke-dasharray="3 3" stroke-width=".9"/>';
    if (!back) {
      // quarter zip
      s += '<path d="M200 56V170" stroke="#000" stroke-opacity=".35" stroke-width="5"/><path d="M200 58V168" stroke="#C9C2B8" stroke-width="2.4" stroke-dasharray="1.2 1.6"/>';
      s += '<rect x="195" y="96" width="10" height="16" rx="3" fill="' + w.zip + '" stroke="#000" stroke-opacity=".3"/><rect x="198" y="112" width="4" height="12" rx="2" fill="' + w.zip + '"/>';
      // crest + chest line
      s += '<g filter="url(#' + id + 'emb)"><image href="/assets/logo.svg" x="244" y="146" width="36" height="36"/></g><circle cx="262" cy="164" r="18.5" fill="none" stroke="#000" stroke-opacity=".22" stroke-dasharray="1.1 1.1" stroke-width=".8"/>';
    } else {
      s += '<text x="200" y="80" text-anchor="middle" font-family="Fraunces, sans-serif" font-weight="700" font-size="19" fill="' + w.inkOnYoke + '" filter="url(#' + id + 'emb)">Dink Different</text>';
      s += '<text x="200" y="91" text-anchor="middle" font-family="DM Sans, sans-serif" font-weight="700" font-size="6" letter-spacing="3" fill="' + w.inkOnYoke + '" opacity=".8">PICKLEBALL CLUB · DOHA</text>';
      if (name && o.print !== "plain") { s += '<text x="200" y="146" text-anchor="middle" font-family="DM Sans, sans-serif" font-weight="700" font-size="13" letter-spacing="5" fill="' + w.ink + '" filter="url(#' + id + 'emb)">' + esc(name.toUpperCase()) + '</text>'; s += hemTag(200, 404, sd.code, w.ink); }
      s += '<rect x="188" y="44" width="24" height="9" rx="2" fill="' + w.pipe + '"/>';
    }
    // folds + light + grain
    s += '<g filter="url(#' + id + 'b)" fill="none" stroke-linecap="round"><path d="M138 300Q150 352 142 406" stroke="#000" stroke-opacity=".12" stroke-width="10"/><path d="M262 290Q252 346 268 404" stroke="#000" stroke-opacity=".12" stroke-width="12"/><path d="M156 300Q166 352 160 400" stroke="#fff" stroke-opacity=".12" stroke-width="7"/><path d="M120 200Q132 236 124 270" stroke="#000" stroke-opacity=".1" stroke-width="8"/></g>';
    s += '<rect width="400" height="450" fill="url(#' + id + 'shade)"/><rect width="400" height="450" fill="url(#' + id + 'v)"/><rect width="400" height="450" fill="url(#' + id + 'hl)"/><rect width="400" height="450" filter="url(#' + id + 'n)"/></g>';
    // collar
    if (!back) {
      s += '<path d="M152 34Q200 20 248 34Q200 46 152 34Z" fill="' + w.collar + '"/><path d="M152 34Q200 20 248 34Q200 46 152 34Z" fill="#000" opacity=".3"/>';
      s += '<path d="M150 32Q172 46 198 56L182 98Q158 82 128 68Z" fill="' + w.collar + '"/><path d="M250 32Q228 46 202 56L218 98Q242 82 272 68Z" fill="' + w.collar + '"/>';
      s += '<path d="M134 66Q160 79 180 92" fill="none" stroke="' + w.tipA + '" stroke-width="2.2"/><path d="M138 61Q162 74 182 87" fill="none" stroke="' + w.tipB + '" stroke-width="1.3"/>';
      s += '<path d="M266 66Q240 79 220 92" fill="none" stroke="' + w.tipA + '" stroke-width="2.2"/><path d="M262 61Q238 74 218 87" fill="none" stroke="' + w.tipB + '" stroke-width="1.3"/>';
      s += '<path d="M150 32Q172 46 198 56L182 98Q158 82 128 68ZM250 32Q228 46 202 56L218 98Q242 82 272 68Z" fill="none" stroke="#000" stroke-opacity=".3" stroke-width="1"/>';
      s += '<path d="M182 98Q158 82 128 68M218 98Q242 82 272 68" fill="none" stroke="#000" stroke-opacity=".22" stroke-width="4" filter="url(#' + id + 'b)"/>';
    } else {
      s += '<path d="M150 40Q200 52 250 40L252 28Q200 42 148 28Z" fill="' + w.collar + '"/><path d="M150 36Q200 48 250 36" stroke="' + w.tipA + '" stroke-width="2" fill="none"/><path d="M150 32Q200 44 250 32" stroke="' + w.tipB + '" stroke-width="1.2" fill="none"/>';
    }
    s += '<path d="' + P_BODY + '" fill="none" stroke="#000" stroke-opacity=".22" stroke-width="1.5"/>';
    return s + "</svg>";
  }

  // Mabuhay Polo: pickleball polo with a curved shoulder yoke, gold piping, banig weave and a sun-and-stars signature.
  var PRO_WAYS = {
    bughaw: { label: "Regatta", note: "Navy", body: "#16213F", deep: "#111A33", sash: "#F7F2EA", sash2: "#C9A86B", trim: "#8E2F2F", collar: "#F7F2EA", ink: "#F7F2EA", num: "#F7F2EA", numLine: "#C9A86B", yokeInk: "#16213F" },
    perlas: { label: "Perlas", note: "Pearl white", body: "#F7F2EA", deep: "#E4D8C6", sash: "#1D2840", sash2: "#C9A86B", trim: "#8E2F2F", collar: "#1D2840", ink: "#1D2840", num: "#1D2840", numLine: "#C9A86B", yokeInk: "#F7F2EA" },
    pula: { label: "Claret", note: "Claret", body: "#5A1A22", deep: "#46141A", sash: "#F7F2EA", sash2: "#C9A86B", trim: "#1D2840", collar: "#F7F2EA", ink: "#F7F2EA", num: "#F7F2EA", numLine: "#C9A86B", yokeInk: "#5A1A22" },
    glazepro: { label: "Sandstone", note: "Sand", body: "#D9CAAE", deep: "#C9B896", sash: "#9C7A45", sash2: "#1D2840", trim: "#1D2840", collar: "#1D2840", ink: "#1D2840", num: "#1D2840", numLine: "#B8955C", yokeInk: "#1D2840" },
  };

  var PRO_BODY = "M146 40Q200 60 254 40L318 56L380 124L348 172L314 156L312 392L318 404Q262 434 200 436Q138 434 82 404L88 392L86 156L52 172L20 124L82 56Z";
  var PRO_BACK = "M146 36Q200 48 254 36L318 56L380 124L348 172L314 156L312 392L318 404Q262 434 200 436Q138 434 82 404L88 392L86 156L52 172L20 124L82 56Z";
  function serr(x1, y1, x2, y2, n, h, fill) { // serrated band along a line, teeth pointing inward
    var s = "", dx = (x2 - x1) / n, dy = (y2 - y1) / n, len = Math.hypot(x2 - x1, y2 - y1), nx = -(y2 - y1) / len * h, ny = (x2 - x1) / len * h, d = "M" + x1 + " " + y1;
    for (var i = 0; i < n; i++) { var ax = x1 + dx * i, ay = y1 + dy * i; d += "L" + (ax + dx / 2 + nx) + " " + (ay + dy / 2 + ny) + "L" + (ax + dx) + " " + (ay + dy); }
    return '<path d="' + d + 'Z" fill="' + fill + '"/>';
  }
  function renderPro(o) {
    var w = PRO_WAYS[o.way] || PRO_WAYS.adaam, back = o.side === "back", id = "k" + (++uid), mode = o.print || "full";
    var name = String(o.name || "").toUpperCase().slice(0, 12), num = String(o.num || "").replace(/\D/g, "").slice(0, 2), esc = function (t) { return t.replace(/&/g, "&amp;").replace(/</g, "&lt;"); };
    var outline = back ? PRO_BACK : PRO_BODY, sd = seed(o.name), rot = Math.round(sd.rng() * 90 - 45), sc = (0.8 + sd.rng() * 0.6).toFixed(2);
    var s = '<svg viewBox="0 0 400 450" class="jersey" role="img" aria-label="' + w.label + ' Mabuhay Polo, ' + (back ? "back" : "front") + '">';
    s += '<defs><clipPath id="' + id + 'c"><path d="' + outline + '"/></clipPath>' +
      '<pattern id="' + id + 'lat" width="24" height="24" patternUnits="userSpaceOnUse" patternTransform="rotate(' + rot + ') scale(' + sc + ')"><path d="M0 6H12M12 18H24M6 0V12M18 12V24" stroke="' + w.deep + '" stroke-width="3" opacity=".9"/><path d="M0 18H6M18 6H24M6 18V24M18 0V6" stroke="' + w.deep + '" stroke-width="3" opacity=".5"/></pattern>' +
      '<linearGradient id="' + id + 'shade" x1="0" x2="1"><stop offset="0" stop-color="#000" stop-opacity=".34"/><stop offset=".2" stop-color="#000" stop-opacity=".05"/><stop offset=".5" stop-color="#000" stop-opacity="0"/><stop offset=".8" stop-color="#000" stop-opacity=".06"/><stop offset="1" stop-color="#000" stop-opacity=".36"/></linearGradient>' +
      '<linearGradient id="' + id + 'v" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".14"/><stop offset=".4" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".2"/></linearGradient>' +
      '<radialGradient id="' + id + 'hl" cx=".42" cy=".3" r=".55"><stop offset="0" stop-color="#fff" stop-opacity=".18"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient>' +
      '<filter id="' + id + 'n" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="1.2" numOctaves="2" seed="5"/><feColorMatrix type="saturate" values="0"/><feComponentTransfer><feFuncA type="table" tableValues="0 0.14"/></feComponentTransfer></filter>' +
      '<filter id="' + id + 'b"><feGaussianBlur stdDeviation="5"/></filter><filter id="' + id + 'sh" x="-20%" y="-20%" width="140%" height="150%"><feGaussianBlur stdDeviation="12"/></filter></defs>';
    s += '<ellipse cx="200" cy="430" rx="150" ry="13" fill="#1D2840" opacity=".28" filter="url(#' + id + 'sh)"/>';
    s += '<g clip-path="url(#' + id + 'c)"><rect width="400" height="450" fill="' + w.body + '"/><rect width="400" height="450" fill="url(#' + id + 'lat)" opacity=".55"/>';
    // diagonal sash: wearer's right shoulder to left hip (mirrored on the back)
    // Curved shoulder yoke with gold piping
    var yb = back ? 100 : 114, yoke = "M0 0H400V" + yb + "H330Q200 " + (yb + 26) + " 70 " + yb + "H0Z";
    s += '<path d="' + yoke + '" fill="#000" opacity=".12" transform="translate(0 2)" filter="url(#' + id + 'b)"/>';
    s += '<path d="' + yoke + '" fill="' + w.sash + '"/>';
    s += '<path d="M330 ' + (yb + 3) + 'Q200 ' + (yb + 29) + ' 70 ' + (yb + 3) + '" fill="none" stroke="' + w.sash2 + '" stroke-width="1.8"/>';
    // side seams
    s += '<g stroke="#000" stroke-opacity=".18" stroke-width="1.2" fill="none"><path d="M82 156V412"/><path d="M318 156V412"/></g>';
    // serrated cuffs (nine points)
    s += '<path d="M20 124L52 172L60 167L28 119Z" fill="' + w.trim + '"/><path d="M30 118L62 166" stroke="' + w.sash2 + '" stroke-width="1.6"/>';
    s += '<path d="M380 124L348 172L340 167L372 119Z" fill="' + w.trim + '"/><path d="M370 118L338 166" stroke="' + w.sash2 + '" stroke-width="1.6"/>';
    if (!back) {
      s += '<image href="/assets/logo.svg" x="246" y="144" width="36" height="36"/>';
      s += '<text x="264" y="196" text-anchor="middle" font-family="DM Sans, sans-serif" font-weight="700" font-size="6.5" letter-spacing="2.6" fill="' + w.ink + '">MABUHAY</text>';
      s += '<path d="M188 56H212V140H188Z" fill="' + w.body + '"/><path d="M188 56V140H212V56" fill="none" stroke="#000" stroke-opacity=".22" stroke-width="1.2"/>';
      [80, 102, 124].forEach(function (y) { s += '<circle cx="200" cy="' + y + '" r="3.8" fill="' + w.collar + '"/><circle cx="200" cy="' + y + '" r="3.8" fill="none" stroke="#000" stroke-opacity=".3" stroke-width=".8"/>'; });
    } else {
      // eight-ray sun with three stars, embroidered under the collar
      var sun = '<g transform="translate(200 62)" fill="' + w.sash2 + '"><circle r="5"/>';
      for (var r = 0; r < 8; r++) sun += '<path d="M-1.6 -7L0 -12.5L1.6 -7Z" transform="rotate(' + (r * 45) + ')"/>';
      var star = function (x, y) { return '<path transform="translate(' + x + ' ' + y + ') scale(.9)" d="M0 -3.4L.9 -1.1L3.3 -1L1.4 .5L2.1 2.8L0 1.5L-2.1 2.8L-1.4 .5L-3.3 -1L-.9 -1.1Z"/>'; };
      sun += star(-20, -6) + star(20, -6) + star(0, 18) + '</g>';
      s += sun + '<text x="200" y="94" text-anchor="middle" font-family="DM Sans, sans-serif" font-weight="700" font-size="6.5" letter-spacing="3.2" fill="' + (w.yokeInk || w.ink) + '" opacity=".9">DINK DIFFERENT · MABUHAY</text>';
      if (mode === "plain") s += '<image href="/assets/logo.svg" x="150" y="190" width="100" height="100"/>';
      else {
        s += '<text x="200" y="' + (mode === "name" ? 250 : 150) + '" text-anchor="middle" font-family="DM Sans, sans-serif" font-weight="700" font-size="' + (mode === "name" ? 40 : (name.length > 9 ? 22 : 26)) + '" letter-spacing="' + (mode === "name" ? 4 : 5) + '" fill="' + w.ink + '">' + esc(name || "YOUR NAME") + '</text>';
        if (mode === "full") s += '<text x="200" y="290" text-anchor="middle" font-family="DM Sans, sans-serif" font-weight="700" font-size="104" letter-spacing="-3" fill="' + w.num + '" stroke="' + w.numLine + '" stroke-width="3" paint-order="stroke">' + (num || "00") + '</text>';
        if (name) s += hemTag(200, 404, sd.code, w.ink);
      }
    }
    s += '<g filter="url(#' + id + 'b)" fill="none" stroke-linecap="round"><path d="M130 330Q142 372 134 408" stroke="#000" stroke-opacity=".08" stroke-width="10"/><path d="M262 300Q252 352 268 404" stroke="#000" stroke-opacity=".08" stroke-width="12"/></g>';
    s += '<rect width="400" height="450" fill="url(#' + id + 'shade)"/><rect width="400" height="450" fill="url(#' + id + 'v)"/><rect width="400" height="450" fill="url(#' + id + 'hl)"/><rect width="400" height="450" filter="url(#' + id + 'n)"/></g>';
    // collar
    if (!back) {
      s += '<path d="M146 40Q200 60 254 40L246 30Q200 46 154 30Z" fill="#000" opacity=".25"/>';
      s += '<path d="M154 30Q174 46 200 56L186 96L134 64Z" fill="' + w.collar + '"/><path d="M246 30Q226 46 200 56L214 96L266 64Z" fill="' + w.collar + '"/>';
      s += '<path d="M140 62L184 90M260 62L216 90" stroke="' + w.sash2 + '" stroke-width="2"/>';
      s += '<path d="M154 30Q174 46 200 56L186 96L134 64ZM246 30Q226 46 200 56L214 96L266 64Z" fill="none" stroke="#000" stroke-opacity=".3" stroke-width="1"/>';
    } else {
      s += '<path d="M146 36Q200 50 254 36L256 26Q200 42 144 26Z" fill="' + w.collar + '"/>';
    }
    s += '<path d="' + outline + '" fill="none" stroke="#000" stroke-opacity=".22" stroke-width="1.5"/>';
    return s + "</svg>";
  }
  window.Jersey = { render: render, WAYS: WAYS, renderPolo: renderPolo, POLO_WAYS: POLO_WAYS, renderPro: renderPro, PRO_WAYS: PRO_WAYS };
})();
