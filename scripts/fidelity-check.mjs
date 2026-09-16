// THROWAWAY (plan Task 23). Captures the prototype and the rebuild side by
// side and reports where they differ. Delete this file, its three
// devDependencies and the "fidelity" npm script once the port is done — it is
// a migration tool, not a test, and the prototype stops being the contract the
// day the port lands.
//
//   1. npm run build && npm run preview     <- leave running in another terminal
//   2. npm run fidelity
//
// Both sides are captured in the same run on the same machine, so there is no
// baseline to commit and no cross-machine font-rendering noise. Always exits 0
// once it gets going: this reports, it does not gate.

import { createReadStream } from 'node:fs';
import { mkdir, stat, writeFile } from 'node:fs/promises';
import { createServer } from 'node:http';
import { dirname, extname, join, normalize } from 'node:path';
import pixelmatch from 'pixelmatch';
import { PNG } from 'pngjs';
import { chromium } from 'playwright';

const REBUILD = 'http://localhost:4173';
const PROTOTYPE = 'http://localhost:4174';
const OUT = '.fidelity';

const VIEWPORTS = [
  { name: 'desktop', width: 1440, height: 1000 },
  { name: 'mobile', width: 375, height: 812 },
];
const THEMES = ['dark', 'light'];
const SECTIONS = ['home', 'about', 'projects', 'skills', 'contact'];
/** The prototype's ids map onto the rebuild's slugs. */
const DETAILS = [
  { prototype: 'p2', rebuild: 'loopline' },
  { prototype: 'm2', rebuild: 'origami-sculptures' },
];

/** Task 22 re-encodes the About headshot on purpose, so that panel is looser. */
const toleranceFor = (name) => (name.includes('-about-') ? 0.02 : 0.002);

// --- the prototype, served straight out of docs/design/ -------------------------

const TYPES = {
  '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css',
  '.png': 'image/png', '.svg': 'image/svg+xml', '.ttf': 'font/ttf',
  '.json': 'application/json', '.woff2': 'font/woff2',
};

function servePrototype() {
  const server = createServer(async (req, res) => {
    const path = normalize(decodeURIComponent(new URL(req.url, 'http://x').pathname))
      .replace(/^(\.\.[/\\])+/, '');
    const file = join('docs/design', path === '/' ? 'portfolio-home.dc.html' : path);
    try {
      if (!(await stat(file)).isFile()) throw new Error('not a file');
      res.writeHead(200, { 'Content-Type': TYPES[extname(file)] || 'application/octet-stream' });
      createReadStream(file).pipe(res);
    } catch {
      res.writeHead(404).end('not found');
    }
  });
  return new Promise((resolve) => server.listen(4174, () => resolve(server)));
}

// --- capture ---------------------------------------------------------------

const maskFor = (page) => [
  page.locator('image-slot'),
  page.locator('[data-slot-placeholder]'),
];

/** Kill every animation and transition, then wait for fonts and images. */
async function freeze(page) {
  await page.addStyleTag({
    content: `*, *::before, *::after {
      animation: none !important;
      transition: none !important;
      animation-delay: 0s !important;
      scroll-behavior: auto !important;
    }`,
  });
  await page.evaluate(() => document.fonts.ready);
  await page.evaluate(async () => {
    await Promise.all(
      Array.from(document.images)
        .filter((i) => !i.complete)
        .map((i) => new Promise((r) => { i.onload = i.onerror = r; })),
    );
  });
  await page.waitForTimeout(300);
}

/** One themed page, frozen and ready to screenshot. */
async function open(browser, viewport, origin, url, theme) {
  const context = await browser.newContext({
    viewport: { width: viewport.width, height: viewport.height },
    deviceScaleFactor: 1,
  });
  const page = await context.newPage();
  await page.goto(origin);
  await page.evaluate((t) => localStorage.setItem('rc-theme', t), theme);
  await page.goto(url);
  await freeze(page);
  return { context, page };
}

// --- compare ---------------------------------------------------------------

async function save(file, buffer) {
  await mkdir(dirname(file), { recursive: true });
  await writeFile(file, buffer);
}

/** Fraction of differing pixels, or null when the two sizes disagree. */
async function compare(name, expectedBuf, actualBuf) {
  const expected = PNG.sync.read(expectedBuf);
  const actual = PNG.sync.read(actualBuf);
  if (expected.width !== actual.width || expected.height !== actual.height) {
    await save(`${OUT}/${name}.prototype.png`, expectedBuf);
    await save(`${OUT}/${name}.rebuild.png`, actualBuf);
    return {
      ratio: null,
      note: `${expected.width}x${expected.height} vs ${actual.width}x${actual.height}`,
    };
  }
  const diff = new PNG({ width: expected.width, height: expected.height });
  const differing = pixelmatch(
    expected.data, actual.data, diff.data, expected.width, expected.height,
    { threshold: 0.1 },
  );
  const ratio = differing / (expected.width * expected.height);
  if (ratio > toleranceFor(name)) {
    await save(`${OUT}/${name}.prototype.png`, expectedBuf);
    await save(`${OUT}/${name}.rebuild.png`, actualBuf);
    await save(`${OUT}/${name}.diff.png`, PNG.sync.write(diff));
  }
  return { ratio, note: '' };
}

// --- run -------------------------------------------------------------------

try {
  await fetch(REBUILD);
} catch {
  console.error(`Nothing on ${REBUILD}. Run "npm run build && npm run preview" first.`);
  process.exit(1);
}

const server = await servePrototype();
const browser = await chromium.launch();
const rows = [];

for (const viewport of VIEWPORTS) {
  for (const theme of THEMES) {
    const proto = await open(
      browser, viewport, PROTOTYPE, `${PROTOTYPE}/portfolio-home.dc.html`, theme);
    const built = await open(browser, viewport, REBUILD, REBUILD, theme);

    for (const id of SECTIONS) {
      const name = `home-${id}-${viewport.name}-${theme}`;
      rows.push([name, await compare(
        name,
        await proto.page.locator(`#${id}`).screenshot({ mask: maskFor(proto.page) }),
        await built.page.locator(`#${id}`).screenshot({ mask: maskFor(built.page) }),
      )]);
    }
    await proto.context.close();
    await built.context.close();

    for (const { prototype, rebuild } of DETAILS) {
      const name = `detail-${rebuild}-${viewport.name}-${theme}`;
      const a = await open(
        browser, viewport, PROTOTYPE,
        `${PROTOTYPE}/project-detail.dc.html?id=${prototype}`, theme);
      const b = await open(
        browser, viewport, REBUILD, `${REBUILD}/projects/${rebuild}`, theme);
      rows.push([name, await compare(
        name,
        await a.page.screenshot({ fullPage: true, mask: maskFor(a.page) }),
        await b.page.screenshot({ fullPage: true, mask: maskFor(b.page) }),
      )]);
      await a.context.close();
      await b.context.close();
    }
  }
}

await browser.close();
server.close();

// Worst first — that is the one to go fix.
rows.sort((x, y) => (y[1].ratio ?? Infinity) - (x[1].ratio ?? Infinity));
let over = 0;
for (const [name, { ratio, note }] of rows) {
  if (ratio === null) {
    over++;
    console.log(`SIZE  ${name.padEnd(38)} ${note}`);
    continue;
  }
  const bad = ratio > toleranceFor(name);
  if (bad) over++;
  console.log(`${bad ? 'DIFF' : 'ok  '}  ${name.padEnd(38)} ${(ratio * 100).toFixed(3)}%`);
}
console.log(`\n${rows.length - over}/${rows.length} within tolerance. Images for the rest in ${OUT}/`);
