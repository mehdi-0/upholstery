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
assert.equal(htmlFiles.length, 39, `expected the 39 current static pages; found ${htmlFiles.length}`);

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

const [home, services, reviews, work, contact, medical, physiotherapy, chiropractic, ophthalmic, about, serviceAreas] = await Promise.all([
  route('index.html'),
  route('services/index.html'),
  route('testimonials/index.html'),
  route('before-after/index.html'),
  route('contact/index.html'),
  route('services/medical/index.html'),
  route('services/medical/physiotherapy-treatment-table-upholstery/index.html'),
  route('services/medical/chiropractic-table-upholstery/index.html'),
  route('services/medical/ophthalmic-upholstery/index.html'),
  route('about/index.html'),
  route('service-areas/index.html'),
]);

assert.match(home, /Awesome rates and beautiful workmanship/);
assert.match(home, /rel="canonical"/);
assert.match(home, /property="og:image" content="https:\/\/norasupholstery\.ca\/logo-social\.jpg"/);
assert.match(home, /name="twitter:image" content="https:\/\/norasupholstery\.ca\/logo-social\.jpg"/);
// Compare discovery against the built routes, so a later child page cannot be
// silently omitted from either entry point. Links must exist before any scripts run.
for (const family of ['dental', 'medical', 'residential', 'commercial']) {
  for (const [html, prefix] of [[home, 'home'], [services, 'overview']]) {
    const article = html.match(new RegExp(`<article[^>]*aria-labelledby="${prefix}-family-${family}"[^>]*>([\\s\\S]*?)<\\/article>`))?.[1];
    assert.ok(article, `${prefix}: missing ${family} family grouping`);
    assert.ok(article.includes(`href="/services/${family}/"`), `${prefix}: missing ${family} hub link`);
    if (prefix === 'home') {
      assert.match(article, /<details name="home-service-families"/);
      assert.match(article, /<summary(?:\s[^>]*)?>[\s\S]*?View services/);
      assert.doesNotMatch(article.match(/<summary[^>]*>([\s\S]*?)<\/summary>/)?.[1] ?? '', /<(?:a|button)\b/, 'disclosure controls cannot contain other interactive elements');
    }
    const children = await readdir(path.join(dist, 'services', family), { withFileTypes: true });
    for (const child of children.filter(entry => entry.isDirectory())) {
      await access(path.join(dist, 'services', family, child.name, 'index.html'));
      assert.ok(article.includes(`href="/services/${family}/${child.name}/"`), `${prefix}: ${family} omits ${child.name}`);
    }
  }
}
assert.match(contact, /The upload is too large\. Choose up to 5 photos under 5 MB each\./);
assert.match(contact, /<script type="module" src="\/_astro\/[^"]+\.js"><\/script>/);
assert.doesNotMatch(contact, /<script type="module">/);
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
assert.match(work, /<script type="module" src="\/_astro\/[^"]+\.js"><\/script>/);
assert.doesNotMatch(work, /<script type="module">/);
assert.match(work, /property="og:image" content="https:\/\/norasupholstery\.ca\/logo-social\.jpg"/);
assert.equal((work.match(/data-carousel-slide role=/g) ?? []).length, 8, 'the gallery includes dialysis alongside the seven existing examples');
assert.equal((work.match(/data-compare(?:\s|>)/g) ?? []).length, 4, 'the dialysis comparison and all three standalone sliders are rendered');
assert.match(work, /Compare the dialysis chair before and after reupholstery/);
assert.match(work, /src="\/images\/dialysis-chair-before\.webp"/);
assert.match(work, /src="\/images\/dialysis-chair-after\.webp"/);
assert.match(work, /srcset="\/images\/dialysis-chair-before-480\.webp 480w, \/images\/dialysis-chair-before-960\.webp 960w, \/images\/dialysis-chair-before\.webp 1120w"/);
assert.match(work, /srcset="\/images\/gallery-dining-chairs-480\.webp 480w, \/images\/gallery-dining-chairs-960\.webp 960w, \/images\/gallery-dining-chairs\.webp 1800w"/);
assert.match(work, /srcset="\/images\/chiropractic-table-before-640\.webp 640w, \/images\/chiropractic-table-before-960\.webp 960w, \/images\/chiropractic-table-before-1350\.webp 1350w"/);
assert.match(work, /id="physiotherapy-seers3-scarborough"/);
assert.match(work, /id="ophthalmic-chairs-toronto"/);
assert.ok(work.indexOf('Ten treatment tables renewed') < work.indexOf('Two ophthalmic chairs renewed'), 'structured project order remains intentional');
assert.match(work, /Ten SEERS 3 treatment tables were renewed one at a time for a Scarborough physiotherapy clinic\./);
assert.match(work, /Two Midmark\/Ritter ophthalmic chairs were renewed for a Toronto clinic in 24 hours\./);
assert.match(work, /Explore physiotherapy table upholstery/);
assert.match(work, /Explore ophthalmic upholstery/);
assert.doesNotMatch(work, /fixture-(?:dental|medical|unpublished)/);
assert.match(work, /href="\/services\/medical\/"[^>]*>Explore medical &amp; chiropractic upholstery/);
assert.match(work, /id="work-estimate-heading"[\s\S]*?Have a piece you’d like restored\?[\s\S]*?href="\/contact#estimate-form"/);

