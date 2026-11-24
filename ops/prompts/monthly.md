## Monthly content and SEO review (first Saturday)

The weekly apply already ran this morning (see the newest `docs/owner-log.md` entry); don't repeat it. Instead:
1. **Re-verification sweep.** Re-verify every vendor field whose source date is older than 45 days, oldest first,
   until the budget allows no more. Note in `docs/owner-log.md` which profiles are still outstanding and their dates.
   The 60-day line in `/editorial-policy/#cadence` must hold.
2. **Search intent.** For each page type, is the page the best answer of its kind for the queries it ranks for? Compare
   pages need real, sourced differences.
3. **Prune thin pages.** Compare pairs indexed for 90+ days with no impressions: propose `noindex` or consolidation with
   a 301 (risk `48h`). Never delete a page that has search traffic.
4. **Write for citation.** Answer first, clear definitions, named entities, dated facts, tables. Open ideas: "What is a
   single-tenant AI system?" (check `/blog/what-is-single-tenant-llm-hosting/` and `/methodology/` first),
   "Dedicated isn't the same as isolated", "Cloud and AI Development Act: where it stands". At most one new page a
   month, risk `48h`.
5. **Vendor coverage.** Assess at most one candidate (first: Exoscale Dedicated Inference) against
   `/editorial-policy/#what-qualifies`. List a vendor only if every field can be sourced; otherwise record the
   assessment in `docs/owner-log.md`. Risk `48h`.
6. **Metrics.** Update the metrics table in `STATE.md` ("Monthly metrics"): clicks, impressions, average position,
   pages indexed, top queries, AI-referral sessions and dataset downloads (write "not measured" where there's no
   source; the site has no analytics).
7. **Outreach drafts.** Draft up to 3 outreach items for Simon to send if he wants (for example: tell a vendor its
   profile was updated and invite corrections; offer the data to a newsletter). Put them in `.autopilot-asks.md` under
   "Outreach drafts". Never send anything.
8. **Monetisation gates.** Check the stage gates in `STATE.md`. If a threshold is met, add "apply to X" to the asks.
