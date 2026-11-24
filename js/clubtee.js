// The Clubhouse Collection · Series III: heavyweight cotton tees, print-ready graphic designs (Fraunces + DM Sans only).
// Real tee photos, garment-dyed to each colour, with screen-printed and embroidered artwork laid under the
// fabric's own folds so it reads like a photograph. ClubTee.render(design, { way, side }) returns SVG.
(function () {
  var IMG = { front: [882, 926], back: [896, 938] };
  var COLOURS = {
    ivory: { label: "Ivory", body: "#F4F1EA", ink: "#1D2840", acc: "#9C7A45" },
    oatmeal: { label: "Oatmeal", body: "#E2D6C0", ink: "#1D2840", acc: "#8C6B3A" },
    navy: { label: "Club Navy", body: "#1B2440", ink: "#F1EBDD", acc: "#C9A86B" },
    camel: { label: "Camel", body: "#B89B72", ink: "#1D2840", acc: "#F4EFE3" },
    stone: { label: "Stone", body: "#CFC4AE", ink: "#1D2840", acc: "#7A2A2A" },
    white: { label: "Optic White", body: "#F7F6F2", ink: "#1D2840", acc: "#9C7A45" },
    bone: { label: "Bone", body: "#ECE4D3", ink: "#1D2840", acc: "#B8955C" },
  };
  var SER = "Fraunces, Georgia, serif", SANS = "'DM Sans', Helvetica, sans-serif";
  var uid = 0;
  // The Different D (200 box), drawn in the print colours
  function mark(x, y, s, ink, acc, ball) {
    return '<g transform="translate(' + x + " " + y + ") scale(" + s + ') translate(-100 -100)"><g fill="' + ink + '" fill-rule="evenodd"><path d="M104 44h20a56 56 0 0 1 0 112h-20zM119 62h5a27 38 0 0 1 0 76h-5z"/><path d="M96 44H76a56 56 0 0 0 0 112h20zM81 62h-5a27 38 0 0 0 0 76h5z"/></g>' +
      '<path d="M100 34v132" stroke="' + acc + '" stroke-width="5" stroke-linecap="round"/><path d="M60 30q38-30 70-2" fill="none" stroke="' + acc + '" stroke-width="2.4" stroke-dasharray="2.4 6" stroke-linecap="round"/><circle cx="134" cy="32" r="9" fill="' + (ball || "#E3CF7E") + '"/></g>';
  }
  function txt(x, y, size, s, o) {
    o = o || {};
    return '<text x="' + x + '" y="' + y + '" text-anchor="' + (o.anchor || "middle") + '" font-family="' + (o.sans ? SANS : SER) + '" font-weight="' + (o.w || (o.sans ? 700 : 800)) + '"' + (o.it ? ' font-style="italic"' : "") +
      ' font-size="' + size + '" letter-spacing="' + (o.ls || 0) + '" fill="' + o.fill + '" style="font-variation-settings:\'SOFT\' 100,\'WONK\' ' + (o.it ? 1 : 0) + '">' + s + "</text>";
  }
  // ---------- print toolkit (screen-print friendly: flat spot colours, a soft ink edge, no gradients) ----------
  var MP = '<path d="M104 44h20a56 56 0 0 1 0 112h-20zM119 62h5a27 38 0 0 1 0 76h-5z"/><path d="M96 44H76a56 56 0 0 0 0 112h20zM81 62h-5a27 38 0 0 0 0 76h5z"/>';
  function spf(fid, sd, col, seed) { return '<filter id="' + fid + '" x="-60%" y="-60%" width="220%" height="220%" color-interpolation-filters="sRGB"><feGaussianBlur in="SourceAlpha" stdDeviation="' + sd + '" result="b"/><feTurbulence type="fractalNoise" baseFrequency="1.6" numOctaves="1" seed="' + (seed || 7) + '" result="n"/><feColorMatrix in="n" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 0 0 0 0" result="na"/><feComposite in="b" in2="na" operator="arithmetic" k1="0" k2="1.9" k3="1" k4="-1.05" result="m"/><feFlood flood-color="' + col + '"/><feComposite in2="m" operator="in"/></filter>'; }
  function rough(fid, s, seed, k) { k = k || 1.2; return '<filter id="' + fid + '" x="-5%" y="-5%" width="110%" height="110%"><feTurbulence type="fractalNoise" baseFrequency=".08 .9" numOctaves="3" seed="' + (seed || 3) + '" result="t"/><feDisplacementMap in="SourceGraphic" in2="t" scale="' + s + '" xChannelSelector="R" yChannelSelector="G" result="d"/><feTurbulence type="fractalNoise" baseFrequency="1.3" numOctaves="2" seed="11" result="g"/><feColorMatrix in="g" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 -' + k + ' ' + (k * .35 + 1.03) + '" result="gm"/><feComposite in="d" in2="gm" operator="in"/></filter>'; }
  function blurF(fid, sx, sy) { return '<filter id="' + fid + '" x="-150%" y="-150%" width="400%" height="400%"><feGaussianBlur stdDeviation="' + sx + " " + sy + '"/></filter>'; }
  function T(x, y, s, t, o) { return '<text x="' + x + '" y="' + y + '" font-family="' + (o.serif ? SER : SANS) + '" font-weight="' + (o.w || 700) + '"' + (o.it ? ' font-style="italic"' : "") + ' font-size="' + s + '" letter-spacing="' + (o.ls || 0) + '" fill="' + o.c + '" text-anchor="' + (o.a || "start") + '"' + (o.f ? ' filter="url(#' + o.f + ')"' : "") + (o.tr ? ' transform="' + o.tr + '"' : "") + ' style="font-variation-settings:\'SOFT\' 100' + (o.it ? ",'WONK' 1" : "") + '">' + t + "</text>"; }
  function TA(x, y, s, t, o) { return '<text x="' + x + '" y="' + y + '" font-family="Archivo" font-weight="' + (o.w || 700) + '" font-size="' + s + '" letter-spacing="' + (o.ls || 0) + '" fill="' + o.c + '" text-anchor="' + (o.a || "start") + '"' + (o.tr ? ' transform="' + o.tr + '"' : "") + ' style="font-stretch:' + (o.st || 100) + '%">' + t + "</text>"; }
  function onPath(pid, d, t, s, c, o) { o = o || {}; return '<path id="' + pid + '" d="' + d + '" fill="none"/><text font-family="' + (o.serif ? SER : SANS) + '" font-weight="' + (o.w || 700) + '"' + (o.it ? ' font-style="italic"' : "") + ' font-size="' + s + '" letter-spacing="' + (o.ls || 0) + '" fill="' + c + '" style="font-variation-settings:\'SOFT\' 100' + (o.it ? ",'WONK' 1" : "") + '"><textPath href="#' + pid + '" startOffset="50%" text-anchor="middle">' + t + "</textPath></text>"; }
  function solidMark(x, y, s, col) { return '<g transform="translate(' + x + " " + y + ") scale(" + s + ') translate(-100 -100)" fill="' + col + '" fill-rule="evenodd">' + MP + "</g>"; }
  function chest(W, H, c) { return mark(W * 0.635, H * 0.255, 0.3, c.ink, c.acc, c.ball); }

  // PRINTS: placed artwork used by the tees, the Court Polo and the Court Set. (cx, top) anchor, u = scale unit (a tee's width ≈ 890).
  var PRINTS = {
    // a painted pickleball court, every zone annotated like a field guide
    court: function (cx, top, u, c, id) {
      var ch = u * .48, cw = ch * 20 / 44, x0 = cx - cw / 2, x1 = x0 + cw, pad = u * .032, lw = u * .0055, mid = top + ch / 2, kit = ch / 2 * 7 / 22, fs = u * .0088, L = c.body;
      var ann = function (x, y, a, b, an) { return T(x, y, fs, a, { c: L, ls: fs * .14, a: an }) + T(x, y + fs * 1.35, fs * 1.05, b, { serif: 1, it: 1, w: 500, c: L, a: an }); };
      return '<defs>' + rough(id + "rg", u * .008, 5, .55) + rough(id + "rt", u * .0018, 9) + "</defs>" +
        '<g filter="url(#' + id + 'rg)"><rect x="' + (x0 - pad) + '" y="' + (top - pad) + '" width="' + (cw + 2 * pad) + '" height="' + (ch + 2 * pad) + '" fill="' + c.ink + '"/></g>' +
        '<g filter="url(#' + id + 'rt)"><g stroke="' + L + '" stroke-width="' + lw + '" fill="none"><rect x="' + x0 + '" y="' + top + '" width="' + cw + '" height="' + ch + '"/><path d="M' + x0 + " " + (mid - kit) + "H" + x1 + "M" + x0 + " " + (mid + kit) + "H" + x1 + "M" + cx + " " + top + "V" + (mid - kit) + "M" + cx + " " + (mid + kit) + "V" + (top + ch) + '"/></g>' +
        '<path d="M' + (x0 - pad * .7) + " " + mid + "H" + (x1 + pad * .7) + '" stroke="' + c.acc + '" stroke-width="' + lw * 1.7 + '"/>' +
        ann(x1 - u * .008, top + fs * 1.9, "BASELINE", "Serve underhand.", "end") + ann(x0 + u * .008, top + (mid - kit - top) * .55, "SERVICE", "Even score: right.", "start") +
        ann(x0 + u * .008, mid - kit + fs * 2, "THE KITCHEN", "No volleys here.", "start") + ann(x1 - u * .008, mid - fs * 2.9, "THE NET", "34 in at centre.", "end") +
        ann(x0 + u * .008, mid + fs * 2.1, "NON-VOLLEY ZONE", "Seven feet deep.", "start") + ann(cx + u * .008, mid + kit + (top + ch - mid - kit) * .45, "THE DINK", "Soft. Low. Kind.", "start") +
        ann(x0 + u * .008, top + ch - fs * 2.2, "BASELINE", "Two bounces first.", "start") + "</g>";
    },
    // three stacked balls drawn in fine lines, inside an arch of type
    social: function (cx, top, u, c, id, lines) {
      lines = lines || ["LIVE TO DINK · COURTSIDE PICKLEBALL SOCIAL", "DINK DIFFERENT · DOHA COUNTRY CLUB", "8 pm till late", "Dinks &amp; Karak"];
      var R1 = u * .2, R2 = u * .142, tY = top + u * .19, bY = top + u * .6, r = u * .068, BR = c.acc, BN = c.body;
      var arch = function (R) { return "M" + (cx - R) + " " + bY + "V" + tY + "A" + R + " " + R + " 0 0 1 " + (cx + R) + " " + tY + "V" + bY; };
      var cys = [top + u * .147, top + u * .147 + 2 * r - 4, top + u * .147 + 4 * r - 8];
      var stripes = "", holes = "", fringe = "", n = 0;
      for (var sx = cx - r; sx <= cx + r + 1; sx += r / 5.5) stripes += '<path d="M' + sx + " " + (cys[0] - r) + "V" + (cys[2] + r) + '" stroke="' + BN + '" stroke-width="' + u * .0032 + '"/>';
      cys.forEach(function (y, k) { [[-.42, -.3], [.38, -.4], [.05, .1], [-.3, .5], [.5, .38]].forEach(function (h, j) { if ((j + k) % 2 === 0 || j === 2) holes += '<circle cx="' + (cx + h[0] * r) + '" cy="' + (y + h[1] * r) + '" r="' + r * .085 + '" fill="' + BN + '"/>'; }); });
      for (var fx = cx - r * .82; fx <= cx + r * .82; fx += r / 5.5) { var len = u * (.037 + .032 * Math.abs(Math.sin(n++ * 1.7))); fringe += '<path d="M' + fx + " " + (cys[2] + r * .62) + "V" + (cys[2] + r + len) + '" stroke="' + BR + '" stroke-width="' + u * .0032 + '"/>'; }
      return '<defs><clipPath id="' + id + 'bc">' + cys.map(function (y) { return '<circle cx="' + cx + '" cy="' + y + '" r="' + r + '"/>'; }).join("") + "</clipPath>" + rough(id + "rt", u * .0016, 9) + "</defs>" +
        '<g filter="url(#' + id + 'rt)"><g clip-path="url(#' + id + 'bc)"><rect x="' + (cx - r) + '" y="' + (cys[0] - r) + '" width="' + 2 * r + '" height="' + (cys[2] - cys[0] + 2 * r) + '" fill="' + BR + '"/>' + stripes + holes + "</g>" + fringe +
        onPath(id + "a1", arch(R1), lines[0], u * .034, c.ink, { ls: u * .0034 }) + onPath(id + "a2", arch(R2), lines[1], u * .026, c.ink, { ls: u * .0026 }) +
        T(cx, top + u * .57, u * .026, lines[2], { serif: 1, it: 1, w: 500, c: c.ink, a: "middle" }) + T(cx, top + u * .601, u * .026, lines[3], { serif: 1, it: 1, w: 500, c: c.ink, a: "middle" }) + "</g>";
    },
    // a true halftone ball: one ink, dot size set by the light
    halftone: function (cx, cy, u, c, id, line) {
      var R = u * .235, st = u * .0105, dots = "", holes = [[-.45, -.12], [.12, -.52], [.52, .02], [-.12, .55], [.42, .55], [-.55, .45], [-.2, -.62], [.62, -.4]];
      for (var y = cy - R * 1.15; y < cy + R * 1.15; y += st) for (var x = cx - R * 1.15; x < cx + R * 1.15; x += st) {
        var nx = (x - cx) / R, ny = (y - cy) / R, d = Math.sqrt(nx * nx + ny * ny); if (d > 1.14) continue;
        var edge = Math.max(0, Math.min(1, (1.14 - d) / .36)), li = Math.sqrt(Math.pow(nx + .38, 2) + Math.pow(ny + .4, 2)), I = Math.max(.12, 1 - li * .42);
        holes.forEach(function (h) { var hd = Math.sqrt(Math.pow(nx - h[0], 2) + Math.pow(ny - h[1], 2)); if (hd < .14) I *= .25 + .75 * Math.max(0, (hd - .08) / .06); });
        var rr = st * .52 * Math.sqrt(I * edge); if (rr > st * .04) dots += '<circle cx="' + x.toFixed(1) + '" cy="' + y.toFixed(1) + '" r="' + rr.toFixed(2) + '"/>'; }
      var rp = R + u * .085, arc = "M" + (cx - rp) + " " + cy + "A" + rp + " " + rp + " 0 0 0 " + (cx + rp) + " " + cy;
      return '<g fill="' + c.spot2 + '">' + dots + "</g>" + solidMark(cx, cy, .62, c.body) + (line === "" ? "" : onPath(id + "c", arc, line || "See you in the Kitchen.", u * .044, c.spot2, { serif: 1, it: 1, w: 600 }));
    },
  };
  // spot colours per garment colour: spot = sprayed word, spot2 = halftone/single ink, ball = airbrushed ball
  var SPOTS = { ivory: ["#3E5C9A", "#1D2840", "#CDB35E"], oatmeal: ["#3E5C9A", "#1D2840", "#B8955C"], navy: ["#C9A86B", "#E3CF7E", "#E3CF7E"], camel: ["#1D2840", "#1D2840", "#F4EFE3"], stone: ["#7A2A2A", "#1D2840", "#9C7A45"], white: ["#3E5C9A", "#1D2840", "#CDB35E"], bone: ["#3E5C9A", "#1D2840", "#B8955C"] };
  Object.keys(COLOURS).forEach(function (k) { var s = SPOTS[k] || SPOTS.ivory; COLOURS[k].spot = s[0]; COLOURS[k].spot2 = s[1]; COLOURS[k].ball = s[2]; });

  // Each design: front(W, H, c, id) and back(W, H, c, id) return the print layer
  var DESIGNS = {
    court: { hero: "back", name: "The Court Map Tee", price: 145, way: "ivory", ways: ["ivory", "oatmeal", "stone"], code: "DD-T11",
      blurb: "A painted pickleball court across the back, every zone annotated like a field guide. Distressed screen print, three inks.",
      front: chest, back: function (W, H, c, id) { var cx = W / 2, top = H * .14, ch = W * .48, ty = top + ch + W * .032 + H * .055;
        return PRINTS.court(cx, top, W, c, id) + '<defs>' + rough(id + "rb", W * .0018, 9) + '</defs><g filter="url(#' + id + 'rb)">' + T(cx, ty, W * .031, "DINK DIFFERENT PICKLEBALL CLUB", { c: c.ink, a: "middle", ls: W * .001 }) +
          ["100% manners. Zero lobs.", "By dinkers, for dinkers.", "Est. 2026 · Doha"].map(function (s, i) { return T(cx, ty + W * .04 + i * W * .029, W * .024, s, { serif: 1, w: 500, c: c.ink, a: "middle" }); }).join("") + "</g>"; } },
    social: { hero: "back", name: "The Courtside Social Tee", price: 139, way: "bone", ways: ["bone", "ivory", "navy"], code: "DD-T12",
      blurb: "Three line-drawn balls stacked inside an arch of type, for the nights that run late. Two-ink back print.",
      front: function (W, H, c, id) { return T(W * .635, H * .262, W * .03, "Courtside", { serif: 1, it: 1, c: c.ink, a: "middle" }) + T(W * .635, H * .287, W * .0115, "SOCIAL · DOHA", { c: c.acc, a: "middle", ls: W * .004 }); },
      back: function (W, H, c, id) { return PRINTS.social(W / 2, H * .12, W, c, id); } },
    halftone: { name: "The Halftone Tee", price: 139, way: "navy", ways: ["navy", "ivory", "camel"], code: "DD-T13",
      blurb: "A real halftone pickleball, every dot sized by the light, with the club’s favourite line curving under it. One ink.",
      front: function (W, H, c, id) { return PRINTS.halftone(W / 2, H * .41, W, c, id); },
      back: function (W, H, c) { return mark(W / 2, H * .16, .22, c.ink, c.acc, c.ball) + T(W / 2, H * .225, W * .0135, "SEE YOU IN THE KITCHEN · DOHA", { c: c.spot2, a: "middle", ls: W * .004 }); } },
    purpose: { hero: "back", name: "The Purpose Tee", price: 135, way: "white", ways: ["white", "ivory", "navy"], code: "DD-T14",
      blurb: "An airbrushed ball mid-flight across the shoulders and one line of copy. Simulated-process print, soft to the touch.",
      front: chest, back: function (W, H, c, id) { var cx = W / 2, cy = H * .31, r = W * .135, holes = "";
        [[-.45, -.2], [.15, -.55], [.55, .05], [-.05, .3], [.38, .6], [-.5, .5]].forEach(function (h) { holes += '<circle cx="' + (cx + h[0] * r) + '" cy="' + (cy + h[1] * r) + '" r="' + r * .1 + '" fill="#000" filter="url(#' + id + 'sh)"/>'; });
        return '<defs>' + spf(id + "sb", W * .008, c.ball, 3) + spf(id + "ss", W * .025, c.ball, 5) + spf(id + "sh", W * .0034, c.body, 8) + "</defs>" +
          '<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" fill="#000" filter="url(#' + id + 'sb)"/>' + holes +
          T(cx, H * .53, W * .046, "Dink with Purpose.", { c: c.ink, a: "middle", ls: -W * .0012 }) + mark(cx, H * .578, .13, c.ink, c.acc, c.ball) + T(cx, H * .615, W * .0115, "DINK DIFFERENT · PICKLEBALL CLUB", { c: c.ink, a: "middle", ls: W * .0035 }); } },
    static: { name: "The Static Tee", price: 139, way: "ivory", ways: ["ivory", "white", "oatmeal", "navy"], code: "DD-T15",
      blurb: "A sprayed, out-of-focus word with the crisp italic set on top, and three small lines of club code underneath.",
      front: function (W, H, c, id) { var cx = W / 2;
        return '<defs>' + spf(id + "sw", W * .0145, c.spot, 2) + "</defs>" + T(cx, H * .45, W * .29, "Dink", { serif: 1, it: 1, w: 800, c: "#000", a: "middle", f: id + "sw", ls: -W * .006 }) +
          T(cx + W * .015, H * .432, W * .105, "different", { serif: 1, it: 1, w: 700, c: c.ink, a: "middle", tr: "rotate(-5 " + cx + " " + H * .43 + ")" }) +
          T(cx, H * .55, W * .0165, "DON’T RUSH THE NET. EARN THE POINT.", { serif: 1, w: 600, c: c.ink, a: "middle", ls: W * .0006 }) +
          T(cx, H * .572, W * .0108, "SOFT HANDS · LONG RALLIES · GOOD COMPANY · DOHA", { w: 500, c: c.ink, a: "middle", ls: W * .0016 }) +
          T(cx, H * .607, W * .0115, "‹ PICKLEBALL CLUB SINCE 2026 ›", { c: c.ink, a: "middle", ls: W * .0028 }); },
      back: function (W, H, c) { return mark(W / 2, H * .15, .16, c.ink, c.acc, c.ball); } },
    rules: { hero: "back", name: "The House Rules Tee", price: 135, way: "oatmeal", ways: ["oatmeal", "ivory", "navy"], code: "DD-T18",
      blurb: "Six rules of the Kitchen, set like a clubhouse notice. Every new member gets the speech; now they get the shirt.",
      front: chest, back: function (W, H, c) { var cx = W / 2, nx = W * .315, tx = W * .335, R = ["I", "II", "III", "IV", "V", "VI"], L = ["Call the score, loud and proud.", "Dink before you drive.", "No volleys in the Kitchen.", "Line calls go to your opponent.", "Paddle tap after every game.", "Be the reason they come back."];
        return T(cx, H * .165, W * .0125, "THE KITCHEN · EST. 2026", { c: c.acc, a: "middle", ls: W * .005 }) + T(cx, H * .235, W * .068, "House Rules", { serif: 1, w: 800, c: c.ink, a: "middle" }) +
          '<path d="M' + W * .36 + " " + H * .262 + "H" + W * .64 + '" stroke="' + c.acc + '" stroke-width="' + W * .0025 + '"/>' +
          L.map(function (t, i) { var y = H * (.305 + i * .037); return T(nx, y, W * .021, R[i] + ".", { serif: 1, it: 1, w: 700, c: c.acc, a: "end" }) + T(tx, y, W * .0185, t, { w: 500, c: c.ink }); }).join("") +
          mark(cx, H * .565, .16, c.ink, c.acc, c.ball) + T(cx, H * .608, W * .012, "DINK DIFFERENT · PICKLEBALL CLUB · DOHA", { c: c.ink, a: "middle", ls: W * .0035 }); } },
    score: { hero: "back", name: "The 0 · 0 · 2 Tee", price: 135, way: "ivory", ways: ["ivory", "navy", "camel"], code: "DD-T19",
      blurb: "The first call of every game, set big, with a scorecard from a good night underneath. Only pickleball players get it.",
      front: function (W, H, c) { return T(W * .635, H * .27, W * .04, "0·0·2", { serif: 1, w: 800, c: c.ink, a: "middle" }); },
      back: function (W, H, c) { var cx = W / 2, gx = W * .3, gw = W * .4, gy = H * .45, rh = H * .045, cwid = gw / 4, s = "", sw = W * .0028;
        s += T(cx, H * .33, W * .155, "0–0–2", { serif: 1, w: 800, c: c.ink, a: "middle", ls: -W * .003 }) + T(cx, H * .392, W * .04, "Zero. Zero. Two.", { serif: 1, it: 1, w: 600, c: c.acc, a: "middle" });
        s += '<g stroke="' + c.ink + '" stroke-width="' + sw + '" fill="none"><rect x="' + gx + '" y="' + gy + '" width="' + gw + '" height="' + rh * 3 + '"/><path d="M' + gx + " " + (gy + rh) + "H" + (gx + gw) + "M" + gx + " " + (gy + 2 * rh) + "H" + (gx + gw) + "M" + (gx + cwid) + " " + gy + "V" + (gy + 3 * rh) + "M" + (gx + 2 * cwid) + " " + gy + "V" + (gy + 3 * rh) + "M" + (gx + 3 * cwid) + " " + gy + "V" + (gy + 3 * rh) + '"/></g>';
        [["", "I", "II", "III"], ["US", "11", "9", "11"], ["THEM", "7", "11", "4"]].forEach(function (row, ri) { row.forEach(function (v, ci) { if (!v) return; var x = gx + cwid * (ci + .5), y = gy + rh * (ri + .68);
          s += ci === 0 || ri === 0 ? T(x, y, W * .0125, v === "I" || v === "II" || v === "III" ? "GAME " + v : v, { c: c.ink, a: "middle", ls: W * .002 }) : T(x, y + rh * .04, W * .03, v, { serif: 1, it: 1, w: 600, c: (ri === 1 && v === "11") ? c.acc : c.ink, a: "middle" }); }); });
        return s + T(cx, H * .62, W * .012, "THE SERVE CALL · DINK DIFFERENT · DOHA", { c: c.ink, a: "middle", ls: W * .0035 }); } },
    eleven: { hero: "back", name: "The Eleven Tee", price: 139, way: "ivory", ways: ["ivory", "white", "oatmeal", "navy"], code: "DD-T21",
      blurb: "Game to eleven, sprayed big across the back and fading into grain. Win by two.",
      front: function (W, H, c) { return T(W * .635, H * .27, W * .046, "11", { f: "", c: c.ink, a: "middle", w: 800, ls: -W * .002 }).replace("font-family=\"'DM Sans', Helvetica, sans-serif\"", 'font-family="Archivo" style="font-stretch:125%"').replace(/ style="font-variation-settings:[^"]*"/, "") + T(W * .635, H * .295, W * .0105, "GAME TO ELEVEN", { c: c.ink, a: "middle", ls: W * .003 }); },
      back: function (W, H, c, id) { var cx = W / 2, fs = W * .36, y = H * .52;
        var txt11 = function (extra) { return '<text x="' + cx + '" y="' + y + '" text-anchor="middle" font-family="Archivo" font-weight="800" font-size="' + fs + '" letter-spacing="' + -W * .018 + '" fill="' + c.ink + '" style="font-stretch:125%"' + extra + '>11</text>'; };
        return '<defs><linearGradient id="' + id + 'g" gradientUnits="userSpaceOnUse" x1="' + W * .22 + '" x2="' + W * .62 + '"><stop offset="0" stop-color="#000"/><stop offset="1" stop-color="#fff"/></linearGradient>' +
          '<linearGradient id="' + id + 'h" gradientUnits="userSpaceOnUse" x1="' + W * .16 + '" x2="' + W * .6 + '"><stop offset="0" stop-color="#000"/><stop offset=".45" stop-color="#fff"/><stop offset="1" stop-color="#000"/></linearGradient>' +
          '<mask id="' + id + 'ef" maskUnits="userSpaceOnUse" x="0" y="0" width="' + W + '" height="' + H + '"><rect width="' + W + '" height="' + H + '" fill="url(#' + id + 'g)"/></mask>' +
          '<mask id="' + id + 'j" maskUnits="userSpaceOnUse" x="0" y="0" width="' + W + '" height="' + H + '"><rect width="' + W + '" height="' + H + '" fill="url(#' + id + 'h)"/></mask>' + spf(id + "sp", W * .012, c.ink, 4) + "</defs>" +
          txt11(' mask="url(#' + id + 'ef)"') + '<g mask="url(#' + id + 'j)">' + txt11(' filter="url(#' + id + 'sp)"').replace('fill="' + c.ink + '"', 'fill="#000"') + "</g>" +
          '<text x="' + cx + '" y="' + H * .6 + '" text-anchor="middle" font-family="Archivo" font-weight="600" font-size="' + W * .0145 + '" letter-spacing="' + W * .005 + '" fill="' + c.ink + '" style="font-stretch:112%">GAME TO ELEVEN · WIN BY TWO · DOHA</text>'; } },
    kitlist: { hero: "back", name: "The Kit List Tee", price: 135, way: "white", ways: ["white", "ivory", "oatmeal"], code: "DD-T22",
      blurb: "Nine small drawings of a Dink Different night: paddle, ball, cap, karak, floodlight and the rest. Two inks.",
      front: chest,
      back: function (W, H, c) { var u = W * .085, x0 = W / 2 - u * 1.5 - W * .03, y0 = H * .23, gap = W * .03, sw = W * .0034, N = c.ink, A = c.acc, B = c.ball;
        var I = [
          '<rect x="22" y="8" width="56" height="62" rx="24" fill="' + B + '" stroke="' + N + '"/><path d="M50 70v24" stroke="' + N + '" stroke-width="10" stroke-linecap="round"/><g fill="' + N + '"><circle cx="40" cy="30" r="3"/><circle cx="60" cy="30" r="3"/><circle cx="50" cy="44" r="3"/></g>',
          '<circle cx="50" cy="50" r="36" fill="' + B + '" stroke="' + N + '"/><g fill="' + N + '"><circle cx="36" cy="38" r="5"/><circle cx="60" cy="32" r="5"/><circle cx="64" cy="58" r="5"/><circle cx="40" cy="64" r="5"/><circle cx="51" cy="49" r="4"/></g>',
          '<path d="M18 62q0-38 34-38t32 38z" fill="' + A + '" stroke="' + N + '"/><path d="M18 62h64q12 0 14 8H22z" fill="' + N + '"/><circle cx="51" cy="22" r="4" fill="' + N + '"/>',
          '<rect x="34" y="22" width="32" height="70" rx="10" fill="' + B + '" stroke="' + N + '"/><rect x="40" y="8" width="20" height="14" rx="3" fill="' + N + '"/><path d="M34 44h32" stroke="' + N + '"/>',
          '<path d="M26 40h48l-6 52H32z" fill="' + A + '" stroke="' + N + '"/><path d="M40 30q-6-8 0-16M52 30q-6-8 0-16M64 30q-6-8 0-16" fill="none" stroke="' + N + '" stroke-linecap="round"/>',
          '<path d="M10 70q4-20 18-22l14-18q10 0 16 10l12 10q20 2 22 20z" fill="' + B + '" stroke="' + N + '"/><path d="M10 70h82v10H10z" fill="' + N + '"/>',
          '<path d="M50 40v56" stroke="' + N + '" stroke-width="5"/><rect x="24" y="14" width="52" height="28" rx="4" fill="' + A + '" stroke="' + N + '"/><path d="M30 50l-12 12M70 50l12 12M50 50v6" stroke="' + A + '" stroke-linecap="round"/>',
          '<path d="M36 8l14 30 14-30" fill="none" stroke="' + A + '" stroke-width="8"/><circle cx="50" cy="62" r="26" fill="' + B + '" stroke="' + N + '"/><path d="M50 48l4 9 10 1-8 6 3 10-9-6-9 6 3-10-8-6 10-1z" fill="' + N + '"/>',
          '<path d="M10 40h80v34H10z" fill="none" stroke="' + N + '"/><path d="M10 40h80" stroke="' + A + '" stroke-width="7"/><g stroke="' + N + '" stroke-width="1.6"><path d="M22 40v34M34 40v34M46 40v34M58 40v34M70 40v34M82 40v34M10 52h80M10 63h80"/></g><path d="M10 34v58M90 34v58" stroke="' + N + '" stroke-width="5"/>'];
        var L = ["PADDLE", "BALL", "CAP", "WATER", "KARAK", "SHOES", "LIGHTS", "MEDAL", "THE NET"], s = T(W / 2, H * .195, W * .033, "THE KIT LIST", { c: N, a: "middle", ls: W * .004 }).replace("font-family=\"'DM Sans', Helvetica, sans-serif\"", 'font-family="Archivo"');
        I.forEach(function (g, i) { var x = x0 + (i % 3) * (u + gap), y = y0 + Math.floor(i / 3) * (u + gap * 1.5); s += '<g transform="translate(' + x + " " + y + ") scale(" + u / 100 + ')" stroke-width="' + sw * 100 / u + '" stroke-linejoin="round">' + g + "</g>" + T(x + u / 2, y + u + W * .018, W * .0095, L[i], { c: N, a: "middle", ls: W * .002 }); });
        return s + T(W / 2, H * .66, W * .011, "LONG NIGHTS · SOFT HANDS · GOOD COMPANY", { c: A, a: "middle", ls: W * .003 }); } },
    poster: { hero: "back", name: "The Club de Pickleball Tee", price: 145, way: "ivory", ways: ["ivory", "white", "bone"], code: "DD-T23",
      blurb: "A retro club poster on the back: the court in two brass planes, a ball and its shadow. Three inks, 70s-print feel.",
      front: function (W, H, c) { return T(W * .635, H * .262, W * .034, "club", { serif: 1, w: 800, c: c.ink, a: "middle" }) + T(W * .635, H * .287, W * .0115, "DE PICKLEBALL", { c: c.acc, a: "middle", ls: W * .004 }); },
      back: function (W, H, c, id) { var x = W * .3, y = H * .2, w = W * .4, h = H * .38, rr = W * .055, bx = x + w * .46, by = y + h * .5;
        return '<defs>' + rough(id + "rp", W * .0022, 6, .8) + '</defs><g filter="url(#' + id + 'rp)">' + T(x - W * .01, y - H * .015, W * .085, "club", { serif: 1, w: 800, c: c.ink, ls: -W * .002 }) +
          '<path d="M' + x + " " + y + "H" + (x + w * .62) + "L" + (x + w * .25) + " " + (y + h) + "H" + x + 'Z" fill="' + c.acc + '"/><path d="M' + (x + w * .72) + " " + y + "H" + (x + w) + "V" + (y + h * .58) + "L" + (x + w * .52) + " " + (y + h) + "H" + (x + w * .36) + 'Z" fill="' + c.acc + '" opacity=".78"/>' +
          '<ellipse cx="' + (bx + rr * .7) + '" cy="' + (by + rr * .35) + '" rx="' + rr * 1.05 + '" ry="' + rr * .92 + '" fill="' + c.ink + '"/><circle cx="' + bx + '" cy="' + by + '" r="' + rr + '" fill="' + c.ball + '"/>' +
          [[-.4, -.35], [.3, -.42], [.05, .05], [-.35, .4], [.45, .3]].map(function (q) { return '<circle cx="' + (bx + q[0] * rr) + '" cy="' + (by + q[1] * rr) + '" r="' + rr * .1 + '" fill="' + c.body + '"/>'; }).join("") +
          T(x + w * .66, y + h + H * .055, W * .022, "de", { serif: 1, it: 1, w: 600, c: c.ink, a: "end" }) + T(x + w + W * .01, y + h + H * .055, W * .062, "pickleball", { serif: 1, w: 800, c: c.ink, a: "end", ls: -W * .002 }) +
          T(x + w + W * .01, y + h + H * .082, W * .0095, "DINK DIFFERENT · DOHA · EST. 2026", { c: c.ink, a: "end", ls: W * .0025 }) + "</g>"; } },
    doha: { name: "The Doha Script Tee", price: 129, way: "white", ways: ["white", "ivory", "navy", "camel"], code: "DD-T24",
      blurb: "A small script across the chest with a pickleball for the o. All season long. Quiet, and very Dink Different.",
      front: function (W, H, c) { var cx = W / 2, y = H * .3, s = W * .085, r = s * .2;
        return T(cx - r * 1.25, y, s, "D", { serif: 1, it: 1, w: 700, c: c.ink, a: "end" }) + '<circle cx="' + cx + '" cy="' + (y - s * .22) + '" r="' + r + '" fill="' + c.ball + '"/>' +
          [[-.4, -.3], [.35, -.35], [0, .2], [-.3, .45], [.45, .3]].map(function (q) { return '<circle cx="' + (cx + q[0] * r) + '" cy="' + (y - s * .22 + q[1] * r) + '" r="' + r * .13 + '" fill="' + c.ink + '" opacity=".55"/>'; }).join("") +
          T(cx + r * 1.25, y, s, "ha", { serif: 1, it: 1, w: 700, c: c.ink }) + T(cx, y + s * .42, s * .3, "all season long", { serif: 1, it: 1, w: 500, c: c.acc, a: "middle" }); },
      back: function (W, H, c) { return T(W / 2, H * .13, W * .0115, "DINK DIFFERENT · PICKLEBALL CLUB", { c: c.ink, a: "middle", ls: W * .004 }); } },
    leclub: { hero: "back", name: "The Le Club Tee", price: 145, way: "white", ways: ["white", "ivory"], code: "DD-T25",
      blurb: "A painted paddle and the club name brushed across it, with the opening hours stamped on the side. Three inks.",
      front: chest,
      back: function (W, H, c, id) { var cx = W * .48, cy = H * .36, pw = W * .17, ph = W * .2, holes = "";
        for (var i = 0; i < 5; i++) for (var j = 0; j < 4; j++) holes += '<circle cx="' + (-pw * .3 + j * pw * .2) + '" cy="' + (-ph * .32 + i * ph * .16) + '" r="' + W * .006 + '" fill="' + c.acc + '" opacity=".7"/>';
        return '<defs>' + rough(id + "pb", W * .0045, 8, .5) + rough(id + "pt", W * .004, 3, .6) + "</defs>" +
          '<g filter="url(#' + id + 'pb)" transform="rotate(-24 ' + cx + " " + cy + ") translate(" + cx + " " + cy + ')"><rect x="' + -pw / 2 + '" y="' + -ph / 2 + '" width="' + pw + '" height="' + ph + '" rx="' + pw * .42 + '" fill="' + c.ball + '" stroke="' + c.acc + '" stroke-width="' + W * .014 + '"/>' + holes +
          '<rect x="' + -W * .016 + '" y="' + ph / 2 + '" width="' + W * .032 + '" height="' + W * .15 + '" rx="' + W * .01 + '" fill="' + c.acc + '"/></g>' +
          '<g filter="url(#' + id + 'pt)">' + T(W * .5, H * .2, W * .036, "LE CLUB", { serif: 1, w: 800, c: c.ink, a: "middle", ls: W * .006 }) +
          T(W * .5, H * .335, W * .13, "DINK", { serif: 1, w: 900, c: c.ink, a: "middle", ls: W * .004, tr: "rotate(-4 " + W * .5 + " " + H * .32 + ")" }) +
          T(W * .64, H * .4, W * .028, "all season", { serif: 1, it: 1, w: 600, c: c.acc, a: "middle", tr: "rotate(-8 " + W * .64 + " " + H * .4 + ")" }) + T(W * .65, H * .43, W * .028, "long", { serif: 1, it: 1, w: 600, c: c.acc, a: "middle", tr: "rotate(-8 " + W * .65 + " " + H * .43 + ")" }) +
          '<rect x="' + W * .6 + '" y="' + H * .465 + '" width="' + W * .1 + '" height="' + H * .048 + '" fill="' + c.ink + '"/>' + T(W * .65, H * .484, W * .0115, "OPEN 8PM", { c: c.body, a: "middle", ls: W * .002 }) + T(W * .65, H * .503, W * .0105, "M · W · TH", { c: c.body, a: "middle", ls: W * .002 }) +
          mark(W * .37, H * .52, .13, c.ink, c.acc, c.ball) + "</g>"; } },
    goods: { hero: "back", name: "The Club Goods Tee", price: 139, way: "ivory", ways: ["ivory", "navy", "oatmeal"], code: "DD-T26",
      blurb: "A stacked club lockup, three hatched balls and a stamped oval. Paddles and good company, for the soft-handed.",
      front: function (W, H, c) { return TA(W * .635, H * .262, W * .026, '<tspan>Dink</tspan><tspan font-family="Fraunces" font-style="italic" font-weight="700"> Different</tspan>', { c: c.ink, a: "middle", st: 75, ls: -W * .0008 }) + TA(W * .635, H * .283, W * .0105, "PADDLES &amp; GOOD COMPANY", { c: c.ink, a: "middle", w: 600, ls: W * .0012 }); },
      back: function (W, H, c, id) { var x = W * .27, s = "", r = W * .046, cy = H * .42;
        s += TA(x, H * .23, W * .088, '<tspan>Dink</tspan><tspan font-family="Fraunces" font-style="italic" font-weight="600" font-size="' + W * .082 + '">Different</tspan>', { c: c.ink, st: 72, ls: -W * .002, w: 800 });
        s += TA(x, H * .275, W * .043, "Paddles &amp; Good Company", { c: c.ink, w: 700, ls: -W * .0012 }) + TA(x + W * .06, H * .318, W * .043, "For the soft-handed", { c: c.ink, w: 700, ls: -W * .0012 });
        s += '<ellipse cx="' + W * .64 + '" cy="' + H * .36 + '" rx="' + W * .075 + '" ry="' + H * .024 + '" fill="none" stroke="' + c.ink + '" stroke-width="' + W * .0025 + '" transform="rotate(-8 ' + W * .64 + " " + H * .36 + ')"/>' + T(W * .64, H * .366, W * .021, "Since 2026", { serif: 1, it: 1, w: 600, c: c.ink, a: "middle", tr: "rotate(-8 " + W * .64 + " " + H * .36 + ")" }) + TA(W * .555, H * .37, W * .014, "A Constant Rally", { c: c.ink, a: "end", w: 600 });
        s += '<defs><pattern id="' + id + 'ht" width="' + W * .006 + '" height="' + W * .006 + '" patternUnits="userSpaceOnUse"><rect width="' + W * .006 + '" height="' + W * .0026 + '" fill="' + c.ink + '"/></pattern></defs>';
        s += '<circle cx="' + (x + r * 3.1) + '" cy="' + cy + '" r="' + r + '" fill="url(#' + id + 'ht)" opacity=".45"/><circle cx="' + (x + r * 2.05) + '" cy="' + cy + '" r="' + r + '" fill="url(#' + id + 'ht)" opacity=".8"/><circle cx="' + (x + r) + '" cy="' + cy + '" r="' + r + '" fill="' + c.ink + '"/>';
        return s; } },
    clubs: { hero: "back", name: "The Pickleball Clubs Doha Tee", price: 145, way: "bone", ways: ["bone", "ivory", "stone"], code: "DD-T27",
      blurb: "A vintage oval of the Doha skyline over a court at golden hour, stacked club type and a script underneath. One ink.",
      front: function (W, H, c) { return TA(W * .635, H * .25, W * .026, "PICKLEBALL", { c: c.ink, a: "middle", st: 75, w: 800 }) + TA(W * .635, H * .272, W * .026, "CLUBS", { c: c.ink, a: "middle", st: 75, w: 800 }) + T(W * .635, H * .298, W * .03, "Doha", { serif: 1, it: 1, w: 700, c: c.ink, a: "middle" }); },
      back: function (W, H, c, id) { var cx = W / 2, cy = H * .25, rx = W * .175, ry = H * .09, base = cy + ry * .1, sw = W * .003, sky = "";
        var bld = [[-.92, .18], [-.82, .3], [-.74, .22], [-.66, .42], [-.56, .26], [-.48, .5], [-.38, .34], [-.3, .62], [-.2, .4], [-.06, .55], [.04, .3], [.14, .46], [.3, .38], [.4, .24], [.5, .33], [.6, .2], [.7, .28], [.82, .16]];
        bld.forEach(function (b, i) { var w = rx * .085, h = ry * b[1] * 1.2; sky += '<rect x="' + (cx + b[0] * rx) + '" y="' + (base - h) + '" width="' + w + '" height="' + h + '" fill="' + c.ink + '"/>'; });
        sky += '<path d="M' + (cx - rx * .2) + " " + base + "V" + (base - ry * .95) + "Q" + (cx - rx * .16) + " " + (base - ry * 1.25) + " " + (cx - rx * .12) + " " + (base - ry * .95) + "V" + base + 'Z" fill="' + c.ink + '"/><path d="M' + (cx + rx * .23) + " " + base + "L" + (cx + rx * .25) + " " + (base - ry * 1.05) + "L" + (cx + rx * .27) + " " + base + 'Z" fill="' + c.ink + '"/>';
        var court = '<g fill="none" stroke="' + c.ink + '" stroke-width="' + sw + '"><path d="M' + (cx - rx * .55) + " " + (base + ry * .2) + "L" + (cx + rx * .55) + " " + (base + ry * .2) + "L" + (cx + rx * 1.1) + " " + (cy + ry) + "L" + (cx - rx * 1.1) + " " + (cy + ry) + 'Z"/><path d="M' + (cx - rx * .75) + " " + (base + ry * .48) + "H" + (cx + rx * .75) + '" stroke-width="' + sw * 2.4 + '"/><path d="M' + cx + " " + (base + ry * .2) + "V" + (base + ry * .4) + "M" + cx + " " + (base + ry * .58) + "V" + (cy + ry) + '"/></g><circle cx="' + (cx + rx * .32) + '" cy="' + (base + ry * .7) + '" r="' + W * .007 + '" fill="' + c.ink + '"/>';
        return '<defs><clipPath id="' + id + 'ov"><ellipse cx="' + cx + '" cy="' + cy + '" rx="' + rx + '" ry="' + ry + '"/></clipPath></defs><g clip-path="url(#' + id + 'ov)">' + sky + '<path d="M' + (cx - rx) + " " + base + "H" + (cx + rx) + '" stroke="' + c.ink + '" stroke-width="' + sw + '"/>' + court + '</g><ellipse cx="' + cx + '" cy="' + cy + '" rx="' + rx + '" ry="' + ry + '" fill="none" stroke="' + c.ink + '" stroke-width="' + W * .006 + '"/>' +
          TA(cx, H * .43, W * .085, "PICKLEBALL", { c: c.ink, a: "middle", st: 70, w: 800, ls: -W * .001 }) + TA(cx, H * .505, W * .085, "CLUBS", { c: c.ink, a: "middle", st: 70, w: 800, ls: -W * .001 }) + T(cx, H * .585, W * .1, "Doha", { serif: 1, it: 1, w: 700, c: c.ink, a: "middle" }); } },
    varsity: { name: "The Varsity Club Tee", price: 135, way: "white", ways: ["white", "ivory", "navy"], code: "DD-T28",
      blurb: "A big chest lockup in the spirit of old club whites: the script over a court box, crossed paddles underneath.",
      front: function (W, H, c) { var cx = W / 2, y = H * .33, bw = W * .34, bh = H * .065, s = "";
        s += '<g fill="none" stroke="' + c.ink + '" stroke-width="' + W * .0028 + '"><path d="M' + (cx - bw / 2 + W * .03) + " " + (y - bh * .3) + "H" + (cx + bw / 2) + "L" + (cx + bw / 2 - W * .03) + " " + (y + bh * .7) + "H" + (cx - bw / 2) + 'Z"/><path d="M' + (cx + W * .015) + " " + (y - bh * .3) + "L" + (cx - W * .015) + " " + (y + bh * .7) + '"/></g>';
        s += T(cx - W * .02, H * .262, W * .03, "Dink Different", { serif: 1, w: 800, c: c.ink, a: "middle" }) + T(cx - W * .01, H * .325, W * .085, "Pickleball", { serif: 1, w: 800, c: c.ink, a: "middle", ls: -W * .002 }) +
          T(cx + W * .1, H * .36, W * .07, "Club", { serif: 1, it: 1, w: 700, c: c.acc, a: "middle", tr: "rotate(-8 " + (cx + W * .1) + " " + H * .36 + ")" }) + '<circle cx="' + (cx + W * .16) + '" cy="' + H * .255 + '" r="' + W * .012 + '" fill="' + c.ball + '"/>';
        s += T(cx, H * .405, W * .0105, "ESTABLISHED 2026 · DOHA", { c: c.ink, a: "middle", ls: W * .004 });
        [-1, 1].forEach(function (d) { s += '<g transform="translate(' + cx + " " + H * .45 + ") rotate(" + d * 38 + ')"><rect x="' + -W * .012 + '" y="' + -W * .05 + '" width="' + W * .024 + '" height="' + W * .032 + '" rx="' + W * .011 + '" fill="' + c.acc + '"/><rect x="' + -W * .003 + '" y="' + -W * .018 + '" width="' + W * .006 + '" height="' + W * .04 + '" fill="' + c.acc + '"/></g>'; });
        return s; },
      back: function (W, H, c) { return T(W / 2, H * .13, W * .0115, "DINK DIFFERENT · PICKLEBALL CLUB", { c: c.ink, a: "middle", ls: W * .004 }); } },
    thursdays: { hero: "back", name: "The Thursdays Tee", price: 129, way: "white", ways: ["white", "ivory", "navy"], code: "DD-T29",
      blurb: "Thursdays are for Pickleball. Set in the club serif across the shoulders, for every regular.",
      front: chest,
      back: function (W, H, c) { var cx = W / 2; return T(cx, H * .22, W * .078, "Thursdays", { serif: 1, w: 800, c: c.ink, a: "middle", ls: -W * .001 }) + T(cx, H * .268, W * .05, "are for", { serif: 1, it: 1, w: 600, c: c.acc, a: "middle" }) + T(cx, H * .335, W * .078, "Pickleball", { serif: 1, w: 800, c: c.ink, a: "middle", ls: -W * .001 }) +
        mark(cx, H * .395, .15, c.ink, c.acc, c.ball) + T(cx, H * .44, W * .0115, "DINK DIFFERENT · 8 PM TILL LATE", { c: c.ink, a: "middle", ls: W * .004 }); } },
    kitchenclub: { name: "The Kitchen Club Tee", price: 135, way: "ivory", ways: ["ivory", "oatmeal", "navy"], code: "DD-T30",
      blurb: "A paddle drawn as one long swoosh around the club name. Small, embroidered-look chest print, one ink.",
      front: function (W, H, c, id) { var x = W * .33, y = H * .3, u = W * .34, sw = W * .005;
        var sws = '<path d="M' + (x + u * .28) + " " + (y - u * .23) + "C" + (x - u * .1) + " " + (y - u * .25) + ", " + (x - u * .12) + " " + (y + u * .2) + ", " + (x + u * .3) + " " + (y + u * .2) + "S" + (x + u * .8) + " " + (y + u * .2) + ", " + (x + u * .92) + " " + (y + u * .28) + '" fill="none" stroke="' + c.ink + '" stroke-width="' + sw + '" stroke-linecap="round"/>';
        var grip = '<g transform="rotate(16 ' + (x + u * .95) + " " + (y + u * .29) + ')"><rect x="' + (x + u * .84) + '" y="' + (y + u * .27) + '" width="' + u * .2 + '" height="' + u * .04 + '" rx="' + u * .015 + '" fill="' + c.ink + '"/></g>';
        return sws + grip + T(x + u * .1, y - u * .145, u * .085, "the", { serif: 1, it: 1, w: 700, c: c.ink }) + T(x + u * .2, y - u * .01, u * .13, "KITCHEN", { serif: 1, w: 600, c: c.ink, ls: u * .004 }) +
          '<circle cx="' + (x + u * .3) + '" cy="' + (y + u * .1) + '" r="' + u * .035 + '" fill="' + c.ink + '"/>' + [[-.4, -.3], [.35, -.35], [0, .2], [-.3, .45], [.45, .3]].map(function (q) { return '<circle cx="' + (x + u * .3 + q[0] * u * .035) + '" cy="' + (y + u * .1 + q[1] * u * .035) + '" r="' + u * .005 + '" fill="' + c.body + '"/>'; }).join("") +
          T(x + u * .36, y + u * .14, u * .13, "CLUB", { serif: 1, w: 600, c: c.ink, ls: u * .004 }) + T(x + u * .82, y + u * .37, u * .045, "2026", { serif: 1, w: 600, c: c.ink }); },
      back: function (W, H, c) { return T(W / 2, H * .13, W * .0115, "DINK DIFFERENT · DOHA", { c: c.ink, a: "middle", ls: W * .004 }); } },
    offcourt: { hero: "back", name: "The Off Court Tee", price: 139, way: "navy", ways: ["navy", "ivory", "oatmeal"], code: "DD-T31",
      blurb: "Off court with Dink Different: a word grid with the ball, the net and the kitchen line standing in for letters. One ink.",
      front: function (W, H, c) { return TA(W * .635, H * .265, W * .026, "OFF COURT", { c: c.spot2, a: "middle", w: 800 }) + T(W * .635, H * .29, W * .016, "with Dink Different", { serif: 1, it: 1, w: 600, c: c.spot2, a: "middle" }); },
      back: function (W, H, c, id) { var I = c.spot2, x = W * .3, fs = W * .072, lh = fs * 1.08, y1 = H * .26, bR = fs * .36, s = "";
        var bl = function (cx, cy) { return '<circle cx="' + cx + '" cy="' + cy + '" r="' + bR + '" fill="' + I + '"/>' + [[-.4, -.3], [.35, -.35], [0, .2], [-.3, .45], [.45, .3]].map(function (q) { return '<circle cx="' + (cx + q[0] * bR) + '" cy="' + (cy + q[1] * bR) + '" r="' + bR * .12 + '" fill="' + c.body + '"/>'; }).join(""); };
        s += T(x, y1 - fs * .95, W * .022, "Doha Vintage", { serif: 1, it: 1, w: 600, c: I });
        s += bl(x + bR, y1 - fs * .36) + TA(x + bR * 2.4, y1, fs, "OFF", { c: I, w: 800, ls: -W * .001 });
        s += '<defs><pattern id="' + id + 'nt" width="' + W * .009 + '" height="' + W * .009 + '" patternUnits="userSpaceOnUse"><path d="M0 0H' + W * .009 + "M0 0V" + W * .009 + '" stroke="' + I + '" stroke-width="' + W * .0018 + '"/></pattern></defs><rect x="' + (x + W * .235) + '" y="' + (y1 - fs * .72) + '" width="' + W * .16 + '" height="' + fs * .72 + '" fill="url(#' + id + 'nt)" stroke="' + I + '" stroke-width="' + W * .002 + '"/>';
        s += TA(x, y1 + lh, fs, "C", { c: I, w: 800 }) + bl(x + fs * .98, y1 + lh - fs * .36) + TA(x + fs * 1.4, y1 + lh, fs, "URT", { c: I, w: 800, ls: -W * .001 });
        s += '<g stroke="' + I + '" stroke-width="' + W * .004 + '"><path d="M' + x + " " + (y1 + lh * 2 - fs * .55) + "L" + (x + W * .1) + " " + (y1 + lh * 2 - fs * .7) + "M" + x + " " + (y1 + lh * 2 - fs * .2) + "L" + (x + W * .1) + " " + (y1 + lh * 2 - fs * .4) + '"/></g>' + TA(x + W * .12, y1 + lh * 2, fs, "WITH", { c: I, w: 800, ls: -W * .001 });
        s += TA(x, y1 + lh * 2.55, W * .0125, "DOHA · QATAR", { c: I, w: 600, ls: W * .002 }) + TA(x, y1 + lh * 2.55 + W * .018, W * .0125, "EST. 2026", { c: I, w: 600, ls: W * .002 }) +
          TA(x + W * .42, y1 + lh * 2.6, W * .036, "DINK", { c: I, w: 800, a: "end", st: 80 }) + TA(x + W * .42, y1 + lh * 2.6 + W * .036, W * .036, "DIFFERENT", { c: I, w: 800, a: "end", st: 80 });
        return s; } },
  };

  function render(design, o) {
    o = o || {};
    var d = DESIGNS[design] || DESIGNS.court, side = o.side === "back" ? "back" : "front", size = IMG[side], W = size[0], H = size[1];
    var c = COLOURS[o.way] || COLOURS[d.way], id = "ct" + (++uid);
    var src = "/assets/mockups/tee-" + side + ".png", mask = "/assets/mockups/tee-" + side + "-mask.png";
    var s = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 ' + W + " " + H + '" class="mock" role="img" aria-label="' + d.name + " in " + c.label + ", " + side + '">';
    s += '<defs><mask id="' + id + 'm" maskUnits="userSpaceOnUse" x="0" y="0" width="' + W + '" height="' + H + '"><image href="' + mask + '" xlink:href="' + mask + '" width="' + W + '" height="' + H + '"/></mask>' +
      // fine cotton jersey knit, and a soft ink edge so prints sit in the fabric
      '<pattern id="' + id + 'k" width="4" height="4" patternUnits="userSpaceOnUse"><path d="M0 2h4" stroke="#000" stroke-opacity=".05" stroke-width="1"/></pattern>' +
      '<filter id="' + id + 'ink" filterUnits="userSpaceOnUse" x="0" y="0" width="' + W + '" height="' + H + '"><feTurbulence type="fractalNoise" baseFrequency="2.2" numOctaves="1" result="n"/><feColorMatrix in="n" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -.35 1.12" result="a"/><feComposite in="SourceGraphic" in2="a" operator="in"/></filter></defs>';
    s += '<g mask="url(#' + id + 'm)" style="isolation:isolate"><rect width="' + W + '" height="' + H + '" fill="#fff"/><image href="' + src + '" xlink:href="' + src + '" width="' + W + '" height="' + H + '"/>';
    s += '<rect width="' + W + '" height="' + H + '" fill="' + c.body + '" style="mix-blend-mode:multiply"/><rect width="' + W + '" height="' + H + '" fill="url(#' + id + 'k)"/>';
    s += '<g filter="url(#' + id + 'ink)" opacity=".96">' + d[side](W, H, c, id) + "</g>";
    // woven neck label
    var lw = W * 0.07, lh = H * 0.022, ly = H * (side === "back" ? 0.055 : 0.07);
    if (side === "back") s += '<rect x="' + (W / 2 - lw / 2) + '" y="' + ly + '" width="' + lw + '" height="' + lh + '" rx="' + lh * 0.15 + '" fill="#1D2840"/>' + txt(W / 2, ly + lh * 0.72, lh * 0.6, "DD · CLUB", { sans: true, ls: lh * 0.08, fill: "#C9A86B" });
    // the fabric's folds over the print
    s += '<image href="' + src + '" xlink:href="' + src + '" width="' + W + '" height="' + H + '" opacity=".55" style="mix-blend-mode:multiply"/></g></svg>';
    return s;
  }
  window.ClubTee = { render: render, DESIGNS: DESIGNS, COLOURS: COLOURS, PRINTS: PRINTS, mark: mark };
})();
