## Critical Code Review

- **Date:** 2026-03-03T15:38:00Z
- **Model:** Claude Opus 4.6
- **Branch:** feature/asmv-4-brand-identity
- **Commit:** 3d89322

---

### What Could Go Wrong

1. **Double font-family declaration on body.** `globals.css:27` sets `font-family: var(--font-serif), Georgia, serif;` on `body`. `layout.tsx:21` sets `className="... font-serif ..."` on `<body>`. Both resolve to the same font, so this isn't a *bug*, but it's a specificity trap waiting to happen. If someone later adds a utility class to override the font, they'll need to defeat both the CSS `@layer base` rule and the Tailwind utility class. The Tailwind class wins over the `@layer base` rule (utilities > base), so they happen to agree for now. But if someone removes the Tailwind class thinking the CSS handles it, or removes the CSS rule thinking the Tailwind class handles it, nothing breaks *today*. The problem is that two independent declarations create a false sense of redundancy — the next developer won't know which is authoritative.

2. **Stale comments referencing ASMV-4 as future work.** `src/lib/metadata.ts:5` says "will be updated when brand identity lands." `src/components/global/Header.tsx:12` says "Will receive logo/wordmark slot from ASMV-4 brand identity." The brand identity *has* landed — this is the commit that does it. These comments now point backward to a task that was just completed, misleading future developers into thinking there's still work to do.

3. **Cormorant Garamond at small sizes.** The font is a display-optimized Garamond revival with high contrast (thin hairlines, thick strokes). At `--text-xs` (12px) and `--text-sm` (14px), the hairlines may become illegible on low-DPI screens. The brand guide acknowledges this for the wordmark ("below this, light-weight serifs lose definition") but doesn't address the body font at small sizes. The site currently sets body text default to `font-serif` via both globals.css and layout.tsx, so *all* body text — including metadata, labels, and captions — renders in Cormorant Garamond unless explicitly overridden.

4. **Naming inconsistency: "Parallax" vs "Parallax Practice."** The Lattice event log (`ev_01KJTJ5W640YB3HS1ZHYQ42BAB`) records Julianna's decision as "Final name: Parallax Practice." The brand guide's wordmark clear-space diagram shows "parallax practice." Yet every code-level reference was changed to just "Parallax" — the metadata, header, footer, homepage. The brand guide itself introduces the name as "Parallax" with "The single word stands on its own — no qualifier needed." This is an intentional evolution captured in the brand guide. But the Lattice comment and the brand guide's own clear-space diagram contradict the code. If "Parallax" (not "Parallax Practice") is the final answer, the clear-space diagram and the Lattice comment are misleading artifacts.

5. **No dark mode tokens.** The color system defines only a light theme. There are no `prefers-color-scheme: dark` media queries, no `.dark` class support, no dark mode token variants. This is probably fine for V1, but the token architecture *as documented* presents itself as the complete design system. If dark mode is intentionally deferred, the brand guide should say so explicitly rather than just omitting it.

### Hidden Assumptions

1. **`next/font/google` subsets are sufficient.** All three fonts are loaded with `subsets: ["latin"]`. If any content uses extended Latin characters (accents in French architectural terms like "parti," "sgraffito," diacritics in names), those glyphs will either not render or fall through to the system fallback. Cormorant Garamond and Jost both support `latin-ext` — it's not included.

2. **DM Mono supports weight 300.** The `fontMono` declaration requests `weight: ["300", "400", "500"]`. DM Mono (Google Fonts) is only available in weight 400. Google Fonts *may* silently serve 400 when 300 or 500 is requested, or it may return an error font. This needs to be verified. If DM Mono doesn't actually serve 300 and 500, the light and medium weight specifications in the brand guide are fiction until the Degular Mono upgrade happens.

3. **`font-display: swap` for all three fonts.** This means users will see a flash of unstyled text (FOUT) with system fonts before the Google Fonts load. With *three* fonts all swapping, you could see three sequential layout shifts as each font loads. On slow connections, the site will briefly render in Georgia (serif fallback), then snap to Cormorant Garamond; system-ui (sans fallback), then snap to Jost; and monospace, then snap to DM Mono. The cumulative layout shift (CLS) could be significant.

