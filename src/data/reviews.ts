import { business } from './business';
import { projectIds, type ProjectId } from './projects';
import { servicePaths, type ServicePath } from './servicePaths';

export type ReviewExcerpt = {
  sourceFingerprint: string;
  ranges: readonly (readonly [number, number])[];
};

export type Review = {
  id: string;
  reviewerDisplayName: string;
  originalText: string;
  rating?: 1 | 2 | 3 | 4 | 5;
  sourceIdentity: 'google' | 'other';
  sourceLabel: string;
  sourceUrl?: string;
  contextLabel?: string;
  relatedProjectIds?: readonly ProjectId[];
  relatedServicePaths?: readonly ServicePath[];
  excerpts?: {
    homepage?: ReviewExcerpt;
  };
};

export const reviews = [
  {
    id: 'david-song',
    reviewerDisplayName: 'Dr. David Song',
    originalText: 'Awesome rates and beautiful workmanship for my chiropractic table. They also replaced some missing screws and cleaned up some nasty rust that I had going on with the table. Great communication as well.',
    sourceIdentity: 'google',
    sourceLabel: 'Google review',
    contextLabel: 'Chiropractic table restoration',
    relatedServicePaths: [servicePaths.chiropracticTable],
    excerpts: {
      homepage: {
        sourceFingerprint: '58a359af',
        ranges: [[0, 66], [173, 201]],
      },
    },
  },
  {
    id: 'gabriel',
    reviewerDisplayName: 'Gabriel',
    originalText: "I highly recommend Nora's Upholstery for your commercial or residential needs. This business is family run and has been supporting my medical clinics for over 12 years. Shaida, is fantastic to deal with and she has great customer service, great prices and excellent turn good around times. Support our economy by supporting local business and our trades.",
    sourceIdentity: 'google',
    sourceLabel: 'Google review',
    contextLabel: 'Medical clinic client for over 12 years',
    relatedServicePaths: [servicePaths.medicalHub],
  },
  {
    id: 'irit-frid',
    reviewerDisplayName: 'Irit Frid',
    originalText: 'I highly recommend Nora\'s upholstery! I can’t say enough about their excellent friendly service, from the first moment I made the contact to choosing the fabric and the final result. Nora’s upholstery did an AMAZING job renewing my 8 dining chairs, including replacing the fabric, foam, and upholstery. The job was done fast, professionally, and with a lot of care for the small details. Top Notch. Thank you, Nora.',
    sourceIdentity: 'google',
    sourceLabel: 'Google review',
    contextLabel: 'Eight dining chairs renewed',
    relatedServicePaths: [servicePaths.diningChairs],
  },
  {
    id: 'monica',
    reviewerDisplayName: 'Monica',
    originalText: 'Amazing experience with Nora’s company. We were in a tough spot and they were able to help us with the chair within a 24 hours turn around period.',
    rating: 5,
    sourceIdentity: 'google',
    sourceLabel: 'Google review',
    relatedProjectIds: [projectIds.ophthalmic],
  },
] as const satisfies readonly Review[];

export type ReviewId = (typeof reviews)[number]['id'];

export function getReview(id: ReviewId): (typeof reviews)[number] {
  const review = reviews.find((item) => item.id === id);
  if (!review) throw new Error(`Unknown review ID: ${id}`);
  return review;
}

export function getReviewsForProject(projectId: ProjectId, sourceReviews: readonly Review[] = reviews): readonly Review[] {
  return sourceReviews.filter((review) => review.relatedProjectIds?.includes(projectId));
}

export function getReviewSourceUrl(review: Review): string | undefined {
  return review.sourceUrl ?? (review.sourceIdentity === 'google' ? business.googleProfileUrl : undefined);
}

export function reviewTextFingerprint(text: string): string {
  let hash = 2166136261;
  for (let index = 0; index < text.length; index += 1) {
    hash ^= text.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0).toString(16).padStart(8, '0');
}

export function getReviewExcerpt(review: Review, key: 'homepage'): string {
  const excerpt = review.excerpts?.[key];
  if (!excerpt || excerpt.ranges.length < 2 || reviewTextFingerprint(review.originalText) !== excerpt.sourceFingerprint) {
    return review.originalText;
  }

  let previousEnd = -1;
  const selectedText = excerpt.ranges.map(([start, end]) => {
    if (start < previousEnd || start < 0 || end <= start || end > review.originalText.length) {
      return undefined;
    }
    previousEnd = end;
    return review.originalText.slice(start, end);
  });

  if (selectedText.some((segment) => segment === undefined)) return review.originalText;
  return selectedText.join(' … ');
}
