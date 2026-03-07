# ASMV-50: Audit docs and plans for stale About page references

About page was intentionally removed from header nav during axis nav redesign (4 balanced links: Architecture, Now, Writing, Software). But docs/plans may still reference it as a required page. Check PRD, CLAUDE.md, brand-guide.md, Lattice tasks, and any wireframe/plan files. Remove or update references that imply About needs to be in the nav. The /about route still exists — it's just not in the header.

## Audit Findings

Searched all `.md` files in PRD.md, CLAUDE.md, brand-guide.md, `.lattice/plans/`, `notes/`, and `research/` for "About" references. Categorized each as stale (implies About should be in nav) vs accurate (mentions the /about route existing, or uses "about" in a generic sense).

### Stale References (need updating)

1. **PRD.md line 85** — `| **About** | Who Julianna is | ...` in the Pages table. The page still exists, but the table gives no indication that About is intentionally excluded from header nav. Needs a note.

2. **PRD.md line 98** — `**Employer** → lands on Home or About → reviews Work`. Implies About is a primary landing destination reachable from nav. Needs clarification that About is reachable via footer/direct URL, not header nav.

3. **PRD.md line 268** — `Build all pages (Home, About, Work, Writing, Now)`. Lists About as a build target alongside other nav pages. The page exists but this makes it seem like a first-class nav destination. Add a note.

4. **ASMV-43 plan** (`.lattice/plans/task_01KK2GD2CPE0D84KWZS5FHSQJE.md` line 39) — Mobile overlay lists "Architecture, Writing, Software, Now, About" as nav links. About should NOT be in the mobile overlay since it's not in the desktop nav either.

5. **notes/team-review-main-20260306-1551.md lines 46, 72, 104** — Lists "About page missing from header nav" as a critical issue to fix (I4). This was written before the intentional decision to exclude About. The review finding is now resolved/superseded by ASMV-50.

6. **notes/CR-ASMV-24-ClaudeOpus-Critical-20260306-1602.md lines 38, 120-126, 217, 245** — Same review finding (I4) recommending "Add About to header nav." Superseded by intentional design decision.

### Accurate References (no changes needed)

- **CLAUDE.md line 38** — `├── about/page.tsx` in repo structure tree. Correctly documents the route exists.
- **brand-guide.md lines 94, 97** — Mentions "about page" as a context where positioning statements could be used. This is about page content, not nav structure. Accurate.
- **brand-guide.md line 363** — "Positioning / about copy" — voice guidance. Accurate.
- **PRD.md line 64** — "homepage, about/bio, architecture portfolio..." in scope list. Generic list of site pages. The page exists; this is fine.
- **ASMV-17 plan** (`.lattice/plans/task_01KJTWPDVAMV3TCETSY64150GS.md`) — Title mentions About. But sprint plan already marks ASMV-17 as cancelled/superseded. No change needed.
- **Research docs** — All "about" references are generic English usage ("about how," "about the project," etc.). Not stale.
- **notes/sprint-plan-20260306.md line 27** — References ASMV-50 itself. Accurate.

## Implementation Plan

### 1. PRD.md — Add navigation note to About page entry

In the Pages table (line 85), add a note that About is accessible via footer and direct URL but intentionally excluded from header nav (4 balanced axis nav links: Architecture, Now, Writing, Software).

Update Core Flows (line 98) to clarify the About route is reachable but not in primary nav.

In Phase 3 activities (line 268), no change needed — About is still a built page, just not a nav item.

### 2. ASMV-43 plan — Remove About from mobile overlay link list

Line 39: Change "Architecture, Writing, Software, Now, About" to "Architecture, Writing, Software, Now" (matching the 4 desktop nav links).

### 3. Team review notes — Mark I4 as resolved

In `notes/team-review-main-20260306-1551.md`:
- Line 46: Add note that this was an intentional decision
- Line 72: Mark I4 as resolved/superseded
- Line 104: Mark the action item as resolved

In `notes/CR-ASMV-24-ClaudeOpus-Critical-20260306-1602.md`:
- Lines 38, 120-126, 217, 245: Add notes that About's exclusion from header nav is intentional

### 4. No changes to code files

This is a docs-only task. Header.tsx, Footer, and the /about route itself are not modified.

### 5. Verify build

Run `pnpm build` to confirm nothing broke (even though only docs changed, good practice).

## Acceptance Criteria

- [ ] PRD.md About page entry clarifies it's not in header nav
- [ ] PRD.md Core Flows clarifies About is reachable but not primary nav
- [ ] ASMV-43 plan removes About from mobile overlay link list
- [ ] Team review notes mark I4 as resolved/superseded
- [ ] Critical review notes mark I4 as resolved/superseded
- [ ] No code files modified
- [ ] `pnpm build` passes