4. **Tailwind `fontFamily` fallback stack includes fonts that aren't loaded.** The Tailwind config lists `"Futura PT"` and `"Degular Mono"` in the fallback stacks, but these fonts are not loaded anywhere — they're the *future* Adobe Fonts typefaces. If `var(--font-sans)` somehow doesn't resolve (e.g., during SSR before CSS loads), the browser will attempt to load "Futura PT" from the user's local system fonts, then "Jost," then fall back to system-ui. This isn't catastrophic, but listing an unloaded font in the fallback chain is misleading. A developer seeing "Futura PT" in the config might think it's already working.

5. **`new Date().getFullYear()` in Footer is server-rendered.** `Footer.tsx` is a Server Component (no `"use client"` directive). The `currentYear` is computed at build time during `next build` (static generation). If the site is built on December 31, 2026 and served on January 1, 2027, the footer will show "2026" until the next deploy. This is a common pattern and not strictly a bug, but it's worth noting because the site uses static generation.

### Missing Pieces

1. **No `tokens.css` color updates were made.** The brand guide documents a comprehensive color system with CSS custom properties. The `tokens.css` file already has these values — but they were committed in the *previous* task (ASMV-5 scaffold). This means the color tokens were already correct before ASMV-4 started. That's fine architecturally, but it means ASMV-4's diff doesn't include a verification step that the tokens *match* the brand guide. If someone later changes a color in tokens.css, the brand guide (a markdown file) won't know.

2. **No favicon.** The brand guide specifies a "P" lettermark favicon direction. No favicon file exists in `public/`, and no favicon metadata is configured. This is likely a future task, but the brand guide presents it as a decided item.

3. **No OG image.** The metadata has `openGraph` configuration with title and description, but no `og:image`. Social media shares will render without a preview image. Again, likely future work, but worth calling out because the metadata file looks "complete."

4. **No responsive font scaling.** The type scale is a fixed minor-third ratio. There are no `clamp()` or viewport-relative units. At mobile widths (320px), `--text-7xl` (4.5rem = 72px) will overflow or force horizontal scroll. The homepage `h1` uses `text-5xl md:text-6xl lg:text-7xl` responsive classes, which is good — but the CSS-variable-based defaults for `h1` in globals.css (`font-size: var(--text-5xl)` = 48px) have no responsive override. Any `<h1>` that doesn't explicitly use Tailwind responsive classes will be 48px at all breakpoints.

5. **No `@font-face` `unicode-range` optimization.** When the Adobe Fonts upgrade happens (switching to `next/font/local`), the `.woff2` files should ideally declare `unicode-range` to prevent unnecessary font downloads. The upgrade path in the brand guide mentions placing files and swapping imports, but doesn't mention this optimization.

### Trust Issues

1. **The WCAG contrast ratios in the brand guide were manually computed and are not verified in code.** There are no automated contrast-checking utilities, no tests, no runtime checks. The brand guide claims Terracotta on Cream is 3.1:1 — I can't verify this without running a computation, but if this number is wrong, the entire "Usage Rules" section that relies on it is wrong too. One incorrect ratio cascades into incorrect accessibility guidance.

2. **The `parallax.studio` domain is stated as "Decided" but there's no evidence it's actually registered.** The plan says "Register immediately once decided — domains are first-come-first-served." The Lattice events show naming decisions but no domain registration confirmation. If someone else registers `parallax.studio` before Julianna does, the metadata hardcoded to `https://parallax.studio` will point to a domain the project doesn't own.

3. **No validation that the Google Font names are correct.** `Cormorant_Garamond`, `Jost`, and `DM_Mono` are used as `next/font/google` imports. If any of these names don't exactly match Google Fonts' API names, the build will fail. This did pass type-check and lint, so it's likely fine — but the names weren't verified against the actual Google Fonts API at review time.

---

### Blockers — will cause problems

1. **DM Mono weight 300 and 500 may not exist.** `src/lib/fonts.ts:35` requests `weight: ["300", "400", "500"]` for DM Mono. Google Fonts lists DM Mono as available only at weight 300, 400, and 500 — actually, checking the Google Fonts catalog, DM Mono IS available at 300, 400, and 500. ~~This may be a non-issue.~~ Verified: DM Mono supports Light (300), Regular (400), and Medium (500). **Not a blocker.** Struck through.

*(No confirmed blockers after verification.)*

### Important — likely to cause problems

