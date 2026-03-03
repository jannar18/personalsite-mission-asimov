# ASMV-5: Tech Stack Selection & Project Setup

Choose tech stack based on Asimov research. Set up project scaffolding, design system foundations (typography scale, spacing, color tokens). Configure deployment. Deliverable: working project skeleton deployed to staging.

---

## 1. Framework Selection: Next.js 15 (App Router)

**Decision: Next.js 15 with App Router, matching the Asimov Collective stack.**

11/12 Asimov client sites use Next.js. We're targeting Asimov-level quality — using the same stack removes a variable and lets us pattern-match directly against their output. Their solutions to font loading, image optimization, smooth scroll, responsive layout, and page transitions are all Next.js-native patterns we can reference directly.

### Why Next.js

- **Asimov precedent.** The design language we're reverse-engineering was built in Next.js. Same stack = same patterns = less guesswork.
- **`next/font`.** Asimov self-hosts custom foundry fonts with zero layout shift. `next/font` handles this natively — automatic subsetting, preloading, `font-display` optimization. This is a meaningful DX and performance advantage.
- **`next/image`.** Blur placeholders, responsive srcsets, WebP/AVIF, lazy loading — all built-in. Asimov's portfolio pages lean heavily on optimized images.
- **React Server Components.** Content-heavy pages (portfolio, writing, daily entries) render as RSC by default — zero client JS unless a component explicitly opts in with `"use client"`. This gets us close to Astro's "zero JS by default" for content pages while staying in the React ecosystem.
- **React Three Fiber (R3F).** When the interactive layers arrive (Porter Robinson-style WebGL, shader backgrounds), R3F is the natural tool. It's React-native — no framework bridging needed.
- **MDX support.** `@next/mdx` with `next-mdx-remote` for content collections. Well-documented, battle-tested.
- **Vercel deployment.** Next.js + Vercel is the most optimized deployment path. ISR, edge functions, image optimization CDN all work out of the box.

### Key Packages

| Package | Purpose |
|---------|---------|
| `next` (v15.x) | Core framework |
| `react`, `react-dom` | UI library |
| `next-mdx-remote` | MDX rendering for content collections |
| `@next/font` | Font optimization (built into Next.js) |
| `tailwindcss` | Utility CSS (matches Asimov stack) |
| `lenis` | Smooth scroll (matches Asimov pattern) |
| `gray-matter` | Frontmatter parsing for MDX files |
| `next-sitemap` | SEO sitemap generation |

---

## 2. Project Scaffolding

### Directory Structure

```
personalsite-mission-asimov/
├── next.config.mjs            # Next.js configuration
├── tailwind.config.ts         # Tailwind with design tokens
├── tsconfig.json              # TypeScript configuration
├── package.json
│
├── public/
│   ├── fonts/                 # Self-hosted WOFF2 font files
│   ├── textures/              # Build-time generated textures
│   ├── og-image.png           # Default Open Graph image
│   └── favicon.svg
│
├── src/
│   ├── app/
│   │   ├── layout.tsx         # Root layout — fonts, global styles, metadata
│   │   ├── page.tsx           # Home page
│   │   ├── about/
│   │   │   └── page.tsx
│   │   ├── work/
│   │   │   ├── page.tsx       # Work overview (both disciplines)
│   │   │   ├── architecture/
│   │   │   │   ├── page.tsx   # Architecture portfolio listing
│   │   │   │   └── [slug]/
│   │   │   │       └── page.tsx
│   │   │   └── software/
│   │   │       ├── page.tsx   # Software/AI portfolio listing
│   │   │       └── [slug]/
│   │   │           └── page.tsx
│   │   ├── writing/
│   │   │   ├── page.tsx       # Writing listing
│   │   │   └── [slug]/
│   │   │       └── page.tsx
│   │   └── now/
│   │       └── page.tsx       # Now / studio desk page
│   │
│   ├── components/
│   │   ├── global/            # Header, Footer, SmoothScroll
│   │   ├── ui/                # Typography, Image, Spacer, GrainOverlay
│   │   ├── home/              # Hero, NowPreview, WorkHighlights
│   │   ├── now/               # DailyEntry, StudioDesk
│   │   ├── work/              # ProjectCard, ProjectGallery, ProjectNav
│   │   └── interactive/       # Future: WebGL, Three.js, shader components
│   │       └── .gitkeep
│   │
│   ├── content/
│   │   ├── now/               # Daily update MDX entries (YYYY-MM-DD.mdx)
│   │   ├── writing/           # Blog posts / essays (MDX)
│   │   ├── work-architecture/ # Architecture portfolio projects
│   │   └── work-software/     # Software/AI portfolio projects
│   │
│   ├── lib/
│   │   ├── content.ts         # Content loading utilities (MDX + frontmatter)
│   │   ├── fonts.ts           # next/font configuration
│   │   └── metadata.ts        # Shared metadata helpers
│   │
│   └── styles/
│       ├── globals.css        # @font-face fallbacks, CSS custom properties, base resets, grain overlay
│       └── tokens.css         # Design tokens as CSS custom properties
│
├── scripts/
│   ├── generate-textures.mjs  # Build-time texture generation
│   └── optimize-images.mjs    # Image optimization pipeline
│
├── research/                  # Existing (unchanged)
├── notes/                     # Existing (unchanged)
├── .lattice/                  # Existing (unchanged)
├── CLAUDE.md                  # Updated with build commands
└── PRD.md                     # Existing (unchanged)
```

