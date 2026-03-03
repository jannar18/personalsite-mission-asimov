# ASMV-4: Brand Identity & Naming

Phase 2: Develop studio/practice name capturing the architecture + software + AI intersection. Domain availability check. Define visual identity basics (typefaces, color palette, logo/wordmark). Write one-line positioning statement. Register domain. Deliverable: brand guide.

---

## Overview

This task produces a lightweight brand guide: studio/practice name, typefaces, formalized color palette, logo/wordmark direction, one-line positioning statement, and registered domain. The deliverable is a markdown document (`brand-guide.md`) that becomes the design authority for all subsequent build phases.

This task is fundamentally **human-collaborative**. The agent can research, propose, prototype, and formalize, but Julianna makes the naming and aesthetic decisions. The plan is structured around generating options for human review, not autonomous completion.

---

## 1. Naming Approach

### 1.1 Naming Families to Explore

The name must capture the intersection of architecture, software, and AI without being literal about any one domain. It should work as a domain, look good in a wordmark, and feel appropriate next to both an architectural drawing and a code repository.

**Family A: Spatial/Architectural Metaphor**
Names drawn from architectural vocabulary that also resonate in software/systems contexts.
- Threshold, Datum, Section, Parti, Liminal, Atelier, Atrium, Arcade, Foyer
- Why: Architecture vocabulary carries precision and spatial intelligence. Words like "threshold" and "datum" have natural dual meaning.

**Family B: Process/Making Metaphor**
Names that emphasize the act of making, building, or synthesizing across disciplines.
- Studio [Name], [Name] Works, Forge, Assemblage, Draft, Proof, Trace
- Why: Process-oriented names avoid committing to a single discipline. "Draft" means both architectural drawing and rough version. "Trace" means tracing paper and execution tracing.

**Family C: Natural/Landscape**
Drawn from the landscape consciousness visible in Julianna's work (topography, ground, water systems, vegetation).
- Meridian, Contour, Canopy, Watershed, Riparian, Understory
- Why: The portfolio shows deep engagement with ground, landscape, and natural systems. These names carry poetic weight without being discipline-specific.

**Family D: Conceptual/Abstract**
Invented or unusual words that carry the right feeling without literal meaning.
- Composed words, portmanteaus, or borrowed words from other languages
- Why: Avoids the limitation of existing English words. Can be crafted for phonetics, visual shape, and domain availability simultaneously.

**Family E: First-Person / Eponymous**
Using Julianna's own name, possibly with a qualifier.
- Julianna [Surname], J[Initial] Studio, [Surname] Practice
- Why: The site is a personal identity artifact. An eponymous name is honest and carries the "unified practice" message inherently.

### 1.2 Naming Process

1. Agent generates 30-50 candidate names across all five families, with brief rationale for each.
2. Julianna shortlists 5-10 based on resonance, feel, and personal meaning.
3. Domain availability check on the shortlist.
4. Narrow to 2-3 finalists considering domain availability and visual/typographic quality.
5. Julianna picks the name. This is a `needs_human` gate.

### 1.3 Naming Criteria

- Works as a `.com` or compelling TLD (`.studio`, `.works`, `.design`, `.io`)
- Looks good set in the chosen typeface (test rendering is part of the process)
- Does not collide with established brands in architecture, tech, or design
- Feels appropriate at the quality level of an Asimov Collective site
- Can scale: works as a personal site today, could represent a practice later
- Pronounceable, memorable, not easily misspelled

---

## 2. Color Palette Formalization

### 2.1 Source Material

The color palette is already extracted in `research/03-graphics-pipeline-final.md` Section 2 ("Visual Language"). The values are marked "approximate" and need to be formalized with exact hex, HSL, and RGB values, plus usage guidelines.

### 2.2 Proposed Palette Structure

**Primary Warmth (the workhorses):**

| Name | Approximate Hex | Role |
|------|----------------|------|
| Terracotta | #C4724E | Primary accent (the "one color" per Asimov philosophy) |
| Amber/Warm Ochre | #D4A76A | Secondary warmth, hover states, highlights |
| Cream/Warm White | #F5F0E8 | Page background (never pure white) |
| Warm Gray | #B5AFA6 | Body text alternative, borders, metadata |

