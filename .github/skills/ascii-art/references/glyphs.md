# Glyphs (manual fallback)

Used only if `figlet` is unavailable. Each glyph is 5 rows tall. Concatenate horizontally with one space column between letters. Uppercase input before lookup.

This reference covers the `standard`-ish style only. For `big` or `slant`, prefer installing figlet: `sudo apt install figlet` (Debian/Ubuntu) or `brew install figlet` (macOS). If the user requested `big`/`slant` and figlet is unavailable, render with the glyphs below and note `style: standard (fallback)` in the output.

## A-Z (5 rows each)

```
  ___      ____     ____    ____    _____   _____    ____    _   _   ___      _    _  __   _      __  __   _   _    ____    ____     ___     ____     ____   _____   _   _  __     __ __        __ __   __  __     __  _____
 / _ \    | __ )   / ___|  |  _ \  | ____| |  ___|  / ___|  | | | | |_ _|    | |  | |/ / | |     |  \/  | | \ | |  / __ \  |  _ \   / _ \   |  _ \   / ___| |_   _| | | | | \ \   / / \ \      / / \ \/ / \ \/ /    / / |__  /
| |_| |   |  _ \  | |      | | | | |  _|   | |_     | |  _  | |_| |  | |  _  | | | ' /  | |     | |\/| | |  \| | | |  | | | |_) | | | | |  | |_) | \___ \   | |   | | | |  \ \ / /   \ \ /\ / /   \  /   \  /    / /    / /
|  _  |   | |_) | | |___   | |_| | | |___  |  _|    | |_| | |  _  |  | | | |_| | | . \  | |___  | |  | | | |\  | | |__| | |  __/  | |_| |  |  _ <   ___) |  | |   | |_| |   \ V /     \ V  V /    /  \   /  \   / /    / /_
|_| |_|   |____/   \____|  |____/  |_____| |_|       \____| |_| |_| |___| \___/  |_|\_\ |_____| |_|  |_| |_| \_|  \____/  |_|      \___/   |_| \_\ |____/   |_|    \___/     \_/       \_/\_/    /_/\_\ /_/\_\ /_/    /____|
```

Row-by-row per letter (5-row cells). Use this as source of truth; extract the columns for each letter as needed. If a letter is missing from your mental copy, re-derive from this block.

## Digits 0-9

```
  ___    _       ____    _____   _  _    ____     __     _____    ___     ___
 / _ \  / |     |___ \  |___ /  | || |  | ___|   / /_   |___  |  ( _ )   / _ \
| | | | | |       __) |   |_ \  | || |_ |___ \  | '_ \     / /   / _ \  | (_) |
| |_| | | |      / __/   ___) | |__   _| ___) | | (_) |   / /   | (_) |  \__, |
 \___/  |_|     |_____| |____/     |_|  |____/   \___/   /_/     \___/     /_/
```

## Punctuation: space, `!`, `?`, `.`

```
       _          ___    
      | |        |__ \   
      | |           ) |  
      |_|          / /   
      (_)         |_|   .
```

Space glyph is 5 columns of blanks, 5 rows tall.

## Algorithm

1. Uppercase input.
2. For each character, look up its 5-row × N-column glyph.
3. For unsupported chars, use `?`.
4. Join glyphs row-by-row with a single space column separator.
5. Left-pad shorter rows so all rows have equal width.
