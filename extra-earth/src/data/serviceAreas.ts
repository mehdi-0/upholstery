export type ServiceArea = {
  slug: string;
  name: string;
  region: string;
  title: string;
  description: string;
  intro: string;
  localNote: string;
  coverage: string[];
  popularServices: { title: string; text: string; href: string }[];
};

export const serviceAreas: ServiceArea[] = [
  {
    slug: 'richmond-hill',
    name: 'Richmond Hill',
    region: 'York Region',
    title: "Upholstery in Richmond Hill, Ontario | Nora's Upholstery",
    description: 'Professional dental, medical, residential and commercial upholstery based in Richmond Hill, Ontario. Call Nora’s Upholstery to discuss pickup, delivery and timing.',
    intro: 'Nora’s Upholstery is based in Richmond Hill and restores seating for local clinics, businesses and homes. Being nearby makes it easier to discuss materials, arrange project logistics and keep downtime in mind.',
    localNote: 'Richmond Hill is our home base. Pickup and delivery are assessed from the project size, access requirements and timing rather than a visit to a fixed street address.',
    coverage: ['Richmond Hill', 'Oak Ridges', 'Langstaff', 'Elgin Mills', 'Jefferson'],
    popularServices: [
      { title: 'Dental upholstery', text: 'Dental chairs and stools restored with materials suitable for clinics and careful fit.', href: '/services/dental' },
      { title: 'Medical & chiropractic', text: 'Exam tables, treatment beds, stools and waiting room seating.', href: '/services/medical' },
      { title: 'Residential upholstery', text: 'Dining chairs, cushions, ottomans, armchairs and sofas.', href: '/services/residential' },
    ],
  },
  {
    slug: 'toronto',
    name: 'Toronto',
    region: 'Greater Toronto Area',
    title: "Upholstery Services in Toronto | Nora's Upholstery",
    description: 'Dental, medical, residential and commercial upholstery service for Toronto. Send project photos or call Nora’s Upholstery to confirm pickup, delivery and scheduling.',
    intro: 'We serve Toronto projects ranging from clinic chairs and treatment tables to restaurant seating and cherished furniture. Each estimate considers the piece, material, access, travel and the downtime your space can accommodate.',
    localNote: 'We serve neighbourhoods across the City of Toronto for clinical, commercial and residential upholstery projects. The communities listed below are examples, not service boundaries.',
    coverage: ['North York', 'Scarborough', 'Etobicoke', 'Downtown Toronto', 'Midtown Toronto'],
    popularServices: [
      { title: 'Clinical upholstery', text: 'Durable, cleanable finishes for dental, medical and chiropractic environments.', href: '/services/dental' },
      { title: 'Commercial seating', text: 'Restaurant banquettes, gym equipment, reception seating and other frequently used pieces.', href: '/services/commercial' },
      { title: 'Home furniture', text: 'Thoughtful renewal for chairs, cushions, sofas and statement pieces.', href: '/services/residential' },
    ],
  },
  {
    slug: 'vaughan',
    name: 'Vaughan',
    region: 'York Region',
    title: "Upholstery Services in Vaughan | Nora's Upholstery",
    description: 'Professional upholstery for clinics, businesses and homes in Vaughan, Ontario, including dental chairs, commercial seating and residential furniture.',
    intro: 'Nora’s Upholstery works with Vaughan clinics, commercial spaces and homeowners who need seating restored for comfort, durability and a polished finish. We plan logistics around the type and number of pieces involved.',
    localNote: 'We serve communities throughout the City of Vaughan for clinical, commercial and residential upholstery projects. The communities listed below are examples, not service boundaries.',
    coverage: ['Thornhill', 'Maple', 'Woodbridge', 'Concord', 'Kleinburg'],
    popularServices: [
      { title: 'Dental & medical', text: 'Precise upholstery for dental chairs, stools, exam tables and treatment seating.', href: '/services/dental' },
      { title: 'Commercial upholstery', text: 'Restaurant, gym, reception, hospitality and specialty seating made ready for daily use.', href: '/services/commercial' },
      { title: 'Residential furniture', text: 'Dining chairs, cushions, ottomans, armchairs and sofas refreshed for the home.', href: '/services/residential' },
    ],
  },
];

export const serviceAreaBySlug = new Map(serviceAreas.map((area) => [area.slug, area]));
