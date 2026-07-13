# singletenant.ai v2 — Post-Ship Integrity Audit

- **Repo:** `/home/vpc/projects/singletenant-ai`
- **Branch / HEAD:** `main` @ `76be7df` (`feat(compare): regenerate 15-vendor comparison pages`)
- **Date:** 2026-07-12
- **Mode:** READ-ONLY. No source files changed; only this report written.
- **Scope:** 15 vendor YAMLs, 62 unique evidence URLs, 105 compare pages, changelog, disclosure guard, full detail-page copy.

---

## Executive summary

| # | Section | Result |
|---|---------|--------|
| 1 | Cross-vendor consistency | **PASS** (schema-enforced; 2 low observations) |
| 2 | Evidence URL health | **FLAG** — all 200, but one cert→wrong-evidence mismatch (medium) + one 2-hop redirect |
| 3 | Compare page consistency | **FLAG** — reverse-pair redirect promised in code but no `_redirects` exists (medium) |
| 4 | Copy integrity | **PASS** — no marketing overclaims beyond piece-10 coverage |
| 5 | Changelog accuracy | **PASS** |
| 6 | Disclosure guard | **PASS** (1 low architectural note) |
| 7 | Fable integrity pass | **PASS** — notes are rigorously hedged; one systemic caveat tied to §2 |

**Overall:** ship-quality. Two items warrant a fix before they matter — a mislinked SOC 2 evidence URL on Databricks (§2), and a reverse-pair redirect the code comments promise but which does not exist in the build (§3). Everything else is clean or cosmetic.

> **Resolution (2026-07-12):** both medium findings **fixed** — see the Resolution log at the foot of this report. Databricks SOC 2 now points at `…/trust/compliance/soc` (200); a `scripts/gen-redirects.mjs` generator wired into `npm run build` now emits `public/_redirects` (105 reverse→canonical 301s). `npm run validate`, `npm run build`, and `npm test` all pass. Low/cosmetic items remain open by choice.

---

## 1. Cross-vendor consistency — PASS

Read all 15 files in `src/content/vendors/`.

**Field names / missing fields.** The vendor schema (`src/schemas/vendor.mjs`) is `.strict()`, so field names are structurally guaranteed identical across all 15 files — an unknown or renamed key would fail `npm run validate` and the build. All 15 carry the same top-level shape (`slug, name, url, category, tagline, deployment_models, regions, compliance, pricing, sovereignty, notes, featured`). `affiliate_url` is optional and absent everywhere (relevant to §6). No vendor is missing a field another has.

**Compliance cert spelling.** All cert tokens come from the `CERTS` enum (`SOC2_TYPE2, SOC3, ISO27001, HIPAA_BAA, GDPR_DPA, C5, SecNumCloud, FEDRAMP`) — `z.enum` rejects any variant spelling (`SOC2`, `soc2`, etc.), so cross-vendor spelling drift is impossible by construction. Confirmed consistent across all files. `SecNumCloud` is the only mixed-case token; it is a proper-noun scheme name (ANSSI) and matches its display label, so this is intentional, not drift.

**Category tags.** All four in use — `hyperscaler-dedicated` (aws, azure, vertex), `dedicated-gpu` (baseten, coreweave, fireworks, modal, runpod, together), `managed-selfhost` (databricks, huggingface, nvidia), `eu-sovereign` (nebius, ovhcloud, scaleway) — match the four `CATEGORIES` values exactly. No stray tag.

**Findings**

| Sev | Finding | Fix |
|-----|---------|-----|
| low | `regions: []` on 8 vendors (baseten, databricks, huggingface, modal, nvidia, runpod, together, vertex) renders as "Not verified". Legitimate (schema default) but means a third of the fleet shows no region data. | Optional: backfill regions where a primary source exists, or accept as honest "not verified". |
| low | Cert *coverage* varies by vendor (e.g. only OVHcloud carries `SecNumCloud`; NVIDIA has no `SOC2_TYPE2`). This is correct per-vendor fact variation, not an inconsistency — noted only to confirm it was reviewed and is intentional (see conservative notes in §7). | None. |

---

## 2. Evidence URL health — FLAG

Fetched all 62 unique `evidence_url` values (parallel `curl -L`, 20s timeout, browser UA). **Every URL returned HTTP 200.** No dead links, no 4xx/5xx.

