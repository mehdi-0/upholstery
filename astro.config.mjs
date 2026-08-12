import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  // Cloudflare supplies CF_PAGES_URL for preview deployments. Set
  // PUBLIC_SITE_URL to the final custom domain when it is connected.
  site: process.env.PUBLIC_SITE_URL || process.env.CF_PAGES_URL,
  vite: {
    plugins: [tailwindcss()],
  },
});
