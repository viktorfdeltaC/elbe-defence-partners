# Sanktum Defence Partners — landing page

Bilingual (DE/EN) one-pager, with its imprint, privacy policy and a working
contact form. Astro, no client framework. Every page is prerendered; one route,
the form's `/api/kontakt`, runs on a small Node server.

Built from the `Richtung-D-Grid.dc.html` design handoff — the design files, the
session transcript and the original media are kept outside this repository;
this is the implementation only.

```bash
npm install
npm run dev        # http://localhost:4321 — the form prints its mails to the console
npm run build      # → dist/client (pages, assets) + dist/server (Node entry)
npm run preview    # run the built server
npm run check      # astro check (types + templates)
```

The build is no longer a folder of static files: `node dist/server/entry.mjs`
serves the pages and answers the form. See **Deploy** below.

## Layout

```
src/
  content/copy.ts       All German and English copy, one typed shape (`Copy`)
  content/company.ts    The company behind the brand: legal texts, mail footer
  content/mail.ts       The contact form's two mails (server only)
  pages/index.astro     The German route; pages/en/index.astro is its twin
  pages/                Also /impressum, /datenschutz, /kontakt/…, sitemap, robots
  pages/api/kontakt.ts  The contact form's endpoint — the one server route
  server/               Its rules: validation, rate limits, sending
  components/Page.astro The page both routes render
  components/           One per section, in page order
  components/legal/     Imprint and privacy policy
  layouts/Base.astro    <head>, fonts, metadata, hreflang
  layouts/Document.astro  Frame of every page that is not the one-pager
  scripts/page.ts       Reveals, count-up, station rail
  scripts/legal.ts      Imprint and privacy policy as dialogs on the one-pager
  scripts/contact.ts    The form in place: checks, fetch, answer
  styles/global.css     Design tokens, the shared section chrome, legal text
  styles/fonts.css      Generated — see scripts/fetch-fonts.mjs
  assets/               Images (build-optimised by Astro)
public/
  fonts/                Self-hosted woff2
  media/                Atmosphere band video + poster
scripts/
  fetch-fonts.mjs       Regenerate the self-hosted fonts
  encode-media.sh       Re-encode the band video for the web
  measure-wordmark.mjs  Step 1 of `npm run wordmark` — measure the logo layout
  build-wordmark.py     Step 2 — outline it (writes src/components/wordmark.svg)
brand/
  sanktum-logo-weiss.svg  The logo as delivered. Source of truth, not shipped.
```

## The wordmark

`src/components/wordmark.svg` is **generated** — do not edit it by hand. The
logo was delivered as live `<text>` in Archivo, which would have made the
company's own mark depend on a webfont loading; without Archivo it would fall
back to whatever sans-serif was at hand, stretched to the forced `textLength`.
It is outlined instead.

The layout is not recomputed from font metrics, because the browser applies the
font's kerning and then `textLength`/`lengthAdjust` redistributes everything to
hit the forced width — reproducing that by hand put the letters visibly off. So
`measure-wordmark.mjs` asks a real browser where every glyph sits and
`build-wordmark.py` supplies only the shapes. Verified against the delivered
file by difference blend: identical ink bounding box, indistinguishable at any
size the page uses.

```bash
npm run wordmark   # after any change to brand/sanktum-logo-weiss.svg
```

The lettering is `currentColor`, so one file serves the black bar and any light
ground. The ocker rule is part of the mark and reads `var(--ocker)`, so it
cannot drift away from the accent the rest of the page uses — the delivered file
had `#d9a441`, the page uses `#c9873f`.

## The design in one paragraph

Two grounds and no intermediate tones: paper `#f2f3f4` and near-black `#111213`,
alternating hard from section to section. Ocker `#c9873f` is a code rather than
decoration — it marks file references (A-01, B-01.2) and lead figures, nothing
else, and darkens to `#a4611f` on light grounds so the contrast holds. Archivo
carries the headlines (900 in the hero, 600 in the sections) and, as Archivo
Narrow, the figures; Manrope is body text; IBM Plex Mono is reserved for
metadata. Hairline rules run down both gutter edges of every section with tick
marks on the 17 % and 55 % column lines, and the content sits on those same
lines. All of it is stated at the top of `src/styles/global.css`.

## Changing things

**Copy.** Everything on the page is in `src/content/copy.ts`. `de` and `en`
share the `Copy` interface, so a missing translation is a type error rather than
a blank on the page. The exceptions are the legal texts and the contact form's
mails, below.

**Brand name.** `BRAND` in the same file — it is a placeholder by design.

**Legal texts.** `src/components/legal/` holds the imprint (German only) and the
privacy policy (German and English, as two blocks switched by `<html lang>`) —
the one kind of copy that does not live in `copy.ts`. Sanktum Defence Partners
is a brand of realxtrade GmbH, so the texts name the company, and every fact
about it comes from `src/content/company.ts`. The privacy policy describes what
the site actually does, checked against the code rather than taken from a
template: anything that processes data — the contact form, a booking, another
host — ships in the same deploy as its section there. Both texts are real pages
(`/impressum`, `/datenschutz`) and, on the one-pager, native dialogs: a plain
click on a link with `data-legal-open` opens the dialog, a click with a
modifier key still opens the page.

