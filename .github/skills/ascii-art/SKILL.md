---
name: ascii-art
description: "Generate ASCII art banners for a given word or short phrase. Use when the user asks for ascii art, a text banner, figlet output, a stylized title, or says 'make ascii for <word>', 'banner for <word>', 'draw <word> in ascii'. Supports standard, big, and slant styles. Not for image-to-ascii conversion."
argument-hint: '<word> [style: standard|big|slant]'
---

# ASCII Art Generator

## When to Use
- User asks for ASCII art of a word, name, or short phrase
- User wants a text banner, figlet output, or stylized title in a README/terminal
- User says: "ascii for X", "banner X", "figlet X", "draw X in ascii"

## Do Not Use For
- Converting images to ASCII (different skill/tool)
- Long paragraphs of text (banners are for short words/phrases, ≤ ~20 chars)
- Unicode/box-drawing diagrams (use a diagram tool)

## Inputs
- **word** (required): the text to render. Keep it short (≤ 20 chars recommended).
- **style** (optional, default `standard`): one of `standard`, `big`, `slant`.

## Procedure

### 1. Parse the request
Extract the `word` and optional `style` from the user's message. If `style` is missing, use `standard`. If `word` is missing, ask the user what word to render.

### 2. Try `figlet` first
Run the command below via a terminal tool. Map styles: `standard` → `standard`, `big` → `big`, `slant` → `slant`.

```sh
figlet -f <style> "<word>"
```

If `figlet` is not installed (`command -v figlet` fails), fall back to step 3.

### 3. Fallback: generate manually
Build the banner row-by-row using the per-character glyph maps in [./references/glyphs.md](./references/glyphs.md). Each glyph has a fixed height; concatenate glyphs horizontally with a single-space column between characters.

Rules:
- Uppercase input before rendering (glyph maps cover `A-Z`, `0-9`, space, `!`, `?`, `.`).
- If a character is unsupported, substitute `?` and note it after the banner.
- Preserve exact spacing; do not trim trailing whitespace on internal rows.

### 4. Deliver the output
Print the banner inside a fenced code block with no language tag so alignment is preserved:

```
 _   _      _ _
| | | | ___| | | ___
| |_| |/ _ \ | |/ _ \
|  _  |  __/ | | (_) |
|_| |_|\___|_|_|\___/
```

Then, on a single line below the block, report: `style: <style>` and, if fallback was used, `generator: manual` (otherwise `generator: figlet`).

## Quality Checks
- All rows of the banner have equal length (pad with spaces).
- Output is wrapped in a fenced code block with no language tag.
- Style reported matches what was rendered.
- Unsupported characters are flagged, not silently dropped.
