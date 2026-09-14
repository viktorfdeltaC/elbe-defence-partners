/**
 * The company behind the brand.
 *
 * Sanktum Defence Partners is a brand of realxtrade GmbH, as Wertentwickler and
 * Wertentwickler-Edelmetalle are. So the imprint, the privacy policy and — once
 * the contact form sends mail — the footer of every message name realxtrade,
 * not the brand. They draw on this one object so the three cannot disagree.
 *
 * The company facts are taken from the imprint of the Wertentwickler website,
 * September 2026; the contact address is the brand's own.
 */
export const COMPANY = {
  name: 'realxtrade GmbH',
  street: 'Kreuzbergblick 8',
  postcode: '96120',
  city: 'Bischberg',
  country: 'Deutschland',
  countryEn: 'Germany',
  managingDirector: 'Erik Eckert',
  registerCourt: 'Amtsgericht Bamberg',
  registerNumber: 'HRB 11788',
  vatId: 'DE436397359',
  /** The address this site gives — the brand's, and it reaches realxtrade. */
  email: 'info@sanktum.de',
  permit34c: {
    scope: '§ 34c Abs. 1 Satz 1 Nr. 1, 2, 3a und 3b GewO',
    // TODO(legal): carried over from the Wertentwickler imprint. The seat is
    // Bischberg (Oberfranken); confirm this is still the chamber on file.
    authority: 'IHK München und Oberbayern, 80323 München',
  },
} as const;

/** Data protection authority for a company seated in Bavaria. */
export const DATA_PROTECTION_AUTHORITY = {
  name: 'Bayerisches Landesamt für Datenschutzaufsicht (BayLDA)',
  nameEn: 'Bavarian Data Protection Authority (BayLDA)',
  street: 'Promenade 18',
  city: '91522 Ansbach',
  url: 'https://www.lda.bayern.de',
  urlLabel: 'www.lda.bayern.de',
} as const;

/**
 * Where the site runs: the company's own virtual server, rented from STRATO
 * and run with Coolify, in a data centre in Germany — the same machine as the
 * Wertentwickler website. STRATO provides the machine and the network and is a
 * processor under Art. 28 GDPR; the server itself is ours.
 */
export const HOST = {
  name: 'STRATO GmbH',
  address: 'Otto-Ostrowski-Straße 7, 10249 Berlin',
  country: 'Deutschland',
  countryEn: 'Germany',
  // TODO(legal): the privacy policy promises this. It has to match the log
  // settings on the server — Traefik's access log and the container's.
  logRetentionDays: 7,
} as const;

/**
 * Provider of the mailboxes: Google Workspace, as for wertentwickler.de — the
 * MX record of sanktum.de is smtp.google.com (checked September 2026). If the
 * mailboxes ever move, the privacy policy changes with them.
 */
export const MAIL_PROVIDER = {
  name: 'Google Ireland Limited',
  address: 'Gordon House, Barrow Street, Dublin 4',
  country: 'Irland',
  countryEn: 'Ireland',
} as const;
