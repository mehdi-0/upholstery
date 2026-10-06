import { projectIds, type ProjectId } from './projects';
import { servicePaths } from './servicePaths';

export type ServiceImage = {
  src: string;
  srcset: string;
  sizes: string;
  width: number;
  height: number;
  alt: string;
  caption?: string;
};

export type ServiceHero =
  | { variant: 'project-image'; role: 'hero' }
  | { variant: 'editorial'; signals: readonly [string, string] };

export type ServiceFaq = {
  question: string;
  answer: string;
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
  projectId: ProjectId;
  hero: ServiceHero;
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
  faqHeading: string;
  faq: ServiceFaq[];
  related: { label: string; href: string }[];
  gettingStarted: {
    heading: string;
    steps: string[];
  };
  policyCopy?: string;
};

export const physiotherapyService: ServiceDetail = {
  path: servicePaths.physiotherapyTables,
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
  projectId: projectIds.physiotherapy,
  hero: {
    variant: 'project-image',
    role: 'hero',
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
  path: servicePaths.ophthalmic,
  title: 'Ophthalmic Chair Upholstery in the GTA | Nora’s Upholstery',
  description: 'Professional upholstery for ophthalmic examination chairs, patient seating and stools across Toronto and the GTA. Medical grade materials, foam restoration and rush scheduling available.',
  heading: 'Ophthalmic Upholstery',
  eyebrow: 'Medical & Chiropractic',
  intro: [
    'Nora’s reupholsters ophthalmic examination chairs and other upholstered equipment used in eye care for clinics across the GTA.',
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
  projectId: projectIds.ophthalmic,
  hero: {
    variant: 'editorial',
    signals: ['Medical grade upholstery', 'Foam restoration'],
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
  faqHeading: 'Ophthalmic upholstery questions',
  faq: [
    {
      question: 'What ophthalmic equipment can you reupholster?',
      answer: 'Nora’s can reupholster ophthalmic examination chairs, patient and procedure chairs, operator seating, stools and other upholstered equipment used in eye care across brands and models.',
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
      answer: 'Turnaround depends on the equipment, materials and scheduling. Rush, overnight and weekend service may be available when arranged in advance. In the Toronto project, two Midmark/Ritter ophthalmic examination chairs were completed within 24 hours; that project timing is not a standard or guarantee.',
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
