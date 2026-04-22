# Carlos Ledesma — Design System

> **Software craftsmanship, quality-oriented.**
> A design system for Carlos Ledesma's personal CV / portfolio site. Vibrant neon-on-obsidian palette, playful editorial motion, geometric sans + mono typography.

---

## Context

Carlos Ledesma is an independent software craftsman who positions himself around **quality, rigor and craft**. This system powers his personal Curriculum Vitae / portfolio site — a one-pager + project case-study pattern. The design needs to feel:

- **Vibrant, not corporate** — saturated neons on deep obsidian, no corporate blues.
- **Playful & energetic** — bouncy micro-interactions, parallax depth, decorative SVG blobs.
- **Editorial** — large expressive type, confident whitespace, magazine-style rhythm.
- **Techy under the hood** — monospace accents reveal the engineer.
- **Bilingual** — every section authored in EN / ES with a language toggle.

## Sources

No codebase, Figma or existing brand assets were attached. The system was designed from first principles based on the brief: *"Vibrant palette, amazing animations and transitions. It's a personal page for Curriculum Vitae exposition."* and a short form conversation captured in `docs/decisions.md` (if present).

**If Carlos has existing brand assets (logo, photo, resume PDF, old site), please attach them** — the logo here is a designed monogram placeholder.

---

## Content Fundamentals

**Voice: Confident & technical — terms of art, understated.**
He is a craftsman. He doesn't sell, he *shows*. Short sentences. Terms like *idempotency*, *p99*, *DDD*, *hexagonal* land without being explained. No hype words (*revolutionary*, *synergy*, *unlock*). No exclamation marks outside of playful interjections.

- **Person:** First person ("I build", "I care about"), but sparingly. Titles and eyebrows drop the pronoun entirely.
- **Tense:** Present for what he does, past for shipped work, never future-speculative.
- **Casing:** Sentence case everywhere except eyebrows and tags, which are `UPPERCASE WITH WIDE TRACKING` in mono.
- **Punctuation:** Em dashes — used liberally for asides. Oxford commas. Periods optional on short display lines.
- **Emoji:** None on the site. Occasional Unicode glyphs allowed as typographic accents (`·`, `→`, `↗`, `✦`, `§`).
- **Numbers:** Always numerals (`8 years`, not *eight*). Metrics in mono (`99.98%`, `p99: 42ms`).
- **Bilingual:** Copy is authored in both EN and ES. Spanish is canonical; English matches it in tone and length. Toggle persists per session.

### Examples

| ✅ Use                                                                     | ❌ Avoid                                  |
| -------------------------------------------------------------------------- | ----------------------------------------- |
| *Software, built with care.*                                               | *Crafting innovative software solutions!* |
| *I've spent 8 years shipping systems that don't wake me up at 3am.*        | *Passionate developer with 8+ YOE.*       |
| *Reduced p99 from 820ms → 42ms by re-modelling the hot path.*              | *Improved performance significantly.*     |
| *Not everything needs a framework.*                                        | *Leveraging cutting-edge tech.*           |
| **Eyebrow:** `CASE STUDY · 2024`                                           | `Case Study (2024)`                       |

---

## Visual Foundations

### Palette — Obsidian + Neon

Dark is the default. Four neon accents sit on a deep obsidian background. The colors are saturated but the canvas is calm — contrast comes from the edges, not the fill.

- **Obsidian 900** (`#0A0A0F`) — default background. Not pure black; has a violet undertone so the neons sing against it.
- **Neon Cyan** (`#00F5D4`) — primary accent. Used for links, interactive state, signature glow.
- **Neon Violet** (`#9B5DE5`) — secondary accent. Section markers, gradient mids.
- **Neon Pink** (`#F15BB5`) — tertiary accent. Highlights, hover washes.
- **Neon Yellow** (`#FEE440`) — quaternary. Only for "pay attention here" moments (1 per viewport max).

Neons rotate — a page typically uses **one dominant neon per section**, never all four at once. The `.gradient-text` utility runs cyan → violet → pink for headline flourishes.

### Typography