**Verified-but-no-evidence check:** none. The schema's `evidenceInvariant` forces every populated fact to carry an `evidence_url` and forbids one on `unknown` facts, so orphan "verified" facts cannot exist. Manually confirmed across all 15 files.

**Findings**

| Sev | Finding | Fix |
|-----|---------|-----|
| **medium — FIXED 2026-07-12** | **Databricks `SOC2_TYPE2` cites the wrong page.** `databricks-model-serving.yaml:16` set the SOC 2 evidence_url to `https://www.databricks.com/trust/compliance/hipaa` — the **HIPAA** compliance page, not a SOC 2 page. The link resolved 200, so it passed the link-health gate, but it was not evidence for the claimed cert. Undercut the site's "every fact links to *its* primary source" promise. | **Done:** repointed to `https://www.databricks.com/trust/compliance/soc` (verified 200, 0 hops), matching the `/trust/compliance/…` pattern used for the ISO 27001 and FedRAMP entries. |
| low | **OVHcloud certifications URL is a 2-hop redirect** (`>1 hop` threshold). `https://www.ovhcloud.com/en/enterprise/certification-conformity/` → 301 → 301 → `…/en/compliance/` ("Compliance and certification"). Still a relevant compliance page (not a homepage), and it is the shared evidence for all four OVHcloud certs. | Update the four OVHcloud `evidence_url`s to the final `…/en/compliance/` target to remove the redirect chain. |
| low | **Shared trust-center / landing URLs used as per-cert evidence.** Baseten (4 certs → `trust.baseten.co`), RunPod (4 → `trust.runpod.io`), Nebius (3 → `/trust-center`), Fireworks (3 → one `data_security` doc), and OVHcloud (4 → one certifications page) all point multiple distinct certs at a single generic landing page rather than a cert-specific attestation. All load 200 and are legitimate primary sources, but evidence granularity is weak — the reader lands on a hub, not the specific claim. | Where the trust center exposes per-standard deep links, use them; otherwise acceptable as-is. |
| info | Four benign single-hop redirects (within the ≤1-hop tolerance): Baseten `/pricing`→`/pricing/` (trailing slash); Databricks `/legal/baa` and `/legal/dpa`→ the actual signed PDF (this is *good* — lands on the real document); CoreWeave `docs.coreweave.com/docs/…`→`/…` (path normalisation). No action. | None. |

---

## 3. Compare page consistency — FLAG

The 105 compare pages (`dist/compare/` = C(15,2) = 105, confirmed) are all generated from a single symmetric path builder and a single `ComparisonTable` component, which structurally guarantees several of the things this section asks about.

**Same fields on both panels.** `ComparisonTable.astro` iterates a fixed `rows` array and maps it over `[a, b]` identically — both vendor columns always render the exact same nine fact rows. Cannot diverge. **PASS.**

**Reverse pairs match.** Pages are keyed on the alphabetically-sorted slug pair (`compare/[slug].astro:19-28`), and every internal link is built via `comparePath()` which `.sort()`s the slugs (`lib/compare.mjs:15-18`). So `a-vs-b` and `b-vs-a` resolve to the *same* canonical page and cannot show mismatched data. **PASS on data** — but see the redirect finding below for the external-URL case.

**"Not verified" rendering.** `fmt()` maps both `'unknown'` and `undefined` to "Not verified", and booleans to Yes/No — correct. Sampled pairs across varied categories (baseten-vs-coreweave, aws-vs-vertex, modal-vs-together, nebius-vs-scaleway, huggingface-vs-nvidia, runpod-vs-fireworks, ovhcloud-vs-scaleway, databricks-vs-nvidia, azure-vs-aws, together-vs-modal) — all render `unknown` facts as "Not verified", never as a blank or "none".

**Findings**

