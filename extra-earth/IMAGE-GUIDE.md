# Nora's Upholstery image upload guide

The site intentionally ships with styled placeholders instead of invented portfolio photography. Replace them only with genuine Nora's Upholstery work or commissioned brand photography.

## The easy replacement system

No page code needs to be edited. Prepare a photo with the exact filename below and upload it to the matching GitHub folder. Keep the spelling, hyphens and file extension exactly as shown. Commit the upload and the website will use it automatically after the next deployment.

- Most project images go in `extra-earth/public/images/`.
- The existing chiropractic pair and brand files live directly in `extra-earth/public/`.
- GitHub may ask whether to replace the existing file. Choose **Replace** when updating an occupied slot.
- Filenames are case-sensitive once deployed. For example, `Hero-Workshop.webp` will not replace `hero-workshop.webp`.

## General export rules

- Export photos as WebP or AVIF, with a high-quality WebP fallback when possible.
- Keep originals outside `public/`; place web-ready versions in `public/images/`.
- Landscape images: 2200 px wide recommended. Portrait images: 1600 px wide recommended.
- Keep individual production images below roughly 350 KB when quality allows.
- Photograph before/after pairs from a tripod or fixed phone position with identical framing and lighting.
- Preserve the focal point in both a wide desktop crop and a centered 4:5 mobile crop.
- Never bake text into photographs.

## Empty slots ready for your photos

| Exact filename | Upload folder | Where it appears | Photograph needed | Recommended crop |
| --- | --- | --- | --- | --- |
| `hero-workshop.webp` | `extra-earth/public/images/` | Homepage opening section | Hands pulling, cutting or stitching deep navy upholstery in a real workshop; leave the left side visually quiet | Landscape, 2200 × 1500 px |
| `home-dental-before.jpg` | `extra-earth/public/images/` | Homepage featured transformation | Dental chair before restoration with the upholstery damage clearly visible | Portrait, 1120 × 1400 px |
| `home-dental-after.jpg` | `extra-earth/public/images/` | Homepage featured transformation | The restored dental chair, straightened and framed to complement the Before photograph | Portrait, 1120 × 1400 px |
| `dining-chair-before.webp` | `extra-earth/public/images/` | Projects, residential slider | Dining chair, armchair or ottoman before restoration | Landscape, 1800 × 1200 px |
| `dining-chair-after.webp` | `extra-earth/public/images/` | Projects, residential slider | The exact same piece after restoration | Identical crop to its before image |
| `commercial-before.webp` | `extra-earth/public/images/` | Projects, commercial slider | Restaurant booth, reception seat, fitness pad or specialty seating before restoration | Landscape, 1800 × 1200 px |
| `commercial-after.webp` | `extra-earth/public/images/` | Projects, commercial slider | The exact same piece after restoration | Identical crop to its before image |

These slots already contain graceful visual fallbacks. A missing file will not leave a broken-image symbol. Once the correctly named file exists, it covers the fallback automatically.

## Rotating Our Work gallery

Upload these images to `extra-earth/public/images/`. They appear in the rotating gallery beneath the before-and-after projects. Each slot keeps a designed placeholder until its matching file is uploaded.

| Exact filename | Photograph needed | Recommended crop |
| --- | --- | --- |
| `gallery-clinical-detail.webp` | Close-up of clean seams, contours or finished medical-grade vinyl | Landscape, 1800 × 1200 px |
| `gallery-dental.webp` | Completed dental patient chair, dentist chair or dental assistant stool | Landscape, 1800 × 1200 px |
| `gallery-chiropractic.webp` | Finished segmented chiropractic or treatment table | Landscape, 1800 × 1200 px |
| `gallery-residential.webp` | Completed sofa, armchair, dining seating or cushions | Landscape, 1800 × 1200 px |
| `gallery-restaurant.webp` | Restaurant booth, banquette, stool or dining seating | Landscape, 1800 × 1200 px |
| `gallery-specialty.webp` | Fitness, bowling, reception or other commercial seating | Landscape, 1800 × 1200 px |

The gallery advances automatically, can be moved with the arrow controls or a swipe, and pauses while a visitor is interacting with it.

## Existing photo slots you can replace

