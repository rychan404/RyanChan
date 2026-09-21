import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const projects = defineCollection({
  loader: glob({
    pattern: '*/index.{md,mdx}',
    base: './src/content/projects',
    // '02-loopline/index.mdx' -> '02-loopline'; toProject splits off the order.
    generateId: ({ entry }) => entry.split('/')[0],
  }),
  // .strict() is the point: an unknown key like `tag:` must fail the build,
  // not silently drop the tags.
  schema: ({ image }) =>
    z.object({
      kind: z.enum(['code', 'video', 'misc']),
      title: z.string().min(1),
      year: z.string().min(1),
      status: z.enum(['Completed', 'In Progress']),
      blurb: z.string().min(1),
      tags: z.array(z.string()),
      role: z.string(),
      stack: z.string(),
      slotHint: z.string().min(1),
      cta: z.string().min(1),
      ctaUrl: z.url().optional(),
      image: image().optional(),
    }).strict(),
});

export const collections = { projects };
