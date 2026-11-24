// Soft Hands Academy: X-ray coaching animation engine.
// A lesson is a list of scenes. Each scene animates a camera, X-ray players, a ball flight, court geometry,
// callouts, a measurement panel and a word-by-word caption. Coach.player(canvas, lesson) returns controls.
(function () {
  var PINK = "#9C7A45", LIME = "#E2D2A6", BONE = "#F4EFE3", DIM = "rgba(201,180,138,.75)", GREEN = "#161F33", LINEN = "#C9B48A", CREAM = "#F4EFE3", COURT = "#4C6A8A";
  var FONT = "'DM Sans', system-ui, sans-serif", DISPLAY = "Fraunces, 'DM Sans', system-ui, sans-serif";
  var lerp = function (a, b, t) { return a + (b - a) * t; };
  var ease = function (t) { return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; };
  var clamp = function (x, a, b) { return Math.max(a, Math.min(b, x)); };
  var rad = function (d) { return d * Math.PI / 180; };

  // ---- poses (degrees). lean: torso forward; tF/tB: thigh angles of front/back leg (forward +);
  // kF/kB: knee bend; sh: upper arm (0 = hanging, 90 = straight forward); el: elbow bend; wr: wrist; pd: paddle vs forearm.
  var POSES = {
    stand: { lean: 4, tF: 8, tB: -6, kF: 6, kB: 6, sh: 20, el: 30, wr: 0, pd: 40, off: 10, oel: 40 },
    ready: { lean: 18, tF: 26, tB: -14, kF: 40, kB: 36, sh: 42, el: 62, wr: 6, pd: 70, off: 30, oel: 70 },
    dinkBack: { lean: 22, tF: 30, tB: -16, kF: 48, kB: 40, sh: 8, el: 18, wr: 0, pd: 120, off: 30, oel: 60 },
    dinkThru: { lean: 22, tF: 30, tB: -16, kF: 48, kB: 40, sh: 52, el: 14, wr: 0, pd: 112, off: 30, oel: 60 },
    flickBack: { lean: 22, tF: 30, tB: -16, kF: 48, kB: 40, sh: 14, el: 30, wr: -40, pd: 120, off: 30, oel: 60 },
    flickThru: { lean: 22, tF: 30, tB: -16, kF: 48, kB: 40, sh: 20, el: 40, wr: 70, pd: 120, off: 30, oel: 60 },
    dropBack: { lean: 14, tF: 24, tB: -18, kF: 34, kB: 30, sh: -18, el: 16, wr: 0, pd: 125, off: 34, oel: 50 },
    dropThru: { lean: 14, tF: 24, tB: -18, kF: 34, kB: 30, sh: 70, el: 12, wr: 0, pd: 108, off: 34, oel: 50 },
    serveBack: { lean: 8, tF: 18, tB: -14, kF: 20, kB: 18, sh: -38, el: 10, wr: 0, pd: 150, off: 40, oel: 80 },
    serveThru: { lean: 6, tF: 18, tB: -14, kF: 20, kB: 18, sh: 80, el: 14, wr: 0, pd: 100, off: 40, oel: 80 },
    block: { lean: 16, tF: 28, tB: -16, kF: 44, kB: 38, sh: 58, el: 70, wr: 0, pd: 60, off: 30, oel: 70 },
    attackBack: { lean: 16, tF: 26, tB: -14, kF: 38, kB: 32, sh: 40, el: 110, wr: -20, pd: 70, off: 30, oel: 70 },
    bhBack: { lean: 20, tF: 28, tB: -16, kF: 46, kB: 40, sh: 25, el: -95, wr: 0, pd: 150, off: 50, oel: 40 },
    bhThru: { lean: 20, tF: 28, tB: -16, kF: 46, kB: 40, sh: 60, el: -25, wr: 0, pd: 120, off: 30, oel: 50 },
    overBack: { lean: -6, tF: 14, tB: -16, kF: 14, kB: 16, sh: 165, el: 70, wr: 0, pd: 40, off: 140, oel: 10 },
    overThru: { lean: 16, tF: 22, tB: -12, kF: 24, kB: 20, sh: 95, el: 10, wr: 20, pd: 20, off: 40, oel: 40 },
    bump: { lean: 8, tF: 14, tB: -10, kF: 18, kB: 16, sh: 40, el: 50, wr: 0, pd: 0, off: 20, oel: 40 },
    bumpUp: { lean: 8, tF: 14, tB: -10, kF: 22, kB: 20, sh: 48, el: 42, wr: 0, pd: 0, off: 20, oel: 40 },
    dribble: { lean: 22, tF: 24, tB: -14, kF: 40, kB: 34, sh: 20, el: 60, wr: 10, pd: 0, off: 20, oel: 50 },
    dribbleDn: { lean: 22, tF: 24, tB: -14, kF: 44, kB: 38, sh: 14, el: 60, wr: 10, pd: 0, off: 20, oel: 50 },
    attackThru: { lean: 20, tF: 26, tB: -14, kF: 38, kB: 32, sh: 75, el: 30, wr: 20, pd: 70, off: 30, oel: 70 },
  };
  function mixPose(a, b, t) { var o = {}; for (var k in a) o[k] = lerp(a[k], b[k] != null ? b[k] : a[k], t); return o; }

  // Forward kinematics in feet. Returns joints with y up; dir = 1 faces right.
  function skeleton(p, x, dir) {
    var L = { th: 1.55, sh: 1.5, to: 1.85, ne: 0.32, ua: 1.05, fa: 0.95, ha: 0.24, pdH: 0.42, pdF: 0.95 };
    var leg = function (t, k) { var a = rad(t), kn = [Math.sin(a) * L.th * dir, -Math.cos(a) * L.th], b = rad(t - k); return { knee: kn, foot: [kn[0] + Math.sin(b) * L.sh * dir, kn[1] - Math.cos(b) * L.sh] }; };
    var F = leg(p.tF, p.kF), B = leg(p.tB, p.kB), lift = -Math.min(F.foot[1], B.foot[1]);
    var hip = [x, lift], add = function (a, b) { return [a[0] + b[0], a[1] + b[1]]; };
    var J = { hip: hip, kneeF: add(hip, F.knee), footF: add(hip, F.foot), kneeB: add(hip, B.knee), footB: add(hip, B.foot) };
    var tl = rad(p.lean), chest = add(hip, [Math.sin(tl) * L.to * dir, Math.cos(tl) * L.to]);
    J.chest = chest; J.neck = add(chest, [Math.sin(tl) * L.ne * dir, Math.cos(tl) * L.ne]); J.head = add(J.neck, [Math.sin(tl) * 0.38 * dir, 0.4]);
    J.shoulder = add(chest, [-0.06 * dir, -0.1]);
    var arm = function (s, e, w, pd) {
      var a1 = rad(s - p.lean * 0), el = add(J.shoulder, [Math.sin(a1) * L.ua * dir, -Math.cos(a1) * L.ua]);
      var a2 = a1 + rad(e), wr = add(el, [Math.sin(a2) * L.fa * dir, -Math.cos(a2) * L.fa]);
      var a3 = a2 + rad(w), hand = add(wr, [Math.sin(a3) * L.ha * dir, -Math.cos(a3) * L.ha]);
      var a4 = a3 + rad(pd), base = add(hand, [Math.sin(a4) * L.pdH * dir, -Math.cos(a4) * L.pdH]), tip = add(base, [Math.sin(a4) * L.pdF * dir, -Math.cos(a4) * L.pdF]);
      return { el: el, wr: wr, hand: hand, pBase: base, pTip: tip, pAng: a4 };
    };
    var A = arm(p.sh, p.el, p.wr, p.pd); J.elbow = A.el; J.wrist = A.wr; J.hand = A.hand; J.pBase = A.pBase; J.pTip = A.pTip; J.pAng = A.pAng;
    var oa = rad(p.off), oel = add(J.shoulder, [Math.sin(oa) * L.ua * dir * 0.92, -Math.cos(oa) * L.ua * 0.92]);
    var ob = oa + rad(p.oel); J.oElbow = oel; J.oHand = add(oel, [Math.sin(ob) * L.fa * dir * 0.92, -Math.cos(ob) * L.fa * 0.92]);
    return J;
  }

  function Player(canvas) {
    var ctx = canvas.getContext("2d"), lesson = null, scenes = [], total = 0, t = 0, playing = false, speed = 1, last = 0, onTick = null, raf = 0;
    var W = 0, H = 0, DPR = 1, cam = { x: 0, y: 3, z: 1 };
    function size() {
      var r = canvas.getBoundingClientRect(); DPR = Math.min(2, window.devicePixelRatio || 1);
      W = Math.max(1, r.width); H = Math.max(1, r.height); canvas.width = W * DPR; canvas.height = H * DPR; ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    }
    // world (feet) → screen
    var S = function () { return (Math.max(W, H * 0.75) / 30) * cam.z; };
    var X = function (x) { return W / 2 + (x - cam.x) * S(); };
    var Y = function (y) { return H * 0.6 - (y - cam.y) * S(); };
    var pt = function (p) { return [X(p[0]), Y(p[1])]; };

    function line(a, b, w, col) { ctx.strokeStyle = col || BONE; ctx.lineWidth = w; ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke(); }
    function joint(a, r) { ctx.beginPath(); ctx.arc(a[0], a[1], r, 0, 7); ctx.fillStyle = GREEN; ctx.fill(); ctx.lineWidth = 1.2; ctx.strokeStyle = BONE; ctx.stroke(); }

    function drawCourt(sc, k) {
      var g = Y(0), s = S();
      // floor with perspective lines and the kitchen
      var fg = ctx.createLinearGradient(0, g, 0, H); fg.addColorStop(0, "#4C6A8A"); fg.addColorStop(1, "#2E4566"); ctx.fillStyle = fg; ctx.fillRect(0, g, W, H - g);
      ctx.strokeStyle = "rgba(244,239,227,.55)"; ctx.lineWidth = 1.4;
      [-22, -7, 7, 22].forEach(function (x) { ctx.beginPath(); ctx.moveTo(X(x), g); ctx.lineTo(X(x) + (x - cam.x) * s * 0.18, H); ctx.stroke(); });
      ctx.beginPath(); ctx.moveTo(0, g); ctx.lineTo(W, g); ctx.stroke();
      if (sc.kitchen) {
        var a = sc.kitchen === "both" ? [-7, 7] : sc.kitchen === "left" ? [-7, 0] : [0, 7];
        ctx.fillStyle = "rgba(226,210,166," + (0.16 * k) + ")"; ctx.beginPath(); ctx.moveTo(X(a[0]), g); ctx.lineTo(X(a[1]), g); ctx.lineTo(X(a[1]) + (a[1] - cam.x) * s * 0.18, H); ctx.lineTo(X(a[0]) + (a[0] - cam.x) * s * 0.18, H); ctx.fill();
        ctx.fillStyle = "rgba(226,210,166," + (0.8 * k) + ")"; ctx.font = "600 10px " + FONT; ctx.fillText("KITCHEN \u00B7 7 FT", X(a[0]) + 6, g + 16);
      }
      // net: posts 36 in, centre 34 in (side view shows the centre height)
      var nh = 34 / 12;
      ctx.fillStyle = "rgba(255,255,255,.07)"; ctx.fillRect(X(-0.06), Y(nh), 0.12 * s, nh * s);
      for (var i = 1; i < 9; i++) line([X(-0.06), Y(nh * i / 9)], [X(0.06), Y(nh * i / 9)], 0.6, "rgba(255,255,255,.2)");
      line([X(0), Y(0)], [X(0), Y(36 / 12)], 2.4, "rgba(240,240,240,.8)");
      line([X(-0.25), Y(nh)], [X(0.25), Y(nh)], 3.4, PINK);
      if (sc.labels !== false && cam.z < 1.6) {
        ctx.save(); ctx.globalAlpha = 0.55 * k; ctx.fillStyle = "#F4EFE3"; ctx.font = "600 10px " + FONT; ctx.textAlign = "center";
        ctx.fillText("NET", X(0), Y(36 / 12) - 10);
        var xl = cam.x + (-0.3 * W) / S(), xr = cam.x + (0.3 * W) / S();
        if (xl < -1) ctx.fillText("YOUR SIDE", X(xl), g + 34); if (xr > 1) ctx.fillText("THEIR SIDE", X(xr), g + 34);
        ctx.restore();
      }
    }

    // Home Court props: wall + tape, chairs + rope, towel, floor tape, mirror
    function drawProps(sc, k) {
      var g = Y(0), s = S(), lbl = function (txt, x, y, col) { ctx.fillStyle = col || "rgba(244,239,227,.75)"; ctx.font = "700 10px " + FONT; ctx.fillText(txt, x, y); };
      ctx.save(); ctx.globalAlpha = clamp(k * 4, 0, 1);
      ctx.strokeStyle = "rgba(244,239,227,.35)"; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(0, g); ctx.lineTo(W, g); ctx.stroke();
      var hf = ctx.createLinearGradient(0, g, 0, H); hf.addColorStop(0, "#3A4A6A"); hf.addColorStop(1, "#1A2338"); ctx.fillStyle = hf; ctx.fillRect(0, g, W, H - g);
      (sc.props || []).forEach(function (p) {
        if (p.type === "wall") {
          ctx.fillStyle = "rgba(244,239,227,.08)"; ctx.fillRect(X(p.x), Y(9), W, 9 * s); line([X(p.x), Y(9)], [X(p.x), g], 2, "rgba(244,239,227,.7)");
          for (var b = 1; b < 9; b++) line([X(p.x), Y(b)], [X(p.x) + 8, Y(b)], 1, "rgba(244,239,227,.15)");
          if (p.tape) { line([X(p.x) - 1, Y(34 / 12)], [X(p.x) + 30, Y(34 / 12)], 4, LIME); lbl("TAPE \u00B7 34 IN", X(p.x) + 6, Y(34 / 12) - 9, LIME); }
          lbl("WALL", X(p.x) + 8, Y(8.4));
        } else if (p.type === "rope") {
          [-1.2, 1.2].forEach(function (d) { var cx = X(p.x + d * 0.3); line([cx, g], [cx, Y(34 / 12)], 2, "rgba(244,239,227,.7)"); line([cx - 8, Y(1.5)], [cx + 8, Y(1.5)], 2, "rgba(244,239,227,.7)"); });
          ctx.setLineDash([6, 4]); line([X(p.x - 0.4), Y(34 / 12)], [X(p.x + 0.4), Y(34 / 12)], 3, LIME); ctx.setLineDash([]);
          lbl("CHAIRS + ROPE \u00B7 34 IN", X(p.x) - 60, Y(34 / 12) - 12, LIME);
        } else if (p.type === "towel") {
          ctx.fillStyle = "rgba(142,110,62,.55)"; ctx.fillRect(X(p.x - 1), g - 3, 2 * s, 6); lbl("TOWEL TARGET", X(p.x) - 36, g - 10, PINK);
        } else if (p.type === "tape") {
          (p.xs || [p.x]).forEach(function (x) { line([X(x) - 14, g + 4], [X(x) + 14, g + 4], 4, LIME); }); lbl(p.label || "FLOOR TAPE", X((p.xs || [p.x])[0]) - 20, g - 10, LIME);
        } else if (p.type === "mirror") {
          var gr = ctx.createLinearGradient(X(p.x), 0, X(p.x) + 30, 0); gr.addColorStop(0, "rgba(160,200,255,.22)"); gr.addColorStop(1, "rgba(160,200,255,.04)");
          ctx.fillStyle = gr; ctx.fillRect(X(p.x), Y(7), 30, 7 * s); line([X(p.x), Y(7)], [X(p.x), g], 2, "rgba(190,215,255,.8)"); lbl("MIRROR", X(p.x) + 6, Y(7.3));
        }
      });
      ctx.restore();
    }
    function drawFigure(J, alpha, ghost) {
      ctx.save(); ctx.globalAlpha = alpha; ctx.lineCap = "round"; ctx.lineJoin = "round";
      var P = {}; for (var k in J) if (Array.isArray(J[k])) P[k] = pt(J[k]);
      var s = S(), lw = Math.max(3, s * 0.2), body = ghost ? "rgba(244,239,227,.5)" : alpha < 0.9 ? LINEN : CREAM, shade = "rgba(0,0,0,.25)";
      var limb = function (a, b, w, col) { ctx.strokeStyle = shade; ctx.lineWidth = w + 2; ctx.beginPath(); ctx.moveTo(a[0] + 1.5, a[1] + 2); ctx.lineTo(b[0] + 1.5, b[1] + 2); ctx.stroke(); ctx.strokeStyle = col || body; ctx.lineWidth = w; ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke(); };
      var back = alpha < 0.9 ? "rgba(201,180,138,.55)" : "rgba(244,239,227,.62)";
      // back leg & back arm
      limb(P.hip, P.kneeB, lw * 1.05, back); limb(P.kneeB, P.footB, lw * 0.9, back);
      limb(P.shoulder, P.oElbow, lw * 0.75, back); limb(P.oElbow, P.oHand, lw * 0.65, back);
      // torso: a rounded capsule from hip to neck
      limb(P.hip, P.chest, lw * 2.1); limb(P.chest, P.neck, lw * 1.4);
      // front leg with shoe
      limb(P.hip, P.kneeF, lw * 1.15); limb(P.kneeF, P.footF, lw);
      ctx.strokeStyle = ghost ? body : PINK; ctx.lineWidth = lw * 0.9; ctx.beginPath(); ctx.moveTo(P.footF[0] - s * 0.05, P.footF[1]); ctx.lineTo(P.footF[0] + s * 0.42 * (P.pTip[0] > P.hip[0] ? 1 : -1), P.footF[1]); ctx.stroke();
      // paddle arm
      limb(P.shoulder, P.elbow, lw * 0.9); limb(P.elbow, P.wrist, lw * 0.8); limb(P.wrist, P.hand, lw * 0.7);
      // brass joints
      if (!ghost) [P.kneeF, P.elbow, P.wrist, P.shoulder].forEach(function (j) { ctx.fillStyle = PINK; ctx.beginPath(); ctx.arc(j[0], j[1], Math.max(2.2, lw * 0.32), 0, 7); ctx.fill(); });
      // club head: ivory, with a brass club cap and brim facing the play
      var hr = Math.max(7, s * 0.34), hx = P.head[0], hy = P.head[1], fd = P.pTip[0] > P.hip[0] ? 1 : -1;
      ctx.fillStyle = shade; ctx.beginPath(); ctx.arc(hx + 1.5, hy + 2, hr, 0, 7); ctx.fill();
      ctx.fillStyle = ghost ? body : CREAM; ctx.beginPath(); ctx.arc(hx, hy, hr, 0, 7); ctx.fill();
      if (!ghost) {
        ctx.fillStyle = alpha < 0.9 ? "rgba(156,122,69,.7)" : PINK;
        ctx.beginPath(); ctx.arc(hx, hy - hr * 0.08, hr * 1.02, Math.PI * 1.02, Math.PI * 1.98); ctx.closePath(); ctx.fill();
        ctx.beginPath(); ctx.ellipse(hx + fd * hr * 0.95, hy - hr * 0.12, hr * 0.62, hr * 0.17, 0, 0, 7); ctx.fill();
        ctx.fillStyle = "#1D2840"; ctx.fillRect(hx - hr, hy - hr * 0.2, hr * 2, hr * 0.12);
      }
      // paddle: brass face, ball-green edge, ivory handle
      var a2 = P.pBase, b2 = P.pTip, ang = Math.atan2(b2[1] - a2[1], b2[0] - a2[0]), len = Math.hypot(b2[0] - a2[0], b2[1] - a2[1]);
      limb(P.hand, a2, lw * 0.8, ghost ? body : "#F3E3CC");
      ctx.save(); ctx.translate((a2[0] + b2[0]) / 2, (a2[1] + b2[1]) / 2); ctx.rotate(ang);
      ctx.beginPath(); ctx.roundRect(-len / 2, -s * 0.36, len, s * 0.72, s * 0.3); ctx.fillStyle = ghost ? "rgba(156,122,69,.25)" : PINK; ctx.fill(); ctx.lineWidth = Math.max(1.6, lw * 0.3); ctx.strokeStyle = ghost ? "rgba(226,210,166,.4)" : LIME; ctx.stroke();
      ctx.restore();
      ctx.restore();
    }

    function arcPoint(b, u) { var x = lerp(b.from[0], b.to[0], u), y0 = lerp(b.from[1], b.to[1], u), h = b.apex - Math.max(b.from[1], b.to[1]); return [x, y0 + 4 * h * u * (1 - u) * (b.apexAt ? 1 : 1)]; }
    // skewed parabola: apex sits at fraction b.apexAt along the flight
    function flight(b, u) {
      var ax = b.apexAt == null ? 0.5 : b.apexAt, x = lerp(b.from[0], b.to[0], u);
      var y = u <= ax ? lerp(b.from[1], b.apex, 1 - Math.pow(1 - u / ax, 2)) : lerp(b.apex, b.to[1], Math.pow((u - ax) / (1 - ax), 2));
      return [x, y];
    }
    function drawBall(b, k) {
      if (!b) return;
      var u = clamp((k - (b.t0 || 0)) / ((b.t1 || 1) - (b.t0 || 0)), 0, 1);
      ctx.save();
      // ghost of the full path
      ctx.setLineDash([3, 5]); ctx.strokeStyle = b.noGhost ? "rgba(0,0,0,0)" : "rgba(142,110,62,.25)"; ctx.lineWidth = 1.2; ctx.beginPath();
      for (var i = 0; i <= 40; i++) { var q = pt(flight(b, i / 40)); i ? ctx.lineTo(q[0], q[1]) : ctx.moveTo(q[0], q[1]); } ctx.stroke(); ctx.setLineDash([]);
      // trail so far
      ctx.shadowColor = PINK; ctx.shadowBlur = 10; ctx.strokeStyle = PINK; ctx.lineWidth = 2.4; ctx.beginPath();
      for (var j = 0; j <= 60 * u; j++) { var q2 = pt(flight(b, j / 60)); j ? ctx.lineTo(q2[0], q2[1]) : ctx.moveTo(q2[0], q2[1]); } ctx.stroke();
      var p = pt(flight(b, u)), br = Math.max(4.5, S() * 0.17); ctx.shadowBlur = 0; ctx.fillStyle = LIME; ctx.beginPath(); ctx.arc(p[0], p[1], br, 0, 7); ctx.fill();
      ctx.fillStyle = "rgba(22,31,51,.55)"; [[-0.35, -0.3], [0.35, -0.2], [0, 0.35], [-0.4, 0.3], [0.38, 0.38]].forEach(function (h) { ctx.beginPath(); ctx.arc(p[0] + h[0] * br, p[1] + h[1] * br, br * 0.14, 0, 7); ctx.fill(); });
      ctx.restore();
      if (b.showApex && u > (b.apexAt || 0.5)) {
        var ap = pt(flight(b, b.apexAt || 0.5)); ctx.fillStyle = "rgba(244,239,227,.9)"; ctx.font = "600 10px " + FONT; ctx.fillText("APEX", ap[0] - 14, ap[1] - 12);
        ctx.beginPath(); ctx.arc(ap[0], ap[1], 3, 0, 7); ctx.fill();
        ctx.setLineDash([2, 4]); line(ap, [ap[0], Y(0)], 1, "rgba(244,239,227,.35)"); ctx.setLineDash([]);
      }
      if (b.bounce && u >= 1) { var e = pt(b.to); ctx.strokeStyle = "rgba(142,110,62,.7)"; ctx.beginPath(); ctx.ellipse(e[0], e[1], 10, 3, 0, 0, 7); ctx.stroke(); }
    }

    function drawHud(rows, k) {
      if (!rows) return;
      var x = W * 0.05, y = H * 0.06, w = Math.min(300, W * 0.6), rh = 30;
      ctx.save(); ctx.globalAlpha = clamp(k * 4, 0, 1);
      ctx.fillStyle = "rgba(22,31,51,.92)"; ctx.strokeStyle = "rgba(244,239,227,.25)"; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.roundRect(x, y, w, rh * rows.length + 12, 6); ctx.fill(); ctx.stroke();
      rows.forEach(function (r, i) {
        var yy = y + 26 + i * rh, v = r[1] * clamp((k - i * 0.12) * 2.2, 0, 1);
        ctx.fillStyle = i === rows.length - 1 ? "rgba(244,239,227,.95)" : "rgba(244,239,227,.6)"; ctx.font = "600 11px " + FONT; ctx.fillText(r[0], x + 12, yy);
        ctx.font = "700 22px " + FONT; ctx.textAlign = "right"; ctx.fillText(String(Math.round(v)), x + w - 38, yy + 4); ctx.font = "600 10px " + FONT; ctx.fillText(r[2], x + w - 12, yy + 4); ctx.textAlign = "left";
        if (i < rows.length - 1) line([x + 8, yy + 10], [x + w - 8, yy + 10], 1, "rgba(244,239,227,.12)");
      });
      ctx.restore();
    }

    // top-down court map: 44 ft long (x, -22..22) × 20 ft wide (y, -10..10), net at x = 0
    function drawMap(c, k) {
      var pw = Math.min(W * 0.62, 340), ph = pw * 0.58, px = W * (c.pos ? c.pos[0] : 0.5) - pw / 2, py = H * (c.pos ? c.pos[1] : 0.2);
      var mx = function (x) { return px + 14 + (x + 22) / 44 * (pw - 28); }, my = function (y) { return py + 12 + (y + 14) / 28 * (ph - 24); };
      ctx.save(); ctx.globalAlpha = clamp(k * 4, 0, 1);
      ctx.fillStyle = "rgba(22,31,51,.96)"; ctx.strokeStyle = "rgba(244,239,227,.3)"; ctx.lineWidth = 1; ctx.beginPath(); ctx.roundRect(px, py, pw, ph, 10); ctx.fill(); ctx.stroke();
      ctx.fillStyle = "rgba(226,210,166,.1)"; ctx.fillRect(mx(-7), my(-10), mx(7) - mx(-7), my(10) - my(-10));
      ctx.strokeStyle = "rgba(244,239,227,.7)"; ctx.strokeRect(mx(-22), my(-10), mx(22) - mx(-22), my(10) - my(-10));
      [-7, 7].forEach(function (x) { line([mx(x), my(-10)], [mx(x), my(10)], 1, "rgba(244,239,227,.6)"); });
      line([mx(-22), my(0)], [mx(-7), my(0)], 1, "rgba(244,239,227,.6)"); line([mx(7), my(0)], [mx(22), my(0)], 1, "rgba(244,239,227,.6)");
      line([mx(0), my(-11.2)], [mx(0), my(11.2)], 2.4, "#F4EFE3"); ctx.fillStyle = "#F4EFE3"; [-11.2, 11.2].forEach(function (y) { ctx.beginPath(); ctx.arc(mx(0), my(y), 3, 0, 7); ctx.fill(); });
      ctx.fillStyle = "rgba(244,239,227,.5)"; ctx.font = "600 9px " + FONT; ctx.fillText("TOP VIEW", px + 10, py + ph - 6);
      (c.paths || []).forEach(function (pp, n) {
        var prog = clamp((k - (pp.t0 || 0)) / ((pp.t1 || 1) - (pp.t0 || 0)), 0, 1); if (prog <= 0) return;
        var pts = pp.pts.map(function (q) { return [mx(q[0]), my(q[1])]; }), segs = pts.length - 1, upto = prog * segs;
        ctx.strokeStyle = pp.col || PINK; ctx.lineWidth = 2.2; if (pp.dash) ctx.setLineDash([4, 4]); ctx.beginPath(); ctx.moveTo(pts[0][0], pts[0][1]);
        var end = pts[0];
        for (var i2 = 1; i2 <= segs; i2++) { var f = clamp(upto - (i2 - 1), 0, 1); if (f <= 0) break; end = [lerp(pts[i2 - 1][0], pts[i2][0], f), lerp(pts[i2 - 1][1], pts[i2][1], f)]; ctx.lineTo(end[0], end[1]); }
        ctx.stroke(); ctx.setLineDash([]);
        ctx.fillStyle = pp.col || PINK; ctx.beginPath(); ctx.arc(end[0], end[1], pp.ball ? 4 : 5, 0, 7); ctx.fill();
        if (pp.label && prog > 0.2) { ctx.font = "700 9px " + FONT; ctx.fillText(pp.label, end[0] + 7, end[1] - 6); }
      });
      (c.dots || []).forEach(function (d) { ctx.fillStyle = d.col || "#F4EFE3"; ctx.beginPath(); ctx.arc(mx(d.at[0]), my(d.at[1]), 5, 0, 7); ctx.fill(); if (d.label) { ctx.font = "700 9px " + FONT; ctx.fillText(d.label, mx(d.at[0]) + 7, my(d.at[1]) + 3); } });
      if (c.label) { ctx.fillStyle = "rgba(244,239,227,.9)"; ctx.font = "700 10px " + FONT; ctx.fillText(c.label, px + 10, py - 8); }
      ctx.restore();
    }
    function drawCallout(c, k, J) {
      if (!c) return;
      if (c.kind === "map") return drawMap(c, k);
      var anchor = c.at === "paddle" && J ? pt([(J.pBase[0] + J.pTip[0]) / 2, (J.pBase[1] + J.pTip[1]) / 2]) : c.at === "wrist" && J ? pt(J.wrist) : c.at === "shoulder" && J ? pt(J.shoulder) : pt(c.at || [0, 3]);
      var r = Math.min(W, H) * 0.12, cx = c.pos ? W * c.pos[0] : anchor[0] - r * 1.6, cy = c.pos ? H * c.pos[1] : anchor[1] - r * 1.4, a = clamp(k * 3, 0, 1);
      ctx.save(); ctx.globalAlpha = a;
      ctx.strokeStyle = "rgba(244,239,227,.8)"; ctx.lineWidth = 1; ctx.setLineDash([2, 3]); ctx.beginPath(); ctx.moveTo(anchor[0], anchor[1]); ctx.lineTo(cx, cy); ctx.stroke(); ctx.setLineDash([]);
      ctx.beginPath(); ctx.arc(anchor[0], anchor[1], 9, 0, 7); ctx.stroke();
      ctx.fillStyle = "rgba(22,31,51,.95)"; ctx.beginPath(); ctx.arc(cx, cy, r, 0, 7); ctx.fill(); ctx.lineWidth = 1.4; ctx.stroke();
      ctx.save(); ctx.beginPath(); ctx.arc(cx, cy, r - 2, 0, 7); ctx.clip(); ctx.translate(cx, cy);
      var s = r / 50, ph = (k * 2) % 1;
      if (c.kind === "push" || c.kind === "flick") {
        // paddle face moving through contact: push = face stays set, flick = face rotates
        for (var i = 0; i < 5; i++) {
          var f = i / 4, ang = c.kind === "push" ? -0.35 : -0.35 + f * 1.4, x0 = -26 * s + f * 36 * s;
          ctx.save(); ctx.translate(x0, 8 * s - f * 10 * s); ctx.rotate(ang); ctx.globalAlpha = 0.25 + f * 0.75;
          ctx.strokeStyle = BONE; ctx.lineWidth = 1.4; ctx.beginPath(); ctx.roundRect(-7 * s, -18 * s, 14 * s, 26 * s, 6 * s); ctx.stroke(); ctx.restore();
        }
        ctx.fillStyle = PINK; ctx.beginPath(); ctx.arc(18 * s, -14 * s - (c.kind === "flick" ? 10 * s : 0), 4 * s, 0, 7); ctx.fill();
        ctx.strokeStyle = c.kind === "push" ? LIME : PINK; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(-30 * s, 22 * s); ctx.quadraticCurveTo(0, c.kind === "push" ? 6 * s : 18 * s, 30 * s, c.kind === "push" ? -10 * s : -34 * s); ctx.stroke();
      } else if (c.kind === "grip") {
        for (var g = 1; g <= 10; g++) { ctx.fillStyle = g <= (c.value || 3) ? LIME : "rgba(244,239,227,.18)"; ctx.fillRect(-40 * s + (g - 1) * 8.4 * s, 6 * s, 6.4 * s, -((g * 2.4) + 4) * s); }
        ctx.fillStyle = BONE; ctx.font = "700 " + Math.round(18 * s) + "px " + FONT; ctx.textAlign = "center"; ctx.fillText((c.value || 3) + "/10", 0, 30 * s); ctx.textAlign = "left";
      } else if (c.kind === "height") {
        line([-30 * s, 30 * s], [30 * s, 30 * s], 1.4, BONE); line([0, 30 * s], [0, -20 * s], 2.4, BONE);
        ctx.fillStyle = PINK; [[-26, 0.35], [-8, 0.2], [10, 0.6], [26, 0.9]].forEach(function (b2, i2) { var yy = -30 * s + i2 * 6 * s; ctx.globalAlpha = 0.3 + i2 * 0.23; ctx.beginPath(); ctx.arc(b2[0] * s, yy + (i2 > 1 ? i2 * 8 * s : 0), 4 * s, 0, 7); ctx.fill(); }); ctx.globalAlpha = 1;
      } else if (c.kind === "toes") {
        ctx.fillStyle = "rgba(226,210,166,.18)"; ctx.fillRect(4 * s, -40 * s, 40 * s, 80 * s); line([4 * s, -40 * s], [4 * s, 40 * s], 2, LIME);
        ctx.strokeStyle = BONE; ctx.lineWidth = 1.6; ctx.beginPath(); ctx.ellipse(-12 * s, 14 * s, 16 * s, 7 * s, 0, 0, 7); ctx.stroke();
      }
      ctx.restore();
      if (c.label) { ctx.fillStyle = "rgba(244,239,227,.9)"; ctx.font = "600 10px " + FONT; ctx.textAlign = "center"; ctx.fillText(c.label, cx, cy - r - 8); ctx.textAlign = "left"; }
      ctx.restore();
    }

    function drawCaption(text, k) {
      if (!text) return;
      var words = text.split(" "), shown = lesson && lesson.fullCap ? words.length : Math.ceil(clamp(k / 0.55, 0, 1) * words.length);
      ctx.save(); ctx.textBaseline = "middle"; ctx.font = "700 " + Math.round(clamp(W / 21, 15, 30)) + "px " + DISPLAY;
      var lines = [[]], maxW = W * 0.86;
      words.forEach(function (w) { var cur = lines[lines.length - 1].concat(w).join(" ").replace(/\*/g, ""); if (ctx.measureText(cur).width > maxW && lines[lines.length - 1].length) lines.push([w]); else lines[lines.length - 1].push(w); });
      var idx = 0, lh = clamp(W / 22, 15, 28) * 1.3, y0 = Math.min(H * 0.88 - (lines.length - 1) * lh / 2, H - (lines.length - 0.35) * lh);
      var bw = 0; lines.forEach(function (ln) { bw = Math.max(bw, ctx.measureText(ln.join(" ").replace(/\*/g, "")).width); });
      ctx.fillStyle = "rgba(18,25,42,.72)"; ctx.beginPath(); ctx.roundRect((W - bw) / 2 - 18, y0 - lh * 0.62, bw + 36, lines.length * lh + lh * 0.24, lh * 0.5); ctx.fill();
      lines.forEach(function (ln, li) {
        var full = ln.join(" ").replace(/\*/g, ""), x = (W - ctx.measureText(full).width) / 2, y = y0 + li * lh;
        ln.forEach(function (w) {
          var key = /^\*.*\*[.,!?]?$/.test(w), word = w.replace(/\*/g, ""), ww = ctx.measureText(word).width, vis = idx < shown;
          if (vis) {
            if (key) { ctx.fillStyle = PINK; ctx.beginPath(); ctx.roundRect(x - 7, y - lh * 0.42, ww + 14, lh * 0.84, lh * 0.42); ctx.fill(); ctx.beginPath(); ctx.arc(x + ww * 0.3, y + lh * 0.42, lh * 0.09, 0, Math.PI); ctx.fill(); }
            ctx.fillStyle = key ? "#FFFFFF" : idx === shown - 1 ? CREAM : "rgba(244,239,227,.7)"; ctx.fillText(word, x, y);
          }
          x += ww + ctx.measureText(" ").width; idx++;
        });
      });
      ctx.restore();
    }

    function chip(sc, i, k) {
      var tags = { dont: ["\u2717 DON\u2019T", "#9C7A45"], do: ["\u2713 DO", "#E2D2A6"], why: ["WHY", "#F4EFE3"], rule: ["RULE", "#F2C14E"], tip: ["PRO TIP", "#C9B48A"] };
      var tg = tags[sc.tag], txt = String(i + 1).padStart(2, "0") + " / " + String(scenes.length).padStart(2, "0");
      ctx.save(); ctx.globalAlpha = clamp(k * 5, 0, 1); ctx.font = "700 11px " + FONT;
      var w1 = ctx.measureText(txt).width + 18, x = W - w1 - 14, y = 14;
      if (tg) { var w2 = ctx.measureText(tg[0]).width + 18; x -= w2 + 6; ctx.fillStyle = tg[1]; ctx.beginPath(); ctx.roundRect(x + w1 + 6, y, w2, 24, 12); ctx.fill(); ctx.fillStyle = GREEN; ctx.fillText(tg[0], x + w1 + 15, y + 16); }
      ctx.strokeStyle = "rgba(244,239,227,.3)"; ctx.lineWidth = 1; ctx.beginPath(); ctx.roundRect(x, y, w1, 24, 12); ctx.stroke(); ctx.fillStyle = "rgba(244,239,227,.8)"; ctx.fillText(txt, x + 9, y + 16);
      ctx.restore();
    }
    function tagAt(p, text, col, dx, dy) {
      var x = p[0] + dx, y = p[1] + dy; ctx.save(); ctx.font = "700 10px " + FONT;
      var w = ctx.measureText(text).width + 12; ctx.strokeStyle = col; ctx.setLineDash([2, 3]); ctx.beginPath(); ctx.moveTo(p[0], p[1]); ctx.lineTo(x, y); ctx.stroke(); ctx.setLineDash([]);
      ctx.fillStyle = "rgba(22,31,51,.95)"; ctx.beginPath(); ctx.roundRect(x - (dx < 0 ? w : 0), y - 10, w, 20, 4); ctx.fill(); ctx.strokeStyle = col; ctx.stroke();
      ctx.fillStyle = col; ctx.fillText(text, x - (dx < 0 ? w : 0) + 6, y + 4); ctx.restore();
    }
    // the paddle's path between the two poses, drawn as it happens with an arrowhead
    function swingPath(pa, pb, x, dir, prog, col) {
      var pts = []; for (var i = 0; i <= 16; i++) { var J = skeleton(mixPose(pa, pb, ease(i / 16)), x, dir); pts.push(pt([(J.pBase[0] + J.pTip[0]) / 2, (J.pBase[1] + J.pTip[1]) / 2])); }
      var n = Math.max(1, Math.round(16 * prog));
      ctx.save(); ctx.strokeStyle = col; ctx.lineWidth = 2; ctx.setLineDash([5, 4]); ctx.globalAlpha = 0.9; ctx.beginPath();
      for (var j = 0; j <= n; j++) j ? ctx.lineTo(pts[j][0], pts[j][1]) : ctx.moveTo(pts[j][0], pts[j][1]); ctx.stroke(); ctx.setLineDash([]);
      var a = pts[n], b = pts[Math.max(0, n - 1)], ang = Math.atan2(a[1] - b[1], a[0] - b[0]);
      ctx.fillStyle = col; ctx.beginPath(); ctx.moveTo(a[0] + Math.cos(ang) * 8, a[1] + Math.sin(ang) * 8); ctx.lineTo(a[0] + Math.cos(ang + 2.5) * 8, a[1] + Math.sin(ang + 2.5) * 8); ctx.lineTo(a[0] + Math.cos(ang - 2.5) * 8, a[1] + Math.sin(ang - 2.5) * 8); ctx.fill();
      ctx.restore();
    }
    function frame(time) {
      if (!lesson) return;
      var sc = scenes[0], acc = 0, i = 0;
      for (i = 0; i < scenes.length; i++) { if (t < acc + scenes[i].dur || i === scenes.length - 1) { sc = scenes[i]; break; } acc += scenes[i].dur; }
      var k = clamp((t - acc) / sc.dur, 0, 1), e = ease(clamp(k / 0.7, 0, 1));
      var prev = scenes[i - 1] || sc, c0 = prev.cam || { x: 0, y: 3, z: 1 }, c1 = sc.cam || c0, ck = ease(clamp(k / 0.35, 0, 1));
      cam = { x: lerp(c0.x, c1.x, ck), y: lerp(c0.y, c1.y, ck), z: lerp(c0.z, c1.z, ck) };
      var bg = ctx.createRadialGradient(W * 0.3, H * 0.15, 0, W * 0.5, H * 0.5, Math.max(W, H)); bg.addColorStop(0, "#243050"); bg.addColorStop(1, "#10172A");
      ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
      // pinstripe (brand texture)
      ctx.fillStyle = "rgba(201,168,107,.07)"; for (var sx = 0; sx < W; sx += 26) ctx.fillRect(sx, 0, 1, H * 0.62);
      if (sc.props) drawProps(sc, clamp(k * 3, 0, 1)); else if (sc.court !== false) drawCourt(sc, clamp(k * 3, 0, 1));
      var Jmain = null;
      (sc.players || []).forEach(function (pl, n) {
        var pa = POSES[pl.from] || POSES.ready, pb = POSES[pl.to || pl.from] || pa, pk = pl.t0 != null ? clamp((k - pl.t0) / ((pl.t1 || 1) - pl.t0), 0, 1) : e;
        if (pl.reps) { var ph = (k * pl.reps + (pl.phase || 0)) % 1; pk = ph < 0.5 ? ph * 2 : (1 - ph) * 2; }
        var px = pl.x != null ? pl.x : -9; if (pl.x2 != null) { var mv = pl.reps ? ((k * (pl.moveReps || 1)) % 1) : k; px = lerp(pl.x, pl.x2, pl.reps ? (mv < 0.5 ? mv * 2 : (1 - mv) * 2) : ease(mv)); }
        var J = skeleton(mixPose(pa, pb, ease(pk)), px, pl.dir || 1);
        if (pl.ghost) drawFigure(skeleton(pa, pl.x != null ? pl.x : -9, pl.dir || 1), 0.18, true);
        drawFigure(J, pl.dim ? 0.45 : 1);
        if (pl.to && pl.to !== pl.from && pl.path !== false && !pl.dim) swingPath(pa, pb, pl.x != null ? pl.x : -9, pl.dir || 1, ease(pk), sc.tag === "dont" ? PINK : LIME);
        var lbl = pl.label || ((sc.players || []).length > 1 ? (pl.dim ? "THEM" : "YOU") : "");
        if (lbl && cam.z < 1.6) { var hp = pt(J.head); ctx.save(); ctx.font = "700 10px " + FONT; ctx.textAlign = "center"; ctx.fillStyle = pl.dim ? "rgba(244,239,227,.55)" : LIME; ctx.fillText(lbl, hp[0], hp[1] - S() * 0.6 - 6); ctx.restore(); }
        if (n === 0) Jmain = J;
      });
      if (Jmain && sc.joints) { var jt = { shoulder: ["SHOULDER", -1, -0.9], elbow: ["ELBOW", -1, 0.5], wrist: ["WRIST", 1, 0.9], knee: ["KNEES", -1, 0.2], paddle: ["PADDLE FACE", 1, -0.6] };
        sc.joints.forEach(function (j) { var d = jt[j]; if (!d) return; var p = j === "knee" ? pt(Jmain.kneeF) : j === "paddle" ? pt([(Jmain.pBase[0] + Jmain.pTip[0]) / 2, (Jmain.pBase[1] + Jmain.pTip[1]) / 2]) : pt(Jmain[j]); ctx.globalAlpha = clamp(k * 4, 0, 1); tagAt(p, d[0], j === sc.focus ? LIME : "rgba(244,239,227,.85)", d[1] * Math.min(W, H) * 0.12, d[2] * S() * 0.8); ctx.globalAlpha = 1; }); }
      drawBall(sc.ball, k);
      (sc.balls || []).forEach(function (b) { if (k >= b.t0 - 0.001 && k <= b.t1 + 0.06) drawBall(Object.assign({}, b, { ghost: false }), Math.min(k, b.t1)); });
      drawHud(sc.hud, k);
      drawCallout(sc.callout, clamp((k - (sc.callout && sc.callout.t0 || 0.15)) / 0.85, 0, 1), Jmain);
      if (sc.note) { ctx.fillStyle = "rgba(244,239,227,.4)"; ctx.font = "500 10px " + FONT; ctx.fillText(sc.note, W * 0.05, H * 0.975); }
      if (!lesson.noChip) chip(sc, i, k);
      drawCaption(sc.cap, k);
      if (onTick) onTick(t, total, i);
    }
    function loop(now) {
      if (playing) { t += Math.min(0.05, (now - last) / 1000) * speed; if (t >= total) { if (lesson && lesson.loop) t = 0; else { t = total; playing = false; } } }
      last = now; frame(); raf = requestAnimationFrame(loop);
    }
    size(); window.addEventListener("resize", size);
    var ro = "ResizeObserver" in window ? new ResizeObserver(function () { size(); if (!playing) frame(); }) : null; if (ro) ro.observe(canvas);
    raf = requestAnimationFrame(function (n) { last = n; loop(n); });
    return {
      load: function (l) { lesson = l; scenes = l.scenes; total = scenes.reduce(function (a, s) { return a + s.dur; }, 0); t = 0; },
      play: function () { if (t >= total) t = 0; playing = true; }, pause: function () { playing = false; },
      toggle: function () { this[playing ? "pause" : "play"](); return playing; },
      seek: function (x) { t = clamp(x, 0, total); }, chapter: function (n) { var a = 0; for (var i = 0; i < n; i++) a += scenes[i].dur; t = a; },
      speed: function (s) { speed = s; }, get t() { return t; }, get total() { return total; }, get playing() { return playing; },
      onTick: function (f) { onTick = f; }, render: function (x) { t = x; frame(); }, destroy: function () { cancelAnimationFrame(raf); if (ro) ro.disconnect(); window.removeEventListener("resize", size); },
    };
  }
  window.Coach = { player: Player, POSES: POSES };
})();
