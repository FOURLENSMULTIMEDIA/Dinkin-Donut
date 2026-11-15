// Light / Auto / Dark. Load in <head> so the page never flashes the wrong theme.
(function () {
  var KEY = "dd-theme", root = document.documentElement;
  function get() { try { return localStorage.getItem(KEY) || "auto"; } catch (e) { return "auto"; } }
  function apply(m) {
    if (m === "auto") root.removeAttribute("data-theme"); else root.setAttribute("data-theme", m);
    var dark = m === "dark" || (m === "auto" && matchMedia("(prefers-color-scheme: dark)").matches);
    var meta = document.querySelector('meta[name="theme-color"]'); if (meta) meta.content = dark ? "#1A110B" : "#FFF6EA";
    document.querySelectorAll(".theme button").forEach(function (b) { b.setAttribute("aria-pressed", b.dataset.mode === m); });
  }
  apply(get());
  var icons = {
    light: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>',
    auto: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="M12 3a9 9 0 0 1 0 18z" fill="currentColor"/></svg>',
    dark: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M21 13A9 9 0 1 1 11 3a7 7 0 0 0 10 10z"/></svg>'
  };
  var labels = { light: "Light mode", auto: "Match my device", dark: "Dark mode" };
  document.addEventListener("DOMContentLoaded", function () {
    var nav = document.querySelector(".nav .wrap"); if (!nav) return;
    var box = document.createElement("div"); box.className = "theme"; box.setAttribute("role", "group"); box.setAttribute("aria-label", "Colour theme");
    box.innerHTML = ["light", "auto", "dark"].map(function (m) { return '<button type="button" data-mode="' + m + '" title="' + labels[m] + '" aria-label="' + labels[m] + '">' + icons[m] + "</button>"; }).join("");
    var anchor = nav.querySelector(".btn, .chip"); nav.insertBefore(box, anchor || null);
    if (anchor && getComputedStyle(anchor).marginLeft === "0px") box.style.marginLeft = "auto";
    box.addEventListener("click", function (e) { var b = e.target.closest("button"); if (!b) return; try { localStorage.setItem(KEY, b.dataset.mode); } catch (x) {} apply(b.dataset.mode); });
    apply(get());
  });
  matchMedia("(prefers-color-scheme: dark)").addEventListener("change", function () { apply(get()); });
})();
