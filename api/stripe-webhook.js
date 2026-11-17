// Stripe webhook: switches clubs on and off automatically.
// In the Stripe dashboard: Developers → Webhooks → Add endpoint → https://<your site>/api/stripe-webhook
// Events: checkout.session.completed, invoice.paid, invoice.payment_failed,
//         customer.subscription.updated, customer.subscription.deleted
// The body must stay raw for the signature check, so this handler reads the request stream itself.
const { stripe, planFromLookup, periodEnd } = require("./_stripe");
const { getClub, saveClub, recordPayment } = require("./_clubs");

const GRACE = 3 * 864e5; // keep a club on for 3 days while Stripe retries a failed renewal

async function raw(req) {
  if (Buffer.isBuffer(req.rawBody)) return req.rawBody;
  const chunks = []; for await (const c of req) chunks.push(typeof c === "string" ? Buffer.from(c) : c);
  return Buffer.concat(chunks);
}

async function clubOfSub(sub) {
  if (sub?.metadata?.club) return getClub(sub.metadata.club);
  return null;
}

async function applySub(sub, note) {
  const c = await clubOfSub(sub);
  if (!c) return;
  const item = sub.items?.data?.[0];
  const plan = planFromLookup(item?.price?.lookup_key) || sub.metadata?.plan || c.plan;
  c.plan = plan;
  c.stripeCustomer = typeof sub.customer === "string" ? sub.customer : sub.customer?.id || c.stripeCustomer;
  c.stripeSub = sub.id;
  c.billing = "card";
  c.cancelAtPeriodEnd = !!sub.cancel_at_period_end;
  if (["active", "trialing"].includes(sub.status)) { c.paidUntil = Math.max(c.paidUntil || 0, periodEnd(sub) + GRACE); c.paymentIssue = false; }
  if (sub.status === "canceled") c.paidUntil = Math.min(c.paidUntil || 0, Date.now());
  if (sub.discounts?.length || sub.discount) {
    const coupon = sub.discount?.coupon?.id || "";
    if (coupon === "FOUNDING50" || /FOUNDING/i.test(JSON.stringify(sub.discounts || []))) c.founding = true;
  }
  c.approved = true;
  (c.log = c.log || []).push({ t: Date.now(), txt: note });
  await saveClub(c);
}

module.exports = async (req, res) => {
  if (req.method !== "POST") return res.status(405).end();
  let event;
  try {
    const sig = req.headers["stripe-signature"];
    if (!process.env.STRIPE_WEBHOOK_SECRET) throw new Error("STRIPE_WEBHOOK_SECRET is not set");
    event = stripe().webhooks.constructEvent(await raw(req), sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (e) {
    return res.status(400).send(`Webhook error: ${e.message}`);
  }
  try {
    const o = event.data.object;
    if (event.type === "checkout.session.completed" && o.mode === "subscription" && o.subscription) {
      const sub = await stripe().subscriptions.retrieve(o.subscription);
      if (!sub.metadata?.club && o.client_reference_id) sub.metadata = { ...sub.metadata, club: o.client_reference_id };
      await applySub(sub, "Paid by card (Stripe Checkout)");
    } else if (event.type === "invoice.paid" && (o.subscription || o.parent?.subscription_details?.subscription)) {
      const sub = await stripe().subscriptions.retrieve(o.subscription || o.parent.subscription_details.subscription);
      await applySub(sub, `Invoice paid ${o.number || ""}`.trim());
      await recordPayment({ id: o.id, club: sub.metadata?.club || "", method: "card", amount: (o.amount_paid ?? o.total ?? 0) / 100, currency: String(o.currency || "").toUpperCase(), tax: (o.tax ?? (o.total_taxes || []).reduce((t, x) => t + (x.amount || 0), 0) ?? 0) / 100, number: o.number || "", invoiceUrl: o.hosted_invoice_url || "", pdf: o.invoice_pdf || "", customer: typeof o.customer === "string" ? o.customer : "", email: o.customer_email || "" });
    } else if (event.type === "customer.subscription.updated") {
      await applySub(o, o.cancel_at_period_end ? "Cancellation scheduled" : "Subscription updated");
    } else if (event.type === "customer.subscription.deleted") {
      await applySub(o, "Subscription ended");
    } else if (event.type === "invoice.payment_failed") {
      const id = o.subscription || o.parent?.subscription_details?.subscription;
      if (id) { const sub = await stripe().subscriptions.retrieve(id); const c = await clubOfSub(sub); if (c) { (c.log = c.log || []).push({ t: Date.now(), txt: "Card payment failed, Stripe is retrying" }); c.paymentIssue = true; await saveClub(c); } }
    }
    return res.json({ received: true });
  } catch (e) {
    // 500 makes Stripe retry later
    return res.status(500).send(`Handler error: ${e.message}`);
  }
};
