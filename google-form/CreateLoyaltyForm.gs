/**
 * Dink Different — Club Card loyalty sign-up form.
 *
 * Creates the Google Form, its response spreadsheet and the branded imagery in one run.
 * Usage: script.google.com → New project → paste this file → Run `createGlazeCardForm`.
 * Authorise when prompted. The form and sheet links are printed in the execution log.
 */

const SITE = 'https://dinkindonut.asia';
const IMG = {
  header: SITE + '/assets/loyalty/form-header.png',
  card: SITE + '/assets/loyalty/form-card-preview.png',
};

function createGlazeCardForm() {
  const form = FormApp.create("Dink Different · Club Card Sign-up");

  form
    .setTitle('The Club Card')
    .setDescription(
      "Play 6 sessions, get the 7th free.\n\n" +
      "Sign up once and collect your Club Card at the check-in table on your next session. " +
      "You get one stamp for every paid session, open play or DUPR. Six stamps unlock a free session.\n\n" +
      "Takes about a minute."
    )
    .setConfirmationMessage(
      "You're in. Welcome to the Club Card.\n\n" +
      "Pick up your card at the check-in table next session and show it each time you play.\n" +
      "Questions? WhatsApp +974 3076 3431 or DM @dinkindonutqa.\n\nDink different."
    )
    .setProgressBar(true)
    .setAllowResponseEdits(true)
    .setShowLinkToRespondAgain(false)
    .setCollectEmail(false);

  addImage_(form, IMG.card, 'Your Club Card', 'Front and back. Six stamps, then your seventh session is on us.');

  // About you
  form.addSectionHeaderItem().setTitle('About you');

  form.addTextItem().setTitle('Full name').setHelpText('As it should appear on your card.').setRequired(true);

  form.addTextItem()
    .setTitle('WhatsApp number')
    .setHelpText('Mobile, 8 digits. Example: 3076 3431')
    .setRequired(true)
    .setValidation(FormApp.createTextValidation()
      .requireTextMatchesPattern('^\\s*(\\+?974)?[\\s-]*[3567]\\d{3}[\\s-]*\\d{4}\\s*$')
      .setHelpText('Please enter an 8-digit mobile number.')
      .build());

  form.addTextItem()
    .setTitle('Email')
    .setHelpText('Optional. For receipts and event updates.')
    .setValidation(FormApp.createTextValidation().requireTextIsEmail().setHelpText('That email does not look right.').build());

  form.addTextItem().setTitle('Instagram handle').setHelpText('Optional. So we can tag you in session photos.');

  form.addListItem()
    .setTitle('Where are you based?')
    .setChoiceValues(['Doha', 'Al Rayyan', 'Lusail', 'Al Wakrah', 'Al Daayen', 'Umm Salal', 'Al Khor', 'Other']);

  // Your game
  form.addPageBreakItem().setTitle('Your game').setHelpText('Helps our court captains build balanced games.');

  form.addMultipleChoiceItem()
    .setTitle('How would you describe your level?')
    .setChoiceValues([
      'New to pickleball',
      'Beginner (DUPR 2.0 – 2.9)',
      'Intermediate (DUPR 3.0 – 3.9)',
      'Advanced (DUPR 4.0+)',
    ])
    .setRequired(true);

  form.addCheckboxItem()
    .setTitle('Which sessions will you play?')
    .setChoiceValues(['Open play', 'DUPR rated games'])
    .setRequired(true);

  form.addTextItem()
    .setTitle('DUPR ID')
    .setHelpText('Optional. Find it in the DUPR app under your profile.');

  form.addCheckboxItem()
    .setTitle('How did you hear about Dink Different?')
    .setChoiceValues(['Instagram', 'A friend', 'WhatsApp group', 'Reclub', 'Walked past the courts'])
    .showOtherOption(true);

  form.addListItem()
    .setTitle('T-shirt size')
    .setHelpText('Optional. For club tees and member drops.')
    .setChoiceValues(['XS', 'S', 'M', 'L', 'XL', 'XXL']);

  // Terms
  form.addPageBreakItem().setTitle('Card terms');

  form.addSectionHeaderItem()
    .setTitle('How the Club Card works')
    .setHelpText(
      '1. One stamp per paid session, open play or DUPR games.\n' +
      '2. Six stamps unlock one free session of either type.\n' +
      '3. The card is personal and must be shown at check-in to be stamped.\n' +
      '4. Lost cards can be replaced once; stamps are restored from our records where possible.\n' +
      "5. Dink Different may update these terms; members will be told on WhatsApp."
    );

  form.addCheckboxItem()
    .setTitle('Agreement')
    .setChoiceValues(['I agree to the Club Card terms'])
    .setRequired(true);

  form.addMultipleChoiceItem()
    .setTitle('Can we add you to the club WhatsApp updates?')
    .setChoiceValues(['Yes, keep me posted', 'No thanks'])
    .setRequired(true);

  // Responses → spreadsheet
  const ss = SpreadsheetApp.create("Club Card · Members");
  form.setDestination(FormApp.DestinationType.SPREADSHEET, ss.getId());
  SpreadsheetApp.flush();
  styleSheet_(ss);

  Logger.log('Form (share this): ' + form.getPublishedUrl());
  Logger.log('Short link:        ' + form.shortenFormUrl(form.getPublishedUrl()));
  Logger.log('Edit form:         ' + form.getEditUrl());
  Logger.log('Responses sheet:   ' + ss.getUrl());
}

function addImage_(form, url, title, help) {
  try {
    const blob = UrlFetchApp.fetch(url).getBlob();
    form.addImageItem().setImage(blob).setTitle(title).setHelpText(help).setAlignment(FormApp.Alignment.CENTER).setWidth(600);
  } catch (e) {
    Logger.log('Image skipped (' + url + '): ' + e);
  }
}

function styleSheet_(ss) {
  const sh = ss.getSheets().find(s => /^Form Responses/.test(s.getName())) || ss.getSheets()[0];
  ss.getSheets().filter(s => s.getSheetId() !== sh.getSheetId() && s.getLastRow() === 0).forEach(s => ss.deleteSheet(s));
  sh.insertColumnsAfter(sh.getLastColumn(), 3);
  const last = sh.getLastColumn();
  sh.getRange(1, last - 2, 1, 3).setValues([['Member no.', 'Card issued', 'Stamps']]);
  sh.setFrozenRows(1);
  sh.getRange(1, 1, 1, last)
    .setBackground('#3B2416').setFontColor('#FFF6EA').setFontWeight('bold').setFontFamily('DM Sans');
  sh.getRange(2, last - 1, 500, 1).insertCheckboxes();
  sh.setColumnWidths(1, last, 170);
}
