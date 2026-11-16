// Glaze Jersey renderer. Parametric SVG: colourway, side, name, number.
(function () {
  var WAYS = {
    glaze:    { label: "Glaze", note: "Home", yoke: "#FF6FAB", yokeDeep: "#E2558F", body: "#D7F03C", bodyDeep: "#B8D02A", sleeve: "#3B2416", trim: "#FF6FAB", ink: "#3B2416", hole: "#3B2416", num: "#3B2416", numLine: "#FF6FAB" , yokeInk: "#3B2416" },
    court:    { label: "Court", note: "Away", yoke: "#2F7A4F", yokeDeep: "#24613E", body: "#FBF4EA", bodyDeep: "#EADFCF", sleeve: "#2F7A4F", trim: "#D7F03C", ink: "#2F7A4F", hole: "#2F7A4F", num: "#2F7A4F", numLine: "#FBF4EA" , yokeInk: "#FBF4EA" },
    midnight: { label: "Midnight", note: "Tournament", yoke: "#FF6FAB", yokeDeep: "#E2558F", body: "#2A1A10", bodyDeep: "#1C110A", sleeve: "#1C110A", trim: "#D7F03C", ink: "#FBF4EA", hole: "#FBF4EA", num: "#D7F03C", numLine: "#2A1A10" , yokeInk: "#3B2416" },
    cream:    { label: "Cream", note: "Minimal", yoke: "#E9D9C2", yokeDeep: "#D9C4A6", body: "#FBF6EE", bodyDeep: "#EDE3D4", sleeve: "#FBF6EE", trim: "#3B2416", ink: "#3B2416", hole: "#3B2416", num: "#3B2416", numLine: "#FBF6EE" , yokeInk: "#3B2416" },
    cocoa:    { label: "Cocoa", note: "Tonal", yoke: "#4A3020", yokeDeep: "#3E2819", body: "#3B2416", bodyDeep: "#2A1A10", sleeve: "#3B2416", trim: "#D7F03C", ink: "#E9D9C2", hole: "#E9D9C2", num: "#D7F03C", numLine: "#3B2416" , yokeInk: "#E9D9C2" },
    sage:     { label: "Sage", note: "Soft", yoke: "#FBF6EE", yokeDeep: "#E9DFCF", body: "#B9CDB3", bodyDeep: "#A2B99B", sleeve: "#9DB596", trim: "#3B2416", ink: "#2C4A33", hole: "#2C4A33", num: "#2C4A33", numLine: "#B9CDB3" , yokeInk: "#2C4A33" },
    blush:    { label: "Blush", note: "Soft", yoke: "#3B2416", yokeDeep: "#2A1A10", body: "#F6CFDE", bodyDeep: "#EDB8CC", sleeve: "#F6CFDE", trim: "#3B2416", ink: "#3B2416", hole: "#3B2416", num: "#3B2416", numLine: "#F6CFDE" , yokeInk: "#F6CFDE" },
  };

  var uid = 0;
  var BODY = "M150 34Q200 66 250 34L318 54L384 120L352 174L318 154L323 412Q200 428 77 412L82 154L48 174L16 120L82 54Z";
  var BODY_BACK = "M150 34Q200 46 250 34L318 54L384 120L352 174L318 154L323 412Q200 428 77 412L82 154L48 174L16 120L82 54Z";
  var SLEEVE_L = "M150 34L82 54L16 120L48 174L84 152Q114 88 156 38Z";
  var SLEEVE_R = "M250 34L318 54L384 120L352 174L316 152Q286 88 244 38Z";
  // Drip edge of the glaze yoke, left to right, then back across the shoulders
  // Minimal glaze edge: a smooth band with three drips, the centre one longest
  function drip(y) {
    return "M40 " + (y - 140) + "L360 " + (y - 140) + "L360 " + y +
      "C330 " + (y + 2) + " 300 " + (y - 4) + " 268 " + y + "C254 " + (y + 2) + " 252 " + (y + 22) + " 242 " + (y + 22) + "C232 " + (y + 22) + " 232 " + (y + 4) + " 220 " + (y + 4) +
      "C210 " + (y + 4) + " 210 " + (y + 46) + " 200 " + (y + 46) + "C190 " + (y + 46) + " 190 " + (y + 4) + " 180 " + (y + 4) +
      "C168 " + (y + 4) + " 168 " + (y + 16) + " 158 " + (y + 16) + "C148 " + (y + 16) + " 146 " + (y + 2) + " 132 " + y + "C100 " + (y - 4) + " 70 " + (y + 2) + " 40 " + y + "Z";
  }

  var HOLES = [[110,250],[150,236],[196,262],[246,240],[292,256],[124,300],[172,292],[222,306],[270,296],[102,350],[148,342],[198,356],[250,344],[298,352],[128,394],[178,388],[230,396],[278,390]];

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
    s += '<ellipse cx="200" cy="428" rx="150" ry="14" fill="#3B2416" opacity=".28" filter="url(#' + id + 'sh)"/>';
    s += '<g clip-path="url(#' + id + 'c)">';
    s += '<rect width="400" height="450" fill="' + w.body + '"/>';
    // tonal pickleball holes, sublimated into the body
    s += '<g fill="' + w.hole + '" opacity=".06">' + HOLES.map(function (h) { return '<ellipse cx="' + h[0] + '" cy="' + (h[1] + (back ? -8 : 0)) + '" rx="9" ry="7.5"/>'; }).join("") + '</g>';
    // side mesh panels
    s += '<path d="M82 154L118 160L112 414L77 412Z" fill="url(#' + id + 'mesh)"/><path d="M318 154L282 160L288 414L323 412Z" fill="url(#' + id + 'mesh)"/>';
    // glaze yoke with drips + drip shadow
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
      s += '<text x="142" y="194" text-anchor="middle" font-family="DM Sans, sans-serif" font-weight="700" font-size="8" letter-spacing="3.5" fill="' + w.ink + '" opacity=".75">DOHA</text>';
      s += '<text x="200" y="258" text-anchor="middle" font-family="Fredoka, sans-serif" font-weight="700" font-size="24" letter-spacing=".5" fill="' + w.ink + '">Dinkin’ Donut</text>';
    } else {
      var mode = o.print || "full";
      s += '<image href="/assets/logo.svg" x="188" y="44" width="24" height="24"/>';
      s += '<text x="200" y="' + (mode === "plain" ? 100 : 92) + '" text-anchor="middle" font-family="Fredoka, sans-serif" font-weight="700" font-size="15" letter-spacing="1" fill="' + (w.yokeInk || w.ink) + '">Dinkin’ Donut</text>';
      s += '<text x="200" y="' + (mode === "plain" ? 112 : 104) + '" text-anchor="middle" font-family="DM Sans, sans-serif" font-weight="700" font-size="6.5" letter-spacing="3.2" fill="' + (w.yokeInk || w.ink) + '" opacity=".8">PICKLEBALL CLUB · DOHA</text>';
      var esc = function (t) { return t.replace(/&/g, "&amp;").replace(/</g, "&lt;"); };
      if (mode === "plain") {
        // Plain back: oversized crest and wordmark
        s += '<circle cx="200" cy="262" r="62" fill="#000" opacity=".14" filter="url(#' + id + 'b)"/><image href="/assets/logo.svg" x="136" y="196" width="128" height="128"/>';
        s += '<text x="200" y="364" text-anchor="middle" font-family="Fredoka, sans-serif" font-weight="700" font-size="24" fill="' + w.ink + '">Dinkin’ Donut</text>';
      } else if (mode === "name") {
        s += '<text x="200" y="262" text-anchor="middle" font-family="Fredoka, sans-serif" font-weight="700" font-size="' + (name.length > 8 ? 40 : 52) + '" fill="' + w.num + '" stroke="' + w.numLine + '" stroke-width="3" paint-order="stroke" stroke-linejoin="round">' + esc(name || "YOUR NAME") + '</text>';
      } else {
        s += '<text x="200" y="182" text-anchor="middle" font-family="DM Sans, sans-serif" font-weight="700" font-size="' + (name.length > 9 ? 21 : 25) + '" letter-spacing="' + (name.length > 9 ? 3 : 6) + '" fill="' + w.ink + '">' + esc(name || "YOUR NAME") + '</text>';
        var n = num || "00", big = '<text x="200" y="326" text-anchor="middle" font-family="Fredoka, sans-serif" font-weight="700" font-size="132" ';
        s += big + 'fill="none" stroke="' + w.numLine + '" stroke-width="7" stroke-linejoin="round" opacity=".9">' + n + '</text>';
        s += big + 'fill="' + w.num + '">' + n + '</text>';
      }
      s += '<text x="200" y="392" text-anchor="middle" font-family="DM Sans, sans-serif" font-weight="700" font-size="8" letter-spacing="4" fill="' + w.ink + '" opacity=".75">STAY GLAZED</text>';
    }
    // construction: raglan seams + stitching, hem stitch
    s += '<g fill="none" stroke="#000" stroke-opacity=".28" stroke-width="1.4"><path d="M156 38Q114 88 84 152"/><path d="M244 38Q286 88 316 152"/></g>';
    s += '<g fill="none" stroke="#fff" stroke-opacity=".35" stroke-width=".9" stroke-dasharray="3 3"><path d="M160 42Q119 90 89 154"/><path d="M240 42Q281 90 311 154"/><path d="M80 402Q200 418 320 402"/></g>';
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
    clubhouse: { label: "Clubhouse", note: "Cream & court", body: "#FBF2E4", yoke: "#2F7A4F", side: "#2F7A4F", collar: "#2F7A4F", tipA: "#FF5FA2", tipB: "#D7F03C", pipe: "#FF5FA2", ink: "#2F7A4F", inkOnYoke: "#FFF6EA", zip: "#FF5FA2" },
    night:     { label: "Night", note: "Choco & glaze", body: "#3B2416", yoke: "#24160D", side: "#24160D", collar: "#FBF2E4", tipA: "#FF5FA2", tipB: "#D7F03C", pipe: "#FF5FA2", ink: "#FBF2E4", inkOnYoke: "#FBF2E4", zip: "#D7F03C" },
    glaze:     { label: "Glaze", note: "Pink & choco", body: "#FF6FAB", yoke: "#3B2416", side: "#3B2416", collar: "#3B2416", tipA: "#D7F03C", tipB: "#FBF2E4", pipe: "#D7F03C", ink: "#3B2416", inkOnYoke: "#FBF2E4", zip: "#D7F03C" },
  };
  var P_BODY = "M160 40C176 50 224 50 240 40L300 56C318 60 330 70 338 84L374 152L332 174L312 142C312 170 314 200 310 240C308 300 314 360 318 404Q262 418 200 420Q138 418 82 404C86 360 92 300 90 240C86 200 88 170 88 142L68 174L26 152L62 84C70 70 82 60 100 56Z";
  function renderPolo(o) {
    var w = POLO_WAYS[o.way] || POLO_WAYS.clubhouse, back = o.side === "back", id = "p" + (++uid);
    var name = String(o.name || "").slice(0, 14), esc = function (t) { return t.replace(/&/g, "&amp;").replace(/</g, "&lt;"); };
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
    s += '<ellipse cx="200" cy="430" rx="140" ry="13" fill="#3B2416" opacity=".3" filter="url(#' + id + 'sh)"/>';
    s += '<g clip-path="url(#' + id + 'c)"><rect width="400" height="450" fill="' + w.body + '"/>';
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
      s += '<text x="140" y="164" text-anchor="middle" font-family="Fredoka, sans-serif" font-weight="700" font-size="12" fill="' + w.ink + '" filter="url(#' + id + 'emb)">Dinkin’ Donut</text><text x="140" y="176" text-anchor="middle" font-family="DM Sans, sans-serif" font-weight="700" font-size="5.6" letter-spacing="2.4" fill="' + w.ink + '" opacity=".8">PICKLEBALL CLUB</text>';
    } else {
      s += '<text x="200" y="80" text-anchor="middle" font-family="Fredoka, sans-serif" font-weight="700" font-size="19" fill="' + w.inkOnYoke + '" filter="url(#' + id + 'emb)">Dinkin’ Donut</text>';
      s += '<text x="200" y="91" text-anchor="middle" font-family="DM Sans, sans-serif" font-weight="700" font-size="6" letter-spacing="3" fill="' + w.inkOnYoke + '" opacity=".8">PICKLEBALL CLUB · DOHA</text>';
      if (name && o.print !== "plain") s += '<text x="200" y="146" text-anchor="middle" font-family="DM Sans, sans-serif" font-weight="700" font-size="13" letter-spacing="5" fill="' + w.ink + '" filter="url(#' + id + 'emb)">' + esc(name.toUpperCase()) + '</text>';
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
  window.Jersey = { render: render, WAYS: WAYS, renderPolo: renderPolo, POLO_WAYS: POLO_WAYS };
})();
