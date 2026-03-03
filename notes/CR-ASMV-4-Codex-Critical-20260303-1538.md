## Critical Code Review
- **Date:** 2026-03-03T20:40:09Z
- **Model:** GPT-5 Codex
- **Branch:** feature/asmv-4-brand-identity
- **Commit:** 3d8932282d8c076089dad2a58a7b22f9a71e59c1
---

### What Could Go Wrong
- A malformed `NEXT_PUBLIC_SITE_URL` (for example `parallax.studio` without protocol) will throw at module load time and can fail build/runtime before any page renders.
- Internal orchestration/task artifacts are now part of source control; if this repo is public, this leaks project workflow metadata and decision history that should usually stay internal.
- Brand identity can silently drift again (name/domain/typography) because there are no tests guarding metadata and visible brand strings.

### Hidden Assumptions
- Assumes deploy environments always provide a fully qualified URL string when `NEXT_PUBLIC_SITE_URL` is set.
- Assumes committing `.lattice/*` operational files is acceptable for long-term repository hygiene and disclosure.
- Assumes manual review will always catch copy/metadata regressions across pages.

### Missing Pieces
- No validation/sanitization around URL env input before `new URL(...)`.
- No automated checks asserting canonical metadata consistency (title template, `siteName`, `openGraph.url`, brand name).
- No policy guard (`.gitignore`/CI check) preventing operational `.lattice` artifacts from being committed.

### Trust Issues
- `NEXT_PUBLIC_SITE_URL` is trusted raw (`new URL(siteUrl)`) without guardrails (`src/lib/metadata.ts:8`, `src/lib/metadata.ts:17`).
- Repository trust boundary is loose: internal task/event state from multiple agents is committed directly (`.lattice/events/task_01KJR2DT7H011JR7N4BB7WVZ02.jsonl:1`, `.lattice/tasks/task_01KJR2DT7H011JR7N4BB7WVZ02.json:7`).

---

### Blockers — will cause problems
1. Unvalidated site URL can crash metadata initialization. `metadataBase: new URL(siteUrl)` executes during module evaluation, and `new URL('parallax.studio')` throws `ERR_INVALID_URL`; this is a real production footgun whenever env formatting is wrong. (`src/lib/metadata.ts:8`, `src/lib/metadata.ts:17`)

### Important — likely to cause problems
1. Internal `.lattice` workflow telemetry is committed into the app repo, including actor IDs, planning notes, and status transitions. This is operational data leakage risk and creates long-term repo noise/churn in production branches. (`.lattice/events/task_01KJR2DT7H011JR7N4BB7WVZ02.jsonl:1`, `.lattice/plans/task_01KJR2DT7H011JR7N4BB7WVZ02.md:1`, `.lattice/tasks/task_01KJR2DT7H011JR7N4BB7WVZ02.json:1`)
2. This PR changes core brand identity strings and metadata, but there is still no test harness configured to lock these values. Future regressions are now very likely to be accidental and silent. (Context baseline: “Tests: N/A”; touched files include `src/lib/metadata.ts`, `src/app/page.tsx`, `src/components/global/Header.tsx`, `src/components/global/Footer.tsx`)

### Suspicious — worth investigating
1. ~~The font payload artifact metadata claims a non-zero file size while payload file is empty.~~ False positive: validated payload is present and `366` bytes (`.lattice/artifacts/payload/art_01KJTBZJ016FDJYBE7Z6HQ6C0V.md`).
2. ~~Renaming left stale `Parallax Practice` strings in runtime pages/metadata.~~ False positive: validated current runtime files are consistently `Parallax` (`src/app/page.tsx:15`, `src/components/global/Header.tsx:62`, `src/components/global/Footer.tsx:20`, `src/lib/metadata.ts:12`).
