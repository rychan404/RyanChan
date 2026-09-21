// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import react from '@astrojs/react';
import { loadEnv } from 'vite';

const { VITE_SITE_URL } = loadEnv(process.env.NODE_ENV ?? 'production', process.cwd(), 'VITE_');
if (!VITE_SITE_URL && process.argv.includes('build')) {
  console.warn('VITE_SITE_URL is not set — og:image and absolute og:url are omitted.');
}

export default defineConfig({
  site: VITE_SITE_URL || undefined,
  integrations: [react(), mdx()],
  // The contact form reads VITE_WEB3FORMS_KEY in the browser. Astro exposes
  // only PUBLIC_* by default; keeping VITE_ means the Pages env vars don't move.
  vite: { envPrefix: ['PUBLIC_', 'VITE_'] },
});
