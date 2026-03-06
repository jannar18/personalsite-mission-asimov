# ASMV-40: Fix scroll animation bug on hero

## Root Cause

The scroll animation maps progress 0->1 through three phases:
1. `progress 0-0.35`: rotation eases from **0 to 1** (fold in)
2. `progress 0.35-0.65`: rotation holds at **1** (merged)
3. `progress 0.65-1.0`: rotation eases from **1 to 0** (unfold)

The plane geometry functions (`getLeftPlane`/`getRightPlane`) use `rotation` as a multiplier on `maxSwing` to determine how far the plane extends from its fold edge:
- `rotation=0` means `backX = frontX` -- the plane collapses to a zero-width vertical line (invisible)
- `rotation=1` means the plane extends fully (visible, with photo/wireframe content)

**The bug:** On page load (before any scroll), `rotation=0`, so both planes are invisible zero-width lines. The hero appears completely empty. The user sees only the background color. The first visual impression is broken.

Additionally, at the END of the scroll (progress=1.0), rotation returns to 0, and the planes again become invisible lines -- another bad state.

## Fix

Invert the scroll-to-rotation mapping so the planes start OPEN and fold together on scroll:

1. **Initial state (progress=0):** rotation=0 means planes are fully open/extended (visible). The default state should show two separate visible planes.
2. **Middle of scroll (progress ~0.5):** rotation=1 means planes fold together into the center (the "merged" state where they overlap).
3. **End of scroll (progress=1.0):** rotation returns to 0, planes separate back to fully open.

This requires inverting the plane geometry so `rotation=0` = open and `rotation=1` = folded/merged. Specifically:

### Changes in `hero-canvas.ts`:

**`getLeftPlane`:**
- Currently: `backX = frontX + rotation * maxSwing` (0=closed, 1=open)
- Change to: `backX = frontX + (1 - rotation) * maxSwing` (0=open, 1=closed toward center)

Wait -- actually the simpler fix is to invert the scroll handler output, not the geometry. The geometry already works correctly for rotation values. We just need the scroll to output the right rotation values.

**Revised approach -- change scroll handler in `HeroBrandVisual.tsx`:**

The current scroll phases:
```
progress 0-0.35:  rotation 0->1  (invisible to visible)
progress 0.35-0.65: rotation 1   (visible/merged)
progress 0.65-1.0: rotation 1->0 (visible to invisible)
```

Change to:
```
progress 0-0.35:  rotation stays 0  (visible/open, no animation yet -- or a gentle partial fold)
progress 0.35-0.65: rotation eases 0->1 (fold together, merge)
progress 0.65-1.0:  rotation eases 1->0 (unfold back apart)
```

Actually, the cleanest fix: just invert the rotation value output. Instead of `rotation = ease(...)` producing 0->1->1->0, make it produce 1->0->0->1. Wait, that would mean the planes start folded...

Let me think again. The geometry:
- rotation=0: planes are thin lines (frontX = backX)
- rotation=1: planes are fully spread

The scroll intent:
- Start: planes visible (spread) = rotation should be ~1
- Middle: planes merged/overlapping = rotation should be ~1 (they're already overlapping at rotation=1)
- End: planes visible (spread) = rotation should be ~1

Hmm, actually the problem is more fundamental. At rotation=1, both planes overlap in the center. At rotation=0, both are thin lines. Neither state represents "two separate, non-overlapping visible planes."

The real fix needs to rethink what "open" means. Two side-by-side planes (like an open book) need different geometry. Currently:
- Left plane fold edge (frontX) = 0.15W, back edge sweeps from 0.15W to 0.70W
- Right plane fold edge (frontX) = 0.85W, back edge sweeps from 0.85W to 0.30W

At rotation=1, left plane = [0.15W, 0.70W] and right plane = [0.30W, 0.85W] -- they OVERLAP from 0.30W to 0.70W. This is the "merged" state.

For a "fully open, side by side" state, we need left plane on the left half and right plane on the right half. This would be:
- Left plane: [~0, 0.5W] (extending from fold edge LEFTWARD)
- Right plane: [0.5W, ~W] (extending from fold edge RIGHTWARD)

The current geometry only extends FROM the fold edge (0.15W / 0.85W) TOWARD the center. It never extends outward past the fold edges.

**New approach:** Change the geometry so that at rotation=0, the planes extend outward from the fold edges (toward the page edges), showing the "open book" view. At rotation=1, they fold inward toward center (the "merged" view).

**Left plane geometry change:**
```
// Currently: backX = frontX + rotation * maxSwing  (goes toward center)
// New: interpolate between open position (extending left) and merged position (extending right)
const openBackX = frontX - openSwing;  // extends left
const mergedBackX = frontX + mergedSwing;  // extends right (toward center)
const backX = openBackX + rotation * (mergedBackX - openBackX);
```

Actually this is getting complex. Let me simplify.

**Simplest correct fix:**

Keep the existing geometry where rotation controls how "merged" the planes are. Change the scroll handler so:
- `progress=0`: rotation=1 (planes are open/spread -- content visible)
- `progress ~0.5`: rotation=0 (planes collapse to center line -- the "merge" visual)
- `progress=1.0`: rotation=1 (planes re-open)

Then adjust `drawFrame` to remove the `s.rotation = s.targetRotation` override and ensure initial state has rotation=1.

But wait, rotation=1 means OVERLAP, not side-by-side. The left plane goes from 0.15W-0.70W and right from 0.30W-0.85W. They DO show content -- photos and wireframes are visible. The overlap in the center is actually the "merged worlds" visual.

And rotation=0 is thin lines = invisible = "split to nothing."

So the fix is: start at rotation=1 (or some fractional value like 0.5 where planes are partially open) and use the scroll to do an interesting animation. The simplest fix:

1. Change `createInitialState` to set `rotation: 1, targetRotation: 1`
2. Invert the scroll handler curve: at progress=0, rotation=1 (open). At progress=0.5, rotation=0 (collapsed). At progress=1, rotation=1 (re-open).

This way:
- On load: planes are visible at rotation=1
- Scrolling collapses them to thin lines at the midpoint, then re-opens them
- The "merge" effect happens as planes pass through the overlap range

Actually, for a better visual effect, maybe the animation should be:
- Start (no scroll): two partially open planes showing content (rotation ~0.5-0.7)
- Scroll: fold fully together (rotation -> 1) for the "merged" overlapping state
- Continue: unfold back to partial open

Let me go with: initial rotation = 0.5 (partially open, content visible), scroll folds to 1 (fully merged/overlapping) then back to 0.5.

## Final Plan

### File: `src/lib/hero-canvas.ts`
- Change `createInitialState()`: set `rotation: 0.5, targetRotation: 0.5`

### File: `src/components/interactive/HeroBrandVisual.tsx`
- Change scroll handler rotation mapping:
  - progress 0-0.3: rotation eases from 0.5 -> 1.0 (fold together)
  - progress 0.3-0.7: rotation holds at 1.0 (merged)
  - progress 0.7-1.0: rotation eases from 1.0 -> 0.5 (unfold)

This ensures the hero shows visible content on load and the scroll animation is a meaningful fold-together/unfold transition.

## Acceptance Criteria
- On page load (no scroll), the hero shows two partially-open planes with visible photo and wireframe content
- Scrolling triggers a smooth fold/unfold animation
- The animation completes without jumps or glitches
- No build errors
