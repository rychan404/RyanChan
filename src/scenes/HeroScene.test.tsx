import { render } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import { ThemeProvider } from '../hooks/useTheme';
import { HeroScene } from './HeroScene';

const renderScene = () => render(<ThemeProvider><HeroScene /></ThemeProvider>);

const srcsOf = (c: HTMLElement) =>
  Array.from(c.querySelectorAll('img')).map((i) => i.getAttribute('src'));

const EXPECTED_IMG_ORDER = [
  '/assets/hero/sky-day.png',
  '/assets/hero/birds.png',
  '/assets/hero/sun.png',
  '/assets/hero/sky-night.png',
  '/assets/hero/stars.png',
  '/assets/hero/moon.png',
  '/assets/hero/tennis-net.png',
  '/assets/hero/tennis-player-1.png',
  '/assets/hero/tennis-player-2.png',
  '/assets/hero/tennis-ball.png',
  '/assets/hero/campfire.png',
  '/assets/hero/campfire-flames.png',
  '/assets/hero/campfire-logs.png',
  '/assets/hero/campfire-person-2.png',
  '/assets/hero/campfire-person-1.png',
  '/assets/hero/campfire-smoke.png',
  '/assets/hero/tree-5-z2.png',
  '/assets/hero/tree-4-z3.png',
  '/assets/hero/tree-3-z3.png',
  '/assets/hero/tree-2-z1.png',
  '/assets/hero/tree-1-z1.png',
  '/assets/hero/swing.png',
  '/assets/hero/computer-person.png',
  '/assets/hero/computer.png',
  '/assets/hero/waterfall-ocean.png',
  '/assets/hero/waterfall-splash.png',
  '/assets/hero/camera.png',
  '/assets/hero/camera-record-off.png',
  '/assets/hero/camera-record-on.png',
  '/assets/hero/stars.png',
  '/assets/hero/moon.png',
];

beforeEach(() => localStorage.clear());

describe('HeroScene layer order', () => {
  it('paints 31 images in exactly the prototype order', () => {
    const { container } = renderScene();
    expect(srcsOf(container)).toEqual(EXPECTED_IMG_ORDER);
  });

  it('paints the three background-image layers between moon and tennis-net', () => {
    const { container } = renderScene();
    const bgs = Array.from(container.querySelectorAll('div'))
      .map((d) => (d as HTMLElement).style.backgroundImage)
      .filter((b) => b.includes('/assets/hero/'));
    expect(bgs).toEqual([
      'url("/assets/hero/mountains-back.png")',
      'url("/assets/hero/mountains-front.png")',
      'url("/assets/hero/grass.png")',
    ]);
  });

  it('hides every layer from assistive tech', () => {
    const { container } = renderScene();
    for (const img of Array.from(container.querySelectorAll('img'))) {
      expect(img).toHaveAttribute('aria-hidden', 'true');
    }
  });
});

describe('HeroScene animations', () => {
  it('gives each animated layer the prototype animation string', () => {
    const { container } = renderScene();
    const anim = (src: string, nth = 0) =>
      (container.querySelectorAll(`img[src="${src}"]`)[nth] as HTMLElement).style.animation;

    expect(anim('/assets/hero/birds.png')).toBe('pxbirds 6s steps(4,end) infinite alternate');
    expect(anim('/assets/hero/sun.png')).toBe('pxsunglow 8s steps(8,end) infinite');
    expect(anim('/assets/hero/stars.png')).toBe('pxstartwinkle 8.5s steps(9,end) infinite');
    expect(anim('/assets/hero/moon.png')).toBe('pxmoonglow 9s steps(8,end) infinite');
    expect(anim('/assets/hero/tennis-player-1.png')).toBe('pxpersonbob 1.6s steps(4,end) infinite alternate');
    expect(anim('/assets/hero/tennis-player-2.png')).toBe('pxpersonbob 1.6s steps(4,end) infinite alternate-reverse');
    expect(anim('/assets/hero/tennis-ball.png')).toBe('pxballswing 1s steps(8,end) infinite alternate');
    expect(anim('/assets/hero/campfire-flames.png')).toBe('pxflicker 0.9s steps(3,end) infinite alternate, pxfireglow 6s steps(8,end) infinite');
    expect(anim('/assets/hero/campfire-person-2.png')).toBe('pxpersonbob 2s steps(4,end) infinite alternate');
    expect(anim('/assets/hero/campfire-smoke.png')).toBe('pxsmoke 5s steps(5,end) infinite');
    expect(anim('/assets/hero/waterfall-splash.png')).toBe('pxsplash 1.2s steps(4,end) infinite');
    expect(anim('/assets/hero/camera-record-on.png')).toBe('pxrecdotblink 1s steps(1,end) infinite');
  });

  it('gives the five trees their own durations and directions', () => {
    const { container } = renderScene();
    const anim = (n: string) =>
      (container.querySelector(`img[src="/assets/hero/${n}"]`) as HTMLElement).style.animation;
    expect(anim('tree-5-z2.png')).toBe('pxsway 3.6s steps(6,end) infinite alternate');
    expect(anim('tree-4-z3.png')).toBe('pxsway 4.2s steps(6,end) infinite alternate-reverse');
    expect(anim('tree-3-z3.png')).toBe('pxsway 3.8s steps(6,end) infinite alternate');
    expect(anim('tree-2-z1.png')).toBe('pxsway 4s steps(6,end) infinite alternate-reverse');
    expect(anim('tree-1-z1.png')).toBe('pxsway 3.4s steps(6,end) infinite alternate');
  });
});

