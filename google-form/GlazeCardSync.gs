/**
 * Dinkin' Donut — Glaze Card sync.
 * Sends every sign-up from the Google Form to the website's members database,
 * so hosts can issue cards and stamp sessions from the host console.
 *
 * One-time setup (script.google.com → New project → paste this file):
 *   1. Paste the secret below. The same value goes in Vercel as MEMBERS_SECRET.
 *   2. Run `setup` once and allow the permissions. It sets the confirmation
 *      message, turns on automatic sync, and sends everyone who already signed up.
 */

const FORM_ID = '1TqgQPkL9SCaWjwWpEvg3VU1uV5ERvEHyLesmacjYezY';
const SITE = 'https://dinkindonut.asia';
const MEMBERS_SECRET = 'PASTE_SECRET_HERE';

const CONFIRMATION =
  "You're in. Welcome to the Glaze Card.\n\n" +
  "You can collect your card in person at any Dinkin' Donut session. " +
  "Just give your name at the check-in table.\n\n" +
  "One stamp per paid session, open play or DUPR. Six stamps and your seventh session is on us.\n\n" +
  "Questions? WhatsApp +974 3076 3431 or DM @dinkindonutqa.\n\nStay glazed.";

function setup() {
  const form = FormApp.openById(FORM_ID);
  form.setConfirmationMessage(CONFIRMATION);

  ScriptApp.getProjectTriggers()
    .filter(t => t.getHandlerFunction() === 'onSignup')
    .forEach(t => ScriptApp.deleteTrigger(t));
  ScriptApp.newTrigger('onSignup').forForm(form).onFormSubmit().create();

  const sent = syncAll();
  Logger.log('Confirmation message set. Automatic sync is on. Sent ' + sent + ' existing sign-ups.');
}

function onSignup(e) {
  send_([toPayload_(e.response)]);
}

/** Re-send every response. Safe to run any time; members are matched by phone number. */
function syncAll() {
  const responses = FormApp.openById(FORM_ID).getResponses();
  const all = responses.map(toPayload_);
  for (let i = 0; i < all.length; i += 50) send_(all.slice(i, i + 50));
  return all.length;
}

function toPayload_(r) {
  const answers = {};
  r.getItemResponses().forEach(ir => { answers[ir.getItem().getTitle()] = ir.getResponse(); });
  return { responseId: r.getId(), timestamp: r.getTimestamp().toISOString(), answers: answers };
}

function send_(responses) {
  if (!responses.length) return;
  const res = UrlFetchApp.fetch(SITE + '/api/members', {
    method: 'post',
    contentType: 'application/json',
    headers: { 'x-members-secret': MEMBERS_SECRET },
    payload: JSON.stringify({ responses: responses }),
    muteHttpExceptions: true,
  });
  if (res.getResponseCode() !== 200) throw new Error('Website said ' + res.getResponseCode() + ': ' + res.getContentText());
}
