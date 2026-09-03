#!/usr/bin/env python3
"""
Turns the supplied wordmark SVG into outlines.

The logo as delivered is live <text> in Archivo, which makes the company's own
mark depend on a webfont being present at render time: no Archivo, no logo — it
falls back to whatever sans-serif is at hand, stretched to the forced
textLength. Outlining removes the dependency, renders identically in every
engine, and drops the 7.7 KB of C2PA provenance metadata that was 93% of the
file.

The layout is not recomputed here. Laying the runs out from raw advance widths
put the letters slightly off, because the browser applies the font's kerning and
then textLength/lengthAdjust redistributes everything to hit the forced width.
So scripts/measure-wordmark.mjs asks a real browser where every glyph sits, and
this script only supplies the shapes:

  SANKTUM            Archivo 800, 100px, baseline 106, textLength 500 with
                     lengthAdjust="spacingAndGlyphs" — glyphs are squeezed on
                     x, so each one carries a scale factor.
  DEFENCE PARTNERS   Archivo 600, 22px, baseline 141, tracking 4, textLength 392
                     with lengthAdjust="spacing" — shapes untouched, the gaps
                     take up the slack, so scale is 1.
  rule               ocker bar, x=22 y=130, 90x6

Run: node scripts/measure-wordmark.mjs && python3 scripts/build-wordmark.py
Writes: src/components/wordmark.svg (body only) and prints the tight viewBox.
"""

import json

from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.pens.boundsPen import BoundsPen
from fontTools.misc.transform import Transform

FONT = 'public/fonts/archivo-latin.woff2'
LAYOUT = 'scripts/.wordmark-layout.json'
OUT = 'src/components/wordmark.svg'
RULE = (22, 130, 90, 6)  # x, y, w, h

data = json.load(open(LAYOUT))
runs = {r['id']: r for r in data['runs']}

_cache = {}


def instance(weight):
    if weight not in _cache:
        _cache[weight] = instantiateVariableFont(
            TTFont(FONT), {'wght': weight}, inplace=False, updateFontNames=False
        )
    return _cache[weight]


paths = []
bounds = [RULE[0], RULE[1], RULE[0] + RULE[2], RULE[1] + RULE[3]]  # xmin ymin xmax ymax


def grow(b):
    if b is None:
        return
    bounds[0] = min(bounds[0], b[0])
    bounds[1] = min(bounds[1], b[1])
    bounds[2] = max(bounds[2], b[2])
    bounds[3] = max(bounds[3], b[3])


for rid, measured in data['layout'].items():
    run = runs[rid]
    font = instance(run['weight'])
    upem = font['head'].unitsPerEm
    glyphs = font.getGlyphSet()
    cmap = font.getBestCmap()
    scale = run['size'] / upem
    squeeze = run['adjust'] == 'spacingAndGlyphs'

    paths.append(f"    <!-- {run['text']} — Archivo {run['weight']}, {run['size']}px, outlined -->")

    for c in measured['chars']:
        name = cmap[ord(c['ch'])]
        glyph = glyphs[name]
        if not glyph.width:  # the space has no outline
            continue

        # spacingAndGlyphs squeezes the glyph itself; the measured advance over
        # the natural one is exactly that factor. spacing leaves shapes alone,
        # and its measured advance includes the tracking, so it must not be used
        # as a scale.
        xs = (c['advance'] / (glyph.width * scale)) if squeeze else 1.0
        t = Transform(scale * xs, 0, 0, -scale, c['x'], run['baseline'])

        pen = SVGPathPen(glyphs, ntos=lambda v: f'{v:.2f}')
        glyph.draw(TransformPen(pen, t))
        d = pen.getCommands()
        if not d:
            continue
        paths.append(f'    <path d="{d}"/>')

        bp = BoundsPen(glyphs)
        glyph.draw(TransformPen(bp, t))
        grow(bp.bounds)

body = '\n'.join(
    [
        '<!-- The ocker rule is part of the mark. It reads var(--ocker) so it stays',
        '     identical to the accent the rest of the page uses. -->',
        f'  <rect x="{RULE[0]}" y="{RULE[1]}" width="{RULE[2]}" height="{RULE[3]}"'
        ' fill="var(--ocker, #d9a441)"/>',
        '  <g fill="currentColor">',
    ]
    + paths
    + ['  </g>']
)

open(OUT, 'w').write(body + '\n')

vb = (bounds[0], bounds[1], bounds[2] - bounds[0], bounds[3] - bounds[1])
print(f'{OUT}: {len(body)} bytes')
print(f'tight viewBox="{vb[0]:.2f} {vb[1]:.2f} {vb[2]:.2f} {vb[3]:.2f}"'
      f'  (Verhältnis {vb[2] / vb[3]:.3f} : 1)')
