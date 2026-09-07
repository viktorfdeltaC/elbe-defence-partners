/**
 * Draws the link preview card — public/og.png, 1200 × 630.
 *
 * This is the picture that stands in for the whole site in WhatsApp, LinkedIn,
 * Slack and iMessage, at a size where a screenshot of the page would be
 * unreadable. So it is the mark on the near-black ground, with the same
 * hairlines down the 5% gutters that frame every section, and nothing else:
 * the scrapers render the title and the description as text beside it anyway.
 *
 * The lettering comes from the generated wordmark, so the card cannot drift
 * away from the logo — regenerate with `npm run og` after `npm run wordmark`.
 */
import sharp from 'sharp';
import { readFileSync, writeFileSync } from 'node:fs';

const W = 1200;
const H = 630;

// Straight from src/styles/global.css.
const DARK = '#111213';
const OCKER = '#c9873f';
const RULE = 'rgba(255,255,255,0.12)';

// The wordmark body, with its two colour hooks resolved: outside a page there
// is no `currentColor` to inherit and no custom property to read.
// The comments go too: they mention `--ocker`, and a double hyphen inside an
// XML comment is a parse error for a strict reader like the one behind sharp.
const wordmark = readFileSync('src/components/wordmark.svg', 'utf8')
  .replace(/<!--[\s\S]*?-->/g, '')
  .replace('var(--ocker, #d9a441)', OCKER)
  .replace('fill="currentColor"', 'fill="#f2f3f4"');

// Tight ink box of the mark, measured by scripts/build-wordmark.py.
const VIEW = { x: 22, y: 36.09, w: 493, h: 105.17 };

// Half the card's width. Large enough to read as the sender at thumbnail size,
// small enough that the mark still sits in air rather than filling the frame.
const markW = W * 0.5;
const markH = (markW / VIEW.w) * VIEW.h;
const scale = markW / VIEW.w;
const left = (W - markW) / 2;
const top = (H - markH) / 2;

const gutter = W * 0.05;

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <rect width="${W}" height="${H}" fill="${DARK}"/>
  <!-- The section frame of the page: a hairline down each gutter edge. -->
  <rect x="${gutter}" y="0" width="1" height="${H}" fill="${RULE}"/>
  <rect x="${W - gutter}" y="0" width="1" height="${H}" fill="${RULE}"/>
  <g transform="translate(${left - VIEW.x * scale} ${top - VIEW.y * scale}) scale(${scale})">
    ${wordmark}
  </g>
</svg>`;

writeFileSync('scripts/.og.svg', svg);
await sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toFile('public/og.png');

const { size } = await sharp('public/og.png').metadata().then(async (m) => ({
  size: (await import('node:fs')).statSync('public/og.png').size,
  ...m,
}));
console.log(`public/og.png: ${W}×${H}, ${(size / 1024).toFixed(0)} KB`);
