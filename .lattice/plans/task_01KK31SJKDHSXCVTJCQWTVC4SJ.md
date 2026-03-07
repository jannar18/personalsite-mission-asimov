# ASMV-54: Replace hardcoded rgba(71,31,32) values in HeroBrandVisual with CSS tokens

## Problem

`src/components/interactive/HeroBrandVisual.tsx` has 5 hardcoded `rgba(71,31,32,...)` values for the Riso oxblood color at various alpha levels (0.22, 0.22, 0.1, 0.16, 0.13). These should reference the design token `--color-ink` (#471f20 = rgb(71,31,32)) defined in `src/styles/tokens.css`.

Additionally, `src/lib/hero-canvas.ts` has `const INK_RGB = "71,31,32"` which is already used as a centralized constant for the Canvas 2D rendering context. This is fine for canvas code (Canvas API doesn't support CSS custom properties), but the constant duplicates the token value.

## Approach

### For HeroBrandVisual.tsx (JSX inline styles)

Add a new CSS custom property `--color-ink-rgb` to `tokens.css` that provides the raw RGB components (71, 31, 32) for use in `rgba()` expressions. Then replace all 5 hardcoded values in HeroBrandVisual.tsx with `rgba(var(--color-ink-rgb), <alpha>)`.

Alternatively, use CSS `color-mix()` but browser support is newer and `rgba(var(--rgb), alpha)` is the established pattern in modern CSS.

### For hero-canvas.ts

Update `INK_RGB` to document its relationship to `--color-ink-rgb` via a comment, but keep it as a JS constant since Canvas 2D API cannot read CSS custom properties without DOM access (which this pure-logic module intentionally avoids).

### Changes

1. **`src/styles/tokens.css`**: Add `--color-ink-rgb: 71, 31, 32;` in the Color: Neutrals section
2. **`src/components/interactive/HeroBrandVisual.tsx`**: Replace all 5 `rgba(71,31,32,X)` with `rgba(var(--color-ink-rgb), X)`

### Acceptance Criteria

- No hardcoded `rgba(71,31,32,...)` in HeroBrandVisual.tsx
- New `--color-ink-rgb` token exists in tokens.css
- Visual output is identical (same colors, same alpha values)
- `pnpm build` passes
- `pnpm lint` passes
