import { servicePaths, type ServicePath } from './servicePaths';

export const projectIds = {
  physiotherapy: 'physiotherapy-seers3-scarborough',
  ophthalmic: 'ophthalmic-chairs-toronto',
} as const;

export type ProjectImageRole = 'before' | 'after' | 'hero' | 'detail' | 'completed';

export type ProjectFact = {
  key: string;
  label: string;
  value: string;
  href?: string;
};

export type EvidenceImage = {
  src: string;
  srcset?: string;
  cardSrc?: string;
  width: number;
  height: number;
  alt: string;
  caption?: string;
  fit?: 'contain' | 'cover';
};

export type ProjectImage = EvidenceImage & { role: ProjectImageRole };

export type OurWorkProjectPresentation = {
  categoryLabel: string;
  description: string;
  factKeys: readonly string[];
  layout: 'before-after';
  serviceLink?: { path: ServicePath; label: string };
};

export type Project = {
  id: string;
  title: string;
  summary?: string;
  summaryItems?: readonly string[];
  servicePaths: readonly ServicePath[];
  facts: readonly ProjectFact[];
  story?: readonly string[];
  images: readonly ProjectImage[];
  ourWorkPresentation?: OurWorkProjectPresentation;
};

export const projects = [
  {
    id: projectIds.physiotherapy,
    title: 'Ten treatment tables renewed for a Scarborough clinic',
    summary: '10 SEERS 3 tables · Scarborough · One at a time',
    servicePaths: [servicePaths.physiotherapyTables],
    facts: [
      { key: 'customer', label: 'Customer', value: 'Returning physiotherapy clinic' },
      { key: 'location', label: 'Location', value: 'Scarborough, Ontario', href: '/service-areas/scarborough' },
      { key: 'equipment', label: 'Equipment', value: 'SEERS 3 treatment tables' },
      { key: 'quantity', label: 'Quantity', value: '10 tables, one at a time' },
      { key: 'work', label: 'Work', value: 'Upholstery for the whole table; foam renewed or repaired as needed' },
      { key: 'material', label: 'Material', value: 'Light/spa green medical grade vinyl selected from Nora’s samples' },
      { key: 'schedule', label: 'Schedule', value: 'Friday 6 AM to Saturday 6 AM' },
      { key: 'turnaround-table', label: 'Turnaround for this table', value: '24 hours' },
    ],
    ourWorkPresentation: {
      categoryLabel: 'Physiotherapy',
      description: 'Ten SEERS 3 treatment tables were renewed one at a time for a Scarborough physiotherapy clinic.',
      factKeys: ['equipment', 'quantity', 'location'],
      layout: 'before-after',
      serviceLink: { path: servicePaths.physiotherapyTables, label: 'Explore physiotherapy table upholstery' },
    },
    images: [
      {
        role: 'hero',
        src: '/images/projects/physiotherapy-treatment-table-hero-original.jpg',
        srcset: '/images/projects/physiotherapy-treatment-table-hero-original.jpg 640w',
        width: 640,
        height: 480,
        alt: 'Black physiotherapy treatment table with a face opening and electrotherapy equipment in a clinic.',
        caption: 'A SEERS 3 table from the Scarborough clinic project',
      },
      {
        role: 'before',
        src: '/images/projects/physiotherapy-seers3-scarborough-before-960.webp',
        srcset: [
          '/images/projects/physiotherapy-seers3-scarborough-before-480.webp 480w',
          '/images/projects/physiotherapy-seers3-scarborough-before-640.webp 640w',
          '/images/projects/physiotherapy-seers3-scarborough-before-960.webp 960w',
          '/images/projects/physiotherapy-seers3-scarborough-before-1493.webp 1493w',
        ].join(', '),
        width: 1493,
        height: 1600,
        alt: 'Worn black upholstery with a taped, damaged face opening on a SEERS 3 treatment table before reupholstery.',
      },
      {
        role: 'after',
        src: '/images/projects/physiotherapy-seers3-scarborough-after-960.webp',
        cardSrc: '/images/projects/physiotherapy-seers3-scarborough-after-480.webp',
        srcset: [
          '/images/projects/physiotherapy-seers3-scarborough-after-480.webp 480w',
          '/images/projects/physiotherapy-seers3-scarborough-after-640.webp 640w',
          '/images/projects/physiotherapy-seers3-scarborough-after-960.webp 960w',
          '/images/projects/physiotherapy-seers3-scarborough-after-1279.webp 1279w',
        ].join(', '),
        width: 1279,
        height: 1600,
        alt: 'SEERS 3 treatment table with its padded sections upholstered in light spa green vinyl after restoration.',
      },
    ],
  },
  {
    id: projectIds.ophthalmic,
    title: 'Two ophthalmic chairs renewed in 24 hours',
    summaryItems: ['2 Midmark/Ritter chairs', 'Toronto', '24 hours'],
    servicePaths: [servicePaths.ophthalmic],
    facts: [
      { key: 'customer', label: 'Customer', value: 'Ophthalmic clinic' },
      { key: 'location', label: 'Location', value: 'Toronto, Ontario' },
      { key: 'equipment', label: 'Equipment', value: 'Midmark/Ritter automatic ophthalmic examination chairs' },
      { key: 'quantity', label: 'Quantity', value: '2 chairs' },
      { key: 'work', label: 'Work', value: 'Complete upholstery; foam renewed with localized replacement where needed' },
      { key: 'material', label: 'Material', value: 'Beige medical grade vinyl selected from Nora’s samples' },
      { key: 'schedule', label: 'Schedule', value: 'Rush project during the clinic renovation' },
      { key: 'workshop-drop-off', label: 'Workshop drop off', value: 'Customer dismantled both chairs and brought them to Nora’s workshop' },
      { key: 'turnaround', label: 'Turnaround', value: '24 hours for both chairs' },
    ],
    ourWorkPresentation: {
      categoryLabel: 'Ophthalmic',
      description: 'Two Midmark/Ritter ophthalmic chairs were renewed for a Toronto clinic in 24 hours.',
      factKeys: ['equipment', 'quantity', 'turnaround'],
      layout: 'before-after',
      serviceLink: { path: servicePaths.ophthalmic, label: 'Explore ophthalmic upholstery' },
    },
    images: [
      {
        role: 'before',
        src: '/images/projects/ophthalmic-queen-street-east-before-detail.jpg',
        srcset: '/images/projects/ophthalmic-queen-street-east-before-detail.jpg 1287w',
        width: 1287,
        height: 1716,
        alt: 'Torn black upholstery and clear tape on an ophthalmic chair.',
        caption: 'Damaged black upholstery and tape',
      },
      {
        role: 'after',
        src: '/images/projects/ophthalmic-queen-street-east-after.jpg',
        srcset: '/images/projects/ophthalmic-queen-street-east-after.jpg 1287w',
        width: 1287,
        height: 1716,
        alt: 'Beige upholstered ophthalmic examination chair in an eye examination room.',
        caption: 'Full chair after reupholstery in beige vinyl',
      },
    ],
  },
] as const satisfies readonly Project[];

export type ProjectId = (typeof projects)[number]['id'];

export function getProject(id: ProjectId): Project {
  const project = projects.find((item) => item.id === id);
  if (!project) throw new Error(`Unknown project ID: ${id}`);
  return project;
}

export function getProjectImages(id: ProjectId, role?: ProjectImageRole): readonly ProjectImage[] {
  const images = getProject(id).images;
  return role ? images.filter((image) => image.role === role) : images;
}

export function getProjectImage(id: ProjectId, role: ProjectImageRole): ProjectImage {
  const images = getProjectImages(id, role);
  if (images.length !== 1) {
    throw new Error(images.length
      ? `Project ${id} has multiple ${role} images; select one explicitly`
      : `Project ${id} has no ${role} image`);
  }
  return images[0];
}
