// Homepage court show: an endless rally on a pickleball court in perspective. The ball is the club mark.
(function () {
  var cv = document.getElementById("courtshow"); if (!cv) return;
  var x = cv.getContext("2d"), W = 0, H = 0, DPR = Math.min(2, window.devicePixelRatio || 1);
  var ball = new Image(); ball.src = "/assets/logo.svg";
  var KITCHEN = 7 / 44, NET = 0.5;

  function size() { var r = cv.getBoundingClientRect(); W = r.width; H = r.height; cv.width = W * DPR; cv.height = H * DPR; x.setTransform(DPR, 0, 0, DPR, 0, 0); }
  window.addEventListener("resize", size); size();

  // World: x in [-1, 1] across, z in [0, 1] from the near baseline to the far one, h = height above court
  function P(wx, z, h) {
    var tall = H > W, horizon = H * (tall ? 0.5 : 0.16), yNear = H * (tall ? 0.97 : 0.93), d = 1 + z * 1.75;
    var y = horizon + (yNear - horizon) / d, half = Math.min(W * (tall ? 0.46 : 0.42), H * 0.62) / d;
    return { x: W / 2 + wx * half, y: y - (h || 0) * H * (tall ? 0.26 : 0.42) / d, s: 1 / d };
  }
  function line(a, b, w, c) { x.beginPath(); x.moveTo(a.x, a.y); x.lineTo(b.x, b.y); x.lineWidth = w; x.strokeStyle = c; x.stroke(); }
  function quad(pts, fill) { x.beginPath(); pts.forEach(function (p, i) { i ? x.lineTo(p.x, p.y) : x.moveTo(p.x, p.y); }); x.closePath(); x.fillStyle = fill; x.fill(); }

  function court() {
    var g = x.createLinearGradient(0, 0, 0, H); g.addColorStop(0, "#1A110B"); g.addColorStop(1, "#2B1C12"); x.fillStyle = g; x.fillRect(0, 0, W, H);
    // stadium lights
    [[0.18, 0.02], [0.82, 0.02]].forEach(function (l) { var rg = x.createRadialGradient(W * l[0], H * l[1], 0, W * l[0], H * l[1], W * 0.45); rg.addColorStop(0, "rgba(255,246,234,.22)"); rg.addColorStop(1, "rgba(255,246,234,0)"); x.fillStyle = rg; x.fillRect(0, 0, W, H); });
    quad([P(-1.35, -0.06), P(1.35, -0.06), P(1.35, 1.06), P(-1.35, 1.06)], "#235E3C");
    quad([P(-1, 0), P(1, 0), P(1, 1), P(-1, 1)], "#2F7A4F");
    quad([P(-1, NET - KITCHEN), P(1, NET - KITCHEN), P(1, NET + KITCHEN), P(-1, NET + KITCHEN)], "rgba(215,240,60,.18)");
    var c = "#FFF6EA";
    [[-1, 0, -1, 1], [1, 0, 1, 1], [-1, 0, 1, 0], [-1, 1, 1, 1], [-1, NET - KITCHEN, 1, NET - KITCHEN], [-1, NET + KITCHEN, 1, NET + KITCHEN], [0, 0, 0, NET - KITCHEN], [0, NET + KITCHEN, 0, 1]]
      .forEach(function (l) { var a = P(l[0], l[1]), b = P(l[2], l[3]); line(a, b, Math.max(1.5, 3.2 * (a.s + b.s) / 2), c); });
  }
  function net() {
    var a = P(-1.12, NET), b = P(1.12, NET), at = P(-1.12, NET, 0.2), bt = P(1.12, NET, 0.2);
    quad([a, b, bt, at], "rgba(26,17,11,.55)");
    x.save(); x.beginPath(); x.moveTo(a.x, a.y); x.lineTo(b.x, b.y); x.lineTo(bt.x, bt.y); x.lineTo(at.x, at.y); x.closePath(); x.clip();
    x.strokeStyle = "rgba(255,246,234,.12)"; x.lineWidth = 1; for (var i = 0; i < 70; i++) { var p = i / 70; line({ x: a.x + (b.x - a.x) * p, y: a.y }, { x: at.x + (bt.x - at.x) * p, y: at.y }, 1, "rgba(255,246,234,.12)"); }
    x.restore();
    line(at, bt, 4 * a.s, "#FFF6EA"); line(a, at, 5 * a.s, "#3B2416"); line(b, bt, 5 * a.s, "#3B2416");
  }
  function paddle(p, face, tilt) {
    var s = p.s * Math.min(W, H) * 0.19;
    x.save(); x.translate(p.x, p.y); x.rotate(tilt);
    x.fillStyle = "rgba(0,0,0,.25)"; x.beginPath(); x.ellipse(4, 6, s * 0.36, s * 0.46, 0, 0, 6.29); x.fill();
    x.fillStyle = "#3B2416"; x.beginPath(); x.roundRect(-s * 0.07, s * 0.28, s * 0.14, s * 0.42, s * 0.04); x.fill();
    x.fillStyle = face; x.beginPath(); x.roundRect(-s * 0.34, -s * 0.46, s * 0.68, s * 0.8, s * 0.3); x.fill();
    x.lineWidth = s * 0.05; x.strokeStyle = "#3B2416"; x.stroke();
    x.restore();
  }

  // Rally: each shot = hit -> bounce in the opponent's kitchen (or deep) -> return
  var shots = [], t0 = performance.now(), trail = [], bursts = [], near = { x: 0 }, far = { x: 0 };
  function newShot(fromNear, prevTo) {
    var kind = Math.random() < 0.72 ? "dink" : Math.random() < 0.5 ? "drive" : "lob";
    var fromZ = fromNear ? 0.06 : 0.94, sign = fromNear ? 1 : -1;
    var from = prevTo || { x: (Math.random() - 0.5) * 1.2, z: fromZ };
    var bz = kind === "dink" ? NET + sign * (0.05 + Math.random() * 0.09) : NET + sign * (0.25 + Math.random() * 0.15);
    var bounce = { x: Math.max(-0.85, Math.min(0.85, from.x * 0.3 + (Math.random() - 0.5) * 1.3)), z: bz };
    var to = { x: Math.max(-0.9, Math.min(0.9, bounce.x + (Math.random() - 0.5) * 0.3)), z: kind === "dink" ? NET + sign * 0.2 : 1 - fromZ };
    if (!fromNear) to.z = kind === "dink" ? NET - 0.2 : 0.06;
    return { kind: kind, from: from, bounce: bounce, to: to, d1: kind === "dink" ? 950 : kind === "lob" ? 1300 : 620, d2: kind === "dink" ? 360 : 300, peak: kind === "dink" ? 0.42 : kind === "lob" ? 1.35 : 0.3, fromNear: fromNear };
  }
  var shot = newShot(true), shotStart = performance.now();
  function lerp(a, b, t) { return a + (b - a) * t; }
  function ballAt(sh, el) {
    if (el < sh.d1) { var t = el / sh.d1; return { x: lerp(sh.from.x, sh.bounce.x, t), z: lerp(sh.from.z, sh.bounce.z, t), h: 0.12 * (1 - t) + Math.sin(Math.PI * t) * sh.peak }; }
    var u = Math.min(1, (el - sh.d1) / sh.d2); return { x: lerp(sh.bounce.x, sh.to.x, u), z: lerp(sh.bounce.z, sh.to.z, u), h: Math.sin(Math.PI * u * 0.5) * 0.16 };
  }
  function burst(p) { for (var i = 0; i < 12; i++) bursts.push({ x: p.x, y: p.y, vx: (Math.random() - 0.5) * 6, vy: -Math.random() * 5 - 1, r: Math.random() * 6.28, c: ["#FF5FA2", "#D7F03C", "#E8A95B", "#FFF6EA"][i % 4], life: 1 }); }

  var visible = true, reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  function frame(now) {
    var el = now - shotStart;
    if (el > shot.d1 + shot.d2) { var p = P(shot.to.x, shot.to.z, 0.16); burst(p); shot = newShot(!shot.fromNear, shot.to); shotStart = now; el = 0; }
    var b = ballAt(shot, el);
    // paddles track the ball's landing side
    var nearTarget = shot.fromNear ? shot.from.x : shot.to.x, farTarget = shot.fromNear ? shot.to.x : shot.from.x;
    near.x += (nearTarget - near.x) * 0.08; far.x += (farTarget - far.x) * 0.08;
    court();
    var nz = shot.fromNear ? shot.from.z : shot.to.z, fz = shot.fromNear ? shot.to.z : shot.from.z;
    paddle(P(far.x + 0.08, fz, 0.32), "#D7F03C", 0.25);
    // shadow + ball (draw order by depth: far paddle, ball if beyond net, net, ball if near)
    var bp = P(b.x, b.z, b.h), sp = P(b.x, b.z, 0), r = Math.max(6, bp.s * Math.min(W, H) * 0.075);
    function drawBall() {
      x.fillStyle = "rgba(0,0,0,.35)"; x.beginPath(); x.ellipse(sp.x, sp.y, r * 0.9, r * 0.32, 0, 0, 6.29); x.fill();
      trail.push({ x: bp.x, y: bp.y, r: r }); if (trail.length > 14) trail.shift();
      trail.forEach(function (t, i) { x.fillStyle = "rgba(255,95,162," + (i / trail.length * 0.35) + ")"; x.beginPath(); x.arc(t.x, t.y, t.r * (0.3 + i / trail.length * 0.5), 0, 6.29); x.fill(); });
      x.save(); x.translate(bp.x, bp.y); x.rotate(now / 260); if (ball.complete) x.drawImage(ball, -r, -r, r * 2, r * 2); x.restore();
    }
    if (b.z > NET) { drawBall(); net(); } else { net(); drawBall(); }
    paddle(P(near.x - 0.08, nz, 0.32), "#FF5FA2", -0.25);
    bursts = bursts.filter(function (q) { q.x += q.vx; q.y += q.vy; q.vy += 0.25; q.life -= 0.025; q.r += 0.1;
      x.save(); x.globalAlpha = Math.max(0, q.life); x.translate(q.x, q.y); x.rotate(q.r); x.fillStyle = q.c; x.beginPath(); x.roundRect(-7, -2.5, 14, 5, 2.5); x.fill(); x.restore(); return q.life > 0; });
    if (visible && !reduce) requestAnimationFrame(frame);
  }
  ball.onload = function () { requestAnimationFrame(frame); };
  if ("IntersectionObserver" in window) new IntersectionObserver(function (es) { var v = es[0].isIntersecting; if (v && !visible && !reduce) { visible = true; shotStart = performance.now(); requestAnimationFrame(frame); } visible = v; }).observe(cv);

  // Taglines
  var lines = document.querySelectorAll("[data-tagline]"), li = 0;
  if (lines.length) setInterval(function () { lines[li].classList.remove("on"); li = (li + 1) % lines.length; lines[li].classList.add("on"); }, 3200);
})();
