// Full-screen menu: circular reveal from the Menu button, staggered links, Esc and link-click to close.
(function () {
  var btn = document.getElementById("menuBtn"), m = document.getElementById("menu"); if (!btn || !m) return;
  m.querySelectorAll(".menu-links a").forEach(function (a, i) { a.style.setProperty("--mi", i); });
  function open() { m.hidden = false; requestAnimationFrame(function () { requestAnimationFrame(function () { m.classList.add("open"); }); }); btn.setAttribute("aria-expanded", "true"); document.documentElement.style.overflow = "hidden"; setTimeout(function () { var c = document.getElementById("menuClose"); c && c.focus(); }, 300); }
  function close() { m.classList.remove("open"); btn.setAttribute("aria-expanded", "false"); document.documentElement.style.overflow = ""; setTimeout(function () { if (!m.classList.contains("open")) m.hidden = true; }, 700); btn.focus(); }
  btn.addEventListener("click", function () { m.classList.contains("open") ? close() : open(); });
  document.getElementById("menuClose").addEventListener("click", close);
  m.addEventListener("click", function (e) { if (e.target.closest(".menu-links a, .menu-foot a")) close(); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape" && m.classList.contains("open")) close(); });
})();
