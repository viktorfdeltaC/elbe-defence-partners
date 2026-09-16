/**
 * The dossier dialog's form: check the two fields, ask the backend for the
 * PDF, start the download.
 *
 * Opening and closing the dialog is legal.ts — the hero button carries
 * data-legal-open="dossier". Messages come from the form's data-msg-*
 * attributes, in the page's language, as in contact.ts.
 */
import { COMPANY } from '../content/company';
import { DOSSIER_ENDPOINT } from '../content/dossier';
import { EMAIL } from '../server/enquiry';

type Field = 'email' | 'company';
type Message = 'send' | 'sending' | 'required' | 'badMail' | 'invalid' | 'rate' | 'failed';

const form = document.querySelector<HTMLFormElement>('form[data-dossier-form]');
const done = document.querySelector<HTMLElement>('[data-dossier-done]');
const status = form?.querySelector<HTMLElement>('[data-dossier-status]');
const button = form?.querySelector<HTMLButtonElement>('button[type="submit"]');
const link = done?.querySelector<HTMLAnchorElement>('[data-dossier-link]');

if (form && done && status && button && link) enhance(form, done, status, button, link);

/** Without an endpoint: the local placeholder, in `npm run dev` only. */
async function request(body: FormData): Promise<Response> {
  if (DOSSIER_ENDPOINT) {
    return fetch(DOSSIER_ENDPOINT, { method: 'POST', body, headers: { Accept: 'application/json' } });
  }
  if (import.meta.env.DEV) return (await import('./dossier-mock')).mockDossier(body);
  throw new Error('No dossier endpoint configured');
}

function enhance(
  form: HTMLFormElement,
  done: HTMLElement,
  status: HTMLElement,
  button: HTMLButtonElement,
  link: HTMLAnchorElement,
) {
  const message = (key: Message) => form.dataset[`msg${key[0].toUpperCase()}${key.slice(1)}`] ?? '';
  const control = (name: Field) => form.elements.namedItem(name) as HTMLInputElement;
  const fields: Field[] = ['email', 'company'];

  const problem = (name: Field): Message | null => {
    const value = control(name).value.trim();
    if (!value) return 'required';
    if (name === 'email' && !EMAIL.test(value)) return 'badMail';
    return null;
  };

  const mark = (name: Field, key: Message | null) => {
    const input = control(name);
    const id = `dossier-error-${name}`;
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
      note.className = 'dossier__error';
      input.after(note);
    }
    note.textContent = message(key);
  };

  const say = (key: Message | null, { error = false, address = false } = {}) => {
    status.replaceChildren();
    status.classList.toggle('is-error', error);
    if (!key) return;
    status.append(message(key));
    if (address) {
      const mail = document.createElement('a');
      mail.href = `mailto:${COMPANY.email}`;
      mail.textContent = COMPANY.email;
      status.append(' ', mail);
    }
  };

  let busy = false;
  const idle = () => {
    busy = false;
    button.removeAttribute('aria-disabled');
    button.textContent = message('send');
  };

  form.addEventListener('input', (event) => {
    const input = event.target as HTMLInputElement;
    if (input.getAttribute('aria-invalid') === 'true') mark(input.name as Field, problem(input.name as Field));
  });

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (busy) return;

    const invalid = fields.filter((name) => {
      const key = problem(name);
      mark(name, key);
      return key !== null;
    });
    if (invalid.length) {
      say('invalid', { error: true });
      control(invalid[0]).focus();
      return;
    }

    busy = true;
    button.setAttribute('aria-disabled', 'true');
    button.textContent = message('sending');
    say('sending');

    let response: Response | null = null;
    let data: { url?: string; errors?: Record<string, unknown> } = {};
    try {
      response = await request(new FormData(form));
      data = await response.json().catch(() => ({}));
    } catch {
      response = null;
    }

    if (response?.ok && data.url) {
      const lang = new FormData(form).get('lang');
      link.href = data.url;
      link.download = `Sanktum-Dossier-${lang === 'en' ? 'EN' : 'DE'}.pdf`;
      form.hidden = true;
      done.hidden = false;
      done.focus();
      // The link inside the dialog, not a new one in <body>: the page behind a
      // modal dialog is inert.
      link.click();
      return;
    }

    idle();
    const rejected = fields.filter((name) => data.errors && name in data.errors);
    if (response?.status === 422 && rejected.length) {
      for (const name of rejected) mark(name, name === 'email' ? 'badMail' : 'required');
      say('invalid', { error: true });
      control(rejected[0]).focus();
    } else if (response?.status === 429) {
      say('rate', { error: true, address: true });
    } else {
      say('failed', { error: true, address: true });
    }
  });

  // Opened again later, the dialog shows the form, not the last download.
  form.closest('dialog')?.addEventListener('close', () => {
    form.hidden = false;
    done.hidden = true;
    say(null);
    idle();
  });
}
