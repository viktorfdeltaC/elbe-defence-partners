/**
 * The Lagezentrum, English "Situation Room": longer analyses of geopolitics,
 * conflicts and procurement, at /lagezentrum/ and /en/lagezentrum/.
 *
 * Built, but not yet public. Until LAGEZENTRUM_LIVE is true the pages exist in
 * `npm run dev` only: in a production build the routes return no paths, the
 * nav and footer links are left out, and the sitemap does not list them.
 *
 * Going live: at least three real posts, then flip LAGEZENTRUM_LIVE. Placeholder
 * posts stay out of production either way.
 */
import { getCollection, type CollectionEntry } from 'astro:content';
import { pathIn, type Lang } from './copy';

export const LAGEZENTRUM_LIVE = false;

export const showLagezentrum = LAGEZENTRUM_LIVE || import.meta.env.DEV;

export type Post = CollectionEntry<'lagezentrum'>;

/** "de/2026-09-ostflanke" → "2026-09-ostflanke". The same in both languages. */
export const slugOf = (post: Post) => post.id.slice(post.id.indexOf('/') + 1);

export const postPath = (lang: Lang, slug?: string) => pathIn(lang, slug ? `/lagezentrum/${slug}/` : '/lagezentrum/');

/** Newest first. Empty while the Lagezentrum is hidden; no placeholders outside `npm run dev`. */
export async function postsIn(lang: Lang): Promise<Post[]> {
  if (!showLagezentrum) return [];
  const all = await getCollection('lagezentrum', (post) => import.meta.env.DEV || !post.data.placeholder);

  // A post goes online in both languages or not at all: a German analysis
  // without its English twin would leave /en/ with a gap and a broken
  // language switch.
  const slugs = (l: Lang) => new Set(all.filter((p) => p.id.startsWith(`${l}/`)).map(slugOf));
  const de = slugs('de');
  const en = slugs('en');
  const alone = [
    ...[...de].filter((slug) => !en.has(slug)).map((slug) => `de/${slug}`),
    ...[...en].filter((slug) => !de.has(slug)).map((slug) => `en/${slug}`),
  ];
  if (alone.length) {
    throw new Error(`Lagezentrum: these posts have no twin in the other language: ${alone.join(', ')}`);
  }

  return all
    .filter((post) => post.id.startsWith(`${lang}/`))
    .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}

/** Roughly, at 220 words a minute; at least one. */
export const readingMinutes = (post: Post) =>
  Math.max(1, Math.round((post.body ?? '').split(/\s+/).filter(Boolean).length / 220));

export const formatDate = (lang: Lang, date: Date) =>
  new Intl.DateTimeFormat(lang === 'en' ? 'en-GB' : 'de-DE', { day: 'numeric', month: 'long', year: 'numeric' }).format(date);
