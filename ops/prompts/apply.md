## Weekly apply (Saturday)

1. **Watch input.** Your research comes from the vendors' own pages: since 23 Nov 2026 no cloud watch writes to the
   Google Doc. For every vendor in `src/content/vendors/`, check its changelog or release notes, pricing page, trust or
   compliance page and region or availability page for changes since the date of the last owner-log entry. Also check
   the policy scope in `OWNERSHIP.md` (UK, EU, US). Prefer one fetch per source; stop researching once half the budget
   is spent.
2. **Apply what's real.** Each item is conditional: change the site only if it currently says otherwise, and re-read
   the primary source before every edit. A change with nowhere to go is logged as "No field on site", not forced in.
   Company-wide region or GPU news isn't a site change until the vendor's page for the specific dedicated or inference
   product shows it.
3. **Rotation re-verify.** Fully re-verify these profiles, every field against its source: {{ROTATION}}. Move each
   field's source date only once you have re-read it. If every field on a profile checks out, `last_verified` moves to
   today; if a source no longer supports a field, correct it (a `corrected` entry in `data/changelog.yaml`) or set it
   `unknown`.
4. **Search tightening.** From the snapshot, find pages ranking 8 to 20. On pages you're already editing this run,
   tighten the title, meta description and H1 to match the query intent, using only facts already on the page.
5. Public data changes get a `data/changelog.yaml` entry (type `updated`, `added`, `removed` or `corrected`), with
   sources.
