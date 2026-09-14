import type { APIRoute } from 'astro';

/**
 * Generated for the same reason as the sitemap: the Sitemap directive has to be
 * an absolute URL, and `site` in astro.config.mjs is the one place that knows
 * the host. This replaces the file that used to sit in public/.
 */
export const GET: APIRoute = ({ site }) => {
  const body = `# The page is a shareable draft: placeholder contact details, no Impressum yet.
# Crawlers are kept out until the copy is final — an indexed page outlives the
# version that was indexed.
#
# To open it up, delete the two Disallow lines below and set INDEXABLE = true in
# src/layouts/Base.astro. Both have to change; one without the other either
# hides an indexable page or offers a page that says noindex.
User-agent: *
Disallow: /

Sitemap: ${new URL('/sitemap.xml', site).href}
`;

  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
