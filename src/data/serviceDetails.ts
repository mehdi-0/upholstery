export type ServiceImage = {
  src: string;
  srcset: string;
  sizes: string;
  width: number;
  height: number;
  alt: string;
};

export type ServiceFaq = {
  question: string;
  answer: string;
};

export type CustomerReview = {
  quote: string;
  attribution: string;
};

export type ProjectFact = {
  label: string;
  value: string;
  href?: string;
};

export type ServiceProject = {
  heading: string;
  summary: string;
  facts: ProjectFact[];
  story?: string[];
  before: ServiceImage;
  after: ServiceImage;
  review?: CustomerReview;
};

export type ServiceDetail = {
  path: string;
  title: string;
  description: string;
  heading: string;
  eyebrow: string;
  intro: string[];
  serviceTypes: string[];
  areas: string[];
  heroImage: ServiceImage;
  hubImage: { src: string; alt: string };
  details: {
    heading: string;
    scopeHeading: string;
    scopeCopy: string;
    scopeItems: string[];
    materialsHeading: string;
    materialsCopy: string;
    foamHeading: string;
    foamCopy: string;
    pickupHeading: string;
    workflowCopy: string;
  };
  project: ServiceProject;
  faqHeading: string;
  faq: ServiceFaq[];
  related: { label: string; href: string }[];
  gettingStarted: {
    heading: string;
    steps: string[];
  };
};

const responsiveSizes = '(max-width: 820px) calc(100vw - 2rem), (max-width: 1280px) 48vw, 596px';

const beforeImage: ServiceImage = {
  src: '/images/projects/physiotherapy-seers3-scarborough-before-960.webp',
  srcset: [
    '/images/projects/physiotherapy-seers3-scarborough-before-480.webp 480w',
    '/images/projects/physiotherapy-seers3-scarborough-before-640.webp 640w',
    '/images/projects/physiotherapy-seers3-scarborough-before-960.webp 960w',
    '/images/projects/physiotherapy-seers3-scarborough-before-1493.webp 1493w',
  ].join(', '),
  sizes: responsiveSizes,
  width: 1493,
  height: 1600,
  alt: 'Worn black upholstery with a taped, damaged face opening on a SEERS 3 treatment table before reupholstery.',
};

const physiotherapyHeroImage: ServiceImage = {
  src: '/images/projects/physiotherapy-treatment-table-hero-original.jpg',
  srcset: '/images/projects/physiotherapy-treatment-table-hero-original.jpg 640w',
  sizes: responsiveSizes,
  width: 640,
  height: 480,
  alt: 'Black physiotherapy treatment table with a face opening and electrotherapy equipment in a clinic.',
};

const afterImage: ServiceImage = {
  src: '/images/projects/physiotherapy-seers3-scarborough-after-960.webp',
  srcset: [
    '/images/projects/physiotherapy-seers3-scarborough-after-480.webp 480w',
    '/images/projects/physiotherapy-seers3-scarborough-after-640.webp 640w',
    '/images/projects/physiotherapy-seers3-scarborough-after-960.webp 960w',
    '/images/projects/physiotherapy-seers3-scarborough-after-1279.webp 1279w',
  ].join(', '),
  sizes: responsiveSizes,
  width: 1279,
  height: 1600,
  alt: 'SEERS 3 treatment table with its padded sections upholstered in light spa green vinyl after restoration.',
};

