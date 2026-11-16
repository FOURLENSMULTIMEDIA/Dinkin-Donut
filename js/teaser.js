// Opening-soon commercial: plays full screen before the site, once per browser session.
// Starts muted (browsers block sound until a tap), tap anywhere for sound, "Enter site" to skip.
(function () {
  try { if (sessionStorage.getItem("dd-teaser")) return; sessionStorage.setItem("dd-teaser", "1"); } catch (e) { return; }
  window.DD_TEASER = true; // the short intro steps aside while this plays
  var tall = matchMedia("(orientation: portrait)").matches;
  var src = "/assets/video/opening-soon-" + (tall ? "9x16" : "16x9") + ".mp4";
  var css = document.createElement("style");
  css.textContent =
    "#teaser{position:fixed;inset:0;z-index:1000;background:#3B2416;display:grid;place-items:center;transition:opacity .6s cubic-bezier(.76,0,.24,1),transform .6s cubic-bezier(.76,0,.24,1)}" +
    "#teaser.bye{opacity:0;transform:scale(1.04);pointer-events:none}" +
    "#teaser video{width:100%;height:100%;object-fit:contain;background:#3B2416}" +
    "#teaser .tb{position:absolute;left:0;right:0;bottom:calc(22px + env(safe-area-inset-bottom,0px));display:flex;justify-content:center;gap:10px;padding:0 16px}" +
    "#teaser button{font:700 15px 'DM Sans',system-ui,sans-serif;border:0;border-radius:999px;padding:13px 22px;cursor:pointer}" +
    "#teaser .snd{background:rgba(255,246,234,.14);color:#FFF6EA;backdrop-filter:blur(8px)}" +
    "#teaser .go{background:#D7F03C;color:#3B2416}" +
    "#teaser .bar{position:absolute;left:0;top:0;height:3px;background:#FF5FA2;width:0}";
  document.head.appendChild(css);
  var el = document.createElement("div");
  el.id = "teaser";
  el.innerHTML = '<video playsinline autoplay muted preload="auto" src="' + src + '"></video><div class="bar"></div>' +
    '<div class="tb"><button class="snd" type="button">Tap for sound</button><button class="go" type="button">Enter site &rarr;</button></div>';
  var v = el.querySelector("video"), snd = el.querySelector(".snd"), bar = el.querySelector(".bar");
  function done() {
    if (el.classList.contains("bye")) return;
    el.classList.add("bye"); try { v.pause(); } catch (e) {}
    document.documentElement.style.overflow = ""; window.SiteSound && SiteSound.duck(false);
    setTimeout(function () { el.remove(); }, 650);
  }
  function sound() { window.SiteSound && SiteSound.duck(true); v.muted = false; v.play().catch(function () {}); snd.textContent = "Sound on"; snd.disabled = true; }
  snd.onclick = function (e) { e.stopPropagation(); sound(); };
  el.querySelector(".go").onclick = function (e) { e.stopPropagation(); done(); };
  v.addEventListener("click", function () { if (v.muted) sound(); });
  v.addEventListener("ended", done);
  v.addEventListener("error", done);
  v.addEventListener("timeupdate", function () { if (v.duration) bar.style.width = (v.currentTime / v.duration * 100) + "%"; });
  document.addEventListener("keydown", function k(e) { if (e.key === "Escape") { done(); document.removeEventListener("keydown", k); } });
  function mount() { document.body.appendChild(el); document.documentElement.style.overflow = "hidden"; v.play().catch(function () {}); }
  if (document.body) mount(); else document.addEventListener("DOMContentLoaded", mount);
})();
