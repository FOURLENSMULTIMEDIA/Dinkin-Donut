// Shared helpers for every Dinkin' Donut page.

// Line icons, 24px grid, 1.75 stroke. Inherit currentColor.
const ICON_PATHS = {
  cash: '<rect x="2.5" y="6" width="19" height="12" rx="2"/><circle cx="12" cy="12" r="2.6"/><path d="M6 9.5v5M18 9.5v5"/>',
  fawran: '<path d="M13 2.5 5 13.5h6l-1 8 8-11h-6z"/>',
  card: '<rect x="2.5" y="5" width="19" height="14" rx="2.2"/><path d="M2.5 9.5h19M6.5 15h4"/>',
  trophy: '<path d="M7 4h10v5a5 5 0 0 1-10 0z"/><path d="M7 6H4a3 3 0 0 0 3 4M17 6h3a3 3 0 0 1-3 4M12 14v3.5M8.5 20.5h7M9.5 17.5h5v3h-5z"/>',
  target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.4"/>',
  repeat: '<path d="M4 11V9a3 3 0 0 1 3-3h12l-3-3M20 13v2a3 3 0 0 1-3 3H5l3 3"/>',
  sprout: '<path d="M12 21v-8M12 13c0-4-3-6-7-6 0 4 3 6 7 6zM12 11c0-3.5 2.5-6 6.5-6 0 3.5-2.5 6-6.5 6z"/>',
  ring: '<circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="3"/>',
  flame: '<path d="M12 21.5c-4 0-6.5-2.7-6.5-6.2 0-3.6 2.6-5.6 3.6-8.8 2 1.3 2.6 3 2.4 4.6 1.3-.8 2.3-2.4 2.4-4.6 2.6 2 4.6 5 4.6 8.8 0 3.5-2.5 6.2-6.5 6.2z"/>',
  clock: '<circle cx="12" cy="13" r="8"/><path d="M12 9v4l2.5 2M9.5 2.5h5"/>',
  check: '<path d="m5 12.5 4.5 4.5L19 7.5"/>',
};
window.DD = {
  icon: (n, size = 16) => `<svg class="ic" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICON_PATHS[n] || ""}</svg>`,
  async get(pin) {
    const r = await fetch("/api/queue", { cache: "no-store", headers: pin ? { "x-host-pin": pin } : {} });
    if (!r.ok) throw new Error("Can't reach the queue right now.");
    return r.json();
  },
  async send(action, pin) {
    const r = await fetch("/api/queue", {
      method: "POST",
      headers: { "Content-Type": "application/json", ...(pin ? { "x-host-pin": pin } : {}) },
      body: JSON.stringify(action),
    });
    const j = await r.json().catch(() => ({ error: "Unexpected reply from server." }));
    if (!r.ok) throw new Error(j.error || "Something went wrong.");
    return j;
  },
  // Poll the shared queue; slows down when the tab is hidden.
  live(onState, ms = 3000, pinFn) {
    let timer, last = -1;
    const run = async () => {
      try { const S = await DD.get(pinFn && pinFn()); if (S.v !== last) { last = S.v; onState(S); } DD.status(true); }
      catch { DD.status(false); }
      timer = setTimeout(run, document.hidden ? ms * 4 : ms);
    };
    run();
    document.addEventListener("visibilitychange", () => { if (!document.hidden) { clearTimeout(timer); run(); } });
    return { now() { clearTimeout(timer); last = -1; run(); } };
  },
  status(ok) { document.querySelectorAll("[data-conn]").forEach(el => { el.dataset.conn = ok ? "on" : "off"; }); },
  esc: s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])),
  team: (S, ids) => ids.map(id => DD.esc(S.players[id]?.name || "?")).join(" &amp; "),
  clock(start) { const s = Math.max(0, Math.floor((Date.now() - start) / 1000)); return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`; },
  pct: p => (p.w + p.l ? p.w / (p.w + p.l) : 0),
  ranked: S => Object.values(S.players).sort((a, b) => b.w - a.w || DD.pct(b) - DD.pct(a) || (b.pf - b.pa) - (a.pf - a.pa) || a.name.localeCompare(b.name)),
  qr(el, text, size = 220) {
    if (!window.qrcode) { el.textContent = text; return; }
    const q = qrcode(0, "M"); q.addData(text); q.make();
    el.innerHTML = q.createSvgTag({ cellSize: Math.max(2, Math.floor(size / q.getModuleCount())), margin: 0, scalable: true });
    const svg = el.querySelector("svg"); svg.setAttribute("role", "img"); svg.setAttribute("aria-label", "QR code to " + text);
    svg.querySelectorAll("path,rect").forEach(n => { if (n.getAttribute("fill") === "#000000") n.setAttribute("fill", "#3B2416"); if (n.getAttribute("fill") === "#ffffff") n.setAttribute("fill", "transparent"); });
  },
  queueUrl: () => location.origin + "/queue",
  qar: n => (Math.round(n * 100) / 100).toLocaleString("en", { maximumFractionDigits: 2 }) + " QAR",
};
setInterval(() => document.querySelectorAll("[data-start]").forEach(el => { el.textContent = DD.clock(+el.dataset.start); }), 1000);
