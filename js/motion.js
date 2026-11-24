// Motion system: scroll reveals, masked headline reveals, hero parallax, grain on dark surfaces.
// Progressive: nothing is hidden unless this script runs and motion is allowed.
(function () {
  var reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  var GRAIN = ".join, .footer, .show, .duprband, .team, .punch, .dhero, .merchband, .film, .ad";
  var GROUPS = [".night .slot", ".rules li", ".split > .card", ".contacts.big .ct-pill", ".faq details", ".shelf .it", ".specs > div", ".how > div", ".steps > li", ".cmp > div", ".cardband, .duprband, .merchband, .show, .ad", ".builder > *"];

  function ready(f) { if (document.readyState !== "loading") f(); else document.addEventListener("DOMContentLoaded", f); }
  ready(function () {
    document.querySelectorAll(GRAIN).forEach(function (el) { el.classList.add("grain"); });
    if (reduce || !("IntersectionObserver" in window)) return;
    document.documentElement.classList.add("motion");

    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.12 });
    var vh = innerHeight;
    function watch(el, i) {
      // Already on screen at load: show immediately, never flash content
      if (el.getBoundingClientRect().top < vh * 0.92) { el.classList.add("in"); return; }
      el.style.setProperty("--rv-i", i); el.classList.add("rv"); io.observe(el);
    }
    GROUPS.forEach(function (sel) { document.querySelectorAll(sel).forEach(function (el, i) { watch(el, i % 6); }); });

    // Section headings: masked slide-up
    document.querySelectorAll(".sec-h h2, .shop-h h2, .mhero h1, .lhero h1, .dhero h1").forEach(function (h) {
      if (h.getBoundingClientRect().top < vh * 0.92) return;
      var parts = [];
      h.childNodes.forEach(function (n) { parts.push(n); });
      h.innerHTML = "";
      parts.forEach(function (n, i) { var line = document.createElement("span"); line.className = "mask-line"; line.style.setProperty("--ml-i", i); var inner = document.createElement("span"); inner.appendChild(n); line.appendChild(inner); h.appendChild(line); });
      io.observe(h);
    });

    // Hero badge leans toward the pointer (desktop)
    var mark = document.querySelector(".hero .mark img");
    if (mark && matchMedia("(hover: hover)").matches) {
      var tx = 0, ty = 0, x = 0, y = 0, raf = 0;
      addEventListener("pointermove", function (e) { tx = (e.clientX / innerWidth - 0.5) * 2; ty = (e.clientY / innerHeight - 0.5) * 2; if (!raf) raf = requestAnimationFrame(step); }, { passive: true });
      function step() { x += (tx - x) * 0.08; y += (ty - y) * 0.08; mark.style.translate = (x * 14) + "px " + (y * 10) + "px"; mark.style.rotate = (x * 6) + "deg"; raf = Math.abs(tx - x) + Math.abs(ty - y) > 0.002 ? requestAnimationFrame(step) : 0; }
    }
  });
})();
