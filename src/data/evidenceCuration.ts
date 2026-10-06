import { projectIds, type ProjectId } from './projects';
import type { GalleryExampleId } from './galleryExamples';
import type { ReviewId } from './reviews';
import { servicePaths, type ServicePath } from './servicePaths';

export type ReviewPagePresentation = {
  projectContextIds?: readonly ProjectId[];
  servicePath?: ServicePath;
};

export const ourWorkProjectIds = [
  projectIds.physiotherapy,
  projectIds.ophthalmic,
] as const satisfies readonly ProjectId[];

export const ourWorkGalleryExampleIds = [
  'dental-operatory',
  'waiting-room-blue-chairs',
  'waiting-room-fireplace',
  'dining-chairs',
  'residential-chair',
  'restaurant-seating',
  'restaurant-bench',
] as const satisfies readonly GalleryExampleId[];

export const reviewsPageIds = ['david-song', 'gabriel', 'monica', 'irit-frid'] as const satisfies readonly ReviewId[];
export const reviewsPageFeaturedId: ReviewId = 'david-song';
export const homepageFeaturedReviewId: ReviewId = 'david-song';

export const reviewPagePresentation: Partial<Record<ReviewId, ReviewPagePresentation>> = {
  'david-song': { servicePath: servicePaths.chiropracticTable },
  gabriel: { servicePath: servicePaths.medicalHub },
  monica: { projectContextIds: [projectIds.ophthalmic], servicePath: servicePaths.ophthalmic },
  'irit-frid': { servicePath: servicePaths.diningChairs },
};
