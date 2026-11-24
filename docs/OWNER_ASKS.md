# Asks for Simon

Things the owner runs can't do under `OWNERSHIP.md` (accounts, terms, money, DNS, anything sent in Simon's name).
Newest first. Each run adds new asks here and sends the open ones in one Telegram message. Mark one done by
moving it to **Done** with the date.

## Open

- **2026-11-24 · Required checks on GitHub (optional).** Branch protection and required checks aren't available on a
  private repo on the free plan (API 403). The autopilot enforces green CI itself. Making the repo public, or GitHub
  Pro (paid), would let GitHub enforce it too. Your call; nothing breaks either way.
- **2026-11-24 · One Cloudflare token permission (about 1 minute).** In the Cloudflare dashboard, edit the
  "Product-nomad sites" API token and add **Zone > Analytics > Read**. That lets the daily health check find 404s
  (including URLs AI tools invent, so they can be 301'd) and count page views and dataset downloads from Cloudflare's
  server-side request data, with no script, cookies or tracking on the site. Today the API refuses it: "does not
  have permission ...zone.analytics.read". Until then those metrics show "not measured".
- **2026-11-24 · Conflict wording.** The brief says "conflicts of interest: none at present", but you hold a RunPod
  referral account, so the editorial policy and disclosure PRs (#16, #18) say so and add that no referral link is used.
  If you've closed that account, say so and I'll remove the line.

## Done

- **2026-11-24 · RunPod referral link; Nebius and Civo sign-ups.** Dropped: Simon decided on 2026-11-24 that there will
  be no affiliate links for now (stage 0 in `OWNERSHIP.md`). The 30 Dec affiliate review is cancelled.