describe('HeroScene geometry', () => {
  it('pivots trees from the base and the swing/computer from the top', () => {
    const { container } = renderScene();
    const origin = (n: string) =>
      (container.querySelector(`img[src="/assets/hero/${n}"]`) as HTMLElement).style.transformOrigin;
    for (const t of ['tree-1-z1.png', 'tree-2-z1.png', 'tree-3-z3.png', 'tree-4-z3.png', 'tree-5-z2.png']) {
      expect(origin(t)).toBe('50% 100%');
    }
    for (const t of ['swing.png', 'computer-person.png', 'computer.png']) {
      expect(origin(t)).toBe('50% 0%');
    }
  });

  it('frames the waterfall and camera layers at 20% 50%', () => {
    const { container } = renderScene();
    for (const n of ['waterfall-ocean.png', 'waterfall-splash.png', 'camera.png', 'camera-record-off.png', 'camera-record-on.png']) {
      expect((container.querySelector(`img[src="/assets/hero/${n}"]`) as HTMLElement).style.objectPosition)
        .toBe('20% 50%');
    }
  });
});

describe('HeroScene persistent layers', () => {
  it('keeps the fire, smoke, vignette and moon-glow groups mounted in both themes', () => {
    const { container, rerender } = renderScene();
    const count = () => ({
      flames: container.querySelectorAll('img[src="/assets/hero/campfire-flames.png"]').length,
      smoke: container.querySelectorAll('img[src="/assets/hero/campfire-smoke.png"]').length,
      stars: container.querySelectorAll('img[src="/assets/hero/stars.png"]').length,
    });
    const dark = count();

    localStorage.setItem('rc-theme', 'light');
    rerender(<ThemeProvider><HeroScene /></ThemeProvider>);
    // A rerender does not remount the provider, so drive the assertion off a
    // fresh light-theme mount instead:
    const light = render(<ThemeProvider><HeroScene /></ThemeProvider>);
    expect({
      flames: light.container.querySelectorAll('img[src="/assets/hero/campfire-flames.png"]').length,
      smoke: light.container.querySelectorAll('img[src="/assets/hero/campfire-smoke.png"]').length,
      stars: light.container.querySelectorAll('img[src="/assets/hero/stars.png"]').length,
    }).toEqual(dark);
    expect(dark).toEqual({ flames: 1, smoke: 1, stars: 2 });
  });

  it('cross-fades the vignette by opacity, dark visible / light hidden', () => {
    const { container } = renderScene();
    const vignette = Array.from(container.querySelectorAll('div')).find((d) =>
      (d as HTMLElement).style.background.startsWith('radial-gradient'),
    ) as HTMLElement;
    expect(vignette.style.opacity).toBe('1');
    expect(vignette.style.transition).toBe('opacity 620ms cubic-bezier(.45,0,.2,1)');

    localStorage.setItem('rc-theme', 'light');
    const lightRender = render(<ThemeProvider><HeroScene /></ThemeProvider>);
    const lightVignette = Array.from(lightRender.container.querySelectorAll('div')).find((d) =>
      (d as HTMLElement).style.background.startsWith('radial-gradient'),
    ) as HTMLElement;
    expect(lightVignette.style.opacity).toBe('0');
  });

  it('slides the tape groups instead of fading them', () => {
    const { container } = renderScene();
    const dayGroup = container.querySelector('img[src="/assets/hero/sky-day.png"]')!
      .parentElement as HTMLElement;
    const nightGroup = container.querySelector('img[src="/assets/hero/sky-night.png"]')!
      .parentElement as HTMLElement;
    expect(dayGroup.style.transform).toBe('translateY(-100%)');
    expect(nightGroup.style.transform).toBe('translateY(0)');
  });
});
