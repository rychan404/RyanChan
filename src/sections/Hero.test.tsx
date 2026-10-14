import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ThemeProvider } from '../hooks/useTheme';
import { Hero } from './Hero';

function setViewport(isMobile: boolean) {
  vi.stubGlobal('matchMedia', (q: string) => ({
    matches: isMobile, media: q,
    addEventListener: vi.fn(), removeEventListener: vi.fn(),
    addListener: vi.fn(), removeListener: vi.fn(), dispatchEvent: vi.fn(), onchange: null,
  }));
}

const renderHero = (onNavigate = vi.fn()) => {
  const r = render(<ThemeProvider><Hero onNavigate={onNavigate} /></ThemeProvider>);
  return { ...r, onNavigate };
};

beforeEach(() => { localStorage.clear(); vi.unstubAllGlobals(); });

describe('Hero', () => {
  beforeEach(() => setViewport(false));

  it('is the hero section with id="home"', () => {
    const { container } = renderHero();
    const section = container.querySelector('#home') as HTMLElement;
    expect(section).toHaveClass('px-hero');
  });

  it('renders the logo as the h1, carrying the name, eyebrow and tagline in its alt', () => {
    renderHero();
    const h1 = screen.getByRole('heading', { level: 1 });
    const logo = h1.querySelector('img') as HTMLImageElement;
    expect(logo).toHaveAttribute('src', '/assets/brand/ryan-chan-hero-logo.png');
    expect(logo).toHaveClass('rc-hero-logo');
    expect(h1).toHaveAccessibleName(/Ryan Chan.*Software Engineer and Video Editor/);
  });

  it('keeps the media-query hook class', () => {
    const { container } = renderHero();
    const content = container.querySelector('.px-hero-content') as HTMLElement;
    expect(content.style.maxWidth).toBe('1180px');
  });

  it('renders the CTA with a bobbing arrow and a blinking block cursor', () => {
    const { container } = renderHero();
    const cta = screen.getByRole('link', { name: /CLICK TO CONTINUE/ });
    expect(cta).toHaveAttribute('href', '#about');
    expect(cta).toHaveClass('rc-hero-cta');
    const spans = Array.from(cta.querySelectorAll('span')) as HTMLElement[];
    expect(spans[0].style.animation).toBe('pxbob 1.1s steps(2,end) infinite alternate');
    expect(spans[2].style.animation).toBe('pxblink 1s steps(1,end) infinite');
    expect(spans[2].style.width).toBe('12px');
    expect(spans[2].style.height).toBe('20px');
    expect(container.querySelector('#home')).toBeTruthy();
  });

  it('fires onNavigate when the CTA is clicked', async () => {
    const { onNavigate } = renderHero();
    await userEvent.click(screen.getByRole('link', { name: /CLICK TO CONTINUE/ }));
    expect(onNavigate).toHaveBeenCalledOnce();
  });

  it('mounts the scene', () => {
    const { container } = renderHero();
    expect(container.querySelectorAll('img[src^="/assets/hero/"]').length).toBe(31);
  });
});