**Secondary Earth:**

| Name | Approximate Hex | Role |
|------|----------------|------|
| Sage Green | #8B9E7E | Accent for nature/landscape content |
| Dusty Rose | #C9A5A0 | Soft accent, used sparingly |
| Slate Blue-Gray | #7A8B9A | Technical content accent, code blocks |

**Neutrals:**

| Name | Hex | Role |
|------|-----|------|
| Near Black | ~#2C2824 (warm) | Primary text, headings |
| Dark Warm Gray | ~#5C554E | Secondary text |
| Light Warm Gray | ~#E2DCD5 | Borders, dividers, subtle backgrounds |

### 2.3 Formalization Process

1. Start from the approximate hex values in research/03.
2. Refine in HSL space for perceptual consistency.
3. Test contrast ratios for WCAG AA accessibility.
4. Generate tints/shades for each primary color.
5. Document as design tokens: CSS custom properties, Tailwind config values, raw hex/HSL/RGB.
6. Visual swatch sheet in the brand guide.

### 2.4 The "One Accent Color" Decision

Following Asimov's "one accent color per brand" philosophy, **Terracotta (#C4724E)** is the strongest candidate — warm, architectural (fired earth), distinctive against cream. However, this is a Julianna decision. Present Terracotta, Coral Red, and Amber as the three accent candidates with visual mockups.

---

## 3. Typography Recommendations

### 3.1 Design Constraints

From research/01 (Asimov): Sans-serif dominant, monospace accent, custom/independent foundry typefaces, self-hosted, restrained weights (400/500), generous line-height.

From research/03 (Julianna's work): **Serif, light weight, lowercase** — quiet, refined, European (Scandinavian/Swiss).

**The tension:** Asimov uses sans-serif dominant. Julianna's own work leans serif. Resolution: **invert the Asimov formula** — serif as the primary voice (Julianna's sensibility), with sans-serif or monospace as the structural/technical accent.

### 3.2 Typeface Candidates

**Primary (body + headings) — Serif:**

| Typeface | Foundry | License | Notes |
|----------|---------|---------|-------|
| Freight Text/Display | GarageFonts | Commercial ($) | Warm humanist serif, beautiful at all sizes |
| Tiempos Text/Headline | Klim Type Foundry | Commercial ($) | Refined contemporary serif, editorial gravitas |
| Spectral | Production Type / Google Fonts | Free | Warm parametric serif, excellent screen rendering |
| EB Garamond | Google Fonts | Free | Faithful Garamond revival, scholarly, refined |

**Accent (labels, nav, metadata) — Monospace:**

| Typeface | Foundry | License | Notes |
|----------|---------|---------|-------|
| Suisse Int'l Mono | Swiss Typefaces | Commercial ($) | What Asimov uses |
| JetBrains Mono | JetBrains | Free | Bridges code + design |
| IBM Plex Mono | IBM / Google Fonts | Free | Clean, versatile, part of superfamily |

### 3.3 Recommended Pairing

**Primary:** Freight Text (body) + Freight Display (headings) + JetBrains Mono (accent)
**Budget:** Spectral (body/headings) + JetBrains Mono (accent)
**Maximum distinction:** Tiempos Headline (headings) + Spectral (body) + IBM Plex Mono (accent)

### 3.4 Process

1. Agent prepares 3 pairing options with specimen sheets.
2. Julianna reviews pairings. `needs_human` gate.
3. Acquire licenses if commercial typefaces are chosen.
4. Document type scale and design tokens.

---

## 4. Logo/Wordmark Direction

Following Asimov's "typography IS the design" principle, the logo should be a **wordmark** (name set in type), not an icon or symbol.

**Options:**
1. Name in the primary serif typeface — simplest, most Asimov-aligned
2. Name + a geometric mark — simple abstract form (line, arc, dot)
3. Custom lettering treatment — stretch scope, only if simpler approaches feel generic

Test at multiple scales: favicon, header, full-page title, social media card. `needs_human` gate for final selection.

