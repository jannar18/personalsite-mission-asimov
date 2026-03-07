# ASMV-54: Fix grid wrapper pointer-events-none breaking hover nav

## Problem
The grid wrapper on line 156 of Header.tsx has `pointer-events-none`, which prevents `onMouseEnter`/`onMouseLeave` handlers from firing. Desktop hover-to-open nav is completely broken.

## Fix
Change `pointer-events-none` to `pointer-events-auto` on the grid wrapper. The header itself remains `pointer-events-none` to avoid blocking full-page interactions — only the narrow nav strip becomes interactive.

## File
`src/components/global/Header.tsx` line 156

## Acceptance
- Hovering near the cross button area (after hero scroll) opens the nav
- Moving mouse away from the nav area closes it after 400ms delay
