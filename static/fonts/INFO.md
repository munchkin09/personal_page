# Self-hosted web fonts

These files are **not committed to the repository** (excluded via `.gitignore`).
They are downloaded from Google Fonts CDN and served locally to avoid external requests.

To re-download all 16 files, run from the project root:

```bash
node scripts/download-fonts.js
```

Or manually download each file below with `curl -O <url>` into `static/fonts/`.

---

## Inter — weights 400 500 600 700

Base URL: `https://fonts.gstatic.com/s/inter/v20/`

| File | Subset |
|------|--------|
| `UcC73FwrK3iLTeHuS_nVMrMxCp50SjIa2JL7W0Q5n-wU.woff2` | cyrillic-ext |
| `UcC73FwrK3iLTeHuS_nVMrMxCp50SjIa0ZL7W0Q5n-wU.woff2` | cyrillic |
| `UcC73FwrK3iLTeHuS_nVMrMxCp50SjIa2ZL7W0Q5n-wU.woff2` | greek-ext |
| `UcC73FwrK3iLTeHuS_nVMrMxCp50SjIa1pL7W0Q5n-wU.woff2` | greek |
| `UcC73FwrK3iLTeHuS_nVMrMxCp50SjIa2pL7W0Q5n-wU.woff2` | vietnamese |
| `UcC73FwrK3iLTeHuS_nVMrMxCp50SjIa25L7W0Q5n-wU.woff2` | latin-ext |
| `UcC73FwrK3iLTeHuS_nVMrMxCp50SjIa1ZL7W0Q5nw.woff2`   | latin |

---

## JetBrains Mono — weights 400 500 700

Base URL: `https://fonts.gstatic.com/s/jetbrainsmono/v24/`

| File | Subset |
|------|--------|
| `tDbv2o-flEEny0FZhsfKu5WU4zr3E_BX0PnT8RD8yKwBNntkaToggR7BYRbKPx3cwgknk-6nFg.woff2` | cyrillic-ext |
| `tDbv2o-flEEny0FZhsfKu5WU4zr3E_BX0PnT8RD8yKwBNntkaToggR7BYRbKPxTcwgknk-6nFg.woff2` | cyrillic |
| `tDbv2o-flEEny0FZhsfKu5WU4zr3E_BX0PnT8RD8yKwBNntkaToggR7BYRbKPxPcwgknk-6nFg.woff2` | greek |
| `tDbv2o-flEEny0FZhsfKu5WU4zr3E_BX0PnT8RD8yKwBNntkaToggR7BYRbKPx_cwgknk-6nFg.woff2` | vietnamese |
| `tDbv2o-flEEny0FZhsfKu5WU4zr3E_BX0PnT8RD8yKwBNntkaToggR7BYRbKPx7cwgknk-6nFg.woff2` | latin-ext |
| `tDbv2o-flEEny0FZhsfKu5WU4zr3E_BX0PnT8RD8yKwBNntkaToggR7BYRbKPxDcwgknk-4.woff2`    | latin |

---

## Space Grotesk — weights 300 400 500 600 700

Base URL: `https://fonts.gstatic.com/s/spacegrotesk/v22/`

| File | Subset |
|------|--------|
| `V8mDoQDjQSkFtoMM3T6r8E7mPb54C_k3HqUtEw.woff2` | vietnamese |
| `V8mDoQDjQSkFtoMM3T6r8E7mPb94C_k3HqUtEw.woff2` | latin-ext |
| `V8mDoQDjQSkFtoMM3T6r8E7mPbF4C_k3HqU.woff2`    | latin |

---

> The `@font-face` declarations referencing these files live in [`static/css/fonts.css`](../css/fonts.css).
> The CSS design system imports that file from [`src/lib/styles/tokens.css`](../../src/lib/styles/tokens.css).
