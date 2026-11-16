# Glaze Card: Google Form setup

Everything for the loyalty sign-up: the form, the member spreadsheet, the card and the poster.

## 1. Deploy the website first
The script pulls the card image from the live site, so push to GitHub and let Vercel deploy.
Check that this loads: https://dinkindonutqatar.vercel.app/assets/loyalty/form-card-preview.png

## 2. Create the form (2 minutes)
1. Open https://script.google.com and sign in with the club Google account.
2. **New project** → delete the sample code → paste `CreateLoyaltyForm.gs`.
3. Choose `createGlazeCardForm` in the toolbar → **Run** → allow the permissions.
4. Open **Execution log**. Copy the *Short link*. That's the sign-up link.

## 3. Brand it (Google doesn't allow this from a script)
In the form editor click the palette icon (**Customize theme**):
- **Header**: Choose image → Upload → `assets/loyalty/form-header.png`
- **Color**: custom `#FF5FA2`
- **Background**: the lightest tint
- **Font**: Header *Playful*, Question *Basic*, Text *Basic*

## 4. Connect it to the website
In `js/config.js` set `loyaltyFormUrl` to the short link and push. The **/loyalty** page and the
poster QR code (which points to `/loyalty`) then lead straight to the form.

## 5. Print
| File | Use |
|---|---|
| `assets/loyalty/glaze-card-print.pdf` | Card front + back, 3.5 × 2 in. Ask the printer for 350gsm matte, rounded corners. |
| `assets/loyalty/card-front.png`, `card-back.png` | 1050 × 600 px (300 dpi) for printers who want images |
| `assets/loyalty/signup-poster-A4.pdf` | Check-in table poster |
| `assets/loyalty/form-header.png` | Google Form header, 1600 × 400 |

## Running the card
The response sheet has three extra columns: **Member no.**, **Card issued** (tick box) and **Stamps**.
Write the member number on the card when you hand it over. Stamp the circle and write the date each paid session.

---

# Connect your form to the host console (members database)

Every sign-up appears in **Host console → Glaze Card members**, where you give out cards, stamp sessions and redeem free games.

1. **Vercel** → Settings → Environment Variables → add `MEMBERS_SECRET` with the secret you were given → **Redeploy**.
2. Open https://script.google.com → **New project** → paste `GlazeCardSync.gs`.
3. Replace `PASTE_SECRET_HERE` with the same secret. Save.
4. Choose **setup** in the toolbar → **Run** → allow the permissions.

`setup` does three things:
- sets the form's confirmation message ("You can collect your card in person at any Dinkin' Donut session…")
- turns on automatic sync for every new sign-up
- sends everyone who has already signed up

Run `syncAll` any time to resend everything. Members are matched by phone number, so nobody is duplicated.

## At the check-in table
- **Cards to hand out** lists people who signed up but have no card yet. Tap **Give card**, then write the number shown (#001, #002…) on the card.
- Tap a circle to stamp a session. When six are filled, **FREE** lights up. Tap it when they use their free session and the card starts again.
- **Add to tonight** puts a member on tonight's list with their level already set.
