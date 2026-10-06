import { getProject, getProjectImage, projects, type EvidenceImage, type Project, type ProjectFact, type ProjectId, type ProjectImage } from './projects';
import { getReview, reviewTextFingerprint, reviews, type Review, type ReviewId } from './reviews';
import { servicePaths, type ServicePath } from './servicePaths';
import { serviceDetails, type ServiceDetail, type ServiceImage } from './serviceDetails';
import { galleryExamples, type GalleryExample } from './galleryExamples';
import {
  homepageFeaturedReviewId,
  ourWorkGalleryExampleIds,
  ourWorkProjectIds,
  reviewPagePresentation,
  reviewsPageFeaturedId,
  reviewsPageIds,
} from './evidenceCuration';

const serviceProjectSizes = '(max-width: 820px) calc(100vw - 2rem), (max-width: 1280px) 48vw, 596px';

export type ServiceProjectReview = {
  quote: string;
  attribution: string;
  source?: string;
  rating?: number;
};

export type ServiceProjectPresentation = {
  projectId: ProjectId;
  ourWorkHref?: string;
  heading: string;
  summary?: string;
  summaryItems?: readonly string[];
  facts: readonly ProjectFact[];
  story?: readonly string[];
  before: ServiceImage;
  after: ServiceImage;
  beforeCaption?: string;
  afterCaption?: string;
  review?: ServiceProjectReview;
};

export function getProjectsForService(servicePath: ServicePath, sourceProjects: readonly Project[] = projects): readonly Project[] {
  return sourceProjects.filter((project) => project.servicePaths.includes(servicePath));
}

export function getServiceFeaturedProjectIds(service: ServiceDetail): readonly ProjectId[] {
  return service.evidencePresentation?.featuredProjectIds ?? [];
}

export function getServiceFeaturedProjectId(service: ServiceDetail): ProjectId | undefined {
  // The current service page shows one project, selected by the first ID in this presentation-only list.
  return getServiceFeaturedProjectIds(service)[0];
}

export function getServiceHeroImage(service: ServiceDetail): ServiceImage | undefined {
  if (service.hero.variant !== 'project-image') return undefined;
  const projectId = getServiceFeaturedProjectId(service);
  if (!projectId) return undefined;
  const project = getProject(projectId);
  assertProjectSupportsService(project, service.path);
  return toServiceImage(getProjectImage(project.id, service.hero.role));
}

export function getServiceProject(service: ServiceDetail): ServiceProjectPresentation | undefined {
  const projectId = getServiceFeaturedProjectId(service);
  if (!projectId) return undefined;
  const project = getProject(projectId);
  assertProjectSupportsService(project, service.path);

  const before = getProjectImage(project.id, 'before');
  const after = getProjectImage(project.id, 'after');
  const selectedReviewId = service.evidencePresentation?.featuredReviewId;
  const selectedReview = selectedReviewId ? getReview(selectedReviewId) : undefined;

  return {
    projectId: project.id,
    ourWorkHref: ourWorkProjectIds.includes(project.id) ? `/before-after/#${project.id}` : undefined,
    heading: project.title,
    summary: project.summary,
    summaryItems: project.summaryItems,
    facts: project.facts,
    story: project.story,
    before: toServiceImage(before),
    after: toServiceImage(after),
    beforeCaption: before.caption,
    afterCaption: after.caption,
    review: selectedReview ? toServiceProjectReview(selectedReview) : undefined,
  };
}

export function getProjectCardImage(projectId: ProjectId, role: 'after' | 'completed' = 'after'): ProjectImagePresentation {
  const image = getProjectImage(projectId, role);
  return {
    src: image.cardSrc ?? image.src,
    alt: image.alt,
  };
}

export type ProjectImagePresentation = Pick<ServiceImage, 'src' | 'alt'>;

