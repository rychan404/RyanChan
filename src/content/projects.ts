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
  blurb: string;
  tags: string[];
  role: string;
  stack: string;
  outcome?: string;
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

export const MONTHS = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

/** 'MAR 2026' -> months since year 0. The schema guarantees the 'MMM YYYY' shape. */
const monthKey = (year: string) => {
  const [m, y] = year.split(' ');
  return Number(y) * 12 + MONTHS.indexOf(m);
};

/** Newest first; the directory prefix breaks ties within a month. */
export const byNewest = (a: Project, b: Project) => monthKey(b.year) - monthKey(a.year) || a.order - b.order;

export function filterProjects(list: Project[], filter: Filter): Project[] {
  return filter === 'all' ? list : list.filter((p) => p.kind === filter);
}

export const FILTER_LABELS: Record<Filter, string> = {
  all: 'All',
  code: 'Code',
  video: 'Video',
  misc: 'Misc',
};

/** Opens on All, so the roster shows every project. (The prototype opened on Code.) */
export const DEFAULT_FILTER: Filter = 'all';
