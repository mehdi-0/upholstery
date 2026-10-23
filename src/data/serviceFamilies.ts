import { servicePaths, type ServicePath } from './servicePaths';

export type FamilyService = { label: string; href: ServicePath };

// The four existing hubs and every established child route, shared by both entry pages.
export const serviceFamilies = [
  {
    id: 'dental', number: '01', name: 'Dental', href: servicePaths.dentalHub,
    description: 'Dental chairs, dentist chairs and assistant stools.',
    image: '/images/service-dental-v2.webp',
    services: [
      { label: 'Dental chair upholstery', href: servicePaths.dentalChair },
      { label: 'Dental stool & dentist chair upholstery', href: servicePaths.dentalStool },
      { label: 'Dental chair foam & upholstery repair', href: servicePaths.dentalChairRepair },
    ],
  },
  {
    id: 'medical', number: '02', name: 'Medical & Chiropractic', href: servicePaths.medicalHub,
    description: 'Exam and treatment tables, chiropractic tables and clinic seating.',
    image: '/images/service-medical-v2.webp',
    services: [
      { label: 'Physiotherapy & treatment table upholstery', href: servicePaths.physiotherapyTables },
      { label: 'Chiropractic table upholstery', href: servicePaths.chiropracticTable },
      { label: 'Ophthalmic upholstery', href: servicePaths.ophthalmic },
      { label: 'Medical exam table upholstery', href: servicePaths.medicalExamTable },
      { label: 'Clinic & waiting room seating upholstery', href: servicePaths.clinicSeating },
      { label: 'Clinical upholstery repair & foam rebuilding', href: servicePaths.clinicalRepair },
    ],
  },
  {
    id: 'residential', number: '03', name: 'Residential & Outdoor', href: servicePaths.residentialHub,
    description: 'Sofas, chairs, outdoor cushions and selected boat seating.',
    image: '/images/service-residential.webp',
    services: [
      { label: 'Sofa & sectional upholstery', href: servicePaths.sofaSectional },
      { label: 'Chair & recliner upholstery', href: servicePaths.residentialChair },
      { label: 'Dining chair upholstery', href: servicePaths.diningChairs },
      { label: 'Outdoor cushion & patio upholstery', href: servicePaths.outdoor },
    ],
  },
  {
    id: 'commercial', number: '04', name: 'Commercial', href: servicePaths.commercialHub,
    description: 'Restaurant booths, gym equipment, offices and hospitality seating.',
    image: '/images/service-commercial.webp',
    services: [
      { label: 'Restaurant booth & banquette upholstery', href: servicePaths.restaurantSeating },
      { label: 'Gym equipment upholstery', href: servicePaths.gymEquipment },
      { label: 'Bowling & recreation seating upholstery', href: servicePaths.bowlingRecreation },
      { label: 'Hotel & hospitality upholstery', href: servicePaths.hospitality },
      { label: 'Office & reception seating upholstery', href: servicePaths.officeReception },
      { label: 'Specialty commercial upholstery', href: servicePaths.specialtyCommercial },
    ],
  },
] as const satisfies readonly {
  id: string; number: string; name: string; href: ServicePath;
  description: string; image: string; services: readonly FamilyService[];
}[];
