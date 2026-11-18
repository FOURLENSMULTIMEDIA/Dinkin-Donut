// One-time Stripe setup for Courtcall. Safe to run again: it finds what already exists by lookup key.
//   STRIPE_SECRET_KEY=sk_test_... node scripts/stripe-setup.js
// Creates the three plans (monthly + yearly prices, priced in local currencies, tax added on top),
// the Founding Club coupon (50% off forever) and the customer billing portal settings.
const Stripe = require("stripe");
const key = process.env.STRIPE_SECRET_KEY;
if (!key) { console.error("Set STRIPE_SECRET_KEY first."); process.exit(1); }
const stripe = new Stripe(key, process.env.HTTPS_PROXY ? { httpClient: Stripe.createFetchHttpClient() } : {});

// Monthly prices per currency (whole units). Yearly = 10 months (2 months free).
const PLANS = {
  starter: { name: "Courtcall Starter", desc: "2 courts · up to 40 players a night", m: { usd: 39, aed: 149, qar: 149, eur: 37, gbp: 32, php: 2290, sgd: 55, aud: 59, cad: 55 } },
  club: { name: "Courtcall Club", desc: "6 courts · up to 80 players a night · your branding", m: { usd: 79, aed: 299, qar: 299, eur: 75, gbp: 65, php: 4590, sgd: 109, aud: 119, cad: 109 } },
  venue: { name: "Courtcall Venue", desc: "12 courts · up to 200 players a night · setup help", m: { usd: 149, aed: 549, qar: 549, eur: 139, gbp: 119, php: 8590, sgd: 199, aud: 225, cad: 199 } },
};
const minor = (cur, v) => Math.round(v * 100);
// Soft Hands Academy (coaching subscription)
PLANS.academy = { name: "Soft Hands Academy", desc: "Animated X-ray pickleball coaching, drills and quizzes", lookup: "academy", m: { usd: 10, aed: 39, qar: 39, eur: 10, gbp: 9, php: 590, sgd: 14, aud: 16, cad: 14 } };

(async () => {
  for (const [plan, p] of Object.entries(PLANS)) {
    const found = await stripe.products.search({ query: `metadata['courtcall_plan']:'${plan}'` });
    const product = found.data[0] || await stripe.products.create({ name: p.name, description: p.desc, metadata: { courtcall_plan: plan }, tax_code: "txcd_10103001" /* SaaS, business use */ });
    for (const interval of ["month", "year"]) {
      const lookup = p.lookup ? `${p.lookup}_${interval}` : `courtcall_${plan}_${interval}`;
      const have = await stripe.prices.list({ lookup_keys: [lookup], limit: 1 });
      if (have.data[0]) { console.log("exists ", lookup, have.data[0].id); continue; }
      const k = interval === "year" ? 10 : 1;
      const { usd, ...rest } = p.m;
      const price = await stripe.prices.create({
        product: product.id, currency: "usd", unit_amount: minor("usd", usd * k), recurring: { interval },
        tax_behavior: "exclusive", lookup_key: lookup, nickname: `${p.name} ${interval}ly`, metadata: { courtcall_plan: plan },
        currency_options: Object.fromEntries(Object.entries(rest).map(([c, v]) => [c, { unit_amount: minor(c, v * k), tax_behavior: "exclusive" }])),
      });
      console.log("created", lookup, price.id);
    }
  }
  // Founding Club: first 10 clubs keep 50% off for life
  try { await stripe.coupons.retrieve("FOUNDING50"); console.log("exists  coupon FOUNDING50"); }
  catch { await stripe.coupons.create({ id: "FOUNDING50", percent_off: 50, duration: "forever", name: "Founding Club · 50% off for life", max_redemptions: 10 }); console.log("created coupon FOUNDING50"); }
  try { await stripe.coupons.retrieve("ACADEMY_FOUNDER"); console.log("exists  coupon ACADEMY_FOUNDER"); }
  catch { await stripe.coupons.create({ id: "ACADEMY_FOUNDER", percent_off: 25, duration: "forever", name: "Academy Founder · 25% off for life", max_redemptions: 50 }); console.log("created coupon ACADEMY_FOUNDER"); }
  const promo = await stripe.promotionCodes.list({ code: "FOUNDING", limit: 1 });
  if (!promo.data[0]) { await stripe.promotionCodes.create({ coupon: "FOUNDING50", code: "FOUNDING" }); console.log("created promo code FOUNDING"); }
  // Billing portal: clubs can update their card, see invoices, switch plan or cancel
  const cfgs = await stripe.billingPortal.configurations.list({ limit: 1, is_default: true });
  const features = {
    invoice_history: { enabled: true },
    payment_method_update: { enabled: true },
    customer_update: { enabled: true, allowed_updates: ["email", "address", "tax_id", "name"] },
    subscription_cancel: { enabled: true, mode: "at_period_end" },
  };
  if (cfgs.data[0]) await stripe.billingPortal.configurations.update(cfgs.data[0].id, { features, business_profile: { headline: "Courtcall billing" } });
  else await stripe.billingPortal.configurations.create({ features, business_profile: { headline: "Courtcall billing" } });
  console.log("billing portal ready");
})().catch(e => { console.error(e.message); process.exit(1); });
