# Elbe Defence Partners — landing page

Bilingual (DE/EN) one-pager. Astro, static output, no client framework.

Built from the `Richtung-D-Grid.dc.html` design handoff — the design files, the
session transcript and the original media are kept outside this repository;
this is the implementation only.

```bash
npm install
npm run dev        # http://localhost:4321
npm run build      # → dist/
npm run preview    # serve dist/
npm run check      # astro check (types + templates)
```

`dist/` is plain static files — any web server or static host will do.

## Layout

```
src/
  content/copy.ts       All German and English copy, one typed shape (`Copy`)
  layouts/Base.astro    <head>, fonts, metadata
  components/           One per section, in page order
  scripts/page.ts       Reveals, count-up, station rail, DE/EN switch, video
  styles/global.css     Design tokens and the shared section chrome
  styles/fonts.css      Generated — see scripts/fetch-fonts.mjs
  assets/               Images (build-optimised by Astro)
public/
  fonts/                Self-hosted woff2
  media/                Atmosphere band video + poster
scripts/
  fetch-fonts.mjs       Regenerate the self-hosted fonts
  encode-media.sh       Re-encode the band video for the web
```

## The design in one paragraph

Two grounds and no intermediate tones: paper `#f2f3f4` and near-black `#111213`,
alternating hard from section to section. Ocker `#c9873f` is a code rather than
decoration — it marks file references (A-01, B-01.2) and lead figures, nothing
else, and darkens to `#a4611f` on light grounds so the contrast holds. Archivo
carries the headlines (900 in the hero, 600 in the sections) and, as Archivo
Narrow, the figures; Manrope is body text; IBM Plex Mono is reserved for
metadata. Hairline rules run down both gutter edges of every section with tick
marks on the 17 % and 55 % column lines, and the content sits on those same
lines. All of it is stated at the top of `src/styles/global.css`.

## Changing things

**Copy.** Everything is in `src/content/copy.ts`. `de` and `en` share the `Copy`
interface, so a missing translation is a type error rather than a blank on the
page.

**Brand name.** `BRAND` in the same file — it is a placeholder by design.

**Language.** The page is rendered in German and switched client-side, as the
prototype did. Every translatable node carries `data-i18n` with a dot path into
`Copy` (`axes.2.figLabel`), and the switch walks those paths; attributes use
`data-i18n-attr="alt:imgAlt"`. A returning visitor keeps the language they
chose. If the two languages should ever become separate crawlable URLs, this is
the part to replace.

**Images.** Drop a replacement into `src/assets/` and update the import. The
portraits are framed by `CroppedImage`, which reproduces the crop the design
tool stored in `.image-slots.state.json` (`{ s, x, y }`) from the intrinsic size
and the frame ratio — so re-cropping means changing those numbers, not the file.

**Motion.** `src/scripts/page.ts`. Under `prefers-reduced-motion` everything
lands in its final state and the video does not play. Nothing there is
load-bearing: with JavaScript off the page renders complete in German, because
reveals only arm themselves once the script runs.

## Still open

- **The contact form does not submit.** Markup, labels, validation attributes
  and focus states are in place; `action`/`method` or a submit handler are the
  two things to add. See the `TODO(backend)` in `src/components/Contact.astro`.
- **Impressum and Datenschutz** are not written and the footer links go nowhere,
  as in the design. An Impressum is mandatory for a German commercial site
  (§5 DDG), and the privacy notice has to cover the contact form once it submits
  anywhere.
- **Placeholder contact details** — `kontakt@example.com`, `kapital@example.com`,
  `+49 351 000 00x`, and `name@example.com` for both people.
- **Hero resolution.** The bundle's hero is 1200 × 675, the size the design tool
  downscaled it to on drop. It is stretched full-bleed across the viewport and
  will look soft on a large display. Dennis Arians' portrait is 400 × 400 for a
  200 × 250 frame, so it has no headroom on a retina screen either. Both want
  their original files.

## Two things that were deliberately not copied from the prototype

**Fonts are self-hosted** rather than pulled from `fonts.googleapis.com`.
Hotlinking transmits every visitor's IP to Google, which a German court has held
to violate the GDPR (LG München I, 3 O 17493/20) — not a risk to carry for a
font file in front of this audience. `scripts/fetch-fonts.mjs` regenerates
`src/styles/fonts.css` and `public/fonts/`.

**The band video is re-encoded.** As delivered it was HEVC Main 10 with its moov
atom at the end of the file: it does not play in Firefox at all, Chrome only
decodes HEVC where the platform has a hardware decoder, and even where it does
play the whole 6 MB has to arrive before the first frame. What ships in
`public/media/` is VP9 and H.264 (faststart) plus a poster frame.
`scripts/encode-media.sh <source>` regenerates all three if the clip is ever
replaced — point it at the new master.
