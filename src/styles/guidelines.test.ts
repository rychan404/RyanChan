// @vitest-environment node
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const SRC = fileURLToPath(new URL('..', import.meta.url));

/** Files the rules do not apply to, each with the reason. */
const EXEMPT: Record<string, string> = {
  'scenes/': 'pixel-art scene lighting, not UI chrome',
  'content/tags.ts': 'third-party brand colours per technology',
  'components/ImageSlot.tsx': 'deliberately neutral dev placeholder',
};

const RULES: [name: string, re: RegExp][] = [
  ['raw colour — use a --color-* / --pixel-* token (hsl(from var(--token) …) is fine)', /#[0-9a-fA-F]{3,8}\b|\brgba?\(|\bhsla?\((?!from var\()/],
  ['raw font size — use a --fs-* token', /\bfontSize:[^,}\n]*\d(?:\.\d+)?px|\bfont:\s*['"`][^'"`]*px/],
  ['font family — use var(--font-display) or var(--font-body)', /\bfontFamily:(?!\s*['"`]var\(--font-(?:display|body)\)['"`])/],
  ['raw border width — use a --border-* token', /\b(?:border|outline)(?:Top|Right|Bottom|Left)?(?:Width)?:[^,}\n]*\d(?:\.\d+)?px/],
  ['raw shadow offset — use var(--shadow-control) or var(--shadow-card)', /\bboxShadow:[^,}\n]*\d(?:\.\d+)?px/],
];

/** The CSS equivalents: resting shadows and press offsets must come from the lift tokens. */
const CSS_SHADOW_RULES: [name: string, re: RegExp][] = [
  ['raw shadow offset — use var(--shadow-control) or var(--shadow-card)', /box-shadow:[^;}]*\d(?:\.\d+)?px/],
  ['raw press offset — use var(--press-control) or var(--press-card)', /:active\{[^}]*translate\([^)]*\dpx/],
];

function walk(dir: string): string[] {
  return readdirSync(dir).flatMap((n) => {
    const p = join(dir, n);
    return statSync(p).isDirectory() ? walk(p) : [p];
  });
}

const rel = (p: string) => relative(SRC, p).split(sep).join('/');
const FILES = walk(SRC)
  .filter((p) => /\.tsx?$/.test(p) && !/\.test\.tsx?$/.test(p))
  .filter((p) => !Object.keys(EXEMPT).some((e) => rel(p).startsWith(e)));

function violations(text: string, rules: [string, RegExp][]) {
  return text.split('\n').flatMap((line, i) =>
    rules.filter(([, re]) => re.test(line)).map(([name]) => `${i + 1}: ${name}\n    ${line.trim()}`),
  );
}

describe('components use tokens, not raw values', () => {
  it.each(FILES.map(rel))('%s', (file) => {
    expect(violations(readFileSync(join(SRC, file), 'utf8'), RULES)).toEqual([]);
  });
});

describe('shared stylesheets use tokens, not raw colours', () => {
  it.each(['styles/patterns.css', 'styles/interactions.css', 'styles/global.css'])('%s', (file) => {
    expect(violations(readFileSync(join(SRC, file), 'utf8'), [RULES[0]])).toEqual([]);
  });
});

describe('shadows and press offsets come from the lift tokens', () => {
  it.each(['styles/patterns.css', 'styles/interactions.css', 'styles/tokens/components.css'])('%s', (file) => {
    expect(violations(readFileSync(join(SRC, file), 'utf8'), CSS_SHADOW_RULES)).toEqual([]);
  });
});

describe('theme-derived tokens are redeclared under .theme-light', () => {
  const css = readFileSync(join(SRC, 'styles/tokens/colors.css'), 'utf8');
  const block = css.slice(css.indexOf(':root,.theme-light{'));
  it.each(['--edge-on-bg', '--edge-on-surface', '--edge-on-bg-alt', '--edge-primary', '--dither-ink-about'])('%s', (t) => {
    expect(block.slice(0, block.indexOf('}'))).toContain(`${t}:`);
  });
});
