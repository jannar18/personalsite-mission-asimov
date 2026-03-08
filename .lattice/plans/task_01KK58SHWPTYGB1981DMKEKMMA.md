# ASMV-60: Research infinite canvas approaches & build prototype

## 1. Research Summary

### 1.1 Codrops — "Infinite Canvas: Building a Seamless Pan-Anywhere Image Space" (Jan 2026)

**Tech:** React Three Fiber (Three.js/WebGL). 3D scene with `PlaneGeometry` for each image. GPU-accelerated.

**Core pattern:** Divides world into a 3x3x3 grid of "chunks." Camera position determines active chunks. Deterministic seeded layout per chunk — same coordinates always produce same arrangement. LRU cache (256 entries) for visited chunks.

**Pan/zoom:** Accumulates input into `targetVelocity`, which actual velocity lerps toward (`VELOCITY_LERP`). Single integration point: `basePos += velocity` per frame. Inertia via `VELOCITY_DECAY` on target velocity.

**Performance:** Fade/cull system using distance-based opacity. DPR clamped to 1.25-1.5 on mobile. Chunk regeneration throttled during fast zoom. Lazy scene loading via `React.lazy`. Achieves 120fps on high-refresh.

**Relevance for us:** The inertia/lerp model is excellent — stealing the `targetVelocity + lerp + decay` pattern for smooth panning feel. The chunk system is overkill for 37 items. WebGL/Three.js is way too heavy for our DOM-based artifacts.

**Key takeaway:** Velocity-based panning with lerp/decay produces better feel than direct 1:1 position mapping.

### 1.2 ywian — "Build Infinite Canvas Step by Step"

**Tech:** HTML5 Canvas 2D API with JavaScript/TypeScript.

**Core pattern:** Three state values: `offsetX`, `offsetY`, `scale`. Uses `ctx.setTransform(scale, 0, 0, scale, offsetX, offsetY)` to apply transformations in one call, then draws objects in world coordinates.

**Zoom math:** Convert cursor to world coords before scale change, apply new scale, recalculate offsets so world point stays under cursor. This is the standard "zoom toward pointer" algorithm.

**Performance:** Canvas layering (static vs dynamic), off-screen culling, requestAnimationFrame throttling. Recommends WebGL for 1000+ objects.

**Relevance for us:** The coordinate math is clean and well-explained. But Canvas2D means re-rendering all images manually — we lose DOM interactivity (click handlers, hover states, `next/image`, `<video>` controls). Not suitable for our HTML artifacts.

**Key takeaway:** The zoom-toward-cursor math (convert to world coords, scale, recalculate offset) is the standard algorithm we should implement.

### 1.3 Sandro Maglione — "Infinite Canvas HTML with Zoom and Pan"

**Tech:** TypeScript with Canvas2D, but the coordinate transformation math applies equally to CSS transforms.

**Core pattern:** Four conversion functions: `toVirtualX/Y` (real→virtual for rendering) and `toRealX/Y` (virtual→real for input). State: `offsetX`, `offsetY`, `scale`.

**Zoom algorithm:**
```
scaleAmount = 1 - zoomAmount
unitsZoomedX = virtualWidth() * scaleAmount
unitsAddLeft = unitsZoomedX * (midX / canvasWidth)
offsetX += unitsAddLeft
```

**Touch:** Two-finger gestures using Pythagorean distance between touch points. Pan divides movement by scale for consistent world-space displacement.

**Relevance for us:** The cleanest coordinate math explanation. The `pan delta / scale` insight is critical — without it, panning speed changes with zoom level. Touch handling pattern is directly reusable.

**Key takeaway:** Always divide pan deltas by current scale. The coordinate conversion functions are the mathematical foundation.

### 1.4 p5.js Pan/Zoom Gist (companje)

**Tech:** p5.js — minimal implementation.

**Core pattern:** Stores both current and target values (`x/y/w/h` and `tox/toy/tow/toh`). Uses `lerp(current, target, 0.1)` every frame for smooth interpolation. Zoom operates on dimensions rather than a scale factor.

**Pan:** `mouseDragged()` adds mouse delta to target position.

**Zoom:** Wheel events scale dimensions by `(zoom+1)` factor, with offset adjustment toward cursor:
```
tox -= zoom * (mouseX - tox)   // zoom in
tox += zoom/(zoom+1) * (mouseX - tox)  // zoom out
```

**Relevance for us:** The lerp-based easing produces a beautiful, natural feel. The dual-state pattern (current + target with lerp) is simpler than the Codrops velocity model and equally effective for our scale. But p5.js as a dependency adds unnecessary weight — the lerp pattern is trivially implemented in vanilla JS.

