/**
 * Stands in for the Laravel backend while DOSSIER_ENDPOINT is empty, and only in
 * `npm run dev`: dossier.ts imports it behind import.meta.env.DEV, so a
 * production build leaves it out.
 *
 * It answers the way the backend is meant to (src/content/dossier.ts) and hands
 * out a one-page placeholder PDF naming the dossier and the page's language, so
 * the whole flow — checking, waiting, downloading — can be tried on localhost.
 *
 * Two addresses try the failures:
 *   fehler@…   the backend fails
 *   limit@…    too many requests
 */
export async function mockDossier(form: FormData): Promise<Response> {
  await new Promise((resolve) => setTimeout(resolve, 700));

  const email = String(form.get('email') ?? '').toLowerCase();
  const company = String(form.get('company') ?? '');
  const lang = form.get('lang') === 'en' ? 'en' : 'de';
  const dossier = form.get('dossier') === 'partners' ? 'partners' : 'manufacturers';

  if (email.startsWith('fehler@')) return new Response('{}', { status: 500 });
  if (email.startsWith('limit@')) return new Response('{}', { status: 429 });

  // What the backend will write to its database.
  console.info('[dossier] Platzhalter, würde gespeichert:', { email, company, dossier, lang, at: new Date().toISOString() });

  const pdf = new Blob([placeholderPdf(dossier, lang)], { type: 'application/pdf' });
  return Response.json({ url: URL.createObjectURL(pdf) });
}

/** A valid single-page PDF, ASCII only so the standard Helvetica can set it. */
function placeholderPdf(dossier: 'manufacturers' | 'partners', lang: 'de' | 'en') {
  const title = {
    de: { manufacturers: 'Dossier fuer Hersteller (Deutsch)', partners: 'Dossier fuer Standortpartner (Deutsch)' },
    en: { manufacturers: 'Dossier for manufacturers (English)', partners: 'Dossier for site partners (English)' },
  }[lang][dossier];
  const lines =
    lang === 'en'
      ? ['Sanktum Defence Partners', title, '', 'Placeholder from localhost.', 'The real PDF comes from the backend.']
      : ['Sanktum Defence Partners', title, '', 'Platzhalter von localhost.', 'Die echte PDF kommt aus dem Backend.'];

  const text = lines.map((line, i) => `BT /F1 ${i < 2 ? 22 : 13} Tf 72 ${760 - i * 34} Td (${line}) Tj ET`).join('\n');

  const objects = [
    '<< /Type /Catalog /Pages 2 0 R >>',
    '<< /Type /Pages /Kids [3 0 R] /Count 1 >>',
    '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>',
    '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>',
    `<< /Length ${text.length} >>\nstream\n${text}\nendstream`,
  ];

  let body = '%PDF-1.4\n';
  const offsets: number[] = [];
  objects.forEach((object, i) => {
    offsets.push(body.length);
    body += `${i + 1} 0 obj\n${object}\nendobj\n`;
  });

  const xref = body.length;
  body += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  body += offsets.map((offset) => `${String(offset).padStart(10, '0')} 00000 n \n`).join('');
  body += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF\n`;
  return body;
}
