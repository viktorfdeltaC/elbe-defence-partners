/**
 * Everything the page does at runtime. One module, no framework.
 *
 *   1. Reveals   — content, rules, markers and images land as you reach them.
 *   2. Count-up  — the four figures under the hero run up once.
 *   3. Rail      — scroll progress along the station band.
 *   4. Language  — the DE/EN switch rewrites the page from the dictionaries.
 *   5. Band      — the atmosphere clip: plays once, holds its last frame.
 *
 * Nothing here is load-bearing: with JavaScript off, the page renders complete
 * in German with everything already in its final visual state. Reveals only arm
 * themselves once this module runs, so a failure cannot leave content hidden.
 */
import { dictionaries, type Copy, type Lang } from '../content/copy';

const calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ── 1. Reveals ──────────────────────────────────────────────────────────────
 *
 * A single registry swept on scroll, resize, rAF and a slow interval, rather
 * than an IntersectionObserver: the observer does not fire for elements that
 * are already in view at load, which used to leave whole blocks invisible.
 * Each entry runs once and is dropped; the interval stops when the list empties.
 */

interface Pending {
  node: Element;
  run: (node: Element) => void;
}

const pending: Pending[] = [];
const watch = (nodes: Iterable<Element>, run: Pending['run']) => {
  for (const node of nodes) pending.push({ node, run });
};

const sweep = () => {
  const h = window.innerHeight || 800;
  for (let i = pending.length - 1; i >= 0; i--) {
    const r = pending[i].node.getBoundingClientRect();
    if (r.top < h * 0.94 && r.bottom > -40) {
      const [item] = pending.splice(i, 1);
      item.run(item.node);
    }
  }
};

const arm = (selector: string, cls = 'is-armed') => {
  const nodes = Array.from(document.querySelectorAll(selector));
  for (const n of nodes) n.classList.add(cls);
  return nodes;
};

// Text and grid blocks: fade and rise.
watch(arm('[data-reveal]'), (n) => n.classList.add('is-revealed'));

// Hairline rules: each grows downwards, staggered across the four.
for (const layer of document.querySelectorAll('[data-rules]')) {
  const rules = Array.from(layer.children);
  for (const r of rules) r.classList.add('is-armed');
  watch([layer], () => {
    rules.forEach((r, i) => setTimeout(() => r.classList.add('is-revealed'), i * 90));
  });
}

// Section markers: the bar wipes open from the left, then the file reference
// ticks once from ocker to the marker's opposite tone and back.
watch(arm('[data-marker]'), (node) => {
  node.classList.add('is-revealed');
  const ref = node.querySelector<HTMLElement>('.marker__ref');
  if (!ref || calm) return;
  const rgb = getComputedStyle(node).backgroundColor.match(/[\d.]+/g) ?? ['16', '16', '16'];
  const light = 0.299 * +rgb[0] + 0.587 * +rgb[1] + 0.114 * +rgb[2] > 140;
  setTimeout(() => {
    ref.style.transition = 'color .5s ease';
    ref.style.color = light ? '#101010' : '#fff';
  }, 420);
  setTimeout(() => {
    ref.style.color = '';
  }, 1000);
});

// Images and the video band: a mask wipes up from the bottom edge.
watch(arm('[data-imgreveal]'), (n) => n.classList.add('is-revealed'));

/* ── 2. Count-up ─────────────────────────────────────────────────────────── */

let lang: Lang = (document.documentElement.lang as Lang) || 'de';
const locale = () => (lang === 'de' ? 'de-DE' : 'en-US');

/**
 * Pulls the first number out of a formatted figure, keeping whatever sits
 * around it — so "739 Mrd. €" and "EUR 117.2bn" both animate, with prefix,
 * unit and spacing intact. The number may sit anywhere in the string, which the
 * design prototype could not handle: it required a leading digit, so no English
 * figure ever counted.
 */
const parseFigure = (raw: string) => {
  const m = /\d+(?:[.,]\d+)*/.exec(raw);
  if (!m) return null;

  const [token] = m;
  const prefix = raw.slice(0, m.index);
  const suffix = raw.slice(m.index + token.length);

  // A trailing separator followed by one or two digits is a decimal comma or
  // point ("117,2", "117.2"); anything else groups thousands ("82.500",
  // "82,500"), whichever convention the language uses.
  const decimal = /[.,](\d{1,2})$/.exec(token);
  const numeric = decimal
    ? token.slice(0, decimal.index).replace(/[.,]/g, '') + '.' + decimal[1]
    : token.replace(/[.,]/g, '');

  const value = parseFloat(numeric);
  if (!Number.isFinite(value)) return null;
  return { value, decimals: decimal ? decimal[1].length : 0, prefix, suffix };
};

