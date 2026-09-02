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
    title: "Dental, Medical & Furniture Upholstery in Richmond Hill | Nora's Upholstery",
    description: 'Dental chair, medical, residential and commercial upholstery based in Richmond Hill, Ontario. Call Nora’s Upholstery to discuss pickup, delivery and timing.',
    intro: 'Nora’s Upholstery is based in Richmond Hill and restores seating for local clinics, businesses and homes. Being nearby makes it easier to discuss materials, arrange project logistics and keep downtime in mind.',
    localNote: 'Richmond Hill is our home base. Pickup and delivery are assessed from the project size, access requirements and timing rather than a visit to a fixed street address.',
    coverage: ['Richmond Hill', 'Oak Ridges', 'Langstaff', 'Elgin Mills', 'Jefferson'],
    popularServices: [
      { title: 'Dental chair upholstery', text: 'Dental chairs and stools restored with cleanable materials and careful fit.', href: '/services/dental' },
      { title: 'Medical & chiropractic', text: 'Exam tables, treatment beds, stools and waiting room seating.', href: '/services/medical' },
      { title: 'Residential upholstery', text: 'Dining chairs, cushions, ottomans, armchairs and sofas.', href: '/services/residential' },
      { title: 'Commercial upholstery', text: 'Restaurant, gym, reception and hospitality seating for regular use.', href: '/services/commercial' },
    ],
  },
  {
    slug: 'toronto',
    name: 'Toronto',
    region: 'Greater Toronto Area',
    title: "Dental, Medical & Furniture Upholstery in Toronto | Nora's Upholstery",
    description: 'Dental chair, medical, residential and commercial upholstery service for Toronto. Send project photos or call Nora’s Upholstery to confirm pickup, delivery and scheduling.',
    intro: 'We serve Toronto projects ranging from clinic chairs and treatment tables to restaurant seating and cherished furniture. Each estimate considers the piece, material, access, travel and the downtime your space can accommodate.',
    localNote: 'We serve neighbourhoods across the City of Toronto for clinical, commercial and residential upholstery projects. The communities listed below are examples, not service boundaries.',
    coverage: ['North York', 'Scarborough', 'Etobicoke', 'Downtown Toronto', 'Midtown Toronto'],
    popularServices: [
      { title: 'Dental chair upholstery', text: 'Durable, cleanable finishes for dental chairs and operator seating.', href: '/services/dental' },
      { title: 'Medical & chiropractic', text: 'Exam tables, treatment seating, chiropractic tables and clinic stools.', href: '/services/medical' },
      { title: 'Residential upholstery', text: 'Thoughtful renewal for chairs, cushions, sofas and statement pieces.', href: '/services/residential' },
      { title: 'Commercial upholstery', text: 'Restaurant banquettes, gym equipment, reception seating and other frequently used pieces.', href: '/services/commercial' },
    ],
  },
  {
    slug: 'vaughan',
    name: 'Vaughan',
    region: 'York Region',
    title: "Dental, Medical & Furniture Upholstery in Vaughan | Nora's Upholstery",
    description: 'Professional dental chair, medical, commercial and residential upholstery in Vaughan, Ontario.',
    intro: 'Nora’s Upholstery works with Vaughan clinics, commercial spaces and homeowners who need seating restored for comfort, durability and a polished finish. We plan logistics around the type and number of pieces involved.',
    localNote: 'We serve communities throughout the City of Vaughan for clinical, commercial and residential upholstery projects. The communities listed below are examples, not service boundaries.',
    coverage: ['Thornhill', 'Maple', 'Woodbridge', 'Concord', 'Kleinburg'],
    popularServices: [
      { title: 'Dental chair upholstery', text: 'Precise upholstery for dental chairs and stools with cleanable materials.', href: '/services/dental' },
      { title: 'Medical & chiropractic', text: 'Exam tables, treatment seating, chiropractic tables and clinic stools.', href: '/services/medical' },
      { title: 'Commercial upholstery', text: 'Restaurant, gym, reception, hospitality and specialty seating made ready for daily use.', href: '/services/commercial' },
      { title: 'Residential furniture', text: 'Dining chairs, cushions, ottomans, armchairs and sofas refreshed for the home.', href: '/services/residential' },
    ],
  },
  {
    slug: 'scarborough',
    name: 'Scarborough',
    region: 'Greater Toronto Area',
    title: "Dental, Medical & Furniture Upholstery in Scarborough | Nora's Upholstery",
    description: 'Dental chair, medical, residential and commercial upholstery service for Scarborough. Send photos to Nora’s Upholstery to discuss project fit, pickup and timing.',
    intro: 'Nora’s Upholstery serves Scarborough clinics, businesses and homes with careful restoration for seating that needs to look good and stand up to regular use. We review photos, quantity and access before planning the practical next step.',
    localNote: 'Scarborough projects are planned around the type of seating, building access, number of pieces and timing. The communities below are examples rather than service boundaries.',
    coverage: ['Agincourt', 'Guildwood', 'Malvern', 'Scarborough Village', 'Wexford'],
    popularServices: [
      { title: 'Dental chair upholstery', text: 'Dental chairs and stools restored with cleanable materials for clinic use.', href: '/services/dental' },
      { title: 'Medical & chiropractic', text: 'Exam tables, treatment seating, chiropractic tables and clinic stools.', href: '/services/medical' },
      { title: 'Commercial upholstery', text: 'Restaurant, gym, reception, hospitality and specialty seating prepared for daily use.', href: '/services/commercial' },
      { title: 'Residential furniture', text: 'Dining chairs, cushions, ottomans, armchairs and sofas renewed with careful fit and finish.', href: '/services/residential' },
    ],
  },
  {
    slug: 'markham',
    name: 'Markham',
    region: 'York Region',
    title: "Dental, Medical & Furniture Upholstery in Markham | Nora's Upholstery",
    description: 'Dental chair, medical, residential and commercial upholstery service for Markham, Ontario. Discuss pickup, delivery and timing with Nora’s Upholstery.',
    intro: 'Nora’s Upholstery works with Markham clinics, businesses and homeowners to renew seating with a durable, considered finish. Each project is assessed around the piece, material, quantity and schedule.',
    localNote: 'Markham projects are coordinated from our Richmond Hill base. Pickup and delivery are confirmed around project size, access and the timing that works for your space.',
    coverage: ['Unionville', 'Milliken', 'Thornhill', 'Cornell', 'Cachet'],
    popularServices: [
      { title: 'Dental chair upholstery', text: 'Dental chairs and clinic stools restored with cleanable finishes.', href: '/services/dental' },
      { title: 'Medical & chiropractic', text: 'Exam tables, treatment seating, chiropractic tables and clinic stools.', href: '/services/medical' },
      { title: 'Commercial upholstery', text: 'Restaurant, gym, reception, hospitality and specialty seating planned around daily operation.', href: '/services/commercial' },
      { title: 'Residential furniture', text: 'Dining chairs, cushions, armchairs, sofas and other valued home furniture renewed with care.', href: '/services/residential' },
    ],
  },
  {
    slug: 'woodbridge',
    name: 'Woodbridge',
    region: 'York Region',
    title: "Dental, Medical & Furniture Upholstery in Woodbridge | Nora's Upholstery",
    description: 'Dental chair, medical, residential and commercial upholstery service for Woodbridge, Ontario, including clinic seating, business furniture and home pieces.',
    intro: 'Nora’s Upholstery serves Woodbridge clinics, commercial spaces and homes with restoration planned for comfort, durability and the way each piece is used. We begin with photos and project details, then confirm the best logistics.',
    localNote: 'Woodbridge is within our regular York Region service area. Pickup, delivery and timing are planned around the seating, access and the scope of the project.',
    coverage: ['Islington Woods', 'Weston Downs', 'Pine Valley', 'Sonoma Heights', 'Vellore Village'],
    popularServices: [
      { title: 'Dental chair upholstery', text: 'Dental chairs and stools restored for cleanable clinical use.', href: '/services/dental' },
      { title: 'Medical & chiropractic', text: 'Exam tables, treatment seating, chiropractic tables and clinic stools.', href: '/services/medical' },
      { title: 'Commercial upholstery', text: 'Restaurant, gym, reception, hospitality and specialty seating restored for frequent use.', href: '/services/commercial' },
      { title: 'Residential furniture', text: 'Dining chairs, cushions, armchairs and sofas refreshed for comfort and a polished finish.', href: '/services/residential' },
    ],
  },
];

export const serviceAreaBySlug = new Map(serviceAreas.map((area) => [area.slug, area]));
