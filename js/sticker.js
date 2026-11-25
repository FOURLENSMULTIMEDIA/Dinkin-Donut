// Founding Dinker sticker: a die-cut, numbered 1-of-1 sticker generated from the player's name and spot.
// Sticker.svg(pass, logoHref) returns SVG markup; Sticker.png(pass) resolves to a PNG blob for saving.
(function () {
  function seed(str) {
    var h = 2166136261;
    for (var i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); }
    var x = h >>> 0 || 1;
    return function () { x ^= x << 13; x >>>= 0; x ^= x >>> 17; x ^= x << 5; x >>>= 0; return x / 4294967296; };
  }
  // Four finishes; the name decides which one you get.
  var FIN = [
    { key: "navy", label: "Club Navy", band: "#1D2840", bandInk: "#F4EFE3", acc: "#C9A86B", field: "#F4EFE3", fieldInk: "#1D2840", rib: "#9C7A45", ribDk: "#6E5228", ribInk: "#FBF7EF" },
    { key: "ivory", label: "Ivory", band: "#F1EADB", bandInk: "#1D2840", acc: "#9C7A45", field: "#1D2840", fieldInk: "#F4EFE3", rib: "#C9A86B", ribDk: "#8E6C3A", ribInk: "#1D2840" },
    { key: "camel", label: "Camel", band: "#B89B72", bandInk: "#1D2840", acc: "#1D2840", field: "#FBF7EF", fieldInk: "#1D2840", rib: "#1D2840", ribDk: "#0E1424", ribInk: "#F4EFE3" },
    { key: "brass", label: "Brass", band: "#9C7A45", bandInk: "#FBF7EF", acc: "#F0D9A4", field: "#1D2840", fieldInk: "#F4EFE3", rib: "#F4EFE3", ribDk: "#C9BFA8", ribInk: "#1D2840" },
  ];
  var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); };
  var MARK = '<path d="M104 44h20a56 56 0 0 1 0 112h-20zM119 62h5a27 38 0 0 1 0 76h-5z"/><path d="M96 44H76a56 56 0 0 0 0 112h20zM81 62h-5a27 38 0 0 0 0 76h5z"/>';

  // one laurel branch along an arc, leaves alternating in/out
  function laurel(cx, cy, r, a0, a1, col, flip) {
    var out = "", n = 9;
    out += '<path d="M' + (cx + Math.cos(a0) * r).toFixed(1) + " " + (cy + Math.sin(a0) * r).toFixed(1) + " A" + r + " " + r + " 0 0 " + (flip ? 0 : 1) + " " + (cx + Math.cos(a1) * r).toFixed(1) + " " + (cy + Math.sin(a1) * r).toFixed(1) + '" fill="none" stroke="' + col + '" stroke-width="2.2" stroke-linecap="round"/>';
    for (var i = 1; i < n; i++) {
      var t = a0 + (a1 - a0) * (i / n), x = cx + Math.cos(t) * r, y = cy + Math.sin(t) * r, deg = t * 180 / Math.PI + (flip ? -90 : 90);
      var sz = 1 - i / (n + 4);
      out += '<g transform="translate(' + x.toFixed(1) + " " + y.toFixed(1) + ") rotate(" + deg.toFixed(1) + ')">' +
        '<ellipse cx="-7" cy="-3" rx="' + (9 * sz + 3).toFixed(1) + '" ry="' + (3.6 * sz + 1.4).toFixed(1) + '" transform="rotate(-38)" fill="' + col + '"/>' +
        '<ellipse cx="7" cy="-3" rx="' + (9 * sz + 3).toFixed(1) + '" ry="' + (3.6 * sz + 1.4).toFixed(1) + '" transform="rotate(38)" fill="' + col + '"/></g>';
    }
    return out;
  }

  function svg(p, logoHref, fontCss) {
    var name = String(p.name || "Dinker").trim(), first = name.split(/\s+/)[0].toUpperCase().slice(0, 12);
    var rnd = seed(name.toLowerCase() + "|" + (p.no || 0) + "|" + (p.code || ""));
    var f = FIN[Math.floor(rnd() * FIN.length)], id = "st" + Math.floor(rnd() * 1e9);
    var no = p.no ? String(p.no).padStart(2, "0") : "WL";
    var s = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 500 500" role="img" aria-label="Founding Dinker sticker number ' + no + ' for ' + esc(name) + '">';
    s += '<defs>' + (fontCss ? '<style>' + fontCss + '</style>' : '') +
      '<path id="' + id + 't" d="M250 250m-186 0a186 186 0 1 1 372 0"/>' +
      '<path id="' + id + 'b" d="M250 250m-202 0a202 202 0 0 0 404 0"/>' +
      '<filter id="' + id + 'sh" x="-10%" y="-10%" width="120%" height="120%"><feDropShadow dx="0" dy="6" stdDeviation="7" flood-color="#1D2840" flood-opacity=".28"/></filter>' +
      '<radialGradient id="' + id + 'g" cx="38%" cy="30%" r="80%"><stop offset="0" stop-color="#fff" stop-opacity=".22"/><stop offset=".55" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".12"/></radialGradient>' +
      '<radialGradient id="' + id + 'ball" cx="38%" cy="32%" r="72%"><stop offset="0" stop-color="#F2F78A"/><stop offset=".6" stop-color="#D9E33B"/><stop offset="1" stop-color="#8E9A12"/></radialGradient></defs>';
    // die-cut white border and the club band
    s += '<circle cx="250" cy="250" r="242" fill="#FFFFFF" filter="url(#' + id + 'sh)"/>';
    s += '<circle cx="250" cy="250" r="226" fill="' + f.band + '"/>';
    s += '<circle cx="250" cy="250" r="217" fill="none" stroke="' + f.acc + '" stroke-width="1.6" stroke-dasharray="5 4" opacity=".9"/>';
    s += '<circle cx="250" cy="250" r="158" fill="none" stroke="' + f.acc + '" stroke-width="2.4"/>';
    // band type
    s += '<text font-family="DM Sans, sans-serif" font-weight="700" font-size="25" letter-spacing="9" fill="' + f.bandInk + '"><textPath href="#' + id + 't" xlink:href="#' + id + 't" startOffset="50%" text-anchor="middle">FOUNDING DINKER</textPath></text>';
    s += '<text font-family="DM Sans, sans-serif" font-weight="700" font-size="13" letter-spacing="6" fill="' + f.acc + '"><textPath href="#' + id + 'b" xlink:href="#' + id + 'b" startOffset="50%" text-anchor="middle">DINK DIFFERENT · DOHA · MMXXVI</textPath></text>';
    // star separators on the band
    [[-1, 0], [1, 0]].forEach(function (d) { var x = 250 + d[0] * 192, y = 250; s += '<path transform="translate(' + x + " " + y + ')" d="M0 -7 L2 -2 L7 -2 L3 1.4 L4.6 7 L0 3.6 L-4.6 7 L-3 1.4 L-7 -2 L-2 -2Z" fill="' + f.acc + '"/>'; });
    // field
    s += '<circle cx="250" cy="250" r="152" fill="' + f.field + '"/>';
    // 48 seats: ticks round the field, yours is the ball
    var mine = Math.max(1, Math.min(48, parseInt(p.no, 10) || 0));
    for (var i = 1; i <= 48; i++) {
      var a = (-90 + (i - 1) * 7.5) * Math.PI / 180, me = p.no && i === mine;
      if (me) s += '<circle cx="' + (250 + Math.cos(a) * 141).toFixed(1) + '" cy="' + (250 + Math.sin(a) * 141).toFixed(1) + '" r="6.4" fill="url(#' + id + 'ball)" stroke="' + f.field + '" stroke-width="1.5"/>';
      else s += '<line x1="' + (250 + Math.cos(a) * 137).toFixed(1) + '" y1="' + (250 + Math.sin(a) * 137).toFixed(1) + '" x2="' + (250 + Math.cos(a) * 145).toFixed(1) + '" y2="' + (250 + Math.sin(a) * 145).toFixed(1) + '" stroke="' + f.fieldInk + '" stroke-width="1.6" opacity=".45"/>';
    }
    // laurels
    s += laurel(250, 262, 112, 2.25, 3.95, f.rib === "#F4EFE3" ? f.acc : f.rib, false);
    s += laurel(250, 262, 112, 0.89, -0.81, f.rib === "#F4EFE3" ? f.acc : f.rib, true);
    // the mark
    s += '<g transform="translate(222 140) scale(.28)" fill="' + f.fieldInk + '" fill-rule="evenodd">' + MARK + '</g>';
    // the number
    s += '<text x="250" y="219" text-anchor="middle" font-family="DM Sans, sans-serif" font-weight="700" font-size="12" letter-spacing="5" fill="' + f.fieldInk + '" opacity=".75">Nº</text>';
    s += '<text x="250" y="292" text-anchor="middle" font-family="Fraunces, Georgia, serif" font-weight="700" font-size="' + (no === "WL" ? 66 : 82) + '" letter-spacing="-2" fill="' + f.fieldInk + '">' + no + '</text>';
    s += '<text x="250" y="311" text-anchor="middle" font-family="DM Sans, sans-serif" font-weight="700" font-size="11" letter-spacing="5" fill="' + f.fieldInk + '" opacity=".7">' + (p.no ? "OF 48" : "WAITLIST") + '</text>';
    // ribbon with the name
    var fs = first.length > 9 ? 19 : first.length > 6 ? 23 : 27;
    s += '<g transform="translate(250 352)">' +
      '<path d="M-150 -6 L-118 -6 L-118 26 L-150 26 L-136 10 Z" fill="' + f.ribDk + '"/><path d="M150 -6 L118 -6 L118 26 L150 26 L136 10 Z" fill="' + f.ribDk + '"/>' +
      '<path d="M-118 26 L-104 16 L-104 26Z M118 26 L104 16 L104 26Z" fill="#000" opacity=".25"/>' +
      '<path d="M-118 -20 Q0 -34 118 -20 L118 16 Q0 2 -118 16 Z" fill="' + f.rib + '"/>' +
      '<path d="M-112 -14 Q0 -27 112 -14" fill="none" stroke="' + f.ribInk + '" stroke-width="1" stroke-dasharray="3 3" opacity=".5"/>' +
      '<text y="7" text-anchor="middle" font-family="Fraunces, Georgia, serif" font-weight="700" font-size="' + fs + '" letter-spacing="2" fill="' + f.ribInk + '">' + esc(first) + '</text></g>';
    // soft gloss
    s += '<circle cx="250" cy="250" r="226" fill="url(#' + id + 'g)"/>';
    s += '</svg>';
    return { svg: s, finish: f.label };
  }

  var cache = {};
  function b64(url, type) {
    if (cache[url]) return cache[url];
    return (cache[url] = fetch(url).then(function (r) { return r.arrayBuffer(); }).then(function (buf) {
      var bin = "", u = new Uint8Array(buf);
      for (var i = 0; i < u.length; i += 0x8000) bin += String.fromCharCode.apply(null, u.subarray(i, i + 0x8000));
      return "data:" + type + ";base64," + btoa(bin);
    }));
  }
  // Self-contained PNG (logo and fonts embedded) for saving to the phone.
  function png(p, size) {
    size = size || 1500;
    return Promise.all([b64("/assets/logo.svg", "image/svg+xml"), b64("/assets/fonts/fraunces-normal.woff2", "font/woff2"), b64("/assets/fonts/dm-sans-700.woff2", "font/woff2")]).then(function (d) {
      var css = '@font-face{font-family:Fraunces;font-weight:700;src:url(' + d[1] + ')}@font-face{font-family:"DM Sans";font-weight:700;src:url(' + d[2] + ')}';
      var markup = svg(p, d[0], css).svg;
      return new Promise(function (ok, no) {
        var img = new Image();
        img.onload = function () {
          var c = document.createElement("canvas"); c.width = c.height = size;
          c.getContext("2d").drawImage(img, 0, 0, size, size);
          c.toBlob(function (b) { b ? ok(b) : no(new Error("Could not save")); }, "image/png");
        };
        img.onerror = no;
        img.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(markup);
      });
    });
  }
  window.Sticker = { svg: svg, png: png };
})();
