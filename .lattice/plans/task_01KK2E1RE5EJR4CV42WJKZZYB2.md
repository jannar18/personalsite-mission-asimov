# ASMV-27: Split view merge animation

## Animation sequence
1. Section 2 fills viewport: architecture visual (left half, bg-spruce), text (right half, bg-paper)
2. Scroll → Section 3 fills viewport: text (left half, bg-paper), software visual (right half, bg-spruce)
3. Scroll further → the architecture visual panel (from Section 2) floats down and lands next to the software visual panel — side by side, filling the viewport
4. This merged state transitions into Section 5 (the full-viewport bg-ink media section)

## Key details
- Only the visual half of Section 2 moves; the text halves scroll away naturally
- Section 4 (50/50 text split) is removed — the merge animation replaces it
- Implementation: CSS sticky + scroll-driven positioning for the floating visual
- The component needs to be client-side ("use client") for scroll tracking

## Files
- `src/app/page.tsx` — restructure sections 2-5

## Acceptance
- Architecture visual floats down to meet software visual on scroll
- Both visuals sit side by side before transitioning to Section 5
- No jank, smooth scroll-driven animation
