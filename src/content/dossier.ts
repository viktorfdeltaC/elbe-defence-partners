/**
 * The dossier download: a button in the hero opens a dialog, the visitor gives
 * an email address and a company, and the PDF downloads straight away.
 *
 * The frontend is finished; the backend is not. It will be built in the
 * Laravel backend, which also holds the two PDFs. Until then:
 *
 *   - the button and the dialog render in `npm run dev` only, so the flow can
 *     be tried on localhost while sanktum.de stays as it is;
 *   - with no endpoint set, src/scripts/dossier-mock.ts answers in its place
 *     and hands out a placeholder PDF. That module is never part of a
 *     production build.
 *
 * Going live: set DOSSIER_ENDPOINT, flip DOSSIER_LIVE, and add a section on
 * the dossier to the privacy policy (src/components/legal/Datenschutz.astro)
 * — it currently says the server stores nothing from any form, which stops
 * being true the moment the requests below are written to a database.
 */

/** True once the backend answers. Until then the dossier exists on localhost only. */
export const DOSSIER_LIVE = false;

export const showDossier = DOSSIER_LIVE || import.meta.env.DEV;

/**
 * TODO(backend): the Laravel route that answers the request, e.g.
 * 'https://backend.sanktum.de/api/dossier'. Empty: the local placeholder runs.
 *
 * ── Request ──────────────────────────────────────────────────────────────────
 * POST, multipart/form-data, header `Accept: application/json`:
 *
 *   email     required, max 254, one plain address
 *   company   required, max 150
 *   lang      'de' | 'en' — the page the visitor was on
 *   website   honeypot, hidden from people. Filled in: it was a bot. Answer as
 *             if successful and store nothing.
 *
 * ── What the backend does ────────────────────────────────────────────────────
 * TODO(backend): store every valid request in the database — email, company,
 * lang, time of the request. This is the list of who has the dossier.
 *
 * TODO(backend): pick the PDF by `lang` and return a URL to it. The PDF must
 * not be reachable at a fixed public address, or the form can be skipped: a
 * signed, expiring route (Laravel's URL::temporarySignedRoute) does this.
 * Deliver it with `Content-Disposition: attachment`, so it downloads rather than
 * opening in a tab — across origins the browser ignores the link's `download`
 * attribute, and only this header decides.
 *
 * ── Response ─────────────────────────────────────────────────────────────────
 *   200  { "url": "https://…" }                  the download starts
 *   422  Laravel's own validation response —    the named fields are marked
 *        { "errors": { "email": [...] } }
 *   429  throttle middleware                     "too many requests" message
 *   else                                         "failed" message with the address
 *
 * If the backend runs on another origin than sanktum.de it must allow
 * https://sanktum.de via CORS, or the browser does not let the page read the
 * answer. Laravel exempts routes in routes/api.php from CSRF, which is right
 * here: this form has no session.
 */
export const DOSSIER_ENDPOINT = '';
