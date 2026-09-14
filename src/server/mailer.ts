/**
 * Sends the contact form's two mails.
 *
 * Through the mailbox's own SMTP server — Google Workspace for sanktum.de —
 * and never unencrypted: port 465 speaks TLS from the first byte, any other
 * port has to upgrade with STARTTLS or the connection is dropped. Left to
 * itself, nodemailer would carry on in plain text if a server offered no
 * upgrade.
 *
 * Addresses go to nodemailer as objects, never as strings assembled from the
 * form. A name like `Max" <someone@else.example>, "x` pasted into
 * `"${name}" <${email}>` parses as two addresses, and the team's reply would
 * go to both.
 */
import { createTransport, type SendMailOptions, type Transporter } from 'nodemailer';
import { CONTACT_TO, SMTP_FROM, SMTP_HOST, SMTP_PASS, SMTP_PORT, SMTP_USER } from 'astro:env/server';
import { BRAND } from '../content/copy';
import { COMPANY } from '../content/company';
import { confirmationMail, teamMail } from '../content/mail';
import type { Enquiry } from './enquiry';

let transport: Transporter | null | undefined;

/** Built once. Null when no mail server is configured, outside `npm run dev`. */
function getTransport(): Transporter | null {
  if (transport !== undefined) return transport;

  if (SMTP_HOST && SMTP_USER && SMTP_PASS) {
    transport = createTransport({
      host: SMTP_HOST,
      port: SMTP_PORT,
      secure: SMTP_PORT === 465,
      requireTLS: SMTP_PORT !== 465,
      auth: { user: SMTP_USER, pass: SMTP_PASS },
      // A hanging mail server must not hold the visitor's button for minutes;
      // nodemailer's own defaults are two and ten.
      connectionTimeout: 10_000,
      greetingTimeout: 10_000,
      socketTimeout: 20_000,
    });
  } else if (import.meta.env.DEV) {
    // Local development without credentials: build the mails, print them.
    transport = createTransport({ jsonTransport: true });
  } else {
    transport = null;
  }
  return transport;
}

export const mailConfigured = () => getTransport() !== null;

async function send(message: SendMailOptions) {
  const mailer = getTransport();
  if (!mailer) throw new Error('No mail server configured');
  const info = await mailer.sendMail({ from: { name: BRAND, address: SMTP_FROM ?? COMPANY.email }, ...message });
  if (import.meta.env.DEV && typeof info.message === 'string') {
    console.log(`[kontakt] Mail (nur im Dev-Modus ausgegeben):\n${info.message}`);
  }
}

export async function sendToTeam(enquiry: Enquiry, receivedAt = new Date()) {
  const { subject, text } = teamMail(enquiry, receivedAt);
  await send({
    to: { name: BRAND, address: CONTACT_TO ?? COMPANY.email },
    replyTo: { name: enquiry.name, address: enquiry.email },
    subject,
    text,
  });
}

export async function sendConfirmation(enquiry: Enquiry) {
  const { subject, text } = confirmationMail(enquiry.lang);
  await send({
    to: { name: '', address: enquiry.email },
    subject,
    text,
    // RFC 3834: an automatic message. Keeps auto-replies from answering it.
    headers: { 'Auto-Submitted': 'auto-generated' },
  });
}
