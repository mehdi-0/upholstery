import { servicePaths, type ServicePath } from './servicePaths';
import type { EvidenceImage } from './projects';

export type GalleryExample = {
  id: string;
  image: EvidenceImage;
  comparison?: { before: EvidenceImage; label: string };
  label?: string;
  note?: string;
  serviceLink?: { path: ServicePath; label: string };
};

export const galleryExamples = [
  { id: 'dental-operatory', image: { src: '/images/gallery-dental-operatory.webp', width: 1350, height: 1800, alt: 'Blue dental patient chair and dentist stool with renewed upholstery in a dental operatory', fit: 'contain' }, label: 'Dental operatory', note: 'Patient chair and dentist seating finished for a busy practice', serviceLink: { path: servicePaths.dentalHub, label: 'Explore dental upholstery' } },
  {
    id: 'dialysis-chair',
    image: { src: '/images/dialysis-chair-after.webp', width: 1120, height: 1400, alt: 'Blue upholstered dialysis chair after reupholstery', fit: 'contain' },
    comparison: {
      before: { src: '/images/dialysis-chair-before.webp', width: 1120, height: 1400, alt: 'Dialysis chair with worn blue upholstery before reupholstery' },
      label: 'Compare the dialysis chair before and after reupholstery',
    },
    label: 'Dialysis chair upholstery',
    note: 'Before and after · Work by Nora’s Upholstery',
  },
  { id: 'waiting-room-blue-chairs', image: { src: '/images/gallery-waiting-room-blue-chairs.webp', width: 1800, height: 1350, alt: 'Two blue upholstered clinic waiting room chairs' }, label: 'Waiting room seating', note: 'Comfortable clinic chairs renewed in durable blue upholstery', serviceLink: { path: servicePaths.clinicSeating, label: 'Explore clinic seating' } },
  { id: 'waiting-room-fireplace', image: { src: '/images/gallery-waiting-room-fireplace.webp', width: 1800, height: 1350, alt: 'Blue upholstered clinic waiting room chairs beside a fireplace' }, label: 'Clinic seating', note: 'Cleanable seating coordinated for a welcoming patient space', serviceLink: { path: servicePaths.clinicSeating, label: 'Explore clinic seating' } },
  { id: 'dining-chairs', image: { src: '/images/gallery-dining-chairs.webp', width: 1800, height: 1350, alt: 'Eight reupholstered dining chairs around a dining table' }, label: 'Dining chairs', note: 'A coordinated dining set renewed for everyday gatherings', serviceLink: { path: servicePaths.diningChairs, label: 'Explore dining chair upholstery' } },
  { id: 'residential-chair', image: { src: '/images/gallery-residential-chair.webp', width: 1350, height: 1800, alt: 'Grey upholstered accent chair and coordinating desk chair in a home office', fit: 'contain' }, label: 'Residential', note: 'Comfort and texture brought together for a personal space', serviceLink: { path: servicePaths.residentialChair, label: 'Explore chair upholstery' } },
  { id: 'restaurant-seating', image: { src: '/images/gallery-restaurant-seating.jpg', width: 750, height: 751, alt: 'Black upholstered restaurant booth seating against a reclaimed wood wall' }, label: 'Restaurant seating', note: 'Built-in booth seating renewed for a welcoming dining space', serviceLink: { path: servicePaths.restaurantSeating, label: 'Explore restaurant seating' } },
  { id: 'restaurant-bench', image: { src: '/images/gallery-restaurant-bench.webp', width: 1200, height: 1600, alt: 'Brown upholstered restaurant bench completed in the workshop', fit: 'contain' }, label: 'Restaurant seating', note: 'Existing restaurant bench seating renewed for daily commercial use', serviceLink: { path: servicePaths.restaurantSeating, label: 'Explore restaurant seating' } },
] as const satisfies readonly GalleryExample[];

export type GalleryExampleId = (typeof galleryExamples)[number]['id'];

export function getGalleryExample(id: GalleryExampleId): GalleryExample {
  const example = galleryExamples.find((item) => item.id === id);
  if (!example) throw new Error(`Unknown gallery example ID: ${id}`);
  return example;
}
