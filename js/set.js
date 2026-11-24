// The Court Set: fitted polo with an open contrast collar + pleated tennis skirt (women's).
// CourtSet.render({ way, side, name }) returns SVG markup in the same style as the shirt mockups.
(function () {
  var WAYS = {
    navy: { label: "Navy & Ivory", note: "Classic", top: "#141C36", collar: "#F5F2EC", skirt: "#F5F2EC", tip: "#F5F2EC", tip2: "#C9A14A", ink: "#F5F2EC" },
    noir: { label: "Noir", note: "All black", top: "#111113", collar: "#F5F2EC", skirt: "#111113", tip: "#F5F2EC", tip2: "#F5F2EC", ink: "#F5F2EC" },
    pearl: { label: "Pearl & Navy", note: "Reverse", top: "#F5F2EC", collar: "#141C36", skirt: "#141C36", tip: "#141C36", tip2: "#C9A14A", ink: "#141C36" },
    rose: { label: "Blush & Navy", note: "Signature", top: "#E9D6CC", collar: "#1D2840", skirt: "#1D2840", tip: "#1D2840", tip2: "#F4EFE3", ink: "#1D2840" },
    court: { label: "Camel", note: "Clubhouse", top: "#B89B72", collar: "#F5F2EC", skirt: "#F5F2EC", tip: "#1D2840", tip2: "#F5F2EC", ink: "#1D2840" },
    pour: { label: "Heirloom", note: "Navy · brass pour", top: "#1B2440", collar: "#C9A86B", skirt: "#1B2440", tip: "#C9A86B", tip2: "#EADBB8", ink: "#FFFFFF", pour: "#C9A86B" },
  };
  var uid = 0;
  var esc = function (s) { return String(s || "").replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); };

  function render(o) {
    o = o || {};
    var w = WAYS[o.way] || WAYS.navy, back = o.side === "back", id = "cs" + (++uid), s = "";
    s += '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 560" class="mock set" role="img" aria-label="Court Set ' + esc(w.label) + (back ? " back" : " front") + '"><desc>DD-SET</desc><defs>' +
      // soft volume: light from the upper left, shadow at the sides
      '<linearGradient id="' + id + 'v" x1="0" x2="1"><stop offset="0" stop-color="#000" stop-opacity=".28"/><stop offset=".22" stop-color="#fff" stop-opacity=".1"/><stop offset=".55" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".32"/></linearGradient>' +
      '<linearGradient id="' + id + 'h" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#000" stop-opacity=".18"/><stop offset=".18" stop-color="#000" stop-opacity="0"/><stop offset=".85" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".2"/></linearGradient>' +
      '<filter id="' + id + 'sh" x="-20%" y="-20%" width="140%" height="140%"><feDropShadow dx="0" dy="6" stdDeviation="7" flood-color="#000" flood-opacity=".22"/></filter>' +
      '<filter id="' + id + 'em"><feDropShadow dx="0" dy=".6" stdDeviation=".4" flood-color="#000" flood-opacity=".4"/></filter>' +
      '<filter id="' + id + 'bl" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="16"/></filter>' +
      '<clipPath id="' + id + 'tc"><path id="' + id + 'tp" d="M150 68 Q120 70 94 84 L66 146 L100 158 L108 176 Q103 236 114 302 Q200 324 286 302 Q297 236 292 176 L300 158 L334 146 L306 84 Q280 70 250 68 Z"/></clipPath>' +
      '</defs>';

    // ---- skirt (drawn first, the top's curved hem overlaps it) ----
    var sk = "M116 298 Q200 316 284 298 L344 470 Q200 506 56 470 Z", pleats = 14, ps = "";
    for (var i = 0; i < pleats; i++) {
      var t0 = i / pleats, t1 = (i + 1) / pleats, xa = 116 + 168 * t0, xb = 116 + 168 * t1, xc = 56 + 288 * t1, xd = 56 + 288 * t0;
      var ya = 298 + Math.sin(t0 * Math.PI) * 15, yb = 298 + Math.sin(t1 * Math.PI) * 15, yc = 470 + Math.sin(t1 * Math.PI) * 18, yd = 470 + Math.sin(t0 * Math.PI) * 18;
      ps += '<path d="M' + xa.toFixed(1) + " " + ya.toFixed(1) + " L" + xb.toFixed(1) + " " + yb.toFixed(1) + " L" + xc.toFixed(1) + " " + yc.toFixed(1) + " L" + xd.toFixed(1) + " " + yd.toFixed(1) + 'Z" fill="' + (i % 2 ? "#000" : "#fff") + '" opacity="' + (i % 2 ? ".14" : ".06") + '"/>';
      ps += '<path d="M' + xb.toFixed(1) + " " + yb.toFixed(1) + " L" + xc.toFixed(1) + " " + yc.toFixed(1) + '" stroke="#000" stroke-opacity=".22" stroke-width="1"/>';
    }
    s += '<clipPath id="' + id + 'sc"><path d="' + sk + '"/></clipPath>';
    s += '<g filter="url(#' + id + 'sh)"><path d="' + sk + '" fill="' + w.skirt + '"/><g clip-path="url(#' + id + 'sc)">' + ps + '</g>' +
      '<path d="' + sk + '" fill="url(#' + id + 'v)"/>' +
      // hem tipping on the skirt
      '<path d="M58 462 Q200 497 342 462" fill="none" stroke="' + w.tip + '" stroke-width="3" opacity=".9"/><path d="M60 455 Q200 489 340 455" fill="none" stroke="' + w.tip2 + '" stroke-width="1.6" opacity=".9"/></g>';

    // ---- top ----
    s += '<g filter="url(#' + id + 'sh)"><path d="M150 68 Q120 70 94 84 L66 146 L100 158 L108 176 Q103 236 114 302 Q200 324 286 302 Q297 236 292 176 L300 158 L334 146 L306 84 Q280 70 250 68 Z" fill="' + w.top + '"/>';
    if (w.pour) s += '<g clip-path="url(#' + id + 'tc)"><path d="M' + (back ? "330 40 L380 70 L130 340 L70 320" : "70 40 L20 70 L270 340 L330 320") + 'Z" fill="' + w.pour + '" filter="url(#' + id + 'bl)" opacity=".9"/></g>';
    // princess seams and gentle waist shaping
    s += '<path d="M150 120 Q140 220 150 306 M250 120 Q260 220 250 306" fill="none" stroke="#000" stroke-opacity=".12" stroke-width="1.2"/>';
    s += '<path d="M150 68 Q120 70 94 84 L66 146 L100 158 L108 176 Q103 236 114 302 Q200 324 286 302 Q297 236 292 176 L300 158 L334 146 L306 84 Q280 70 250 68 Z" fill="url(#' + id + 'v)"/>';
    // tipped cap-sleeve cuffs
    s += '<path d="M69 139 L101 151 M331 139 L299 151" stroke="' + w.tip + '" stroke-width="4"/><path d="M71 133 L102 145 M329 133 L298 145" stroke="' + w.tip2 + '" stroke-width="1.6"/>';
    if (!back) {
      // open V placket with the inside of the shirt
      s += '<path d="M178 70 L200 136 L222 70 Z" fill="#000" opacity=".35"/>';
      // open Johnny collar
      s += '<path d="M150 66 Q166 62 178 68 L200 136 L190 140 Q160 112 136 92 Q140 74 150 66 Z" fill="' + w.collar + '"/><path d="M250 66 Q234 62 222 68 L200 136 L210 140 Q240 112 264 92 Q260 74 250 66 Z" fill="' + w.collar + '"/>';
      s += '<path d="M150 66 Q166 62 178 68 L200 136 L190 140 Q160 112 136 92 Q140 74 150 66 Z M250 66 Q234 62 222 68 L200 136 L210 140 Q240 112 264 92 Q260 74 250 66 Z" fill="url(#' + id + 'v)" opacity=".6"/>';
      s += '<path d="M140 90 Q162 110 190 138 M260 90 Q238 110 210 138" fill="none" stroke="' + w.tip2 + '" stroke-width="1.4" opacity=".8"/>';
      // small embroidered crest
      s += '<image filter="url(#' + id + 'em)" href="/assets/logo.svg" x="236" y="140" width="24" height="24"/>';
      // skirt crest, low on the hem (like the reference)
      s += '<image filter="url(#' + id + 'em)" href="/assets/logo.svg" x="282" y="420" width="16" height="16" opacity=".95"/>';
    } else {
      s += '<path d="M150 66 Q200 58 250 66 L246 82 Q200 74 154 82 Z" fill="' + w.collar + '"/>';
      s += '<text x="200" y="104" text-anchor="middle" font-family="DM Sans, sans-serif" font-weight="700" font-size="6.5" letter-spacing="3" fill="' + w.ink + '" opacity=".7">DINK DIFFERENT</text>';
      if (o.print === "social" && window.ClubTee) s += window.ClubTee.PRINTS.social(200, 146, 232, { body: w.top, ink: w.ink, acc: w.tip2 }, id + "so", ["DINK DIFFERENT · COURTSIDE SOCIAL", "PICKLEBALL CLUB · DOHA", "Soft hands,", "good company."]);
      if (o.name && o.print !== "plain") s += '<text x="200" y="140" text-anchor="middle" font-family="DM Sans, sans-serif" font-weight="700" font-size="15" letter-spacing="7" fill="' + w.ink + '">' + esc(String(o.name).toUpperCase().slice(0, 12)) + "</text>";
    }
    s += "</g></svg>";
    return s;
  }
  window.CourtSet = { render: render, WAYS: WAYS };
})();
