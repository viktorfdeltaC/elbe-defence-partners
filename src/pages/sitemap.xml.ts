import type { APIRoute } from 'astro';
import { pathIn } from '../content/copy';

/**
 * Generated rather than kept as a file in public/: the absolute addresses come
 * from `site` in astro.config.mjs, which means a move to the firm's own domain
 * changes one line and the sitemap follows. A static copy would keep pointing
 * at the old host until someone noticed.
 *
 * Every page is listed in both languages, and each entry names both as
 * alternates — the same pairs the pages carry in their <head> — so a crawler
 * that finds one route learns about the other from here as well. The contact
 * form's answer pages are left out: they are reached by sending the form, and
 * they say noindex.
 */
const PAGES = ['/', '/impressum/', '/datenschutz/'];

export const GET: APIRoute = ({ site }) => {
  const url = (path: string) => new URL(path, site).href;

  const entries = PAGES.flatMap((page) => {
    const de = url(pathIn('de', page));
    const en = url(pathIn('en', page));
    const alternates = [
      `    <xhtml:link rel="alternate" hreflang="de" href="${de}" />`,
      `    <xhtml:link rel="alternate" hreflang="en" href="${en}" />`,
      `    <xhtml:link rel="alternate" hreflang="x-default" href="${de}" />`,
    ].join('\n');
    return [de, en].map((loc) => `  <url>\n    <loc>${loc}</loc>\n${alternates}\n  </url>`);
  });

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${entries.join('\n')}
</urlset>
`;

  return new Response(body, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
