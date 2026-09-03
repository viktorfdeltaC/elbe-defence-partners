/**
 * Step 1 of outlining the wordmark: ask a browser where every glyph actually
 * sits.
 *
 * Laying the runs out from raw advance widths is not enough — the browser
 * applies the font's kerning, and then textLength/lengthAdjust redistributes
 * everything to hit the forced width. Reproducing that by hand put the letters
 * a little off, which shows up immediately in a difference blend. So the
 * authoritative layout comes from the same engine that rendered the approved
 * logo, and fontTools only supplies the shapes.
 *
 * Writes scripts/.wordmark-layout.json for build-wordmark.py.
 */
import { chromium } from 'playwright';
import { readFileSync, writeFileSync } from 'node:fs';

const CHROME = '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const fontsCss = readFileSync('src/styles/fonts.css', 'utf8');

const RUNS = [
  { id: 'big', text: 'SANKTUM', weight: 800, size: 100, x: 20, baseline: 106, textLength: 500, adjust: 'spacingAndGlyphs', tracking: 0 },
  { id: 'small', text: 'DEFENCE PARTNERS', weight: 600, size: 22, x: 128, baseline: 141, textLength: 392, adjust: 'spacing', tracking: 4 },
];

const svg = RUNS.map(
  (r) =>
    `<text id="${r.id}" x="${r.x}" y="${r.baseline}" font-family="Archivo, sans-serif" ` +
    `font-weight="${r.weight}" font-size="${r.size}" letter-spacing="${r.tracking}" ` +
    `textLength="${r.textLength}" lengthAdjust="${r.adjust}">${r.text}</text>`
).join('\n');

const html = `<!doctype html><meta charset="utf-8"><style>${fontsCss}</style>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 560 170" width="560" height="170">${svg}</svg>`;

const b = await chromium.launch({ executablePath: CHROME });
const p = await b.newPage();
await p.setContent(html);
await p.evaluate(() => document.fonts.ready);
await p.waitForTimeout(400);

const layout = await p.evaluate((runs) => {
  const out = {};
  for (const r of runs) {
    const el = document.getElementById(r.id);
    const chars = [];
    for (let i = 0; i < r.text.length; i++) {
      const start = el.getStartPositionOfChar(i);
      const ext = el.getExtentOfChar(i);
      chars.push({ ch: r.text[i], x: +start.x.toFixed(4), advance: +ext.width.toFixed(4) });
    }
    out[r.id] = { chars, bbox: (({ x, y, width, height }) => ({ x, y, width, height }))(el.getBBox()) };
  }
  return out;
}, RUNS);

await b.close();
writeFileSync('scripts/.wordmark-layout.json', JSON.stringify({ runs: RUNS, layout }, null, 1));
for (const r of RUNS) {
  const c = layout[r.id].chars;
  console.log(`${r.id}: ${c.length} Zeichen, x ${c[0].x} … ${(c.at(-1).x + c.at(-1).advance).toFixed(2)}`);
}
