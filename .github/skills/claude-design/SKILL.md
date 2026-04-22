---
name: carlos-ledesma-design
description: Use this skill to generate well-branded interfaces and assets for Carlos Ledesma's personal CV / portfolio brand, either for production or throwaway prototypes, mocks, slides, etc. Contains essential design guidelines, colors, type, fonts, assets, and UI kit components for prototyping — a dark-default, vibrant neon-on-obsidian aesthetic with geometric sans + mono type and playful editorial motion.
user-invocable: true
---

Read the `README.md` file within this skill, and explore the other available files — `colors_and_type.css` contains every token and semantic style ready to import, `assets/` contains the logo + background + icon SVGs, and `ui_kits/cv-site/` contains the reference components.

If creating visual artifacts (slides, mocks, throwaway prototypes, portfolio pages, social cards, resume PDFs, etc), **copy assets out** of this skill and create static HTML files for the user to view. Always `<link>` `colors_and_type.css` first — it sets up the full dark-default palette, the fluid type scale, and the motion easings.

If working on production code, you can copy the CSS tokens, read the motion rules, lift the JSX components from `ui_kits/cv-site/components/`, and become an expert in designing with this brand.

If the user invokes this skill without any other guidance, ask them what they want to build or design — a new section of the CV site, a social share image, a talk deck, a case-study page — ask follow-up questions (EN/ES? dark or light? which neon dominates? motion intensity?), and act as an expert designer who outputs HTML artifacts or production code, depending on the need.

### Brand essentials (memorize before building)
- **Palette:** Obsidian 900 (`#0A0A0F`) bg + four neons: cyan `#00F5D4`, violet `#9B5DE5`, pink `#F15BB5`, yellow `#FEE440`. One dominant neon per section.
- **Type:** Space Grotesk display, Inter body, JetBrains Mono for eyebrows/metrics.
- **Voice:** Confident, technical, understated. No hype, no emoji, numerals always, mono for metrics.
- **Motion:** Bouncy `--ease-spring` for micro-interactions, `--ease-out-expo` for entrances, parallax at 1.0/0.6/0.3× scroll rates, decorative blobs that slowly morph.
- **Bilingual:** EN + ES, Spanish canonical.
