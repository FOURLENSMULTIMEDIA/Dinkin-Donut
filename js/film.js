// Shop film: a scripted, code-driven advert. Plays muted when in view; sound on request.
(function () {
  var J = window.Jersey, root = document.getElementById("film"); if (!root || !J) return;
  var $ = function (id) { return document.getElementById(id); };
  var scenes = root.querySelectorAll(".sc"), price = (window.JERSEY && window.JERSEY.price) || 165;
  $("fPrice").textContent = price + " QAR";
  var SHOTS = [3200, 2600, 5200, 3800, 3200, 3800], TOTAL = SHOTS.reduce(function (a, b) { return a + b; }, 0);
  var playing = false, muted = true, t0 = 0, elapsed = 0, raf, timers = [], cur = -1, ctx;

  var ICON = {
    pause: '<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="5" width="4" height="14" rx="1"/><rect x="14" y="5" width="4" height="14" rx="1"/></svg>',
    play: '<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5.5v13l11-6.5z"/></svg>',
    on: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z"/><path d="M15.5 9a4 4 0 0 1 0 6M18 6.5a7.5 7.5 0 0 1 0 11"/></svg>',
    off: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z"/><path d="m16 9.5 5 5M21 9.5l-5 5"/></svg>'
  };

  // Sound design: paddle pocks, a soft riser and a chord sting
  function ac() { if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)(); if (ctx.state === "suspended") ctx.resume(); return ctx; }
  function tone(f, t, d, type, v) { var c = ac(), o = c.createOscillator(), g = c.createGain(); o.type = type || "sine"; o.frequency.setValueAtTime(f, c.currentTime + t); g.gain.setValueAtTime(0.0001, c.currentTime + t); g.gain.exponentialRampToValueAtTime(v || 0.2, c.currentTime + t + 0.01); g.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + t + d); o.connect(g).connect(c.destination); o.start(c.currentTime + t); o.stop(c.currentTime + t + d + 0.05); }
  function pock(t) { var c = ac(), o = c.createOscillator(), g = c.createGain(); o.frequency.setValueAtTime(1250, c.currentTime + t); o.frequency.exponentialRampToValueAtTime(600, c.currentTime + t + 0.05); g.gain.setValueAtTime(0.0001, c.currentTime + t); g.gain.exponentialRampToValueAtTime(0.35, c.currentTime + t + 0.003); g.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + t + 0.09); o.connect(g).connect(c.destination); o.start(c.currentTime + t); o.stop(c.currentTime + t + 0.12); }
  function sting(notes, t) { notes.forEach(function (n, i) { tone(440 * Math.pow(2, (n - 69) / 12), t + i * 0.03, 1.6, "triangle", 0.07); }); }
  var CUES = [
    function () { pock(0.2); pock(0.75); pock(1.3); pock(1.85); },
    function () { sting([65, 69, 72, 76], 0); },
    function () { pock(0); tone(196, 0, 0.6, "sine", 0.15); },
    function () { pock(0); pock(0.25); pock(0.5); },
    function () { sting([64, 67, 71, 74], 0); },
    function () { sting([60, 64, 67, 72, 76], 0); pock(0.05); }
  ];

  function clear() { timers.forEach(clearTimeout); timers = []; }
  function later(fn, ms) { timers.push(setTimeout(fn, ms)); }
  function type(el, text, speed) { el.textContent = ""; text.split("").forEach(function (ch, i) { later(function () { el.textContent += ch; }, i * (speed || 70)); }); }

  function scene(i) {
    cur = i; clear();
    scenes.forEach(function (s, k) { s.classList.toggle("on", k === i); });
    if (!muted) try { CUES[i](); } catch (e) {}
    if (i === 0) later(function () { type($("t0"), "Courts are lit.", 75); }, 350);
    if (i === 2) {
      var f = $("fJ"); f.style.transform = "perspective(900px) rotateY(0)";
      f.innerHTML = J.render({ way: "midnight", side: "front" });
      $("fName").textContent = "Made for you.";
      later(function () { f.style.transform = "perspective(900px) rotateY(90deg)"; }, 1200);
      later(function () {
        var name = "AISHA", n = 0, num = 0;
        f.innerHTML = J.render({ way: "midnight", side: "back", name: "", num: "" });
        f.style.transform = "perspective(900px) rotateY(0)";
        var iv = setInterval(function () {
          n++; num = Math.min(7, num + 1);
          f.innerHTML = J.render({ way: "midnight", side: "back", name: name.slice(0, n), num: String(num) });
          if (!muted) try { pock(0); } catch (e) {}
          if (n >= name.length && num >= 7) { clearInterval(iv); $("fName").textContent = "Your name. Your number."; }
        }, 170);
        timers.push(iv);
      }, 1700);
    }
    if (i === 3) {
      var row = [["glaze", "NOOR", "10", "Glaze", "Home"], ["midnight", "OMAR", "23", "Midnight", "Tournament"], ["court", "LEA", "4", "Court", "Away"]];
      $("fRow").innerHTML = row.map(function (r) { return "<div>" + J.render({ way: r[0], side: "back", name: r[1], num: r[2] }) + "<small>" + r[4] + "</small><b>" + r[3] + "</b></div>"; }).join("");
    }
    if (i === 4) $("fPolo").innerHTML = J.renderPolo({ way: "choco", side: "front" }) + J.renderPolo({ way: "cream", side: "back", name: "AISHA" });
  }

  function tick(now) {
    if (!playing) return;
    elapsed = now - t0;
    if (elapsed >= TOTAL) { t0 = now; elapsed = 0; }
    var acc = 0, idx = 0; for (; idx < SHOTS.length; idx++) { if (elapsed < acc + SHOTS[idx]) break; acc += SHOTS[idx]; }
    if (idx !== cur) scene(idx);
    $("fBar").style.width = (elapsed / TOTAL * 100) + "%";
    raf = requestAnimationFrame(tick);
  }
  function play() { if (playing) return; playing = true; $("play").hidden = true; t0 = performance.now() - elapsed; cur = -1; raf = requestAnimationFrame(tick); paint(); }
  function pause() { playing = false; cancelAnimationFrame(raf); clear(); paint(); }
  function paint() { $("fToggle").innerHTML = playing ? ICON.pause : ICON.play; $("fToggle").setAttribute("aria-label", playing ? "Pause" : "Play"); $("fSound").innerHTML = (muted ? ICON.off : ICON.on) + (muted ? " Sound off" : " Sound on"); }

  // Resting frame: the end card, so the price is visible before anything plays
  scenes[5].classList.add("on"); paint();
  $("play").onclick = function () { muted = false; elapsed = 0; play(); };
  $("fToggle").onclick = function () { playing ? pause() : play(); };
  $("fSound").onclick = function () { muted = !muted; if (!muted) ac(); paint(); if (!playing) play(); };
  var reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  if ("IntersectionObserver" in window && !reduce) {
    new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting && e.intersectionRatio > 0.6) { if (!playing && $("play").hidden === false && !root.dataset.seen) { root.dataset.seen = 1; play(); } } else if (playing && !e.isIntersecting) pause(); }); }, { threshold: [0, 0.6] }).observe(root);
  }
})();
