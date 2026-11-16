# Dinkin' Donut · Pickleball Club

Club website + live court queue for open-play nights in Doha. Sweet game, soft hands.

| Page | Who it's for |
|---|---|
| `/` | Homepage: live courts, night schedule, kitchen rules, QR, FAQ |
| `/queue` | Players: scan the QR, type a name, see your position and court |
| `/host` | Hosts (PIN): run courts, record wins + scores, reorder queue, CSV export |
| `/tv` | A TV/laptop at the venue: big live board with QR |
| `/poster` | Printable A4 QR poster for the check-in table |
| `/merch` | Club shop: Glaze Jersey and Clubhouse Polo builder (name, number, colourway, size), shop film, WhatsApp ordering |
| `/loyalty` | Glaze Card loyalty programme: play 6, get the 7th free |
| `/dupr` | DUPR rated games, sends players to your Reclub page |

Every page has a Light / Auto / Dark switch in the top bar (Auto follows the phone's setting).

No build step. Plain HTML/CSS/JS + one Vercel serverless function (`api/queue.js`).

## Deploy (about 10 minutes)

1. **GitHub** – create an empty repo, then in this folder:
   ```bash
   git remote add origin https://github.com/YOUR-USER/dinkin-donut.git
   git push -u origin main
   ```
2. **Vercel** – vercel.com → Add New → Project → import the repo → Deploy (no settings needed).
3. **Database (required for a real night)** – in the Vercel project: Storage → Create / Marketplace → **Upstash for Redis** (free tier) → connect to the project. This adds `KV_REST_API_URL` and `KV_REST_API_TOKEN` automatically.
4. **Host PIN** – Settings → Environment Variables → add `HOST_PIN` = your host password. It is case-sensitive and never stored in the code, so the host console stays locked until you set it. 5 wrong tries locks that device out for 10 minutes.
5. **Redeploy** (Deployments → ⋯ → Redeploy) so the new variables load.
6. Open `/host`, sign in, and print `/poster`.

Optional: Settings → Domains to add e.g. `dinkindonut.qa`. The QR codes follow whatever domain the page is opened on, so print the poster **from your final domain**.

## Edit club details
`js/config.js` – venue, night day, hours, Instagram, WhatsApp, email, **`whatsappNumber`** (merch orders), **`reclubUrl`** (DUPR booking).
`js/merch.js` – merch names, prices (QAR), colours, sizes and status (available / preorder / soon). Venue shows "TBA — stay tuned" until you change it (per the playbook).

## Run locally
```bash
HOST_PIN=yourpin npm run dev   # http://localhost:3000 , in-memory queue
```

## How the queue works
- Players join at the back. Open courts take the next 4 (doubles) or 2 (singles).
- After a game the losers go to the back. **Winners stay a maximum of 2 games** (kitchen rule #2; changeable in the host console), then rotate.
- Standings: wins → win % → point difference. Players' phones buzz + sprinkle when they're up next or called to a court.
- **End session** (host console) shows the night recap: games, Dinker of the night, best point difference, most games. Download the CSV or copy an Instagram recap, then reset for the next session.

## Auto-deploy
Once Vercel is connected to this GitHub repo, every change pushed (or uploaded) to the `main` branch goes live on the website automatically in about a minute. No extra setup needed.

## Host console extras
- **Tonight's list**: only names on the list can join the queue from their phone. Paste names one per line.
- **Payments**: session fee, per-player fee overrides, cash / Fawran / card, balance and remaining. Payment data is only returned to a signed-in host; public pages never receive it.
- **End session**: publishes the top 3 to the **Hall of Glaze** on the homepage and keeps the list of names for next time.

## Merch
Jersey and polo artwork is generated in code (`js/jersey.js`). Prices, sizes and specs live in `js/merch.js`.

## Loyalty card
See `google-form/SETUP.md`. Print files are in `assets/loyalty/`.

## Fair matchmaking
Host console → **Matching**:
- **Smart match** (default): the longest-waiting player always goes on next, the other spots go to the closest levels among the next 8 waiting, nobody is skipped more than twice, and teams are split for the most even game. Winners only stay on if a fair opponent is waiting. In testing this cut uneven games from 20% to about 4%.
- **Level courts**: tag each court Beginner / Intermediate / Advanced. Courts fill with matching players and only borrow the next level when the queue is long.
- **Queue order**: strict first come, first served.

Players choose their level when they join; hosts can tap the level tag on any name to change it. Each live game shows *Even*, *Close* or *Uneven*.

## Glaze Card members
Google Form sign-ups sync to the host console (`api/members.js`). Setup: `google-form/SETUP.md`. Needs `MEMBERS_SECRET` in Vercel.
