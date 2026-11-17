// Shared Stripe client. Keys live only in Vercel environment variables:
//   STRIPE_SECRET_KEY      sk_live_... / sk_test_...
//   STRIPE_WEBHOOK_SECRET  whsec_... (from the webhook endpoint in the Stripe dashboard)
//   STRIPE_TAX             "on" once Stripe Tax is set up in the dashboard (head office address + registrations)
const Stripe = require("stripe");

let client = null;
function stripe() {
  if (!process.env.STRIPE_SECRET_KEY) throw Object.assign(new Error("Card payments aren’t set up yet. Please pay on WhatsApp."), { code: 503 });
  if (!client) client = new Stripe(process.env.STRIPE_SECRET_KEY, process.env.HTTPS_PROXY ? { httpClient: Stripe.createFetchHttpClient() } : {});
  return client;
}
const enabled = () => Boolean(process.env.STRIPE_SECRET_KEY);
const taxOn = () => process.env.STRIPE_TAX === "on";
const lookupKey = (plan, interval) => `courtcall_${plan}_${interval === "year" ? "year" : "month"}`;
const planFromLookup = k => (String(k || "").match(/^courtcall_(starter|club|venue)_/) || [])[1] || null;
// The date a subscription is paid up to (field moved onto items in newer API versions).
const periodEnd = sub => (sub.current_period_end || sub.items?.data?.[0]?.current_period_end || 0) * 1000;

module.exports = { stripe, enabled, taxOn, lookupKey, planFromLookup, periodEnd };
