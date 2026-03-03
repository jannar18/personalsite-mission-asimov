# ASMV-13: Design system & component foundation

## Scope

Build reusable layout primitives, customize @tailwindcss/typography for brand identity, refine Header/Footer typography, and add background treatment system for section alternation.

## Deliverables

### 1. Layout Primitives (`src/components/ui/`)

- **ContentContainer** — Centered content wrapper with max-width (72rem or 40rem) and horizontal padding. Accepts `as` prop for semantic HTML elements and `width` prop for full vs text-width containers.
- **PageSection** — Semantic `<section>` wrapper with vertical spacing (md/lg/xl) and background variants (default cream, surface, accent terracotta tint, ink dark). Provides editorial pacing between content blocks.
- **PageHeader** — Consistent page title block with optional subtitle and metadata slot. Title in font-sans at display scale, subtitle in serif, metadata in mono.

### 2. Typography Plugin Customization (`tailwind.config.ts`)

Customize `@tailwindcss/typography` prose styles for brand:
- Body text: serif font (Cormorant Garamond), ink color, relaxed line-height
- Headings: sans font (Futura PT/Jost), medium weight, tight tracking
- Links: terracotta color, no underline, coral on hover
- Code: mono font, surface background, ink color
- Blockquotes: terracotta left border, italic serif, ink-light color
- Lists: warm-gray markers
- Tables: sans headings, border-color dividers
- Figures: sans captions, ink-lighter color, wide tracking

### 3. Header & Footer Refinement

- **Header:** Uppercase wordmark + uppercase nav labels, wider tracking (0.1em), subtle bottom border, larger gap between nav items, terracotta hover on wordmark
- **Footer:** Uppercase labels, wider tracking, data-driven link list (DRY), consistent treatment with header

### 4. Background Treatment System

- Section alternation via PageSection `background` prop:
  - `default` — cream (page background)
  - `surface` — slightly lighter (FAF8F5)
  - `accent` — terracotta 5% tint on cream (F2E8DF)
  - `ink` — dark section with cream text
- CSS `section-transition` class for smooth background changes

### 5. Page Updates

All existing pages refactored to use ContentContainer, PageSection, and PageHeader primitives. Metadata (dates, locations, stacks) consistently styled with mono font, xs size, wider tracking.

## Acceptance Criteria

- `pnpm build` passes
- `pnpm lint` passes with no warnings or errors
- All text colors on cream background pass WCAG AA contrast (ink #2C2824 = 10.3:1, ink-light #5C554E = 5.2:1)
- No new dependencies installed
- Components are RSC by default (no "use client" on layout primitives)
- Existing page functionality preserved (no content changes)
