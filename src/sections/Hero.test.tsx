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

  it('is a full-viewport section with id="home"', () => {
    const { container } = renderHero();
    const section = container.querySelector('#home') as HTMLElement;
    expect(section.style.minHeight).toBe('100vh');
    expect(section.style.padding).toBe('96px 56px 120px');
  });

  it('renders the name, tagline and eyebrow', () => {
    renderHero();
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('RYAN CHAN');
    expect(screen.getByText('Building technology around what people actually want.')).toBeInTheDocument();
    expect(screen.getByText('Software Engineer and Video Editor')).toBeInTheDocument();
  });

  it('sizes and shadows the name exactly as the prototype', () => {
    renderHero();
    const h1 = screen.getByRole('heading', { level: 1 });
    expect(h1.style.fontSize).toBe('var(--fs-hero-name)');
    expect(h1.style.lineHeight).toBe('0.9');
    expect(h1.style.wordSpacing).toBe('-0.25em');
    expect(h1.style.color).toBe('var(--color-heading)');
    expect(h1.style.textShadow.split(',')).toHaveLength(9);
  });

  it('shifts the content up and keeps the media-query hook class', () => {
    const { container } = renderHero();
    const content = container.querySelector('.px-hero-content') as HTMLElement;
    expect(content.style.transform).toBe('translateY(-110px)');
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

describe('Hero on mobile', () => {
  beforeEach(() => setViewport(true));

  it('breaks the eyebrow onto two lines', () => {
    const { container } = renderHero();
    const eyebrow = container.querySelector('.px-hero-content p') as HTMLElement;
    expect(eyebrow.querySelector('br')).not.toBeNull();
    expect(eyebrow.textContent).toBe('Software Engineerand Video Editor');
    expect(eyebrow.style.lineHeight).toBe('1.1');
    expect(eyebrow.style.margin).toBe('0px 0px 8px 0px');
  });

  it('uses the smaller shift, padding and shadow', () => {
    const { container } = renderHero();
    expect((container.querySelector('.px-hero-content') as HTMLElement).style.transform)
      .toBe('translateY(-40px)');
    expect((container.querySelector('#home') as HTMLElement).style.padding)
      .toBe('56px 20px 72px');
    expect(screen.getByRole('heading', { level: 1 }).style.textShadow)
      .toContain('-3px -3px 0 var(--color-heading-shadow)');
  });
});
