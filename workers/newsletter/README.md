# singletenant-newsletter Worker

Handles `POST /api/newsletter` for the signup form (`src/components/NewsletterSignup.astro`). Each valid signup is emailed, with its consent record (time, page and wording), to the editor's inbox through Cloudflare Email Routing. The Worker stores nothing itself.

**Status: built and tested, not deployed.** The site's signup form stays hidden while `FEATURES.newsletter` in `src/config/features.mjs` is `false`.

## Behaviour

- POST only (405 otherwise). A cross-origin `Origin` gets 403.
- Without the `SEND_EMAIL` binding or the `FORM_DESTINATION` secret it returns 503, so a half-configured deploy refuses signups instead of losing them.
- A filled honeypot (`website`) gets a success response and nothing is sent.
- Invalid email or a missing consent box gets 400.
- Responses: JSON `{ ok }` when the request sends `Accept: application/json` (the fetch path). Otherwise a 303 back to the same-origin page it came from, with `#newsletter-thanks` or `#newsletter-error` appended (the no-JS path). The return URL is never off-site.

## To enable

1. Turn on Email Routing for the singletenant.ai zone and verify the destination inbox. It must be a verified destination address, not an alias on the zone.
2. From this directory, as `vpc`, deploy: `npx wrangler deploy`. The route `singletenant.ai/api/newsletter` is in `wrangler.jsonc`.
3. Set the destination: `npx wrangler secret put FORM_DESTINATION`.
4. Check it with a test signup (`npx wrangler tail singletenant-newsletter`). A plain GET should return 405.
5. Update `/privacy/` (`LAST_UPDATED`, plus the sending service if one is added), then set `FEATURES.newsletter = true` in a reviewed commit.

The deploy token is the account-wide one in `~vpc/.config/cloudflare/deploy.env`. It needs Workers Scripts and Workers Routes edit permissions on the zone.
