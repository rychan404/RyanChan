// One-time CDN vendoring (spec section 11.2, decision D6). Re-runnable and idempotent.
// Run with: node scripts/fetch-assets.mjs
import { mkdir, writeFile } from 'node:fs/promises';
import { dirname } from 'node:path';

const HN = 'https://cdn.jsdelivr.net/npm/@hackernoon/pixel-icon-library@1.1.0/icons/SVG';

// 23 solid UI icons.
const UI_ICONS = [
  'home', 'user', 'briefcase', 'bolt', 'envelope', 'moon', 'brightness-high',
  'bars', 'times', 'chevron-down', 'play', 'pause', 'refresh', 'check-box',
  'clock', 'fire', 'seedlings', 'music', 'code', 'cog', 'video-camera',
  'arrow-left', 'external-link',
];

const BRAND_ICONS = ['github', 'linkedin', 'youtube'];

// The distinct simpleicons slugs behind TAG_ICONS, plus the one icons8 AWS PNG.
// NOTE: 'adobepremierepro' and 'adobeaftereffects' removed (not available on simpleicons).
const TAG_SLUGS = [
  'python', 'java', 'typescript', 'javascript', 'html5', 'css', 'c', 'react',
  'fastapi', 'tailwindcss', 'mongodb', 'postgresql', 'docker', 'pandas',
  'eclipseide', 'davinciresolve', 'audacity', 'git', 'github', 'figma',
];

// URL overrides for tags that have a different simpleicons slug than their filename.
const TAG_URL_OVERRIDES = {
  'java': 'openjdk',  // openjdk is the only Java variant on simpleicons
};

const TAG_ABSOLUTE = {
  'amazon-web-services.png':
    'https://img.icons8.com/m_outlined/512/amazon-web-services.png',
};

const FONTS = {
  'jetbrains-mono-400.woff2':
    'https://cdn.jsdelivr.net/fontsource/fonts/jetbrains-mono@latest/latin-400-normal.woff2',
  'jetbrains-mono-500.woff2':
    'https://cdn.jsdelivr.net/fontsource/fonts/jetbrains-mono@latest/latin-500-normal.woff2',
  'jetbrains-mono-700.woff2':
    'https://cdn.jsdelivr.net/fontsource/fonts/jetbrains-mono@latest/latin-700-normal.woff2',
};

async function get(url, dest) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${res.status} ${res.statusText} for ${url}`);
  const buf = Buffer.from(await res.arrayBuffer());
  if (buf.length === 0) throw new Error(`empty response for ${url}`);
  await mkdir(dirname(dest), { recursive: true });
  await writeFile(dest, buf);
  console.log(`  ${dest}  (${buf.length} bytes)`);
}

const jobs = [
  ...UI_ICONS.map((n) => [`${HN}/solid/${n}-solid.svg`, `public/icons/ui/${n}-solid.svg`]),
  ...BRAND_ICONS.map((n) => [`${HN}/brands/${n}.svg`, `public/icons/brands/${n}.svg`]),
  ...TAG_SLUGS.map((s) => {
    const urlSlug = TAG_URL_OVERRIDES[s] || s;
    return [`https://cdn.simpleicons.org/${urlSlug}`, `public/icons/tags/${s}.svg`];
  }),
  ...Object.entries(TAG_ABSOLUTE).map(([f, u]) => [u, `public/icons/tags/${f}`]),
  ...Object.entries(FONTS).map(([f, u]) => [u, `public/fonts/${f}`]),
];

// Total: 23 UI + 3 brands + 20 tags + 1 AWS PNG + 3 fonts = 50 files.
console.log(`Fetching ${jobs.length} assets...`);
for (const [url, dest] of jobs) await get(url, dest);
console.log('Done.');
