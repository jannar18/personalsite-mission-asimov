# ASMV-65: Infinite canvas polish

## Human Feedback (from prior review)
- Items were overlapping → fixed (minGap 40→100)
- Rotation removed → fixed (maxRotation 0)
- Crop mismatch → fixed (object-cover→object-contain)
- Verify these look right at all zoom levels

## Polish Items

### 1. Item hover state
Subtle scale bump (1.02x) with CSS transition on the artifact wrapper.
Cursor pointer on hover. Keep it restrained — Asimov-level.

### 2. Keyboard navigation
- Arrow keys: pan canvas (40px per press)
- +/- keys: zoom in/out (same factor as scroll wheel)
- Don't capture keys when popover is open (Escape already handled)

### 3. Reduced motion
If `prefers-reduced-motion: reduce`:
- Disable lerp — instant position updates (set LERP_FACTOR to 1)
- Kill momentum/inertia (don't apply velocity on pointer up)

### 4. Edge constraints
Soft limits so you can't pan infinitely into empty space.
Compute content bounding box, add generous margin (1 viewport worth),
and clamp target position to those bounds.

### 5. Shadow/depth on items
Subtle box-shadow on each canvas item for a layered paper/desk feel.

## Skip
- Minimap: adds visual clutter, reset view button serves same purpose
- Loading skeletons: items already fade in via opacity transition

## Files
- **Modify:** `src/components/interactive/InfiniteCanvas.tsx`

## Acceptance Criteria
1. Items scale up subtly on hover
2. Arrow keys pan, +/- zoom
3. Reduced motion users get instant movement
4. Can't pan into infinite empty space
5. Items have subtle shadow
6. Build passes
