# Image guide

This guide describes the image files and delivery patterns currently used by the
site. Images are static assets: `/images/example.webp` is served from
`public/images/example.webp`, and a path such as `/logo-site.webp` is served from
`public/logo-site.webp`. File names and paths are case-sensitive.

## Replacing or adding an image

1. Find the current image reference in `src/` before replacing anything. For
   example, search for a filename with `rg -n 'filename' src`.
2. If the image uses the same path everywhere, replacing the file in `public/`
   keeps those references intact. Check every use first; one asset can appear on
   several pages.
3. If the image has responsive variants, inspect its `src`, every candidate in
   `srcset`, and its `sizes` in the owning page or data record. Replace or
   regenerate the complete responsive variant set and update `srcset` and
   `sizes` together. Replacing only the fallback can leave older derivatives
   in use; replacing only a derivative can leave the default `src` outdated.
4. Keep original photographs outside `public/` (for example, in the ignored
   `local-assets/` folder). Only publish browser-ready versions.
5. Update descriptive alt text and any visible caption in the same place as the
   image reference. Describe what can be verified in the photograph; do not add
   unsupported equipment, customer, location, or material details, or keywords
   just for SEO.
6. Check the rendered page at desktop and narrow mobile widths. Preserve the
   intended crop and the image's aspect ratio.

There is no automatic image-conversion pipeline in this repository. Responsive
files are prepared and committed as ordinary assets. After image or evidence-data
changes, run `npm run test:evidence` and `npm run build`; the build runs the source
and rendered-output evidence checks.

## Image preparation and markup

- WebP is preferred for photographs. JPEG is supported and remains appropriate
  for existing photos where converting them is not useful. Keep PNG when
  transparency or an existing brand source requires it; do not convert every
  asset just to standardize formats.
- Convert HEIC/HEIF originals to a web format before publishing.
- As a starting point, use a source around 1600 px on its longest side and aim
  below 350 KB when the image remains visually clear. These are guidelines, not
  hard limits; inspect the actual displayed size and quality before resizing or
  compressing.
- Do not add text, labels, watermarks, invented details, or AI-generated edits to
  project photographs. Conventional crop, resize, and compression are fine when
  they preserve the photographed evidence.
- Use `srcset` and a realistic `sizes` value for images with meaningfully
  different mobile and desktop delivery needs. The width descriptors in
  `srcset` must match each file's actual pixel width.
- Set intrinsic `width` and `height` to reserve the source aspect ratio and help
  prevent layout shift. CSS may crop the image in its display frame without
  changing those intrinsic dimensions.
- Below-the-fold images are generally lazy-loaded and asynchronously decoded.
  Keep eager loading and high fetch priority for a genuinely important
  above-the-fold image only. Avoid adding high priority to a whole image gallery.
- Meaningful images need concise, factual alt text. Use `alt=""` for decorative
  images; visible Before/After labels do not replace distinct descriptions of the
  two photographs. Keep comparison controls labelled for assistive technology.
- Parent layout should reserve stable space for images. Do not add dimensions or
  responsive variants mechanically when the component already reserves the
  geometry and the delivered image is appropriately sized.

`PhotoStrip.astro` accepts optional `srcset`, `sizes`, `width`, and `height` for
photo-strip entries. Project images store their path, variants, dimensions, alt
text, and captions with the project data in `src/data/projects.ts`. The Our Work
rotating-gallery records live in `src/data/galleryExamples.ts`.

## Current image groups

### Homepage and service overview

| Use | Current image files |
| --- | --- |
| Homepage Dental Before | `images/home-dental-before-720.webp`, `images/home-dental-before-1120.webp` |
| Homepage Dental After | `images/home-dental-after-720.webp`, `images/home-dental-after-1120.webp` |
| Dental service overview | `images/service-dental-v2.webp` |
| Medical & Chiropractic service overview | `images/service-medical-v2.webp` |
| Residential & Outdoor service overview | `images/service-residential.webp` |
| Commercial service overview | `images/service-commercial.webp` |

The homepage Dental pair is one project: burgundy Before and blue After. The
similarly named orange Dental Before/After pair in Our Work is a separate project.
The `.jpg` homepage files are retained source copies; the page serves the WebP
variants above.

### Service photographs

| Service | Current image files |
| --- | --- |
| Dental | `images/dental-patient-chairs.webp`, `images/dental-operator-seating.webp`, `images/dental-repairs.webp`, `images/dental-practice.webp` |
| Medical & Chiropractic | `images/medical-exam-tables.webp`, `images/medical-chiropractic-tables.webp`, `images/medical-clinic-seating.webp`, `images/medical-rebuilding.webp` |
| Residential & Outdoor | `images/residential-sofas.webp`, `images/residential-chairs.webp`, `images/residential-dining.webp`, `images/residential-marine.webp`, `images/about-materials.webp` |
| Commercial | `images/commercial-restaurants.webp`, `images/commercial-fitness.webp`, `images/commercial-bowling.webp`, `images/commercial-hospitality.webp`, `images/commercial-offices.webp`, `images/commercial-specialty.webp` |

### Our Work

The rotating gallery contains eight examples. In the table, **fallback image**
is the file supplied by the image's `src` attribute. **Responsive WebP
derivatives** are the smaller `srcset` candidates selected by the browser when
they suit the rendered size and device. For most entries, the fallback WebP is
also the largest candidate in `srcset`. Restaurant seating keeps its JPEG as
the fallback and has one responsive WebP derivative. The Dialysis entry is a
before/after comparison, so it has a fallback and responsive derivatives for
both photographs.

