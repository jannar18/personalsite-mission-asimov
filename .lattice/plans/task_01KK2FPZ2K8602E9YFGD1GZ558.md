# ASMV-41: Update studio desk: visual background + refine artifact hover

## Scope

Two changes to the studio desk / ArtifactBar experience:

1. **Visual background for the studio desk section** — give it atmosphere and spatial presence
2. **Remove hover overlay/info bar from artifact hover** — keep the motion, lose the content popover

## Analysis

### Current State

**ArtifactBar (`src/components/interactive/ArtifactBar.tsx`):**
- Renders a horizontal scroll strip of artifacts at varied heights
- On hover: `group-hover:scale-[1.02] group-hover:shadow-lg` (subtle scale + shadow) — KEEP
- On click: opens a centered popover with scrim + full-size image + info (date, mood, project, description, link) — REMOVE
- The popover is managed by `activeIndex` state and the `closePopover` callback

**Now page (`src/app/now/page.tsx`):**
- Plain `bg-background` inherited from body — no visual desk surface treatment
- ArtifactBar is used on the homepage, not on the Now page directly (Now page renders entries as articles)

**Homepage (`src/app/page.tsx`):**
- ArtifactBar is in Section 7/8 at the bottom, inside a `<section className="bg-background">`
- No specific background treatment on the studio desk area

### Where the ArtifactBar lives

The ArtifactBar component is used on the **homepage** (page.tsx), not on the Now page. The "studio desk" section is the bottom of the homepage. The Now page is a separate page with article entries. The task says "Now / Studio Desk page" which maps to both:
- The ArtifactBar on the homepage (the visual desk surface)
- Potentially the Now page itself

The background treatment should apply to the studio desk area on the homepage. The hover refinement is in ArtifactBar.tsx.

## Plan

### 1. Remove popover/info bar from ArtifactBar

**File:** `src/components/interactive/ArtifactBar.tsx`

- Remove the `activeIndex` state, `closePopover` callback, and the `useEffect` for Escape key handling
- Remove the `active` derived variable
- Remove the entire popover JSX block (scrim + popover div, lines 91-150)
- Change the `<button>` wrapping each artifact to a plain `<div>` (no click handler needed)
- Keep `group-hover:scale-[1.02]` and `group-hover:shadow-lg` on the Image — this is the motion we preserve
- Keep the `useState` import only if still needed (it won't be)

### 2. Add visual background to studio desk section

**File:** `src/app/page.tsx` (homepage, where ArtifactBar lives)

Add a subtle desk-surface background treatment to the studio desk area. The approach:

- Add a warm, subtle radial gradient that fades from `--color-surface` (slightly darker cream) at center to `--color-background` (paper) at edges — this creates a gentle "pool of light on a desk" feel
- Layer the existing `.grain-texture` class on top for paper materiality
- The gradient is CSS-only, no images needed, fully restrained

**Implementation:**
- Wrap the ArtifactBar area in a `<div>` with `relative` positioning
- Add a `::before` pseudo-element (via a new CSS class `.studio-desk-surface`) that renders:
  - A radial gradient: `radial-gradient(ellipse at 50% 80%, var(--color-surface) 0%, var(--color-background) 70%)`
  - Subtle bottom-weighted to evoke a desk surface lit from above
- Apply `.grain-texture` to the wrapper for the paper texture overlay
- Keep it extremely subtle — this should feel like atmosphere, not decoration

**File:** `src/styles/globals.css`

Add a `.studio-desk-surface` class:
```css
.studio-desk-surface {
  position: relative;
}
.studio-desk-surface::after {
  content: "";
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse at 50% 80%, var(--color-surface) 0%, transparent 70%);
  pointer-events: none;
}
```

Note: `.grain-texture::before` already handles the grain; we use `::after` for the gradient to avoid conflict.

### 3. Optionally apply similar treatment to Now page

**File:** `src/app/now/page.tsx`

Add a subtle background wrapper to the Now page content area — same `.studio-desk-surface` class for consistency. This gives the Now page the same desk-surface atmosphere.

## Acceptance Criteria

- [ ] Hovering on artifacts still produces the scale + shadow animation
- [ ] Clicking on artifacts no longer opens a popover/overlay
- [ ] The studio desk area on the homepage has a subtle warm background treatment (gradient + grain)
- [ ] `pnpm build` passes with no errors
- [ ] No visual regressions to other sections
