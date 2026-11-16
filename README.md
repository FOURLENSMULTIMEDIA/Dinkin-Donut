# Dinkin' Donut · Pickleball Club

Club website + live court queue for open-play nights in Doha. Sweet game, soft hands.

| Page | Who it's for |
|---|---|
| `/` | Homepage: live courts, night schedule, kitchen rules, QR, FAQ |
| `/queue` | Players: scan the QR, type a name, see your position and court |
| `/host` | Hosts (PIN): run courts, record wins + scores, reorder queue, CSV export |
| `/tv` | A TV/laptop at the venue: big live board with QR |
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
4. **Host PINs** – Settings → Environment Variables → add `HOST_PIN` (host password) and `HOST_PIN_2` (6-digit second PIN). Sign-in asks for both, then the device stays signed in for 180 days with a signed session; the PINs are never stored on the device. Changing either PIN signs every device out.
   Previously: add `HOST_PIN` = your host password. It is case-sensitive and never stored in the code, so the host console stays locked until you set it. 5 wrong tries locks that device out for 10 minutes.
5. **Redeploy** (Deployments → ⋯ → Redeploy) so the new variables load.
6. Open `/host` and sign in.

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

## Glaze Pass (PIN to join)
When someone pays, use **Payments → Paid? Send a Glaze Pass** in the host console: name, WhatsApp number, amount, method.
It records the payment and creates a 3-digit PIN. Players join the queue with their name + PIN (5 tries, then they see the host).
Untick **PIN to join** in the console bar to switch it off for a casual night.

Sending the PIN:
- **Out of the box**: WhatsApp opens with the message written to their number; tap Send.
- **Fully automatic**: set up the WhatsApp Business Cloud API (Meta), create a template with two variables
  (`{{1}}` name, `{{2}}` PIN), then add `WA_TOKEN`, `WA_PHONE_ID`, `WA_TEMPLATE` (and optionally `WA_LANG`) in Vercel.
  The console then sends the PIN with no extra tap.

## Autopilot
Host console bar → **Autopilot** (on by default). Courts fill themselves the moment a game finishes or enough players check in.
- **Scores**: type both scores on the court card and tap **Finish**. The winner is worked out and checked against the rules (to 11, win by 2; 15 or 21 available under **Game to**).
- **Equal play**: players who have played fewer games tonight get priority; nobody is skipped more than twice.
- **Fresh partners**: the same pair is avoided in back-to-back games, and the same four never go straight back on.
- **Up next**: the next game, exactly as it will be built, shows on the console, players' phones and the TV.
- **Court calls (TV)**: tap *Turn on court announcements* on `/tv` once; each new game gets a full-screen call and a spoken announcement.

## Games each (fair share)
Host console → **Games each**:
- **Auto** (default): shares the games left tonight across everyone who's here, using courts, real game length and the **Ends** time (default midnight). More people means fewer games each; it recalculates as people join or leave.
- **4–8**: a fixed number for everyone. **No limit** turns it off.

Players who reach their share move to *Done for tonight* and their phone thanks them. Courts never sit empty: if too few are waiting, players with the fewest games get a bonus game. Winners rotate off once they reach their share.

## Post Studio (Instagram)
`/studio` (linked from the host console). Ready-made posts in the club's brand, filled from live data:
open play tonight, session recap (Hall of Glaze), Glaze Jersey, Glaze Card. Post 4:5 or Story 9:16.
On a phone, **Share to Instagram** opens the share sheet with the image and copies the caption.
