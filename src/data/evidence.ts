import { getProject, getProjectImage, projects, type Project, type ProjectFact, type ProjectId } from './projects';
import { getReviewsForProject, reviewTextFingerprint, reviews, type Review } from './reviews';
import { servicePaths } from './servicePaths';
import { ophthalmicService, physiotherapyService, type ServiceDetail, type ServiceImage } from './serviceDetails';

const serviceProjectSizes = '(max-width: 820px) calc(100vw - 2rem), (max-width: 1280px) 48vw, 596px';
const knownServicePaths = new Set<string>(Object.values(servicePaths));

export type ServiceProjectReview = {
  quote: string;
  attribution: string;
  source?: string;
  rating?: number;
};

export type ServiceProjectPresentation = {
  projectId: ProjectId;
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

export function getServiceHeroImage(service: ServiceDetail): ServiceImage | undefined {
  if (service.hero.variant !== 'project-image') return undefined;
  const project = getProject(service.projectId);
  assertProjectSupportsService(project, service.path);
  return toServiceImage(getProjectImage(project.id, service.hero.role));
}

export function getServiceProject(service: ServiceDetail): ServiceProjectPresentation {
  const project = getProject(service.projectId);
  assertProjectSupportsService(project, service.path);

  const before = getProjectImage(project.id, 'before');
  const after = getProjectImage(project.id, 'after');
  const review = getReviewsForProject(project.id)[0];

  return {
    projectId: project.id,
    heading: project.title,
    summary: project.summary,
    summaryItems: project.summaryItems,
    facts: project.facts,
    story: project.story,
    before: toServiceImage(before),
    after: toServiceImage(after),
    beforeCaption: before.caption,
    afterCaption: after.caption,
    review: review ? toServiceProjectReview(review) : undefined,
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

function toServiceImage(image: ReturnType<typeof getProjectImage>): ServiceImage {
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

function assertProjectSupportsService(project: Project, servicePath: string): void {
  if (!project.servicePaths.includes(servicePath as (typeof project.servicePaths)[number])) {
    throw new Error(`Project ${project.id} is not related to service ${servicePath}`);
  }
}

function duplicateValues(values: readonly string[]): string[] {
  return values.filter((value, index) => values.indexOf(value) !== index);
}

export function assertEvidenceIntegrity(): void {
  const errors: string[] = [];
  const projectIds = projects.map((project) => project.id);
  const reviewIds = reviews.map((review) => review.id);

  for (const id of duplicateValues(projectIds)) errors.push(`Duplicate project ID: ${id}`);
  for (const id of duplicateValues(reviewIds)) errors.push(`Duplicate review ID: ${id}`);

  for (const review of reviews) {
    for (const projectId of review.relatedProjectIds ?? []) {
      if (!projectIds.includes(projectId)) errors.push(`Review ${review.id} references unknown project ${projectId}`);
    }
    for (const servicePath of review.relatedServicePaths ?? []) {
      if (!knownServicePaths.has(servicePath)) errors.push(`Review ${review.id} references unknown service ${servicePath}`);
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

  for (const project of projects) {
    for (const servicePath of project.servicePaths) {
      if (!knownServicePaths.has(servicePath)) errors.push(`Project ${project.id} references unknown service ${servicePath}`);
    }
    const factKeys = project.facts.map((fact) => fact.key);
    for (const key of duplicateValues(factKeys)) errors.push(`Project ${project.id} has duplicate fact key ${key}`);
    for (const image of project.images) {
      if (!image.src || !image.alt.trim() || image.width <= 0 || image.height <= 0) {
        errors.push(`Project ${project.id} has incomplete ${image.role} image metadata`);
      }
    }
  }

  for (const service of [physiotherapyService, ophthalmicService]) {
    const project = projects.find((item) => item.id === service.projectId);
    if (!project) {
      errors.push(`Service ${service.path} selects unknown project ${service.projectId}`);
      continue;
    }
    if (!project.servicePaths.includes(service.path as (typeof project.servicePaths)[number])) {
      errors.push(`Service ${service.path} selects unrelated project ${project.id}`);
    }
  }

  if (errors.length) throw new Error(`Evidence integrity failed:\n- ${errors.join('\n- ')}`);
}

assertEvidenceIntegrity();
