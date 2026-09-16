import { act, render } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ThemeProvider } from '../hooks/useTheme';
import { BeachScene } from './BeachScene';

const renderScene = () => render(<ThemeProvider><BeachScene /></ThemeProvider>);
const srcs = (c: HTMLElement) =>
  Array.from(c.querySelectorAll('img')).map((i) => i.getAttribute('src'));

beforeEach(() => { localStorage.clear(); vi.useFakeTimers({ shouldAdvanceTime: true }); });
afterEach(() => vi.useRealTimers());

describe('BeachScene layer order', () => {
  it('paints the nine layers back to front', () => {
    const { container } = renderScene();
    expect(srcs(container)).toEqual([
      '/assets/contact/sky-day.png',
      '/assets/contact/sky-night.png',
      '/assets/contact/sun-day.png',
      '/assets/contact/sun-night.png',
      '/assets/contact/clouds-back.png',
      '/assets/contact/duck.png',
      '/assets/contact/ryan-wave-01.png',
      '/assets/contact/clouds-front.png',
      '/assets/contact/birds.png',
      '/assets/contact/waves-back.png',
      '/assets/contact/waves-front.png',
    ]);
  });
});

describe('BeachScene phase lock', () => {
  it('mounts both suns always, cross-faded by opacity', () => {
    const { container } = renderScene();
    const day = container.querySelector('img[src="/assets/contact/sun-day.png"]') as HTMLElement;
    const night = container.querySelector('img[src="/assets/contact/sun-night.png"]') as HTMLElement;
    expect(day.style.opacity).toBe('0');
    expect(night.style.opacity).toBe('1');
    expect(day.style.transition).toBe('opacity 1.2s ease');
    expect(night.style.transition).toBe('opacity 1.2s ease');
  });

  it('gives the suns and both cloud layers one shared animation and delay', () => {
    const { container } = renderScene();
    for (const n of ['sun-day.png', 'sun-night.png', 'clouds-back.png', 'clouds-front.png']) {
      const el = container.querySelector(`img[src="/assets/contact/${n}"]`) as HTMLElement;
      expect(el.style.animation, n).toBe('pxsunslide 34s linear infinite');
      expect(el.style.animationDelay, n).toBe('-17s');
    }
  });

  it('overscans the cloud layers so no edge can show', () => {
    const { container } = renderScene();
    for (const n of ['clouds-back.png', 'clouds-front.png']) {
      const el = container.querySelector(`img[src="/assets/contact/${n}"]`) as HTMLElement;
      expect(el.style.top).toBe('-50%');
      expect(el.style.left).toBe('-50%');
      expect(el.style.width).toBe('200%');
      expect(el.style.height).toBe('200%');
    }
  });

  it('mounts the same layer set in both themes', () => {
    const dark = renderScene();
    localStorage.setItem('rc-theme', 'light');
    const light = renderScene();
    expect(srcs(light.container)).toEqual(srcs(dark.container));
  });
});

describe('BeachScene waves and birds', () => {
  it('overscans both wave layers by 6% each side', () => {
    const { container } = renderScene();
    for (const n of ['waves-back.png', 'waves-front.png']) {
      const el = container.querySelector(`img[src="/assets/contact/${n}"]`) as HTMLElement;
      expect(el.style.left).toBe('-6%');
      expect(el.style.width).toBe('112%');
    }
  });

  it('runs the back wave in reverse', () => {
    const { container } = renderScene();
    const back = container.querySelector('img[src="/assets/contact/waves-back.png"]') as HTMLElement;
    const front = container.querySelector('img[src="/assets/contact/waves-front.png"]') as HTMLElement;
    expect(back.style.animation).toBe('pxwavesway 6s ease-in-out infinite reverse');
    expect(front.style.animation).toBe('pxwavesway 6s ease-in-out infinite');
  });

  it('sways the duck and Ryan with the waves', () => {
    const { container } = renderScene();
    const duck = container.querySelector('img[src="/assets/contact/duck.png"]') as HTMLElement;
    expect(duck.style.animation).toBe('pxwavesway 6s ease-in-out infinite');
  });

  it('flies the birds at 5s', () => {
    const { container } = renderScene();
    const birds = container.querySelector('img[src="/assets/contact/birds.png"]') as HTMLElement;
    expect(birds.style.animation).toBe('pxbirds 5s ease-in-out infinite');
  });
});

describe('BeachScene Ryan frames', () => {
  it('advances all 11 frames at 4fps and wraps', () => {
    const { container } = renderScene();
    const ryan = () =>
      (container.querySelectorAll('img')[6] as HTMLImageElement).getAttribute('src');
    expect(ryan()).toBe('/assets/contact/ryan-wave-01.png');
    act(() => { vi.advanceTimersByTime(250); });
    expect(ryan()).toBe('/assets/contact/ryan-wave-02.png');
    act(() => { vi.advanceTimersByTime(250 * 9); });
    expect(ryan()).toBe('/assets/contact/ryan-wave-11.png');
    act(() => { vi.advanceTimersByTime(250); });
    expect(ryan()).toBe('/assets/contact/ryan-wave-01.png');
  });
});
