export type ServiceImage = {
  src: string;
  srcset: string;
  sizes: string;
  width: number;
  height: number;
  alt: string;
};

export type ServiceHero =
  | { variant: 'image'; image: ServiceImage; caption?: string }
  | { variant: 'editorial'; signals: readonly [string, string] };

export type ServiceFaq = {
  question: string;
  answer: string;
};

export type CustomerReview = {
  quote: string;
  attribution: string;
  source?: string;
  rating?: number;
};

export type ProjectFact = {
  label: string;
  value: string;
  href?: string;
};

export type ServiceProject = {
  heading: string;
  summary?: string;
  summaryItems?: string[];
  facts: ProjectFact[];
  story?: string[];
  before: ServiceImage;
  after: ServiceImage;
  beforeCaption?: string;
  afterCaption?: string;
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
  hero: ServiceHero;
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
  policyCopy?: string;
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

const ophthalmicBeforeImage: ServiceImage = {
  src: '/images/projects/ophthalmic-queen-street-east-before-detail.jpg',
  srcset: '/images/projects/ophthalmic-queen-street-east-before-detail.jpg 900w',
  sizes: responsiveSizes,
  width: 900,
  height: 1200,
  alt: 'Close-up of torn black upholstery and clear tape on an ophthalmic chair.',
};

const ophthalmicAfterImage: ServiceImage = {
  src: '/images/projects/ophthalmic-queen-street-east-after.jpg',
  srcset: '/images/projects/ophthalmic-queen-street-east-after.jpg 250w',
  sizes: responsiveSizes,
  width: 250,
  height: 250,
  alt: 'Beige upholstered ophthalmic examination chair in an eye-exam room.',
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
  hero: {
    variant: 'image',
    image: physiotherapyHeroImage,
    caption: 'A SEERS 3 table from the Scarborough clinic project',
  },
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

export const ophthalmicService: ServiceDetail = {
  path: '/services/medical/ophthalmic-upholstery/',
  title: 'Ophthalmic Chair Upholstery in the GTA | Nora’s Upholstery',
  description: 'Professional upholstery for ophthalmic examination chairs, patient seating and stools across Toronto and the GTA. Medical grade materials, foam restoration and rush scheduling available.',
  heading: 'Ophthalmic Upholstery',
  eyebrow: 'Medical & Chiropractic',
  intro: [
    'Nora’s reupholsters ophthalmic examination chairs and other upholstered eye-care equipment for clinics across the GTA.',
    'Medical grade upholstery and foam restoration are available for worn or damaged patient and operator seating.',
  ],
  serviceTypes: [
    'Ophthalmic upholstery',
    'Ophthalmic examination chair upholstery',
    'Patient and procedure chair upholstery',
    'Operator seating and stool upholstery',
    'Ophthalmic chair foam restoration',
  ],
  areas: ['Toronto', 'Greater Toronto Area'],
  hero: {
    variant: 'editorial',
    signals: ['Medical grade upholstery', 'Foam restoration'],
  },
  hubImage: {
    src: ophthalmicAfterImage.src,
    alt: ophthalmicAfterImage.alt,
  },
  details: {
    heading: 'What we can restore',
    scopeHeading: 'Ophthalmic chairs & seating',
    scopeCopy: 'Nora’s works across brands, models and configurations within upholstery scope.',
    scopeItems: [
      'Examination chairs',
      'Patient and procedure chairs',
      'Operator seating and stools',
      'Other upholstered ophthalmic equipment',
    ],
    materialsHeading: 'Medical grade upholstery',
    materialsCopy: 'Durable medical grade upholstery with colours available from Nora’s samples.',
    foamHeading: 'Foam restoration',
    foamCopy: 'Worn or damaged foam can be renewed or replaced where needed.',
    pickupHeading: 'Photo assessment',
    workflowCopy: 'Photos help Nora assess the upholstery approach and discuss scheduling.',
  },
  project: {
    heading: 'Two ophthalmic chairs renewed in 24 hours',
    summaryItems: ['2 Midmark/Ritter chairs', 'Toronto', '24 hours'],
    facts: [
      { label: 'Customer', value: 'Anonymous eye-care clinic / ophthalmic clinic' },
      { label: 'Location', value: 'Queen Street East, Toronto' },
      { label: 'Equipment', value: 'Midmark/Ritter automatic ophthalmic examination chairs' },
      { label: 'Quantity', value: '2 chairs' },
      { label: 'Work', value: 'Complete upholstery; foam renewed with localized replacement where needed' },
      { label: 'Material', value: 'Beige medical grade vinyl selected from Nora’s samples' },
      { label: 'Schedule', value: 'Rush project during the clinic renovation' },
      { label: 'Workshop drop-off', value: 'Customer dismantled both chairs and brought them to Nora’s workshop' },
      { label: 'Turnaround', value: '24 hours for both chairs' },
    ],
    before: ophthalmicBeforeImage,
    after: ophthalmicAfterImage,
    beforeCaption: 'Close-up detail of the damaged black upholstery and tape',
    afterCaption: 'Full chair after reupholstery in beige vinyl',
    review: {
      quote: 'Amazing experience with Nora’s company. We were in a tough spot and they were able to help us with the chair within a 24 hours turn around period.',
      attribution: 'Monica',
      source: 'Google review',
      rating: 5,
    },
  },
  faqHeading: 'Ophthalmic upholstery questions',
  faq: [
    {
      question: 'What ophthalmic equipment can you reupholster?',
      answer: 'Nora’s can reupholster ophthalmic examination chairs, patient and procedure chairs, operator seating, stools and other upholstered eye-care equipment across brands and models.',
    },
    {
      question: 'Can you reupholster powered or automatic ophthalmic examination chairs?',
      answer: 'Yes. Nora’s works on the upholstered and padded portions while preserving their fit and movement. Mechanical and electrical servicing is not included.',
    },
    {
      question: 'Can damaged foam be restored when an ophthalmic chair is reupholstered?',
      answer: 'Yes. Foam is assessed after the upholstery is removed and can be renewed or replaced in localized areas where needed. Full replacement can be completed when required.',
    },
    {
      question: 'How quickly can an ophthalmic examination chair be reupholstered?',
      answer: 'Turnaround depends on the equipment, materials and scheduling. Rush, overnight and weekend service may be available when arranged in advance. In the Queen Street East project, two Midmark/Ritter ophthalmic examination chairs were completed within 24 hours; that project timing is not a standard or guarantee.',
    },
  ],
  related: [
    { label: 'Medical & Chiropractic Upholstery', href: '/services/medical/' },
    { label: 'Medical Exam Tables', href: '/services/medical/medical-exam-table-upholstery/' },
    { label: 'Physiotherapy & Treatment Tables', href: '/services/medical/physiotherapy-treatment-table-upholstery/' },
    { label: 'Clinic Seating', href: '/services/medical/clinic-seating-upholstery/' },
  ],
  gettingStarted: {
    heading: 'Start with a few photos',
    steps: [
      'Send photos of the chair or equipment and damaged areas.',
      'Nora reviews the upholstery, foam and material options.',
      'Receive an estimate and arrange scheduling.',
    ],
  },
  policyCopy: 'Pickup and delivery are available throughout the GTA. Pricing depends on location and project.',
};
