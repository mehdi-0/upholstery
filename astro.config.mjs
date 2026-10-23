import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

const site = 'https://norasupholstery.ca';
// This site-wide entity/content update changes metadata across every page. Keep this
// fixed between builds; advance it only when site-wide page information materially changes.
const siteContentLastModified = '2026-10-22';
// For a later material update to one page, add its canonical pathname and date here.
const pageSpecificLastModified = new Map();

export default defineConfig({
  site,
  integrations: [sitemap({
    serialize: (item) => {
      const pageDate = pageSpecificLastModified.get(new URL(item.url).pathname);
      const lastmod = pageDate && pageDate > siteContentLastModified
        ? pageDate
        : siteContentLastModified;
      return { ...item, lastmod };
    },
  })],
  security: {
    csp: {
      directives: [
        "default-src 'self'",
        "base-uri 'self'",
        "object-src 'none'",
        "form-action 'self'",
        "img-src 'self' data:",
        "font-src 'self' data:",
        "connect-src 'self' https://challenges.cloudflare.com https://cloudflareinsights.com",
        'frame-src https://challenges.cloudflare.com',
      ],
      scriptDirective: {
        resources: ["'self'", 'https://challenges.cloudflare.com', 'https://static.cloudflareinsights.com'],
      },
      styleDirective: {
        resources: ["'self'"],
      },
    },
  },
  vite: {
    build: {
      // Keep Astro's small processed page scripts as cacheable JavaScript assets.
      assetsInlineLimit: (filePath) => filePath.endsWith('.js') ? false : undefined,
    },
    plugins: [tailwindcss()],
  },
});
