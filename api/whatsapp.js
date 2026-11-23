// Club assistant on WhatsApp. Meta calls this webhook for every message sent to the club number.
// Players can ask for their queue position, resend their PIN, take a break, get back in line,
// see who is on court, or ask how to pay. Replies are plain, friendly and short.
const { load, save, withLock, getDoc, setDoc } = require("./_store");
const { fresh, apply } = require("./_engine");
const { sendText, toIntl, joinLink, configured, SITE, qar } = require("./_wa");

const VERIFY = process.env.WA_VERIFY_TOKEN || "";
const last8 = p => String(p || "").replace(/\D/g, "").slice(-8);

const HELP = [
  "*Dink Different Pickleball Club*",
  "",
  "Reply with one word:",
  "*STATUS*  your place in the queue",
  "*PIN*  resend your queue PIN",
  "*COURTS*  who's playing now",
  "*BREAK*  step out of the queue",
  "*BACK*  rejoin the queue",
  "*PAY*  how to pay for tonight",
].join("\n");

function intent(text) {
  const t = String(text || "").toLowerCase();
  if (/\b(pin|code|pass)\b/.test(t)) return "pin";
  if (/\b(status|queue|where|position|turn|next|wait)\b/.test(t)) return "status";
  if (/\b(court|courts|playing|score)\b/.test(t)) return "courts";
  if (/\b(break|pause|leave|rest|out)\b/.test(t)) return "break";
  if (/\b(back|rejoin|join|ready|in)\b/.test(t)) return "back";
  if (/\b(pay|price|fee|cost|fawran|how much)\b/.test(t)) return "pay";
  if (/\b(thanks|thank you|shukran|ty)\b/.test(t)) return "thanks";
  return "help";
}

function names(S, ids) { return ids.map(id => S.players[id]?.name || "?").join(" & "); }

function waitText(S, pos) {
  const need = S.format * 2, courts = Math.max(1, S.courts.length), avg = S.durN ? S.durSum / S.durN : 12;
  const mins = Math.round((Math.floor(pos / (need * courts)) + (pos < need ? 0 : 1)) * avg);
  return mins < 2 ? "any minute now" : `about ${mins} minutes`;
}

async function reply(from, text) {
  const S = (await load()) || fresh();
  const p = Object.values(S.players).find(x => x.phone && last8(x.phone) === last8(from));
  const what = intent(text);

  if (what === "pay") {
    const fee = S.fee ? qar(S.fee) : "the session fee";
    return [`Tonight's session is ${fee}.`, "", S.fawran ? `Pay by Fawran to *${S.fawran}*, or in cash at the check-in table.` : "Pay in cash or Fawran at the check-in table.", "Once paid, we'll send your queue PIN here."].join("\n");
  }
  if (what === "courts") {
    const live = S.courts.filter(c => c.teams);
    if (!live.length) return "All courts are open right now. Join the queue and you'll be straight on.";
    return ["*On court now*", "", ...live.map(c => `Court ${c.id}: ${names(S, c.teams[0])} vs ${names(S, c.teams[1])}`), "", `${S.queue.length} waiting. Live board: ${SITE}/queue`].join("\n");
  }
  if (what === "thanks") return "You're welcome. See you on court.";
  if (what === "help" && !p) return "Hi, welcome to Dink Different Pickleball Club. Pay at the check-in table and your queue PIN will arrive here.\n\n" + HELP;
  if (what === "help" && p && p.pin) return [`Hi ${p.name}, here's your queue PIN for tonight: *${p.pin}*`, "", "Join the queue in one tap:", joinLink(p.name, p.pin), "", "Reply *STATUS* any time to see your place in line."].join("\n");
  if (what === "help") return `Hi ${p.name}.\n\n` + HELP;

  if (!p || !p.pin) return "We couldn't find a pass for this number tonight. Pay at the check-in table and we'll send your queue PIN here.\n\nReply *PAY* for payment details.";

  if (what === "pin") return [`Hi ${p.name}, your queue PIN tonight is *${p.pin}*.`, "", "Join in one tap:", joinLink(p.name, p.pin)].join("\n");

  const court = S.courts.find(c => c.teams && c.teams.flat().includes(p.id));
  const pos = S.queue.indexOf(p.id);

  if (what === "break") {
    if (court) return `You're playing on Court ${court.id} right now. Reply *BREAK* after your game.`;
    if (pos < 0) return "You're not in the queue at the moment. Reply *BACK* when you're ready to play.";
    await withLock(async () => { const st = (await load()) || fresh(); await save(apply(st, { type: "leave", id: p.id }).state); });
    return "Done. You've stepped out of the queue. Reply *BACK* when you're ready.";
  }
  if (what === "back") {
    if (court) return `You're already on Court ${court.id}. Enjoy the game.`;
    if (pos >= 0) return `You're already in the queue at #${pos + 1}, ${waitText(S, pos)}.`;
    let newPos = -1;
    await withLock(async () => { const st = (await load()) || fresh(); const out = apply(st, { type: "add", name: p.name }).state; newPos = out.queue.indexOf(p.id); await save(out); });
    return `You're back in the queue at #${newPos + 1}. We'll see you on court soon.`;
  }
  // status
  if (court) return `You're on *Court ${court.id}* now with ${names(S, court.teams.find(t => t.includes(p.id)).filter(id => id !== p.id)) || "your partner"}. Good luck.`;
  if (pos >= 0) return [`You're *#${pos + 1}* in the queue, ${waitText(S, pos)}.`, pos < S.format * 2 ? "Get your paddle ready, you're on the next open court." : "", `Tonight: ${p.w}W · ${p.l}L`].filter(Boolean).join("\n");
  return `You're not in the queue right now. Reply *BACK* to rejoin, or tap:\n${joinLink(p.name, p.pin)}`;
}

module.exports = async (req, res) => {
  // Meta's one-time webhook verification
  if (req.method === "GET") {
    const q = req.query || {};
    if (q["hub.mode"] === "subscribe" && VERIFY && q["hub.verify_token"] === VERIFY) return res.status(200).send(q["hub.challenge"]);
    return res.status(403).send("Forbidden");
  }
  if (req.method !== "POST") return res.status(405).end();
  try {
    const body = typeof req.body === "string" ? JSON.parse(req.body || "{}") : req.body || {};
    const msgs = (body.entry || []).flatMap(e => (e.changes || []).flatMap(c => c.value?.messages || []));
    const out = [];
    if (msgs.length) {
      // Remember who messaged us: replies within 24 hours are free, so PINs go out as normal messages
      const seen = await getDoc("wa-seen", {});
      msgs.forEach(m => { seen[m.from.replace(/\D/g, "").slice(-8)] = Date.now(); });
      const cutoff = Date.now() - 864e5; Object.keys(seen).forEach(k => { if (seen[k] < cutoff) delete seen[k]; });
      await setDoc("wa-seen", seen);
    }
    for (const m of msgs) {
      const text = m.type === "text" ? m.text?.body : m.type === "button" ? m.button?.text : m.interactive?.button_reply?.title || "";
      const answer = await reply(m.from, text);
      if (configured()) await sendText(m.from, answer); else out.push({ to: toIntl(m.from), answer });
    }
    return res.status(200).json({ ok: true, ...(configured() ? {} : { preview: out }) });
  } catch (e) {
    // Always 200 so Meta doesn't retry endlessly; the error is logged in Vercel
    console.error("whatsapp webhook", e);
    return res.status(200).json({ ok: false });
  }
};