**Key takeaway:** Dual-state with lerp interpolation (current lerps toward target each frame) is the simplest way to get smooth, organic feel. Steal this pattern, skip the library.

### 1.5 p5.canvascam

**Tech:** Tiny p5.js camera library.

**Status:** 24 stars, 4 commits, no touch support, minimal docs.

**Relevance for us:** Not suitable. Incomplete, p5-dependent, no touch, not maintained.

**Key takeaway:** None — this is a dead end.

---

## 2. Approach Evaluation

### 2.1 CSS Transforms on a Container Div (RECOMMENDED)

A single wrapper `<div>` with `transform: translate(Xpx, Ypx) scale(S)` and `transform-origin: 0 0`. Children are absolute-positioned HTML elements at world coordinates. Pan/zoom updates the wrapper transform only.

**Pros:**
- Artifacts remain native DOM elements — `next/image`, `<video>`, click handlers, hover states, accessibility attributes all work unchanged
- CSS `transform` is GPU-composited via browser's own compositor — extremely performant for 30-40 elements
- `will-change: transform` hints browser to promote the layer
- No new dependencies
- Popover pattern from ArtifactBar reuses without modification (it's a fixed overlay, independent of canvas transform)
- Hot-path is one `style.transform` assignment per frame — no React re-renders during interaction
- Existing `artifact-treatment` CSS class and `.grain-texture` work natively on children

**Cons:**
- Very large worlds (thousands of items) could get heavy due to DOM size — not an issue at 37 items
- Need to handle `transform-origin` carefully (must be `0 0` to make math clean)
- Browser zoom interaction needs `touch-action: none` to prevent conflicts
- Scaling text/images at extreme zoom levels may look blurry — mitigated by clamping scale range

**Verdict:** Best fit by a large margin. The artifacts are HTML; the solution should be HTML.

### 2.2 Canvas2D Rendering

Render everything onto a `<canvas>` element using `drawImage()` for photos and custom rendering for videos.

**Pros:**
- Full control over rendering pipeline
- Existing pattern in `hero-canvas.ts` proves the team can ship this
- Single pixel buffer — no DOM overhead

**Cons:**
- Videos cannot be rendered natively on Canvas2D (would need to draw video frames manually via `drawImage(video)` in a rAF loop — loses native controls, captions, accessibility)
- `next/image` optimization pipeline bypassed entirely — manual image loading
- Click detection requires manual hit testing (point-in-rect for each item)
- Hover states require manual cursor tracking
- Loses all browser accessibility (tab order, screen readers, alt text)
- Significantly more implementation work for equivalent functionality

**Verdict:** Wrong tool. Canvas2D excels for procedural graphics (like the hero wireframe network). For interactive HTML content, it's a step backward.

### 2.3 p5.js Library

Use p5.js for the canvas rendering and interaction handling.

**Pros:**
- Built-in `lerp()`, `map()`, mouse/touch event handling
- The gist proves the pan/zoom math is minimal in p5

**Cons:**
- All Canvas2D cons apply (no native DOM elements)
- Adds a ~800KB dependency for functionality achievable in ~100 lines of vanilla JS
- p5.js creates its own canvas element — doesn't play well with React's DOM model
- No SSR compatibility (window-dependent at import time)
- The lerp pattern is 3 lines of vanilla JS: `current += (target - current) * factor`

**Verdict:** Dependency not justified. The only appealing thing (lerp easing) is trivially reimplemented.

### 2.4 WebGL / Three.js / React Three Fiber

Full 3D rendering pipeline (as used by Codrops).

**Pros:**
- Maximum rendering performance
- Could support future effects (depth blur, parallax layers)

**Cons:**
- Massive dependency (Three.js is ~600KB min)
- Violates "Asimov-first" principle — Asimov sites use zero WebGL
- Artifacts become textures on planes — lose all DOM interactivity
- Enormous implementation complexity for a 2D pan/zoom surface
- SSR challenges with Next.js

**Verdict:** Overkill by orders of magnitude. Banked for potential future interactive features, not for a studio desk.

---

## 3. Recommended Approach: CSS Transform Container with Lerp Easing

### 3.1 Core Architecture

```
src/app/now/page.tsx                    — Server component: loads entries, passes to client
src/components/interactive/
  InfiniteCanvas.tsx                     — Client component: the pan/zoom/render surface
src/lib/canvas-layout.ts               — Deterministic position/scale generation
```

### 3.2 How It Works

**Container structure:**
```
<div class="canvas-viewport">           ← fixed viewport, overflow:hidden, captures events
  <div class="canvas-world">            ← transformed div: translate + scale
    <div class="canvas-item" style="left:X; top:Y; width:W">  ← per-artifact
      <Image ... /> or <video ... />
    </div>
    ...37 items...
  </div>
</div>
```

**Transform update (hot path):**
```ts
// In rAF loop — no React state, pure ref mutation
camera.x += (target.x - camera.x) * LERP_FACTOR;   // 0.12
camera.y += (target.y - camera.y) * LERP_FACTOR;
camera.scale += (target.scale - camera.scale) * LERP_FACTOR;

worldRef.current.style.transform =
  `translate(${camera.x}px, ${camera.y}px) scale(${camera.scale})`;
```

This dual-state pattern (current + target, lerp each frame) produces smooth, organic motion with zero React re-renders during interaction. The rAF loop only runs while camera is moving (stops when converged to save power).

### 3.3 Pan Algorithm

```ts
// Pointer events (unified mouse + touch)
onPointerDown: record startPointer, set isDragging
onPointerMove: if dragging, target.x += (dx) / camera.scale
                              target.y += (dy) / camera.scale
                // Divide by scale so panning speed is constant regardless of zoom
onPointerUp:   clear isDragging
               if totalMovement < 5px: treat as click → open popover
```

Use `setPointerCapture()` for reliable drag tracking even when cursor leaves the element.

### 3.4 Zoom Algorithm (Zoom Toward Cursor)

```ts
onWheel(e) {
  e.preventDefault();
  const zoomFactor = e.deltaY > 0 ? 0.92 : 1.08;  // ~8% per scroll tick
  const newScale = clamp(target.scale * zoomFactor, MIN_SCALE, MAX_SCALE);
  const ratio = newScale / target.scale;

  // Convert cursor position to world coordinates
  const worldX = (e.clientX - target.x) / target.scale;
  const worldY = (e.clientY - target.y) / target.scale;

  // Adjust offset so the world point under cursor stays under cursor
  target.x = e.clientX - worldX * newScale;
  target.y = e.clientY - worldY * newScale;
  target.scale = newScale;
}
```

Scale bounds: `MIN_SCALE = 0.2`, `MAX_SCALE = 2.5`. These keep artifacts legible at min zoom and prevent pixel blowup at max zoom.

### 3.5 Pinch Zoom (Touch)

```ts
// Track two-touch gesture
onPointerDown: if second pointer, record initialPinchDistance and initialScale
onPointerMove: if two pointers active {
  const currentDistance = distanceBetween(pointer1, pointer2);
  const ratio = currentDistance / initialPinchDistance;
  target.scale = clamp(initialScale * ratio, MIN_SCALE, MAX_SCALE);

  // Pan by midpoint delta
  const midpoint = midpointOf(pointer1, pointer2);
  target.x += (midpoint.x - prevMidpoint.x);
  target.y += (midpoint.y - prevMidpoint.y);
}
```

**Critical:** Set `touch-action: none` on the viewport to prevent browser zoom/scroll from competing with our gesture handling.

### 3.6 Layout Algorithm (`canvas-layout.ts`)

**ASMV-61 scope** — this section defines the interface; ASMV-61 implements the algorithm.

```ts
interface CanvasItemLayout {
  x: number;       // world-space left position (px)
  y: number;       // world-space top position (px)
  width: number;   // display width (px)
  rotation: number; // slight tilt (degrees, ±4)
  zIndex: number;  // stacking order
}

function generateLayout(entries: NowEntry[]): Map<string, CanvasItemLayout>;
```

**Requirements for the algorithm:**
- **Deterministic:** Same entries → same layout. Seed from entry slug hash so positions are stable across renders and sessions.
- **No overlap:** Items must not overlap. Use collision detection (simple rect intersection with padding).
- **Varied sizes:** Landscape images larger (300-500px wide), portrait smaller (200-350px). Videos slightly larger to accommodate player controls.
- **Organic scatter:** Not a grid. Poisson disk sampling or force-directed relaxation to achieve "scattered on desk" feel with natural spacing.
- **Breathing room:** Minimum 40px gap between items at default zoom.
- **World size:** Approximately 4000x3000px virtual surface at 37 items. Scales with item count.
- **Slight rotation:** ±4 degrees per item, seeded from slug, for organic desk feel.
- **Grouping tendency:** Items from the same date cluster loosely (not rigidly) — like a day's work spread in one area of the desk.
- **Initial viewport:** Camera starts centered on the centroid of all items, zoomed to fit ~8-12 items in view.

### 3.7 Popover Detail View

**ASMV-64 scope** — reuses ArtifactBar pattern directly.

When a click is detected (not a drag — check `totalMovement < 5px` threshold):
1. Set `activeEntry` React state (this is the one place React state is needed)
2. Render fixed overlay: backdrop scrim (`bg-ink/40 backdrop-blur-sm`) + centered card
3. Card shows full-size image/video, date, mood, description
4. Escape key or scrim click closes
5. No "View full entry →" link — we're already on the now page

The popover is rendered outside the canvas transform (as a sibling to the viewport), so it's unaffected by pan/zoom.

### 3.8 Performance Considerations

| Concern | Mitigation |
|---------|------------|
| DOM size (37 items) | Well within browser compositing limits. Chrome handles 100+ transformed children without issue. |
| Image loading | `loading="lazy"` on images + `IntersectionObserver` threshold. Items off-viewport don't load. |
| Video autoplay | Videos autoplay muted+loop only when visible. Pause via `IntersectionObserver` when scrolled/zoomed out of view. |
| rAF loop | Only runs while camera is animating (delta between current and target > epsilon). Stops when converged. |
| Repaints | `will-change: transform` on world container. Transform updates don't trigger layout — only compositing. |
| Mobile DPR | Not relevant — we're not rendering to canvas. Browser handles DPR natively for DOM elements. |
| Touch conflict | `touch-action: none` on viewport prevents browser gestures from interfering. |
| Bundle size | Zero new dependencies. The component is ~200-300 lines of TypeScript. |

### 3.9 Mobile Considerations

- **Touch targets:** Items should be at least 44x44px at any zoom level. Enforce minimum display size.
- **Inertia:** Apply momentum after drag release — track velocity of last N frames, continue panning with decay. Feels native on mobile.
- **Initial zoom:** Start slightly more zoomed in on mobile (fewer items visible, larger touch targets).
- **Viewport header:** The page header ("the studio desk") should remain fixed above the canvas viewport, not inside it.
- **Performance tier:** Use `navigator.maxTouchPoints > 0` + viewport width to detect mobile. Reduce lerp factor slightly for smoother feel on lower-powered devices.

### 3.10 Accessibility

- Each artifact gets an `aria-label` with the entry's description or date
- Popover uses `role="dialog"` with `aria-modal="true"`
- Focus trap in popover when open
- Keyboard: Arrow keys to pan, +/- to zoom, Enter to open focused item, Escape to close popover
- "Reset view" button is keyboard-focusable
- Reduced motion: if `prefers-reduced-motion: reduce`, disable lerp (instant position updates), disable item rotations

---

## 4. Implementation Plan

### 4.1 Files to Create

| File | Purpose |
|------|---------|
| `src/components/interactive/InfiniteCanvas.tsx` | Main client component: viewport, world container, event handlers, rAF loop, popover |
| `src/lib/canvas-layout.ts` | Layout algorithm: hash-seeded positioning, collision avoidance, size variance |

### 4.2 Files to Modify

| File | Change |
|------|--------|
| `src/app/now/page.tsx` | Refactor from vertical list to passing entries to `<InfiniteCanvas>`. Keep as server component — data loading stays here. |
| `src/styles/globals.css` | Add `.canvas-viewport` and `.canvas-world` utility classes (cursor styles, touch-action, overflow) |

### 4.3 Implementation Sequence (Maps to ASMV-61 through ASMV-65)

**ASMV-60 (this task) — Prototype:**
- Build a minimal `InfiniteCanvas.tsx` with:
  - Hard-coded positions for 5-6 items (no layout algorithm yet)
  - Basic mouse-drag panning
  - Scroll-wheel zooming toward cursor
  - CSS transform on wrapper div
  - Lerp-based easing in rAF loop
- Wire it into `now/page.tsx` to verify it works with real entries
- This proves the approach before investing in the full implementation

**ASMV-61 — Layout Algorithm:**
- Implement `canvas-layout.ts` with:
  - Slug-based seeded PRNG (simple mulberry32 or similar — no dependency)
  - Poisson disk sampling or force-directed placement
  - Size variance by media type
  - Collision detection with padding
  - Date-based loose clustering
  - Initial camera position calculation

**ASMV-62 — Core Component:**
- Full `InfiniteCanvas.tsx` with:
  - All event handling (pointer events for unified mouse/touch)
  - Zoom-toward-cursor with scale clamping
  - Click vs drag discrimination (5px threshold)
  - `setPointerCapture` for reliable drag
  - Momentum/inertia after drag release
  - "Reset view" button
  - `will-change: transform` optimization
  - rAF loop with convergence detection (stop when idle)

**ASMV-63 — Touch/Mobile:**
- Pinch-to-zoom (two-pointer tracking)
- Touch-drag panning
- `touch-action: none` on viewport
- Mobile-specific initial zoom level
- Touch target size enforcement
- Momentum decay tuning for touch
- Performance testing on iOS Safari / Chrome Android

**ASMV-64 — Popover Integration:**
- Extract/reuse ArtifactBar popover pattern
- Wire click handler (with drag discrimination)
- Keyboard navigation (Escape to close)
- Focus trap
- Popover rendered as sibling to viewport (outside transform)
- Video playback in popover (controls, autoplay)

**ASMV-65 — Polish:**
- Minimap (small fixed preview showing viewport rectangle on world)
- Smooth "fit all" animation on reset
- Loading states (skeleton items while images load)
- Reduced motion support
- Keyboard pan/zoom (arrow keys, +/-)
- Edge constraints (soft limits so you can't pan infinitely into empty space)
- Background: warm paper color + grain texture on canvas viewport
- Cursor changes: grab → grabbing during drag
- Item hover state: subtle scale bump (1.02x) with transition

---

## 5. Acceptance Criteria for ASMV-60 (Prototype)

The prototype is deliberately minimal — it proves the CSS transform approach works before investing in the full implementation chain.

1. **Pan works:** Mouse drag pans the canvas. Items move with the wrapper.
2. **Zoom works:** Scroll wheel zooms toward cursor position. Scale clamped to [0.2, 2.5].
3. **Lerp easing:** Movement is smooth, not jerky. Camera lerps toward target position each frame.
4. **Real entries:** At least 6 real `NowEntry` artifacts rendered on the canvas (mix of images and videos).
5. **Positions are hard-coded or simple** — no layout algorithm yet (that's ASMV-61).
6. **No new dependencies** added to `package.json`.
7. **Design language preserved:** Warm paper background, grain texture, `artifact-treatment` class on items.
8. **Server/client split:** `now/page.tsx` remains a server component that loads data. `InfiniteCanvas` is a client component that receives data as props.
9. **Videos autoplay** muted and loop (same as current behavior).
10. **The dev server runs** and the page loads without errors (`pnpm dev` succeeds).

**Out of scope for prototype:** Touch/pinch, popover, minimap, keyboard navigation, mobile optimization, layout algorithm, collision avoidance, accessibility. These are covered by ASMV-61 through ASMV-65.

---

## 6. How This Feeds into Downstream Tasks

| Task | Depends on | Receives from ASMV-60 |
|------|-----------|----------------------|
| ASMV-61 (layout) | ASMV-60 | The `InfiniteCanvas` component's expected data interface; the world coordinate system; the `CanvasItemLayout` type definition |
| ASMV-62 (core component) | ASMV-60 | The working prototype to extend — adds robust event handling, inertia, reset view, convergence detection |
| ASMV-63 (mobile) | ASMV-62 | The core component to add touch support to |
| ASMV-64 (popover) | ASMV-62 | The click handler and entry data to wire into popover |
| ASMV-65 (polish) | ASMV-62, ASMV-63, ASMV-64 | The complete component to polish |

---

## 7. Key Technical Decisions

| Decision | Choice | Why |
|----------|--------|-----|
| CSS transforms vs Canvas2D | CSS transforms | Artifacts are DOM elements; Canvas2D would lose interactivity |
| Lerp easing vs velocity model | Lerp (dual-state: current + target) | Simpler than Codrops velocity model; equally effective at 37 items |
| React state vs refs for camera | Refs + rAF | Pan/zoom at 60fps must not trigger React re-renders |
| Pointer events vs mouse+touch | Pointer events | Unified API, `setPointerCapture` for reliable drag |
| p5.js dependency | No | Adds 800KB for 3 lines of lerp math |
| Layout seeding | Slug hash → mulberry32 PRNG | Deterministic, no dependency, stable across sessions |
| Transform origin | `0 0` (top-left) | Simplifies all coordinate math — translate is the world origin |

---

## 8. Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| CSS transform blurry at high zoom | Medium | Low | Clamp max scale to 2.5x; use `image-rendering: auto` |
| Touch gesture conflicts with browser | High | Medium | `touch-action: none` + `e.preventDefault()` on all touch events |
| Videos not autoplaying on mobile Safari | Medium | Low | Muted autoplay works on iOS; fallback to play-on-tap |
| 37 items causing layout thrash | Low | Low | `will-change: transform` on world container; one transform update per frame |
| Complex pinch zoom math | Medium | Medium | Follow Sandro's proven two-touch distance formula; test on real devices |
| Initial load: all 37 images at once | Medium | Medium | `loading="lazy"` + IntersectionObserver; only items in/near viewport load |
