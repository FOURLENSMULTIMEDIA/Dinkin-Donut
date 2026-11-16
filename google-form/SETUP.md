# Glaze Card: Google Form setup

Everything for the loyalty sign-up: the form, the member spreadsheet, the card and the poster.

## 1. Deploy the website first
The script pulls the card image from the live site, so push to GitHub and let Vercel deploy.
Check that this loads: https://dunkindonutqatar.vercel.app/assets/loyalty/form-card-preview.png

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
