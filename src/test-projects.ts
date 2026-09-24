import { readFileSync, readdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import matter from 'gray-matter';
import { byNewest, toProject, type Project, type ProjectData } from './content/projects';

// Not `new URL('./content/projects/', import.meta.url)`: Vite's asset-URL
// transform matches that exact shape and resolves it as a module import
// (colliding with the sibling `content/projects.ts`), not a directory read.
const DIR = join(dirname(fileURLToPath(import.meta.url)), 'content/projects/');

/** The real seed projects, for tests. Reads frontmatter straight off disk,
 *  because astro:content only resolves inside an Astro build. The schema is
 *  enforced there, not here. */
export const TEST_PROJECTS: Project[] = readdirSync(DIR)
  .map((dir) => {
    const file = readdirSync(join(DIR, dir)).find((f) => /^index\.mdx?$/.test(f))!;
    return toProject(dir, matter(readFileSync(join(DIR, dir, file), 'utf8')).data as ProjectData);
  })
  .sort(byNewest);
