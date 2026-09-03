/**
 * Bilingual copy for the Saktum Defence Partners one-pager.
 *
 * Both dictionaries share one shape (`Copy`), so every string rendered on the
 * page can be addressed by the same dot path in either language — that is what
 * the client-side DE/EN toggle walks (see src/scripts/page.ts).
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
  /** Key into the portrait image map in src/components/Contact.astro. */
  photo: 'viktorFink' | 'dennisArians';
  name: string;
  role: string;
  bio: string;
  phone: string;
  mail: string;
}

export interface Copy {
  htmlTitle: string;
  htmlDescription: string;

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

  capLabel: string;
  capTitle: string;
  capBody: string;
  capNote: string;
  capCta: string;

  imprint: string;
  privacy: string;

  railStops: string[];
  figures: Figure[];
  constraints: Constraint[];
  axes: Axis[];
  blocks: ServiceBlock[];
  capItems: Constraint[];
  people: Person[];
}

export const de: Copy = {
  htmlTitle: 'Saktum Defence Partners — Wo aus Technologie Verteidigungsfähigkeit wird',
  htmlDescription:
    'Standortzugang, Genehmigungsverfahren und Betrieb in Dresden für Defence- und Dual-Use-Hersteller, die vom Prototyp in die Serie gehen.',

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
    'Was in der Serie zählt, entscheidet sich nicht im Entwicklungslabor, sondern an Fristen, Stückzahlen, Kostenstruktur und Zugriff auf Zulieferer. Damit ist es eine Standortfrage, bevor es eine Produktionsfrage ist.',
  s2Pull:
    'Nichts davon löst sich mit einer Halle. Es entscheidet sich am Standort und daran, wer ihn erschließt.',

  s3Title: 'Der richtige Ort. Die richtigen Leute.',
  s3Lead: 'Dresden ist der Standort, an dem Defence-Produktion in Deutschland skaliert.',
  s3bTitle: 'Wir bringen Unternehmen dorthin und in Betrieb.',
  s3bBody:
    'Standortzugang, Genehmigungsverfahren, Rüstungsvorschriften, digitale Verwaltung, Netzwerk in Wirtschaft und Politik.',
  s3bNote:
    'Vor jedem Mandat prüfen wir Flächen, Genehmigungslage und realistische Fristen für Ihr Vorhaben.',
  s3Claim: 'Der Standort ist die Strategie. Wir sind die Umsetzung.',
  imgCap: 'Dresden — Mikroelektronik-Cluster',
  imgAlt: 'Dresden bei Nacht, Blick über die Elbe auf die Altstadt',

  s4Title: 'Leistungsspektrum',

  s5Title: 'Erste Einschätzung in 30 Minuten.',
  s5Lead: 'Wo Sie heute stehen, was in Dresden möglich wäre, was es realistisch braucht.',
  s5Scarcity: 'Wir arbeiten mit einer begrenzten Zahl von Unternehmen pro Jahr.',
  addr2: '+49 351 000 000',
  fName: 'Name',
  fCompany: 'Unternehmen',
  fMail: 'E-Mail',
  fMsg: 'Vorhaben',
  fSend: 'Einschätzung anfragen',

  capLabel: 'Kapital & Standortentwicklung',
  capTitle: 'Zwei Welten, ein Bindeglied.',
  capBody:
    'Auf der einen Seite Hersteller, die Produktionskapazität brauchen. Auf der anderen Seite Family Offices, kommunale Akteure und Landespolitik, die Standortentwicklung und Anschluss an die Herstellerwelt suchen. Wir stehen zwischen beiden und führen aus.',
  capNote:
    'Dieser Zugang ist kein Beratungsmandat und kein Fondsvehikel. Gespräche werden vertraulich geführt, auf Wunsch unter NDA.',
  capCta: 'Vertrauliches Gespräch anfragen',

  imprint: 'Impressum',
  privacy: 'Datenschutz',

  railStops: [
    'A-01 Herausforderung',
    'A-02 Warum Sachsen',
    'B-01.1 Ankommen',
    'B-01.2 Betreiben',
    'B-01.3 Wachsen',
    'C-01 Kontakt',
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
  ],

  axes: [
    {
      n: '01',
      t: 'Chip-Nähe',
      fig: '1 von 3',
      figLabel:
        'In der EU gefertigten Halbleiter kommt aus Dresden. Bei Leistungshalbleitern für die Automobilindustrie über die Hälfte.',
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
      body: 'Standort, Genehmigung, Bau. Schlüsselfertig, aus 20 Jahren Immobilien- und Bauprojekten.',
      items: [
        'Immobilienzugang in Dresden und Umland, inklusive flughafennaher Assets',
        'Standortanforderungen aus Rüstungsvorschriften von Anfang an mitgedacht — wir kennen sie aus der Anwendung, nicht aus dem Handbuch',
        'Antrags- und Genehmigungsverfahren vor Ort begleitet',
        'Vergabe und Koordination aller Gewerke, Baubegleitung nach §34c GewO',
      ],
    },
    {
      n: 'B-01.2',
      title: 'Betreiben',
      body: 'Verwaltung, die läuft, ohne dass Sie hinsehen. Aufgebaut von Leuten mit militärischem und regulatorischem Hintergrund — und der Fähigkeit, Prozesse digital zu bauen statt nur zu verwalten.',
      items: [
        'Digitalisierte Verwaltungs- und Genehmigungsprozesse statt Papier und Mailketten',
        'Digitales Projektmanagement mit Reporting für Investoren und Behörden',
        'Sicherheitskonforme Workflows für den Umgang mit eingestuftem Material',
        'Mit wenig Personal betreibbar: Prozesse ersetzen Stellen, nicht umgekehrt',
        'Laufende Infrastrukturverwaltung, Betreuung und Optimierung',
      ],
    },
    {
      n: 'B-01.3',
      title: 'Wachsen',
      body: 'Netzwerk, Kapital, politischer Zugang — gewachsen über zwei Jahrzehnte in Finanzmarkt und Defence.',
      items: [
        'Netzwerkformate zwischen den Defence-Hubs im Bundesgebiet und Dresden',
        'Kuratiertes Dienstleisternetzwerk',
        'Strategische und geopolitische Einordnung für Expansionsentscheidungen',
        'Zugang zu Family Offices und politischen Entscheidern',
      ],
    },
  ],

  capItems: [
    { n: '01', t: 'Beteiligung an Standort- und Projektgesellschaften' },
    { n: '02', t: 'Standortentwicklung mit Kommunen und Landespolitik' },
    { n: '03', t: 'Anschluss an die Hersteller- und Beschaffungswelt' },
    { n: '04', t: 'Strukturierung über Eigen-, Fremd- und Fördermittel' },
  ],

  people: [
    {
      photo: 'viktorFink',
      name: 'Viktor Fink',
      role: 'Mandatsverantwortung',
      bio: 'Militärischer Hintergrund, Defence und Finanzmarkt.',
      phone: '+49 351 000 001',
      mail: 'name@example.com',
    },
    {
      photo: 'dennisArians',
      name: 'Dennis Arians',
      role: 'Mandatsverantwortung',
      bio: 'Militärischer Hintergrund, Defence und IT.',
      phone: '+49 351 000 002',
      mail: 'name@example.com',
    },
  ],
};

