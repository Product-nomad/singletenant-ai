# Changelog

User-visible and governance changes, newest first. Site data changes (vendor facts, verification dates) live in the public `/changelog/` page from v2; this file tracks the project itself.

## Unreleased (v2 build, branch `v2`)

- 2026-07-07 — v2 build started per `SPEC_singletenant_v2.md` (piece 0). Governance scaffold added (this file, `DECISIONS.md`, `THREAT_MODEL.md`, `CONTEXT.md`); README phase marker updated Frame → Build; STATE.md rewritten (newsletter removed from revenue framing, v1 vendor YAMLs enumerated). Tooling: Biome (lint+format), lefthook pre-commit (typecheck + tests + lint), `node --test`. Baseline evidence of live v1 in `docs/example_runs/v2-baseline/` (wget mirror + full-page screenshots).

## 1.0 (2026-05, "Buyer's Brief" editorial v1)

- Initial scaffold: 4 vendors (Baseten, Modal, RunPod, Together AI), 1 article, 12 comparison pages, editorial design (Fraunces/Source Serif). Deployed on Cloudflare Workers static assets.
