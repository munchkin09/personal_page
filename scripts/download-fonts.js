#!/usr/bin/env node
/**
 * Downloads all self-hosted web font files listed in static/css/fonts.css
 * from their original Google Fonts CDN URLs into static/fonts/.
 *
 * Usage: node scripts/download-fonts.js
 */

import fs    from 'fs';
import https from 'https';
import path  from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const CSS_FILE  = path.join(__dirname, '../static/css/fonts.css');
const FONTS_DIR = path.join(__dirname, '../static/fonts');

// Reconstruct original CDN URLs from the local paths in fonts.css.
// fonts.css uses /fonts/<hash>.woff2 — we map known prefixes by filename pattern.
const BASES = {
  UcC73F: 'https://fonts.gstatic.com/s/inter/v20/',
  tDbv2o: 'https://fonts.gstatic.com/s/jetbrainsmono/v24/',
  V8mDoQ: 'https://fonts.gstatic.com/s/spacegrotesk/v22/',
};

const css = fs.readFileSync(CSS_FILE, 'utf8');
const localRegex = /url\('\/fonts\/([^']+\.woff2)'\)/g;

const files = new Set();
let m;
while ((m = localRegex.exec(css)) !== null) files.add(m[1]);

fs.mkdirSync(FONTS_DIR, { recursive: true });

const download = (filename) => new Promise((resolve, reject) => {
  const prefix = Object.keys(BASES).find(p => filename.startsWith(p));
  if (!prefix) { console.warn(`⚠ Unknown font family for: ${filename}`); return resolve(); }

  const url  = BASES[prefix] + filename;
  const dest = path.join(FONTS_DIR, filename);

  if (fs.existsSync(dest)) { console.log(`  skip  ${filename} (already exists)`); return resolve(); }

  const file = fs.createWriteStream(dest);
  https.get(url, res => {
    if (res.statusCode !== 200) {
      fs.unlinkSync(dest);
      return reject(new Error(`HTTP ${res.statusCode} for ${url}`));
    }
    res.pipe(file);
    file.on('finish', () => { file.close(); console.log(`  ✓     ${filename}`); resolve(); });
  }).on('error', err => { fs.unlinkSync(dest); reject(err); });
});

console.log(`Downloading ${files.size} font files to static/fonts/ …\n`);
Promise.all([...files].map(download))
  .then(() => console.log('\nDone.'))
  .catch(err => { console.error(err); process.exit(1); });
