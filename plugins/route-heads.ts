import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import type { Plugin } from 'vite';
import { parseProject } from './parse-project';

const PROJECTS_DIR = 'src/content/projects';
const SITE_NAME = 'Ryan Chan';
const CARD = '/og.png';

export type RouteHead = {
  /** Path inside dist/, e.g. 'projects/loopline/index.html'. */
  file: string;
  /** Site-absolute route, e.g. '/projects/loopline'. */
  path: string;
  title: string;
  description: string;
};

const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/** Rewrite one built index.html's head for one route. Pure — no fs, no bundler,
 *  which is why the tests above need neither. */
export function withHead(indexHtml: string, head: RouteHead, siteUrl: string): string {
  const url = siteUrl ? new URL(head.path, siteUrl).href : head.path;

  // Replace title
  let withTitle = indexHtml;
  const titleStart = withTitle.indexOf('<title>');
  const titleEnd = withTitle.indexOf('</title>');
  if (titleStart === -1 || titleEnd === -1) {
    throw new Error('route-heads: no <title> in the built index.html');
  }
  withTitle = withTitle.substring(0, titleStart) + `<title>${esc(head.title)}</title>` + withTitle.substring(titleEnd + 8);

  // Replace description - find and replace using substring
  let withDesc = withTitle;
  const descStart = withDesc.indexOf('<meta name="description" content="');
  const descValueStart = descStart + '<meta name="description" content="'.length;
  const descValueEnd = withDesc.indexOf('"', descValueStart);
  if (descStart === -1 || descValueEnd === -1) {
    throw new Error('route-heads: no <meta name="description"> in the built index.html');
  }
  withDesc = withDesc.substring(0, descValueStart) + esc(head.description) + withDesc.substring(descValueEnd);

  const tags = [
    '<meta property="og:type" content="website" />',
    `<meta property="og:site_name" content="${SITE_NAME}" />`,
    `<meta property="og:title" content="${esc(head.title)}" />`,
    `<meta property="og:description" content="${esc(head.description)}" />`,
    `<meta property="og:url" content="${esc(url)}" />`,
    ...(siteUrl ? [`<meta property="og:image" content="${esc(new URL(CARD, siteUrl).href)}" />`] : []),
    `<meta name="twitter:card" content="${siteUrl ? 'summary_large_image' : 'summary'}" />`,
    `<link rel="canonical" href="${esc(url)}" />`,
  ].join('\n    ');

  return withDesc.replace('</head>', `  ${tags}\n  </head>`);
}

/** Reads the project Markdown directly rather than importing src/content/projects.ts,
 *  which is built on import.meta.glob and only resolves inside Vite. */
async function projectHeads(): Promise<RouteHead[]> {
  const dirs = (await readdir(PROJECTS_DIR, { withFileTypes: true })).filter((e) => e.isDirectory());
  return Promise.all(
    dirs.map(async (dir) => {
      const file = join(PROJECTS_DIR, dir.name, 'index.md');
      const p = parseProject(await readFile(file, 'utf8'), dir.name, file);
      return {
        file: `projects/${p.id}/index.html`,
        path: `/projects/${p.id}`,
        title: `${p.title} — ${SITE_NAME}`,
        description: p.blurb,
      };
    }),
  );
}

/** Emits one HTML file per route, identical to index.html apart from its head,
 *  so link-preview bots — which never run the bundle — see the right card. */
export function routeHeads(): Plugin {
  let siteUrl = '';
  return {
    name: 'route-heads',
    apply: 'build',
    configResolved(config) {
      siteUrl = config.env.VITE_SITE_URL ?? '';
    },
    async writeBundle(options) {
      if (!siteUrl) {
        this.warn('VITE_SITE_URL is not set — og:image and absolute og:url are omitted.');
      }
      const dist = options.dir!;
      const index = await readFile(join(dist, 'index.html'), 'utf8');

      const home: RouteHead = {
        file: 'index.html',
        path: '/',
        title: 'Ryan Chan — Software Engineer and Video Editor',
        description:
          'Portfolio of Ryan Chan, a software engineer and video editor in the DMV building technology around what people actually want.',
      };

      for (const head of [home, ...(await projectHeads())]) {
        const out = join(dist, head.file);
        await mkdir(dirname(out), { recursive: true });
        await writeFile(out, withHead(index, head, siteUrl));
      }
    },
  };
}
