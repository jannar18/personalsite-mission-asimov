# ASMV-18: Daily update skill (/update-site) — v2 Rewrite

## Problem

The v1 skill was interaction-heavy (3+ user prompts in quick mode, 6+ in developed mode). The rework feedback demands an artifact-first, fully automated default flow with zero user prompts.

## Approach

Complete rewrite of `.claude/commands/update-site.md`. The new model:

1. **Auto-scan** `~/Documents/Artifacts/raw/` for today's media (images, PDFs, screenshots)
2. **No texture generation** — removed entirely. No media = text-only entry.
3. **Claude infers everything** — mood, project, tags, description, body text — from artifacts and session context. Zero prompts in default flow.
4. **`--blog` flag** — opt-in interactive mode where user writes a longer post alongside artifacts
5. **`--no-riso` flag** — skip Riso processing, use raw images as-is
6. **Claude generates a one-liner caption** for the day's work when no `--blog`
7. **Riso processing** by default for media (unless `--no-riso`)

## Key Files

- `.claude/commands/update-site.md` — the skill file (rewrite target)
- `src/lib/content.ts` — NowEntry schema reference
- `scripts/riso_engine.py` — Riso engine for image processing
- `src/content/now/*.mdx` — existing entries for voice reference
- `src/styles/tokens.css` — Riso palette colors

## Acceptance Criteria

- [ ] Default flow (no flags): zero user prompts. Scan -> process -> generate -> write MDX -> commit.
- [ ] `--blog`: enters interactive mode where user writes body text
- [ ] `--no-riso`: skips Riso engine, uses raw images
- [ ] No texture generation paths remain
- [ ] No "ask the user" prompts in default flow
- [ ] Claude generates brief caption/tagline for artifacts in default flow
- [ ] Frontmatter matches NowEntry schema
- [ ] Voice matches existing entries (studio-desk tone)
- [ ] Archive/cleanup step for processed raw files
- [ ] Error recovery paths documented
