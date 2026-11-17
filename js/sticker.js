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
    { key: "choco", label: "Choco", bg: "#3B2416", ring: "#4E3222", ink: "#FFF6EA", acc: "#FF5FA2", plate: "#D7F03C", plateInk: "#3B2416" },
    { key: "glaze", label: "Glaze", bg: "#FF5FA2", ring: "#F24C93", ink: "#FFF6EA", acc: "#3B2416", plate: "#3B2416", plateInk: "#FFF6EA" },
    { key: "court", label: "Court", bg: "#2F7A4F", ring: "#286B45", ink: "#FFF6EA", acc: "#D7F03C", plate: "#FF5FA2", plateInk: "#FFFFFF" },
    { key: "cream", label: "Cream", bg: "#FFF6EA", ring: "#F6E6D0", ink: "#3B2416", acc: "#FF5FA2", plate: "#3B2416", plateInk: "#D7F03C" },
  ];
  var SPR = ["#FF5FA2", "#D7F03C", "#FFF6EA", "#E8A95B", "#2F7A4F", "#7FD3FF"];
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
      '<filter id="' + id + 'sh" x="-10%" y="-10%" width="120%" height="120%"><feDropShadow dx="0" dy="6" stdDeviation="7" flood-color="#3B2416" flood-opacity=".28"/></filter>' +
      '<clipPath id="' + id + 'c"><circle cx="250" cy="250" r="222"/></clipPath></defs>';
    // die-cut white border
    s += '<circle cx="250" cy="250" r="240" fill="#FFFFFF" filter="url(#' + id + 'sh)"/>';
    s += '<g clip-path="url(#' + id + 'c)"><circle cx="250" cy="250" r="222" fill="' + f.bg + '"/>';
    // seeded sprinkle field in the outer band
    for (var i = 0; i < 30; i++) {
      var a = ((i % 2 ? 180 : 0) + (rnd() - .5) * 52) * Math.PI / 180, r = 154 + rnd() * 62, x = 250 + Math.cos(a) * r, y = 250 + Math.sin(a) * r;
      var c = SPR[Math.floor(rnd() * SPR.length)];
      if (c.toLowerCase() === f.bg.toLowerCase()) c = f.acc;
      s += '<rect x="' + (x - 7).toFixed(1) + '" y="' + (y - 2.4).toFixed(1) + '" width="14" height="4.8" rx="2.4" fill="' + c + '" opacity=".9" transform="rotate(' + Math.floor(rnd() * 180) + ' ' + x.toFixed(1) + ' ' + y.toFixed(1) + ')"/>';
    }
    // inner disc
    s += '<circle cx="250" cy="250" r="150" fill="' + f.ring + '"/><circle cx="250" cy="250" r="150" fill="none" stroke="' + f.ink + '" stroke-opacity=".18" stroke-width="2" stroke-dasharray="2 7"/></g>';
    // curved type
    s += '<text font-family="DM Sans, sans-serif" font-weight="700" font-size="22" letter-spacing="7" fill="' + f.ink + '"><textPath href="#' + id + 't" xlink:href="#' + id + 't" startOffset="50%" text-anchor="middle">FOUNDING DINKER</textPath></text>';
    s += '<text font-family="DM Sans, sans-serif" font-weight="700" font-size="14" letter-spacing="5" fill="' + f.ink + '" opacity=".8"><textPath href="#' + id + 'b" xlink:href="#' + id + 'b" startOffset="50%" text-anchor="middle">THE FIRST SERVE · OPEN PLAY 001</textPath></text>';
    // logo
    if (logoHref) s += '<image href="' + logoHref + '" xlink:href="' + logoHref + '" x="180" y="128" width="140" height="140"/>';
    // name
    s += '<text x="250" y="312" text-anchor="middle" font-family="Fredoka, sans-serif" font-weight="700" font-size="' + (first.length > 8 ? 34 : 42) + '" fill="' + f.ink + '">' + esc(first) + '</text>';
    // number plate
    s += '<g transform="translate(250 352)"><rect x="-62" y="-22" width="124" height="44" rx="22" fill="' + f.plate + '"/>' +
      '<text y="9" text-anchor="middle" font-family="Fredoka, sans-serif" font-weight="700" font-size="26" fill="' + f.plateInk + '">Nº ' + no + '<tspan font-size="14" opacity=".7" dx="4">/48</tspan></text></g>';
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
    return Promise.all([b64("/assets/logo.svg", "image/svg+xml"), b64("/assets/fonts/fredoka-700.woff2", "font/woff2"), b64("/assets/fonts/dm-sans-700.woff2", "font/woff2")]).then(function (d) {
      var css = '@font-face{font-family:Fredoka;font-weight:700;src:url(' + d[1] + ')}@font-face{font-family:"DM Sans";font-weight:700;src:url(' + d[2] + ')}';
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
