# WhatsApp: automatic PINs and the club assistant

> **Optional.** Without this setup, the console opens WhatsApp with the PIN message ready and you tap Send. That is the default and costs nothing.

Once this is set up:
- **Automatic PIN**: in the host console you type the player's name and number, press **Record & send PIN**, and the message arrives on their WhatsApp. No extra tap.
- **Club assistant**: players message the club number and get instant replies to STATUS, PIN, COURTS, BREAK, BACK and PAY.

WhatsApp only allows automatic messages through Meta's WhatsApp Business Platform. Setup takes about 30–45 minutes, once.

## Before you start
- Use a phone number that is **not** in the regular WhatsApp or WhatsApp Business app. A number connected to the platform cannot be used in the app at the same time. A new SIM for the club works well, or move one of the club numbers over.
- Meta charges a small fee per business-initiated message (the PIN). Replies inside a conversation the player started are free. Add a payment method when Meta asks.

## 1. Create the app
1. Go to https://business.facebook.com and create a **Business portfolio** for Dink Different (skip if you have one).
2. Go to https://developers.facebook.com → **My Apps** → **Create app** → use case **Other** → type **Business** → link it to the portfolio.
3. On the app page, add the **WhatsApp** product.

## 2. Connect the club number
1. **WhatsApp → API Setup** → **Add phone number**. Display name: *Dink Different Pickleball Club*. Verify by SMS or call.
2. Copy the **Phone number ID** shown under the number. This is `WA_PHONE_ID`.

## 3. Create a permanent token
1. **Business settings → Users → System users → Add** (role Admin).
2. **Add assets** → your app → full control. Also assign the WhatsApp account.
3. **Generate new token** → select the app → permissions `whatsapp_business_messaging` and `whatsapp_business_management` → expiry **Never**.
4. Copy the token. This is `WA_TOKEN`. Keep it private.

## 4. Create the PIN message template
**WhatsApp Manager → Message templates → Create template**
- Category: **Utility**
- Name: `glaze_pass`
- Language: **English**
- Header (text): `Dink Different Pickleball Club`
- Body:
```
Hi {{1}}, thank you. Your payment of {{2}} is confirmed for tonight's session.

Your queue PIN: {{3}}

Join the queue in one tap: {{4}}

Or scan the QR code at the court and enter your name and PIN. This PIN is valid for tonight only.
```
- Footer: `See you on court.`
- Sample values: `Drew`, `50 QAR`, `405`, `https://dinkindonut.asia/queue?n=Drew&p=405`

Submit. Utility templates are usually approved within minutes to a few hours.

## 5. Turn on the assistant (webhook)
1. App → **WhatsApp → Configuration → Webhook → Edit**.
2. Callback URL: `https://dinkindonut.asia/api/whatsapp`
3. Verify token: make up a phrase, e.g. `glaze-2026` (this is `WA_VERIFY_TOKEN`). Add it to Vercel **first** (step 6) and redeploy, then click **Verify and save**.
4. Under **Webhook fields**, subscribe to **messages**.

## 6. Add the settings in Vercel
Settings → Environment Variables (Production), then **Redeploy**:

| Key | Value |
|---|---|
| `WA_TOKEN` | token from step 3 |
| `WA_PHONE_ID` | Phone number ID from step 2 |
| `WA_TEMPLATE` | `glaze_pass` |
| `WA_LANG` | `en` |
| `WA_VERIFY_TOKEN` | your phrase from step 5 |

## 7. Test
1. Host console → Payments → **Paid? Send a Club Pass** with your own number. The message should arrive within seconds and the console will say *Sent automatically*.
2. From your phone, message the club number **STATUS**. You should get your queue position back.

If anything fails, the console falls back to opening WhatsApp with the message ready, so you're never stuck at the check-in table.
