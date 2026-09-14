/**
 * Bilingual copy for the Sanktum Defence Partners one-pager.
 *
 * Both dictionaries share one shape (`Copy`), so a missing translation is a
 * type error rather than a blank on the page. Which one is rendered follows
 * from the route: `/` is German, `/en/` is English (see astro.config.mjs).
 *
 * Text is carried over verbatim from Richtung-D-Grid.dc.html; the figures in
 * `axes` and `figures` are the researched, publicly sourced values the user
 * signed off on (Silicon Saxony, NATO/BMVg budgets, Polish defence budget).
 */

export type Lang = 'de' | 'en';

export interface Figure {
  /** Formatted value. The count-up animation reads the number out of it. */
  v: string;
  /** Caption under the figure. */
  k: string;
}

export interface Constraint {
  n: string;
  t: string;
}

export interface Axis {
  n: string;
  t: string;
  fig: string;
  figLabel: string;
  d: string;
}

export interface ServiceBlock {
  n: string;
  title: string;
  body: string;
  items: string[];
}

export interface Person {
  /**
   * Key into the portrait image map in src/components/Contact.astro, or null
   * for a person whose details are still open. A null photo renders an empty
   * frame rather than someone else's face: the page is public, and a portrait
   * standing in for a person who is not that person is a claim, not a
   * placeholder.
   */
  photo: 'viktorFink' | 'dennisArians' | 'erikEckert' | 'holgerWeller' | null;
  name: string;
  role: string;
  bio: string;
  /** Empty on a placeholder — the contact block is left out entirely. */
  phone: string;
  mail: string;
}

export interface Copy {
  htmlTitle: string;
  htmlDescription: string;

  /**
   * The two lines of the link preview, separate from the ones above on purpose.
   * htmlTitle leads with the company because a browser tab and a search result
   * need to say whose page this is. The preview card does not: the wordmark is
   * already the picture, so repeating the name there costs the one line that
   * could carry the claim instead. Both are read by scrapers that run no
   * JavaScript, and both get cut short — roughly 60 and 120 characters.
   */
  ogTitle: string;
  ogDescription: string;

  docRef: string;
  ref1: string;
  ref2: string;
  ref3: string;
  ref4: string;
  refCap: string;
  nav1: string;
  nav2: string;
  nav3: string;
  nav4: string;
  navCap: string;
  /** Accessible names of the hero's navigation and the station rail. */
  navLabel: string;
  railLabel: string;

  heroTitle: string;
  heroLead: string;
  cta1: string;
  cta2: string;

  s2Title: string;
  s2Body: string;
  s2Pull: string;

  s3Title: string;
  s3Lead: string;
  s3bTitle: string;
  s3bBody: string;
  s3bNote: string;
  s3Claim: string;
  imgCap: string;
  imgAlt: string;

  s4Title: string;

  s5Title: string;
  s5Lead: string;
  s5Scarcity: string;
  addr2: string;
  fName: string;
  fCompany: string;
  fMail: string;
  fMsg: string;
  fSend: string;
  /** Button label and status while the enquiry is on its way. */
  fSending: string;
  /** Under an empty required field, and under an email address that is not one. */
  fRequired: string;
  fBadMail: string;
  /** Status lines. The two failures are followed by the address as a link. */
  fInvalid: string;
  fRate: string;
  fFailed: string;
  /** What replaces the form once the enquiry is through — and the page without JavaScript. */
  fDoneTitle: string;
  fDoneBody: string;
  /** The page a failed submission without JavaScript lands on. */
  fFailTitle: string;
  fFailBody: string;
  fBackToForm: string;
  htmlTitleSent: string;
  htmlTitleFailed: string;
  /** Line under the button; `fPrivacyLink` is the link that follows it. */
  fPrivacy: string;
  fPrivacyLink: string;

  capLabel: string;
  capTitle: string;
  capBody: string;
  capNote: string;
  capCta: string;

  imprint: string;
  privacy: string;
  /** Heading of the privacy policy; the footer link says the shorter `privacy`. */
  privacyTitle: string;
  /** <title> of the two legal pages. */
  htmlTitleImprint: string;
  htmlTitlePrivacy: string;
  /** Marker label above the legal pages' headings. */
  legalLabel: string;
  /** Link from a legal page back to the one-pager. */
  legalBack: string;
  /** Accessible name of the close button in the legal dialogs. */
  legalClose: string;

