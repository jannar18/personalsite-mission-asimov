## Critical Code Review
- **Date:** 2026-03-09 19:45 PST
- **Model:** Claude Opus 4.6 (claude-opus-4-6)
- **Branch:** feature/asmv-60-infinite-canvas-prototype
- **Latest Commit:** 8fd0202 (+ uncommitted layout prototype changes)
- **Linear Story:** ASMV-60 / ASMV-68–72
- **Review Type:** Critical/Adversarial
---

## The Ugly Truth

This is solid prototype work. The architecture is right: server component reads dimensions, client components switch via query param, popover extracted and shared, layout switcher is clean. The implementation is correct — it compiles, it renders, the interaction patterns are consistent.

But there's one real performance bug, one UX gap, and a pile of structural shortcuts that are fine for a prototype but would be toxic in production. Let me be specific.

## What Will Break

1. **42MB of file reads per request.** `image-utils.ts:39` calls `readFileSync(absolutePath)` which reads the **entire PNG file** into memory. You have 31 PNGs totaling 42MB. Every time someone hits `/now` (or `/now?layout=anything`), Node reads 42MB of image data off disk just to extract 24 bytes per file. On Vercel serverless with cold starts, this adds measurable latency. On repeat requests with the page being dynamic (due to `searchParams`), there's no caching — it reads 42MB every time.

2. **Popover doesn't lock body scroll on masonry/bento.** Open an image in masonry or bento, then scroll with your trackpad. The background scrolls behind the modal. On scatter/columns this doesn't happen because the container has `touchAction: none`. Inconsistent and disorienting.

3. **ColumnsLayout calls `setVisibleRange` inside the rAF loop** (line 248). The entire point of the ref-based camera pattern is to avoid React re-renders during animation. Calling setState in the hot animation path defeats this — every frame where the visible range changes triggers a React reconciliation pass during what should be a pure CSS-transform update. With only ~7 chunks, viewport culling is solving a problem that doesn't exist while creating one that does.

## What's Missing

- **No console warnings when image reads fail.** `image-utils.ts:53` silently catches errors and returns 800x800. If someone adds a frontmatter path to a non-existent image, the layout silently renders with wrong dimensions. During development, this will waste 20 minutes debugging "why is this image square."

- **No tests.** Expected for this project stage, but noted: the layout algorithms (distributeToColumns, buildChunks, getSpan) are pure functions that would take 10 minutes to test and would catch regressions if the prototype evolves.

- **No body scroll lock utility.** The popover needs `document.body.style.overflow = 'hidden'` on open and restore on close. This is a 4-line fix.

## The Nits

- **`isVideo()` defined 5 times** across ArtifactPopover, InfiniteCanvas, MasonryLayout, BentoLayout, ColumnsLayout. Identical regex. Should be a shared util.

- **5 identical entry type interfaces** (CanvasEntry, MasonryEntry, BentoEntry, ColumnsEntry, StudioDeskEntry). They're the same type. `StudioDeskEntry` should be the canonical one, imported by all layouts.

- **StudioDesk.tsx eagerly imports all 4 layouts.** With ~2000 lines of JS across the four components, the client bundle includes all of them regardless of which layout is active. `next/dynamic` would split this trivially.

- **400+ lines of camera code duplicated** between InfiniteCanvas and ColumnsLayout. Intentional per the plan — no hook extraction for prototype speed. Noted as tech debt.

- **No resize debounce in MasonryLayout** (line 60). Fast window resizing fires `setColCount` on every resize event. Minor jank.

---

## Numbered Findings

### Blockers

None. This is a prototype for one user (Julianna) to compare layouts in a browser.

### Important

**1. `readFileSync` reads entire PNG files into memory — 42MB per request**
- File: `src/lib/image-utils.ts:39`
- Fix: Use `openSync` + `readSync` to read only the first 24 bytes:
  ```typescript
  const fd = openSync(absolutePath, 'r');
  const header = Buffer.alloc(24);
  readSync(fd, header, 0, 24, 0);
  closeSync(fd);
  ```
- ✅ Confirmed — `readFileSync` without encoding returns full Buffer; 31 PNGs = 42MB.

**2. Body scroll not locked when popover opens on masonry/bento layouts**
- Files: `MasonryLayout.tsx`, `BentoLayout.tsx` (and `ArtifactPopover.tsx` which should own this)
- When popover is open, background content is scrollable on the scroll-based layouts.
- Fix: Add `useEffect` in ArtifactPopover that sets `document.body.style.overflow = 'hidden'` on mount and restores on unmount.
- ✅ Confirmed — masonry/bento use `min-h-screen bg-paper` with normal overflow; nothing prevents scroll when modal is open.

