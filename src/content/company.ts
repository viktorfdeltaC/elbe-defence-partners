/**
 * The company behind the brand.
 *
 * Sanktum Defence Partners is a brand of realxtrade GmbH, as Wertentwickler and
 * Wertentwickler-Edelmetalle are. So the imprint, the privacy policy and — once
 * the contact form sends mail — the footer of every message name realxtrade,
 * not the brand. They draw on this one object so the three cannot disagree.
 *
 * Taken from the imprint of the Wertentwickler website, September 2026.
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
  email: 'info@wertentwickler.de',
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

/** Host of the site. Changes with a move off Vercel — and the privacy policy with it. */
export const HOST = {
  name: 'Vercel Inc.',
  address: '440 N Barranca Ave #4133, Covina, CA 91723',
  country: 'USA',
} as const;

/** Provider of the company mailboxes (Google Workspace). */
export const MAIL_PROVIDER = {
  name: 'Google Ireland Limited',
  address: 'Gordon House, Barrow Street, Dublin 4',
  country: 'Irland',
  countryEn: 'Ireland',
} as const;