---

## 5. Domain Availability

1. After name shortlist, check availability via `whois` CLI or registrar API.
2. Check TLDs: `.com`, `.co`, `.studio`, `.works`, `.design`, `.io`, `.dev`
3. Check social media handles (Instagram, GitHub, Twitter/X).
4. Prefer `.com` if available; `.studio` or `.co` as alternatives.
5. Register immediately once decided — domains are first-come-first-served.

---

## 6. Positioning Statement

**Framework:** Follow Asimov copy pattern — present tense, active voice, mission-forward, ambitious but accessible.

**Structure:** `[Name] [verb phrase] [bridge between disciplines] [to what end].`

**Process:**
1. Agent drafts 10-15 candidates after name is chosen.
2. Julianna shortlists 3 and refines. `needs_human` gate.
3. Final statement goes into brand guide.

---

## 7. Brand Guide Deliverable

**Contents:**
1. Name — chosen name, pronunciation if non-obvious
2. Positioning Statement — the one-liner
3. Color Palette — full swatch sheet with hex/HSL/RGB, usage rules, contrast ratios
4. Typography — typeface names, weights, type scale, specimen, licensing info
5. Wordmark — logo treatment, clear space rules, minimum sizes
6. Voice & Tone — guidelines consistent with Asimov's earnest precision in first person
7. Usage Examples — mockups showing identity in context
8. Design Tokens — CSS custom properties / Tailwind config values ready for Phase 3

**Does NOT include:** Component library, grid system, animation specs, content templates (all Phase 3).

---

## 8. Execution Sequence

| Step | Action | Gate | Actor |
|------|--------|------|-------|
| 1 | Generate 30-50 naming candidates across 5 families | -- | Agent |
| 2 | Present candidates to Julianna for shortlisting | `needs_human` | Julianna |
| 3 | Domain availability check on shortlist | -- | Agent |
| 4 | Julianna selects name | `needs_human` | Julianna |
| 5 | Register domain | -- | Julianna (payment) |
| 6 | Formalize color palette (refine hex, test contrast, generate tokens) | -- | Agent |
| 7 | Prepare 3 typeface pairing options with specimens | -- | Agent |
| 8 | Julianna selects typeface pairing | `needs_human` | Julianna |
| 9 | Acquire font licenses if commercial | -- | Julianna (payment) |
| 10 | Design wordmark (name set in chosen typeface) | -- | Agent |
| 11 | Julianna approves wordmark | `needs_human` | Julianna |
| 12 | Draft 10-15 positioning statements | -- | Agent |
| 13 | Julianna selects/refines positioning statement | `needs_human` | Julianna |
| 14 | Compile brand guide document | -- | Agent |
| 15 | Julianna reviews complete brand guide | `needs_human` | Julianna |

**Minimum `needs_human` gates: 5.** This task cannot be completed autonomously.

---

## 9. Acceptance Criteria

- [ ] Studio/practice name is chosen and documented
- [ ] Domain is registered (or availability confirmed and reserved)
- [ ] Color palette has exact hex/HSL values for all colors, tested for WCAG AA contrast
- [ ] At least 2 typefaces selected with licensing confirmed
- [ ] Type scale defined (heading, body, caption, label sizes)
- [ ] Wordmark exists at multiple scales (favicon through full-page)
- [ ] One-line positioning statement is finalized
- [ ] Brand guide document is complete and committed to repo
- [ ] Design tokens (CSS custom properties) are documented and ready for Phase 3

---

## 10. Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| Naming paralysis | High | Timebox to 2 sessions. PRD: "Pick a good-enough name and evolve later." |
| Commercial typeface cost | Low | Budget options (Spectral, EB Garamond) are genuinely good. Commercial fonts ~$50-150 for web license. |
| Domain unavailability | Medium | Cast a wide net across TLDs. `.studio` and `.co` often available. |
| Color palette looks different in context | Medium | Test palette in mockups early, not just as swatches. |
| Wordmark needs professional design | Low | Start typographic-only. Professional lettering is stretch scope. |

## Reset 2026-03-03 by agent:claude-opus-4-orchestrator