### Package Manager: pnpm

- Faster installs than npm (content-addressable storage)
- Strict dependency resolution (prevents phantom dependencies)
- Disk space efficient
- Widely used in the Next.js ecosystem

---

## 3. Design System Foundations

### 3.1 Typography Scale

```css
:root {
  /* Type scale — minor third (1.2) ratio */
  --text-xs:    0.75rem;    /* 12px — metadata, labels */
  --text-sm:    0.875rem;   /* 14px — captions, small body */
  --text-base:  1rem;       /* 16px — body text */
  --text-lg:    1.125rem;   /* 18px — large body, lead paragraphs */
  --text-xl:    1.25rem;    /* 20px — small headings */
  --text-2xl:   1.5rem;     /* 24px — section headings */
  --text-3xl:   1.875rem;   /* 30px — page headings */
  --text-4xl:   2.25rem;    /* 36px — hero subheadings */
  --text-5xl:   3rem;       /* 48px — hero headings */
  --text-6xl:   3.75rem;    /* 60px — display / project titles */
  --text-7xl:   4.5rem;     /* 72px — maximum display */

  /* Weights — restrained, following Asimov pattern */
  --font-light:    300;
  --font-regular:  400;
  --font-medium:   500;
  --font-semibold: 600;     /* used sparingly */

  /* Line heights */
  --leading-tight:   1.2;   /* headings */
  --leading-snug:    1.35;  /* subheadings */
  --leading-normal:  1.6;   /* body text */
  --leading-relaxed: 1.75;  /* long-form reading */

  /* Letter spacing */
  --tracking-tight:  -0.02em;  /* large display text */
  --tracking-normal:  0;       /* body */
  --tracking-wide:    0.05em;  /* uppercase labels, nav items */
  --tracking-wider:   0.1em;   /* monospace labels */
}
```

### 3.2 Spacing System

8px base unit with generous upper range (the Asimov hallmark: 80-120px between sections).

```css
:root {
  --space-1:   0.25rem;   /*  4px */
  --space-2:   0.5rem;    /*  8px */
  --space-3:   0.75rem;   /* 12px */
  --space-4:   1rem;      /* 16px */
  --space-5:   1.25rem;   /* 20px — Asimov mobile padding */
  --space-6:   1.5rem;    /* 24px */
  --space-8:   2rem;      /* 32px */
  --space-10:  2.5rem;    /* 40px */
  --space-12:  3rem;      /* 48px */
  --space-16:  4rem;      /* 64px */
  --space-20:  5rem;      /* 80px — minimum section spacing */
  --space-24:  6rem;      /* 96px */
  --space-32:  8rem;      /* 128px — generous section spacing */
  --space-40:  10rem;     /* 160px — maximum section spacing */

  /* Semantic spacing tokens */
  --section-gap:       var(--space-24);
  --section-gap-lg:    var(--space-32);
  --content-padding-x: var(--space-5);
  --content-max-width: 72rem;    /* 1152px */
  --text-max-width:    40rem;    /* 640px — text column narrower than images */
}
```

