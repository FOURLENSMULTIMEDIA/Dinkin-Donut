// Glaze Jersey renderer. Parametric SVG: colourway, side, name, number.
(function () {
  var WAYS = {
    glaze:    { label: "Glaze", note: "Home", yoke: "#FF5FA2", yokeDeep: "#E2407F", body: "#D7F03C", bodyDeep: "#A9C21E", sleeve: "#3B2416", trim: "#3B2416", ink: "#3B2416", hole: "#3B2416", num: "#3B2416", numLine: "#FF5FA2" },
    court:    { label: "Court", note: "Away", yoke: "#2F7A4F", yokeDeep: "#235E3C", body: "#FFF6EA", bodyDeep: "#EBDCC6", sleeve: "#2F7A4F", trim: "#D7F03C", ink: "#2F7A4F", hole: "#2F7A4F", num: "#2F7A4F", numLine: "#D7F03C" },
    midnight: { label: "Midnight", note: "Tournament", yoke: "#FF5FA2", yokeDeep: "#E2407F", body: "#3B2416", bodyDeep: "#24160D", sleeve: "#24160D", trim: "#D7F03C", ink: "#FFF6EA", hole: "#D7F03C", num: "#D7F03C", numLine: "#FF5FA2" },
  };
  var uid = 0;
  var BODY = "M150 34Q200 66 250 34L318 54L384 120L352 174L318 154L323 412Q200 428 77 412L82 154L48 174L16 120L82 54Z";
  var BODY_BACK = "M150 34Q200 46 250 34L318 54L384 120L352 174L318 154L323 412Q200 428 77 412L82 154L48 174L16 120L82 54Z";
  var SLEEVE_L = "M150 34L82 54L16 120L48 174L84 152Q114 88 156 38Z";
  var SLEEVE_R = "M250 34L318 54L384 120L352 174L316 152Q286 88 244 38Z";
  // Drip edge of the glaze yoke, left to right, then back across the shoulders
  function drip(y) {
    return "M60 " + (y - 30) + "L60 " + y +
      "C80 " + y + " 84 " + (y + 10) + " 98 " + (y + 8) + "C110 " + (y + 6) + " 112 " + (y + 34) + " 122 " + (y + 34) + "C132 " + (y + 34) + " 130 " + (y + 8) + " 144 " + (y + 10) +
      "C160 " + (y + 12) + " 164 " + (y + 22) + " 178 " + (y + 20) + "C190 " + (y + 18) + " 190 " + (y + 50) + " 202 " + (y + 50) + "C214 " + (y + 50) + " 212 " + (y + 16) + " 226 " + (y + 14) +
      "C240 " + (y + 12) + " 244 " + (y + 4) + " 258 " + (y + 6) + "C270 " + (y + 8) + " 270 " + (y + 28) + " 282 " + (y + 28) + "C294 " + (y + 28) + " 292 " + (y + 6) + " 306 " + y + "L340 " + y + "L340 " + (y - 120) + "L60 " + (y - 120) + "Z";
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
      '<pattern id="' + id + 'mesh" width="6" height="6" patternUnits="userSpaceOnUse"><circle cx="3" cy="3" r="1.1" fill="#000" opacity=".22"/></pattern>' +
      '</defs>';
    // contact shadow
    s += '<ellipse cx="200" cy="428" rx="150" ry="14" fill="#3B2416" opacity=".28" filter="url(#' + id + 'sh)"/>';
    s += '<g clip-path="url(#' + id + 'c)">';
    s += '<rect width="400" height="450" fill="' + w.body + '"/>';
    // tonal pickleball holes, sublimated into the body
    s += '<g fill="' + w.hole + '" opacity="' + (o.way === "midnight" ? ".16" : ".12") + '">' + HOLES.map(function (h) { return '<ellipse cx="' + h[0] + '" cy="' + (h[1] + (back ? -8 : 0)) + '" rx="9" ry="7.5"/>'; }).join("") + '</g>';
    // side mesh panels
    s += '<path d="M82 154L118 160L112 414L77 412Z" fill="url(#' + id + 'mesh)"/><path d="M318 154L282 160L288 414L323 412Z" fill="url(#' + id + 'mesh)"/>';
    // glaze yoke with drips + drip shadow
    s += '<path d="' + drip(yokeY) + '" fill="#000" opacity=".18" transform="translate(0 4)" filter="url(#' + id + 'b)"/>';
    s += '<path d="' + drip(yokeY) + '" fill="' + w.yoke + '"/>';
    s += '<path d="' + drip(yokeY) + '" fill="none" stroke="' + w.yokeDeep + '" stroke-width="3" opacity=".7"/>';
    // sprinkles on the yoke
    var spr = back ? [[104, 94, 30, "#D7F03C"], [298, 90, -30, "#FFF6EA"], [122, 120, -60, "#2F7A4F"], [280, 118, 20, "#E8A95B"]] : [[128, 88, 30, "#FFF6EA"], [168, 112, -40, "#2F7A4F"], [266, 104, 50, "#D7F03C"], [292, 80, -20, "#E8A95B"], [112, 116, -70, "#D7F03C"]];
    s += spr.map(function (p) { return '<rect x="' + (p[0] - 7) + '" y="' + (p[1] - 2.5) + '" width="14" height="5" rx="2.5" fill="' + (p[3] === w.yoke ? "#3B2416" : p[3]) + '" transform="rotate(' + p[2] + ' ' + p[0] + ' ' + p[1] + ')"/>'; }).join("");
    // sleeves
    s += '<path d="' + SLEEVE_L + '" fill="' + w.sleeve + '"/><path d="' + SLEEVE_R + '" fill="' + w.sleeve + '"/>';
    // sleeve cuffs: brand stripe
    s += '<path d="M16 120L48 174L56 169L24 115Z" fill="' + w.trim + '"/><path d="M24 115L56 169L62 165L30 111Z" fill="#FF5FA2"/>';
    s += '<path d="M384 120L352 174L344 169L376 115Z" fill="' + w.trim + '"/><path d="M376 115L344 169L338 165L370 111Z" fill="#FF5FA2"/>';
    if (!back) {
      // left-chest crest, right-chest place line, centre wordmark
      s += '<circle cx="258" cy="190" r="24" fill="#000" opacity=".12" filter="url(#' + id + 'b)"/><image href="/assets/logo.svg" x="234" y="164" width="48" height="48"/>';
      s += '<text x="140" y="186" text-anchor="middle" font-family="DM Sans, sans-serif" font-weight="700" font-size="10" letter-spacing="3" fill="' + w.ink + '">DOHA</text><text x="140" y="200" text-anchor="middle" font-family="DM Sans, sans-serif" font-weight="700" font-size="8" letter-spacing="2" fill="' + w.ink + '" opacity=".7">EST. 2026</text>';
      s += '<text x="200" y="262" text-anchor="middle" font-family="Fredoka, sans-serif" font-weight="700" font-size="31" fill="' + w.ink + '">Dinkin’ Donut</text>';
    } else {
      var mode = o.print || "full";
      s += '<image href="/assets/logo.svg" x="188" y="44" width="24" height="24"/>';
      s += '<text x="200" y="' + (mode === "plain" ? 100 : 92) + '" text-anchor="middle" font-family="Fredoka, sans-serif" font-weight="700" font-size="15" letter-spacing="1" fill="' + w.ink + '">Dinkin’ Donut</text>';
      s += '<text x="200" y="' + (mode === "plain" ? 112 : 104) + '" text-anchor="middle" font-family="DM Sans, sans-serif" font-weight="700" font-size="6.5" letter-spacing="3.2" fill="' + w.ink + '" opacity=".75">PICKLEBALL CLUB · DOHA</text>';
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
        s += big + 'fill="none" stroke="' + w.trim + '" stroke-width="13" stroke-linejoin="round">' + n + '</text>';
        s += big + 'fill="none" stroke="' + w.numLine + '" stroke-width="6" stroke-linejoin="round">' + n + '</text>';
        s += big + 'fill="' + w.num + '">' + n + '</text>';
      }
      s += '<text x="200" y="392" text-anchor="middle" font-family="DM Sans, sans-serif" font-weight="700" font-size="8" letter-spacing="4" fill="' + w.ink + '" opacity=".75">STAY GLAZED</text>';
    }
    // construction: raglan seams + stitching, hem stitch
    s += '<g fill="none" stroke="#000" stroke-opacity=".28" stroke-width="1.4"><path d="M156 38Q114 88 84 152"/><path d="M244 38Q286 88 316 152"/></g>';
    s += '<g fill="none" stroke="#fff" stroke-opacity=".35" stroke-width=".9" stroke-dasharray="3 3"><path d="M160 42Q119 90 89 154"/><path d="M240 42Q281 90 311 154"/><path d="M80 402Q200 418 320 402"/></g>';
    // fabric folds
    s += '<g filter="url(#' + id + 'b)" fill="none" stroke-linecap="round"><path d="M128 330Q140 372 132 408" stroke="#000" stroke-opacity=".13" stroke-width="10"/><path d="M262 300Q252 352 268 404" stroke="#000" stroke-opacity=".12" stroke-width="12"/><path d="M146 318Q156 360 150 400" stroke="#fff" stroke-opacity=".14" stroke-width="7"/><path d="M98 168Q112 200 104 236" stroke="#000" stroke-opacity=".12" stroke-width="9"/></g>';
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

  // Clubhouse Polo: set-in sleeves, knit collar, 3-button placket, embroidered crest.
  var POLO_WAYS = {
    cream: { label: "Cream", note: "Clubhouse", body: "#FBF1E2", collar: "#3B2416", tipA: "#FF5FA2", tipB: "#D7F03C", ink: "#3B2416", button: "#3B2416" },
    choco: { label: "Choco", note: "Evening", body: "#3B2416", collar: "#FFF6EA", tipA: "#D7F03C", tipB: "#FF5FA2", ink: "#FFF6EA", button: "#FFF6EA" },
    court: { label: "Court", note: "Match day", body: "#2F7A4F", collar: "#FFF6EA", tipA: "#FF5FA2", tipB: "#D7F03C", ink: "#FFF6EA", button: "#FFF6EA" },
  };
  var P_BODY = "M140 40L96 54L30 112L60 168L96 150L96 412Q200 428 304 412L304 150L340 168L370 112L304 54L260 40Q200 58 140 40Z";
  function renderPolo(o) {
    var w = POLO_WAYS[o.way] || POLO_WAYS.cream, back = o.side === "back", id = "p" + (++uid);
    var name = String(o.name || "").slice(0, 14), esc = function (t) { return t.replace(/&/g, "&amp;").replace(/</g, "&lt;"); };
    var s = '<svg viewBox="0 0 400 450" class="jersey" role="img" aria-label="' + w.label + ' polo, ' + (back ? "back" : "front") + '">';
    s += '<defs><clipPath id="' + id + 'c"><path d="' + P_BODY + '"/></clipPath>' +
      '<linearGradient id="' + id + 'shade" x1="0" x2="1"><stop offset="0" stop-color="#000" stop-opacity=".30"/><stop offset=".22" stop-color="#000" stop-opacity=".04"/><stop offset=".5" stop-color="#000" stop-opacity="0"/><stop offset=".78" stop-color="#000" stop-opacity=".05"/><stop offset="1" stop-color="#000" stop-opacity=".32"/></linearGradient>' +
      '<linearGradient id="' + id + 'v" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".14"/><stop offset=".4" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".2"/></linearGradient>' +
      '<filter id="' + id + 'n" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="1.4" numOctaves="2" seed="3"/><feColorMatrix type="saturate" values="0"/><feComponentTransfer><feFuncA type="table" tableValues="0 0.2"/></feComponentTransfer></filter>' +
      '<pattern id="' + id + 'pq" width="3" height="3" patternUnits="userSpaceOnUse"><circle cx="1.5" cy="1.5" r=".6" fill="#000" fill-opacity=".07"/></pattern>' +
      '<filter id="' + id + 'b"><feGaussianBlur stdDeviation="5"/></filter><filter id="' + id + 'sh" x="-20%" y="-20%" width="140%" height="150%"><feGaussianBlur stdDeviation="12"/></filter>' +
      '<filter id="' + id + 'emb"><feDropShadow dx="0" dy="1.2" stdDeviation=".6" flood-color="#000" flood-opacity=".45"/></filter></defs>';
    s += '<ellipse cx="200" cy="428" rx="140" ry="14" fill="#3B2416" opacity=".28" filter="url(#' + id + 'sh)"/>';
    s += '<g clip-path="url(#' + id + 'c)"><rect width="400" height="450" fill="' + w.body + '"/><rect width="400" height="450" fill="url(#' + id + 'pq)"/>';
    // set-in sleeve seams, side vents, cuffs with tipping
    s += '<g fill="none" stroke="#000" stroke-opacity=".22" stroke-width="1.3"><path d="M96 54Q104 104 96 150"/><path d="M304 54Q296 104 304 150"/></g>';
    s += '<path d="M30 112L60 168L70 162L40 106Z" fill="' + w.collar + '"/><path d="M38 108L68 164" stroke="' + w.tipA + '" stroke-width="2.4"/><path d="M42 106L72 162" stroke="' + w.tipB + '" stroke-width="1.4"/>';
    s += '<path d="M370 112L340 168L330 162L360 106Z" fill="' + w.collar + '"/><path d="M362 108L332 164" stroke="' + w.tipA + '" stroke-width="2.4"/><path d="M358 106L328 162" stroke="' + w.tipB + '" stroke-width="1.4"/>';
    s += '<g fill="none" stroke="#fff" stroke-opacity=".35" stroke-width=".9" stroke-dasharray="3 3"><path d="M100 404Q200 418 300 404"/></g>';
    if (!back) {
      // placket
      s += '<path d="M188 52H212V132H188Z" fill="' + w.body + '"/><path d="M188 52V132H212V52" fill="none" stroke="#000" stroke-opacity=".22" stroke-width="1.2"/><path d="M192 56V128M208 56V128" stroke="#fff" stroke-opacity=".3" stroke-dasharray="2.5 2.5" stroke-width=".8"/>';
      [74, 96, 118].forEach(function (y) { s += '<circle cx="200" cy="' + y + '" r="4.2" fill="' + w.button + '"/><circle cx="198.7" cy="' + (y - .8) + '" r=".8" fill="' + w.body + '"/><circle cx="201.3" cy="' + (y + .8) + '" r=".8" fill="' + w.body + '"/>'; });
      // embroidered crest, left chest
      s += '<g filter="url(#' + id + 'emb)"><image href="/assets/logo.svg" x="240" y="104" width="40" height="40"/></g><circle cx="260" cy="124" r="20.5" fill="none" stroke="#000" stroke-opacity=".25" stroke-dasharray="1.2 1.2" stroke-width=".8"/>';
    } else {
      s += '<path d="M120 76Q200 92 280 76" fill="none" stroke="#000" stroke-opacity=".18" stroke-width="1.2"/>';
      s += '<text x="200" y="118" text-anchor="middle" font-family="Fredoka, sans-serif" font-weight="700" font-size="17" fill="' + w.ink + '" filter="url(#' + id + 'emb)">Dinkin’ Donut</text>';
      if (name && o.print !== "plain") s += '<text x="200" y="146" text-anchor="middle" font-family="DM Sans, sans-serif" font-weight="700" font-size="11" letter-spacing="4" fill="' + w.tipA + '" filter="url(#' + id + 'emb)">' + esc(name.toUpperCase()) + '</text>';
    }
    s += '<g filter="url(#' + id + 'b)" fill="none" stroke-linecap="round"><path d="M134 300Q146 352 138 406" stroke="#000" stroke-opacity=".12" stroke-width="10"/><path d="M262 290Q252 346 268 404" stroke="#000" stroke-opacity=".12" stroke-width="12"/><path d="M152 300Q162 352 156 400" stroke="#fff" stroke-opacity=".12" stroke-width="7"/></g>';
    s += '<rect width="400" height="450" fill="url(#' + id + 'shade)"/><rect width="400" height="450" fill="url(#' + id + 'v)"/><rect width="400" height="450" filter="url(#' + id + 'n)"/></g>';
    // collar
    if (!back) {
      s += '<path d="M140 40Q200 60 260 40L246 30Q200 46 154 30Z" fill="#000" opacity=".25"/>';
      s += '<path d="M150 30Q172 44 200 52L188 94L136 62Z" fill="' + w.collar + '"/><path d="M250 30Q228 44 200 52L212 94L264 62Z" fill="' + w.collar + '"/>';
      s += '<path d="M140 58L186 88M144 54L188 84" stroke="' + w.tipA + '" stroke-width="2"/><path d="M260 58L214 88M256 54L212 84" stroke="' + w.tipA + '" stroke-width="2"/>';
      s += '<path d="M150 30Q172 44 200 52L188 94L136 62ZM250 30Q228 44 200 52L212 94L264 62Z" fill="none" stroke="#000" stroke-opacity=".3" stroke-width="1"/>';
    } else {
      s += '<path d="M140 40Q200 58 260 40L262 30Q200 50 138 30Z" fill="' + w.collar + '"/><path d="M140 36Q200 54 260 36" stroke="' + w.tipA + '" stroke-width="2" fill="none"/>';
    }
    s += '<path d="' + P_BODY + '" fill="none" stroke="#000" stroke-opacity=".22" stroke-width="1.5"/>';
    return s + "</svg>";
  }
  window.Jersey = { render: render, WAYS: WAYS, renderPolo: renderPolo, POLO_WAYS: POLO_WAYS };
})();
