## Daily health fix

The wrapper's health checks found the problems below. Fix the low-risk ones only: a broken outbound source link (find
the vendor's current page for the same fact, re-read it, and repoint the source with today's date for that field
only), a build or lint failure, or a 301 for a 404 path that people or AI tools are requesting (add it to
`scripts/gen-redirects.mjs` pointing at the nearest real page). Don't edit content otherwise. Anything you can't fix
safely goes in `docs/owner-log.md` as an open problem.

Findings:
{{FINDINGS}}
