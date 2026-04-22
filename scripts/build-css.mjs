/**
 * build-css.mjs — vanilla CSS bundler for NotifyX
 * Concatenates the CSS partials and writes a minified output.
 * No Tailwind needed since all CSS is now vanilla.
 */

import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');
const stylesDir = resolve(root, 'src/styles');
const outDir = resolve(root, 'dist');

// ── Collect partials in order ──
const partials = [
  'base.css',
  'animations.css',
  'themes.css',
  'ai.css',
];

// Skip the @import lines from toast.css and just concatenate directly
let combined = `/*!\n * NotifyX v3.0.0 — AI-Native Toast Notifications\n * https://github.com/awalhadi/notifyx\n * @author A Awal Hadi | MIT License\n */\n\n`;

for (const file of partials) {
  const content = readFileSync(resolve(stylesDir, file), 'utf8');
  combined += `/* ── ${file} ── */\n${content}\n\n`;
}

// ── Basic minification (no external dep needed) ──
function minifyCSS(css) {
  return css
    // Remove Google Fonts import (consumers can add their own)
    // Keep it — it's fine for opt-in
    // Remove single-line comments (but NOT url() and not inside strings)
    .replace(/\/\*(?!!)[\s\S]*?\*\//g, '')          // remove block comments (not /*! banner)
    .replace(/\s*([{}:;,>~+])\s*/g, '$1')           // collapse whitespace around syntax
    .replace(/;\s*}/g, '}')                          // remove trailing semicolons
    .replace(/\s{2,}/g, ' ')                         // collapse multiple spaces
    .replace(/\n/g, ' ')                             // flatten newlines
    .replace(/\s*\/\*[^*]*\*+([^/*][^*]*\*+)*\//g, '') // leftover comments
    .trim();
}

const minified = minifyCSS(combined);

mkdirSync(outDir, { recursive: true });
writeFileSync(resolve(outDir, 'notifyx.min.css'), minified, 'utf8');

const kb = (minified.length / 1024).toFixed(2);
console.log(`✓ CSS built → dist/notifyx.min.css (${kb} KB uncompressed)`);
