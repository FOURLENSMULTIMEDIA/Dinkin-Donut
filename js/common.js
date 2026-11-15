// Shared helpers for every Dinkin' Donut page.
window.DD = {
  async get() {
    const r = await fetch("/api/queue", { cache: "no-store" });
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
  live(onState, ms = 3000) {
    let timer, last = -1;
    const run = async () => {
      try { const S = await DD.get(); if (S.v !== last) { last = S.v; onState(S); } DD.status(true); }
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
};
setInterval(() => document.querySelectorAll("[data-start]").forEach(el => { el.textContent = DD.clock(+el.dataset.start); }), 1000);
