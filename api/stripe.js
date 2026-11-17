// Courtcall card payments (Stripe Checkout) and self-service billing (Stripe customer portal).
//   GET                                   { enabled }
//   POST { action:"checkout", slug, plan, interval }   → { url }  (hosted Stripe Checkout)
//   POST { action:"portal", slug }  + club host token   → { url }  (invoices, card, cancel)
const { stripe, enabled, taxOn, lookupKey } = require("./_stripe");
const { getClub, PLANS } = require("./_clubs");
const { isClubHost } = require("./_auth");

const originOf = req => {
  const host = req.headers["x-forwarded-host"] || req.headers.host || "dinkindonut.asia";
  const proto = req.headers["x-forwarded-proto"] || (/^localhost|^127\./.test(host) ? "http" : "https");
  return `${proto}://${host}`;
};

module.exports = async (req, res) => {
  res.setHeader("Cache-Control", "no-store");
  try {
    if (req.method === "GET") return res.json({ enabled: enabled() });
    if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed." });
    const body = typeof req.body === "string" ? JSON.parse(req.body || "{}") : req.body || {};
    const club = await getClub(body.slug);
    if (!club) return res.status(404).json({ error: "Club not found." });
    const origin = originOf(req), base = `${origin}/c/${club.slug}`;

    if (body.action === "checkout") {
      const plan = PLANS[body.plan] ? body.plan : club.plan || "club";
      const interval = body.interval === "year" ? "year" : "month";
      const prices = await stripe().prices.list({ lookup_keys: [lookupKey(plan, interval)], limit: 1 });
      if (!prices.data[0]) return res.status(500).json({ error: "This plan isn’t available for card payment yet." });
      const session = await stripe().checkout.sessions.create({
        mode: "subscription",
        line_items: [{ price: prices.data[0].id, quantity: 1 }],
        client_reference_id: club.slug,
        metadata: { club: club.slug, plan },
        subscription_data: { metadata: { club: club.slug, plan } },
        ...(club.stripeCustomer ? { customer: club.stripeCustomer, customer_update: { address: "auto", name: "auto" } } : {}),
        billing_address_collection: "required",
        tax_id_collection: { enabled: true },
        automatic_tax: { enabled: taxOn() },
        allow_promotion_codes: true,
        success_url: `${base}/host?paid={CHECKOUT_SESSION_ID}`,
        cancel_url: `${base}/host`,
      });
      return res.json({ url: session.url });
    }

    if (body.action === "portal") {
      if (!isClubHost(req, club)) return res.status(401).json({ error: "Sign in to your host console first." });
      if (!club.stripeCustomer) return res.status(400).json({ error: "This club pays on WhatsApp, so there’s no card billing to manage." });
      const s = await stripe().billingPortal.sessions.create({ customer: club.stripeCustomer, return_url: `${base}/host` });
      return res.json({ url: s.url });
    }
    return res.status(400).json({ error: "Unknown action." });
  } catch (e) {
    return res.status(e.code && Number.isInteger(e.code) ? e.code : 500).json({ error: e.code === 503 ? e.message : "Card payment couldn’t start. Please try again or pay on WhatsApp." });
  }
};
