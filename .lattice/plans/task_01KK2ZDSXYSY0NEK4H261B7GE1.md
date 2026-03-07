# ASMV-58: Parallax wordmark click should navigate to homepage

## Problem
The wordmark `<Link href="/">` is already correct, but invisible nav links (ASMV-55) overlap it and intercept clicks. The wordmark is `position: absolute` so it stacks above the grid visually, but the nav's `pointer-events-auto` still captures events.

## Fix
No additional code change needed — ASMV-55's fix (toggling pointer-events on nav) resolves this. The wordmark already stacks above the grid (absolute positioning) and has `pointer-events-auto`.

## Acceptance
- Clicking "Parallax" wordmark navigates to `/` at all scroll positions where it's visible
