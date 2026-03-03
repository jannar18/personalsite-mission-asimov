## Code Review
- **Date:** 2026-03-03T15:38:00Z
- **Model:** claude-opus-4-6
- **Branch:** feature/asmv-4-brand-identity
- **Commit:** 3d89322
---

### Summary

This branch delivers the ASMV-4 brand identity task across two commits: (1) naming exploration with 88+ candidates across two rounds, and (2) applying the final decision ("Parallax") to all site files — typography, metadata, fonts, domain, plus a comprehensive 585-line brand guide. The naming process is well-documented with clear human decision gates via Lattice.

The code changes are clean and focused: swap three Google Fonts, invert the serif/sans hierarchy (body → serif, headings → sans), rename from "Parallax Practice" to "Parallax", and update the domain to `parallax.studio`. The brand guide (`brand-guide.md`) is thorough — color palette with WCAG contrast ratios, type scale, voice guidelines, design tokens, and an upgrade path to Adobe Fonts.

**Overall assessment:** Solid work. The naming artifacts are thorough and the code changes are minimal and well-scoped. A few issues worth addressing before merge.

---

### Architectural Review

**The serif-primary, sans-heading inversion is well-executed.** The brand decision to flip the typical Asimov pattern (sans-dominant → serif-dominant) is implemented cleanly at three layers:
1. `globals.css` base styles set body to serif, headings to sans
2. `layout.tsx` body class uses `font-serif`
3. Header and Footer explicitly use `font-sans` for navigation/structural UI

This is the right approach — CSS base layer for defaults, Tailwind utility classes for overrides. Components that need the sans voice (nav, footer) explicitly opt in.

**The font stand-in strategy is pragmatic.** Using Jost → Futura PT and DM Mono → Degular Mono as Google Fonts stand-ins with a documented upgrade path via `next/font/local` is a good interim solution. The CSS variable indirection (`--font-sans`, `--font-serif`, `--font-mono`) means the swap will be zero-impact on components.

**No issues with the overall architecture.** The changes are additive (brand guide, naming notes) and surgical (font swap, name rename). No structural changes to routing, content pipeline, or component hierarchy.

---

### Tactical Review

#### Font Configuration

**`src/lib/fonts.ts`** — The font swap is clean. Cormorant Garamond includes weight 700, which the brand guide says "Bold (700) is not used." This isn't harmful (unused weights are tree-shaken by `next/font`), but it's a minor inconsistency between the code and the brand guide's stated weight policy.

**`tailwind.config.ts:37-39`** — The font family fallback stacks include the target fonts ("Futura PT", "Cormorant Garamond", "Degular Mono") as named fallbacks. This is fine as documentation-in-code, but these fonts won't actually resolve until the Adobe Fonts upgrade happens. Not a bug, just a note: they serve as comments more than functional fallbacks since the CSS variable (`var(--font-sans)`) will always resolve first via `next/font`.

#### Body Font Redundancy

**`layout.tsx:21` + `globals.css:27`** — The body font is declared in two places:
- `globals.css`: `font-family: var(--font-serif), Georgia, serif;`
- `layout.tsx`: `className="... font-serif ..."`

Both set the body to serif. The Tailwind `font-serif` class generates `font-family: var(--font-serif), Cormorant Garamond, Georgia, serif` (from the tailwind config), which will override the CSS base layer declaration. They agree on the outcome, but it's two sources of truth for the same thing. If someone later changes one without the other, they'd diverge silently.

#### Stale Comment

**`src/lib/metadata.ts:5`** — The comment reads "will be updated when brand identity lands" but brand identity has now landed in this very branch. Minor, but worth cleaning up since this is the brand identity PR.

#### Name Consistency

The rename from "Parallax Practice" to "Parallax" is complete across all `src/` files — verified via grep, no remaining instances. The brand guide's "Usage in Context" table (brand-guide.md line ~401-408) references both "Parallax" and "parallax practice" (lowercase, in the clear space diagram on line ~679). The diagram shows "parallax practice" as the wordmark, but the code uses just "Parallax" everywhere. This might be intentional (the diagram showing a different variant), but it's worth confirming the canonical wordmark is "Parallax" alone per the rest of the brand guide.

#### WCAG Accessibility

The brand guide's contrast ratio table is thorough and honest — it correctly identifies that Terracotta on Cream (3.1:1) fails WCAG AA for normal text. The usage rules properly restrict Terracotta-as-text to large sizes only. The code currently uses Terracotta for links via `--color-accent` (globals.css:49), which is fine per rule #5 (interactive elements typically large enough + affordance from underlines/hover). However, body-text links in long-form MDX content could be 16px regular weight — which would technically fail AA. Worth noting for the content build phase.

#### Security

No security concerns. No user input handling, no API calls, no dynamic content in this changeset. The `process.env.NEXT_PUBLIC_SITE_URL` fallback in `metadata.ts:8` is fine — it's a public env var used only for metadata.

#### Performance

No performance concerns. The font change is neutral — same `next/font/google` mechanism, same number of fonts, similar byte sizes. Weight additions (300, 700) will marginally increase font downloads but `next/font` handles subsetting.

---

### Blockers — must fix before merge

(None identified. The changes are clean, type-check passes, lint passes.)

---

### Important — should fix, not blocking

1. **Stale comment in metadata.ts:5** — `"will be updated when brand identity lands"` should be updated or removed since brand identity has landed in this branch. `src/lib/metadata.ts:5`

2. **Body font declared in two places** — `globals.css:27` and `layout.tsx:21` both set the body to serif independently. Consider removing the `font-serif` class from the `<body>` in `layout.tsx` (since `globals.css` already handles it) or removing the `globals.css` body `font-family` rule (since the Tailwind class handles it). One source of truth is better than two that happen to agree. `src/app/layout.tsx:21` + `src/styles/globals.css:27`

3. **Brand guide wordmark inconsistency** — The clear-space diagram in `brand-guide.md` (around line 679) shows "parallax practice" as the wordmark, but the code and the rest of the brand guide use just "Parallax". Confirm which is canonical and update the diagram. `brand-guide.md:679`

---

### Potential — nice-to-have or uncertain

1. **Cormorant Garamond weight 700 loaded but unused** — The brand guide states "Bold (700) is not used" but `fonts.ts:28` includes weight 700. Consider removing it to align code with brand guide and save a small amount of font download. `src/lib/fonts.ts:28`

2. **Header.tsx:12 stale comment** — "Will receive logo/wordmark slot from ASMV-4 brand identity" — ASMV-4 has now delivered the wordmark decision (typographic, no separate logo component needed). The comment could be updated to reflect the current state. `src/components/global/Header.tsx:12`

3. **Link accessibility in future MDX content** — Terracotta (#C4724E) on Cream at 3.1:1 contrast fails WCAG AA for normal text. The brand guide's usage rules are correct, but when long-form MDX content is built (ASMV-5+), ensure body-text links either get underlines for additional affordance or use Ink/Ink Light colors instead of Terracotta. Not relevant yet but worth tracking. `src/styles/globals.css:49`

4. **Footer.tsx uses `new Date().getFullYear()` at render time** — This is a server component, so the year is computed at build time (or request time depending on rendering strategy). Not a bug, but worth knowing: in a static export, the year would be the build year. This is standard Next.js behavior and fine for now. `src/components/global/Footer.tsx:10`
