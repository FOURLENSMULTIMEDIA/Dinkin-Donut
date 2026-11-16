// Court announcer: attention chime + clear spoken call. Shared by the TV board and the host console.
(function () {
  var ctx, voice = null;
  // Prefer clear, natural English voices when the device has them
  var PREFERRED = [/Google UK English Female/i, /Google UK English Male/i, /Google US English/i, /Samantha/i, /Daniel/i, /Karen/i, /Serena/i, /Microsoft (Aria|Jenny|Guy|Libby|Sonia) Online/i, /Microsoft (Zira|Hazel|David)/i];
  function pickVoice() {
    var vs = (window.speechSynthesis && speechSynthesis.getVoices()) || [];
    for (var i = 0; i < PREFERRED.length; i++) { var v = vs.find(function (x) { return PREFERRED[i].test(x.name); }); if (v) return v; }
    return vs.find(function (x) { return /^en(-|_)(GB|US|AU)/i.test(x.lang); }) || vs.find(function (x) { return /^en/i.test(x.lang); }) || null;
  }
  if (window.speechSynthesis) { voice = pickVoice(); speechSynthesis.onvoiceschanged = function () { voice = pickVoice(); }; }

  function chime() {
    try {
      ctx = ctx || new (window.AudioContext || window.webkitAudioContext)(); if (ctx.state === "suspended") ctx.resume();
      var comp = ctx.createDynamicsCompressor(); comp.connect(ctx.destination);
      [[880, 0], [1175, 0.22], [1568, 0.44]].forEach(function (n) {
        var t = ctx.currentTime + n[1], o = ctx.createOscillator(), o2 = ctx.createOscillator(), g = ctx.createGain();
        o.type = "sine"; o2.type = "triangle"; o.frequency.value = n[0]; o2.frequency.value = n[0] * 2;
        g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.9, t + 0.015); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.9);
        o.connect(g); o2.connect(g); g.connect(comp); o.start(t); o2.start(t); o.stop(t + 1); o2.stop(t + 1);
      });
    } catch (e) {}
  }
  function speak(text) {
    if (!window.speechSynthesis) return;
    var u = new SpeechSynthesisUtterance(text);
    if (voice) u.voice = voice; u.lang = (voice && voice.lang) || "en-GB"; u.rate = 0.88; u.pitch = 1; u.volume = 1;
    speechSynthesis.speak(u);
  }
  var NUM = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "eleven", "twelve"];
  // "Court two. Ana and Ben, versus, Omar and Lea. Please go to court two."
  function call(court, teamA, teamB) {
    var n = NUM[court] || String(court);
    if (window.speechSynthesis) speechSynthesis.cancel();
    chime();
    setTimeout(function () {
      speak("Court " + n + ".");
      speak(teamA.join(" and ") + ". Versus. " + teamB.join(" and ") + ".");
      speak("Please go to court " + n + ".");
    }, 1250);
  }
  // Browsers only allow sound after a tap; call this from a button press once
  function unlock() { chime(); if (window.speechSynthesis) { var u = new SpeechSynthesisUtterance(" "); u.volume = 0; speechSynthesis.speak(u); } }
  window.Announcer = { call: call, unlock: unlock, test: function () { call(1, ["Ana", "Ben"], ["Omar", "Lea"]); } };
})();
