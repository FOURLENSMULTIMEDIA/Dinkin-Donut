// Entrance: ball drops and bounces, a bite is taken, the name pops in, glaze pours and lifts to reveal the site.
// First visit only; tap to skip; skipped for reduced motion.
(function () {
  function welcomeBack(n) {
    try { if (!n || sessionStorage.getItem("dd-wb")) return; sessionStorage.setItem("dd-wb", "1"); } catch (e) { return; }
    var st = document.createElement("style");
    st.textContent = "#wb{position:fixed;left:50%;top:calc(76px + env(safe-area-inset-top,0px));z-index:60;transform:translate(-50%,-160%);display:flex;align-items:center;gap:10px;padding:8px 18px 8px 8px;border-radius:999px;background:#FF5FA2;color:#fff;font:700 15px Fredoka,ui-rounded,system-ui,sans-serif;box-shadow:0 14px 30px rgba(255,95,162,.4);animation:wb-in .7s .6s cubic-bezier(.16,1,.3,1) forwards,wb-out .5s 4.6s forwards}" +
      "#wb img{width:30px;height:30px}#wb::after{content:'';position:absolute;left:24px;bottom:-9px;width:10px;height:14px;border-radius:0 0 8px 8px;background:#FF5FA2}" +
      "@keyframes wb-in{to{transform:translate(-50%,0)}}@keyframes wb-out{to{transform:translate(-50%,-160%);opacity:0}}@media (prefers-reduced-motion:reduce){#wb{animation:none;transform:translate(-50%,0)}}";
    document.head.appendChild(st);
    var go = function () { var d = document.createElement("div"); d.id = "wb"; d.innerHTML = '<img src="/assets/logo.svg" alt="">Welcome back, ' + n.replace(/[<>&]/g, "") + "."; document.body.appendChild(d); setTimeout(function () { d.remove(); }, 5400); };
    if (document.body) go(); else document.addEventListener("DOMContentLoaded", go);
  }
  // Full entrance on the very first visit only; returning players get a short welcome-back instead
  var seen = false, name = "";
  try { seen = !!localStorage.getItem("dd-intro-seen"); localStorage.setItem("dd-intro-seen", "1"); name = (localStorage.getItem("dd-name") || "").trim().split(/\s+/)[0]; } catch (e) {}
  if (seen) { welcomeBack(name); return; }
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  var css = document.createElement("style");
  css.textContent = [
    "#intro{position:fixed;inset:0;z-index:999;display:grid;place-items:center;background:#FFF6EA;overflow:hidden;cursor:pointer}",
    "#intro .stage{display:grid;justify-items:center;gap:2vmin}",
    "#intro .ball{position:relative;width:min(28vmin,180px);aspect-ratio:1;animation:in-drop 1.05s cubic-bezier(.45,0,.55,1) both}",
    "#intro .ball img{width:100%;height:100%;filter:drop-shadow(0 2vmin 2.4vmin rgba(59,36,22,.25))}",
    "#intro .bite{position:absolute;right:4%;top:2%;width:30%;aspect-ratio:1;border-radius:50%;background:#FFF6EA;transform:scale(0);animation:in-bite .18s .95s cubic-bezier(.16,1,.3,1) forwards}",
    "#intro .shadow{width:min(20vmin,130px);height:2vmin;border-radius:50%;background:rgba(59,36,22,.18);animation:in-shadow 1.05s both}",
    "#intro .name{display:flex;font:700 min(9vmin,64px)/1 Fredoka,ui-rounded,system-ui,sans-serif;color:#3B2416;letter-spacing:-.01em}",
    "#intro .name span{display:inline-block;opacity:0;transform:translateY(60%) scale(.6);animation:in-pop .42s cubic-bezier(.16,1,.3,1) forwards}",
    "#intro .tag{font:700 min(1.8vmin,13px) 'DM Sans',system-ui,sans-serif;letter-spacing:.45em;text-transform:uppercase;color:#FF5FA2;opacity:0;animation:in-fade .5s 1.9s forwards}",
    "#intro i{position:absolute;left:50%;top:44%;width:10px;height:26px;border-radius:9px;opacity:0;animation:in-spr 1s 1.55s cubic-bezier(.1,.7,.3,1) forwards}",
    "#intro .glaze{position:absolute;inset:0;background:#FF5FA2;transform:translateY(calc(-100% - 12vh));z-index:2}",
    "#intro .glaze svg{position:absolute;left:0;top:100%;width:100%;height:10vh}",
    "#intro.out .glaze{animation:in-pour .55s cubic-bezier(.76,0,.24,1) forwards}",
    "#intro.gone{animation:in-lift .6s .55s cubic-bezier(.76,0,.24,1) forwards}",
    "@keyframes in-drop{0%{transform:translateY(-70vh)}42%{transform:translateY(0) scale(1.1,.86)}58%{transform:translateY(-14vmin) scale(.96,1.04)}74%{transform:translateY(0) scale(1.04,.95)}86%{transform:translateY(-3vmin)}100%{transform:none}}",
    "@keyframes in-shadow{0%{transform:scale(.2);opacity:0}42%{transform:scale(1.1);opacity:1}58%{transform:scale(.6)}74%{transform:scale(1)}86%{transform:scale(.9)}100%{transform:none;opacity:1}}",
    "@keyframes in-bite{to{transform:scale(1)}}",
    "@keyframes in-pop{to{opacity:1;transform:none}}@keyframes in-fade{to{opacity:1}}",
    "@keyframes in-spr{0%{opacity:1;transform:translate(-50%,-50%) rotate(var(--r)) translateY(0)}100%{opacity:0;transform:translate(-50%,-50%) rotate(var(--r)) translateY(var(--d))}}",
    "@keyframes in-pour{to{transform:none}}@keyframes in-lift{to{transform:translateY(-110%)}}"
  ].join("");
  document.head.appendChild(css);
  var el = document.createElement("div"); el.id = "intro"; el.setAttribute("aria-hidden", "true");
  var name = "Dinkin’ Donut".split("").map(function (ch, i) { return '<span style="animation-delay:' + (1.15 + i * 0.045).toFixed(3) + 's">' + (ch === " " ? "&nbsp;" : ch) + "</span>"; }).join("");
  var cols = ["#FF5FA2", "#D7F03C", "#2F7A4F", "#E8A95B", "#3B2416"], spr = "";
  for (var k = 0; k < 18; k++) spr += '<i style="background:' + cols[k % 5] + ";--r:" + (k * 20 + 7) + "deg;--d:" + (90 + (k % 4) * 40) + 'px"></i>';
  el.innerHTML = spr + '<div class="stage"><div class="ball"><img src="/assets/logo.svg" alt=""><span class="bite"></span></div><div class="shadow"></div><div class="name">' + name + '</div><div class="tag">Pickleball club · Doha</div></div>' +
    '<div class="glaze"><svg viewBox="0 0 1200 70" preserveAspectRatio="none"><path fill="#FF5FA2" d="M0 0h1200v18c-30 0-40 42-70 42s-30-30-60-30-40 52-80 52-30-42-60-42-50 30-90 30-40-40-80-40-30 30-60 30-40-20-70-20-40 44-80 44-30-34-60-34-40 20-80 20-30-30-60-30-50 40-90 40-30-30-60-30-40 24-60 24V0z"/></svg></div>';
  var html = document.documentElement; html.style.overflow = "hidden";
  function done() { if (!el.isConnected) return; el.classList.add("out", "gone"); setTimeout(function () { el.remove(); html.style.overflow = ""; }, 1200); }
  function mount() { document.body.appendChild(el); setTimeout(done, 2500); el.addEventListener("click", done); }
  if (document.body) mount(); else document.addEventListener("DOMContentLoaded", mount);
})();
