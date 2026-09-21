import { z } from 'astro/zod';

/** The project frontmatter. `image` is Astro's image() helper in the collection;
 *  tests pass a stand-in. .strict() is the point: an unknown key like `tag:`
 *  must fail the build, not silently drop the tags.
 *
 *  `image`'s type is narrowed to `{ src: string }` (not a bare `z.ZodType`,
 *  which would erase to `unknown`) because src/content/load.ts reads
 *  `entry.data.image?.src`; Astro's real image() returns strictly more
 *  fields, which is still assignable here. */
export const projectSchema = ({ image }: { image: () => z.ZodType<{ src: string }> }) =>
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
  }).strict();
