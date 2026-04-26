# CV Site — UI Kit

Interactive, click-through prototype of Carlos Ledesma's CV / portfolio site. Dark-default, vibrant neon palette, playful editorial motion.

## Open

`index.html` — entry point. Renders the home view; click any project card to drop into the case-study detail. Lang toggle in the top-right flips EN ↔ ES everywhere.

## Structure

```
cv-site/
├── index.html          ← entry, composes App + routing (home / detail)
├── styles.css          ← UI kit styles (imports ../../colors_and_type.css)
├── copy.js             ← EN + ES copy dictionary (Spanish canonical)
└── components/
    ├── BgLayers.jsx    ← parallax dot-grid + drifting neon blobs
    ├── Nav.jsx         ← sticky pill nav w/ language toggle
    ├── Hero.jsx        ← title, sub, status row, CTA pair
    ├── About.jsx       ← prose + stat cards
    ├── Experience.jsx  ← year · role · company list
    ├── Projects.jsx    ← grid of case-study cards
    ├── Skills.jsx      ← three grouped lists
    ├── Footer.jsx      ← CTA + contact columns + colophon
    └── ProjectDetail.jsx ← case study page with TOC, code block, results
```

## Interactions

- **Language toggle (EN/ES)** — persists in localStorage.
- **Project card → detail** — opens `ProjectDetail` in place.
- **Nav items** — scroll to sections; from detail view, scrolls back to home.
- **Scroll reveal** — sections fade up 24px with expo easing.
- **Parallax** — three depth layers (dot-grid, three blobs) scroll at independent rates.
- **Hover** — buttons lift + glow, project cards raise + pull in the gradient top-strip, experience rows nudge right.
- **Tweaks panel** — toggle with the Tweaks chip in the toolbar; change accent color / language / view.

## What was cut corners on

- Writing / blog section (not requested).
- Testimonials, Education, full contact form.
- Only one case study has actual content (hot-path). The other three cards navigate to the same detail view — real copy would go per-slug.
- No real photos of Carlos — placeholder where a portrait would go is avoided entirely; the hero is type-first.
