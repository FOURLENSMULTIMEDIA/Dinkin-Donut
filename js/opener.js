// Dinkin' Donut brand commercial (about 30 s). Scenes are HTML/CSS, timed here and synced to the music.
// Plays muted as a teaser when in view; Play starts from the top with sound.
(function () {
  var root = document.getElementById("ad"); if (!root) return;
  var $ = function (s) { return root.querySelector(s); };
  var scenes = root.querySelectorAll(".asc");
  var SHOTS = [3000, 3500, 4000, 4500, 4000, 3500, 3500, 4000], TOTAL = SHOTS.reduce(function (a, b) { return a + b; }, 0);
  var music = new Audio("/assets/audio/opener.mp3"); music.preload = "auto";
  var playing = false, sound = false, t0 = 0, elapsed = 0, raf, cur = -1, timers = [];
  var clear = function () { timers.forEach(clearTimeout); timers = []; };
  var later = function (f, ms) { timers.push(setTimeout(f, ms)); };

  function scene(i) {
    cur = i; clear();
    scenes.forEach(function (s, k) { s.classList.toggle("on", k === i); });
    if (i === 3) { // phone ticket: #3 -> #2 -> #1 -> Court 2
      var t = $("#adTicket"); t.className = "ticket"; t.innerHTML = "<small>Your place</small><b>#3</b>";
      later(function () { t.innerHTML = "<small>Your place</small><b>#2</b>"; }, 900);
      later(function () { t.innerHTML = "<small>Your place</small><b>#1</b>"; }, 1700);
      later(function () { t.className = "ticket go"; t.innerHTML = "<small>You're up</small><b>Court 2</b>"; }, 2600);
    }
    if (i === 5) { var a = $("#adA"), b = $("#adB"), s0 = performance.now() + 700;
      (function tick(now) { var p = Math.min(1, Math.max(0, (now - s0) / 800)), e = 1 - Math.pow(1 - p, 3); a.textContent = Math.round(11 * e); b.textContent = Math.round(7 * e); if (p < 1 && cur === 5) requestAnimationFrame(tick); })(performance.now()); }
  }
  function tick(now) {
    if (!playing) return;
    elapsed = now - t0;
    if (elapsed >= TOTAL) { if (sound) { stop(true); return; } t0 = now; elapsed = 0; }
    var acc = 0, i = 0; for (; i < SHOTS.length; i++) { if (elapsed < acc + SHOTS[i]) break; acc += SHOTS[i]; }
    if (i !== cur) scene(i);
    $("#adBar").style.width = (elapsed / TOTAL * 100) + "%";
    raf = requestAnimationFrame(tick);
  }
  function play(withSound) {
    sound = withSound; root.classList.toggle("sound", sound);
    cancelAnimationFrame(raf); clear(); elapsed = 0; t0 = performance.now(); cur = -1; playing = true;
    if (sound) { window.SiteSound && SiteSound.duck(true); try { music.currentTime = 0; } catch (e) {} music.play().catch(function () {}); }
    else music.pause();
    $("#adPlay").hidden = true; paint(); raf = requestAnimationFrame(tick);
  }
  function stop(ended) {
    playing = false; cancelAnimationFrame(raf); clear(); music.pause(); window.SiteSound && SiteSound.duck(false);
    if (ended) { scene(7); $("#adPlay").hidden = false; $("#adPlay").querySelector("b").textContent = "Watch again"; }
    paint();
  }
  function paint() {
    $("#adSound").textContent = sound ? "Sound on" : "Tap for sound";
    $("#adToggle").setAttribute("aria-label", playing ? "Pause" : "Play");
    $("#adToggle").innerHTML = playing ? '<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="5" width="4" height="14" rx="1"/><rect x="14" y="5" width="4" height="14" rx="1"/></svg>' : '<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5.5v13l11-6.5z"/></svg>';
  }
  // Big play: always starts from the top with sound
  $("#adPlay").onclick = function () { play(true); };
  $("#adSound").onclick = function () { play(true); };
  $("#adToggle").onclick = function () { if (playing) stop(false); else play(sound); };
  scenes[7].classList.add("on"); paint();
  var reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  if ("IntersectionObserver" in window && !reduce) new IntersectionObserver(function (es) {
    es.forEach(function (e) { if (e.isIntersecting && e.intersectionRatio > 0.5) { if (!playing && !root.dataset.seen) { root.dataset.seen = 1; play(false); } } else if (playing && !sound && !e.isIntersecting) stop(false); });
  }, { threshold: [0, 0.5] }).observe(root);
})();
