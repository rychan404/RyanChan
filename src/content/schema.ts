import { z } from 'astro/zod';
import { MONTHS } from './projects';

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
    // 'MAR 2026': the projects sort newest first on it, so a typo must fail the build.
    year: z.string().regex(new RegExp(`^(${MONTHS.join('|')}) [0-9]{4}$`), 'year must look like "MAR 2026"'),
    blurb: z.string().min(1),
    tags: z.array(z.string()),
    role: z.string(),
    stack: z.string(),
    // The headline result, shown beside role and stack on the detail page.
    outcome: z.string().min(1).optional(),
    slotHint: z.string().min(1),
    // One button per link on the project page, in this order; none set, no buttons.
    links: z.object({
      site: z.url().optional(),
      github: z.url().optional(),
      video: z.url().optional(),
      // A file in public/ ('/slides/airtight.pdf') or a full URL.
      slides: z.url().or(z.string().regex(/^\/\S+$/, 'slides must be a URL or a path like /slides/x.pdf')).optional(),
      devpost: z.url().optional(),
    }).strict().optional(),
    image: image().optional(),
  }).strict();
