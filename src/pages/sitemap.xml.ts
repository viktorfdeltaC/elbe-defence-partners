import type { APIRoute } from 'astro';

/**
 * Two URLs, so this is generated rather than kept as a file in public/: the
 * absolute addresses come from `site` in astro.config.mjs, which means a move
 * to the firm's own domain changes one line and the sitemap follows. A static
 * copy would keep pointing at the old host until someone noticed.
 *
 * Each entry lists both languages as alternates, the same set the pages
 * themselves carry in their <head> — a crawler that finds one route learns
 * about the other from here as well.
 */
export const GET: APIRoute = ({ site }) => {
  const de = new URL('/', site).href;
  const en = new URL('/en/', site).href;

  const alternates = [
    `    <xhtml:link rel="alternate" hreflang="de" href="${de}" />`,
    `    <xhtml:link rel="alternate" hreflang="en" href="${en}" />`,
    `    <xhtml:link rel="alternate" hreflang="x-default" href="${de}" />`,
  ].join('\n');

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
  <url>
    <loc>${de}</loc>
${alternates}
  </url>
  <url>
    <loc>${en}</loc>
${alternates}
  </url>
</urlset>
`;

  return new Response(body, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
