// @ts-check
import { defineConfig } from 'astro/config';

export default defineConfig({
  /**
   * The address the page is shared under. Link previews need absolute URLs — a
   * scraper has no page to resolve a relative path against — so this is the one
   * place that knows it.
   *
   * It is still the old project name because that is the alias that has been
   * sent out, and it still resolves. Change it here when a domain of your own,
   * or the shorter sanktum-…vercel.app, is in place; nothing else refers to it.
   */
  site: 'https://elbe-defence-partners.vercel.app',

  // Fully static output — the page has no server-side behaviour.
  output: 'static',
  build: { inlineStylesheets: 'auto' },
  image: {
    // The hero and portraits come out of the design bundle as WebP already;
    // the Dresden still is a 2048px PNG that must be re-encoded.
    responsiveStyles: false,
  },
});
