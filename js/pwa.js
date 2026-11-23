// Dink Different app: install (iOS, Android, Mac, Windows) + offline support.
(function () {
  if ("serviceWorker" in navigator && location.protocol === "https:" || location.hostname === "localhost") {
    if ("serviceWorker" in navigator) addEventListener("load", function () { navigator.serviceWorker.register("/sw.js").catch(function () {}); });
  }
  var standalone = matchMedia("(display-mode: standalone)").matches || navigator.standalone === true;
  var ios = /iphone|ipad|ipod/i.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  var deferred = null;
  addEventListener("beforeinstallprompt", function (e) { e.preventDefault(); deferred = e; offer(); });
  addEventListener("appinstalled", function () { deferred = null; var c = document.getElementById("dd-install"); if (c) c.remove(); });

  var css = document.createElement("style");
  css.textContent =
    "#dd-install{position:fixed;left:50%;bottom:calc(16px + env(safe-area-inset-bottom,0px));transform:translateX(-50%);z-index:90;display:flex;align-items:center;gap:12px;padding:10px 10px 10px 14px;border-radius:999px;background:#1D2840;color:#F4EFE3;font:600 14px 'DM Sans',system-ui,sans-serif;box-shadow:0 16px 40px rgba(0,0,0,.35);max-width:calc(100vw - 24px)}" +
    "#dd-install img{width:32px;height:32px;border-radius:9px}#dd-install b{display:block;font-size:14px}#dd-install small{opacity:.7;font-size:12px}" +
    "#dd-install .go{border:0;border-radius:999px;padding:10px 14px;background:#E2D2A6;color:#1D2840;font:700 13px 'DM Sans',system-ui;cursor:pointer}#dd-install .x{border:0;background:none;color:#F4EFE3;opacity:.6;font-size:18px;cursor:pointer;padding:4px 6px}" +
    "#dd-sheet{position:fixed;inset:0;z-index:95;background:rgba(14,20,34,.6);display:grid;align-items:end}#dd-sheet>div{background:#F4EFE3;color:#1D2840;border-radius:24px 24px 0 0;padding:24px 20px calc(24px + env(safe-area-inset-bottom,0px));font:16px/1.5 'DM Sans',system-ui;max-width:560px;margin:0 auto;width:100%}" +
    "#dd-sheet h3{font:700 24px Fraunces,system-ui;margin:0 0 6px}#dd-sheet ol{padding-left:20px;margin:12px 0}#dd-sheet li{margin:6px 0}#dd-sheet button{width:100%;border:0;border-radius:999px;padding:14px;background:#1D2840;color:#F4EFE3;font:700 15px 'DM Sans';margin-top:8px;cursor:pointer}" +
    "#dd-off{position:fixed;top:calc(10px + env(safe-area-inset-top,0px));left:50%;transform:translateX(-50%);z-index:96;padding:7px 14px;border-radius:999px;background:#9C7A45;color:#fff;font:700 12px 'DM Sans',system-ui;letter-spacing:.04em;box-shadow:0 8px 20px rgba(0,0,0,.2)}";
  document.head.appendChild(css);

  function dismissed() { try { return Date.now() - Number(localStorage.getItem("dd-install-x") || 0) < 7 * 864e5; } catch (e) { return false; } }
  function offer() {
    if (standalone || dismissed() || document.getElementById("dd-install") || !document.body) return;
    var d = document.createElement("div"); d.id = "dd-install";
    d.innerHTML = '<img src="/assets/app/icon-192.png" alt=""><span><b>Get the Dink Different app</b><small>Works offline · no app store needed</small></span><button class="go" type="button">Install</button><button class="x" type="button" aria-label="Not now">×</button>';
    d.querySelector(".go").onclick = install; d.querySelector(".x").onclick = function () { try { localStorage.setItem("dd-install-x", Date.now()); } catch (e) {} d.remove(); };
    document.body.appendChild(d);
  }
  function install() {
    if (deferred) { deferred.prompt(); deferred.userChoice.finally(function () { deferred = null; var c = document.getElementById("dd-install"); if (c) c.remove(); }); return; }
    var s = document.createElement("div"); s.id = "dd-sheet";
    s.innerHTML = ios
      ? '<div><h3>Add Dink Different to your Home Screen</h3>It installs like an app and works offline.<ol><li>Tap the <b>Share</b> button (the square with an arrow) in Safari.</li><li>Scroll and tap <b>Add to Home Screen</b>.</li><li>Tap <b>Add</b>. The club crest appears on your Home Screen.</li></ol><button type="button">Got it</button></div>'
      : '<div><h3>Install the app</h3><ol><li><b>Chrome / Edge on Mac or Windows:</b> click the install icon at the right of the address bar, or menu ⋮ → <b>Install Dink Different</b>.</li><li><b>Safari on Mac:</b> File → <b>Add to Dock</b>.</li><li><b>Android:</b> menu ⋮ → <b>Install app</b>.</li></ol><button type="button">Got it</button></div>';
    s.onclick = function (e) { if (e.target === s || e.target.tagName === "BUTTON") s.remove(); };
    document.body.appendChild(s);
  }
  window.DDInstall = install;
  // iOS never fires beforeinstallprompt: offer the guide once, a little after load
  if (ios && !standalone) setTimeout(offer, 6000);

  function net() { var o = document.getElementById("dd-off"); if (!navigator.onLine) { if (!o && document.body) { o = document.createElement("div"); o.id = "dd-off"; o.textContent = "Offline mode · saved content still works"; document.body.appendChild(o); } } else if (o) o.remove(); }
  addEventListener("online", net); addEventListener("offline", net); addEventListener("load", net);
})();
