#!/usr/bin/env node
/**
 * Regenerates src/styles/fonts.css and public/fonts/*.woff2 from Google Fonts.
 *
 * The fonts are self-hosted on purpose: requesting them from fonts.gstatic.com
 * at page load sends every visitor's IP address to Google, which a German court
 * has held to be a GDPR violation (LG München I, 3 O 17493/20). For a site
 * addressed at defence manufacturers, authorities and capital, that is not a
 * risk worth carrying for a font file.
 *
 * Only the latin and latin-ext subsets are kept — the copy is German and
 * English. Google serves variable font files, so the eight files here cover all
 * the declared weights.
 *
 *   node scripts/fetch-fonts.mjs
 */
import { mkdir, rm, writeFile } from 'node:fs/promises';

const CSS_URL =
  'https://fonts.googleapis.com/css2' +
  '?family=Manrope:wght@300;400;500;600' +
  '&family=Archivo:wght@400;500;600;700;800;900' +
  '&family=Archivo+Narrow:wght@400;500;600' +
  '&family=IBM+Plex+Mono:wght@400' +
  '&display=swap';

// Google serves woff2 only to browsers that advertise support.
const UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

const KEEP = new Set(['latin', 'latin-ext']);

const HEADER = `/* Self-hosted Google Fonts (SIL Open Font License 1.1): Archivo,
   Archivo Narrow, Manrope, IBM Plex Mono. Latin + latin-ext subsets only.
   Self-hosted deliberately: hotlinking fonts.gstatic.com transmits every
   visitor's IP to Google and has been held to violate the GDPR in Germany
   (LG Muenchen I, 3 O 17493/20) - not a risk this audience should carry.
   Regenerate with scripts/fetch-fonts.mjs. */

`;

const css = await (await fetch(CSS_URL, { headers: { 'User-Agent': UA } })).text();

await rm('public/fonts', { recursive: true, force: true });
await mkdir('public/fonts', { recursive: true });

const blocks = [...css.matchAll(/\/\* (\S+) \*\/\s*(@font-face \{[\s\S]*?\})/g)];
const seen = new Map();
const out = [];

// Deterministic filenames — family + subset. Google serves one variable file
// per family/subset, so this collapses the 28 declared faces onto 8 files, and
// the names stay stable across refetches (the <link rel=preload> hints in
// Base.astro point at two of them by name).
const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

for (const [, subset, face] of blocks) {
  if (!KEEP.has(subset)) continue;
  const url = /url\((https:\/\/[^)]+)\)/.exec(face)[1];
  const family = /font-family: '([^']+)'/.exec(face)[1];
  if (!seen.has(url)) {
    const name = `${slug(family)}-${subset}.woff2`;
    const bytes = Buffer.from(await (await fetch(url)).arrayBuffer());
    await writeFile(`public/fonts/${name}`, bytes);
    seen.set(url, name);
  }
  out.push(`/* ${subset} */\n${face.replace(url, `/fonts/${seen.get(url)}`)}`);
}

await writeFile('src/styles/fonts.css', HEADER + out.join('\n\n') + '\n');
console.log(`${out.length} faces, ${seen.size} files`);
