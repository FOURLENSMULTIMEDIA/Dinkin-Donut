/* Dink Different · page transitions and small touches.
   - Court-panel transition between pages: a navy panel with the Kitchen line, the DD mark and a ball dinking across.
   - Ball scroll bar: a pickleball rolls along a brass line as you scroll.
   - Lob to top: a paddle button that sends you back up.
   - Headings rise in with a brass underline.
   Respects prefers-reduced-motion. Include right after <body> so arrival never flashes. */
(function () {
  if (window.__ddTx) return; window.__ddTx = 1;
  var d = document, de = d.documentElement, reduce = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  var path = location.pathname.replace(/\/$/, "") || "/";
  var noOverlay = /^\/(tv|c\/[^/]+\/tv)$/.test(path);
  var KEY = "dd-tx";
  var MARK = '<svg viewBox="0 0 200 200" aria-hidden="true"><g fill="currentColor" fill-rule="evenodd"><path d="M104 44h20a56 56 0 0 1 0 112h-20zM119 62h5a27 38 0 0 1 0 76h-5z"/><path d="M96 44H76a56 56 0 0 0 0 112h20zM81 62h-5a27 38 0 0 0 0 76h5z"/></g></svg>';
  var BALL = "radial-gradient(circle at 30% 28%,#F2F78A 0 18%,transparent 19%),radial-gradient(circle at 62% 30%,#6B760F 0 7%,transparent 8%),radial-gradient(circle at 34% 62%,#6B760F 0 7%,transparent 8%),radial-gradient(circle at 70% 66%,#6B760F 0 6%,transparent 7%),radial-gradient(circle at 50% 46%,#6B760F 0 5%,transparent 6%),radial-gradient(circle at 38% 34%,#E8EF5A,#C9D530 60%,#8E9A12)";
  var css =
    "#dd-tx{position:fixed;inset:0;z-index:2147483000;pointer-events:none;visibility:hidden}" +
    "#dd-tx .p{position:absolute;inset:0;background:radial-gradient(ellipse at 50% 30%,#2A3858 0%,#1D2840 55%,#121a2e 100%);clip-path:inset(100% 0 0 0);transition:clip-path .36s cubic-bezier(.7,0,.25,1)}" +
    "#dd-tx .p:before{content:'';position:absolute;left:0;right:0;top:50%;height:2px;background:#C9A86B;opacity:.85;transform:scaleX(0);transform-origin:left;transition:transform .5s .12s cubic-bezier(.2,.8,.2,1)}" +
    "#dd-tx .p:after{content:'';position:absolute;left:0;right:0;top:calc(50% - 14vh);height:28vh;border-top:1px solid rgba(244,239,227,.14);border-bottom:1px solid rgba(244,239,227,.14);background:rgba(201,168,107,.05)}" +
    "#dd-tx .m{position:absolute;left:50%;top:calc(50% - 110px);width:64px;height:64px;margin-left:-32px;color:#F4EFE3;opacity:0;transform:translateY(10px);transition:opacity .25s .12s,transform .35s .12s}" +
    "#dd-tx .w{position:absolute;left:0;right:0;top:calc(50% - 36px);text-align:center;font:600 11px/1 Archivo,'DM Sans',system-ui,sans-serif;letter-spacing:.32em;text-transform:uppercase;color:#C9A86B;opacity:0;transition:opacity .25s .18s}" +
    "#dd-tx .b{position:absolute;left:-40px;top:calc(50% - 26px);width:22px;height:22px;border-radius:50%;background:" + BALL + ";box-shadow:0 6px 10px rgba(0,0,0,.35);opacity:0}" +
    "#dd-tx.on{visibility:visible;pointer-events:auto}#dd-tx.on .p{clip-path:inset(0 0 0 0)}#dd-tx.on .p:before{transform:scaleX(1)}#dd-tx.on .m{opacity:1;transform:none}#dd-tx.on .w{opacity:1}" +
    "#dd-tx.on .b{opacity:1;animation:ddDink .9s cubic-bezier(.3,0,.7,1) .1s both}" +
    "#dd-tx.out{visibility:visible}#dd-tx.out .p{clip-path:inset(0 0 100% 0);transition:clip-path .42s cubic-bezier(.7,0,.25,1)}#dd-tx.out .m,#dd-tx.out .w{opacity:0;transition:opacity .15s}" +
    "@keyframes ddDink{0%{transform:translate(0,0)}25%{transform:translate(28vw,-9vh)}50%{transform:translate(50vw,0) scale(1.05,.9)}75%{transform:translate(72vw,-6vh)}100%{transform:translate(calc(100vw + 60px),0)}}" +
    "#dd-roll{position:fixed;left:0;right:0;top:env(safe-area-inset-top,0px);height:3px;z-index:2147482000;pointer-events:none}" +
    "#dd-roll i{position:absolute;left:0;top:1px;height:1px;width:100%;transition:opacity .2s;background:linear-gradient(90deg,#C9A86B,#9C7A45);transform-origin:left;transform:scaleX(0)}" +
    "#dd-roll b{position:absolute;top:-5px;left:0;width:12px;height:12px;border-radius:50%;background:" + BALL + ";box-shadow:0 2px 4px rgba(0,0,0,.25);margin-left:-6px;opacity:0;transition:opacity .2s}" +
    "#dd-lob{position:fixed;right:max(16px,env(safe-area-inset-right));bottom:calc(16px + env(safe-area-inset-bottom,0px));z-index:88;width:52px;height:52px;border-radius:50%;border:1px solid rgba(201,168,107,.55);background:#1D2840;color:#F4EFE3;display:grid;place-items:center;cursor:pointer;box-shadow:0 10px 24px rgba(20,27,46,.3);opacity:0;transform:translateY(16px) scale(.9);pointer-events:none;transition:opacity .25s,transform .25s}" +
    "#dd-lob.show{opacity:1;transform:none;pointer-events:auto}#dd-lob svg{width:26px;height:26px}#dd-lob:hover{background:#2A3858}#dd-lob:focus-visible{outline:2px solid #C9A86B;outline-offset:3px}" +
    "#dd-lob .lb{position:absolute;left:50%;top:-6px;width:9px;height:9px;margin-left:-4px;border-radius:50%;background:" + BALL + "}" +
    "#dd-lob.go .lb{animation:ddLob .55s cubic-bezier(.2,.7,.4,1) both}@keyframes ddLob{0%{transform:none}100%{transform:translate(-40px,-70vh) scale(.6);opacity:0}}" +
    ".dd-rv{opacity:0;transform:translateY(18px);transition:opacity .7s cubic-bezier(.16,1,.3,1),transform .7s cubic-bezier(.16,1,.3,1)}.dd-rv.dd-in{opacity:1;transform:none}" +
    ".dd-ul{position:relative}.dd-ul:after{content:'';display:block;width:56px;height:2px;margin-top:12px;background:#C9A86B;transform:scaleX(0);transform-origin:left;transition:transform .7s .2s cubic-bezier(.16,1,.3,1)}.dd-ul.dd-in:after{transform:scaleX(1)}" +
    "[dir=rtl] .dd-ul:after{transform-origin:right}" +
    "@media (max-width:760px){#dd-roll b{display:none}#dd-lob{bottom:calc(96px + env(safe-area-inset-bottom,0px))}}@media (prefers-reduced-motion:reduce){#dd-tx,#dd-roll b{display:none}.dd-rv{opacity:1;transform:none}}";
  var st = d.createElement("style"); st.id = "dd-tx-css"; st.textContent = css; (d.head || de).appendChild(st);

  var ov = null;
  function overlay() {
    if (ov) return ov;
    ov = d.createElement("div"); ov.id = "dd-tx"; ov.setAttribute("aria-hidden", "true");
    ov.innerHTML = '<div class="p"></div><div class="m">' + MARK + '</div><div class="w">Dink Different</div><div class="b"></div>';
    (d.body || de).appendChild(ov); return ov;
  }

  // Arrival: lift the panel like a serve.
  var arrived = false; try { arrived = sessionStorage.getItem(KEY) === "1"; sessionStorage.removeItem(KEY); } catch (e) {}
  if (arrived && !reduce && !noOverlay) {
    var o = overlay(); o.classList.add("on"); o.querySelector(".b").style.animation = "none";
    var lift = function () { requestAnimationFrame(function () { o.classList.remove("on"); o.classList.add("out"); setTimeout(function () { o.classList.remove("out"); }, 500); }); };
    if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", function () { setTimeout(lift, 60); }); else setTimeout(lift, 60);
  }

  // Leaving: drop the panel, dink the ball, then go.
  function internal(a) {
    if (!a || !a.href || a.target && a.target !== "_self" || a.hasAttribute("download") || a.dataset.noTx !== undefined) return false;
    var u; try { u = new URL(a.href, location.href); } catch (e) { return false; }
    if (u.origin !== location.origin || !/^https?:$/.test(u.protocol)) return false;
    if (u.pathname === location.pathname && u.search === location.search) return false; // same page / hash
    if (/\.(pdf|zip|jpg|jpeg|png|mp4|xlsx|svg|json)$/i.test(u.pathname) || /^\/(api|assets)\//.test(u.pathname)) return false;
    return u;
  }
  d.addEventListener("click", function (e) {
    if (reduce || noOverlay || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    var a = e.target.closest && e.target.closest("a"); var u = internal(a); if (!u) return;
    e.preventDefault();
    var o = overlay(); o.classList.remove("out"); void o.offsetWidth; o.classList.add("on");
    try { sessionStorage.setItem(KEY, "1"); } catch (x) {}
    setTimeout(function () { location.href = u.href; }, 420);
  });
  window.addEventListener("pageshow", function (e) { if (e.persisted && ov) { ov.classList.remove("on", "out"); } });

  function ready(fn) { if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", fn); else fn(); }
  ready(function () {
    if (noOverlay) return;
    // Ball scroll bar
    var roll = d.createElement("div"); roll.id = "dd-roll"; roll.setAttribute("aria-hidden", "true"); roll.innerHTML = "<i></i><b></b>"; d.body.appendChild(roll);
    var line = roll.firstChild, ball = roll.lastChild;
    // Lob to top
    var lob = d.createElement("button"); lob.id = "dd-lob"; lob.type = "button"; lob.setAttribute("aria-label", "Back to top");
    lob.innerHTML = '<span class="lb"></span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 19V7"/><path d="M6.5 12.5 12 7l5.5 5.5"/></svg>';
    d.body.appendChild(lob);
    lob.addEventListener("click", function () { lob.classList.remove("go"); void lob.offsetWidth; lob.classList.add("go"); window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" }); });
    var tick = false;
    function onScroll() {
      if (tick) return; tick = true;
      requestAnimationFrame(function () {
        tick = false;
        var max = Math.max(1, de.scrollHeight - innerHeight), p = Math.min(1, Math.max(0, scrollY / max)), long = de.scrollHeight > innerHeight * 1.6;
        line.style.transform = "scaleX(" + p + ")";
        ball.style.opacity = long && scrollY > innerHeight * .5 ? 1 : 0; line.style.opacity = scrollY > innerHeight * .5 ? 1 : 0;
        ball.style.transform = "translateX(" + (p * innerWidth) + "px) rotate(" + (scrollY * .6) + "deg)";
        lob.classList.toggle("show", scrollY > innerHeight * 1.4);
      });
    }
    addEventListener("scroll", onScroll, { passive: true }); addEventListener("resize", onScroll); onScroll();
    // Headings rise in with a brass underline
    if (!("IntersectionObserver" in window) || reduce) return;
    var hs = [].slice.call(d.querySelectorAll("main h2, section h2, .section h2")).filter(function (h) {
      if (h.closest("nav,.menu,#hub,.post,.card,footer,[data-no-rv],.taglines,.show,.hero,[aria-hidden=true]") || h.hasAttribute("data-tagline")) return false;
      var cs = getComputedStyle(h); // leave anything another script animates or positions
      if (cs.position !== "static" || cs.opacity !== "1" || cs.animationName !== "none" || cs.transform !== "none" || cs.display === "none") return false;
      return h.getBoundingClientRect().top > innerHeight * .9;
    });
    var io = new IntersectionObserver(function (es) { es.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add("dd-in"); io.unobserve(en.target); } }); }, { threshold: .2 });
    hs.forEach(function (h) { h.classList.add("dd-rv"); if (getComputedStyle(h).textAlign !== "center") h.classList.add("dd-ul"); io.observe(h); });
  });
})();
