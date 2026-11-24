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
    { key: "navy", label: "Club Navy", bg: "#1D2840", ring: "#222E4A", ink: "#F4EFE3", acc: "#C9A86B", plate: "#C9A86B", plateInk: "#1D2840" },
    { key: "brass", label: "Brass", bg: "#9C7A45", ring: "#A6844E", ink: "#FBF7EF", acc: "#1D2840", plate: "#1D2840", plateInk: "#F4EFE3" },
    { key: "oatmeal", label: "Oatmeal", bg: "#EDE4D3", ring: "#F4EDE0", ink: "#1D2840", acc: "#9C7A45", plate: "#1D2840", plateInk: "#F4EFE3" },
    { key: "camel", label: "Camel", bg: "#B89B72", ring: "#C2A67D", ink: "#1D2840", acc: "#F4EFE3", plate: "#F4EFE3", plateInk: "#1D2840" },
  ];
  var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); };

  function svg(p, logoHref, fontCss) {
    var name = String(p.name || "Dinker").trim(), first = name.split(/\s+/)[0].toUpperCase().slice(0, 12);
    var rnd = seed(name.toLowerCase() + "|" + (p.no || 0) + "|" + (p.code || ""));
    var f = FIN[Math.floor(rnd() * FIN.length)], id = "st" + Math.floor(rnd() * 1e9);
    var no = p.no ? String(p.no).padStart(2, "0") : "WL";
    var s = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 500 500" role="img" aria-label="Founding Dinker sticker number ' + no + ' for ' + esc(name) + '">';
    s += '<defs>' + (fontCss ? '<style>' + fontCss + '</style>' : '') +
      '<path id="' + id + 't" d="M250 250m-178 0a178 178 0 1 1 356 0"/>' +
      '<path id="' + id + 'b" d="M250 250m-196 0a196 196 0 0 0 392 0"/>' +
      '<filter id="' + id + 'sh" x="-10%" y="-10%" width="120%" height="120%"><feDropShadow dx="0" dy="6" stdDeviation="7" flood-color="#1D2840" flood-opacity=".28"/></filter>' +
      '<clipPath id="' + id + 'c"><circle cx="250" cy="250" r="222"/></clipPath></defs>';
    // die-cut white border
    s += '<circle cx="250" cy="250" r="240" fill="#FFFFFF" filter="url(#' + id + 'sh)"/>';
    s += '<g clip-path="url(#' + id + 'c)"><circle cx="250" cy="250" r="222" fill="' + f.bg + '"/>';
    // engraved rings and 48 seat dots, one per founding member: yours is the ball
    s += '<circle cx="250" cy="250" r="212" fill="none" stroke="' + f.acc + '" stroke-width="1.6" opacity=".85"/><circle cx="250" cy="250" r="160" fill="none" stroke="' + f.acc + '" stroke-width="1.2" opacity=".7"/>';
    var mine = Math.max(1, Math.min(48, parseInt(p.no, 10) || 0));
    for (var i = 1; i <= 48; i++) {
      var a = (-90 + (i - 1) * 7.5) * Math.PI / 180, x = 250 + Math.cos(a) * 168, y = 250 + Math.sin(a) * 168, me = p.no && i === mine;
      s += '<circle cx="' + x.toFixed(1) + '" cy="' + y.toFixed(1) + '" r="' + (me ? 5.2 : 1.9) + '" fill="' + (me ? "#E3CF7E" : f.acc) + '"' + (me ? ' stroke="' + f.bg + '" stroke-width="1.4"' : ' opacity=".7"') + '/>';
    }
    // inner disc
    s += '<circle cx="250" cy="250" r="150" fill="' + f.ring + '"/></g>';
    // curved type
    s += '<text font-family="Fraunces, Georgia, serif" font-weight="800" font-size="24" letter-spacing="6" fill="' + f.ink + '"><textPath href="#' + id + 't" xlink:href="#' + id + 't" startOffset="50%" text-anchor="middle">FOUNDING DINKER</textPath></text>';
    s += '<text font-family="DM Sans, sans-serif" font-weight="700" font-size="13" letter-spacing="5" fill="' + f.acc + '"><textPath href="#' + id + 'b" xlink:href="#' + id + 'b" startOffset="50%" text-anchor="middle">DINK DIFFERENT · THE FIRST SERVE</textPath></text>';
    // the Different D, drawn in the finish's ink
    s += '<g transform="translate(193 120) scale(.57)"><g fill="' + f.ink + '" fill-rule="evenodd"><path d="M104 44h20a56 56 0 0 1 0 112h-20zM119 62h5a27 38 0 0 1 0 76h-5z"/><path d="M96 44H76a56 56 0 0 0 0 112h20zM81 62h-5a27 38 0 0 0 0 76h5z"/></g><path d="M100 36v128" stroke="' + f.acc + '" stroke-width="3.4" stroke-linecap="round"/><circle cx="134" cy="32" r="9" fill="#E3CF7E"/></g>';
    // name
    s += '<text x="250" y="312" text-anchor="middle" font-family="Fraunces, Georgia, serif" font-weight="800" font-size="' + (first.length > 8 ? 34 : 42) + '" fill="' + f.ink + '">' + esc(first) + '</text>';
    // number plate
    s += '<g transform="translate(250 352)"><rect x="-62" y="-22" width="124" height="44" rx="22" fill="' + f.plate + '"/>' +
      '<text y="9" text-anchor="middle" font-family="Fraunces, sans-serif" font-weight="700" font-size="26" fill="' + f.plateInk + '">Nº ' + no + '<tspan font-size="14" opacity=".7" dx="4">/48</tspan></text></g>';
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
