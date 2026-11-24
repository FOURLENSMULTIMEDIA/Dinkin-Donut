// The Clubhouse Collection: heavyweight cotton tees in the old-money tennis-club tradition.
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
  // Each design: front(W, H, c, id) and back(W, H, c, id) return the print layer
  var DESIGNS = {
    sporting: {
      name: "The Sporting Club Tee", price: 135, way: "ivory", ways: ["ivory", "oatmeal", "navy", "stone"],
      blurb: "A centre-chest club seal: crossed paddles, a laurel and the club name arched in our soft serif. Screen-printed in two inks.",
      front: function (W, H, c, id) {
        var cx = W * 0.5, cy = H * 0.36, r = W * 0.16;
        var s = '<defs><path id="' + id + 'arc" d="M' + (cx - r) + " " + cy + "a" + r + " " + r + " 0 0 1 " + 2 * r + ' 0"/></defs>';
        s += '<text font-family="' + SER + '" font-weight="800" font-size="' + W * 0.042 + '" letter-spacing="' + W * 0.006 + '" fill="' + c.ink + '" style="font-variation-settings:\'SOFT\' 100"><textPath href="#' + id + 'arc" startOffset="50%" text-anchor="middle">DINK DIFFERENT</textPath></text>';
        // crossed paddles
        var pw = W * 0.062, ph = W * 0.07, hl = W * 0.042;
        [-38, 38].forEach(function (a) {
          s += '<g transform="rotate(' + a + " " + cx + " " + (cy + W * 0.035) + ')" fill="none" stroke="' + c.ink + '" stroke-width="' + W * 0.006 + '" stroke-linecap="round">' +
            '<rect x="' + (cx - pw / 2) + '" y="' + (cy - ph * 0.85) + '" width="' + pw + '" height="' + ph + '" rx="' + pw * 0.36 + '" fill="' + c.body + '"/><path d="M' + cx + " " + (cy - ph * 0.85 + ph) + "v" + hl + '" stroke-width="' + W * 0.011 + '"/></g>';
        });
        s += '<circle cx="' + cx + '" cy="' + (cy - W * 0.075) + '" r="' + W * 0.014 + '" fill="' + c.acc + '"/>';
        // laurel sprigs
        [-1, 1].forEach(function (d) {
          for (var i = 0; i < 5; i++) {
            var t = i / 4, lx = cx + d * W * (0.1 + 0.02 * Math.sin(t * 3)), ly = cy + W * 0.06 - t * W * 0.1;
            s += '<ellipse cx="' + lx + '" cy="' + ly + '" rx="' + W * 0.008 + '" ry="' + W * 0.017 + '" fill="' + c.acc + '" transform="rotate(' + d * (30 + i * 8) + " " + lx + " " + ly + ')"/>';
          }
        });
        s += txt(cx, cy + W * 0.135, W * 0.026, "SPORTING CLUB", { sans: true, ls: W * 0.008, fill: c.ink });
        s += txt(cx, cy + W * 0.17, W * 0.016, "EST. MMXXVI · DOHA", { sans: true, ls: W * 0.006, fill: c.acc });
        return s;
      },
      back: function (W, H, c) { return txt(W / 2, H * 0.115, W * 0.022, "Play well.", { it: true, w: 700, fill: c.acc }); },
    },
    members: {
      name: "The Members Tee", price: 129, way: "navy", ways: ["navy", "ivory", "camel", "oatmeal"],
      blurb: "The Different D embroidered small on the chest. Across the back, the only line that matters: Members.",
      front: function (W, H, c) { return mark(W * 0.635, H * 0.255, 0.32, c.ink, c.acc); },
      back: function (W, H, c) {
        var cx = W / 2, s = "";
        s += txt(cx, H * 0.27, W * 0.13, "Members", { it: true, w: 700, fill: c.ink });
        s += txt(cx, H * 0.335, W * 0.03, "ONLY", { sans: true, ls: W * 0.022, fill: c.acc });
        s += '<path d="M' + (cx - W * 0.09) + " " + H * 0.37 + "h" + W * 0.18 + '" stroke="' + c.acc + '" stroke-width="' + W * 0.003 + '"/>';
        s += txt(cx, H * 0.405, W * 0.017, "DINK DIFFERENT PICKLEBALL CLUB · DOHA", { sans: true, ls: W * 0.006, fill: c.ink });
        return s;
      },
    },
    stripe: {
      name: "The Court Stripe Tee", price: 139, way: "ivory", ways: ["ivory", "oatmeal", "stone"],
      blurb: "Borrowed from the cable-knit cricket and tennis jumper: a navy and brass chest stripe, with the crest above. Knitted-in look, printed soft.",
      front: function (W, H, c) {
        var y = H * 0.34, s = "", navy = c.body === "#1B2440" ? "#F1EBDD" : "#1D2840";
        var x0 = W * 0.215, bw = W * 0.57;
        s += '<rect x="' + x0 + '" y="' + y + '" width="' + bw + '" height="' + H * 0.012 + '" fill="' + c.acc + '"/>';
        s += '<rect x="' + x0 + '" y="' + (y + H * 0.022) + '" width="' + bw + '" height="' + H * 0.03 + '" fill="' + navy + '"/>';
        s += '<rect x="' + x0 + '" y="' + (y + H * 0.062) + '" width="' + bw + '" height="' + H * 0.012 + '" fill="' + c.acc + '"/>';
        s += mark(W * 0.635, H * 0.255, 0.3, c.ink, c.acc);
        return s;
      },
      back: function (W, H, c) { return txt(W / 2, H * 0.11, W * 0.016, "DINK DIFFERENT · MMXXVI", { sans: true, ls: W * 0.006, fill: c.acc }); },
    },
    rule: {
      name: "The Rule No. 1 Tee", price: 129, way: "oatmeal", ways: ["oatmeal", "ivory", "navy", "camel"],
      blurb: "Small wordmark up front. On the back, the club’s first and only rule, set like a vintage clubhouse sign.",
      front: function (W, H, c) { return txt(W * 0.635, H * 0.255, W * 0.03, "Dink <tspan font-style=\"italic\" fill=\"" + c.acc + "\">Different</tspan>", { fill: c.ink }); },
      back: function (W, H, c) {
        var cx = W / 2, s = "";
        s += txt(cx, H * 0.2, W * 0.022, "THE CLUB RULES", { sans: true, ls: W * 0.012, fill: c.acc });
        s += txt(cx, H * 0.3, W * 0.1, "Rule No. 1", { it: true, w: 700, fill: c.ink });
        s += '<path d="M' + (cx - W * 0.16) + " " + H * 0.335 + "h" + W * 0.32 + '" stroke="' + c.acc + '" stroke-width="' + W * 0.003 + '"/>';
        s += txt(cx, H * 0.39, W * 0.052, "Shake hands", { fill: c.ink });
        s += txt(cx, H * 0.445, W * 0.052, "at the net.", { fill: c.ink });
        s += mark(cx, H * 0.53, 0.18, c.ink, c.acc);
        return s;
      },
    },
    court: {
      name: "The Court No. 2 Tee", price: 135, way: "camel", ways: ["camel", "ivory", "navy", "stone"],
      blurb: "A line drawing of a pickleball court from above, kitchen and all, framed like a lawn club’s fixture card.",
      front: function (W, H, c) {
        var cx = W * 0.5, w = W * 0.2, h = W * 0.36, x = cx - w / 2, y = H * 0.24, sw = W * 0.0045, k = h * 0.159, s = "";
        s += txt(cx, y - W * 0.03, W * 0.019, "DINK DIFFERENT", { sans: true, ls: W * 0.008, fill: c.ink });
        s += '<g fill="none" stroke="' + c.ink + '" stroke-width="' + sw + '"><rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '"/>' +
          '<path d="M' + x + " " + (y + h / 2 - k) + "h" + w + "M" + x + " " + (y + h / 2 + k) + "h" + w + "M" + cx + " " + y + "V" + (y + h / 2 - k) + "M" + cx + " " + (y + h / 2 + k) + "V" + (y + h) + '"/></g>';
        s += '<path d="M' + (x - W * 0.015) + " " + (y + h / 2) + "h" + (w + W * 0.03) + '" stroke="' + c.acc + '" stroke-width="' + sw * 2 + '" stroke-linecap="round"/>';
        s += '<circle cx="' + (cx + w * 0.22) + '" cy="' + (y + h / 2 - k * 0.55) + '" r="' + W * 0.009 + '" fill="#E3CF7E" stroke="' + c.ink + '" stroke-width="' + sw * 0.6 + '"/>';
        s += txt(cx, y + h + W * 0.05, W * 0.034, "Court No. 2", { it: true, w: 700, fill: c.ink });
        s += txt(cx, y + h + W * 0.078, W * 0.014, "LAWN · PICKLEBALL · MMXXVI", { sans: true, ls: W * 0.006, fill: c.acc });
        return s;
      },
      back: function (W, H, c) { return mark(W / 2, H * 0.13, 0.26, c.ink, c.acc); },
    },
  };

  function render(design, o) {
    o = o || {};
    var d = DESIGNS[design] || DESIGNS.sporting, side = o.side === "back" ? "back" : "front", size = IMG[side], W = size[0], H = size[1];
    var c = COLOURS[o.way] || COLOURS[d.way], id = "ct" + (++uid);
    var src = "/assets/mockups/tee-" + side + ".png", mask = "/assets/mockups/tee-" + side + "-mask.png";
    var s = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 ' + W + " " + H + '" class="mock" role="img" aria-label="' + d.name + " in " + c.label + ", " + side + '">';
    s += '<defs><mask id="' + id + 'm" maskUnits="userSpaceOnUse" x="0" y="0" width="' + W + '" height="' + H + '"><image href="' + mask + '" xlink:href="' + mask + '" width="' + W + '" height="' + H + '"/></mask>' +
      // fine cotton jersey knit, and a soft ink edge so prints sit in the fabric
      '<pattern id="' + id + 'k" width="4" height="4" patternUnits="userSpaceOnUse"><path d="M0 2h4" stroke="#000" stroke-opacity=".05" stroke-width="1"/></pattern>' +
      '<filter id="' + id + 'ink"><feTurbulence type="fractalNoise" baseFrequency="2.2" numOctaves="1" result="n"/><feColorMatrix in="n" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -.35 1.12" result="a"/><feComposite in="SourceGraphic" in2="a" operator="in"/></filter></defs>';
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
  window.ClubTee = { render: render, DESIGNS: DESIGNS, COLOURS: COLOURS };
})();
