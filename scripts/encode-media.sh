#!/usr/bin/env bash
#
# Re-encodes the atmosphere band from the design bundle into web-deliverable
# formats. Run it again if the clip is ever replaced.
#
# Why this exists: the clip as generated for the design is HEVC Main 10 in a
# container whose moov atom sits at the END of the file. That combination is
# unusable on the web —
#
#   * HEVC Main 10 does not play in Firefox at all, and Chrome only decodes HEVC
#     where the platform provides a hardware decoder — 10-bit generally not. The
#     band would simply be an empty dark rectangle for most visitors.
#   * moov-last means a browser must download the entire file before it can show
#     the first frame.
#
# Output: VP9/WebM first (smaller, taken by every modern browser), H.264 High /
# yuv420p with +faststart as the universal fallback, and a WebP poster from the
# first frame. Audio is dropped outright — the band is silent by design.
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

# The mp4 is the source the page offers first, and the one nearly every reader
# gets: H.264 is the only video codec every browser has supported for over a
# decade. The WebM is half the size and stays as a fallback, but it is not what
# the page leads with — see the comment in src/components/VideoBand.astro.
#
# -profile:v 0 with an explicit 8-bit pixel format is not optional. The source
# clips are 10-bit, and libvpx-vp9 keeps that depth unless told otherwise —
# which produces VP9 Profile 2, a format most browsers cannot decode. Worse,
# they accept the source and only then fail, so they never fall through to the
# mp4: the band goes dead everywhere.
echo "→ ${OUT}/band.webm (VP9, 8-bit)"
ffmpeg -v error -y -i "$SRC" -vf "scale=${WIDTH}:-2,format=yuv420p" \
  -c:v libvpx-vp9 -profile:v 0 -pix_fmt yuv420p -crf 36 -b:v 0 -row-mt 1 \
  -deadline good -cpu-used 2 -an \
  "${OUT}/band.webm"

echo "→ ${OUT}/band.mp4 (H.264, faststart)"
ffmpeg -v error -y -i "$SRC" -vf "scale=${WIDTH}:-2" \
  -c:v libx264 -profile:v high -pix_fmt yuv420p -crf 24 -preset slow -g 48 \
  -movflags +faststart -an \
  "${OUT}/band.mp4"

echo "→ ${OUT}/band-poster.webp (first frame)"
ffmpeg -v error -y -i "$SRC" -vf "scale=${WIDTH}:-2" -frames:v 1 -q:v 80 \
  "${OUT}/band-poster.webp"

# The band plays once and then holds its last frame. This is that frame as a
# still: it stands in whenever the clip does not play at all — autoplay refused
# by the browser, or prefers-reduced-motion — so the band is never an empty
# rectangle behind a play button.
echo "→ ${OUT}/band-last.webp (final frame)"
ffmpeg -v error -y -sseof -0.1 -i "${OUT}/band.mp4" -vf "scale=${WIDTH}:-2" -frames:v 1 -q:v 82 \
  "${OUT}/band-last.webp"

ls -lh "${OUT}"