function toServiceImage(image: ProjectImage): ServiceImage {
  return {
    src: image.src,
    srcset: image.srcset ?? `${image.src} ${image.width}w`,
    sizes: serviceProjectSizes,
    width: image.width,
    height: image.height,
    alt: image.alt,
    caption: image.caption,
  };
}

function toServiceProjectReview(review: Review): ServiceProjectReview {
  return {
    quote: review.originalText,
    attribution: review.reviewerDisplayName,
    source: review.sourceLabel,
    rating: review.rating,
  };
}

function assertProjectSupportsService(project: Project, servicePath: ServicePath): void {
  if (!project.servicePaths.includes(servicePath)) {
    throw new Error(`Project ${project.id} is not related to service ${servicePath}`);
  }
}

function duplicateValues(values: readonly string[]): string[] {
  return values.filter((value, index) => values.indexOf(value) !== index);
}

function checkImageMetadata(image: EvidenceImage, owner: string, errors: string[]): void {
  if (!image.src || !image.alt.trim() || image.width <= 0 || image.height <= 0) {
    errors.push(`${owner} has incomplete image metadata`);
  }
}

export type EvidenceIntegrityInput = {
  projects: readonly Project[];
  reviews: readonly Review[];
  serviceDetails: readonly ServiceDetail[];
  knownServicePaths: readonly ServicePath[];
  galleryExamples: readonly GalleryExample[];
  ourWorkProjectIds: readonly ProjectId[];
  ourWorkGalleryExampleIds: readonly string[];
  reviewsPageIds: readonly ReviewId[];
  reviewsPageFeaturedId: ReviewId;
  homepageFeaturedReviewId: ReviewId;
  reviewPagePresentation: Partial<Record<ReviewId, { projectContextIds?: readonly ProjectId[]; servicePath?: ServicePath }>>;
};