export const en: Copy = {
  htmlTitle: 'Saktum Defence Partners — Where technology becomes defence capability',
  htmlDescription:
    'Site access, permitting and operations in Dresden for defence and dual-use manufacturers moving from prototype to series production.',

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

  heroTitle: 'Where technology becomes defence capability.',
  heroLead: 'For companies moving from prototype to series production.',
  cta1: 'Request an initial assessment',
  cta2: 'Request the dossier',

  s2Title: 'The prototype works. Series production is a different challenge.',
  s2Body:
    'What matters in series production is not decided in the development lab but by deadlines, volumes, cost structure and supplier access. That makes it a location question before it is a production question.',
  s2Pull:
    'None of this is solved by a building. It is decided by the location and by who opens it up.',

  s3Title: 'The right place. The right people.',
  s3Lead: 'Dresden is where defence production scales in Germany.',
  s3bTitle: 'We bring companies there and into operation.',
  s3bBody:
    'Site access, permitting procedures, defence regulations, digital administration, network across industry and politics.',
  s3bNote:
    'Before every mandate we review sites, permitting status and realistic timelines for your project.',
  s3Claim: 'The location is the strategy. We are the execution.',
  imgCap: 'Dresden — microelectronics cluster',
  imgAlt: 'Dresden at night, looking across the Elbe towards the old town',

  s4Title: 'Services',

  s5Title: 'An initial assessment in 30 minutes.',
  s5Lead: 'Where you stand today, what would be possible in Dresden, what it realistically takes.',
  s5Scarcity: 'We work with a limited number of companies per year.',
  addr2: '+49 351 000 000',
  fName: 'Name',
  fCompany: 'Company',
  fMail: 'Email',
  fMsg: 'Project',
  fSend: 'Request assessment',

  capLabel: 'Capital & site development',
  capTitle: 'Two worlds, one connector.',
  capBody:
    'On one side, manufacturers who need production capacity. On the other, family offices, municipal actors and state politics looking for site development and access to the manufacturer world. We stand between the two and execute.',
  capNote:
    'This is neither an advisory mandate nor a fund vehicle. Conversations are confidential, under NDA on request.',
  capCta: 'Request a confidential conversation',

  imprint: 'Imprint',
  privacy: 'Privacy',

  railStops: [
    'A-01 Challenge',
    'A-02 Why Saxony',
    'B-01.1 Arrive',
    'B-01.2 Operate',
    'B-01.3 Grow',
    'C-01 Contact',
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
    { n: '03', t: 'Labour costs that do not eat the margin' },
    { n: '04', t: 'Logistics that reach the main market' },
    { n: '05', t: 'Proximity to the technologies the product depends on' },
  ],

  axes: [
    {
      n: '01',
      t: 'Chip proximity',
      fig: '1 in 3',
      figLabel:
        'Semiconductors manufactured in the EU come from Dresden. For automotive power semiconductors, more than half.',
      d: 'Over EUR 16bn of investment is under construction or committed: ESMC/TSMC around 10bn, Infineon around 5bn, GlobalFoundries around 1.1bn, plus Bosch. Anyone building sensors, drones or guidance systems produces where the critical component comes from.',
    },
    {
      n: '02',
      t: 'Size of the ecosystem',
      fig: '82,500',
      figLabel:
        'People employed in microelectronics and software, around 1,500 more than the previous year.',
      d: "Grenoble, Europe's second-largest cluster, reaches around 38,000. Added to this is test infrastructure within a day's radius: the AEF research and flight test centre in Kamenz, some 40 km away, focused on electric and hybrid propulsion, swarm applications, data transmission and autonomous navigation.",
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
      body: 'Site, permitting, construction. Turnkey, from 20 years of real estate and construction projects.',
      items: [
        'Property access in Dresden and the surrounding region, including airport-adjacent assets',
        'Site requirements from defence regulations considered from the start — we know them from application, not from the manual',
        'Application and permitting procedures supported on the ground',
        'Tendering and coordination of all trades, construction supervision under §34c GewO',
      ],
    },
    {
      n: 'B-01.2',
      title: 'Operate',
      body: 'Administration that runs without you watching. Built by people with military and regulatory backgrounds — and the ability to build processes digitally rather than merely administer them.',
      items: [
        'Digitalised administrative and permitting processes instead of paper and mail chains',
        'Digital project management with reporting for investors and authorities',
        'Security-compliant workflows for handling classified material',
        'Operable with little headcount: processes replace positions, not the other way round',
        'Ongoing infrastructure management, support and optimisation',
      ],
    },
    {
      n: 'B-01.3',
      title: 'Grow',
      body: 'Network, capital, political access — grown over two decades in financial markets and defence.',
      items: [
        'Network formats between the German defence hubs and Dresden',
        'Curated service provider network',
        'Strategic and geopolitical assessment for expansion decisions',
        'Access to family offices and political decision-makers',
      ],
    },
  ],

  capItems: [
    { n: '01', t: 'Participation in site and project vehicles' },
    { n: '02', t: 'Site development with municipalities and state politics' },
    { n: '03', t: 'Access to the manufacturer and procurement world' },
    { n: '04', t: 'Structuring across equity, debt and public funding' },
  ],

  people: [
    {
      photo: 'viktorFink',
      name: 'Viktor Fink',
      role: 'Mandate responsibility',
      bio: 'Military background, defence and financial markets.',
      phone: '+49 351 000 001',
      mail: 'name@example.com',
    },
    {
      photo: 'dennisArians',
      name: 'Dennis Arians',
      role: 'Mandate responsibility',
      bio: 'Military background, defence and IT.',
      phone: '+49 351 000 002',
      mail: 'name@example.com',
    },
  ],
};

export const dictionaries: Record<Lang, Copy> = { de, en };

/** Language rendered at build time; the client toggle starts from here. */
export const DEFAULT_LANG: Lang = 'de';

/** Brand name is a placeholder by design — one edit swaps it everywhere. */
export const BRAND = 'Saktum Defence Partners';
