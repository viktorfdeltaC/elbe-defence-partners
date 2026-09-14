/**
 * The contact form, once JavaScript is there to improve on it.
 *
 * Without this module the form still works: it posts to /api/kontakt and the
 * server answers with a page. With it the visitor stays put — the fields are
 * checked here first, with the server's own rules, the enquiry goes out with
 * fetch, and the answer takes the form's place.
 *
 * Every message is a key into the dictionaries, set as data-i18n on its node,
 * so the language switch translates it like any other text on the page. The
 * enquiry goes as FormData rather than JSON so that Astro's origin check,
 * which only looks at form submissions, still covers it.
 */
import { dictionaries, type Lang, type TextKey } from '../content/copy';
import { COMPANY } from '../content/company';
import { EMAIL, type Field } from '../server/enquiry';

type Outcome = 'sent' | 'invalid' | 'rate' | 'unavailable' | 'failed';

const lang = (): Lang => (document.documentElement.lang === 'en' ? 'en' : 'de');

/** Sets a node's text and marks it, so the language switch keeps it current. */
const setText = (node: HTMLElement, key: TextKey) => {
  node.dataset.i18n = key;
  node.textContent = dictionaries[lang()][key];
};

const form = document.querySelector<HTMLFormElement>('form[data-contact-form]');
const done = document.querySelector<HTMLElement>('[data-contact-done]');
const status = form?.querySelector<HTMLElement>('[data-contact-status]');
const button = form?.querySelector<HTMLButtonElement>('button[type="submit"]');

if (form && done && status && button) enhance(form, done, status, button);

function enhance(form: HTMLFormElement, done: HTMLElement, status: HTMLElement, button: HTMLButtonElement) {
  // The browser's own bubbles give way to messages in the page's language and
  // type. Without this module they stay, and they are the check.
  form.noValidate = true;

  const control = (name: string) => form.elements.namedItem(name) as HTMLInputElement | HTMLTextAreaElement;
  const required: Field[] = ['name', 'company', 'email'];

  /** What is wrong with a field, if anything. The length limits are maxlength's job. */
  const problem = (name: Field): TextKey | null => {
    const value = control(name).value.trim();
    if (name === 'message') return null;
    if (!value) return 'fRequired';
    if (name === 'email' && !EMAIL.test(value)) return 'fBadMail';
    return null;
  };

  /** A message under the field, tied to it with aria-describedby — or none. */
  const mark = (name: Field, key: TextKey | null) => {
    const input = control(name);
    const id = `contact-error-${name}`;
    let note = document.getElementById(id);
    if (!key) {
      input.removeAttribute('aria-invalid');
      input.removeAttribute('aria-describedby');
      note?.remove();
      return;
    }
    input.setAttribute('aria-invalid', 'true');
    input.setAttribute('aria-describedby', id);
    if (!note) {
      note = document.createElement('span');
      note.id = id;
      note.className = 'form__error';
      input.after(note);
    }
    setText(note, key);
  };

  /** The status line. The address follows as a link where it is the way out. */
  const say = (key: TextKey | null, { error = false, address = false } = {}) => {
    status.replaceChildren();
    status.classList.toggle('is-error', error);
    if (!key) return;
    const text = document.createElement('span');
    setText(text, key);
    status.append(text);
    if (address) {
      const link = document.createElement('a');
      link.href = `mailto:${COMPANY.email}`;
      link.textContent = COMPANY.email;
      status.append(' ', link);
    }
  };

  // A marked field is checked again as it is corrected, so the mark goes as
  // soon as it is no longer true.
  form.addEventListener('input', (event) => {
    const input = event.target as HTMLInputElement;
    if (input.getAttribute('aria-invalid') === 'true') mark(input.name as Field, problem(input.name as Field));
  });

  let busy = false;

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (busy) return;

    const invalid = required.filter((name) => {
      const key = problem(name);
      mark(name, key);
      return key !== null;
    });
    if (invalid.length) {
      say('fInvalid', { error: true });
      control(invalid[0]).focus();
      return;
    }

    busy = true;
    button.setAttribute('aria-disabled', 'true');
    setText(button, 'fSending');
    say('fSending');
    control('lang').value = lang();

    let outcome: Outcome = 'failed';
    let fields: Field[] = [];
    try {
      const response = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' },
      });
      const data = (await response.json().catch(() => ({}))) as { ok?: boolean; outcome?: Outcome; fields?: Field[] };
      outcome = response.ok && data.ok ? 'sent' : (data.outcome ?? (response.status === 429 ? 'rate' : 'failed'));
      fields = data.fields ?? [];
    } catch {
      outcome = 'failed';
    }

    if (outcome === 'sent') {
      form.hidden = true;
      done.hidden = false;
      done.focus();
      return;
    }

    busy = false;
    button.removeAttribute('aria-disabled');
    setText(button, 'fSend');

    if (outcome === 'invalid' && fields.length) {
      for (const name of fields) mark(name, name === 'email' ? 'fBadMail' : 'fRequired');
      say('fInvalid', { error: true });
      control(fields[0]).focus();
    } else if (outcome === 'rate') {
      say('fRate', { error: true, address: true });
    } else {
      say('fFailed', { error: true, address: true });
    }
  });
}
