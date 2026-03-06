# ASMV-45: Update hardcoded old palette colors in hero-canvas.ts and HeroBrandVisual.tsx

## Problem

The site switched to a Riso palette (defined in `src/styles/tokens.css`) but two hero files still hardcode the OLD pre-Riso colors:

### `src/lib/hero-canvas.ts` (lines 68-69)
- `BG_COLOR = "#F5F0E8"` -- old Cream. Should be `#FDFCEA` (Riso Paper, `--color-paper`)
- `INK_RGB = "44,40,36"` -- old Ink (#2C2824). Should be `71,31,32` (Riso Oxblood, `--color-oxblood` = #471f20)

### `src/components/interactive/HeroBrandVisual.tsx`
Multiple hardcoded `rgba(44,40,36,...)` values:
- Line 189: `color: "rgba(44,40,36,0.22)"` -- left metadata
- Line 205: `color: "rgba(44,40,36,0.22)"` -- right metadata
- Line 219: `color: "rgba(44,40,36,0.1)"` -- hint text
- Line 233: `color: "rgba(44,40,36,0.16)"` -- bottom metadata bar
- Line 241: `background: "rgba(44,40,36,0.13)"` -- separator dots

All should use `rgba(71,31,32,...)` instead (Riso Oxblood RGB components).

## Fix

### `src/lib/hero-canvas.ts`
1. Change `BG_COLOR` from `"#F5F0E8"` to `"#FDFCEA"`
2. Change `INK_RGB` from `"44,40,36"` to `"71,31,32"`

### `src/components/interactive/HeroBrandVisual.tsx`
1. Replace all 5 instances of `rgba(44,40,36,` with `rgba(71,31,32,`

## Acceptance Criteria
- No hardcoded old palette colors remain in either file
- Colors match the Riso palette in `tokens.css`
- No build errors
