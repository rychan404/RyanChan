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

const schema = projectSchema({ image: () => z.object({ src: z.string() }) });

const seedFiles = readdirSync(DIR).map((dir) => {
  const file = readdirSync(join(DIR, dir)).find((f) => /^index\.mdx?$/.test(f))!;
  return { dir, data: matter(readFileSync(join(DIR, dir, file), 'utf8')).data };
});

const validData = {
  kind: 'code',
  title: 'Tilebreaker',
  year: 'MAR 2026',
  status: 'Completed',
  blurb: 'A 2D puzzle-platformer about rewinding your own mistakes. Built solo in eight weeks.',
  tags: ['GitHub'],
  role: 'Solo developer',
  stack: 'Godot 4, GDScript',
  slotHint: 'Drop a gameplay screenshot',
  cta: 'Play On Itch',
};

describe('projectSchema', () => {
  it.each(seedFiles.map(({ dir, data }) => [dir, data] as const))('%s frontmatter passes', (_dir, data) => {
    expect(() => schema.parse(data)).not.toThrow();
  });

  it('rejects an unknown key', () => {
    expect(schema.safeParse({ ...validData, tag: ['x'] }).success).toBe(false);
  });

  it('rejects a bad kind enum', () => {
    expect(schema.safeParse({ ...validData, kind: 'game' }).success).toBe(false);
  });

  it('rejects a bad status enum', () => {
    expect(schema.safeParse({ ...validData, status: 'Done' }).success).toBe(false);
  });

  it('rejects a missing required field', () => {
    const { title: _title, ...rest } = validData;
    expect(schema.safeParse(rest).success).toBe(false);
  });

  it('rejects a ctaUrl that is not a url', () => {
    expect(schema.safeParse({ ...validData, ctaUrl: 'not a url' }).success).toBe(false);
  });
});