const countUp = (el: HTMLElement) => {
  const parsed = parseFigure(el.textContent?.trim() ?? '');
  if (!parsed || calm) return;
  const { value, decimals, prefix, suffix } = parsed;
  const format = (n: number) =>
    prefix +
    n.toLocaleString(locale(), { minimumFractionDigits: decimals, maximumFractionDigits: decimals }) +
    suffix;

  // The start time comes from the first frame's own timestamp, not from a
  // performance.now() taken beforehand: requestAnimationFrame hands the
  // callback the timestamp of the frame it runs in, which can predate the call
  // that scheduled it. That made the first delta negative, and since the easing
  // is only clamped at the top the figure rendered far below zero for a frame —
  // "-999 Mrd. €" instead of "739 Mrd. €". k is clamped at both ends now.
  let t0: number | null = null;
  const step = (now: number) => {
    if (t0 === null) t0 = now;
    const k = Math.min(1, Math.max(0, (now - t0) / 750));
    el.textContent = format(value * (1 - Math.pow(1 - k, 3)));
    if (k < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
};

watch(document.querySelectorAll<HTMLElement>('[data-count]'), (n) => countUp(n as HTMLElement));

/* ── 3. Station rail ─────────────────────────────────────────────────────── */

const rail = document.querySelector<HTMLElement>('.rail');
const fill = document.querySelector<HTMLElement>('[data-rail-fill]');
const stops = Array.from(document.querySelectorAll<HTMLElement>('[data-rail-stop]'));

/**
 * The band's height drives two things that were hard-coded to 52px and broke as
 * soon as it wrapped on a phone: where the sticky section markers come to rest,
 * and how far an anchor jump has to stop short so the heading is not hidden
 * underneath. Both read --rail-h, which is measured here and kept current.
 */
const measureRail = () => {
  if (!rail) return;
  document.documentElement.style.setProperty('--rail-h', `${Math.round(rail.getBoundingClientRect().height)}px`);
};
measureRail();
if (rail && 'ResizeObserver' in window) new ResizeObserver(measureRail).observe(rail);

const onScroll = () => {
  sweep();
  measureRail();
  const max = document.documentElement.scrollHeight - window.innerHeight;
  const progress = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
  if (fill) fill.style.width = `${(progress * 100).toFixed(2)}%`;
  stops.forEach((el, i) => {
    const reached = progress >= i / Math.max(1, stops.length - 1) - 0.04;
    el.classList.toggle('is-reached', reached);
  });
};

// Capture, so scrolling inside any nested scroll container still counts.
window.addEventListener('scroll', onScroll, { passive: true, capture: true });
window.addEventListener('resize', onScroll, { passive: true });

const timer = window.setInterval(() => {
  onScroll();
  if (pending.length === 0) window.clearInterval(timer);
}, 250);

requestAnimationFrame(onScroll);
onScroll();

/* ── 4. Language switch ──────────────────────────────────────────────────────
 *
 * The page ships rendered in German; both dictionaries travel with this module.
 * Every translatable node carries `data-i18n` with a dot path into `Copy`, so
 * switching is one walk over the document. Choice is remembered per visitor.
 */

const STORAGE_KEY = 'edp:lang';

const resolve = (dict: Copy, path: string): unknown =>
  path.split('.').reduce<unknown>((acc, key) => {
    if (acc && typeof acc === 'object') return (acc as Record<string, unknown>)[key];
    return undefined;
  }, dict);

const applyLang = (next: Lang) => {
  const dict = dictionaries[next];
  lang = next;
  document.documentElement.lang = next;

  for (const el of document.querySelectorAll<HTMLElement>('[data-i18n]')) {
    const value = resolve(dict, el.dataset.i18n!);
    if (typeof value === 'string') el.textContent = value;
  }

  // A handful of nodes translate an attribute rather than their text.
  for (const el of document.querySelectorAll<HTMLElement>('[data-i18n-attr]')) {
    for (const pair of el.dataset.i18nAttr!.split(',')) {
      const [attr, path] = pair.split(':');
      const value = resolve(dict, path.trim());
      if (typeof value === 'string') el.setAttribute(attr.trim(), value);
    }
  }

  for (const btn of document.querySelectorAll<HTMLButtonElement>('[data-lang]')) {
    btn.setAttribute('aria-pressed', String(btn.dataset.lang === next));
  }

  onScroll();
};

for (const btn of document.querySelectorAll<HTMLButtonElement>('[data-lang]')) {
  btn.addEventListener('click', () => {
    const next = btn.dataset.lang as Lang;
    applyLang(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* private mode, blocked storage — the switch still works for this visit */
    }
  });
}

// A returning visitor keeps the language they chose. First visits stay on the
// rendered German — the switch is the reader's to make, not the browser's.
try {
  const stored = localStorage.getItem(STORAGE_KEY);
  if ((stored === 'en' || stored === 'de') && stored !== lang) applyLang(stored);
} catch {
  /* storage unavailable — stay with the rendered language */
}

/* ── 5. Atmosphere band ──────────────────────────────────────────────────────
 *
 * Plays once, when the reader reaches it, then holds its last frame. The hold
 * is a real <img>, not a paused <video>: a paused video invites the browser to
 * draw a play control over it, and the same image is the fallback for every
 * path where the clip does not run — autoplay refused by the browser or by a
 * per-site setting, a codec nothing can decode, or reduced motion.
 */

for (const video of document.querySelectorAll<HTMLVideoElement>('[data-bandvideo]')) {
  const still = video.parentElement?.querySelector<HTMLImageElement>('[data-bandstill]');

  const hush = () => {
    video.muted = true;
    video.defaultMuted = true;
    video.volume = 0;
  };
  hush();
  // Belt and braces: anything that could unmute it puts it straight back.
  for (const ev of ['play', 'playing', 'loadeddata', 'timeupdate', 'volumechange']) {
    video.addEventListener(ev, hush);
  }

  const showStill = () => {
    if (!still || !still.hidden) return;
    still.hidden = false;
    video.hidden = true;
  };

  const showVideo = () => {
    if (!still || still.hidden) return;
    still.hidden = true;
    video.hidden = false;
  };

  if (calm) {
    showStill();
    continue;
  }

  video.loop = false;

  const GESTURES = ['pointerdown', 'keydown', 'touchstart'] as const;
  let started = false;

  const attempt = () => {
    if (started || video.ended) return;
    // Safari will not play an element that is not on screen, so the clip has to
    // be visible before the attempt — and goes back under the still only if the
    // attempt is actually refused.
    const hadStill = !!still && !still.hidden;
    showVideo();
    void video.play().catch(() => {
      // A refusal is the only thing that puts the still up before the end.
      // Nothing here may act on a guess about how long loading "should" take:
      // an earlier version gave up after 2.5s and covered a clip that was
      // merely still buffering.
      if (hadStill) showStill();
    });
  };

  const stopOffering = () => {
    for (const ev of GESTURES) document.removeEventListener(ev, attempt);
  };

  const running = () => {
    if (started) return;
    started = true;
    stopOffering();
    showVideo();
  };

  video.addEventListener('playing', running);
  // `playing` does not fire in every browser for a muted, inline clip that
  // starts from a cold buffer; the clock moving is the reliable proof.
  video.addEventListener('timeupdate', () => {
    if (video.currentTime > 0) running();
  });

  video.addEventListener('ended', showStill);
  // A clip the browser cannot decode must not leave a black rectangle either.
  video.addEventListener('error', showStill);

  // Start buffering while the band is still two screens away, so it is ready to
  // run the moment it is reached rather than beginning to download then.
  const warm = () => {
    if (video.getBoundingClientRect().top > window.innerHeight * 2.5) return;
    video.preload = 'auto';
    window.removeEventListener('scroll', warm, true);
  };
  window.addEventListener('scroll', warm, { passive: true, capture: true });
  warm();

  // Start only once the band actually occupies the screen. The generic reveal
  // sweep, which this used to hang off, fires as soon as an element's top edge
  // clears the fold — and this band is half a screen tall. It began playing
  // while it was still a strip at the bottom of the window with a whole section
  // left to read above it; ten seconds later the reader arrives and finds it
  // holding its last frame. Behaving exactly as designed, and indistinguishable
  // from a clip that never ran.
  const READY = 0.6;

  const inView = () => {
    const r = video.getBoundingClientRect();
    const h = window.innerHeight || 800;
    const visible = Math.min(r.bottom, h) - Math.max(r.top, 0);
    // Measured against the band's height, or the window's where it is taller.
    return visible / Math.max(1, Math.min(r.height, h)) >= READY;
  };

  const maybeStart = () => {
    if (started || video.ended || !inView()) return;
    window.removeEventListener('scroll', maybeStart, true);
    window.removeEventListener('resize', maybeStart);

    // Raising preload is enough to start the fetch; play() does the rest.
    // Calling load() here as well aborts the play request that follows it
    // ("interrupted by a new load request") — which is how the band ended up
    // never playing at all once before.
    video.preload = 'auto';
    attempt();

    // Some browsers refuse the first attempt and allow a later one: Safari does
    // exactly that when a visitor has set Auto-Play to "Never" for the site.
    // Keep offering, on any real interaction, until it takes.
    for (const ev of GESTURES) document.addEventListener(ev, attempt, { passive: true });
  };

  window.addEventListener('scroll', maybeStart, { passive: true, capture: true });
  window.addEventListener('resize', maybeStart);
  maybeStart();
}
