/**
 * POST /api/kontakt — the contact form's endpoint, and the one route on the
 * site that is rendered on request rather than at build time.
 *
 * It answers in two ways. The form sent without JavaScript gets a 303 to a
 * page, /kontakt/danke/ or /kontakt/fehler/. The enhanced form asks for JSON
 * (Accept: application/json) and gets a status code and an outcome to show in
 * place of the form.
 *
 * Form posts from other sites never reach this code: Astro's origin check
 * turns them away (security.checkOrigin, on by default — it needs the
 * allowedDomains in astro.config.mjs behind the proxy). The enhanced form sends
 * FormData for that reason; a JSON body would not be checked.
 *
 * The order is deliberate: rate, size, honeypot, validation, configuration —
 * then the team's mail, whose success is the answer the visitor gets — then
 * the confirmation, which may fail without the visitor being told.
 */
import type { APIRoute } from 'astro';
import { pathIn, type Lang } from '../../content/copy';
import { parseEnquiry, type Field } from '../../server/enquiry';
import { allConfirmations, perIp, perRecipient } from '../../server/limits';
import { mailConfigured, sendConfirmation, sendToTeam } from '../../server/mailer';

export const prerender = false;

/** Far more than four fields need. A larger body is not an enquiry. */
const MAX_BODY = 16 * 1024;

type Outcome = 'sent' | 'invalid' | 'rate' | 'unavailable' | 'failed';

export const POST: APIRoute = async ({ request, clientAddress, redirect }) => {
  const wantsJson = (request.headers.get('accept') ?? '').includes('application/json');

  // The answer page comes in the visitor's language. Until the form is read,
  // the page it was sent from is the best guess; after that, its lang field.
  let lang = langOfReferer(request);
  const answer = (status: number, outcome: Outcome, fields?: Field[]) =>
    wantsJson
      ? Response.json({ ok: outcome === 'sent', outcome, fields }, { status })
      : redirect(pathIn(lang, outcome === 'sent' ? '/kontakt/danke/' : '/kontakt/fehler/'), 303);

  if (!perIp.take(clientIp(request, clientAddress))) return answer(429, 'rate');

  const body = await readForm(request);
  if (body.status) return answer(body.status, 'invalid');
  const { form } = body;
  lang = form.get('lang') === 'en' ? 'en' : 'de';

  // A field people never see. Filled in, it was a bot; it is told "sent" so it
  // has no reason to try again another way.
  const trap = form.get('website');
  if (typeof trap === 'string' && trap.trim()) return answer(200, 'sent');

  const parsed = parseEnquiry(form);
  if ('invalid' in parsed) return answer(400, 'invalid', parsed.invalid);
  const { enquiry } = parsed;

  if (!mailConfigured()) {
    console.error('[kontakt] Kein Mailserver konfiguriert (SMTP_HOST, SMTP_USER, SMTP_PASS).');
    return answer(503, 'unavailable');
  }

  try {
    await sendToTeam(enquiry);
  } catch (error) {
    logFailure('Mail an das Team', error);
    return answer(502, 'failed');
  }

  if (perRecipient.take(enquiry.email) && allConfirmations.take('*')) {
    try {
      await sendConfirmation(enquiry);
    } catch (error) {
      logFailure('Bestätigung', error);
    }
  }

  return answer(200, 'sent');
};

/**
 * The visitor's address. Behind Coolify's proxy the socket's peer is the proxy,
 * which appends the real one to X-Forwarded-For — so it is read from the right:
 * the left end is whatever the client chose to send. Should Cloudflare's proxy
 * ever be switched on for sanktum.de, this becomes Cloudflare's address, and
 * CF-Connecting-IP is the header to read instead.
 */
function clientIp(request: Request, fallback: string) {
  const last = request.headers.get('x-forwarded-for')?.split(',').at(-1)?.trim();
  return last || fallback;
}

/** English if the form was sent from a page under /en/. */
function langOfReferer(request: Request): Lang {
  try {
    return /^\/en(\/|$)/.test(new URL(request.headers.get('referer') ?? '').pathname) ? 'en' : 'de';
  } catch {
    return 'de';
  }
}

/** The body as form data, read no further than MAX_BODY. */
async function readForm(request: Request): Promise<{ form: FormData; status?: never } | { status: 400 | 413 }> {
  if (Number(request.headers.get('content-length') ?? 0) > MAX_BODY) return { status: 413 };
  if (!request.body) return { status: 400 };

  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let size = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    size += value.byteLength;
    if (size > MAX_BODY) {
      await reader.cancel();
      return { status: 413 };
    }
    chunks.push(value);
  }

  const bytes = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.byteLength;
  }

  try {
    const type = request.headers.get('content-type') ?? '';
    return { form: await new Response(bytes, { headers: { 'content-type': type } }).formData() };
  } catch {
    return { status: 400 };
  }
}

/** Error code and SMTP status only: the error object itself can carry addresses. */
function logFailure(what: string, error: unknown) {
  const { code, responseCode } = (error ?? {}) as { code?: string; responseCode?: number };
  console.error(`[kontakt] ${what} fehlgeschlagen:`, code ?? 'unbekannt', responseCode ?? '');
}
