import { readFileSync, readdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import matter from 'gray-matter';
import { describe, expect, it } from 'vitest';
import { z } from 'astro/zod';
import { projectSchema } from './schema';

// Not `new URL('./projects/', import.meta.url)`: Vite's asset-URL transform
// matches that exact shape and resolves it as a module import, not a
// directory read. See src/test-projects.ts.
const DIR = join(dirname(fileURLToPath(import.meta.url)), 'projects/');

// Frontmatter writes the image as a relative path; Astro's image() resolves it to an object with src.
const schema = projectSchema({ image: () => z.string().transform((src) => ({ src })) });

const seedFiles = readdirSync(DIR).map((dir) => {
  const file = readdirSync(join(DIR, dir)).find((f) => /^index\.mdx?$/.test(f))!;
  return { dir, data: matter(readFileSync(join(DIR, dir, file), 'utf8')).data };
});

const validData = {
  kind: 'code',
  title: 'Tilebreaker',
  year: 'MAR 2026',
  blurb: 'A 2D puzzle-platformer about rewinding your own mistakes. Built solo in eight weeks.',
  tags: ['Docker'],
  role: 'Solo developer',
  stack: 'Godot 4, GDScript',
  slotHint: 'Drop a gameplay screenshot',
  links: { github: 'https://github.com/rychan404/tilebreaker' },
};

describe('projectSchema', () => {
  it.each(seedFiles.map(({ dir, data }) => [dir, data] as const))('%s frontmatter passes', (_dir, data) => {
    expect(() => schema.parse(data)).not.toThrow();
  });

  it('rejects a year that is not "MMM YYYY"', () => {
    for (const year of ['March 2026', 'MAR 26', '2026', 'mar 2026']) {
      expect(schema.safeParse({ ...validData, year }).success).toBe(false);
    }
  });

  it('rejects an unknown key', () => {
    expect(schema.safeParse({ ...validData, tag: ['x'] }).success).toBe(false);
  });

  it('rejects a bad kind enum', () => {
    expect(schema.safeParse({ ...validData, kind: 'game' }).success).toBe(false);
  });

  it('rejects a missing required field', () => {
    const { title: _title, ...rest } = validData;
    expect(schema.safeParse(rest).success).toBe(false);
  });

  it('rejects a link that is not a url, or of an unknown kind', () => {
    expect(schema.safeParse({ ...validData, links: { github: 'not a url' } }).success).toBe(false);
    expect(schema.safeParse({ ...validData, links: { twitter: 'https://x.com' } }).success).toBe(false);
  });

  it('takes slides as a site path or a URL, but not a bare filename', () => {
    const ok = (slides: string) => schema.safeParse({ ...validData, links: { slides } }).success;
    expect(ok('/slides/airtight.pdf')).toBe(true);
    expect(ok('https://example.com/deck.pdf')).toBe(true);
    expect(ok('airtight.pdf')).toBe(false);
  });
});
