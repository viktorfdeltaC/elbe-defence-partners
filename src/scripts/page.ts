/**
 * Everything the page does at runtime. One module, no framework.
 *
 *   1. Reveals   — content, rules, markers and images land as you reach them.
 *   2. Count-up  — the four figures under the hero run up once.
 *   3. Rail      — scroll progress along the station band.
 *   4. Language  — the DE/EN switch rewrites the page from the dictionaries.
 *   5. Video     — the atmosphere band, forced silent.
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

const fill = document.querySelector<HTMLElement>('[data-rail-fill]');
const stops = Array.from(document.querySelectorAll<HTMLElement>('[data-rail-stop]'));

const onScroll = () => {
  sweep();
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

/* ── 5. Video ────────────────────────────────────────────────────────────── */

for (const video of document.querySelectorAll<HTMLVideoElement>('[data-loopvideo]')) {
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

  if (calm) {
    video.pause();
    video.removeAttribute('autoplay');
    continue;
  }

  const play = () => void video.play().catch(() => {});
  video.loop = true;
  play();
  video.addEventListener('loadeddata', play, { once: true });
}