| Sev | Finding | Fix |
|-----|---------|-----|
| **medium — FIXED 2026-07-12** | **Reverse-pair redirect is promised in code but does not exist.** `compare/[slug].astro:11-13` states reverse ordering "301s to the canonical URL via `_redirects`". There was **no `_redirects` file** anywhere — not in `public/`, not emitted to `dist/`, and no script generated one. Only the 105 canonical pages existed. Internal links are always canonical (so users never hit this), but a hand-typed/external/legacy inbound `b-vs-a` URL would **404 instead of 301**, and the duplicate-content protection the comment describes was not actually in force. | **Done:** added `scripts/gen-redirects.mjs`, wired into `npm run build`; it emits `public/_redirects` with all 105 reverse→canonical 301s (Astro copies it to `dist/`). `public/_redirects` gitignored as a generated artifact. The template comment is now accurate. |
| low | **Empty-array rendering differs between compare table and detail page.** In `ComparisonTable`, a `tags`-type field that is empty renders `'—'`, whereas the `list`-type (Regions) and the detail page render "Not verified". No live mis-render today (all 15 vendors have ≥1 deployment model and ≥1 cert, so the `'—'` branch is never hit), but the inconsistency is latent: a future zero-cert vendor would show `—` on compare pages and "Not verified" on its profile. | Make the empty `tags` branch emit "Not verified" for parity. |

---

## 4. Copy integrity — PASS

`grep -riE "comprehensive|all major|read by|every|always"` across `src/` returned matches, but on review **none are marketing overclaims** — every hit is either code (`.every()` array methods) or a factual/process statement about methodology:

- `index.astro`, `methodology.astro`, `terms.astro`, `about.astro`: "Every populated fact links to the primary source…", "A populated fact always carries two things…", "we always disclose this clearly". These are verifiable, schema-backed process claims, not hype. (Caveat: the "every fact links to its source" claim is *technically* dented by the Databricks SOC 2 mislink in §2 — the link exists but points to the wrong page. Fixing §2 restores the claim to fully true.)
- `about.astro`: "almost always 'which deployment'" — explicitly hedged.
- `coreweave.yaml`: "Security page states every CKS node is single-tenant" — attributed quote, not our claim.
- No occurrences of "comprehensive", "all major", or "read by".

No new overclaim beyond what piece 10 already governs.

---

## 5. Changelog accuracy — PASS

`data/changelog.yaml`, 6 entries.

- **Slug resolution:** every slug referenced (`runpod, aws-bedrock-provisioned, azure-openai-ptu, vertex-ai-provisioned, nvidia-nim, databricks-model-serving, huggingface-inference-endpoints, nebius, ovhcloud, scaleway, fireworks-ai, coreweave, baseten, modal, together-ai`) resolves to a real vendor file. All 15 vendors are covered; `runpod` appears twice (added-then-updated), which is legitimate.
- **Date format:** all ISO `YYYY-MM-DD` (`isoDate` regex-enforced).
- **Ordering:** newest-first and non-increasing (`2026-07-08 ×4`, then `2026-07-07 ×2`) — satisfies the schema's `e.date <= entries[i-1].date` invariant.
- **Cross-check:** the entry-1 claim that the disclosure page was "published today alongside the privacy policy, terms of use, and methodology pages" is consistent — `disclosure.astro`, `privacy.astro`, `terms.astro`, `methodology.astro` all exist.

No findings.

---

## 6. Disclosure guard — PASS