**Contact form.** The form posts to `/api/kontakt`, which checks the fields
(`src/server/enquiry.ts` — the browser runs the same rules first), limits how
often it can be used (`src/server/limits.ts`, in memory, which holds because the
site is one process), and sends two plain-text mails through the mailbox's own
SMTP server (`src/server/mailer.ts`): the enquiry to info@sanktum.de with
Reply-To set to the sender, and a fixed confirmation to the sender in the
language they read the site in. The confirmation carries nothing from the form
— the address is unverified, and anything typed into it would travel under our
domain to whoever that address belongs to. Its texts are in `src/content/mail.ts`.

Without JavaScript the form still works: the server answers with
`/kontakt/danke/` or `/kontakt/fehler/`. `src/scripts/contact.ts` keeps the
visitor on the page instead. Form posts from other sites are refused by Astro's
origin check, which relies on `security.allowedDomains` in `astro.config.mjs` to
recognise the real host behind the proxy. A new domain goes there too, or every
form sent without JavaScript fails with 403.

**Language.** Two routes, both rendered at build time: `/` is German, `/en/` is
English (`i18n` in `astro.config.mjs`, `prefixDefaultLocale: false`, so the
German page stays at the root it has always had). Every section reads its own
language from the URL with `dictionaries[langFrom(Astro.currentLocale)]`, and
`Base.astro` emits the matching `<html lang>`, canonical and `hreflang` set. The
DE/EN control in the hero is two links, not a script.

The prototype instead swapped the text in the browser from both dictionaries,
which meant one URL, one set of metadata, and an English version no crawler
could ever see.

**Images.** Drop a replacement into `src/assets/` and update the import. The
portraits are framed by `CroppedImage`, which reproduces the crop the design
tool stored in `.image-slots.state.json` (`{ s, x, y }`) from the intrinsic size
and the frame ratio — so re-cropping means changing those numbers, not the file.

**Motion.** `src/scripts/page.ts`. Under `prefers-reduced-motion` everything
lands in its final state and the video does not play. Nothing there is
load-bearing: with JavaScript off the page renders complete in German, because
reveals only arm themselves once the script runs.

## Deploy

Coolify, on the company's own server at STRATO, from the `Dockerfile`: a Node 24
image that runs `dist/server/entry.mjs` on port 4321, with a healthcheck.

In Coolify:

- **Build pack** Dockerfile, **exposed port** 4321.
- **Domains** `https://sanktum.de` and `https://www.sanktum.de`, one redirecting
  to the other. Both are in `security.allowedDomains`; `site` in
  `astro.config.mjs` is `https://sanktum.de`.
- **Environment**, as runtime variables — never build variables:
  `SMTP_HOST=smtp.gmail.com`, `SMTP_PORT=465`, `SMTP_USER=info@sanktum.de`, and
  `SMTP_PASS`, an app password of that account (Google requires 2-Step
  Verification on it). `SMTP_FROM` and `CONTACT_TO` are optional; see
  `.env.example`. Without the three required ones the form answers 503 and
  gives the address instead — it never pretends to have sent.

Before going live, send one test enquiry and check that it reaches
info@sanktum.de and that the confirmation reaches the sender's inbox, not the
spam folder. For that sanktum.de wants DKIM (Google Admin → Gmail → Authenticate
email) beside the MX and SPF records that exist. The DMARC record sends its
reports to info@sanctum.de — with a c — and should say sanktum.

## Still open

- **Impressum and Datenschutz** are written for the site as it is: on the
  company's own server at STRATO, run with Coolify, with the contact form, no
  booking. Both want a lawyer's review before `INDEXABLE` goes to true.
  `src/content/company.ts` marks what still has to be made true or confirmed:
  the chamber named for the § 34c permit, and the seven-day log retention on the
  server.
- **The copy on elbe-defence-partners.vercel.app** is served by Vercel. Once
  sanktum.de runs on Coolify, that project should go: the privacy policy it
  serves describes the STRATO server, not Vercel.
- **Placeholder contact detail** — the phone number in the contact section
  (`+49 351 000 000`).
- **Hero resolution.** The bundle's hero is 1200 × 675, the size the design tool
  downscaled it to on drop. It is stretched full-bleed across the viewport and
  will look soft on a large display. Dennis Arians' portrait is 400 × 400 for a
  200 × 250 frame, so it has no headroom on a retina screen either. Both want
  their original files.

## Two things that were deliberately not copied from the prototype

**Fonts are self-hosted** rather than pulled from `fonts.googleapis.com`.
Hotlinking transmits every visitor's IP to Google, which a German court has held
to violate the GDPR (LG München I, 3 O 17493/20) — not a risk to carry for a
font file in front of this audience. `scripts/fetch-fonts.mjs` regenerates
`src/styles/fonts.css` and `public/fonts/`.

**The band video is re-encoded.** As delivered it was HEVC Main 10 with its moov
atom at the end of the file: it does not play in Firefox at all, Chrome only
decodes HEVC where the platform has a hardware decoder, and even where it does
play the whole 6 MB has to arrive before the first frame. What ships in
`public/media/` is VP9 and H.264 (faststart) plus a poster frame.
`scripts/encode-media.sh <source>` regenerates all three if the clip is ever
replaced — point it at the new master.
