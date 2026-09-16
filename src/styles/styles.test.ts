import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const read = (p: string) => readFileSync(new URL(p, import.meta.url), 'utf8');

const LIVE_KEYFRAMES = [
  'pxblink', 'pxbob', 'pxsunglow', 'pxmoonglow', 'pxstartwinkle',
  'pxtapeExit', 'pxtapeEnter', 'pxbirds', 'pxflicker', 'pxfireglow',
  'pxsmoke', 'pxrecdotblink', 'pxsway', 'pxsplash', 'pxballswing',
  'pxpersonbob', 'pxsunslide', 'pxwavesway',
];
const DEAD_KEYFRAMES = ['pxdrift', 'pxfloat', 'pxgrass', 'pxrecblink', 'pxsunpulse'];

const INTERACTION_CLASSES = [
  'rc-logo', 'rc-nav-link', 'rc-filter-option', 'rc-fact-term',
  'rc-footer-link', 'rc-project-card', 'rc-ghost-btn', 'rc-popover-close',
  'rc-sprite-toggle', 'rc-pixel-back', 'rc-hero-cta',
];

describe('keyframes.css', () => {
  const css = read('./keyframes.css');

  it.each(LIVE_KEYFRAMES)('defines %s', (name) => {
    expect(css).toContain(`@keyframes ${name}{`);
  });

  it.each(DEAD_KEYFRAMES)('does not port the dead keyframe %s', (name) => {
    expect(css).not.toContain(`@keyframes ${name}{`);
  });

  it('defines exactly 18 keyframes', () => {
    expect(css.match(/@keyframes /g)).toHaveLength(18);
  });
});

describe('interactions.css', () => {
  const css = read('./interactions.css');

  it.each(INTERACTION_CLASSES)('defines a rule for .%s', (cls) => {
    expect(css).toContain(`.${cls}:`);
  });
});

describe('typography.css', () => {
  const css = read('./tokens/typography.css');

  it('points every font at the vendored copy, not a CDN', () => {
    expect(css).not.toContain('cdn.jsdelivr.net');
    expect(css).toContain('url(/fonts/editundo.ttf)');
    expect(css).toContain('url(/fonts/jetbrains-mono-400.woff2)');
    expect(css).toContain('url(/fonts/jetbrains-mono-500.woff2)');
    expect(css).toContain('url(/fonts/jetbrains-mono-700.woff2)');
  });
});

describe('global.css', () => {
  const css = read('./global.css');

  it('keeps the light-theme edge and tag-tint overrides', () => {
    expect(css).toContain('.theme-light{--px-edge:#1a1b1c;--tag-tint-pct:35%;--tag-border-pct:30%}');
    expect(css).toContain(':root{--tag-tint-pct:60%;--tag-border-pct:45%}');
  });

  it('keeps the landscape hero override', () => {
    expect(css).toContain('@media (orientation:landscape) and (max-height:500px)');
  });
});
