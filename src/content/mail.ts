/**
 * The two mails the contact form sends. Server-only: copy.ts goes to the
 * browser whole, and none of this belongs there.
 *
 * The confirmation carries nothing the visitor typed — not the name, not the
 * company, not the message, not in the subject either. The address it goes to
 * is unverified, so anything from the form in it would let anyone send text of
 * their choosing, from our domain, to any inbox.
 *
 * Nor does it advertise: an automatic confirmation with a pitch attached is
 * unsolicited advertising (BGH, 15.12.2015, VI ZR 134/15). Its footer carries
 * what every business letter of a GmbH has to (§ 35a GmbHG).
 */
import { BRAND, pathIn, type Lang } from './copy';
import { COMPANY } from './company';
import type { Enquiry } from '../server/enquiry';

/** The privacy policy in the mail's own language — /datenschutz/ or /en/datenschutz/. */
const privacyUrl = (lang: Lang) => new URL(pathIn(lang, '/datenschutz/'), import.meta.env.SITE).href;

const confirmations: Record<Lang, { subject: string; body: string[]; footer: string[] }> = {
  de: {
    subject: `Ihre Anfrage bei ${BRAND}`,
    body: ['Guten Tag,', '', 'danke für Ihre Kontaktaufnahme. Wir melden uns.', '', BRAND],
    footer: [
      `${BRAND} ist eine Marke der ${COMPANY.name}.`,
      `${COMPANY.name} · Sitz: ${COMPANY.city} · ${COMPANY.registerCourt}, ${COMPANY.registerNumber} · Geschäftsführer: ${COMPANY.managingDirector}`,
      `Datenschutz: ${privacyUrl('de')}`,
      '',
      'Diese E-Mail ging an Sie, weil über das Kontaktformular auf sanktum.de eine Anfrage mit dieser Adresse gesendet wurde. Waren Sie das nicht, können Sie sie ignorieren.',
    ],
  },
  en: {
    subject: `Your enquiry to ${BRAND}`,
    body: ['Hello,', '', 'thank you for getting in touch. We will get back to you.', '', BRAND],
    footer: [
      `${BRAND} is a brand of ${COMPANY.name}.`,
      `${COMPANY.name} · Registered office: ${COMPANY.city} · ${COMPANY.registerCourt}, ${COMPANY.registerNumber} · Managing director: ${COMPANY.managingDirector}`,
      `Privacy: ${privacyUrl('en')}`,
      '',
      'You are receiving this email because an enquiry was sent with this address through the contact form on sanktum.de. If that was not you, you can ignore it.',
    ],
  },
};

export function confirmationMail(lang: Lang) {
  const { subject, body, footer } = confirmations[lang];
  return { subject, text: [...body, '', '—', ...footer].join('\n') };
}

const receivedFormat = new Intl.DateTimeFormat('de-DE', {
  dateStyle: 'long',
  timeStyle: 'short',
  timeZone: 'Europe/Berlin',
});

/** The enquiry as it reaches the team — in German, whatever the visitor's language. */
export function teamMail(enquiry: Enquiry, receivedAt: Date) {
  const { name, company, email, message, lang } = enquiry;
  return {
    subject: `Kontaktanfrage: ${company} – ${name}`,
    text: [
      'Neue Anfrage über das Kontaktformular auf sanktum.de.',
      '',
      `Name:         ${name}`,
      `Unternehmen:  ${company}`,
      `E-Mail:       ${email}`,
      `Sprache:      ${lang === 'en' ? 'Englisch' : 'Deutsch'}`,
      `Eingegangen:  ${receivedFormat.format(receivedAt)} Uhr`,
      '',
      'Vorhaben:',
      message || '(keine Angabe)',
      '',
      '—',
      `„Antworten“ geht direkt an ${email}.`,
    ].join('\n'),
  };
}
