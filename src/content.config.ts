import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { projectSchema } from './content/schema';

const projects = defineCollection({
  loader: glob({
    pattern: '*/index.{md,mdx}',
    base: './src/content/projects',
    // '02-loopline/index.mdx' -> '02-loopline'; toProject splits off the order.
    generateId: ({ entry }) => entry.split('/')[0],
  }),
  schema: projectSchema,
});

export const collections = { projects };
