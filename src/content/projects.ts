/** The Project type and the pure helpers shared by the Astro pages and the
 *  React islands. src/content/load.ts builds Projects from the collection;
 *  src/content.config.ts holds the frontmatter schema. */
export type ProjectKind = 'code' | 'video' | 'misc';
export type Filter = 'all' | ProjectKind;

/** Validated frontmatter, with `image` already resolved to a URL. */
export type ProjectData = {
  kind: ProjectKind;
  title: string;
  year: string;
  status: 'Completed' | 'In Progress';
  blurb: string;
  tags: string[];
  role: string;            // real content, currently unrendered
  stack: string;           // real content, currently unrendered
  slotHint: string;
  cta: string;
  ctaUrl?: string;         // absent -> the CTA preventDefaults, as the prototype does
  image?: string;
};

export type Project = ProjectData & {
  id: string;              // from the directory name, minus the numeric prefix
  order: number;           // from the directory prefix
};

const DIR_RE = /^(\d+)-(.+)$/;

export function toProject(dir: string, data: ProjectData): Project {
  const m = DIR_RE.exec(dir);
  if (!m) throw new Error(`project directory "${dir}" needs a numeric prefix, e.g. "02-${dir}"`);
  return {
    ...data,
    id: m[2],
    order: Number(m[1]),
  };
}

export const byOrder = (a: Project, b: Project) => a.order - b.order;

export function filterProjects(list: Project[], filter: Filter): Project[] {
  return filter === 'all' ? list : list.filter((p) => p.kind === filter);
}

export const FILTER_LABELS: Record<Filter, string> = {
  all: 'All',
  code: 'Code',
  video: 'Video',
  misc: 'Misc',
};

/** The prototype opens on Code, not All (spec section 8, Projects). */
export const DEFAULT_FILTER: Filter = 'code';