- **Display / UI:** `Space Grotesk` (500/600) — geometric with just enough personality. Tight tracking at large sizes.
- **Body:** `Inter` (400/500) — a workhorse that disappears so the words do the talking.
- **Mono:** `JetBrains Mono` (400/500) — for eyebrows, metrics, code, tags. Part of the brand's identity, not an afterthought.

Scale is fluid — `clamp()` everywhere, so headlines breathe on big screens without reflowing on small ones. See `colors_and_type.css` for the full scale.

> **Font substitution note:** All three families load from Google Fonts. If Carlos prefers licensed display faces (e.g. *PP Neue Machina*, *GT Walsheim*, *Söhne*), please attach the `.woff2` files and I'll swap the `@import`.

### Spacing

4pt base grid. `--space-1` (4px) → `--space-11` (192px). Sections breathe at `--space-10` (128px) vertical on desktop, `--space-7` (48px) on mobile. Card interiors at `--space-5` / `--space-6`.

### Backgrounds

- **Default:** Flat `--bg` (obsidian 900). No gradients on the body.
- **Section accents:** Large decorative SVG blobs (`assets/blob-*.svg`) absorbed into the background at `opacity: 0.15` with a slow drifting animation — *decorative SVG / blob morphing* as chosen.
- **Parallax layers:** Foreground content, mid-depth blob, back-depth dot grid. Three layers, scrolled at different rates (1.0 / 0.6 / 0.3).
- **Full-bleed:** Project hero images only. Body copy stays in the 1200px container.
- **Grain / noise:** An optional 2% noise overlay (`.grain::after`) on large blocks to kill banding.
- **Repeating patterns:** A dot-grid (`assets/dot-grid.svg`) behind the hero, at 4% opacity.

### Motion (intensity: 8 / 10)

Animation is a core brand asset here, not decoration.

- **Easing:**
  - `--ease-out-expo` — default for most entrances / exits (confident deceleration).
  - `--ease-spring` — bouncy (overshoot) for button presses, toggle switches, "fun" UI.
  - `--ease-in-out` — for scrubbing / scroll-linked animations.
- **Durations:** 120ms for reactive feedback, 220ms for default, 420ms for entrances, 720ms for decorative drift.
- **Entrances:** Elements fade up 24px with `--ease-out-expo` on scroll, staggered 60ms.
- **Hover:** Buttons lift 2px + gain their neon glow (`--glow-cyan`). Links shift color, never underline-animate.
- **Press:** 95% scale for 80ms with spring, then settles.
- **Blob morphing:** Decorative SVG blobs slowly morph their `d` attribute over 20s on an infinite cycle.
- **Parallax:** Chosen per brief — background blob drifts at 0.3× scroll rate, mid-ground at 0.6×, foreground at 1×.
- **Cursor:** No custom cursor by default (distracting). Magnetic hover on CTAs only.
- **Reduced motion:** All animations reduce to 0.01ms — respected throughout via `@media (prefers-reduced-motion)`.

### Hover / Press / Focus

- **Hover (interactive):** Subtle 2px Y translate + brand glow. No opacity changes (looks dead on dark bg).
- **Hover (link):** Color shifts from `--neon-cyan` → `--neon-cyan-hi` (lighter, brighter).
- **Press:** `transform: scale(0.96)` with spring ease.
- **Focus:** 2px ring at 3px offset using `--ring` (cyan at 55% alpha). Always visible, never suppressed.

### Borders

- Default: 1px `--border` (white at 8% alpha).
- Strong: 1px `--border-strong` (white at 16%).
- Accent: 1px solid `--neon-cyan` — for highlighted cards, active states.
- **No inner borders inside cards.** Dividing happens with space, not lines.

### Shadows + Glows

Shadows are structural (depth), glows are brand (emotion).

- `--shadow-md` / `--shadow-lg` — for elevated cards and modals.
- `--glow-cyan` / `--glow-violet` / `--glow-pink` / `--glow-yellow` — signature neon halos on CTAs and hover. Each is a 1px colored rim + a 32px + 80px soft bloom.

### Corner Radii

Radii are generous but consistent. `--radius-md` (12px) for inputs/tags, `--radius-lg` (20px) for cards, `--radius-2xl` (40px) for hero canvases. `--radius-pill` for chips and CTAs.

