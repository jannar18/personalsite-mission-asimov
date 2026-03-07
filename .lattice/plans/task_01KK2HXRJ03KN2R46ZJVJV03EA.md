# ASMV-48: Optimize hero canvas performance on mobile

## Problem

Hero canvas renders 80 slices × 2 during crossfade = 160 `drawImage` calls/frame, plus a wireframe network with ~90 nodes and ~150+ edges (each with arc/stroke calls and signal dots). No quality degradation path for mobile. Users report jank.

## Root Causes

1. **80 slice count is excessive for mobile.** The perspective warp slicing is the dominant cost. On a 375px-wide phone, 80 slices means each slice is ~2px wide — far more precision than needed.
2. **Crossfade doubles the draw cost.** Two full `drawPhotoInQuad` calls during transitions.
3. **Wireframe complexity is fixed.** 90 nodes + ~150 edges with per-frame trig, signal dots, and cross markers — all drawn regardless of device.
4. **No DPR-aware rendering.** Canvas size is CSS pixels, not device pixels. On desktop this means blurry retina rendering; adding DPR support on desktop while *capping* it on mobile is the right move.
5. **rAF runs at full rate even when idle.** No frame throttling — loop runs at 60fps even when nothing visual is changing.

## Plan

### A. Introduce a mobile/performance tier system (`hero-canvas.ts`)

Add a `PerfTier` concept — `"high" | "low"` — detected at init time based on viewport width and `navigator.maxTouchPoints`. Passed into drawing functions via HeroState.

Detection heuristic:
- `low` if `window.innerWidth < 768` OR `(window.innerWidth < 1024 AND navigator.maxTouchPoints > 0)`
- `high` otherwise
- Recalculated on resize

### B. Reduce slice count on mobile

- Desktop: keep 80 slices (current behavior, no visual regression)
- Mobile: 24 slices — at 375px viewport, each slice is ~8px wide, still visually smooth for the perspective warp

Implement by making `slices` a parameter in `drawPhotoInQuad` rather than a hardcoded `const slices = 80`.

### C. Simplify wireframe on mobile

- Desktop: 90 nodes, 14 long-range edges (unchanged)
- Mobile: 40 nodes, 6 long-range edges
- Skip cross markers on mobile (the `node.phase > Math.PI` branch)
- Skip signal dots on mobile (the arc draw inside edge loop)

Implement by parameterizing `generateWireNetwork()` to accept counts, and conditionally skipping cross markers / signal dots in `drawRightPlane`.

### D. Cap DPR on mobile, enable on desktop

Add DPR-aware canvas sizing in the component's resize handler:
- Desktop: use `Math.min(devicePixelRatio, 2)` — sharp retina rendering
- Mobile: cap at `1` — render at CSS pixel resolution to halve/third pixel count

This is implemented in `HeroBrandVisual.tsx` resize handler, storing the effective DPR in HeroState for use in line width calculations.

### E. Throttle rAF to 30fps on mobile

On low-tier devices, skip every other frame. The animation is slow/ambient enough that 30fps is indistinguishable from 60fps for the scroll-driven fold and slideshow.

Implement via a simple frame-skip counter in the animation loop in `HeroBrandVisual.tsx`.

### F. Update metadata display for mobile

The bottom metadata bar shows "60.0fps" hardcoded. Update to reflect actual target framerate.

## Files Modified

- `src/lib/hero-canvas.ts` — parameterize slice count, wire network size, add PerfTier to HeroState, conditional drawing paths
- `src/components/interactive/HeroBrandVisual.tsx` — DPR-aware resize, frame throttling, perf tier detection, pass tier into state

## Acceptance Criteria

1. Desktop: zero visual regression — same 80 slices, same wireframe density, same 60fps
2. Mobile (< 768px): visibly smooth animation (no jank), reduced GPU/CPU load
3. `pnpm build` passes
4. No API changes that would break other consumers of hero-canvas exports
5. PerfTier is reactive to resize (e.g. responsive testing in devtools triggers re-tier)
