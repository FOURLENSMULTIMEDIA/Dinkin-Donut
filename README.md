# Dinkin' Donut · Pickleball Club

Club website + live court queue for open-play nights in Doha. Sweet game, soft hands. 🍩

| Page | Who it's for |
|---|---|
| `/` | Homepage: live courts, night schedule, kitchen rules, QR, FAQ |
| `/queue` | Players: scan the QR, type a name, see your position and court |
| `/host` | Hosts (PIN): run courts, record wins + scores, reorder queue, CSV export |
| `/tv` | A TV/laptop at the venue: big live board with QR |
| `/poster` | Printable A4 QR poster for the check-in table |

No build step. Plain HTML/CSS/JS + one Vercel serverless function (`api/queue.js`).

## Deploy (about 10 minutes)

1. **GitHub** – create an empty repo, then in this folder:
   ```bash
   git remote add origin https://github.com/YOUR-USER/dinkin-donut.git
   git push -u origin main
   ```
2. **Vercel** – vercel.com → Add New → Project → import the repo → Deploy (no settings needed).
3. **Database (required for a real night)** – in the Vercel project: Storage → Create / Marketplace → **Upstash for Redis** (free tier) → connect to the project. This adds `KV_REST_API_URL` and `KV_REST_API_TOKEN` automatically.
4. **Host PIN** – Settings → Environment Variables → add `HOST_PIN` = your secret PIN. (Default is `1234` — change it!)
5. **Redeploy** (Deployments → ⋯ → Redeploy) so the new variables load.
6. Open `/host`, sign in, and print `/poster`.

Optional: Settings → Domains to add e.g. `dinkindonut.qa`. The QR codes follow whatever domain the page is opened on, so print the poster **from your final domain**.

## Edit club details
`js/config.js` – venue, night day, hours, Instagram, WhatsApp, email. Venue shows "TBA — stay tuned" until you change it (per the playbook).

## Run locally
```bash
npm run dev   # http://localhost:3000 , PIN 1234, in-memory queue
```

## How the queue works
- Players join at the back. Open courts take the next 4 (doubles) or 2 (singles).
- After a game the losers go to the back. **Winners stay a maximum of 2 games** (kitchen rule #2; changeable in the host console), then rotate.
- Standings: wins → win % → point difference. Players' phones buzz + sprinkle when they're up next or called to a court.
- "End night and reset" clears everything — download the CSV first.
