#!/usr/bin/env bash
#
# Re-encodes the atmosphere band from the design bundle into what the page
# ships. Run it again if the clip is ever replaced.
#
# The clip as generated for the design is HEVC Main 10 with its moov atom at the
# end of the file. That combination is unusable on the web: HEVC Main 10 does
# not play in Firefox at all and only decodes in Chrome where the platform has a
# hardware decoder, and moov-last means a browser must download the whole file
# before it can show the first frame.
#
# Output is one H.264 mp4 and a poster. H.264 is the only video codec every
# browser has supported for over a decade, so there is nothing to negotiate and
# nothing to fall back to — a second format only adds a way for source selection
# to pick wrong.
#
#   ./scripts/encode-media.sh path/to/master.mp4
#
set -euo pipefail

# Pass the master clip as the first argument; it is not kept in this repo.
SRC="${1:?usage: $0 <source-video>}"
OUT="public/media"
WIDTH=1920

command -v ffmpeg >/dev/null || { echo "ffmpeg not found" >&2; exit 1; }
[ -f "$SRC" ] || { echo "source not found: $SRC" >&2; exit 1; }

mkdir -p "$OUT"

# -pix_fmt yuv420p is not optional: the source is 10-bit, and an encode that
# keeps that depth is rejected by most browsers. +faststart puts the moov atom
# first so playback can start on the first bytes.
echo "→ ${OUT}/band.mp4 (H.264 High, 8-bit, faststart)"
ffmpeg -v error -y -i "$SRC" -vf "scale=${WIDTH}:-2" \
  -c:v libx264 -profile:v high -pix_fmt yuv420p -crf 24 -preset slow -g 48 \
  -movflags +faststart -an \
  "${OUT}/band.mp4"

# Shown until the first frame is painted, and left standing if a browser refuses
# to play at all — so the band is never a black rectangle.
echo "→ ${OUT}/band-poster.webp (first frame)"
ffmpeg -v error -y -i "$SRC" -vf "scale=${WIDTH}:-2" -frames:v 1 -q:v 80 \
  "${OUT}/band-poster.webp"

ls -lh "${OUT}"
