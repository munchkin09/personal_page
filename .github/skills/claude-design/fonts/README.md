# Fonts

This design system uses three families, all loaded **from Google Fonts CDN** via the `@import` at the top of `colors_and_type.css`. No `.woff2` files are stored in-repo.

| Role | Family | Weights | License |
| --- | --- | --- | --- |
| Display / UI | [Space Grotesk](https://fonts.google.com/specimen/Space+Grotesk) | 300, 400, 500, 600, 700 | OFL |
| Body / sans | [Inter](https://fonts.google.com/specimen/Inter) | 400, 500, 600, 700 | OFL |
| Mono / accents | [JetBrains Mono](https://fonts.google.com/specimen/JetBrains+Mono) | 400, 500, 700 | OFL |

## Substitution flag

**All fonts are open-source substitutions** — Carlos did not provide licensed display faces. If you prefer characterful display faces that match the "techy, geometric, confident" brief, consider:

- **PP Neue Machina** (ABC Dinamo) — closer to the "geometric with personality" brief. Commercial license.
- **GT Walsheim** (Grilli Type) — warmer geometric alternative. Commercial license.
- **Söhne** (Klim) — neutral, industrial, if we want less personality in the display.
- **Monument Grotesk** or **Söhne Mono** — mono pairings.

**To swap:** drop the `.woff2` files in this folder, add an `@font-face` block at the top of `colors_and_type.css`, and remove the Google Fonts `@import`.
