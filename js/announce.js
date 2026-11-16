// Court announcer: attention chime + spoken call. Shared by the TV board and the host console.
(function () {
  var ctx, keep = []; // keep utterances referenced (Chrome drops unreferenced ones silently)
  var synth = window.speechSynthesis;

  // Only use a named voice if it is installed on the device; otherwise the browser default
  function localVoice() {
    var vs = (synth && synth.getVoices()) || [];
    var good = vs.filter(function (v) { return v.localService && /^en/i.test(v.lang); });
    var pref = [/Samantha/i, /Daniel/i, /Karen/i, /Serena/i, /Microsoft (Aria|Jenny|Libby|Sonia|Zira|Hazel)/i];
    for (var i = 0; i < pref.length; i++) { var v = good.find(function (x) { return pref[i].test(x.name); }); if (v) return v; }
    return null;
  }

  function chime() {
    try {
      ctx = ctx || new (window.AudioContext || window.webkitAudioContext)(); if (ctx.state === "suspended") ctx.resume();
      var comp = ctx.createDynamicsCompressor(); comp.connect(ctx.destination);
      [[880, 0], [1175, 0.18], [1568, 0.36]].forEach(function (n) {
        var t = ctx.currentTime + n[1], o = ctx.createOscillator(), g = ctx.createGain();
        o.type = "sine"; o.frequency.value = n[0];
        g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.9, t + 0.015); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.6);
        o.connect(g); g.connect(comp); o.start(t); o.stop(t + 0.7);
      });
    } catch (e) {}
  }

  function say(text, useVoice, onFail) {
    if (!synth) { onFail && onFail(); return; }
    var u = new SpeechSynthesisUtterance(text), started = false;
    var v = useVoice ? localVoice() : null; if (v) u.voice = v;
    u.lang = (v && v.lang) || "en-GB"; u.rate = 0.9; u.pitch = 1; u.volume = 1;
    u.onstart = function () { started = true; };
    u.onend = u.onerror = function () { keep = keep.filter(function (x) { return x !== u; }); };
    keep.push(u);
    if (synth.paused) synth.resume();
    synth.speak(u);
    setTimeout(function () { if (!started && !synth.speaking) onFail && onFail(); }, 2000);
  }

  var NUM = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "eleven", "twelve"];
  function call(court, teamA, teamB) {
    var n = NUM[court] || String(court);
    var text = "Court " + n + ". " + teamA.join(" and ") + ", versus, " + teamB.join(" and ") + ". Please go to court " + n + ".";
    if (synth && synth.speaking) synth.cancel();
    chime();
    setTimeout(function () {
      // First try: installed voice. If nothing starts, retry once with the browser default.
      say(text, true, function () { if (synth) synth.cancel(); say(text, false, function () { status("no-voice"); }); });
    }, 900);
  }
  var listeners = [];
  function status(s) { listeners.forEach(function (f) { f(s); }); }
  // Browsers only allow sound after a tap; call this from a button press
  function unlock() { chime(); if (synth) { var u = new SpeechSynthesisUtterance("Announcements on."); u.volume = 1; u.rate = 0.95; keep.push(u); synth.cancel(); synth.speak(u); } }
  if (synth) synth.onvoiceschanged = function () {};
  window.Announcer = { say: function (t) { if (synth && synth.speaking) synth.cancel(); chime(); setTimeout(function () { say(t, true, function () { say(t, false); }); }, 900); }, call: call, unlock: unlock, onStatus: function (f) { listeners.push(f); }, supported: Boolean(synth), test: function () { call(1, ["Ana", "Ben"], ["Omar", "Lea"]); } };
})();