export function getEvidenceIntegrityErrors(input: EvidenceIntegrityInput): string[] {
  const errors: string[] = [];
  const projectIds = input.projects.map((project) => project.id);
  const reviewIds = input.reviews.map((review) => review.id);
  const galleryIds = input.galleryExamples.map((example) => example.id);
  const knownProjects = new Set(projectIds);
  const knownReviews = new Set(reviewIds);
  const knownGallery = new Set(galleryIds);
  const knownPaths = new Set(input.knownServicePaths);
  const curatedProjects = new Set(input.ourWorkProjectIds);

  for (const id of duplicateValues(projectIds)) errors.push(`Duplicate project ID: ${id}`);
  for (const id of duplicateValues(reviewIds)) errors.push(`Duplicate review ID: ${id}`);
  for (const id of duplicateValues(galleryIds)) errors.push(`Duplicate gallery example ID: ${id}`);
  for (const path of duplicateValues(input.serviceDetails.map((service) => service.path))) {
    errors.push(`Duplicate service detail path: ${path}`);
  }

  const checkSelectedIds = (ids: readonly string[], known: Set<string>, label: string) => {
    for (const id of duplicateValues(ids)) errors.push(`Duplicate curated ${label} ID: ${id}`);
    for (const id of ids) if (!known.has(id)) errors.push(`Curated ${label} references unknown ID: ${id}`);
  };
  checkSelectedIds(input.ourWorkProjectIds, knownProjects, 'Our Work project');
  checkSelectedIds(input.ourWorkGalleryExampleIds, knownGallery, 'Our Work gallery example');
  checkSelectedIds(input.reviewsPageIds, knownReviews, 'Reviews page review');

  if (!knownReviews.has(input.reviewsPageFeaturedId)) {
    errors.push(`Reviews page selects unknown featured review ${input.reviewsPageFeaturedId}`);
  } else if (!input.reviewsPageIds.includes(input.reviewsPageFeaturedId)) {
    errors.push(`Featured Reviews page review ${input.reviewsPageFeaturedId} is not included in its curation`);
  }
  if (!knownReviews.has(input.homepageFeaturedReviewId)) {
    errors.push(`Homepage selects unknown featured review ${input.homepageFeaturedReviewId}`);
  }

  for (const review of input.reviews) {
    const relatedProjectIds = review.relatedProjectIds ?? [];
    const relatedServicePaths = review.relatedServicePaths ?? [];
    for (const id of duplicateValues(relatedProjectIds)) errors.push(`Review ${review.id} has duplicate project relationship ${id}`);
    for (const id of relatedProjectIds) {
      if (!knownProjects.has(id)) errors.push(`Review ${review.id} references unknown project ${id}`);
    }
    for (const path of duplicateValues(relatedServicePaths)) errors.push(`Review ${review.id} has duplicate service relationship ${path}`);
    for (const path of relatedServicePaths) {
      if (!knownPaths.has(path)) errors.push(`Review ${review.id} references unknown service ${path}`);
    }
    const excerpt = review.excerpts?.homepage;
    if (excerpt) {
      if (excerpt.ranges.length < 2) errors.push(`Review ${review.id} homepage excerpt must show omitted text with an ellipsis`);
      if (reviewTextFingerprint(review.originalText) !== excerpt.sourceFingerprint) {
        errors.push(`Review ${review.id} homepage excerpt fingerprint does not match its original text`);
      }
      let previousEnd = -1;
      for (const [start, end] of excerpt.ranges) {
        if (start < previousEnd || start < 0 || end <= start || end > review.originalText.length) {
          errors.push(`Review ${review.id} has invalid homepage excerpt ranges`);
          break;
        }
        previousEnd = end;
      }
    }
  }

  for (const project of input.projects) {
    const servicePathList = project.servicePaths;
    for (const path of duplicateValues(servicePathList)) errors.push(`Project ${project.id} has duplicate service relationship ${path}`);
    for (const path of servicePathList) {
      if (!knownPaths.has(path)) errors.push(`Project ${project.id} references unknown service ${path}`);
    }
    const factKeys = project.facts.map((fact) => fact.key);
    for (const key of duplicateValues(factKeys)) errors.push(`Project ${project.id} has duplicate fact key ${key}`);
    for (const image of project.images) checkImageMetadata(image, `Project ${project.id} ${image.role} image`, errors);

    const presentation = project.ourWorkPresentation;
    if (presentation) {
      for (const key of presentation.factKeys) {
        if (!factKeys.includes(key)) errors.push(`Project ${project.id} Our Work presentation selects missing fact ${key}`);
      }
      if (presentation.serviceLink) {
        if (!knownPaths.has(presentation.serviceLink.path)) {
          errors.push(`Project ${project.id} Our Work presentation references unknown service ${presentation.serviceLink.path}`);
        }
        if (!servicePathList.includes(presentation.serviceLink.path)) {
          errors.push(`Project ${project.id} Our Work service link is not supported by its service relationships`);
        }
      }
    }
  }

  for (const id of input.ourWorkProjectIds) {
    const project = input.projects.find((item) => item.id === id);
    if (!project) continue;
    if (!project.ourWorkPresentation) {
      errors.push(`Curated Our Work project ${id} has no presentation metadata`);
      continue;
    }
    if (project.ourWorkPresentation.layout === 'before-after') {
      for (const role of ['before', 'after'] as const) {
        const matchingImages = project.images.filter((image) => image.role === role);
        if (matchingImages.length !== 1) {
          errors.push(`Curated Our Work project ${id} requires exactly one ${role} image for its comparison presentation`);
        }
      }
    }
  }

  for (const example of input.galleryExamples) {
    checkImageMetadata(example.image, `Gallery example ${example.id}`, errors);
    if (example.serviceLink && !knownPaths.has(example.serviceLink.path)) {
      errors.push(`Gallery example ${example.id} references unknown service ${example.serviceLink.path}`);
    }
  }

  for (const [reviewId, presentation] of Object.entries(input.reviewPagePresentation)) {
    const review = input.reviews.find((item) => item.id === reviewId);
    if (!review) {
      errors.push(`Reviews page presentation references unknown review ${reviewId}`);
      continue;
    }
    const projectIdsForContext = presentation.projectContextIds ?? [];
    for (const id of duplicateValues(projectIdsForContext)) errors.push(`Review ${reviewId} has duplicate curated project context ${id}`);
    for (const id of projectIdsForContext) {
      const project = input.projects.find((item) => item.id === id);
      if (!project) {
        errors.push(`Review ${reviewId} selects unknown project context ${id}`);
        continue;
      }
      if (!review.relatedProjectIds?.includes(id)) errors.push(`Review ${reviewId} selects unrelated project context ${id}`);
      if (!curatedProjects.has(id)) errors.push(`Review ${reviewId} links to project ${id}, which is not published in Our Work`);
    }
    if (presentation.servicePath) {
      if (!knownPaths.has(presentation.servicePath)) {
        errors.push(`Review ${reviewId} selects unknown service path ${presentation.servicePath}`);
      } else {
        const projectSupportsService = projectIdsForContext.some((id) =>
          input.projects.find((project) => project.id === id)?.servicePaths.includes(presentation.servicePath as ServicePath),
        );
        if (!review.relatedServicePaths?.includes(presentation.servicePath) && !projectSupportsService) {
          errors.push(`Review ${reviewId} selects unsupported service path ${presentation.servicePath}`);
        }
      }
    }
  }

  for (const service of input.serviceDetails) {
    const selectedProjectIds = service.evidencePresentation?.featuredProjectIds ?? [];
    for (const id of duplicateValues(selectedProjectIds)) errors.push(`Service ${service.path} has duplicate selected project ${id}`);
    for (const id of selectedProjectIds) {
      const project = input.projects.find((item) => item.id === id);
      if (!project) {
        errors.push(`Service ${service.path} selects unknown project ${id}`);
        continue;
      }
      if (!project.servicePaths.includes(service.path)) errors.push(`Service ${service.path} selects unrelated project ${id}`);
    }

    const displayedProjectId = selectedProjectIds[0];
    const featuredReviewId = service.evidencePresentation?.featuredReviewId;
    if (featuredReviewId) {
      const review = input.reviews.find((item) => item.id === featuredReviewId);
      if (!review) {
        errors.push(`Service ${service.path} selects unknown featured review ${featuredReviewId}`);
      } else if (!displayedProjectId || !review.relatedProjectIds?.includes(displayedProjectId)) {
        errors.push(`Service ${service.path} featured review ${featuredReviewId} is not related to its displayed project`);
      }
    }

    if (displayedProjectId) {
      const project = input.projects.find((item) => item.id === displayedProjectId);
      if (project) {
        if (service.hero.variant === 'project-image') {
          const heroImages = project.images.filter((image) => image.role === service.hero.role);
          if (heroImages.length !== 1) errors.push(`Service ${service.path} hero selection requires exactly one ${service.hero.role} image`);
        }
        for (const role of ['before', 'after'] as const) {
          const roleImages = project.images.filter((image) => image.role === role);
          if (roleImages.length !== 1) errors.push(`Service ${service.path} evidence presentation requires exactly one ${role} image`);
        }
      }
    }
  }

  return errors;
}

export function assertEvidenceIntegrity(): void {
  const errors = getEvidenceIntegrityErrors({
    projects,
    reviews,
    serviceDetails,
    knownServicePaths: Object.values(servicePaths),
    galleryExamples,
    ourWorkProjectIds,
    ourWorkGalleryExampleIds,
    reviewsPageIds,
    reviewsPageFeaturedId,
    homepageFeaturedReviewId,
    reviewPagePresentation,
  });
  if (errors.length) throw new Error(`Evidence integrity failed:\n- ${errors.join('\n- ')}`);
}

assertEvidenceIntegrity();