### 3.3 Color Tokens

Formalized from warm earth palette in research/03 §2.

```css
:root {
  /* Primary warmth */
  --color-terracotta:    #C4724E;  /* Primary accent — the "one color" */
  --color-amber:         #D4A76A;  /* Warm secondary */
  --color-cream:         #F5F0E8;  /* Background — warm off-white */
  --color-warm-gray:     #B5AFA6;  /* Neutral mid-tone */

  /* Secondary earth */
  --color-sage:          #8B9E7E;  /* Nature accent */
  --color-dusty-rose:    #C9A5A0;  /* Subtle warmth */
  --color-slate:         #7A8B9A;  /* Cool contrast */

  /* Accent (sparingly) */
  --color-coral:         #C95D45;  /* High-contrast accent */

  /* Neutrals */
  --color-ink:           #2C2824;  /* Primary text — warm near-black */
  --color-ink-light:     #5C554E;  /* Secondary text */
  --color-ink-lighter:   #8A847D;  /* Tertiary text, metadata */
  --color-border:        #E2DCD5;  /* Subtle borders */
  --color-surface:       #FAF8F5;  /* Elevated surface (cards) */
  --color-background:    #F5F0E8;  /* Page background (cream) */

  /* Semantic tokens */
  --color-text-primary:    var(--color-ink);
  --color-text-secondary:  var(--color-ink-light);
  --color-text-tertiary:   var(--color-ink-lighter);
  --color-accent:          var(--color-terracotta);
  --color-accent-hover:    var(--color-coral);
  --color-bg:              var(--color-background);
  --color-bg-surface:      var(--color-surface);
}
```

### 3.4 CSS Approach: Tailwind CSS + CSS Custom Properties

Matches Asimov's tech stack (Tailwind across all projects). Design tokens defined as CSS custom properties in `tokens.css` AND referenced in Tailwind config — accessible to future interactive components without importing Tailwind.

---

## 4. Deployment: Vercel

| Factor | Vercel | Netlify |
|--------|--------|---------|
| Next.js support | First-party (Vercel builds Next.js) | Good but third-party |
| Image optimization | Built-in edge optimization via `next/image` | Requires external |
| Preview deployments | Per-PR with comments | Per-PR |
| Analytics | Privacy-respecting, built-in | Third-party required |
| Asimov precedent | Asimov deploys to Vercel | No precedent |
| ISR/Edge functions | Native support | Limited |

**Decision: Vercel.** Next.js + Vercel is the most optimized deployment path. Hobby tier sufficient for a personal site.

### CI/CD

- GitHub repo connected via Vercel GitHub integration
- Push to `main` → production deploy
- Push to feature branch → preview deploy with unique URL
- Build command: `pnpm build`

---

## 5. Architecture for Future Interactive Layers

**Strategy: RSC by default + `"use client"` islands for interactive components.**

Next.js App Router's React Server Components model naturally separates static content (server-rendered, zero client JS) from interactive elements (client components). This mirrors the Astro islands concept within the React ecosystem.

**Pattern:**
```tsx
// Portfolio page — pure RSC, no client JS
export default async function ProjectPage({ params }) {
  const project = await getProject(params.slug);
  return <ProjectLayout project={project} />;
}

// Interactive component — explicitly client-side
"use client";
export function ThreeScene() {
  // WebGL, R3F, etc. — only ships JS for this component
}
```

**Future-proofing map:**

| Future Feature | How It Plugs In |
|----------------|----------------|
| Lenis smooth scroll (MVP) | `"use client"` SmoothScroll provider in root layout. Falls back to native scroll. |
| GSAP scroll animations (MVP) | `"use client"` components wrapping animated sections. |
| Custom cursor (MVP) | `"use client"` component in root layout. |
| WebGL shader background (Tier 2) | `"use client"` component with R3F. Canvas behind content via `position: fixed; z-index: -1`. |
| Three.js "portal" page (Tier 3) | Full-page `"use client"` component using R3F. Own route (`/bridge` or `/explore`). |
| Interactive studio desk (Tier 3) | `"use client"` R3F component on Now page. Falls back to static version. |