| Gallery example | Fallback image (`src`) | Responsive WebP derivatives (`srcset`) |
| --- | --- | --- |
| Dental operatory | `images/gallery-dental-operatory.webp` | `images/gallery-dental-operatory-480.webp`, `images/gallery-dental-operatory-960.webp` |
| Dialysis chair, before | `images/dialysis-chair-before.webp` | `images/dialysis-chair-before-480.webp`, `images/dialysis-chair-before-960.webp` |
| Dialysis chair, after | `images/dialysis-chair-after.webp` | `images/dialysis-chair-after-480.webp`, `images/dialysis-chair-after-960.webp` |
| Clinic waiting chairs | `images/gallery-waiting-room-blue-chairs.webp` | `images/gallery-waiting-room-blue-chairs-480.webp`, `images/gallery-waiting-room-blue-chairs-960.webp` |
| Clinic chairs by a fireplace | `images/gallery-waiting-room-fireplace.webp` | `images/gallery-waiting-room-fireplace-480.webp`, `images/gallery-waiting-room-fireplace-960.webp` |
| Dining chairs | `images/gallery-dining-chairs.webp` | `images/gallery-dining-chairs-480.webp`, `images/gallery-dining-chairs-960.webp` |
| Residential chair | `images/gallery-residential-chair.webp` | `images/gallery-residential-chair-480.webp`, `images/gallery-residential-chair-960.webp` |
| Restaurant seating | `images/gallery-restaurant-seating.jpg` | `images/gallery-restaurant-seating-480.webp` |
| Restaurant bench | `images/gallery-restaurant-bench.webp` | `images/gallery-restaurant-bench-480.webp`, `images/gallery-restaurant-bench-960.webp` |

These eight examples use 17 responsive WebP derivative files. Their source
records, including each width descriptor and fallback, are in
`src/data/galleryExamples.ts`. Keep this inventory aligned with that data and
the files in `public/images/` when the gallery changes.

The standalone comparisons below remain separate from the rotating gallery:

| Project | Before | After |
| --- | --- | --- |
| Orange Dental chair | `images/dental-gallery-before.webp` | `images/dental-gallery-after.webp` |
| Chiropractic table | `images/chiropractic-table-before-640.webp`, `images/chiropractic-table-before-960.webp`, `images/chiropractic-table-before-1350.webp` | `images/gallery-chiropractic-table.webp` |
| Residential armchair | `images/residential-chair-before.jpg` | `images/residential-chair-after.jpg` |

The Before image is presented on the left and After on the right. Preserve the
distinction in both alt text and visible labels. Desktop and mobile may use
different framing rules to suit their different aspect ratios.

### Project evidence

The verified Physiotherapy and Ophthalmic case-study images are recorded in
`src/data/projects.ts` and stored under `public/images/projects/`.

- Physiotherapy: `physiotherapy-treatment-table-hero-original.jpg` and responsive
  `physiotherapy-seers3-scarborough-before-{480,640,960,1493}.webp` and
  `physiotherapy-seers3-scarborough-after-{480,640,960,1279}.webp` variants.
- Ophthalmic: `ophthalmic-queen-street-east-before-detail.jpg` and
  `ophthalmic-queen-street-east-after.jpg`.

The original Physiotherapy Before and After PNG photographs are retained in the
ignored `local-assets/physiotherapy/` folder. The published case study uses the
responsive WebP pairs plus the JPEG hero image.

Project names, service associations, and factual captions belong in the project
data, not in an image filename alone.

### About and Service Areas

The About and Service Areas `PhotoStrip` pairs select responsive 640 px and
1280 px WebP files. Their data supplies `sizes` and the original 1600 × 1200
aspect ratio. The About founder portrait is a separate, single JPEG.

- About page portrait: `images/founder-hassan.jpg`.
- About workshop: `images/about-workshop-640.webp`,
  `images/about-workshop-1280.webp`.
- About materials: `images/about-materials-640.webp`,
  `images/about-materials-1280.webp`.
- Service Areas clinical work: `images/service-area-clinical-640.webp`,
  `images/service-area-clinical-1280.webp`.
- Service Areas pickup and delivery: `images/service-area-delivery-640.webp`,
  `images/service-area-delivery-1280.webp`.

The Outdoor Upholstery page also uses the original `images/about-materials.webp`
directly. If that photograph is replaced, update the About page's 640 px and
1280 px variants from the same new source as well.

### Brand files

| File | Current use |
| --- | --- |
| `logo-site.webp` | Header mark and favicon; business structured-data logo |
| `logo-social.jpg` | 1024 × 1024 default Open Graph and Twitter share image |
| `legacy-logo-glass.webp` | Homepage proof card and footer |
| `logo.png` | Retained original chair-logo source; not the default share image |
| `legacy-logo-glass.png`, `legacy-logo-original.png`, `craft-mark.png` | Retained source or reference artwork; check code references before using |

## Legacy and unused files

Some files remain in `public/` for source retention or legacy comparison and are
not active just because they exist. This includes files with `legacy-` names,
older padded-gallery copies, the original Chiropractic and homepage Dental JPEGs,
and older service-tile PNGs. Do not delete or assign these as project evidence
without checking their source, current references, and project context first.

To check whether an asset is currently referenced, search its filename under
`src/` and confirm its actual file under `public/`. Do not infer an image's subject,
project, or location from its filename alone.
