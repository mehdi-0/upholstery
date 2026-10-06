// Canonical service destinations used by shared evidence relationships.
export const servicePaths = {
  medicalHub: '/services/medical/',
  dentalHub: '/services/dental/',
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
