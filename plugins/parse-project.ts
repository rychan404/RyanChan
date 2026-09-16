import matter from 'gray-matter';
import { marked } from 'marked';
import { z } from 'zod';

export type ProjectNote = string | { p: string };

export type ParsedProject = {
  id: string;
  order: number;
  kind: 'code' | 'video' | 'misc';
  title: string;
  year: string;
  status: 'Completed' | 'In Progress';
  statusCls: '' | 'pixel-badge--warning';
  blurb: string;
  tags: string[];
  role: string;
  stack: string;
  slotHint: string;
  cta: string;
  ctaUrl?: string;
  notes: ProjectNote[];
  imagePath?: string;
};

// .strict() is the point: an unknown key like `tag:` must fail the build,
// not silently drop the tags (spec section 7.2, step 2).
const Frontmatter = z
  .object({
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
    ctaUrl: z.string().url().optional(),
    image: z.string().min(1).optional(),
  })
  .strict();

const DIR_RE = /^(\d+)-(.+)$/;

function fail(filePath: string, message: string): never {
  throw new Error(`${filePath}: ${message}`);
}

function formatZodError(err: z.ZodError): string {
  return err.issues
    .map((i) => {
      const at = i.path.length ? `"${i.path.join('.')}" ` : '';
      if (i.code === 'invalid_enum_value') {
        return `${at}must be one of ${i.options.join(', ')} (got ${JSON.stringify(i.received)})`;
      }
      if (i.code === 'unrecognized_keys') {
        return `unrecognized key(s): ${i.keys.join(', ')}`;
      }
      if (i.code === 'invalid_type' && i.received === 'undefined') {
        return `${at}is required`;
      }
      return `${at}${i.message}`;
    })
    .join('; ');
}

/** Turn the Markdown body into the prototype's (string | {p})[] note list.
 *  Only paragraphs and lists are allowed; anything else fails the build. */
function parseNotes(body: string, filePath: string): ProjectNote[] {
  const notes: ProjectNote[] = [];
  for (const token of marked.lexer(body.trim())) {
    switch (token.type) {
      case 'space':
        break;
      case 'paragraph':
        notes.push({ p: token.text });
        break;
      case 'list':
        for (const item of token.items) notes.push(item.text);
        break;
      default:
        fail(
          filePath,
          `project bodies may only contain paragraphs and bullet lists, ` +
            `but this file contains a "${token.type}" block. The design renders ` +
            `exactly two note forms and has no styling for anything else.`,
        );
    }
  }
  return notes;
}

export function parseProject(
  source: string,
  dirName: string,
  filePath: string,
): ParsedProject {
  const dir = DIR_RE.exec(dirName);
  if (!dir) {
    fail(
      filePath,
      `project directory "${dirName}" needs a numeric prefix, e.g. "02-${dirName}"`,
    );
  }
  const order = Number(dir[1]);
  const id = dir[2];

  const { data, content } = matter(source);
  const parsed = Frontmatter.safeParse(data);
  if (!parsed.success) fail(filePath, formatZodError(parsed.error));
  const fm = parsed.data;

  return {
    id,
    order,
    kind: fm.kind,
    title: fm.title,
    year: fm.year,
    status: fm.status,
    statusCls: fm.status === 'In Progress' ? 'pixel-badge--warning' : '',
    blurb: fm.blurb,
    tags: fm.tags,
    role: fm.role,
    stack: fm.stack,
    slotHint: fm.slotHint,
    cta: fm.cta,
    ...(fm.ctaUrl ? { ctaUrl: fm.ctaUrl } : {}),
    notes: parseNotes(content, filePath),
    ...(fm.image ? { imagePath: fm.image } : {}),
  };
}

/** Emit the ES module Vite will hand the browser. A relative image becomes a
 *  real `import`, so Vite resolves, hashes and copies it like any other asset. */
export function emitModule(p: ParsedProject): string {
  const { imagePath, ...data } = p;
  const body = JSON.stringify(data, null, 2);
  if (!imagePath) return `export default ${body};\n`;
  return (
    `import __image from '${imagePath}';\n` +
    `export default { ...${body}, image: __image };\n`
  );
}
