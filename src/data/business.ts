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
  areasServed: [
    'Greater Toronto Area',
    'Southern Ontario',
    'Richmond Hill',
    'Toronto',
    'Vaughan',
    'Scarborough',
    'Woodbridge',
    'Markham',
    'Brampton',
    'Mississauga',
  ],
} as const;

/*
 * TRAVEL CONTACT MODE
 * Leave enabled as false during normal operations.
 * Before travelling, confirm the number below is registered with WhatsApp,
 * update the message if needed, then change enabled to true.
 */
export const travelContact = {
  enabled: false,
  whatsappNumber: '16479812622',
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
  areaServed: business.areasServed.map((name) => ({
    '@type': name.includes('Area') || name.includes('Ontario') ? 'AdministrativeArea' : 'City',
    name,
  })),
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
  areaServed: (service.areas ?? business.areasServed).map((name) => ({
    '@type': name.includes('Area') || name.includes('Ontario') ? 'AdministrativeArea' : 'City',
    name,
  })),
});
