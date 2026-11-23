// Entrance: the crest settles, a brass rule draws, the name resolves in serif, then the site is revealed.
// First visit only; tap to skip; skipped for reduced motion.
(function () {
  function welcomeBack(n) {
    try { if (!n || sessionStorage.getItem("dd-wb")) return; sessionStorage.setItem("dd-wb", "1"); } catch (e) { return; }
    var st = document.createElement("style");
    st.textContent = "#wb{position:fixed;left:50%;top:calc(76px + env(safe-area-inset-top,0px));z-index:60;transform:translate(-50%,-160%);display:flex;align-items:center;gap:10px;padding:8px 18px 8px 8px;border-radius:999px;background:#1D2840;color:#F4EFE3;border:1px solid rgba(201,168,107,.6);font:600 17px Fraunces,Georgia,serif;box-shadow:0 14px 30px rgba(18,25,42,.35);animation:wb-in .7s .6s cubic-bezier(.16,1,.3,1) forwards,wb-out .5s 4.6s forwards}" +
      "#wb img{width:30px;height:30px}" +
      "@keyframes wb-in{to{transform:translate(-50%,0)}}@keyframes wb-out{to{transform:translate(-50%,-160%);opacity:0}}@media (prefers-reduced-motion:reduce){#wb{animation:none;transform:translate(-50%,0)}}";
    document.head.appendChild(st);
    var go = function () { var d = document.createElement("div"); d.id = "wb"; d.innerHTML = '<img src="/assets/logo.svg" alt="">Welcome back, ' + n.replace(/[<>&]/g, "") + "."; document.body.appendChild(d); setTimeout(function () { d.remove(); }, 5400); };
    if (document.body) go(); else document.addEventListener("DOMContentLoaded", go);
  }
  // Full entrance on the very first visit only; returning players get a short welcome-back instead
  var seen = false, name = "";
  try { seen = !!localStorage.getItem("dd-intro-seen"); localStorage.setItem("dd-intro-seen", "1"); name = (localStorage.getItem("dd-name") || "").trim().split(/\s+/)[0]; } catch (e) {}
  if (seen) { welcomeBack(name); return; }
  if (window.DD_TEASER) return; // the opening-soon film is playing instead
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  var css = document.createElement("style");
  css.textContent = [
    "#intro{position:fixed;inset:0;z-index:999;display:grid;place-items:center;background:radial-gradient(ellipse at 50% 40%,#26334F,#12192A 75%);overflow:hidden;cursor:pointer;color:#F4EFE3}",
    "#intro .stage{display:grid;justify-items:center;gap:2.4vmin;text-align:center}",
    "#intro .crest{width:min(26vmin,170px);aspect-ratio:1;opacity:0;transform:scale(.92);animation:in-crest 1.2s .15s cubic-bezier(.16,1,.3,1) forwards;filter:drop-shadow(0 2vmin 4vmin rgba(0,0,0,.35))}",
    "#intro .rule{display:flex;align-items:center;gap:1.6vmin;color:#C9A86B;font:600 min(1.7vmin,12px) 'DM Sans',system-ui,sans-serif;letter-spacing:.5em;text-transform:uppercase;opacity:0;animation:in-fade .8s 1s forwards}",
    "#intro .rule:before,#intro .rule:after{content:'';height:1px;width:0;background:#C9A86B;animation:in-line .9s 1s cubic-bezier(.16,1,.3,1) forwards}",
    "#intro .name{font:600 min(10vmin,76px)/1 Fraunces,Georgia,serif;letter-spacing:.02em}",
    "#intro .name span{display:inline-block;opacity:0;filter:blur(6px);transform:translateY(25%);animation:in-pop .7s cubic-bezier(.16,1,.3,1) forwards}",
    "#intro .name em{font-style:italic;color:#C9A86B}",
    "#intro .tag{font:italic 600 min(3vmin,22px) Fraunces,Georgia,serif;color:rgba(244,239,227,.75);opacity:0;animation:in-fade .8s 2s forwards}",
    "#intro.gone{animation:in-lift .8s cubic-bezier(.76,0,.24,1) forwards}",
    "@keyframes in-crest{to{opacity:1;transform:none}}@keyframes in-line{to{width:min(9vmin,60px)}}",
    "@keyframes in-pop{to{opacity:1;filter:none;transform:none}}@keyframes in-fade{to{opacity:1}}",
    "@keyframes in-lift{to{opacity:0;transform:translateY(-4%)}}"
  ].join("");
  document.head.appendChild(css);
  var el = document.createElement("div"); el.id = "intro"; el.setAttribute("aria-hidden", "true");
  var word = function (w, d, em) { return w.split("").map(function (ch, i) { return '<span style="animation-delay:' + (d + i * 0.04).toFixed(3) + 's">' + ch + "</span>"; }).join(""); };
  el.innerHTML = '<div class="stage"><img class="crest" src="/assets/logo.svg" alt=""><div class="rule">Est. MMXXVI</div><div class="name">' + word("Dink", 1.2) + "&nbsp;<em>" + word("Different", 1.4) + '</em></div><div class="tag">A pickleball club, the old-fashioned way.</div></div>';
  var html = document.documentElement; html.style.overflow = "hidden";
  function done() { if (!el.isConnected) return; el.classList.add("gone"); setTimeout(function () { el.remove(); html.style.overflow = ""; }, 820); }
  function mount() { document.body.appendChild(el); setTimeout(done, 3200); el.addEventListener("click", done); }
  if (document.body) mount(); else document.addEventListener("DOMContentLoaded", mount);
})();
