// WhatsApp delivery for Glaze Pass PINs and the club assistant.
//
// Automatic sending uses the WhatsApp Business Cloud API (Meta). Vercel variables:
//   WA_TOKEN         permanent access token (System User token)
//   WA_PHONE_ID      Phone number ID of the club's WhatsApp Business number
//   WA_TEMPLATE      approved template name, body variables: {{1}} name, {{2}} amount, {{3}} PIN, {{4}} join link
//   WA_LANG          template language code (default "en")
//   WA_VERIFY_TOKEN  any string; used once when Meta verifies the webhook (api/whatsapp.js)
//   SITE_URL         public site address (default https://dunkindonutqatar.vercel.app)
// Without WA_TOKEN / WA_PHONE_ID / WA_TEMPLATE, the console falls back to a ready-made wa.me link.
const TOKEN = process.env.WA_TOKEN, PHONE_ID = process.env.WA_PHONE_ID, TEMPLATE = process.env.WA_TEMPLATE, LANG = process.env.WA_LANG || "en";
const SITE = (process.env.SITE_URL || "https://dunkindonutqatar.vercel.app").replace(/\/$/, "");
const GRAPH = "https://graph.facebook.com/v20.0/";

const configured = () => Boolean(TOKEN && PHONE_ID);

function toIntl(phone) {
  let d = String(phone || "").replace(/\D/g, "");
  if (d.length === 8) d = "974" + d; // Qatar local number
  return d;
}

const joinLink = (name, pin) => `${SITE}/queue?n=${encodeURIComponent(name)}&p=${pin}`;
const qar = n => (Math.round(n * 100) / 100).toLocaleString("en", { maximumFractionDigits: 2 }) + " QAR";

// Plain text only: emoji can arrive garbled through wa.me links on some devices.
function passMessage({ name, pin, amount }) {
  return [
    "*Dinkin' Donut Pickleball Club*",
    "",
    `Hi ${name}, thank you. ` + (amount > 0 ? `Your payment of ${qar(amount)} is confirmed for tonight's session.` : "You're confirmed for tonight's session."),
    "",
    `Your queue PIN: *${pin}*`,
    "",
    "Join the queue in one tap:",
    joinLink(name, pin),
    "",
    "Or scan the QR code at the court and enter your name and PIN.",
    "This PIN is valid for tonight only.",
    "",
    "See you on court.",
  ].join("\n");
}

async function graph(body) {
  const r = await fetch(GRAPH + PHONE_ID + "/messages", {
    method: "POST",
    headers: { Authorization: `Bearer ${TOKEN}`, "Content-Type": "application/json" },
    body: JSON.stringify({ messaging_product: "whatsapp", ...body }),
  });
  if (!r.ok) throw new Error((await r.json().catch(() => ({}))).error?.message || `WhatsApp said ${r.status}`);
  return r.json();
}

// Free-form text: allowed within 24 hours of the player's last message to the club.
const sendText = (to, text) => graph({ to: toIntl(to), type: "text", text: { body: text, preview_url: true } });

// Glaze Pass. Business-initiated messages must use an approved template.
async function sendPass({ name, pin, phone, amount }) {
  const text = passMessage({ name, pin, amount });
  const link = `https://wa.me/${toIntl(phone)}?text=${encodeURIComponent(text)}`;
  if (!configured()) return { sent: false, link, auto: false };
  // Free route: the player messaged the club in the last 24 hours, so a normal reply is allowed and free
  try {
    const seen = await require("./_store").getDoc("wa-seen", {});
    const t = seen[String(phone).replace(/\D/g, "").slice(-8)];
    if (t && Date.now() - t < 23.5 * 36e5) { await sendText(phone, text); return { sent: true, link, auto: true, free: true }; }
  } catch (e) { /* fall through to the template */ }
  if (!TEMPLATE) return { sent: false, link, auto: false, needsHello: true };
  try {
    await graph({
      to: toIntl(phone), type: "template",
      template: { name: TEMPLATE, language: { code: LANG }, components: [{ type: "body", parameters: [
        { type: "text", text: name }, { type: "text", text: amount > 0 ? qar(amount) : "0 QAR" }, { type: "text", text: pin }, { type: "text", text: joinLink(name, pin) },
      ] }] },
    });
    return { sent: true, link, auto: true };
  } catch (e) {
    return { sent: false, link, auto: true, waError: e.message };
  }
}

module.exports = { sendPass, sendText, passMessage, toIntl, joinLink, configured, SITE, qar };
