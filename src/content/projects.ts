/** The only project module either route imports. The Project type lives here;
 *  plugins/markdown-projects.ts emits objects that satisfy it. */
export type ProjectNote = string | { p: string };
export type ProjectKind = 'code' | 'video' | 'misc';
export type Filter = 'all' | ProjectKind;

export type Project = {
  id: string;              // from the directory name, minus the numeric prefix
  order: number;           // from the directory prefix
  kind: ProjectKind;
  title: string;
  year: string;
  status: 'Completed' | 'In Progress';
  statusCls: '' | 'pixel-badge--warning';
  blurb: string;
  tags: string[];
  role: string;            // real content, currently unrendered
  stack: string;           // real content, currently unrendered
  slotHint: string;
  cta: string;
  ctaUrl?: string;         // absent -> the CTA preventDefaults, as the prototype does
  notes: ProjectNote[];
  image?: string;          // Vite-resolved hashed URL
};

const modules = import.meta.glob<{ default: Project }>('./projects/*/index.md', {
  eager: true,
});

export const PROJECTS: Project[] = Object.values(modules)
  .map((m) => m.default)
  .sort((a, b) => a.order - b.order);

export function findProject(id: string): Project | undefined {
  return PROJECTS.find((p) => p.id === id);
}

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