**Current state:** no vendor has an `affiliate_url` (confirmed — grep returns none; RunPod's note says "No referral link is live yet"). So no affiliate link renders anywhere today — the guard is vacuously satisfied, and this matches the changelog.

**Guard logic (`lib/affiliate.mjs`).** `resolveVendorLink()` returns the affiliate href *only* when both `affiliate_url` is present **and** the `/disclosure/` page exists in the build (`disclosurePageExists()` → `existsSync(src/pages/disclosure.astro)`). If disclosure is ever deleted, every affiliate link silently falls back to the plain vendor URL — fails closed, correct. When it does render, `AffiliateLink.astro` also emits an inline `rel="sponsored"` + visible "Referral link … Disclosure" notice beside the link.

**Footer link on all templates.** `Footer.astro:30` links `/disclosure/`. `BaseLayout.astro:79` renders `<Footer />`; `ArticleLayout.astro` wraps `BaseLayout`; `grep -L` confirms **every** page in `src/pages/` uses one of these two layouts. So the footer disclosure link is present on all page templates, including compare, vendor detail, and blog. **PASS.**

**Findings**

| Sev | Finding | Fix |
|-----|---------|-----|
| low | The guard keys on *file existence* of `disclosure.astro`, not on the footer actually containing the `/disclosure/` link. If someone removed the footer link but kept the page file, affiliate links would still render and the only disclosure would be `AffiliateLink`'s own inline notice (which, to its credit, does render on the same page). Robust today because of that inline notice, but the footer-link guarantee is by-convention, not enforced. | Optional: add a test asserting `Footer.astro` contains `DISCLOSURE_PATH`, so the footer link can't silently regress. |

---

## 7. Fable integrity pass (my own read) — PASS

I read every vendor's `tagline` and analyst `notes` — the free-text that isn't schema-gated and is where an unsupported claim would hide. The overwhelming impression is **disciplined**: nearly every factual assertion is attributed ("Security page states…", "Terms commit to…", "vendor docs state…", "no explicit … found at review") and the data model's conservatism shows through in the notes:

- **NVIDIA** lists only `ISO27001` because "SOC 2 type not specified" — and the note says exactly that. No SOC 2 cert was assumed.
- **CoreWeave** deliberately omits ISO 27001 because the trust centre uses "aligned with" wording — the note explains the omission.
- **Nebius** note flags HIPAA "no explicit BAA statement found" and correctly does *not* list a HIPAA cert.
- **Fireworks** mentions ISO 27701/42001 "also claimed in vendor docs" but does not add them as verified certs.
- **Scaleway** records SecNumCloud as in-process/not-yet-qualified and correctly omits the cert (contrast OVHcloud, which is qualified and lists it).

These are the marks of a system that records absence rather than inventing presence — the core promise of the site. Taglines are factual ("billed per second, with region pinning"), none stray into hype.

**Judgment flags**

| Sev | Finding | Note |
|-----|---------|------|
| medium (cross-ref §2) | The one place the evidence promise breaks is **not** in the prose but in a link: Databricks' SOC 2 fact points at the HIPAA page. A reader clicking "verified" evidence for SOC 2 lands on an unrelated attestation. Because the whole site's credibility rests on "click the source and see the fact," this single mislink is the highest-value thing to fix. | Same fix as §2. |
| low | **Modal** carries `data_residency_guarantee: true` (from "Terms commit to processing customer data only in customer-specified regions") while `regions: []`. Not a claim-without-evidence — the guarantee is sourced to the terms — but the empty regions list sits in mild tension with a verified residency guarantee. Worth a glance to confirm the terms language really supports "guarantee". | Re-read Modal terms; downgrade to `unknown` if the language is weaker than "guarantee". |

No other prose reads as an unsupported claim.

---

## Recommended fix priority

1. ~~**§2 / §7 — Databricks SOC 2 evidence_url** points at the HIPAA page.~~ **DONE 2026-07-12** — repointed to `…/trust/compliance/soc`. *(medium)*
2. ~~**§3 — Missing `_redirects`.**~~ **DONE 2026-07-12** — generator wired into build; 105 redirects emitted. *(medium)*
3. **§2 — OVHcloud 2-hop redirect** and shared-trust-center evidence granularity. *(low — open)*
4. **§3 low / §6 low / §1 low** — cosmetic parity and guard-hardening; optional. *(open)*

---

## Resolution log

**2026-07-12** — the two medium findings were fixed in the working tree and verified:

| Finding | Change | Verification |
|---------|--------|--------------|
| §2 Databricks SOC 2 mislink | `src/content/vendors/databricks-model-serving.yaml` — SOC 2 `evidence_url` → `https://www.databricks.com/trust/compliance/soc` | `curl` 200/0-hops; `npm run validate` 15/15 pass |
| §3 Missing reverse-pair redirects | Added `scripts/gen-redirects.mjs`; `package.json` `build` now runs it before `astro build`; added `gen:redirects` script; `public/_redirects` added to `.gitignore` (generated) | `npm run build` emits `public/_redirects` + `dist/_redirects` with 105 rules; reverse→canonical spot-checked; `npm test` 28/28 pass |

Low/informational items (OVHcloud redirect chain, shared-trust-center evidence granularity, empty-array `—` vs "Not verified" parity, disclosure footer-link test) were left open by choice.

---

*Audit complete. Original audit was read-only; the two medium findings above were subsequently fixed on a follow-up branch at the maintainer's request (see Resolution log).*
