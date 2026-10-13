export const business = {
  name: "Nora's Upholstery",
  telephone: '+1-647-981-2622',
  email: 'norasupholstery@gmail.com',
  logoPath: '/logo-site.webp',
  googleProfileUrl: 'https://share.google/hH6pGfzI1YAUH9HLG',
  instagramUrl: 'https://www.instagram.com/norasupholstery/',
  facebookUrl: 'https://www.facebook.com/p/Nora-Upholstery-100010883763180/',
  homeLocality: 'Richmond Hill',
  homeRegion: 'Ontario',
  country: 'CA',
} as const;

export const serviceCoverage = {
  regularRegions: ['Greater Toronto Area'],
  regularLocations: [
    { name: 'Richmond Hill', schemaType: 'City' },
    { name: 'Toronto', schemaType: 'City' },
    { name: 'Vaughan', schemaType: 'City' },
    { name: 'Brampton', schemaType: 'City' },
    { name: 'King City', schemaType: 'Place' },
    { name: 'Markham', schemaType: 'City' },
    { name: 'Mississauga', schemaType: 'City' },
    { name: 'Newmarket', schemaType: 'Place' },
    { name: 'Aurora', schemaType: 'Place' },
    { name: 'Oak Ridges', schemaType: 'Place' },
    { name: 'Scarborough', schemaType: 'Place' },
    { name: 'Woodbridge', schemaType: 'Place' },
  ],
  extendedRegion: 'Southern Ontario',
  extendedLocations: ['Hamilton', 'Burlington', 'Oakville', 'Guelph', 'Kitchener and Waterloo', 'Barrie', 'Niagara Region'],
} as const;

const schemaAreasServed = [
  ...serviceCoverage.regularRegions.map((name) => ({ '@type': 'AdministrativeArea', name })),
  { '@type': 'AdministrativeArea', name: serviceCoverage.extendedRegion },
  ...serviceCoverage.regularLocations.map(({ name, schemaType }) => ({ '@type': schemaType, name })),
];

const phoneDigits = business.telephone.replace(/\D/g, '');
export const phoneDisplay = business.telephone.replace(/^\+1-/, '');
export const phoneHref = `tel:+${phoneDigits}`;

/*
 * TRAVEL CONTACT MODE
 * Leave enabled as false during normal operations.
 * Before travelling, confirm the number below is registered with WhatsApp,
 * update the message if needed, then change enabled to true.
 */
export const travelContact = {
  enabled: false,
  whatsappNumber: phoneDigits,
  whatsappMessage: "Hello Nora's Upholstery, I would like to discuss an upholstery project.",
  notice: 'We are currently travelling. WhatsApp and email are the best ways to reach us.',
} as const;

export const whatsappUrl = `https://wa.me/${travelContact.whatsappNumber}?text=${encodeURIComponent(travelContact.whatsappMessage)}`;

export type ServiceSchemaInput = {
  name: string;
  description: string;
  path: string;
  serviceTypes: string[];
  areas?: string[];
};

export const absoluteUrl = (origin: string, path: string) =>
  new URL(path, origin.endsWith('/') ? origin : `${origin}/`).toString();

export const organizationSchema = (origin: string) => ({
  '@type': 'Organization',
  '@id': absoluteUrl(origin, '/#organization'),
  name: business.name,
  url: absoluteUrl(origin, '/'),
  logo: {
    '@type': 'ImageObject',
    url: absoluteUrl(origin, business.logoPath),
  },
  telephone: business.telephone,
  email: business.email,
  location: {
    '@type': 'Place',
    address: {
      '@type': 'PostalAddress',
      addressLocality: business.homeLocality,
      addressRegion: business.homeRegion,
      addressCountry: business.country,
    },
  },
  areaServed: schemaAreasServed,
  sameAs: [
    business.googleProfileUrl,
    business.instagramUrl,
    business.facebookUrl,
  ],
});

export const websiteSchema = (origin: string) => ({
  '@type': 'WebSite',
  '@id': absoluteUrl(origin, '/#website'),
  url: absoluteUrl(origin, '/'),
  name: business.name,
  publisher: { '@id': absoluteUrl(origin, '/#organization') },
  inLanguage: 'en-CA',
});

export const serviceSchema = (origin: string, service: ServiceSchemaInput) => ({
  '@type': 'Service',
  '@id': absoluteUrl(origin, `${service.path}#service`),
  name: service.name,
  description: service.description,
  url: absoluteUrl(origin, service.path),
  provider: { '@id': absoluteUrl(origin, '/#organization') },
  serviceType: service.serviceTypes,
  areaServed: (service.areas ?? schemaAreasServed.map(({ name }) => name)).map((name) =>
    schemaAreasServed.find((area) => area.name === name) ?? { '@type': 'Place', name },
  ),
});
