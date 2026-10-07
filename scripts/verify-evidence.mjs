import assert from 'node:assert/strict';
import { access } from 'node:fs/promises';
import path from 'node:path';
import { createServer } from 'vite';

const root = process.cwd();
const vite = await createServer({
  configFile: false,
  cacheDir: path.join(process.env.TMPDIR ?? '/private/tmp', 'nora-008b-vite-cache'),
  root,
  logLevel: 'error',
  appType: 'custom',
  optimizeDeps: { noDiscovery: true, include: [] },
  server: { middlewareMode: true, hmr: false, ws: false, watch: null },
});

try {
  const [evidence, projectData, reviewData, galleryData, curation, serviceData, paths] = await Promise.all([
    vite.ssrLoadModule('/src/data/evidence.ts'),
    vite.ssrLoadModule('/src/data/projects.ts'),
    vite.ssrLoadModule('/src/data/reviews.ts'),
    vite.ssrLoadModule('/src/data/galleryExamples.ts'),
    vite.ssrLoadModule('/src/data/evidenceCuration.ts'),
    vite.ssrLoadModule('/src/data/serviceDetails.ts'),
    vite.ssrLoadModule('/src/data/servicePaths.ts'),
  ]);
  const servicePath = paths.servicePaths;

  const actualGraph = {
    projects: projectData.projects,
    reviews: reviewData.reviews,
    serviceDetails: serviceData.serviceDetails,
    knownServicePaths: Object.values(paths.servicePaths),
    galleryExamples: galleryData.galleryExamples,
    ourWorkProjectIds: curation.ourWorkProjectIds,
    ourWorkGalleryExampleIds: curation.ourWorkGalleryExampleIds,
    reviewsPageIds: curation.reviewsPageIds,
    reviewsPageFeaturedId: curation.reviewsPageFeaturedId,
    homepageFeaturedReviewId: curation.homepageFeaturedReviewId,
    reviewPagePresentation: curation.reviewPagePresentation,
  };
  assert.deepEqual(evidence.getEvidenceIntegrityErrors(actualGraph), [], 'production evidence graph is valid');

  assert.deepEqual(curation.ourWorkProjectIds, [
    'physiotherapy-seers3-scarborough',
    'ophthalmic-chairs-toronto',
  ], 'the current structured-project selection and order remain stable');
  assert.deepEqual(curation.reviewsPageIds, ['david-song', 'gabriel', 'monica', 'irit-frid']);
  assert.equal(curation.reviewsPageFeaturedId, 'david-song');
  assert.equal(curation.homepageFeaturedReviewId, 'david-song');
  for (const id of curation.reviewsPageIds) {
    assert.equal(reviewData.getReview(id).rating, 5, `${id} is a verified five-star review`);
  }
  for (const id of ['david-song', 'gabriel', 'irit-frid']) {
    assert.deepEqual(reviewData.getReview(id).relatedProjectIds ?? [], [], `${id} has no inferred project relationship`);
  }
  assert.deepEqual(curation.reviewPagePresentation.monica.projectContextIds, ['ophthalmic-chairs-toronto']);
  assert.deepEqual(curation.reviewPagePresentation.gabriel.servicePath, servicePath.medicalHub);
  assert.deepEqual(curation.reviewPagePresentation.monica.servicePath, servicePath.ophthalmic);
  assert.deepEqual(curation.reviewPagePresentation['irit-frid'].servicePath, servicePath.diningChairs);
  assert.deepEqual(curation.reviewPagePresentation['david-song'].servicePath, servicePath.chiropracticTable);
  assert.equal(curation.ourWorkGalleryExampleIds.length, 7);
  assert.equal(serviceData.ophthalmicService.evidencePresentation.featuredReviewId, 'monica');
  assert.equal(evidence.getServiceFeaturedProjectId(serviceData.physiotherapyService), 'physiotherapy-seers3-scarborough');

  const makeImage = (role, filename) => ({
    role,
    src: `/fixture/${filename}.webp`,
    width: 800,
    height: 600,
    alt: `Fixture ${role} photograph`,
  });
  const makeProject = (id, servicePaths, images, extra = {}) => ({
    id,
    title: `Fixture ${id}`,
    servicePaths,
    facts: [],
    images,
    ...extra,
  });
  const comparisonPresentation = (categoryLabel, path) => ({
    categoryLabel,
    description: `Verified ${categoryLabel.toLowerCase()} project summary.`,
    factKeys: [],
    layout: 'before-after',
    serviceLink: { path, label: `Explore ${categoryLabel.toLowerCase()}` },
  });
  const fixtureProjects = [
    makeProject('fixture-dental', [servicePath.dentalChair], [makeImage('completed', 'dental-single')]),
    makeProject('fixture-medical', [servicePath.medicalHub], [makeImage('before', 'medical-before'), makeImage('after', 'medical-after')]),
    makeProject('fixture-physiotherapy', [servicePath.physiotherapyTables], [makeImage('hero', 'physio-hero'), makeImage('before', 'physio-before'), makeImage('after', 'physio-after')], {
      facts: [{ key: 'quantity', label: 'Quantity', value: 'Four tables' }],
      ourWorkPresentation: { ...comparisonPresentation('Physiotherapy', servicePath.physiotherapyTables), factKeys: ['quantity'] },
    }),
    makeProject('fixture-ophthalmic', [servicePath.ophthalmic], [makeImage('before', 'ophthalmic-before'), makeImage('after', 'ophthalmic-after')], {
      ourWorkPresentation: comparisonPresentation('Ophthalmic', servicePath.ophthalmic),
    }),
    makeProject('fixture-chiropractic', [servicePath.chiropracticTable], [makeImage('before', 'chiropractic-before'), makeImage('after', 'chiropractic-after'), makeImage('detail', 'chiropractic-detail')]),
    makeProject('fixture-restaurant', [servicePath.restaurantSeating], [makeImage('completed', 'restaurant-completed')]),
    makeProject('fixture-gym', [servicePath.gymEquipment], [makeImage('completed', 'gym-completed')]),
    makeProject('fixture-residential', [servicePath.residentialChair], [makeImage('before', 'residential-before'), makeImage('after', 'residential-after')]),
    makeProject('fixture-dental-clinic', [servicePath.dentalChair, servicePath.clinicSeating], [makeImage('before', 'dental-clinic-before'), makeImage('after', 'dental-clinic-after')]),
    makeProject('fixture-unpublished', [], [makeImage('completed', 'unpublished-completed'), makeImage('detail', 'unpublished-detail')]),
  ];

  const fixtureReviews = Array.from({ length: 20 }, (_, index) => {
    const id = `fixture-review-${String(index + 1).padStart(2, '0')}`;
    const projectRelations = index < 2 ? ['fixture-physiotherapy']
      : index === 2 ? ['fixture-physiotherapy', 'fixture-ophthalmic']
        : index === 3 ? ['fixture-dental', 'fixture-dental-clinic']
          : index === 4 ? ['fixture-restaurant'] : [];
    const serviceRelations = index < 2 ? [servicePath.physiotherapyTables]
      : index === 2 ? [servicePath.physiotherapyTables, servicePath.ophthalmic]
        : index === 3 ? [servicePath.dentalChair] : [];
    return {
      id,
      reviewerDisplayName: `Fixture reviewer ${index + 1}`,
      originalText: `Fixture review ${index + 1}`,
      sourceIdentity: index % 2 ? 'google' : 'other',
      sourceLabel: 'Fixture source',
      ...(projectRelations.length ? { relatedProjectIds: projectRelations } : {}),
      ...(serviceRelations.length ? { relatedServicePaths: serviceRelations } : {}),
    };
  });
  const fixtureGallery = ['gallery-one', 'gallery-two', 'gallery-three'].map((id) => ({
    id,
    label: id,
    note: `Completed work ${id}`,
    ...(id === 'gallery-one' ? { serviceLink: { path: servicePath.dentalHub, label: 'Explore dental upholstery' } } : {}),
    image: { src: `/fixture/${id}.webp`, width: 800, height: 600, alt: `Fixture image ${id}` },
  }));
  const fixtureGraph = {
    projects: fixtureProjects,
    reviews: fixtureReviews,
    serviceDetails: [
      { path: servicePath.dentalStool, hero: { variant: 'editorial' } },
      { path: servicePath.physiotherapyTables, hero: { variant: 'project-image', role: 'hero' }, evidencePresentation: { featuredProjectIds: ['fixture-physiotherapy'], featuredReviewId: 'fixture-review-02' } },
      { path: servicePath.dentalChair, hero: { variant: 'editorial' }, evidencePresentation: { featuredProjectIds: ['fixture-dental-clinic'] } },
    ],
    knownServicePaths: Object.values(servicePath),
    galleryExamples: fixtureGallery,
    ourWorkProjectIds: ['fixture-physiotherapy', 'fixture-ophthalmic'],
    ourWorkGalleryExampleIds: ['gallery-one', 'gallery-two'],
    reviewsPageIds: ['fixture-review-01', 'fixture-review-02', 'fixture-review-03', 'fixture-review-04'],
    reviewsPageFeaturedId: 'fixture-review-03',
    homepageFeaturedReviewId: 'fixture-review-01',
    reviewPagePresentation: {
      'fixture-review-01': { projectContextIds: ['fixture-physiotherapy'], servicePath: servicePath.physiotherapyTables },
      'fixture-review-04': { servicePath: servicePath.dentalChair },
    },
  };

  assert.equal(fixtureProjects.length, 10);
  assert.equal(fixtureReviews.length, 20);
  assert.deepEqual(evidence.getEvidenceIntegrityErrors(fixtureGraph), [], '10-project / 20-review fixture passes integrity checks');
  assert.equal(evidence.getProjectsForService(servicePath.dentalStool, fixtureProjects).length, 0, 'a service may have no related project');
  assert.equal(evidence.getProjectsForService(servicePath.physiotherapyTables, fixtureProjects).length, 1);
  assert.equal(evidence.getProjectsForService(servicePath.dentalChair, fixtureProjects).length, 2, 'a service may have several related projects');
  assert.equal(evidence.getProjectsForService(servicePath.clinicSeating, fixtureProjects)[0].id, 'fixture-dental-clinic', 'a project may support more than one service');
  assert.equal(evidence.getProjectsForService(servicePath.gymEquipment, fixtureProjects)[0].id, 'fixture-gym', 'Gym projects use the existing canonical service route');
  assert.deepEqual(fixtureGraph.serviceDetails[2].evidencePresentation.featuredProjectIds, ['fixture-dental-clinic'], 'service presentation explicitly selects one of several related projects');
  assert.equal(reviewData.getReviewsForProject('fixture-physiotherapy', fixtureReviews).length, 3, 'a project may have several related reviews');
  assert.equal(reviewData.getReviewsForProject('fixture-unpublished', fixtureReviews).length, 0, 'a project may have no related reviews');
  assert.equal(fixtureReviews.at(-1).relatedProjectIds, undefined, 'a review may have no project relationship');
  assert.equal(fixtureReviews[2].relatedProjectIds.length, 2, 'a review may relate to several projects');
  assert.equal(fixtureProjects[0].images.length, 1, 'one-image evidence is valid when not selected for comparison');
  assert.equal(fixtureProjects[4].images.length, 3, 'a project may have several images');
  assert.equal(fixtureGraph.ourWorkProjectIds.includes('fixture-unpublished'), false, 'stored projects are not automatically published');
  assert.equal(fixtureGraph.reviewsPageIds.includes('fixture-review-20'), false, 'stored reviews are not automatically published');
  assert.equal(fixtureGraph.ourWorkGalleryExampleIds.includes('gallery-three'), false, 'stored gallery examples are not automatically published');
  assert.equal(fixtureGraph.serviceDetails[1].evidencePresentation.featuredReviewId, 'fixture-review-02', 'featured review selection is explicit');
  assert.deepEqual(evidence.getEvidenceIntegrityErrors({ ...fixtureGraph, reviews: [...fixtureReviews].reverse() }), [], 'selection remains valid if relationship storage order changes');
  assert.ok(evidence.getEvidenceIntegrityErrors({ ...fixtureGraph, ourWorkProjectIds: [...fixtureGraph.ourWorkProjectIds, 'fixture-unknown'] }).some((error) => error.includes('unknown ID')));
  assert.ok(evidence.getEvidenceIntegrityErrors({ ...fixtureGraph, ourWorkProjectIds: [...fixtureGraph.ourWorkProjectIds, 'fixture-unpublished'] }).some((error) => error.includes('no presentation metadata')));
  assert.deepEqual(evidence.getEvidenceIntegrityErrors({ ...fixtureGraph, reviewsPageIds: [...fixtureGraph.reviewsPageIds, 'fixture-review-20'] }), [], 'additional stored reviews can be curated explicitly');
  assert.ok(evidence.getEvidenceIntegrityErrors({
    ...fixtureGraph,
    serviceDetails: fixtureGraph.serviceDetails.map((service, index) => index === 1
      ? { ...service, evidencePresentation: { ...service.evidencePresentation, featuredReviewId: 'fixture-review-20' } }
      : service),
  }).some((error) => error.includes('not related to its displayed project')));

  const sourceFallback = reviewData.getReviewSourceUrl({
    id: 'fixture-source',
    reviewerDisplayName: 'Fixture reviewer',
    originalText: 'Fixture source text',
    sourceIdentity: 'google',
    sourceLabel: 'Display text may change',
  });
  assert.ok(sourceFallback, 'Google fallback uses source identity rather than display wording');

  const publicRoot = path.join(root, 'public');
  const evidenceImages = [
    ...projectData.projects.flatMap((project) => project.images),
    ...galleryData.galleryExamples.map((example) => example.image),
  ];
  const assetPaths = new Set();
  for (const image of evidenceImages) {
    if (image.src) assetPaths.add(image.src);
    if (image.cardSrc) assetPaths.add(image.cardSrc);
    for (const candidate of (image.srcset ?? '').split(',')) {
      const candidatePath = candidate.trim().split(/\s+/)[0];
      if (candidatePath) assetPaths.add(candidatePath);
    }
  }

  const missingAssets = [];
  for (const asset of assetPaths) {
    if (!asset.startsWith('/') || asset.startsWith('//')) continue;
    const pathname = decodeURIComponent(asset.split(/[?#]/, 1)[0]);
    const filePath = path.resolve(publicRoot, `.${pathname}`);
    if (!filePath.startsWith(`${publicRoot}${path.sep}`)) {
      missingAssets.push(`${asset} (outside public/)`);
      continue;
    }
    try {
      await access(filePath);
    } catch {
      missingAssets.push(asset);
    }
  }
  assert.deepEqual(missingAssets, [], 'all evidence src, srcset and card paths exist in public/');

  console.log(`Evidence checks passed: 10 heterogeneous fixture projects, 20 fixture reviews, ${galleryData.galleryExamples.length} curated gallery records, ${assetPaths.size} local image paths.`);
} finally {
  await vite.close();
}