**Key constraint:** RSC pages should never depend on a client component for layout. Client components enhance — they don't structure. The site's content renders fully on the server.

---

## 6. Content System

Next.js doesn't have Astro-style content collections, so we build a lightweight content layer using MDX files + frontmatter + a utility module.

### Content Loading (`src/lib/content.ts`)

- Uses `gray-matter` to parse frontmatter from MDX files in `src/content/`
- Uses `next-mdx-remote` to render MDX server-side in RSC
- Exports typed helper functions: `getAllPosts()`, `getPost(slug)`, `getAllNowEntries()`, etc.
- Frontmatter schemas validated at build time (optional Zod validation, matching the schemas from Section 6 of the previous plan)

### Content Structure

```
src/content/
├── now/                     # YYYY-MM-DD.mdx — daily entries
├── writing/                 # slug.mdx — essays/posts
├── work-architecture/       # slug.mdx — architecture projects
└── work-software/           # slug.mdx — software projects
```

Each MDX file has typed frontmatter matching the schemas defined in the previous plan (date, title, description, tags, order, heroImage, featured, etc.).

---

## 7. Dependency on ASMV-4 (Brand Identity)

ASMV-4 runs in parallel. This plan doesn't block on it:

| This Plan Decides | ASMV-4 Decides | Integration Point |
|-------------------|----------------|-------------------|
| Typography *scale* and *spacing* | Specific *typefaces* | `next/font` config in `src/lib/fonts.ts` |
| Color *architecture* (CSS vars) | Final accent color value | Single-line CSS variable change |
| Site *structure* (pages, nav) | Brand name, positioning, domain | Text content, favicon, OG image, site title in `layout.tsx` |
| Component *architecture* | Logo/wordmark | `Header` component slot |

Scaffolding proceeds with placeholder values (e.g., "Julianna" as site title, system fonts, terracotta `#C4724E` as accent) that are trivially swappable.

---

## 8. Implementation Sequence

1. Initialize project: `pnpm create next-app@latest` with App Router, TypeScript, Tailwind, ESLint
2. Configure Next.js: `next.config.mjs` with MDX support, image domains, metadata
3. Set up Tailwind: `tailwind.config.ts` with full design token system (colors, typography, spacing)
4. Create design tokens: `src/styles/tokens.css` and `src/styles/globals.css` with CSS custom properties, font-face (system font placeholders until brand fonts chosen), grain overlay
5. Configure fonts: `src/lib/fonts.ts` using `next/font/local` with placeholder system fonts
6. Build root layout: `src/app/layout.tsx` with HTML shell, fonts, global styles, metadata
7. Build page components: Header (hide-on-scroll), Footer
8. Build content utilities: `src/lib/content.ts` with MDX loading helpers
9. Scaffold all pages: Empty but routed pages for home, about, work (architecture + software), writing, now
10. Create placeholder content: One MDX file per collection to verify the pipeline
11. Deploy to Vercel: Connect GitHub repo, verify preview deployments, confirm build
12. Update CLAUDE.md: Add build commands, dev server, framework details

---

## 9. Acceptance Criteria

- [ ] Project scaffolding exists with the directory structure above
- [ ] `pnpm dev` starts a local dev server without errors
- [ ] `pnpm build` succeeds and produces a production build
- [ ] All pages route correctly: /, /about, /work, /work/architecture, /work/software, /writing, /now
- [ ] Design tokens defined in both CSS custom properties and Tailwind config
- [ ] Content loading utilities work for all four content types (now, architecture, software, writing)
- [ ] At least one placeholder MDX entry per collection renders correctly
- [ ] Site deployed to Vercel with a working preview URL
- [ ] Typography renders with correct scale, weights, and spacing (placeholder fonts OK)
- [ ] Grain overlay technique from research/03 implemented as baseline texture layer
- [ ] CLAUDE.md updated with build commands, dev server, framework docs
- [ ] Lenis smooth scroll integrated (or stubbed with clear integration path)
- [ ] `next/font` configured and ready for brand font swap
- [ ] `next/image` configured for portfolio image optimization
