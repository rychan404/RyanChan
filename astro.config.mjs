// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import react from '@astrojs/react';
import { loadEnv } from 'vite';
import { cpSync, existsSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { TAG_ICONS } from './src/content/tags.ts';

const { VITE_SITE_URL } = loadEnv(process.env.NODE_ENV ?? 'production', process.cwd(), 'VITE_');
if (!VITE_SITE_URL && process.argv.includes('build')) {
  console.warn('VITE_SITE_URL is not set — og:image and absolute og:url are omitted.');
}

// /icons/<pack>/<name>.svg comes straight from the icon packages on npm;
// public/icons/custom/ holds the few hand-made ones.
const PACKS = {
  ui: 'node_modules/@hackernoon/pixel-icon-library/icons/SVG/solid',
  brands: 'node_modules/@hackernoon/pixel-icon-library/icons/SVG/brands',
  tags: 'node_modules/simple-icons/icons',
};

/** @returns {import('astro').AstroIntegration} */
const icons = () => ({
  name: 'icons',
  hooks: {
    'astro:server:setup': ({ server }) => {
      server.middlewares.use('/icons', (req, res, next) => {
        const m = /^\/(ui|brands|tags)\/([\w-]+\.svg)$/.exec(req.url ?? '');
        const file = m && `${PACKS[/** @type {keyof PACKS} */ (m[1])]}/${m[2]}`;
        if (!file || !existsSync(file)) return next();
        res.setHeader('Content-Type', 'image/svg+xml');
        res.end(readFileSync(file));
      });
    },
    'astro:build:done': ({ dir }) => {
      const out = (/** @type {string} */ p) => fileURLToPath(new URL(`icons/${p}`, dir));
      // ponytail: ships every pixel icon (~300 small files, only the used ones get fetched); list them if that ever matters.
      cpSync(PACKS.ui, out('ui'), { recursive: true });
      cpSync(PACKS.brands, out('brands'), { recursive: true });
      // Only the tag logos in use; a slug simple-icons doesn't have fails the build here.
      for (const slug of Object.values(TAG_ICONS)) {
        if (!slug.startsWith('custom/')) cpSync(`${PACKS.tags}/${slug}.svg`, out(`tags/${slug}.svg`));
      }
    },
  },
});

export default defineConfig({
  site: VITE_SITE_URL || undefined,
  integrations: [react(), mdx(), icons()],
  // The contact form reads VITE_WEB3FORMS_KEY in the browser. Astro exposes
  // only PUBLIC_* by default; keeping VITE_ means the Pages env vars don't move.
  vite: { envPrefix: ['PUBLIC_', 'VITE_'] },
});
