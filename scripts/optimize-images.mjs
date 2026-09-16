// One-time downscale of the two oversized About images (spec section 11.1).
// Reads from docs/design/assets (the untouched originals) and writes into
// public/assets, so re-running is safe and idempotent.
// Run with: npm run optimize:images
import { mkdir } from 'node:fs/promises';
import sharp from 'sharp';

const OUT_DIR = 'public/assets/about';

// Target roughly 2x the largest size each image ever renders at.
const JOBS = [
  { src: 'docs/design/assets/about/about-headshot.png', name: 'about-headshot', width: 760 },
  { src: 'docs/design/assets/about/fact-eggs.png', name: 'fact-eggs', width: 440 },
];

await mkdir(OUT_DIR, { recursive: true });

for (const { src, name, width } of JOBS) {
  const base = sharp(src).resize({ width, withoutEnlargement: true });
  const png = await base.clone().png({ compressionLevel: 9 }).toBuffer();
  const webp = await base.clone().webp({ quality: 82 }).toBuffer();
  await sharp(png).toFile(`${OUT_DIR}/${name}.png`);
  await sharp(webp).toFile(`${OUT_DIR}/${name}.webp`);
  const meta = await sharp(png).metadata();
  console.log(
    `${name}: ${meta.width}x${meta.height}  png ${(png.length / 1024).toFixed(0)} KB  ` +
    `webp ${(webp.length / 1024).toFixed(0)} KB`,
  );
}
