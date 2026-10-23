// Canonical service destinations used by discovery and shared evidence relationships.
export const servicePaths = {
  medicalHub: '/services/medical/',
  dentalHub: '/services/dental/',
  residentialHub: '/services/residential/',
  commercialHub: '/services/commercial/',
  medicalExamTable: '/services/medical/medical-exam-table-upholstery/',
  clinicalRepair: '/services/medical/clinical-upholstery-repair/',
  chiropracticTable: '/services/medical/chiropractic-table-upholstery/',
  clinicSeating: '/services/medical/clinic-seating-upholstery/',
  dentalChair: '/services/dental/dental-chair-upholstery/',
  dentalChairRepair: '/services/dental/dental-chair-repair/',
  dentalStool: '/services/dental/dental-stool-upholstery/',
  diningChairs: '/services/residential/dining-chair-upholstery/',
  residentialChair: '/services/residential/chair-upholstery/',
  restaurantSeating: '/services/commercial/restaurant-seating/',
  gymEquipment: '/services/commercial/gym-equipment-upholstery/',
  physiotherapyTables: '/services/medical/physiotherapy-treatment-table-upholstery/',
  ophthalmic: '/services/medical/ophthalmic-upholstery/',
  sofaSectional: '/services/residential/sofa-sectional-upholstery/',
  outdoor: '/services/residential/outdoor-upholstery/',
  bowlingRecreation: '/services/commercial/bowling-recreation-seating/',
  hospitality: '/services/commercial/hospitality-upholstery/',
  officeReception: '/services/commercial/office-reception-upholstery/',
  specialtyCommercial: '/services/commercial/specialty-commercial-upholstery/',
} as const;

export type ServicePath = (typeof servicePaths)[keyof typeof servicePaths];

// Only service pages with matching Our Work evidence receive this pathway.
export const serviceWorkLinks: Partial<Record<ServicePath, string>> = {
  [servicePaths.chiropracticTable]: '/before-after/',
  [servicePaths.clinicSeating]: '/before-after/',
  [servicePaths.dentalChair]: '/before-after/',
  [servicePaths.dentalChairRepair]: '/before-after/',
  [servicePaths.dentalStool]: '/before-after/',
  [servicePaths.diningChairs]: '/before-after/',
  [servicePaths.residentialChair]: '/before-after/',
};
