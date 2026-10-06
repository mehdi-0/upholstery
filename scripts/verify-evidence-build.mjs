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

const [home, reviews, work, medical, physiotherapy, ophthalmic] = await Promise.all([
  route('index.html'),
  route('testimonials/index.html'),
  route('before-after/index.html'),
  route('services/medical/index.html'),
  route('services/medical/physiotherapy-treatment-table-upholstery/index.html'),
  route('services/medical/ophthalmic-upholstery/index.html'),
]);

assert.match(home, /Awesome rates and beautiful workmanship/);
assert.match(home, /rel="canonical"/);
assert.match(reviews, /Dr\. David Song/);
assert.match(reviews, /Gabriel/);
assert.match(reviews, /Monica/);
assert.match(reviews, /Irit Frid/);
assert.match(reviews, /Amazing experience with Nora/);
assert.match(reviews, /href="\/before-after\/#ophthalmic-chairs-toronto"/);
assert.doesNotMatch(reviews, /href="\/before-after\/#(?!ophthalmic-chairs-toronto)[^"]+"/);

assert.match(work, /data-work-carousel/);
assert.equal((work.match(/data-carousel-slide role=/g) ?? []).length, 7, 'the rotating seven-image gallery remains curated');
assert.equal((work.match(/data-compare style=/g) ?? []).length, 3, 'all three existing Before/After sliders remain');
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
