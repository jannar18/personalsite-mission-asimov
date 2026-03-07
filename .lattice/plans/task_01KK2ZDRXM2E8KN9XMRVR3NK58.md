# ASMV-55: Fix invisible nav links still clickable when closed

## Problem
Left and right nav containers have `pointer-events-auto` unconditionally. When nav is closed (opacity-0), invisible links still intercept clicks and block elements behind them (including the wordmark).

## Fix
Toggle pointer-events based on `navOpen` state:
- `navOpen` → `pointer-events-auto` (clickable)
- `!navOpen` → `pointer-events-none` (transparent to events)

## Files
`src/components/global/Header.tsx` lines 163 and 213 (left and right nav containers)

## Acceptance
- When nav is closed, clicking through the invisible nav area reaches elements behind it
- When nav is open, links are clickable as expected
