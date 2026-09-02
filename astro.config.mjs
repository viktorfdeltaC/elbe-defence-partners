// @ts-check
import { defineConfig } from 'astro/config';

export default defineConfig({
  // Fully static output — the page has no server-side behaviour.
  output: 'static',
  build: { inlineStylesheets: 'auto' },
  image: {
    // The hero and portraits come out of the design bundle as WebP already;
    // the Dresden still is a 2048px PNG that must be re-encoded.
    responsiveStyles: false,
  },
});
