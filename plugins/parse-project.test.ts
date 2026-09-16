/**
 * @vitest-environment node
 */
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { emitModule, parseProject } from './parse-project';

const fixture = (name: string) =>
  readFileSync(
    fileURLToPath(new URL(`./__fixtures__/${name}.md`, import.meta.url)),
    'utf8',
  );

const parse = (name: string, dir = '02-loopline') =>
  parseProject(fixture(name), dir, `src/content/projects/${dir}/index.md`);

describe('frontmatter validation', () => {
  it('accepts a fully populated file', () => {
    const p = parse('valid-full');
    expect(p.kind).toBe('code');
    expect(p.title).toBe('Loopline');
    expect(p.year).toBe('JUN 2026');
    expect(p.status).toBe('In Progress');
    expect(p.blurb).toBe('A CLI task runner that watches your project and reruns only what actually changed.');
    expect(p.tags).toEqual(['Docker', 'GitHub']);
    expect(p.role).toBe('Maintainer');
    expect(p.stack).toBe('Rust, tokio, notify');
    expect(p.slotHint).toBe('Drop a terminal screenshot');
    expect(p.cta).toBe('View Source');
    expect(p.ctaUrl).toBe('https://github.com/example/loopline');
    expect(p.imagePath).toBe('./cover.png');
  });

  it('leaves ctaUrl and imagePath undefined when absent', () => {
    const p = parse('valid-bullets-only', '08-piano-covers');
    expect(p.ctaUrl).toBeUndefined();
    expect(p.imagePath).toBeUndefined();
  });

  it('rejects a missing required field, naming the file and the field', () => {
    expect(() => parse('bad-missing-field', '08-piano-covers'))
      .toThrow(/08-piano-covers\/index\.md.*blurb/s);
  });

  it('rejects a kind outside the enum, listing the allowed values', () => {
    expect(() => parse('bad-kind', '08-piano-covers'))
      .toThrow(/08-piano-covers\/index\.md.*"kind".*code.*video.*misc.*audio/s);
  });

  it('rejects a status outside the enum, listing the allowed values', () => {
    expect(() => parse('bad-status', '03-nightshift'))
      .toThrow(/03-nightshift\/index\.md.*"status".*Completed.*In Progress.*Shipped/s);
  });

  it('rejects an unknown key so a typo fails loudly', () => {
    expect(() => parse('bad-unknown-key', '08-piano-covers'))
      .toThrow(/08-piano-covers\/index\.md.*unrecognized.*tag/is);
  });

  it('rejects tags that are not an array', () => {
    expect(() => parse('bad-tags-not-array', '08-piano-covers'))
      .toThrow(/08-piano-covers\/index\.md.*"tags"/s);
  });
});

describe('body parsing', () => {
  it('turns a paragraph into { p } and a list item into a bare string', () => {
    expect(parse('valid-full').notes).toEqual([
      { p: 'Started as a personal itch.' },
      'Dependency graph diffing cut my own build loop from 40s to under 3s.',
      'Config is a twelve-line TOML file — no plugin system, on purpose.',
    ]);
  });

  it('handles bullets only', () => {
    expect(parse('valid-bullets-only', '08-piano-covers').notes).toEqual([
      'About twenty minutes a day, most days.',
      'Working through a Studio Ghibli songbook right now.',
    ]);
  });

  it('handles a paragraph only', () => {
    expect(parse('valid-paragraph-only', '07-terra-nova-trailer').notes).toEqual([
      { p: 'One paragraph and nothing else.' },
    ]);
  });

  it('handles an empty body', () => {
    expect(parse('valid-empty-body', '07-terra-nova-trailer').notes).toEqual([]);
  });

  it('fails the build on a heading', () => {
    expect(() => parse('bad-heading', '08-piano-covers'))
      .toThrow(/08-piano-covers\/index\.md.*heading/i);
  });

  it('fails the build on a code block', () => {
    expect(() => parse('bad-code-block', '08-piano-covers'))
      .toThrow(/08-piano-covers\/index\.md.*code/i);
  });
});

describe('derivation', () => {
  it('derives id and order from the directory name', () => {
    const p = parse('valid-bullets-only', '08-piano-covers');
    expect(p.id).toBe('piano-covers');
    expect(p.order).toBe(8);
  });

  it('derives id and order for a two-digit-prefixed multi-word slug', () => {
    const p = parse('valid-bullets-only', '05-dust-and-neon');
    expect(p.id).toBe('dust-and-neon');
    expect(p.order).toBe(5);
  });

  it('rejects a directory name with no numeric prefix', () => {
    expect(() => parseProject(fixture('valid-bullets-only'), 'piano-covers', 'x/piano-covers/index.md'))
      .toThrow(/piano-covers.*numeric prefix/is);
  });

  it('derives statusCls from status', () => {
    expect(parse('valid-full').statusCls).toBe('pixel-badge--warning');
    expect(parse('valid-paragraph-only', '07-terra-nova-trailer').statusCls).toBe('');
  });
});

describe('emitModule', () => {
  it('emits an import for a relative image and references it', () => {
    const src = emitModule(parse('valid-full'));
    expect(src).toContain("import __image from './cover.png';");
    expect(src).toContain('image: __image');
    expect(src).toContain('export default');
  });

  it('omits the image key entirely when there is no image', () => {
    const src = emitModule(parse('valid-bullets-only', '08-piano-covers'));
    expect(src).not.toContain('import __image');
    expect(src).not.toContain('image:');
  });

  it('emits valid JSON for the data payload', () => {
    const src = emitModule(parse('valid-bullets-only', '08-piano-covers'));
    const json = src.slice(src.indexOf('{'), src.lastIndexOf('}') + 1);
    expect(() => JSON.parse(json)).not.toThrow();
  });
});