**3. `setVisibleRange` called inside rAF animation loop in ColumnsLayout**
- File: `src/components/interactive/ColumnsLayout.tsx:248`
- The `updateVisibleChunks()` call inside `tick()` triggers React setState on potentially every animation frame. This undermines the ref-based animation pattern's entire purpose.
- Fix: Move culling updates to pointer-up/wheel-end events, or throttle to once per ~200ms, or remove culling entirely (7 chunks don't need it).
- ✅ Confirmed — `updateVisibleChunks` calls `setVisibleRange` which is a React setState.

**4. Silent failure masks wrong image paths**
- File: `src/lib/image-utils.ts:53`
- If a PNG doesn't exist or is corrupted, the function silently returns 800x800 with no warning. This will cause confusing layout bugs during content authoring.
- Fix: Add `console.warn` in the catch block.
- ✅ Confirmed — empty catch block falls through to default.

### Potential

**5. All 4 layout components eagerly loaded in client bundle**
- File: `src/components/interactive/StudioDesk.tsx:5-8`
- Bundle includes ~2000 lines of JS for all layouts when only one is active.
- Fix: `next/dynamic` imports.
- ⬇️ Real but low priority for a prototype with one user.

**6. `isVideo()` duplicated 5 times across files**
- Files: ArtifactPopover.tsx:14, InfiniteCanvas.tsx:31, MasonryLayout.tsx:9, BentoLayout.tsx:9, ColumnsLayout.tsx:9
- Identical 1-line regex function. Should be in a shared util.
- ⬇️ Cosmetic for a prototype.

**7. 5 identical entry type interfaces**
- CanvasEntry, MasonryEntry, BentoEntry, ColumnsEntry are identical; StudioDeskEntry is the same + already exported.
- Fix: Import `StudioDeskEntry` from StudioDesk.tsx (or a shared types file) in all layouts.
- ⬇️ TypeScript structural typing means this works, just messy.

**8. No resize debounce in MasonryLayout**
- File: `src/components/interactive/MasonryLayout.tsx:60-68`
- `setColCount` fires on every resize event during window resize drag.
- Fix: Debounce or use `requestAnimationFrame` throttle.
- ⬇️ Minor visual jank during edge-drag resize.

**9. Dynamic page does sync file reads on every request**
- File: `src/app/now/page.tsx` — page is `ƒ (Dynamic)` due to `searchParams`
- `getAllNowEntries()` + `getImageDimensions()` run on every request, not cached.
- For a personal site with negligible traffic, this is fine. On Vercel edge, each cold start pays the full I/O cost.
- ❓ Likely negligible impact at current scale.

---

## Validation Pass Summary

| # | Status | Note |
|---|--------|------|
| 1 | ✅ Confirmed | `du -ch` confirms 42MB of PNGs; `readFileSync` has no length parameter |
| 2 | ✅ Confirmed | Scroll-based layouts don't prevent body scroll behind modal |
| 3 | ✅ Confirmed | `updateVisibleChunks()` called in `tick()` → setState in rAF |
| 4 | ✅ Confirmed | Empty catch block, no warning |
| 5 | ⬇️ Real, low priority | Prototype, one user |
| 6 | ⬇️ Real, cosmetic | 5 identical one-liners |
| 7 | ⬇️ Real, cosmetic | Structural typing covers it |
| 8 | ⬇️ Real, minor | Edge-drag resize jank |
| 9 | ❓ Likely negligible | Personal site traffic |

## Verdict

**Would I deploy this to 100k users?** No — fix #1 (42MB file reads) and #2 (scroll lock) first.

**Would I ship this as a prototype for Julianna to compare layouts in her browser?** Yes. The bugs are real but none of them affect the core goal: visually comparing four layout modes. The image reads are wasteful but fast enough on a dev machine. The scroll lock is annoying but not blocking.

**Fix order for cleanup:**
1. `readFileSync` → `readSync(fd, buf, 0, 24, 0)` — 5-minute fix, eliminates 42MB waste
2. Body scroll lock in `ArtifactPopover` — 4-line fix
3. Remove viewport culling from ColumnsLayout (or move it out of rAF) — simplifies code
4. Add `console.warn` on failed image reads — saves future debugging time

Everything else is prototype debt that only matters if one of these layouts "wins" and becomes the production layout.
