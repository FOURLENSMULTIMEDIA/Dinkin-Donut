// Contact pills with Instagram / WhatsApp marks. Fills any element with [data-contact].
(function () {
  var C = window.CLUB || {};
  var IG = '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5.5" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="12" cy="12" r="4.2" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="17.3" cy="6.7" r="1.3" fill="currentColor"/></svg>';
  var WA = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.5a9.5 9.5 0 0 0-8.2 14.3L2.5 21.5l4.8-1.3A9.5 9.5 0 1 0 12 2.5z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path d="M8.6 7.4c.3-.6.6-.6.9-.6h.6c.2 0 .4 0 .6.5l.8 1.9c.1.2.1.4 0 .6l-.5.7c-.1.2-.2.3 0 .6.4.7 1 1.4 1.7 2 .7.6 1.4 1 2 1.2.2.1.4.1.6-.1l.7-.9c.2-.2.4-.2.6-.1l1.8.9c.3.1.4.2.4.4 0 .5-.2 1.2-.7 1.6-.5.4-1.3.8-2.4.5-1.2-.3-2.7-.9-4.2-2.3-1.6-1.4-2.6-3.1-2.9-4.2-.3-1.1.1-1.9.5-2.4z" fill="currentColor"/></svg>';
  function wa(n) { return "https://wa.me/" + String(n).replace(/\D/g, ""); }
  function handle(u) { var m = String(u).match(/instagram\.com\/([^/?#]+)/); return m ? "@" + m[1] : "Instagram"; }
  var items = [];
  if (C.instagram) items.push({ cls: "ig", icon: IG, label: handle(C.instagram), sub: "Instagram", href: C.instagram });
  (C.whatsappNumbers || []).forEach(function (n) { items.push({ cls: "wa", icon: WA, label: n, sub: "WhatsApp", href: wa(n) }); });
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll("[data-contact]").forEach(function (el) {
      el.classList.add("contacts", el.dataset.contact === "big" ? "big" : "pills");
      el.innerHTML = items.map(function (i) {
        return '<a class="ct-pill ' + i.cls + '" href="' + esc(i.href) + '" target="_blank" rel="noopener"><span class="ct-ic">' + i.icon + '</span><span class="ct-tx"><small>' + i.sub + "</small>" + esc(i.label) + "</span></a>";
      }).join("");
    });
  });
})();
