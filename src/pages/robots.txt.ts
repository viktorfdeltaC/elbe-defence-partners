import type { APIRoute } from 'astro';

/**
 * Generated for the same reason as the sitemap: the Sitemap directive has to be
 * an absolute URL, and `site` in astro.config.mjs is the one place that knows
 * the host. This replaces the file that used to sit in public/.
 */
export const GET: APIRoute = ({ site }) => {
  const body = `# Open to crawlers. The contact form's answer pages are not listed in the
# sitemap and carry their own noindex, so they stay out of results either way.
#
# To close the site again, put \`Disallow: /\` here in place of the Allow line
# and set INDEXABLE = false in src/layouts/Base.astro. Both have to change; one
# without the other either hides an indexable page or offers one that says
# noindex.
User-agent: *
Allow: /

Sitemap: ${new URL('/sitemap.xml', site).href}
`;

  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
