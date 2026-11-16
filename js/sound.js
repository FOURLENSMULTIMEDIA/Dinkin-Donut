// Ambient club loop, synthesised in the browser (no audio files, no licensing).
// Off by default; browsers only allow audio after a user gesture.
(function () {
  var KEY = "dd-sound", ctx, master, timer, step = 0, nextT = 0, on = false;
  var BPM = 84, SPB = 60 / BPM / 2; // eighth notes
  // Fmaj7 · Em7 · Dm7 · Cmaj7, two bars each
  var CHORDS = [[53, 57, 60, 64], [52, 55, 59, 62], [50, 53, 57, 60], [48, 52, 55, 59]];
  var BASS = [41, 40, 38, 36];
  var hz = function (m) { return 440 * Math.pow(2, (m - 69) / 12); };

  function noise(len) {
    var b = ctx.createBuffer(1, ctx.sampleRate * len, ctx.sampleRate), d = b.getChannelData(0);
    for (var i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    return b;
  }
  var NOISE;

  function env(g, t, a, peak, d) { g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(peak, t + a); g.gain.exponentialRampToValueAtTime(0.0001, t + a + d); }

  function pad(chord, t, dur) {
    var f = ctx.createBiquadFilter(); f.type = "lowpass"; f.frequency.value = 1100; f.Q.value = 0.4; f.connect(master);
    chord.forEach(function (m) {
      [-6, 6].forEach(function (det) {
        var o = ctx.createOscillator(), g = ctx.createGain();
        o.type = "triangle"; o.frequency.value = hz(m); o.detune.value = det;
        g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(0.045, t + 0.6); g.gain.linearRampToValueAtTime(0.0001, t + dur);
        o.connect(g).connect(f); o.start(t); o.stop(t + dur + 0.05);
      });
    });
  }
  function bass(m, t) { var o = ctx.createOscillator(), g = ctx.createGain(); o.type = "sine"; o.frequency.value = hz(m); env(g, t, 0.02, 0.22, 0.5); o.connect(g).connect(master); o.start(t); o.stop(t + 0.6); }
  function kick(t) { var o = ctx.createOscillator(), g = ctx.createGain(); o.frequency.setValueAtTime(120, t); o.frequency.exponentialRampToValueAtTime(42, t + 0.18); env(g, t, 0.005, 0.5, 0.28); o.connect(g).connect(master); o.start(t); o.stop(t + 0.35); }
  function hat(t, v) { var s = ctx.createBufferSource(), f = ctx.createBiquadFilter(), g = ctx.createGain(); s.buffer = NOISE; f.type = "highpass"; f.frequency.value = 7000; env(g, t, 0.002, v, 0.05); s.connect(f).connect(g).connect(master); s.start(t); s.stop(t + 0.08); }
  function snap(t) { var s = ctx.createBufferSource(), f = ctx.createBiquadFilter(), g = ctx.createGain(); s.buffer = NOISE; f.type = "bandpass"; f.frequency.value = 1800; f.Q.value = 0.8; env(g, t, 0.003, 0.12, 0.12); s.connect(f).connect(g).connect(master); s.start(t); s.stop(t + 0.16); }
  // The pickleball "pock": a hollow, pitched click, panned somewhere on court
  function pock(t) {
    var o = ctx.createOscillator(), g = ctx.createGain(), p = ctx.createStereoPanner ? ctx.createStereoPanner() : ctx.createGain();
    o.type = "sine"; o.frequency.setValueAtTime(1150 + Math.random() * 250, t); o.frequency.exponentialRampToValueAtTime(620, t + 0.05);
    env(g, t, 0.002, 0.16, 0.07); if (p.pan) p.pan.value = Math.random() * 1.6 - 0.8;
    var s = ctx.createBufferSource(), f = ctx.createBiquadFilter(), g2 = ctx.createGain(); s.buffer = NOISE; f.type = "bandpass"; f.frequency.value = 2600; env(g2, t, 0.001, 0.06, 0.02);
    o.connect(g).connect(p); s.connect(f).connect(g2).connect(p); p.connect(master);
    o.start(t); o.stop(t + 0.1); s.start(t); s.stop(t + 0.04);
  }

  function schedule() {
    while (nextT < ctx.currentTime + 0.25) {
      var bar = Math.floor(step / 8), beat = step % 8, ci = Math.floor(bar / 2) % 4;
      if (step % 16 === 0) { pad(CHORDS[ci], nextT, SPB * 16); }
      if (beat === 0 || beat === 3 && bar % 2) bass(BASS[ci], nextT);
      if (beat === 0 || beat === 5) kick(nextT);
      if (beat === 4) snap(nextT);
      hat(nextT + (beat % 2 ? SPB * 0.12 : 0), beat % 2 ? 0.025 : 0.04); // swung
      if (beat % 2 === 0 && Math.random() < 0.13) pock(nextT + SPB * 0.5);
      if (beat % 2 === 0 && Math.random() < 0.05) pock(nextT + SPB * 1.1);
      nextT += SPB; step++;
    }
  }

  function start() {
    if (!ctx) {
      ctx = new (window.AudioContext || window.webkitAudioContext)();
      master = ctx.createGain(); master.gain.value = 0;
      var comp = ctx.createDynamicsCompressor(); master.connect(comp).connect(ctx.destination);
      NOISE = noise(1);
    }
    ctx.resume(); nextT = ctx.currentTime + 0.1;
    master.gain.cancelScheduledValues(ctx.currentTime); master.gain.setTargetAtTime(0.5, ctx.currentTime, 0.8);
    clearInterval(timer); timer = setInterval(schedule, 60); on = true; paint();
  }
  function stop() {
    on = false; paint();
    if (!ctx) return;
    master.gain.setTargetAtTime(0, ctx.currentTime, 0.25);
    setTimeout(function () { if (!on) { clearInterval(timer); ctx.suspend(); } }, 900);
  }
  function save(v) { try { localStorage.setItem(KEY, v ? "on" : "off"); } catch (e) {} }
  function wanted() { try { return localStorage.getItem(KEY) === "on"; } catch (e) { return false; } }

  var btn;
  var ICON_ON = '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z"/><path d="M15.5 9a4 4 0 0 1 0 6M18 6.5a7.5 7.5 0 0 1 0 11"/></svg>';
  var ICON_OFF = '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z"/><path d="m16 9.5 5 5M21 9.5l-5 5"/></svg>';
  function paint() { if (!btn) return; btn.innerHTML = (on ? ICON_ON : ICON_OFF) + '<span class="eq" aria-hidden="true"><i></i><i></i><i></i></span>'; btn.setAttribute("aria-pressed", on); btn.title = on ? "Mute club sounds" : "Play club sounds"; btn.classList.toggle("playing", on); }

  document.addEventListener("DOMContentLoaded", function () {
    var nav = document.querySelector(".nav .wrap"); if (!nav || document.body.dataset.nosound !== undefined) return;
    btn = document.createElement("button"); btn.type = "button"; btn.className = "soundbtn"; btn.setAttribute("aria-label", "Club sounds");
    var theme = nav.querySelector(".theme"); nav.insertBefore(btn, theme ? theme.nextSibling : nav.querySelector(".btn, .chip"));
    paint();
    btn.addEventListener("click", function (e) { e.stopPropagation(); if (on) { stop(); save(false); } else { start(); save(true); } });
    if (wanted()) document.addEventListener("pointerdown", function once() { document.removeEventListener("pointerdown", once); if (!on && wanted()) start(); });
  });
})();
