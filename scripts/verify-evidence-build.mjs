import assert from 'node:assert/strict';
import { access, readFile, readdir } from 'node:fs/promises';
import path from 'node:path';

const dist = path.resolve('dist');

async function collectHtml(directory) {
  const files = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await collectHtml(absolute));
    else if (entry.isFile() && entry.name.endsWith('.html')) files.push(absolute);
  }
  return files;
}

const htmlFiles = await collectHtml(dist);
assert.ok(htmlFiles.length >= 39, `expected at least the 39 current static pages; found ${htmlFiles.length}`);

async function route(routePath) {
  return readFile(path.join(dist, routePath), 'utf8');
}

async function assertServiceLinksResolve(html, owner) {
  for (const [, href] of html.matchAll(/href="(\/services\/[^"#?]+)"/g)) {
    const routePath = decodeURIComponent(href.replace(/\/$/, ''));
    const outputPath = path.resolve(dist, `.${routePath}`, 'index.html');
    await access(outputPath).catch(() => assert.fail(`${owner} links to missing service route ${href}`));
  }
}

const [home, reviews, work, medical, physiotherapy, ophthalmic, about, serviceAreas] = await Promise.all([
  route('index.html'),
  route('testimonials/index.html'),
  route('before-after/index.html'),
  route('services/medical/index.html'),
  route('services/medical/physiotherapy-treatment-table-upholstery/index.html'),
  route('services/medical/ophthalmic-upholstery/index.html'),
  route('about/index.html'),
  route('service-areas/index.html'),
]);

assert.match(home, /Awesome rates and beautiful workmanship/);
assert.match(home, /rel="canonical"/);
assert.match(home, /property="og:image" content="https:\/\/norasupholstery\.ca\/logo-social\.jpg"/);
assert.match(home, /name="twitter:image" content="https:\/\/norasupholstery\.ca\/logo-social\.jpg"/);
assert.match(reviews, /Dr\. David Song/);
assert.match(reviews, /Gabriel/);
assert.match(reviews, /Monica/);
assert.match(reviews, /Irit Frid/);
assert.match(reviews, /Amazing experience with Nora/);
assert.equal((reviews.match(/data-review-item(?:\s|>)/g) ?? []).length, 3, 'all standard reviews are server rendered in the showcase');
assert.equal((reviews.match(/5 out of 5 stars/g) ?? []).length, 4, 'all four selected reviews expose their numeric rating');
assert.match(reviews, /class="review-article review-article--featured"/);
assert.match(reviews, /<section class="review-showcase" aria-label="More client experiences" data-review-showcase/);
assert.match(reviews, /data-review-status hidden aria-live="polite"/);
assert.doesNotMatch(reviews, /Visit Google profile|View review on Google/);
assert.match(reviews, /href="\/before-after\/#ophthalmic-chairs-toronto"/);
assert.doesNotMatch(reviews, /href="\/before-after\/#(?!ophthalmic-chairs-toronto)[^"]+"/);
assert.match(reviews, /href="\/services\/medical\/chiropractic-table-upholstery\/"[^>]*>Explore chiropractic table upholstery/);
assert.match(reviews, /href="\/services\/medical\/"[^>]*>Explore medical &amp; chiropractic upholstery/);
assert.match(reviews, /href="\/services\/medical\/ophthalmic-upholstery\/"[^>]*>Explore ophthalmic upholstery/);
assert.match(reviews, /href="\/services\/residential\/dining-chair-upholstery\/"[^>]*>Explore dining chair upholstery/);
assert.match(reviews, /More on Google/);
assert.match(reviews, /Read more reviews on Google/);
assert.equal((reviews.match(/Read more reviews on Google/g) ?? []).length, 1, 'one Google destination is rendered in Reviews content');
assert.doesNotMatch(reviews, /<astro-island\b/);
assert.doesNotMatch(reviews, /"@type"\s*:\s*"(?:Review|AggregateRating)"/);

assert.match(work, /data-work-carousel/);
assert.match(work, /property="og:image" content="https:\/\/norasupholstery\.ca\/logo-social\.jpg"/);
assert.equal((work.match(/data-carousel-slide role=/g) ?? []).length, 8, 'the gallery includes dialysis alongside the seven existing examples');
assert.equal((work.match(/data-compare style=/g) ?? []).length, 4, 'the dialysis comparison and all three standalone sliders are rendered');
assert.match(work, /Compare the dialysis chair before and after reupholstery/);
assert.match(work, /src="\/images\/dialysis-chair-before\.webp"/);
assert.match(work, /src="\/images\/dialysis-chair-after\.webp"/);
assert.match(work, /srcset="\/images\/chiropractic-table-before-640\.webp 640w, \/images\/chiropractic-table-before-960\.webp 960w, \/images\/chiropractic-table-before-1350\.webp 1350w"/);
assert.match(work, /id="physiotherapy-seers3-scarborough"/);
assert.match(work, /id="ophthalmic-chairs-toronto"/);
assert.ok(work.indexOf('Ten treatment tables renewed') < work.indexOf('Two ophthalmic chairs renewed'), 'structured project order remains intentional');
assert.match(work, /Ten SEERS 3 treatment tables were renewed one at a time for a Scarborough physiotherapy clinic\./);
assert.match(work, /Two Midmark\/Ritter ophthalmic chairs were renewed for a Toronto clinic in 24 hours\./);
assert.match(work, /Explore physiotherapy table upholstery/);
assert.match(work, /Explore ophthalmic upholstery/);
assert.doesNotMatch(work, /fixture-(?:dental|medical|unpublished)/);

assert.match(medical, /physiotherapy-seers3-scarborough-after-480\.webp/);
assert.match(medical, /ophthalmic-queen-street-east-after\.jpg/);
assert.match(physiotherapy, /physiotherapy-seers3-scarborough-before-960\.webp/);
assert.match(physiotherapy, /physiotherapy-seers3-scarborough-after-960\.webp/);
assert.match(ophthalmic, /ophthalmic-queen-street-east-before-detail\.jpg/);
assert.match(ophthalmic, /ophthalmic-queen-street-east-after\.jpg/);
assert.match(ophthalmic, /Amazing experience with Nora/);
assert.match(about, /srcset="\/images\/about-workshop-640\.webp 640w, \/images\/about-workshop-1280\.webp 1280w"/);
assert.match(about, /srcset="\/images\/about-materials-640\.webp 640w, \/images\/about-materials-1280\.webp 1280w"/);
assert.match(serviceAreas, /srcset="\/images\/service-area-clinical-640\.webp 640w, \/images\/service-area-clinical-1280\.webp 1280w"/);
assert.match(serviceAreas, /srcset="\/images\/service-area-delivery-640\.webp 640w, \/images\/service-area-delivery-1280\.webp 1280w"/);

for (const file of [
  'logo-social.jpg',
  'images/chiropractic-table-before-640.webp',
  'images/chiropractic-table-before-960.webp',
  'images/chiropractic-table-before-1350.webp',
  'images/about-workshop-640.webp',
  'images/about-workshop-1280.webp',
  'images/about-materials-640.webp',
  'images/about-materials-1280.webp',
  'images/service-area-clinical-640.webp',
  'images/service-area-clinical-1280.webp',
  'images/service-area-delivery-640.webp',
  'images/service-area-delivery-1280.webp',
]) await access(path.join(dist, file)).catch(() => assert.fail(`missing optimized image output: ${file}`));

for (const [html, owner] of [[work, 'Our Work'], [reviews, 'Reviews'], [medical, 'Medical hub'], [physiotherapy, 'Physiotherapy'], [ophthalmic, 'Ophthalmic']]) {
  await assertServiceLinksResolve(html, owner);
}

for (const html of [home, reviews, work, medical, physiotherapy, ophthalmic]) {
  assert.doesNotMatch(html, /<astro-island\b/, 'evidence remains server-rendered');
  assert.doesNotMatch(html, /"@type"\s*:\s*"(?:Review|AggregateRating|Project)"/, 'no speculative review or project schema is introduced');
}

const anchorIds = new Set([...work.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]));
for (const htmlFile of htmlFiles) {
  const html = await readFile(htmlFile, 'utf8');
  for (const [, fragment] of html.matchAll(/href="\/before-after\/#([^"#]+)"/g)) {
    assert.ok(anchorIds.has(fragment), `${path.relative(dist, htmlFile)} links to missing Our Work anchor #${fragment}`);
  }
}

console.log(`Rendered-output checks passed: ${htmlFiles.length} static pages, current curation, project anchors, sliders, gallery and evidence routes.`);
