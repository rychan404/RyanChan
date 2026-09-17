import { describe, expect, it } from 'vitest';
import { withHead, type RouteHead } from './route-heads';

const INDEX = [
  '<!doctype html>',
  '<html lang="en">',
  '  <head>',
  '    <meta charset="utf-8" />',
  '    <title>Ryan Chan — Software Engineer and Video Editor</title>',
  '    <meta name="description" content="Portfolio of Ryan Chan." />',
  '  </head>',
  '  <body><div id="root"></div></body>',
  '</html>',
].join('\n');

const HEAD: RouteHead = {
  file: 'projects/loopline/index.html',
  path: '/projects/loopline',
  title: 'Loopline — Ryan Chan',
  description: 'A CLI task runner that watches your project.',
};

describe('withHead', () => {
  it('replaces the title and the description', () => {
    const out = withHead(INDEX, HEAD, 'https://example.com');
    expect(out).toContain('<title>Loopline — Ryan Chan</title>');
    expect(out).toContain('content="A CLI task runner that watches your project."');
    expect(out).not.toContain('Software Engineer and Video Editor');
  });

  it('makes og:url and og:image absolute', () => {
    const out = withHead(INDEX, HEAD, 'https://example.com');
    expect(out).toContain('property="og:url" content="https://example.com/projects/loopline"');
    expect(out).toContain('property="og:image" content="https://example.com/og.png"');
    expect(out).toContain('rel="canonical" href="https://example.com/projects/loopline"');
  });

  it('degrades without a site URL rather than emitting a broken image tag', () => {
    const out = withHead(INDEX, HEAD, '');
    expect(out).toContain('property="og:url" content="/projects/loopline"');
    expect(out).not.toContain('og:image');
  });

  it('leaves the body untouched', () => {
    expect(withHead(INDEX, HEAD, 'https://example.com')).toContain('<div id="root"></div>');
  });

  it('escapes quotes in copy', () => {
    const out = withHead(INDEX, { ...HEAD, description: 'He said "hi" & left' }, '');
    expect(out).toContain('content="He said &quot;hi&quot; &amp; left"');
  });

  it('throws when the template has no title to replace', () => {
    expect(() => withHead('<html><head></head></html>', HEAD, '')).toThrow(/title/);
  });
});
