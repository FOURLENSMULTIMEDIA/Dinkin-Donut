// Puts the official Instagram and WhatsApp marks on every social link, including ones added later.
(function () {
  var IG = '<svg viewBox="0 0 24 24" aria-hidden="true"><defs><radialGradient id="igg" cx="30%" cy="107%" r="150%"><stop offset="0" stop-color="#fdf497"/><stop offset=".05" stop-color="#fdf497"/><stop offset=".45" stop-color="#fd5949"/><stop offset=".6" stop-color="#d6249f"/><stop offset=".9" stop-color="#285AEB"/></radialGradient></defs><rect width="24" height="24" rx="6" fill="url(#igg)"/><rect x="5" y="5" width="14" height="14" rx="4.2" fill="none" stroke="#fff" stroke-width="1.8"/><circle cx="12" cy="12" r="3.3" fill="none" stroke="#fff" stroke-width="1.8"/><circle cx="16.4" cy="7.6" r="1.1" fill="#fff"/></svg>';
  var WA = '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="12" fill="#25D366"/><path fill="#fff" d="M12 4.6a7.3 7.3 0 0 0-6.3 11l-1 3.8 3.9-1A7.3 7.3 0 1 0 12 4.6zm0 13.3c-1.1 0-2.2-.3-3.1-.9l-.2-.1-2.3.6.6-2.2-.1-.2A6 6 0 1 1 12 17.9zm3.3-4.5c-.2-.1-1.1-.5-1.2-.6-.2-.1-.3-.1-.4.1l-.6.7c-.1.1-.2.1-.4 0a4.9 4.9 0 0 1-2.4-2.1c-.2-.3.2-.3.5-1 .1-.1 0-.2 0-.3l-.5-1.3c-.1-.3-.3-.3-.4-.3h-.4a.7.7 0 0 0-.5.3c-.2.2-.7.6-.7 1.6s.7 1.9.8 2c.1.1 1.4 2.1 3.4 3 1.3.5 1.7.6 2.4.5.4-.1 1.1-.5 1.3-.9.2-.4.2-.8.1-.9l-.4-.2z"/></svg>';
  var st = document.createElement("style");
  st.textContent = ".soc-i{display:inline-block;width:1.15em;height:1.15em;vertical-align:-.2em;margin-right:.4em;flex:none}.soc-i svg{width:100%;height:100%;display:block}";
  document.head.appendChild(st);
  function mark(root) {
    (root.querySelectorAll ? root : document).querySelectorAll('a[href*="instagram.com"],a[href*="wa.me"],a[href*="chat.whatsapp.com"]').forEach(function (a) {
      if (a.querySelector(".soc-i,svg,img") || a.dataset.noicon != null) return;
      var s = document.createElement("span"); s.className = "soc-i";
      s.innerHTML = /instagram/.test(a.href) ? IG : WA;
      a.insertBefore(s, a.firstChild);
    });
  }
  function go() { mark(document); new MutationObserver(function (m) { m.forEach(function (r) { r.addedNodes.forEach(function (n) { if (n.nodeType === 1) mark(n.parentNode || n); }); }); }).observe(document.body, { childList: true, subtree: true }); }
  if (document.body) go(); else document.addEventListener("DOMContentLoaded", go);
})();