export const physiotherapyService: ServiceDetail = {
  path: '/services/medical/physiotherapy-treatment-table-upholstery/',
  title: "Physiotherapy & Treatment Table Upholstery | Nora's Upholstery",
  description: 'Physiotherapy and treatment table reupholstery across the GTA. Complete tables, individual sections, foam restoration and medical grade vinyl. Start with photos.',
  heading: 'Physiotherapy & Treatment Table Upholstery',
  eyebrow: 'Medical & Chiropractic',
  intro: [
    'Nora’s reupholsters physiotherapy and treatment tables for clinics across the GTA, from complete tables to individual padded sections.',
    'Medical grade antibacterial and antifungal vinyl is standard for this service.',
  ],
  serviceTypes: [
    'Physiotherapy table upholstery',
    'Treatment table upholstery',
    'Medical table section upholstery',
    'Treatment table foam restoration',
  ],
  areas: ['Greater Toronto Area'],
  heroImage: physiotherapyHeroImage,
  hubImage: {
    src: '/images/projects/physiotherapy-seers3-scarborough-after-480.webp',
    alt: 'SEERS 3 physiotherapy treatment table reupholstered in light spa green vinyl.',
  },
  details: {
    heading: 'What we can restore',
    scopeHeading: 'Complete tables & individual sections',
    scopeCopy: 'All brands and models. Individual sections assessed as needed.',
    scopeItems: ['Headpieces', 'Chest and lumbar sections', 'Hand and arm sections', 'Other padded components'],
    materialsHeading: 'Medical grade vinyl',
    materialsCopy: 'Antibacterial and antifungal vinyl with colours available from Nora’s samples.',
    foamHeading: 'Foam restoration',
    foamCopy: 'Renewed or replaced where needed.',
    pickupHeading: 'Section pickup',
    workflowCopy: 'Where practical, upholstered sections can be collected while the frame stays at the clinic.',
  },
  project: {
    heading: 'Ten treatment tables renewed for a Scarborough clinic',
    summary: '10 SEERS 3 tables · Scarborough · One at a time',
    facts: [
      { label: 'Customer', value: 'Returning physiotherapy clinic' },
      { label: 'Location', value: 'Scarborough, Ontario', href: '/service-areas/scarborough' },
      { label: 'Equipment', value: 'SEERS 3 treatment tables' },
      { label: 'Quantity', value: '10 tables, one at a time' },
      { label: 'Work', value: 'Whole-table upholstery; foam renewed or repaired as needed' },
      { label: 'Material', value: 'Light/spa green medical grade vinyl selected from Nora’s samples' },
      { label: 'Schedule', value: 'Friday 6 AM to Saturday 6 AM' },
      { label: 'Turnaround for this table', value: '24 hours' },
    ],
    before: beforeImage,
    after: afterImage,
  },
  faqHeading: 'Physiotherapy table upholstery questions',
  faq: [
    {
      question: 'Can you reupholster any type of physiotherapy or treatment table?',
      answer: "Nora's works across brands, models and configurations within the scope of upholstery. Complete tables and suitable individual padded sections can be assessed from photos or in person.",
    },
    {
      question: 'Can you reupholster just one damaged section of a treatment table?',
      answer: 'Often, yes. Send photos of the damaged section and the full table so Nora can assess whether that part can be handled on its own. Reupholstering the whole table is not always necessary.',
    },
    {
      question: 'What type of upholstery do you use for physiotherapy tables?',
      answer: 'Medical grade antibacterial and antifungal vinyl is standard for this service. Choose from available samples and colours. Upholstery work does not include mechanical or electrical repairs.',
    },
    {
      question: 'How quickly can a physiotherapy table be reupholstered?',
      answer: 'Turnaround depends on the table, materials and schedule. Rush, overnight or weekend work may be available when arranged in advance. One photographed table in the Scarborough project took 24 hours from Friday at 6 AM pickup to Saturday at 6 AM return; that timing is an example, not a standard or guarantee.',
    },
  ],
  related: [
    { label: 'Medical & Chiropractic upholstery', href: '/services/medical/' },
    { label: 'Medical exam tables', href: '/services/medical/medical-exam-table-upholstery/' },
    { label: 'Chiropractic tables', href: '/services/medical/chiropractic-table-upholstery/' },
    { label: 'Clinical rebuilding', href: '/services/medical/clinical-upholstery-repair/' },
  ],
  gettingStarted: {
    heading: 'Start with a few photos',
    steps: [
      'Send photos of the whole table and damaged areas.',
      'Nora reviews the upholstery, foam and material options with you.',
      'Receive an estimate and arrange a suitable schedule.',
    ],
  },
};
