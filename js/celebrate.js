// Winner reveal: glaze pours down, score counts up, names rise, sprinkles burst.
// celebrate(result, { size: "tv" | "card", onDone })
(function () {
  var css = document.createElement("style");
  css.textContent = [
    ".win-fx{position:fixed;inset:0;z-index:90;display:grid;place-items:center;overflow:hidden;pointer-events:none;font-family:Fredoka,ui-rounded,system-ui,sans-serif;color:#3B2416}",
    ".win-fx .glaze{position:absolute;inset:0;background:#FF5FA2;transform:translateY(-110%);animation:wf-pour .75s cubic-bezier(.7,0,.2,1) forwards}",
    ".win-fx .glaze svg{position:absolute;left:0;top:100%;width:100%;height:9vh}",
    ".win-fx.out .glaze{animation:wf-lift .6s cubic-bezier(.7,0,.3,1) forwards}",
    ".win-fx .card{position:relative;text-align:center;opacity:0;animation:wf-in .6s .55s cubic-bezier(.2,.9,.3,1.25) forwards}",
    ".win-fx.out .card{animation:wf-fade .3s forwards}",
    ".win-fx .court{font:700 clamp(12px,1.5vw,22px) 'DM Sans',sans-serif;letter-spacing:.42em;text-transform:uppercase}",
    ".win-fx .score{font-weight:700;font-size:clamp(80px,17vw,260px);line-height:.9;font-variant-numeric:tabular-nums;margin:.1em 0 .05em;color:#3B2416}",
    ".win-fx .score span{color:#3B2416;opacity:.55;margin:0 .06em}",
    ".win-fx .names{font-weight:700;font-size:clamp(28px,4.4vw,72px);line-height:1.05;overflow:hidden}",
    ".win-fx .names div{transform:translateY(110%);animation:wf-rise .55s 1.25s cubic-bezier(.2,.9,.3,1) forwards}",
    ".win-fx .bar{height:clamp(5px,.6vw,10px);background:linear-gradient(90deg,#F5C542,#FFF1B3,#E9B52C);border-radius:99px;margin:.35em auto 0;width:0;animation:wf-bar .6s 1.6s ease-out forwards}",
    ".win-fx .lose{font:600 clamp(14px,1.6vw,26px) 'DM Sans',sans-serif;opacity:0;animation:wf-fadein .5s 1.9s forwards;margin-top:.5em}",
    ".win-fx i{position:absolute;width:clamp(8px,.9vw,16px);height:clamp(22px,2.4vw,40px);border-radius:99px;left:50%;top:50%;opacity:0;animation:wf-burst 1.4s var(--d) cubic-bezier(.1,.7,.3,1) forwards}",
    ".win-fx.card-size{position:absolute;border-radius:inherit}",
    ".win-fx.card-size .score{font-size:64px}.win-fx.card-size .names{font-size:24px}.win-fx.card-size .court{font-size:10px}",
    "@keyframes wf-pour{to{transform:translateY(0)}}@keyframes wf-lift{from{transform:translateY(0)}to{transform:translateY(-110%)}}",
    "@keyframes wf-in{from{opacity:0;transform:scale(.85)}to{opacity:1;transform:none}}@keyframes wf-fade{to{opacity:0;transform:scale(.95)}}",
    "@keyframes wf-rise{to{transform:none}}@keyframes wf-bar{to{width:min(60%,640px)}}@keyframes wf-fadein{to{opacity:.85}}",
    "@keyframes wf-burst{0%{opacity:1;transform:translate(-50%,-50%) rotate(var(--r)) translateY(0)}100%{opacity:0;transform:translate(-50%,-50%) rotate(var(--r)) translateY(var(--dist))}}",
    "@media (prefers-reduced-motion:reduce){.win-fx *{animation-duration:.01s!important;animation-delay:0s!important}}"
  ].join("");
  document.head.appendChild(css);

  function esc(s) { return String(s || "").replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }

  window.celebrate = function (r, opt) {
    opt = opt || {};
    var host = opt.into || document.body, d = document.createElement("div");
    d.className = "win-fx" + (opt.into ? " card-size" : "");
    var cols = ["#D7F03C", "#3B2416", "#FFF6EA", "#2F7A4F", "#E8A95B"], sp = "";
    for (var k = 0; k < 34; k++) sp += '<i style="background:' + cols[k % 5] + ';--r:' + Math.round(k * 360 / 34 + Math.random() * 8) + 'deg;--dist:' + (opt.into ? 90 + Math.random() * 80 : 220 + Math.random() * 280) + 'px;--d:' + (1.2 + Math.random() * .25).toFixed(2) + 's"></i>';
    d.innerHTML = '<div class="glaze"><svg viewBox="0 0 1200 70" preserveAspectRatio="none"><path fill="#FF5FA2" d="M0 0h1200v18c-30 0-40 42-70 42s-30-30-60-30-40 52-80 52-30-42-60-42-50 30-90 30-40-40-80-40-30 30-60 30-40-20-70-20-40 44-80 44-30-34-60-34-40 20-80 20-30-30-60-30-50 40-90 40-30-30-60-30-40 24-60 24V0z"/></svg></div>' +
      sp + '<div class="card"><div class="court">Court ' + r.court + ' · Final</div>' +
      '<div class="score"><b class="a">0</b><span>–</span><b class="b">0</b></div>' +
      '<div class="names"><div>' + esc((r.wn || []).join(" & ")) + ' win</div></div><div class="bar"></div>' +
      '<div class="lose">vs ' + esc((r.ln || []).join(" & ")) + '</div></div>';
    host.appendChild(d);
    // Count the score up
    var a = d.querySelector(".a"), b = d.querySelector(".b"), t0 = performance.now() + 600, dur = 700;
    (function tick(now) { var p = Math.min(1, Math.max(0, (now - t0) / dur)), e = 1 - Math.pow(1 - p, 3);
      a.textContent = Math.round(r.ws * e); b.textContent = Math.round(r.ls * e); if (p < 1) requestAnimationFrame(tick); })(performance.now());
    var hold = opt.hold || 3600;
    setTimeout(function () { d.classList.add("out"); }, hold);
    setTimeout(function () { d.remove(); opt.onDone && opt.onDone(); }, hold + 650);
    return hold + 650;
  };
})();