1. **Stale comments in `src/lib/metadata.ts:5` and `src/components/global/Header.tsx:12`** reference ASMV-4 as future work. The brand identity has landed. These comments will mislead future developers (or agents) into thinking the brand identity hasn't been applied yet. Fix: update or remove the comments.

2. **Redundant font-family declaration.** Body gets `font-serif` from both `globals.css:27` (`@layer base`) and `layout.tsx:21` (Tailwind utility class). The Tailwind utility wins due to specificity. If the globals.css rule is later removed as "redundant," nothing changes. If the Tailwind class is later removed, globals.css takes over correctly. But this dual-source of truth invites confusion. Fix: pick one. The Tailwind class on `<body>` is sufficient; the `@layer base` rule for body `font-family` can be removed (the heading font-family rule in globals.css should stay since it provides the sans-serif default for headings).

3. **Brand guide clear-space diagram says "parallax practice" but the code says "Parallax."** The brand guide at the clear-space section (Section 5) shows `parallax practice` in the diagram, while every code reference uses just `Parallax`. Lattice event `ev_01KJTJ5W640YB3HS1ZHYQ42BAB` says "Final name: Parallax Practice" but the brand guide Section 1 says "The single word stands on its own — no qualifier needed." These artifacts need reconciliation. Which is it?

4. **Cormorant Garamond at 12px (`--text-xs`) will have legibility issues on low-DPI screens.** The brand guide's accessibility guidance covers *color* contrast but not *typographic* legibility at small sizes. Footer metadata, timestamps, and labels will render in Cormorant Garamond at small sizes unless explicitly overridden with `font-sans` or `font-mono`. Consider: either add `font-mono` or `font-sans` to small metadata/label patterns as a convention, or document that `font-serif` should not be used below `--text-sm` (14px).

5. **`latin-ext` subset missing from all three font declarations.** `src/lib/fonts.ts` loads only `subsets: ["latin"]`. Content referencing French, Italian, or other European architectural terms with diacritics (facade, resume, naive, etc.) will render with fallback glyphs. Consider adding `"latin-ext"` to all three font declarations.

### Suspicious — worth investigating

1. **CLS risk from three simultaneously swapping fonts.** All three fonts use `display: "swap"`. On first load with empty cache, the browser renders system fonts, then swaps three web fonts in sequence. Each swap causes a layout reflow. Measure CLS in Lighthouse before launch. Consider `display: "optional"` for the mono font (least critical) to reduce swap count.

2. **`tailwind.config.ts:88` uses `require("@tailwindcss/typography")`.** This is a CommonJS `require` in a TypeScript file. It works because `tailwind.config.ts` is loaded by Tailwind's config resolver which handles it. But if the project moves to ESM-only (`"type": "module"` in package.json), this will break. Low risk for now, but worth noting.

3. **Footer is a Server Component computing `new Date().getFullYear()`.** If the site is statically generated (which the CLAUDE.md suggests — `pnpm build` produces static output), the year is frozen at build time. This will show the wrong year after December 31 of any given year until the next deploy. Consider making Footer a client component or using ISR to ensure the year updates. Alternatively, accept the risk since Vercel deploys are frequent.

4. **`brand-guide.md` lives at the repo root.** This is a 585-line markdown file that is the brand's source of truth, but it lives alongside `CLAUDE.md`, `PRD.md`, and `package.json`. If the repository grows, having design artifacts at the root can become messy. Consider whether this should live in a `docs/` or `design/` directory. Low priority.

5. **`tokens.css` is imported inside `globals.css` via `@import "./tokens.css"`.** This `@import` happens after `@tailwind base; @tailwind components; @tailwind utilities;`. CSS `@import` rules should technically come before other rules per the CSS spec, though PostCSS/Tailwind's processing may handle this fine. If CSS processing order ever changes (e.g., moving to native CSS layers or a different PostCSS pipeline), this import position could cause the tokens to be unavailable when `@layer base` rules reference them. Worth verifying the build output includes tokens before the rules that reference them.

6. **No `aria-label` or skip-nav on the header.** The Header has a `<nav>` element but no `aria-label` to distinguish it from the Footer's `<nav>`. Screen readers will announce both as "navigation" without clarification. The site also has no skip-to-content link. These are WCAG 2.1 Level A recommendations, not blockers, but the project targets Asimov-level quality.