assert.match(medical, /physiotherapy-seers3-scarborough-after-480\.webp/);
assert.match(medical, /ophthalmic-queen-street-east-after\.jpg/);
const firstFourMedicalServices = ['Medical exam tables', 'Chiropractic tables', 'Physiotherapy &amp; treatment tables', 'Clinic and patient seating'].map((label) => medical.indexOf(label));
assert.ok(firstFourMedicalServices.every((position) => position >= 0), 'the first four Medical hub services render');
assert.deepEqual(firstFourMedicalServices, [...firstFourMedicalServices].sort((a, b) => a - b), 'Medical hub puts exam tables, chiropractic tables and physiotherapy tables before clinic seating');
assert.match(physiotherapy, /physiotherapy-seers3-scarborough-before-960\.webp/);
assert.match(physiotherapy, /physiotherapy-seers3-scarborough-after-960\.webp/);
assert.match(physiotherapy, /href="\/before-after\/#physiotherapy-seers3-scarborough"/);
assert.match(chiropractic, /href="\/services\/medical\/physiotherapy-treatment-table-upholstery\/"[^>]*>Explore physiotherapy &amp; treatment table upholstery/);
assert.match(chiropractic, /href="\/before-after\/"[^>]*>See more completed work/);
assert.match(ophthalmic, /ophthalmic-queen-street-east-before-detail\.jpg/);
assert.match(ophthalmic, /ophthalmic-queen-street-east-after\.jpg/);
assert.match(ophthalmic, /href="\/before-after\/#ophthalmic-chairs-toronto"/);
assert.match(ophthalmic, /Amazing experience with Nora/);
assert.match(about, /srcset="\/images\/about-workshop-640\.webp 640w, \/images\/about-workshop-1280\.webp 1280w"/);
assert.match(about, /srcset="\/images\/about-materials-640\.webp 640w, \/images\/about-materials-1280\.webp 1280w"/);
assert.match(serviceAreas, /srcset="\/images\/service-area-clinical-640\.webp 640w, \/images\/service-area-clinical-1280\.webp 1280w"/);
assert.match(serviceAreas, /srcset="\/images\/service-area-delivery-640\.webp 640w, \/images\/service-area-delivery-1280\.webp 1280w"/);
assert.match(home, /href="\/before-after"[^>]*>View more projects/);
assert.match(home, /href="\/services\/dental\/dental-chair-upholstery\/"[^>]*>Explore dental chair upholstery/);
assert.match(about, /Please <a href="tel:\+16479812622"[^>]*>call<\/a> or <a href="mailto:norasupholstery@gmail\.com"[^>]*>email<\/a> before visiting/);

