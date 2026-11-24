// Courtcall tenant layer. On /c/<club>, /c/<club>/host and /c/<club>/tv the same app runs for another club:
// its own data, PIN, name, logo and colours, plus the activation / plan screens.
(function () {
  var m = location.pathname.match(/^\/c\/([a-z0-9-]{3,32})(?:\/(host|tv|tournament))?\/?$/);
  if (!m) return;
  var slug = m[1], page = m[2] || "queue", BASE = "/c/" + slug;
  window.CC = { slug: slug, base: BASE, page: page, club: null };
  var WA = ["97430763431", "97430723503"];

  // 1. Separate storage per club (host token, player PIN, name…)
  var P = Storage.prototype, g = P.getItem, s = P.setItem, r = P.removeItem, ns = function (k) { return /^dd-/.test(k) ? "cc:" + slug + ":" + k : k; };
  P.getItem = function (k) { return g.call(this, ns(k)); };
  P.setItem = function (k, v) { return s.call(this, ns(k), v); };
  P.removeItem = function (k) { return r.call(this, ns(k)); };

  // 2. Every queue call goes to this club; locked clubs show the activation / upgrade screen
  var of = window.fetch.bind(window);
  window.fetch = function (u, o) {
    if (typeof u === "string" && (u.indexOf("/api/queue") === 0 || u.indexOf("/api/tournament") === 0)) u += (u.indexOf("?") > -1 ? "&" : "?") + "club=" + slug;
    else if (typeof u === "string" && /^\/api\/(members|founders|whatsapp)/.test(u)) return Promise.resolve(new Response(JSON.stringify({ list: [], members: [], cap: 0 }), { status: 200, headers: { "Content-Type": "application/json" } }));
    return of(u, o).then(function (res) {
      if (res.status === 402 && typeof u === "string" && /^\/api\/(queue|tournament)/.test(u)) res.clone().json().then(function (j) { if (j.locked) lock(j.club); else toast(j.error); }).catch(function () {});
      return res;
    });
  };

  // 3. Copy that belongs to Dink Different becomes neutral
  var SWAP = [[/Dink Different Pickleball Club/g, ""], [/Dink Different/g, ""], [/Club Pass/g, "Queue Pass"], [/The Honours Board/g, "Hall of Fame"], [/Dink different\.?/g, "See you on court."], [/Dinkers?\b/g, function (w) { return w === "Dinkers" ? "players" : "player"; }]];
  function swapText(root) {
    var name = (window.CC.club && window.CC.club.name) || "Your club";
    var w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT), n;
    while ((n = w.nextNode())) {
      var t = n.nodeValue, o = t;
      if (!/Dink|Club Pass|Honours|Dinker/.test(t)) continue;
      SWAP.forEach(function (p, i) { t = t.replace(p[0], i < 2 ? name : p[1]); });
      if (t !== o) n.nodeValue = t;
    }
  }
  function monogram(c) {
    var ini = (c.short || c.name).split(/\s+/).map(function (x) { return x[0]; }).join("").slice(0, 2).toUpperCase();
    return "data:image/svg+xml," + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="48" fill="' + c.color + '"/><circle cx="50" cy="50" r="41" fill="none" stroke="' + c.accent + '" stroke-width="3"/><text x="50" y="62" text-anchor="middle" font-family="Fraunces,Arial Rounded MT Bold,sans-serif" font-weight="700" font-size="36" fill="#fff">' + ini + "</text></svg>");
  }
  function shade(hex, k) { var n = parseInt(hex.slice(1), 16), f = function (x) { return Math.max(0, Math.min(255, Math.round(x * k))); }; return "#" + [n >> 16, (n >> 8) & 255, n & 255].map(function (x) { return f(x).toString(16).padStart(2, "0"); }).join(""); }

  function brand(c) {
    window.CC.club = c;
    var logo = c.logo || monogram(c), st = document.getElementById("cc-style") || document.head.appendChild(Object.assign(document.createElement("style"), { id: "cc-style" }));
    st.textContent = ":root,:root[data-theme]{--glaze:" + c.color + ";--glaze-deep:" + shade(c.color, .85) + ";--ball:" + c.accent + "}" +
      "#membersPanel,.gcpromo,a[href='/dupr'],a[href='/studio'],a[href^='/first-serve'],a[href='/merch'],a[href='/loyalty'],a[href^='/clubs?owner'],#hallZone,[data-dd-only]{display:none!important}" +
      "#cc-badge{position:fixed;left:50%;bottom:calc(14px + env(safe-area-inset-bottom,0px));transform:translateX(-50%);z-index:80;display:flex;align-items:center;gap:10px;padding:8px 8px 8px 14px;border-radius:999px;background:rgba(18,25,42,.92);color:#F4EFE3;font:600 13px 'DM Sans',system-ui,sans-serif;box-shadow:0 12px 30px rgba(0,0,0,.25);backdrop-filter:blur(8px)}" +
      "#cc-badge b{color:" + c.accent + "}#cc-badge a{background:" + c.color + ";color:#fff;text-decoration:none;font-weight:700;padding:7px 12px;border-radius:999px}" +
      "#cc-pow{position:fixed;right:12px;bottom:calc(10px + env(safe-area-inset-bottom,0px));z-index:70;font:600 11px 'DM Sans',system-ui,sans-serif;letter-spacing:.06em;opacity:.55;color:inherit;text-decoration:none}";
    document.querySelectorAll("img[src='/assets/logo.svg']").forEach(function (i) { i.src = logo; i.style.borderRadius = "50%"; });
    document.querySelectorAll("link[rel~=icon]").forEach(function (ic) { ic.href = logo; ic.removeAttribute("type"); ic.removeAttribute("sizes"); });
    document.title = document.title.replace(/Dink Different/, c.name);
    document.querySelectorAll("a[href]").forEach(function (a) {
      var h = a.getAttribute("href");
      if (h === "/" || h === "/queue") a.setAttribute("href", BASE);
      else if (h === "/host") a.setAttribute("href", BASE + "/host");
      else if (h === "/tv") a.setAttribute("href", BASE + "/tv");
      else if (h === "/tournament") a.setAttribute("href", BASE + "/tournament");
    });
    swapText(document.body);
    if (!window.CC.mo) { window.CC.mo = new MutationObserver(function (ms) { ms.forEach(function (x) { x.addedNodes.forEach(function (n) { if (n.nodeType === 1) swapText(n); else if (n.nodeType === 3 && n.parentNode) swapText(n.parentNode); }); }); }); window.CC.mo.observe(document.body, { childList: true, subtree: true }); }
    // trial / plan badge
    var a = c.access || {}, old = document.getElementById("cc-badge"); if (old) old.remove();
    if (a.phase === "active" && page === "host" && a.daysLeft <= 5) {
      var b = document.createElement("div"); b.id = "cc-badge";
      b.innerHTML = "<span>" + c.limits.label + " plan · <b>renews in " + a.daysLeft + " day" + (a.daysLeft === 1 ? "" : "s") + "</b></span>" + '<a href="' + waUrl(0, upgradeMsg(c)) + '" target="_blank" rel="noopener">Renew</a>';
      document.body.appendChild(b);
    }
    if (page === "host" && c.billing === "card" && !document.getElementById("cc-bill")) {
      var bl = document.createElement("button"); bl.id = "cc-bill"; bl.type = "button"; bl.textContent = c.paymentIssue ? "⚠ Update your card" : "Billing & invoices";
      bl.style.cssText = "position:fixed;left:12px;bottom:calc(10px + env(safe-area-inset-bottom,0px));z-index:70;font:700 12px 'DM Sans',system-ui;border:0;border-radius:999px;padding:8px 12px;cursor:pointer;background:" + (c.paymentIssue ? "#8E2F2F" : "rgba(18,25,42,.85)") + ";color:#fff";
      bl.onclick = billing; document.body.appendChild(bl);
      if (c.paymentIssue) toast("Your last card payment didn’t go through. Tap “Update your card” to keep your club running.");
    }
    if (!document.getElementById("cc-pow")) { var p = document.createElement("a"); p.id = "cc-pow"; p.href = "/clubs"; p.target = "_blank"; p.textContent = "Powered by Courtcall"; document.body.appendChild(p); }
  }
  function waUrl(i, text) { return "https://wa.me/" + WA[i] + "?text=" + encodeURIComponent(text); }
  function upgradeMsg(c) { return "Hi Courtcall! I’d like to switch on my club.\n\nClub: " + c.name + "\nLink: " + location.origin + BASE + "\nPlan: " + (c.plan ? c.plan[0].toUpperCase() + c.plan.slice(1) : "Club") + "\nRequest: " + (c.request || ""); }
  function toast(msg) {
    if (!msg) return; var t = document.createElement("div");
    t.style.cssText = "position:fixed;left:50%;top:20px;transform:translateX(-50%);z-index:9999;max-width:min(92vw,520px);padding:14px 18px;border-radius:16px;background:#12192A;color:#F4EFE3;font:600 15px 'DM Sans',system-ui,sans-serif;box-shadow:0 18px 40px rgba(0,0,0,.3)";
    t.textContent = msg; document.body.appendChild(t); setTimeout(function () { t.remove(); }, 5200);
  }

  // 4. Locked screen: waiting for approval, trial ended, or suspended
  function lock(c) {
    if (!c || document.getElementById("cc-lock")) return;
    brand(c);
    var a = c.access || {}, host = page === "host", esc = function (x) { return String(x || "").replace(/[&<>"]/g, function (k) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[k]; }); };
    var PL = [["starter", "Starter", 149, 39, "2 courts · 40 players"], ["club", "Club", 299, 79, "6 courts · 80 players"], ["venue", "Venue", 549, 149, "12 courts · 200 players"]];
    var plans = '<div class="iv" role="group" aria-label="Billing"><button type="button" data-iv="month" aria-pressed="true">Monthly</button><button type="button" data-iv="year" aria-pressed="false">Yearly · 2 months free</button></div>' +
      '<div class="plans">' + PL.map(function (p) {
        return '<div class="pc' + (p[0] === "club" ? " hot" : "") + '">' + (p[0] === "club" ? "<i>Most popular</i>" : "") + "<b>" + p[1] + '</b><em data-m="' + p[2] + " QAR/mo · ≈ $" + p[3] + '" data-y="' + p[2] * 10 + " QAR/yr · ≈ $" + p[3] * 10 + '">' + p[2] + " QAR/mo · ≈ $" + p[3] + "</em><small>" + p[4] + "</small>" +
          '<button class="b pay" type="button" data-pay="' + p[0] + '">Pay by card</button><a class="wa" data-noicon href="' + waUrl(0, upgradeMsg(Object.assign({}, c, { plan: p[0] }))) + '" target="_blank" rel="noopener">or pay on WhatsApp</a></div>';
      }).join("") + "</div>" +
      '<p class="err" id="ccErr"></p>' +
      '<p class="fine">Secure card payments by Stripe, charged in your local currency where available, with tax and invoices handled automatically. Have a code? Enter it at checkout. In Qatar you can also pay by Fawran on WhatsApp' + ' (<a href="' + waUrl(1, upgradeMsg(c)) + '" target="_blank" rel="noopener" data-noicon>2nd number</a>).</p>' +
      '<p class="fine">Request code <b>' + esc(c.request) + '</b></p>';
    var body;
    if (a.phase === "suspended") {
      body = '<span class="k">Paused</span><h1>This club is paused.</h1><p>Please contact Courtcall on WhatsApp to restore access.</p><div class="row"><a class="b pri" href="' + waUrl(0, "Hi Courtcall, about club " + c.name + " (" + BASE + ")") + '" target="_blank" rel="noopener">Message us</a></div>';
    } else if (a.phase === "pending") {
      body = host ? '<span class="k">One step left</span><h1>Let’s switch on ' + esc(c.name) + '.</h1><p>Your club is set up and waiting. Choose a plan and we’ll activate it personally on WhatsApp, so every club on Courtcall is a real one.</p>' + plans
        : '<span class="k">Coming soon</span><h1>' + esc(c.name) + ' is getting ready.</h1><p>The live queue opens as soon as the club is switched on. Check back on game night.</p>';
    } else {
      body = host ? '<span class="k">Your plan has ended</span><h1>Keep your nights running.</h1><p>Your players, settings and history are saved. Renew on WhatsApp and we’ll switch you back on within minutes.</p>' + plans
        : '<span class="k">Paused</span><h1>' + esc(c.name) + '’s live queue is paused.</h1><p>Please check with the club host.</p>';
    }
    var d = document.createElement("div"); d.id = "cc-lock";
    d.innerHTML = '<style>#cc-lock{position:fixed;inset:0;z-index:9000;overflow:auto;background:radial-gradient(1200px 600px at 80% -10%,' + c.color + '33,transparent),#12192A;color:#F4EFE3;font:16px/1.6 "DM Sans",system-ui,sans-serif;display:grid;place-items:center;padding:24px 16px}' +
      '#cc-lock .in{max-width:620px;width:100%}#cc-lock img.lg{width:64px;height:64px;border-radius:50%;margin-bottom:22px}' +
      '#cc-lock .k{display:block;font-weight:700;font-size:12px;letter-spacing:.24em;text-transform:uppercase;color:' + c.accent + '}' +
      '#cc-lock h1{font:700 clamp(34px,6vw,56px)/1.02 Fraunces,system-ui,sans-serif;margin:10px 0 14px;letter-spacing:-.01em}#cc-lock p{opacity:.78;margin:0 0 18px}' +
      '#cc-lock .row{display:flex;flex-wrap:wrap;gap:10px;margin:22px 0}#cc-lock .b{display:inline-flex;align-items:center;justify-content:center;padding:14px 20px;border-radius:999px;font-weight:700;text-decoration:none;color:#F4EFE3;border:1px solid rgba(244,239,227,.2);background:transparent;cursor:pointer;font-size:15px}' +
      '#cc-lock .b.pri{background:#25D366;border-color:#25D366;color:#0b2e17}#cc-lock form .b.pri{background:' + c.color + ';border-color:' + c.color + ';color:#fff}' +
      '#cc-lock form{margin-top:26px;padding:20px;border-radius:20px;background:rgba(244,239,227,.05);border:1px solid rgba(244,239,227,.1)}#cc-lock label{font-weight:700;font-size:14px;display:block;margin-bottom:10px}' +
      '#cc-lock .code{display:flex;gap:10px}#cc-lock .code input{flex:1;min-width:0;font:700 26px/1 Fraunces,system-ui,sans-serif;letter-spacing:.4em;text-align:center;padding:12px;border-radius:14px;border:2px solid rgba(244,239,227,.18);background:rgba(0,0,0,.25);color:#F4EFE3}' +
      '#cc-lock .err{color:#CDB07E;font-weight:700;margin:10px 0 0;min-height:1.2em;opacity:1}#cc-lock .fine{font-size:13px;opacity:.55;margin-top:18px}#cc-lock .fine a{color:inherit}' +
      '#cc-lock .iv{display:inline-flex;padding:4px;border-radius:999px;background:rgba(244,239,227,.08);margin-top:18px}#cc-lock .iv button{border:0;background:transparent;color:#F4EFE3;font:700 13px "DM Sans";padding:9px 14px;border-radius:999px;cursor:pointer}#cc-lock .iv button[aria-pressed=true]{background:#F4EFE3;color:#12192A}' +
      '#cc-lock .pc{position:relative;display:grid;gap:4px;padding:18px 16px;border-radius:18px;border:1px solid rgba(244,239,227,.14)}#cc-lock .pc.hot{border-color:' + c.color + ';background:' + c.color + '1f}#cc-lock .pc i{position:absolute;top:-10px;left:14px;font:700 10px "DM Sans";letter-spacing:.14em;text-transform:uppercase;font-style:normal;background:' + c.color + ';color:#fff;padding:3px 8px;border-radius:999px}#cc-lock .pc .pay{margin-top:10px;background:' + c.color + ';border-color:' + c.color + ';color:#fff;width:100%}#cc-lock .pc .wa{font-size:12px;text-align:center;opacity:.7;color:#F4EFE3;margin-top:4px}' +
      '#cc-lock .plans{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px;margin:22px 0}#cc-lock .plans a{position:relative;display:grid;gap:2px;padding:18px 16px;border-radius:18px;border:1px solid rgba(244,239,227,.14);color:#F4EFE3;text-decoration:none;transition:transform .2s,border-color .2s}' +
      '#cc-lock .plans a:hover{transform:translateY(-3px);border-color:' + c.accent + '}#cc-lock .plans a.hot{border-color:' + c.color + ';background:' + c.color + '1f}#cc-lock .plans i{position:absolute;top:-10px;left:14px;font:700 10px "DM Sans";letter-spacing:.14em;text-transform:uppercase;font-style:normal;background:' + c.color + ';color:#fff;padding:3px 8px;border-radius:999px}' +
      '#cc-lock .plans b{font:700 20px Fraunces,system-ui}#cc-lock .plans em{font-style:normal;font-weight:700;font-size:14px;color:' + c.accent + '}#cc-lock .plans small{opacity:.6}' +
      '@media(max-width:560px){#cc-lock .plans{grid-template-columns:1fr}}</style>' +
      '<div class="in"><img class="lg" src="' + (c.logo || monogram(c)) + '" alt="">' + body + '<p class="fine">Powered by <a href="/clubs" target="_blank">Courtcall</a></p></div>';
    document.body.appendChild(d); document.documentElement.style.overflow = "hidden";
    var iv = "month";
    d.querySelectorAll("[data-iv]").forEach(function (b) { b.onclick = function () { iv = b.dataset.iv; d.querySelectorAll("[data-iv]").forEach(function (x) { x.setAttribute("aria-pressed", x === b); }); d.querySelectorAll(".pc em").forEach(function (e) { e.textContent = iv === "year" ? e.dataset.y : e.dataset.m; }); }; });
    d.querySelectorAll("[data-pay]").forEach(function (b) {
      b.onclick = function () {
        var er = document.getElementById("ccErr"); er.textContent = ""; b.disabled = true; var t = b.textContent; b.textContent = "Opening secure checkout…";
        of("/api/stripe", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "checkout", slug: slug, plan: b.dataset.pay, interval: iv }) })
          .then(function (r) { return r.json(); }).then(function (j) { if (j.url) location.href = j.url; else { er.textContent = j.error || "Card payment isn’t available right now. Please pay on WhatsApp."; b.disabled = false; b.textContent = t; } })
          .catch(function () { er.textContent = "Couldn’t reach the payment page. Try again."; b.disabled = false; b.textContent = t; });
      };
    });
    var f = document.getElementById("ccAct");
    if (f) f.onsubmit = function (e) {
      e.preventDefault(); var v = f.querySelector("input").value.trim(), er = document.getElementById("ccErr"); er.textContent = "";
      of("/api/clubs", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ slug: slug, code: v }) }).then(function (r) { return r.json().then(function (j) { return [r.ok, j]; }); })
        .then(function (x) { if (!x[0]) { er.textContent = x[1].error; return; } location.reload(); }).catch(function () { er.textContent = "Couldn’t reach Courtcall. Try again."; });
    };
  }

  // After Stripe Checkout: the webhook switches the club on within seconds
  function waitPaid(c, n) {
    var w = document.getElementById("cc-wait");
    if (!w) { w = document.createElement("div"); w.id = "cc-wait"; w.style.cssText = "position:fixed;inset:0;z-index:9500;display:grid;place-items:center;background:#12192A;color:#F4EFE3;font:600 18px 'DM Sans',system-ui;text-align:center;padding:24px"; w.innerHTML = '<div><div style="width:44px;height:44px;margin:0 auto 18px;border-radius:50%;border:4px solid rgba(244,239,227,.15);border-top-color:' + c.color + ';animation:ccs 1s linear infinite"></div>Payment received. Switching on ' + c.name.replace(/[<>&]/g, "") + '…<style>@keyframes ccs{to{transform:rotate(360deg)}}</style></div>'; document.body.appendChild(w); }
    if (n > 30) { w.remove(); lock(c); toast("Your payment went through. Activation is taking a little longer; refresh in a minute or message us on WhatsApp."); return; }
    setTimeout(function () { of("/api/clubs?slug=" + slug).then(function (r) { return r.json(); }).then(function (x) { if (x.access && x.access.ok) location.reload(); else waitPaid(c, n + 1); }).catch(function () { waitPaid(c, n + 1); }); }, 2000);
  }
  function billing() {
    var tok = ""; try { tok = localStorage.getItem("dd-host-token") || ""; } catch (e) {}
    of("/api/stripe", { method: "POST", headers: { "Content-Type": "application/json", "x-host-token": tok }, body: JSON.stringify({ action: "portal", slug: slug }) })
      .then(function (r) { return r.json(); }).then(function (j) { if (j.url) location.href = j.url; else toast(j.error); });
  }

  // 5. Load the club, then brand the page
  function boot() {
    of("/api/clubs?slug=" + slug).then(function (r) { return r.ok ? r.json() : null; }).then(function (c) {
      if (!c) { document.body.innerHTML = '<div style="min-height:100vh;display:grid;place-items:center;font:600 18px DM Sans,system-ui;text-align:center;padding:24px">This club link doesn’t exist.<br><a href="/clubs">Start your club on Courtcall</a></div>'; return; }
      var paid = /[?&]paid=/.test(location.search);
      if (paid) history.replaceState(null, "", location.pathname);
      if (!c.access.ok && paid) return waitPaid(c, 0);
      if (!c.access.ok) lock(c); else { brand(c); if (paid) toast("Payment received. Welcome to Courtcall! Your invoice is on its way by email."); }
    });
  }
  if (document.body) boot(); else document.addEventListener("DOMContentLoaded", boot);
})();
