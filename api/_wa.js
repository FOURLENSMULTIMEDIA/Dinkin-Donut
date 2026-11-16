// Glaze Pass delivery over WhatsApp.
// Automatic sending needs the WhatsApp Business Cloud API (Meta). Set in Vercel:
//   WA_TOKEN       permanent access token
//   WA_PHONE_ID    the sending phone number ID
//   WA_TEMPLATE    approved template name with two body variables: {{1}} name, {{2}} PIN
//   WA_LANG        template language code (default en)
// Without them, the console gets a ready-made wa.me link and the host taps Send.
const TOKEN = process.env.WA_TOKEN, PHONE_ID = process.env.WA_PHONE_ID, TEMPLATE = process.env.WA_TEMPLATE, LANG = process.env.WA_LANG || "en";

function toIntl(phone) {
  let d = String(phone || "").replace(/\D/g, "");
  if (d.length === 8) d = "974" + d; // local Qatar number
  return d;
}

function message(name, pin) {
  return `Dinkin' Donut 🍩\n\nPayment received, ${name}. Here's your Glaze Pass for tonight:\n\nPIN  ${pin.split("").join(" ")}\n\nScan the QR code at the court, type your name and this PIN to join the queue.\n\nStay glazed.`;
}

async function sendPass({ name, pin, phone }) {
  const to = toIntl(phone), text = message(name, pin);
  const link = `https://wa.me/${to}?text=${encodeURIComponent(text)}`;
  if (!(TOKEN && PHONE_ID && TEMPLATE)) return { sent: false, link };
  try {
    const r = await fetch(`https://graph.facebook.com/v20.0/${PHONE_ID}/messages`, {
      method: "POST",
      headers: { Authorization: `Bearer ${TOKEN}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        messaging_product: "whatsapp", to, type: "template",
        template: { name: TEMPLATE, language: { code: LANG }, components: [{ type: "body", parameters: [{ type: "text", text: name }, { type: "text", text: pin }] }] },
      }),
    });
    if (!r.ok) return { sent: false, link, waError: (await r.json().catch(() => ({}))).error?.message || `WhatsApp said ${r.status}` };
    return { sent: true, link };
  } catch (e) {
    return { sent: false, link, waError: e.message };
  }
}

module.exports = { sendPass, message, toIntl };