const cityPages = htmlFiles.filter((file) => {
  const relative = path.relative(dist, file).split(path.sep).join('/');
  return relative.startsWith('service-areas/') && relative !== 'service-areas/index.html';
});
assert.equal(cityPages.length, 6, `expected six established city pages; found ${cityPages.length}`);
for (const cityPage of cityPages) {
  const html = await readFile(cityPage, 'utf8');
  assert.match(html, /href="\/services\/dental\/dental-chair-upholstery\/"[^>]*>[\s\S]*?Dental chair upholstery/,
    `${path.relative(dist, cityPage)} keeps its Dental chair upholstery card label and destination aligned`);
  assert.doesNotMatch(html, /href="\/services\/dental\/"[^>]*>[\s\S]*?Dental chair upholstery/,
    `${path.relative(dist, cityPage)} does not send its Dental chair card to the broad hub`);
}

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
  'images/gallery-dental-operatory-480.webp',
  'images/gallery-dental-operatory-960.webp',
  'images/dialysis-chair-before-480.webp',
  'images/dialysis-chair-before-960.webp',
  'images/dialysis-chair-after-480.webp',
  'images/dialysis-chair-after-960.webp',
  'images/gallery-waiting-room-blue-chairs-480.webp',
  'images/gallery-waiting-room-blue-chairs-960.webp',
  'images/gallery-waiting-room-fireplace-480.webp',
  'images/gallery-waiting-room-fireplace-960.webp',
  'images/gallery-dining-chairs-480.webp',
  'images/gallery-dining-chairs-960.webp',
  'images/gallery-residential-chair-480.webp',
  'images/gallery-residential-chair-960.webp',
  'images/gallery-restaurant-seating-480.webp',
  'images/gallery-restaurant-bench-480.webp',
  'images/gallery-restaurant-bench-960.webp',
]) await access(path.join(dist, file)).catch(() => assert.fail(`missing optimized image output: ${file}`));

for (const [html, owner] of [[home, 'Homepage'], [services, 'Services overview'], [work, 'Our Work'], [reviews, 'Reviews'], [medical, 'Medical hub'], [physiotherapy, 'Physiotherapy'], [ophthalmic, 'Ophthalmic']]) {
  await assertServiceLinksResolve(html, owner);
}

for (const html of [home, reviews, work, medical, physiotherapy, ophthalmic]) {
  assert.doesNotMatch(html, /<astro-island\b/, 'evidence remains server-rendered');
  assert.doesNotMatch(html, /"@type"\s*:\s*"(?:Review|AggregateRating|Project)"/, 'no speculative review or project schema is introduced');
}

const siteOrigin = 'https://norasupholstery.ca';
const idsByFile = new Map();
for (const htmlFile of htmlFiles) {
  const html = await readFile(htmlFile, 'utf8');
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]);
  assert.equal(new Set(ids).size, ids.length, `${path.relative(dist, htmlFile)} has no duplicate IDs`);
  idsByFile.set(path.resolve(htmlFile), new Set(ids));
}

async function resolveLocalPath(pathname) {
  const decodedPath = decodeURIComponent(pathname);
  const relative = decodedPath.replace(/^\/+/, '');
  const base = path.resolve(dist, relative);
  assert.ok(base === dist || base.startsWith(`${dist}${path.sep}`), `internal URL stays inside dist: ${pathname}`);
  const candidates = path.extname(decodedPath)
    ? [base, path.join(base, 'index.html')]
    : [path.join(base, 'index.html'), `${base}.html`];
  for (const candidate of candidates) {
    try {
      await access(candidate);
      return path.resolve(candidate);
    } catch {}
  }
  return undefined;
}

for (const htmlFile of htmlFiles) {
  const html = await readFile(htmlFile, 'utf8');
  const owner = path.relative(dist, htmlFile);
  for (const [, rawHref] of html.matchAll(/<a\b[^>]*\bhref="([^"]*)"/g)) {
    const href = rawHref.replaceAll('&amp;', '&');
    const target = new URL(href, siteOrigin);
    if (target.origin !== siteOrigin) continue;
    const targetFile = await resolveLocalPath(target.pathname);
    assert.ok(targetFile, `${owner} links to a built route or asset: ${href}`);
    if (target.hash) {
      const fragment = decodeURIComponent(target.hash.slice(1));
      const targetHtml = targetFile.endsWith('.html');
      assert.ok(targetHtml && idsByFile.get(targetFile)?.has(fragment), `${owner} links to an existing fragment: ${href}`);
    }
  }
}

console.log(`Rendered-output checks passed: ${htmlFiles.length} static pages, aligned service relationships, all internal links and fragments, unique IDs, project anchors, sliders, gallery and evidence routes.`);
