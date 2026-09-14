/**
 * What counts as an enquiry from the contact form.
 *
 * The browser checks the same things first (src/scripts/contact.ts), but only
 * this counts: anything can be posted to the endpoint without a browser.
 */
import type { Lang } from '../content/copy';

/** Also the fields' maxlength in the form, so nobody types past them. */
export const LIMITS = { name: 100, company: 150, email: 254, message: 5000 } as const;

export type Field = keyof typeof LIMITS;

export interface Enquiry {
  name: string;
  company: string;
  email: string;
  message: string;
  lang: Lang;
}

/**
 * One address and nothing else: no spaces, no second address after a comma,
 * none of the characters that give an address a display name or a comment. The
 * same pattern runs in the browser.
 */
export const EMAIL = /^[^\s@<>()[\],;:"\\]+@[^\s@<>()[\],;:"\\]+\.[^\s@<>()[\],;:"\\]{2,}$/;

/** Line breaks and other control characters have no place in a single-line field. */
const CONTROL = /[\u0000-\u001f\u007f]/;
/** The message may break lines; the rest of the control characters still go. */
const CONTROL_IN_TEXT = /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/;

const text = (value: FormDataEntryValue | null) => (typeof value === 'string' ? value.trim() : '');

export function parseEnquiry(form: FormData): { enquiry: Enquiry } | { invalid: Field[] } {
  const name = text(form.get('name'));
  const company = text(form.get('company'));
  const email = text(form.get('email'));
  const message = text(form.get('message')).replace(/\r\n?/g, '\n');
  const lang: Lang = form.get('lang') === 'en' ? 'en' : 'de';

  const invalid: Field[] = [];
  if (!name || name.length > LIMITS.name || CONTROL.test(name)) invalid.push('name');
  if (!company || company.length > LIMITS.company || CONTROL.test(company)) invalid.push('company');
  if (email.length > LIMITS.email || !EMAIL.test(email)) invalid.push('email');
  if (message.length > LIMITS.message || CONTROL_IN_TEXT.test(message)) invalid.push('message');

  return invalid.length ? { invalid } : { enquiry: { name, company, email, message, lang } };
}
