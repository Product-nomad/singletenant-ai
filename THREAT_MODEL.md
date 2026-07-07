# singletenant.ai — Threat Model

Phase: **Build** (v2 reposition; this document closes a Frame-phase gate carried over from v1).

## Scope

The static directory site at `singletenant.ai` and its private GitHub repo (`Product-nomad/singletenant-ai`). Includes page content, the vendor data set (`src/content/vendors/*.yaml`), the build pipeline, Cloudflare Workers static-assets hosting, outbound affiliate links, and the planned report-only evidence drift watch (spec piece 14).

Out of scope: the vendors' own infrastructure and claims-at-source, Cloudflare's underlying platform, Incubate Labs engagement delivery (own threat models), the consulting pipeline beyond the CTA link.

## Trust boundaries and data flow

```
Visitor browser
   │  [HTTP GET]
   ▼
Cloudflare CDN ── serves prebuilt static HTML/CSS/JS (Workers Static Assets)
   │
   ├─► Cloudflare Web Analytics (cookieless, when token enabled)
   ├─► Outbound vendor links (evidence URLs, affiliate URLs) — leave our surface
   └─► No backend, no forms, no first-party auth (newsletter signup removed in v2).

Weekly drift watch (piece 14, operator machine, report-only)
   │  reads vendor YAML + HTTP-checks evidence URLs
   ▼
Telegram summary to operator (token from ~/.hermes/.env — never in repo)
```

**Trusted:** Cloudflare (host + CDN + analytics + email routing), GitHub (private repo).
**Not under our control:** visitor browsers, vendor sites the evidence URLs point at, affiliate networks' tracking on the far side of an outbound click.

There is no first-party server or database. The site holds no visitor data; the asset being defended is the **credibility of the data set**.

## Sub-processors

| Sub-processor | What they process | Why |
|---|---|---|
| Cloudflare Workers Static Assets | Standard request metadata (IP, user agent, timestamp) | Hosting + CDN |
| Cloudflare Web Analytics | Aggregated, cookieless page-view events | Traffic insight (token pending) |
| Cloudflare Email Routing | Inbound mail to `editor@` / `hello@` aliases | Corrections + contact channel |
| Affiliate networks (e.g. Partnerstack for RunPod) | Click-through referral attribution, on their side of the link | Affiliate revenue |

Disclosed on the public `/privacy/` page (spec piece 8).

## Assumptions

- The site stays static. A backend (forms, gated content, API) invalidates this document.
- The repo is private today but written as if it may go public: nothing sensitive in source, ever.
- The drift watch is report-only; it never writes to the repo or the data (DECISIONS.md, decision 4).

## In-scope risks

| ID | Risk | Mitigation |
|---|---|---|
| R1 | Secret committed to the repo | No build-time secrets exist; drift-watch Telegram token lives in `~/.hermes/.env` outside the repo; affiliate IDs are public-by-design URL parameters. |
| R2 | npm supply chain attack | Dependencies pinned via committed `package-lock.json`; lefthook pre-commit keeps history buildable; audit before dependency bumps. |
| R3 | Build pipeline compromise | Cloudflare builds from the repo; build commands visible in `package.json`; no secrets to exfiltrate at build time. |
| R4 | **A published vendor fact is wrong or unsourced** — the core reputational/legal risk | Schema v2: every populated fact requires an `evidence_url` + verified date, enforced by Zod at build time; unverifiable fields render "Not verified", never a guess; no field filled from model memory; correction process + `editor@` channel on `/methodology/`. |
| R5 | Affiliate non-disclosure (UK ASA CAP Code, US FTC) / missing privacy notice (UK GDPR Art 13) | Piece 8 ships `/privacy/`, `/terms/`, `/disclosure/` with disclosure rendered on every page an affiliate link appears; piece 8 lands before RunPod's affiliate link is exposed in v2. |
| R6 | Google manual action against thin programmatic compare pages | Each of the 105 compare pages carries a data-derived differences summary generated from YAML deltas, not bare side-by-side tables. |
| R7 | Vendor data drift — stale claims presented as current | Visible per-section last-verified dates; public `/changelog/`; weekly report-only drift watch HTTP-checks every evidence URL and flags status/redirect changes for manual review. |
| R8 | DNS hijack / domain compromise | Registrar account 2FA; operational concern outside repo defence. |
| R9 | A vendor disputes a claim on their profile | Every claim is evidence-linked so disputes resolve against the cited source; documented correction turnaround on `/methodology/`. |

## Known gaps

- No CSP header configured yet; low value while the site ships no third-party scripts beyond Cloudflare analytics, revisit when the analytics token is enabled.
- `npm audit` not wired into CI; run manually at dependency bumps until it is.
- Legal pages (`/privacy/`, `/terms/`, `/disclosure/`) are 404 on live v1 while the header links to them — known v1 exposure, closed by piece 8 before v2 ships.

## Adversarial considerations

- **Drive-by scanners** — Cloudflare default protections; static surface, nothing to inject into.
- **SEO parasites / content scrapers** — data is public-by-design; the brand defence is freshness + evidence links, which scrapes lose.
- **Vendors gaming their own profiles** — inclusion criteria and evidence-per-claim on `/methodology/`; partnership status is disclosed per vendor and never changes the data.