| Exact filename | Upload folder | Where it appears | Photograph needed |
| --- | --- | --- | --- |
| `before-chiro.jpg` | `extra-earth/public/` | Homepage medical and Projects clinical slider | Medical examination table before restoration |
| `after-chiro.jpg` | `extra-earth/public/` | Homepage medical and Projects clinical slider | The matching table after restoration |
| `service-dental-v2.png` | `extra-earth/public/images/` | Services category page | Professional dental operatory chair or completed clinic work |
| `service-medical-v2.png` | `extra-earth/public/images/` | Services category page | Professional exam table, chiropractic table or clinical seating |
| `service-residential.png` | `extra-earth/public/images/` | Services category page | Finished sofa, dining chair, armchair or ottoman in a home |
| `service-commercial.png` | `extra-earth/public/images/` | Services category page | Restaurant, gym, reception, bowling or hospitality seating |

The service slots currently use `.png`. You may export a JPG or WebP source as PNG, but the final uploaded filename must retain `.png` unless the page code is changed.

## Additional page photo slots

Upload all of the following to `extra-earth/public/images/`. These slots display a designed fallback until their correctly named files are present.

| Exact filename | Page | Photograph needed |
| --- | --- | --- |
| `about-workshop.webp` | About | Hands cutting, sewing, fitting or finishing a real project in the workshop |
| `about-materials.webp` | About | A close view of fabric, vinyl, thread, foam, tools or finished seams |
| `service-area-clinical.webp` | Service Areas | A completed clinical chair or table ready to return to a customer |
| `service-area-delivery.webp` | Service Areas | Furniture carefully wrapped, protected or prepared for transportation |
| `dental-patient-chairs.webp` | Dental | Completed patient chair in a clean, professional operatory |
| `dental-operator-seating.webp` | Dental | Dentist chair, dental assistant stool or saddle stool |
| `dental-repairs.webp` | Dental | Foam, contour or panel repair in progress |
| `dental-practice.webp` | Dental | Coordinated patient chair, dentist chair and dental assistant stool in a clinic |
| `medical-exam-tables.webp` | Medical & Chiropractic | Finished examination or treatment table in a professional clinic |
| `medical-chiropractic-tables.webp` | Medical & Chiropractic | Finished chiropractic table showing segmented cushions |
| `medical-clinic-seating.webp` | Medical & Chiropractic | Practitioner stool, waiting chair or reception seating |
| `medical-rebuilding.webp` | Medical & Chiropractic | Foam rebuilding, split-vinyl repair or a close clinical finish |
| `residential-sofas.webp` | Residential | Completed sofa or sectional in a comfortable room setting |
| `residential-chairs.webp` | Residential | Completed armchair, accent chair or recliner |
| `residential-dining.webp` | Residential | Coordinated dining chairs, kitchen bench or counter stools |
| `residential-marine.webp` | Residential & Outdoor | Outdoor seating, patio cushions, boat seating or a fitted marine cushion |
| `commercial-restaurants.webp` | Commercial | Restaurant booths, banquettes, dining chairs or stools |
| `commercial-fitness.webp` | Commercial | Finished gym or fitness-equipment pads in a professional facility |
| `commercial-bowling.webp` | Commercial | Bowling-centre, recreation or spectator seating |
| `commercial-hospitality.webp` | Commercial | Hotel, lobby or event-venue furniture |
| `commercial-offices.webp` | Commercial | Office, conference, waiting-room or reception seating |
| `commercial-specialty.webp` | Commercial | Custom built-in or other unusual venue seating |

Recommended export size is approximately 1400 × 1400 px. A square or gently portrait crop works best because each photograph sits beside its category information on computers and above it on phones. Images are cropped with `object-fit: cover`, so keep the completed piece near the centre.

## Brand image slots

| Exact filename | Upload folder | Purpose |
| --- | --- | --- |
| `logo.png` | `extra-earth/public/` | New digital chair logo used in the header and footer |
| `craft-mark.png` | `extra-earth/public/` | Optional needle/sewing mark retained for physical-brand references |
| `legacy-logo-original.png` | `extra-earth/public/` | Untouched March 2020 legacy logo retained as the source asset |
| `legacy-logo-glass.png` | `extra-earth/public/` | Ivory-and-gold transparent version used in the homepage proof card and footer |

Use a transparent background for both brand files when possible and keep generous, even spacing around the mark.

## Original requested-photograph notes

The homepage hero should show real craft in progress, while category images should show the breadth of completed work. Before-and-after pairs need matching camera position, orientation and lighting for the slider to feel convincing.