  railStops: string[];
  figures: Figure[];
  constraints: Constraint[];
  axes: Axis[];
  blocks: ServiceBlock[];
  capItems: Constraint[];
  /** Label inside the empty frame of a person who has no portrait yet. */
  photoPending: string;
  people: Person[];
}

export const de: Copy = {
  // Der Title steht im Suchergebnis, nicht in der Linkvorschau — das ist
  // ogTitle. Deshalb trägt er Begriffe, nach denen jemand sucht, und bleibt
  // unter den rund 60 Zeichen, die Google anzeigt.
  htmlTitle: 'Defence-Produktion in Dresden ansiedeln | Sanktum',
  htmlDescription:
    'Standortzugang, Genehmigungsverfahren und Betrieb in Dresden für Defence- und Dual-Use-Hersteller, die vom Prototyp in die Serie gehen.',

  // Ohne das weiche Trennzeichen aus heroTitle: das hilft nur beim Umbruch
  // auf dem Telefon, und mancher Dienst zeigt es als sichtbaren Bindestrich.
  ogTitle: 'Wo aus Technologie Verteidigungsfähigkeit wird.',
  ogDescription: 'Souveränität wird nicht beschlossen. Sie wird gebaut.',

  docRef: 'SDP/DD/2026-01',
  ref1: 'A-01',
  ref2: 'A-02',
  ref3: 'B-01',
  ref4: 'C-01',
  refCap: 'D-01',
  nav1: 'Herausforderung',
  nav2: 'Warum Sachsen',
  nav3: 'Leistungen',
  nav4: 'Nächster Schritt',
  navCap: 'Kapital',
  navLabel: 'Hauptnavigation',
  railLabel: 'Sektionen',

  // U+00AD soft hyphen: invisible, but gives the browser a break point in the
  // compound so the word cannot run past the edge on a phone. Deterministic
  // where `hyphens: auto` is not — it needs hyphenation dictionaries the
  // browser may not have.
  heroTitle: 'Wo aus Technologie Verteidigungs\u00ADfähigkeit wird.',
  heroLead: 'Für Unternehmen, die vom Prototyp in die Serie gehen.',
  cta1: 'Erste Einschätzung anfragen',
  cta2: 'Dossier anfordern',

  s2Title: 'Der Prototyp funktioniert. Die Serie ist eine andere Herausforderung.',
  s2Body:
    'Der Prototyp beweist die Technologie. Zur Fähigkeit wird sie erst in der Serie. Dort ist die Technik nicht mehr der Engpass. Damit ist es eine Fähigkeitsfrage, keine Fertigungsfrage.',
  s2Pull:
    'Der Ort entscheidet, ob aus Technologie Fähigkeit wird. Wer ihn erschließt, entscheidet wann.',

  s3Title: 'Der richtige Ort. Die richtigen Leute.',
  s3Lead: 'Dresden ist der Standort, an dem Defence-Produktion in Deutschland skaliert.',
  s3bTitle: 'In Europa gibt es dafür wenige Orte. Dies ist einer davon.',
  s3bBody:
    'Die Bauteile, von denen Ihr System abhängt, entstehen im selben Umkreis. Die Fachkräfte, die es in Serie bringen, sind schon hier. Und die Länder, die derzeit am meisten in ihre Verteidigung investieren, liegen in unmittelbarer Nachbarschaft. Dazwischen liegen Genehmigungen, Rüstungsvorschriften und eine Verwaltung, die niemand gern führt. Wir führen sie, und wir führen sie digital. Was daraus entsteht, ist nicht nur ein Standortvorteil, sondern ein strategischer Vorteil.',
  s3bNote:
    'Vor jedem Mandat prüfen wir Flächen, Genehmigungslage und realistische Fristen für Ihr Vorhaben.',
  s3Claim: 'Der Standort ist die Strategie. Wir sind die Umsetzung.',
  imgCap: 'Dresden — Mikroelektronik-Cluster',
  imgAlt: 'Die Dresdner Altstadt, deren Spiegelung in eine Leiterplatte übergeht',

  s4Title: 'Was ein Vorhaben trägt, bis es läuft.',

  s5Title: 'Erste Einschätzung in 30 Minuten.',
  s5Lead: 'Wo Sie heute stehen, was in Dresden möglich wäre, was es realistisch braucht.',
  s5Scarcity: 'Gespräche werden vertraulich geführt, auf Wunsch unter NDA.',
  addr2: '+49 351 000 000',
  fName: 'Name',
  fCompany: 'Unternehmen',
  fMail: 'E-Mail',
  fMsg: 'Vorhaben',
  fSend: 'Einschätzung anfragen',
  fSending: 'Wird gesendet …',
  fRequired: 'Bitte ausfüllen.',
  fBadMail: 'Bitte eine gültige E-Mail-Adresse angeben.',
  fInvalid: 'Bitte prüfen Sie die markierten Felder.',
  fRate: 'Zu viele Anfragen in kurzer Zeit. Bitte versuchen Sie es später noch einmal oder schreiben Sie uns direkt:',
  fFailed: 'Die Anfrage konnte gerade nicht gesendet werden. Bitte schreiben Sie uns direkt:',
  fDoneTitle: 'Danke. Ihre Anfrage ist bei uns.',
  fDoneBody: 'Wir melden uns. Eine kurze Bestätigung geht an Ihre E-Mail-Adresse.',
  fFailTitle: 'Die Anfrage ist nicht angekommen.',
  fFailBody:
    'Das Formular konnte nicht gesendet werden. Bitte prüfen Sie Ihre Angaben und versuchen Sie es noch einmal, oder schreiben Sie uns direkt:',
  fBackToForm: 'Zurück zum Formular',
  htmlTitleSent: 'Anfrage gesendet | Sanktum',
  htmlTitleFailed: 'Anfrage nicht gesendet | Sanktum',
  fPrivacy: 'Wir verwenden Ihre Angaben, um Ihre Anfrage zu beantworten und das Formular vor Missbrauch zu schützen. Mehr in der',
  fPrivacyLink: 'Datenschutzerklärung',

  capLabel: 'Kapital & Standortentwicklung',
  // Zeilenumbruch zwischen den beiden Sätzen: .capital__title führt
  // white-space: pre-line, damit jeder Satz auf seiner eigenen Zeile beginnt
  // und bei wenig Breite trotzdem weiter umbrechen darf.
  capTitle: 'Der Markt kommt hierher.\nDer Zugang zu ihm nicht.',
  capBody:
    'Die Hersteller, die hierherkommen, brauchen Flächen, Zulieferer, Dienstleister und Kapital. Vergeben wird davon nichts an den, der die Anforderungen der Branche nicht kennt. Wir kennen sie, und wir kennen die Hersteller.',
  capNote:
    'Dieser Zugang ist kein Beratungsmandat und kein Fondsvehikel.',
  capCta: 'Vertrauliches Gespräch anfragen',

  imprint: 'Impressum',
  privacy: 'Datenschutz',
  privacyTitle: 'Datenschutzerklärung',
  htmlTitleImprint: 'Impressum | Sanktum',
  htmlTitlePrivacy: 'Datenschutzerklärung | Sanktum',
  legalLabel: 'Rechtliches',
  legalBack: 'Zur Startseite',
  legalClose: 'Schließen',

  railStops: [
    'A-01 Herausforderung',
    'A-02 Warum Sachsen',
    'B-01.1 Ankommen',
    'B-01.2 Betreiben',
    'B-01.3 Wachsen',
    'C-01 Kontakt',
    'D-01 Kapital',
  ],

  figures: [
    { v: '739 Mrd. €', k: 'Verteidigungsausgaben der europäischen NATO-Staaten 2025' },
    { v: '117,2 Mrd. €', k: 'Deutscher Verteidigungshaushalt 2026' },
    { v: '40 km', k: 'Bis zur Flugerprobung in Kamenz' },
    { v: '2 h', k: 'Nach Berlin und an die polnische Grenze' },
  ],

  constraints: [
    { n: '01', t: 'Produktionsreife in Monaten statt Jahren' },
    { n: '02', t: 'Stückzahlen, die eine Beschaffungsentscheidung tragen' },
    { n: '03', t: 'Personalkosten, die die Marge nicht auffressen' },
    { n: '04', t: 'Logistik, die den Hauptmarkt erreicht' },
    { n: '05', t: 'Nähe zu den Technologien, von denen das Produkt abhängt' },
    { n: '06', t: 'Ein Partner mit eigener Erfahrung in Verteidigung und Sicherheit' },
  ],

  axes: [
    {
      n: '01',
      t: 'Chip-Nähe',
      fig: '1 von 3',
      figLabel:
        'In der EU gefertigten Halbleitern kommt aus Dresden. Bei Leistungshalbleitern für die Automobilindustrie über die Hälfte.',
      d: 'Über 16 Mrd. Euro Investitionsvolumen sind im Bau oder beschlossen: ESMC/TSMC rund 10 Mrd., Infineon rund 5 Mrd., GlobalFoundries rund 1,1 Mrd., dazu Bosch. Wer Sensorik, Drohnen oder Lenksysteme baut, produziert dort, wo die kritische Komponente herkommt.',
    },
    {
      n: '02',
      t: 'Größe des Ökosystems',
      fig: '82.500',
      figLabel:
        'Beschäftigte in Mikroelektronik und Software, rund 1.500 mehr als im Vorjahr.',
      d: 'Grenoble als zweitgrößter europäischer Verbund kommt auf rund 38.000. Dazu Erprobungsinfrastruktur im Tagesradius: das AEF-Forschungs- und Flugerprobungszentrum in Kamenz, rund 40 km entfernt, mit Schwerpunkten in elektrischen und hybriden Antrieben, Schwarmanwendungen, Datenübertragung und autonomer Navigation.',
    },
    {
      n: '03',
      t: 'Perspektive',
      fig: '100.000',
      figLabel: 'Beschäftigte bis 2030, nach Prognose von Silicon Saxony.',
      d: 'TU Dresden und die Fraunhofer-Institute bilden die Talentbasis. Das Potenzial ist groß, die Verfügbarkeit umkämpft: der Halbleiterstandort konkurriert um dieselben Leute. Personalplanung gehört deshalb an den Anfang eines Vorhabens, nicht an das Ende.',
    },
    {
      n: '04',
      t: 'Europäische Achse',
      fig: '46,6 Mrd. €',
      figLabel: 'Polnischer Verteidigungshaushalt 2026, 4,8 % des Bruttoinlandsprodukts.',
      d: 'Über die Hälfte davon ist für Neubeschaffung vorgesehen. Von Dresden aus liegen Polen und die baltischen Staaten im direkten Zugriff, dazu das Logistikdrehkreuz Leipzig und kurze Wege nach Berlin.',
    },
  ],

  blocks: [
    {
      n: 'B-01.1',
      title: 'Ankommen',
      body: 'Standort, Genehmigung, Bau. Zwanzig Jahre Bauerfahrung, angewendet auf Anforderungen, die kein Bauträger kennt.',
      items: [
        'Bewertung, ob ein Standort die Anforderungen Ihres Programms überhaupt tragen kann',
        'Standortanforderungen aus Rüstungsvorschriften von Anfang an mitgedacht: Wir kennen sie aus der Anwendung, nicht aus dem Handbuch',
        'Immobilienzugang in Dresden und Umland, inklusive flughafennaher Assets',
        'Antrags- und Genehmigungsverfahren vor Ort begleitet',
        'Vergabe und Koordination aller Gewerke, Baubegleitung nach §34c GewO',
      ],
    },
    {
      n: 'B-01.2',
      title: 'Betreiben',
      body: 'Verwaltung, die läuft, ohne dass Sie hinsehen. Aufgebaut aus militärischer und regulatorischer Erfahrung. Dazu die Fähigkeit, Prozesse digital zu bauen statt nur zu verwalten.',
      items: [
        'Die Voraussetzungen für die Geheimschutzbetreuung, hergestellt und dokumentiert',
        'Sicherheitskonforme Workflows für den Umgang mit eingestuftem Material',
        'Digitalisierte Verwaltungs- und Genehmigungsprozesse statt Papier und Mailketten',
        'Digitales Projektmanagement mit Reporting für Investoren und Behörden',
        'Mit wenig Personal betreibbar: Prozesse ersetzen Stellen, nicht umgekehrt',
        'Laufende Infrastrukturverwaltung, Betreuung und Optimierung',
      ],
    },
    {
      n: 'B-01.3',
      title: 'Wachsen',
      body: 'Netzwerk, Kapital, Beschaffung. Gewachsen über zwei Jahrzehnte in Finanzmarkt und Defence.',
      items: [
        'Anschluss an Bedarfsträger und Beschaffungsorganisationen',
        'Strategische und geopolitische Einordnung für Expansionsentscheidungen',
        'Ein Vorhaben, das bei Kapitalgebern und politischen Entscheidern eingeführt ist',
        'Netzwerkformate zwischen den Defence-Hubs im Bundesgebiet und Dresden',
        'Kuratiertes Dienstleisternetzwerk',
      ],
    },
  ],

  capItems: [
    { n: '01', t: 'Beteiligung an Standort- und Projektgesellschaften' },
    { n: '02', t: 'Standortentwicklung mit Kommunen und Landespolitik' },
    { n: '03', t: 'Anschluss an die Hersteller- und Beschaffungswelt' },
    { n: '04', t: 'Strukturierung über Eigen-, Fremd- und Fördermittel' },
  ],

  photoPending: 'Porträt folgt',

  people: [
    {
      photo: 'viktorFink',
      name: 'Viktor Fink',
      role: 'Mandatsverantwortung',
      bio: 'Militärischer Hintergrund, Defence und strategische Lagebeurteilung.',
      phone: '+49 351 000 001',
      mail: 'v.fink@sanktum.de',
    },
    {
      photo: 'dennisArians',
      name: 'Dennis Arians',
      role: 'Mandatsverantwortung',
      bio: 'Militärischer Hintergrund, Defence-IT und sicherheitskonforme Prozesse.',
      phone: '+49 351 000 002',
      mail: 'd.arians@sanktum.de',
    },
    {
      photo: 'erikEckert',
      name: 'Erik Eckert',
      role: 'Mandatsverantwortung',
      bio: 'Infrastruktur, Genehmigungsprozesse und Standortentwicklung.',
      phone: '+49 351 000 003',
      mail: 'e.eckert@sanktum.de',
    },
    {
      photo: 'holgerWeller',
      name: 'Holger Weller',
      role: 'Mandatsverantwortung',
      bio: 'Kapitalstrukturen, Vertrieb und Wirtschaftsnetzwerk.',
      phone: '+49 351 000 004',
      mail: 'h.weller@sanktum.de',
    },
  ],
};