### Cards

- Background: `--bg-elevated` (obsidian 800).
- Border: 1px `--border`.
- Radius: `--radius-lg` (20px).
- Shadow: `--shadow-md` at rest, `--shadow-lg` + `--glow-cyan` on hover.
- Inner padding: `--space-6` (32px) desktop, `--space-5` (24px) mobile.
- **No left-accent border trick.** Use a full top 2px neon strip or a badge instead — the "rounded card with colored left border" is an AI-slop tell we avoid.

### Transparency & Blur

- **Sticky nav:** `backdrop-filter: blur(14px) saturate(1.2)` with `--bg-overlay` (10% opacity black).
- **Modals:** Page dims to 70% black, sheet slides up with backdrop blur.
- **Glass:** Not a dominant motif — used sparingly on the nav only.

### Imagery vibe

Project thumbnails: **cool, contrast-y, slight grain.** Photography is B&W or duotone (cyan/violet split-tone). No stock-photo smiles. Screenshots of software sit on obsidian with a 1px rim.

### Layout Rules

- **Max container:** 1200px. Hero can bleed to 1440px.
- **Gutter:** `clamp(1rem, 3vw, 3rem)`.
- **Grid:** 12 column, 24px gap. Section titles anchor to cols 1–3; body to 4–12.
- **Sticky:** Nav sticks top. Progress bar spans top edge.
- **Anchor nav:** Right-rail section index on desktop (hidden on mobile).

---

## Iconography

- **Primary set:** [`lucide-icons`](https://lucide.dev/) loaded via CDN (`https://unpkg.com/lucide@latest`). Lucide is an open-source fork of Feather with a wider set and the same 1.5px-stroke minimalism that matches the brand's geometric sans.
- **Stroke weight:** 1.5px at all sizes. Never filled unless the icon requires it (e.g. play triangle).
- **Sizing:** 16 / 20 / 24px. Bump to 28/32 only for hero moments.
- **Color:** Inherits `currentColor`. Neutral by default, neon only when it's interactive or a status indicator.
- **Brand / social icons:** Custom monoline SVGs (GitHub, LinkedIn, RSS, email) in `assets/icons/` matching Lucide's stroke weight. See below.
- **Emoji:** Not used on the site. OK in commit messages, not in UI.
- **Unicode glyphs:** `·` `→` `↗` `✦` `§` — used sparingly as typographic accents (separators, link arrows, section markers).

### Substitution flag

Because no brand icons were provided, **all iconography is a CDN/open-source substitution.** If Carlos has custom icons, please drop them in `assets/icons/` and update `ICONOGRAPHY` above.

---

## Index (manifest)

### Root
- `README.md` — this file.
- `SKILL.md` — Agent Skills–compatible entry point for Claude Code.
- `colors_and_type.css` — all CSS variables + semantic base styles. **Import this into any artifact to get on-brand output.**

### Folders
- `assets/` — logos, icons, background SVGs (blobs, dot grid). Drop it into any project.
- `fonts/` — webfonts. Currently empty; all fonts load from Google Fonts CDN (see substitution note).
- `preview/` — small HTML cards powering the Design System tab. Not meant for production.
- `ui_kits/cv-site/` — the CV portfolio UI kit. Open `ui_kits/cv-site/index.html` for the interactive prototype.

### UI Kits

| Kit | What it covers |
| --- | --- |
| [`cv-site/`](ui_kits/cv-site/index.html) | Home (hero, about, experience, projects, skills) + project detail (case study). Bilingual toggle. Full motion. |

---

## Quick start for an agent

1. Copy `colors_and_type.css` into your project and `<link>` it at the top of every HTML file.
2. Pull assets from `assets/` — logo, blobs, dot-grid — don't invent SVGs of your own.
3. Reuse JSX components from `ui_kits/cv-site/components/` — hero, nav, project card, experience row, tag chip, CTA button.
4. Follow the content fundamentals: confident / technical / understated. First person sparingly. No emoji. Numerals for numbers. Mono for metrics and eyebrows.
5. Respect reduced motion. Always.
