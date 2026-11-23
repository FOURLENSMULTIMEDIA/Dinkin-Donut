// Club Icons: Dink Different's own icon set.
// One grid (24), rounded 1.9 strokes in currentColor, and a signature accent on every icon:
// a brass club stud, or a brass rule. DDIcon(name, size) returns inline SVG.
(function () {
  var donut = function (x, y, r) { r = (r || 2.6) * 0.78; return '<circle cx="' + x + '" cy="' + y + '" r="' + r + '" style="stroke:none;fill:var(--glaze,#9C7A45)"/><circle cx="' + x + '" cy="' + y + '" r="' + (r + 1.1) + '" fill="none" style="stroke:var(--glaze,#9C7A45)" stroke-width=".7" opacity=".55"/>'; };
  var drip = function (x, y, w) { w = w || 5; return '<rect x="' + x + '" y="' + (y + 0.6) + '" width="' + w + '" height="1.5" rx=".75" style="stroke:none;fill:var(--glaze,#9C7A45)"/>'; };
  var dot = function (x, y, r, c) { return '<circle cx="' + x + '" cy="' + y + '" r="' + (r || 1.3) + '" style="stroke:none;fill:' + (c || "var(--glaze,#9C7A45)") + '"/>'; };
  var I = {
    queue: ["M9 6.5h11M9 12h11M9 17.5h7", donut(4.6, 6.5, 2.4) + dot(4.6, 12, 1.4, "currentColor") + dot(4.6, 17.5, 1.4, "currentColor")],
    courts: ["M3 5.5h18v13H3zM12 5.5v13M8.5 5.5v13M15.5 5.5v13", dot(18.2, 9, 1.5, "var(--ball,#E2D2A6)") + drip(3.6, 5.5, 4.8)],
    academy: ["M8.5 2.8h5a5 5 0 0 1 5 5v2.8a5 5 0 0 1-5 5h-5a5 5 0 0 1-5-5V7.8a5 5 0 0 1 5-5zM11 15.6v5.6", '<path style="stroke:none;fill:var(--glaze,#9C7A45)" d="M9.4 6.6l4.8 2.6-4.8 2.6z"/>'],
    home: ["M3.5 11 12 4l8.5 7v9h-17zM9 20v-5.5", donut(14.2, 15, 2.5)],
    drills: ["M12 7.5a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13zM12 11v3l2 1.4M9.5 3.2h5M12 3.2v4.3M17.8 7l1.4-1.4", drip(9.5, 3.2, 5)],
    timer: ["M12 7.5a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13zM12 11v3l2 1.4M9.5 3.2h5M12 3.2v4.3", drip(9.5, 3.2, 5)],
    rules: ["M4 4.5h6.5a2.8 2.8 0 0 1 2.8 2.8v12.2a2.2 2.2 0 0 0-2.2-2.2H4zM20 4.5h-3.2a2.8 2.8 0 0 0-2.8 2.8M20 4.5v13h-5", donut(7.4, 10.4, 2.1)],
    tips: ["M9.3 17.4h5.4M10.2 20.6h3.6M12 3.2a6 6 0 0 0-3.6 10.8c.6.5 1 1.2 1 2.1h5.2c0-.9.4-1.6 1-2.1A6 6 0 0 0 12 3.2z", drip(9.6, 8.6, 4.8)],
    trophy: ["M7 3.8h10v4.4a5 5 0 0 1-10 0zM7 5.8H4.2v1.1A3.2 3.2 0 0 0 7 10M17 5.8h2.8v1.1A3.2 3.2 0 0 1 17 10M12 13.2v3.8M8.2 20.6h7.6M9.8 17h4.4v3.6", donut(12, 7.6, 2.2)],
    shop: ["M5.2 8.2h13.6l-1.1 12.2H6.3zM9 8.2V6.5a3 3 0 0 1 6 0v1.7", drip(9.2, 8.2, 5.6) + dot(12, 14.6, 1.6, "var(--ball,#E2D2A6)")],
    card: ["M3 6h18v12H3zM3 10h18M6 15h5", donut(17, 14.6, 2.2)],
    host: ["M3.8 11.5a4.8 4.8 0 1 0 9.6 0h7.2V8.2H8.6M15.4 8.2V6", dot(8.6, 11.5, 1.6) + drip(15.6, 8.2, 5)],
    tv: ["M3 4.8h18v12H3zM8.5 20.6h7M12 16.8v3.8", '<path d="M6.5 13.5q4-6.5 9-3.4" fill="none" style="stroke:var(--glaze,#9C7A45)" stroke-width="1.9" stroke-linecap="round"/>' + dot(15.8, 10.2, 1.5, "var(--ball,#E2D2A6)")],
    install: ["M7.5 2.6h9a1.5 1.5 0 0 1 1.5 1.5v15.8a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 6 19.9V4.1a1.5 1.5 0 0 1 1.5-1.5zM10.8 18.2h2.4", donut(12, 10.2, 3)],
    offline: ["M7 18.2h10a4 4 0 0 0 .4-8A6 6 0 0 0 6 9.4a4.4 4.4 0 0 0 1 8.8zM3.6 3.6l16.8 16.8", dot(12, 12.6, 1.5)],
    tournament: ["M3 5h4v4H3zM3 15h4v4H3zM7 7h3v10H7M10 12h4M17 9h4v6h-4zM14 12h3", donut(19, 12, 1.9)],
    calendar: ["M4 5.5h16v14.5H4zM4 9.8h16M8.5 3.5v3.8M15.5 3.5v3.8", donut(12, 14.6, 2.3)],
    lock: ["M6 10.6h12v9.4H6zM8.6 10.6V8a3.4 3.4 0 0 1 6.8 0v2.6", donut(12, 15.2, 2)],
    play: ["M7 4.6v14.8l11.4-7.4z", ""],
    check: ["M4.6 12.6l4.4 4.4 10.4-10.4", dot(19.4, 6.6, 1.5)],
    star: ["M12 3.4l2.6 5.3 5.8.8-4.2 4.1 1 5.8L12 16.7l-5.2 2.7 1-5.8-4.2-4.1 5.8-.8z", donut(12, 11.9, 1.9)],
    coach: ["M12 3.4a3.4 3.4 0 1 0 0 6.8 3.4 3.4 0 0 0 0-6.8zM5 20.6c0-3.9 3.1-7 7-7s7 3.1 7 7", drip(9.6, 13.6, 4.8)],
    cues: ["M4 5h16v10.4H9.4L5.6 19v-3.6H4z", dot(9, 10.2, 1.3) + dot(12, 10.2, 1.3) + dot(15, 10.2, 1.3)],
    // Home Court kit
    paddle: ["M8.6 2.8h5a4.8 4.8 0 0 1 4.8 4.8v3a4.8 4.8 0 0 1-4.8 4.8h-5a4.8 4.8 0 0 1-4.8-4.8v-3a4.8 4.8 0 0 1 4.8-4.8zM11.1 15.4v5.8", donut(11.1, 9.1, 2.4)],
    ball: ["M12 3.4a8.6 8.6 0 1 0 0 17.2 8.6 8.6 0 0 0 0-17.2z", dot(9, 9, 1.4, "currentColor") + dot(14.6, 9.8, 1.4, "currentColor") + dot(11, 14.6, 1.4, "currentColor") + dot(15.4, 15, 1.2, "var(--glaze,#9C7A45)")],
    wall: ["M3 4.5h18v15H3zM3 9.5h18M3 14.5h18M9 4.5v5M15 9.5v5M9 14.5v5", '<path d="M3 12h18" style="stroke:var(--ball,#E2D2A6)" stroke-width="2.2"/>'],
    tape: ["M12 4.4a7.6 7.6 0 1 0 0 15.2 7.6 7.6 0 0 0 0-15.2zM12 8.8a3.2 3.2 0 1 0 0 6.4 3.2 3.2 0 0 0 0-6.4zM19.6 12h2.4", '<path d="M19.6 12v6.4" style="stroke:var(--ball,#E2D2A6)" stroke-width="2.2" stroke-linecap="round"/>'],
    chairs: ["M5 3.4v17.2M5 12.2h7.6v8.4M5 7.8h7.6M12.6 7.8v4.4M15.2 9.4h6", drip(15.2, 9.4, 6)],
    towel: ["M4 6h16v12H4zM4 10.2h16", drip(4, 6, 5) + drip(15, 6, 5)],
    mirror: ["M6.4 2.6h11.2v18.8H6.4zM9.6 7.6l4-3M9.6 12l6-5", dot(12, 17.6, 1.4)],
    helper: ["M12 3.6a3.4 3.4 0 1 0 0 6.8 3.4 3.4 0 0 0 0-6.8zM5 20.6c0-3.9 3.1-7 7-7s7 3.1 7 7", dot(18.6, 6, 1.8, "var(--ball,#E2D2A6)")],
    outdoor: ["M3 20.4h18M6 20.4l3-8.4h6l3 8.4M12 3.6v4M8.4 5.2l1.4 1.4M15.6 5.2l-1.4 1.4", dot(12, 8.8, 1.6, "var(--ball,#E2D2A6)")],
  };
  window.DDIcon = function (name, size) {
    var g = I[name] || I.ball, s = size || 20;
    return '<svg class="ddi" width="' + s + '" height="' + s + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="' + g[0] + '"/>' + g[1] + "</svg>";
  };
  window.DDIcon.names = Object.keys(I);
  // Any element with data-ddi="name" gets its icon
  function paint(root) { (root || document).querySelectorAll("[data-ddi]:not([data-ddi-done])").forEach(function (el) { el.insertAdjacentHTML("afterbegin", window.DDIcon(el.getAttribute("data-ddi"), Number(el.getAttribute("data-ddi-size")) || undefined)); el.setAttribute("data-ddi-done", ""); }); }
  window.DDIcon.paint = paint;
  if (document.readyState !== "loading") paint(); else document.addEventListener("DOMContentLoaded", function () { paint(); });
})();