export const en: Copy = {
  htmlTitle: 'Set up defence production in Dresden | Sanktum',
  htmlDescription:
    'Site access, permitting and operations in Dresden for defence and dual-use manufacturers moving from prototype to series production.',

  ogTitle: 'Where technology becomes defence capability.',
  ogDescription: 'Sovereignty is not decided. It is built.',

  docRef: 'SDP/DD/2026-01',
  ref1: 'A-01',
  ref2: 'A-02',
  ref3: 'B-01',
  ref4: 'C-01',
  refCap: 'D-01',
  nav1: 'Challenge',
  nav2: 'Why Saxony',
  nav3: 'Services',
  nav4: 'Next step',
  navCap: 'Capital',
  navLabel: 'Main navigation',
  railLabel: 'Sections',

  heroTitle: 'Where technology becomes defence capability.',
  heroLead: 'For companies moving from prototype to series production.',
  cta1: 'Request an initial assessment',
  cta2: 'Request the dossier',

  s2Title: 'The prototype works. Series production is a different challenge.',
  s2Body:
    'The prototype proves the technology. It becomes capability only in series production. At that point, technology is no longer the bottleneck. That makes it a question of capability, not of manufacturing.',
  s2Pull:
    'The location decides whether technology becomes capability. Whoever opens up that location decides when.',

  s3Title: 'The right place. The right people.',
  s3Lead: 'Dresden is where defence production scales in Germany.',
  s3bTitle: 'In Europe there are few places for this. This is one of them.',
  s3bBody:
    'The components your system depends on are built in the same area. The specialists who take it into series production are already here. And the countries currently investing most in their defence are immediate neighbours. In between sit permits, defence regulations and administrative work nobody enjoys. We run it, and we run it digitally. What comes out of that is not just a location advantage, but a strategic one.',
  s3bNote:
    'Before every mandate we review sites, permitting status and realistic timelines for your project.',
  s3Claim: 'The location is the strategy. We are the execution.',
  imgCap: 'Dresden — microelectronics cluster',
  imgAlt: 'The Dresden skyline, its reflection dissolving into a circuit board',

  s4Title: 'What carries a project through to operation.',

  s5Title: 'An initial assessment in 30 minutes.',
  s5Lead: 'Where you stand today, what would be possible in Dresden, what it realistically takes.',
  s5Scarcity: 'Conversations are confidential, under NDA on request.',
  addr2: '+49 351 000 000',
  fName: 'Name',
  fCompany: 'Company',
  fMail: 'Email',
  fMsg: 'Project',
  fSend: 'Request assessment',
  fSending: 'Sending …',
  fRequired: 'Please fill this in.',
  fBadMail: 'Please enter a valid email address.',
  fInvalid: 'Please check the highlighted fields.',
  fRate: 'Too many requests in a short time. Please try again later or write to us directly:',
  fFailed: 'Your enquiry could not be sent just now. Please write to us directly:',
  fDoneTitle: 'Thank you. Your enquiry has reached us.',
  fDoneBody: 'We will get back to you. A short confirmation is on its way to your email address.',
  fFailTitle: 'Your enquiry did not get through.',
  fFailBody:
    'The form could not be sent. Please check your details and try again, or write to us directly:',
  fBackToForm: 'Back to the form',
  htmlTitleSent: 'Enquiry sent | Sanktum',
  htmlTitleFailed: 'Enquiry not sent | Sanktum',
  fPrivacy: 'We use your details to answer your enquiry and to protect the form from misuse. More in our',
  fPrivacyLink: 'privacy policy',

  capLabel: 'Capital & site development',
  capTitle: 'The market is coming here.\nAccess to it is not.',
  capBody:
    'The manufacturers arriving here need sites, suppliers, service providers and capital. None of it goes to anyone who does not know what the sector requires. We know those requirements, and we know the manufacturers.',
  capNote:
    'This is neither an advisory mandate nor a fund vehicle.',
  capCta: 'Request a confidential conversation',

  imprint: 'Legal notice',
  privacy: 'Privacy',
  privacyTitle: 'Privacy policy',
  htmlTitleImprint: 'Legal notice | Sanktum',
  htmlTitlePrivacy: 'Privacy policy | Sanktum',
  legalLabel: 'Legal',
  legalBack: 'Home page',
  legalClose: 'Close',

  railStops: [
    'A-01 Challenge',
    'A-02 Why Saxony',
    'B-01.1 Arrive',
    'B-01.2 Operate',
    'B-01.3 Grow',
    'C-01 Contact',
    'D-01 Capital',
  ],

  figures: [
    { v: 'EUR 739bn', k: 'Defence spending of European NATO members, 2025' },
    { v: 'EUR 117.2bn', k: 'German defence budget 2026' },
    { v: '40 km', k: 'To flight test facilities in Kamenz' },
    { v: '2 h', k: 'To Berlin and the Polish border' },
  ],

  constraints: [
    { n: '01', t: 'Production readiness in months, not years' },
    { n: '02', t: 'Volumes that carry a procurement decision' },
    { n: '03', t: 'Labour costs that do not eat into the margin' },
    { n: '04', t: 'Logistics that reach the main market' },
    { n: '05', t: 'Proximity to the technologies the product depends on' },
    { n: '06', t: 'A partner with first-hand experience in defence and security' },
  ],

  axes: [
    {
      n: '01',
      t: 'Chip proximity',
      fig: '1 in 3',
      figLabel:
        'Share of EU semiconductor manufacturing that comes from Dresden. For automotive power semiconductors, more than half.',
      d: 'Over EUR 16bn of investment is under construction or committed: ESMC/TSMC around 10bn, Infineon around 5bn, GlobalFoundries around 1.1bn, plus Bosch. Anyone building sensors, drones or guidance systems produces where the critical component comes from.',
    },
    {
      n: '02',
      t: 'Size of the ecosystem',
      fig: '82,500',
      figLabel:
        'People employed in microelectronics and software, around 1,500 more than the previous year.',
      d: "Grenoble, Europe's second-largest cluster, reaches around 38,000. Added to this is test infrastructure within a day's travel: the AEF research and flight test centre in Kamenz, some 40 km away, focused on electric and hybrid propulsion, swarm applications, data transmission and autonomous navigation.",
    },
    {
      n: '03',
      t: 'Outlook',
      fig: '100,000',
      figLabel: 'People employed by 2030, according to Silicon Saxony projections.',
      d: 'TU Dresden and the Fraunhofer institutes form the talent base. The potential is large, availability is contested: the semiconductor industry competes for the same people. Workforce planning therefore belongs at the start of a project, not at the end.',
    },
    {
      n: '04',
      t: 'European axis',
      fig: 'EUR 46.6bn',
      figLabel: 'Polish defence budget 2026, 4.8 % of gross domestic product.',
      d: 'More than half of it is earmarked for new procurement. From Dresden, Poland and the Baltic states are within direct reach, along with the Leipzig logistics hub and short routes to Berlin.',
    },
  ],

  blocks: [
    {
      n: 'B-01.1',
      title: 'Arrive',
      body: 'Site, permitting, construction. Twenty years of building experience, applied to requirements no property developer knows.',
      items: [
        'An assessment of whether a site can meet your programme requirements at all',
        'Site requirements from defence regulations considered from the start: we know them from application, not from the manual',
        'Property access in Dresden and the surrounding region, including airport-adjacent assets',
        'Application and permitting procedures supported on the ground',
        'Tendering and coordination of all trades, construction supervision under §34c GewO',
      ],
    },
    {
      n: 'B-01.2',
      title: 'Operate',
      body: 'Administration that runs without you watching. Built from military and regulatory experience. Plus the ability to build processes digitally rather than merely administer them.',
      items: [
        'The prerequisites for industrial security clearance, established and documented',
        'Security-compliant workflows for handling classified material',
        'Digitalised administrative and permitting processes instead of paper and mail chains',
        'Digital project management with reporting for investors and authorities',
        'Can be run with a small team: processes replace positions, not the other way round',
        'Ongoing infrastructure management, support and optimisation',
      ],
    },
    {
      n: 'B-01.3',
      title: 'Grow',
      body: 'Network, capital, procurement. Grown over two decades in financial markets and defence.',
      items: [
        'Access to end users and procurement authorities',
        'Strategic and geopolitical assessment for expansion decisions',
        'A project already introduced to capital providers and political decision-makers',
        'Networking events between the German defence hubs and Dresden',
        'Curated service provider network',
      ],
    },
  ],

  capItems: [
    { n: '01', t: 'Participation in site and project vehicles' },
    { n: '02', t: 'Site development with municipalities and state politics' },
    { n: '03', t: 'Access to the manufacturer and procurement world' },
    { n: '04', t: 'Structuring across equity, debt and public funding' },
  ],

  photoPending: 'Portrait to follow',

  people: [
    {
      photo: 'viktorFink',
      name: 'Viktor Fink',
      role: 'Mandate responsibility',
      bio: 'Military background, defence and strategic assessment.',
      phone: '+49 351 000 001',
      mail: 'v.fink@sanktum.de',
    },
    {
      photo: 'dennisArians',
      name: 'Dennis Arians',
      role: 'Mandate responsibility',
      bio: 'Military background, defence IT and security-compliant processes.',
      phone: '+49 351 000 002',
      mail: 'd.arians@sanktum.de',
    },
    {
      photo: 'erikEckert',
      name: 'Erik Eckert',
      role: 'Mandate responsibility',
      bio: 'Infrastructure, permitting and site development.',
      phone: '+49 351 000 003',
      mail: 'e.eckert@sanktum.de',
    },
    {
      photo: 'holgerWeller',
      name: 'Holger Weller',
      role: 'Mandate responsibility',
      bio: 'Capital structures, sales and industry network.',
      phone: '+49 351 000 004',
      mail: 'h.weller@sanktum.de',
    },
  ],
};

export const dictionaries: Record<Lang, Copy> = { de, en };

/** Keys of `Copy` that hold a single string — a title, a label, one line of text. */
export type TextKey = { [K in keyof Copy]: Copy[K] extends string ? K : never }[keyof Copy];

/** The language served from the unprefixed route, `/`. */
export const DEFAULT_LANG: Lang = 'de';

/**
 * Narrows what Astro derived from the URL to a language we actually carry.
 * `Astro.currentLocale` is typed as a plain string and is undefined outside a
 * configured locale, so every component goes through here rather than casting.
 */
export const langFrom = (locale: string | undefined): Lang =>
  locale === 'en' || locale === 'de' ? locale : DEFAULT_LANG;

/**
 * The same page in the given language. Every page has a twin under /en/ with
 * the same slug — /impressum/ and /en/impressum/, /kontakt/danke/ and
 * /en/kontakt/danke/ — so this is a prefix, not a table to keep in step.
 */
export const pathIn = (lang: Lang, path: string): string => {
  const german = path.replace(/^\/en(?=\/|$)/, '') || '/';
  return lang === 'en' ? `/en${german}` : german;
};

/** Brand name is a placeholder by design — one edit swaps it everywhere. */
export const BRAND = 'Sanktum Defence Partners';
