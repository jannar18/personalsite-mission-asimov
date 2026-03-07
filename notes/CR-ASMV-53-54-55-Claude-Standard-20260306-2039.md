## Code Review
- **Date:** 2026-03-06 20:39 EST
- **Model:** Claude Opus 4.6 (claude-opus-4-6)
- **Branch:** main (local commits ahead of origin/main)
- **Latest Commit:** 47edf3d + uncommitted fixes
- **Lattice Tasks:** ASMV-53 (ArtifactBar hover), ASMV-54 (hero animation), ASMV-55 (header shift)
---

## Test Results

| Check | Result |
|-------|--------|
| TypeScript (`tsc --noEmit`) | **Pass** — 0 errors |
| ESLint (`pnpm lint`) | **Pass** — 0 warnings, 0 errors |
| Build | Not re-run (dev server active) |

No test suite configured yet (noted in CLAUDE.md).

## What Changed

### 1. ArtifactBar hover overlay removed (ASMV-53)
**File:** `src/components/interactive/ArtifactBar.tsx`

Deleted 28-line hover overlay that showed date/mood/project metadata in a dark `bg-ink/70` popup. The subtle `group-hover:scale-[1.02]` + `group-hover:shadow-lg` on the image is preserved. Click-to-popover still works. Clean removal, no loose ends.

### 2. Hero animation reverted to pre-Wave-1 + Riso colors (ASMV-54)
**Files:** `src/lib/hero-canvas.ts`, `src/components/interactive/HeroBrandVisual.tsx`

The Wave 1 changes (ASMV-40) broke the scroll animation by mapping rotation to 0.5→1→0.5 instead of 0→1→0. An agent attempted a fix (commit `bf102ec`) by adding a remapping layer (`const t = 0.5 + s.rotation * 0.5`), but this was still wrong visually. Solution: full revert to pre-Wave-1 code, keeping only the Riso color update from ASMV-45.

Current behavior:
- `rotation=0` → planes are thin vertical lines (closed)
- `rotation=1` → planes fully spread (merged)
- Scroll: 0 → 1 (fold in) → hold → 1 → 0 (unfold back)

### 3. Header alignment (ASMV-55)
**File:** `src/components/global/Header.tsx`

Agent replaced flex layout with CSS grid (`1fr auto 1fr`) to keep the cross button centered. Local follow-up moved `py-5` to the header and positioned the wordmark with `top-1/2 -translate-y-1/2` for vertical alignment.

## Review Findings

### Blockers

1. ✅ **Confirmed — `pointer-events-none` on grid wrapper may break hover-to-open nav** (`Header.tsx:156`)

   The grid wrapper has `pointer-events-none` but also has `onMouseEnter` / `onMouseLeave` handlers (lines 158-159). These handlers control the post-hero hover-to-reveal navigation on desktop.

   With `pointer-events-none`, the div itself won't receive native mouse events. React's synthetic event system *may* still work via event delegation (React catches `mouseover`/`mouseout` at the root and synthesizes enter/leave), but this is fragile — hovering over empty grid areas between `pointer-events-auto` children won't trigger enter, and leaving from an empty gap won't trigger leave.

   The original code used `pointer-events-auto` on this wrapper. **Fix:** change `pointer-events-none` to `pointer-events-auto` on the grid div, or move the hover handlers to a transparent overlay that IS interactive.

2. ✅ **Confirmed — Nav links are invisible but still clickable when closed** (`Header.tsx:162-167, 212-217`)

   When `navOpen` is false, nav links fade to `opacity-0` but remain in the DOM at full size. The original code also used `max-w-0` to collapse them, preventing accidental clicks on invisible elements. The grid layout removed `max-w-0` since the grid columns handle sizing, but this leaves invisible interactive elements.

   **Fix:** Add `pointer-events-none` to the nav when `navOpen` is false, or use `visibility: hidden` / conditional rendering.

### Important

3. ✅ **Confirmed — Git history has add-then-revert for hero remapping** (commits `bf102ec` + uncommitted)

   Commit `bf102ec` added `const t = 0.5 + s.rotation * 0.5` remapping to plane geometry. The uncommitted revert removes it entirely. When committed, history will show code added and then immediately removed. Not a functional issue, but messy. Consider squashing these into a single "revert hero to pre-Wave-1 + Riso colors" commit.

4. ✅ **Confirmed — Hardcoded RGBA values instead of CSS variables** (`HeroBrandVisual.tsx:186,202,216,230,238`)

   Five instances of `rgba(71,31,32,...)` hardcoded in the JSX. These should reference the Riso Oxblood token. If the palette changes, these will be missed. Low risk for now since the palette was just updated, but worth cleaning up.

### Potential

5. ❓ **Uncertain — Mobile empty grid cells** (`Header.tsx:184, 234`)

   Two `<div className="md:hidden" />` elements serve as empty grid cells on mobile to maintain the 3-column layout when navs are `display:none`. This works, but on desktop (md+) these divs are `display:block` with no content — they shouldn't affect layout in a grid with `1fr auto 1fr`, but they add invisible DOM nodes. Minor, likely harmless.

6. ⬇️ **Lower priority — Scroll breakpoints differ from committed version**

   Pre-Wave-1 code uses 0.35/0.65 breakpoints for the fold/unfold animation. The (now-overwritten) fix used 0.3/0.7. The pre-Wave-1 values are what was working before, so this is correct. Just noting the difference.

## Summary

The ArtifactBar fix is clean. The hero revert is the right call — simpler and matches the known-good behavior. The header alignment fix has two real issues: the `pointer-events-none` on the grid wrapper likely breaks hover-to-reveal nav on desktop (#1), and invisible nav links remain clickable (#2). Both are straightforward fixes.
