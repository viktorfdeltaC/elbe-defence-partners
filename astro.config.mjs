// @ts-check
import { defineConfig, envField } from 'astro/config';
import node from '@astrojs/node';

export default defineConfig({
  /**
   * The address the site is served under, from the company's own server
   * (STRATO, run with Coolify). Link previews need absolute URLs — a scraper has
   * no page to resolve a relative path against — so this is the one place that
   * knows it.
   */
  site: 'https://sanktum.de',

  /**
   * Static, with one exception: /api/kontakt, the contact form's endpoint,
   * opts out of prerendering. Every page is still rendered to HTML at build
   * time; the Node server delivers those files and runs that one route.
   */
  output: 'static',
  adapter: node({ mode: 'standalone' }),

  security: {
    /**
     * Hosts the server may believe in the Host and X-Forwarded-* headers.
     * Without this list Astro ignores them and takes every request to be for
     * "localhost" — and its origin check (on by default) then turns away every
     * form sent without JavaScript, because the browser's Origin says
     * https://sanktum.de. localhost is here for `npm run preview`.
     */
    allowedDomains: [
      { protocol: 'https', hostname: 'sanktum.de' },
      { protocol: 'https', hostname: 'www.sanktum.de' },
      { protocol: 'http', hostname: 'localhost' },
    ],
  },

  env: {
    /**
     * The contact form's mail server. Secrets are read from the environment
     * when the server starts — set them in Coolify as runtime variables — and
     * never written into the build. Without them the form answers 503 in
     * production and prints its mails to the console under `npm run dev`.
     * See .env.example.
     */
    schema: {
      SMTP_HOST: envField.string({ context: 'server', access: 'secret', optional: true }),
      SMTP_PORT: envField.number({ context: 'server', access: 'secret', default: 465 }),
      SMTP_USER: envField.string({ context: 'server', access: 'secret', optional: true }),
      SMTP_PASS: envField.string({ context: 'server', access: 'secret', optional: true }),
      /** Sender and recipient; both default to info@sanktum.de. */
      SMTP_FROM: envField.string({ context: 'server', access: 'secret', optional: true }),
      CONTACT_TO: envField.string({ context: 'server', access: 'secret', optional: true }),
    },
  },

  build: { inlineStylesheets: 'auto' },
  image: {
    // The hero and portraits come out of the design bundle as WebP already;
    // the Dresden still is a 2048px WebP that is re-encoded per width.
    responsiveStyles: false,
  },
});
