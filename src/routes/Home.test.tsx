import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { TEST_PROJECTS } from '../test-projects';
import { ThemeProvider } from '../hooks/useTheme';
import { Home } from './Home';

beforeEach(() => {
  localStorage.clear();
  vi.stubGlobal('matchMedia', (q: string) => ({
    matches: false, media: q,
    addEventListener: vi.fn(), removeEventListener: vi.fn(),
    addListener: vi.fn(), removeListener: vi.fn(), dispatchEvent: vi.fn(), onchange: null,
  }));
  vi.stubGlobal('IntersectionObserver', class {
    observe = vi.fn(); disconnect = vi.fn(); unobserve = vi.fn(); takeRecords = vi.fn();
    root = null; rootMargin = ''; thresholds = [];
  });
  vi.stubGlobal('ResizeObserver', class {
    observe = vi.fn(); disconnect = vi.fn(); unobserve = vi.fn();
  });
  vi.stubGlobal('requestAnimationFrame', (cb: FrameRequestCallback) => { cb(0); return 1; });
  window.scrollTo = vi.fn();
});

const renderHome = () =>
  render(<ThemeProvider><Home projects={TEST_PROJECTS} /></ThemeProvider>);

describe('Home', () => {
  it('keeps the prototype DOM order', () => {
    const { container } = renderHome();
    const ids = Array.from(container.querySelectorAll('main > section')).map((s) => s.id);
    expect(ids).toEqual(['home', 'projects', 'about', 'skills', 'contact']);
  });

  it('reorders them visually to Home, About, Projects, Skills, Contact', () => {
    const { container } = renderHome();
    const order = (id: string) =>
      (container.querySelector(`#${id}`) as HTMLElement).style.order || '0';
    expect(order('home')).toBe('0');
    expect(order('about')).toBe('1');
    expect(order('projects')).toBe('2');
    expect(order('skills')).toBe('3');
    expect(order('contact')).toBe('4');
  });

  it('makes main a flex column so those order values apply', () => {
    const { container } = renderHome();
    const main = container.querySelector('main') as HTMLElement;
    expect(main.style.display).toBe('flex');
    expect(main.style.flexDirection).toBe('column');
    expect(main.style.marginLeft).toBe('88px');
  });

  it('sets the section padding variable and the page chrome on the root', () => {
    const { container } = renderHome();
    const root = container.firstElementChild as HTMLElement;
    expect(root.style.getPropertyValue('--section-pad-x')).toBe('clamp(20px,6vw,160px)');
    expect(root.style.background).toBe('var(--color-bg)');
    expect(root.style.overflowX).toBe('hidden');
    expect(root.style.minHeight).toBe('100vh');
  });

  it('applies the theme class to the root', () => {
    const { container } = renderHome();
    expect((container.firstElementChild as HTMLElement).className).toBe('');
    localStorage.setItem('rc-theme', 'light');
    const light = renderHome();
    expect((light.container.firstElementChild as HTMLElement).className).toBe('theme-light');
  });

  it('renders the nav on the home route with in-page hrefs', () => {
    renderHome();
    expect(screen.getByRole('link', { name: 'SKILLS' })).toHaveAttribute('href', '#skills');
  });

  it('renders all five sections and the footer exactly once', () => {
    const { container } = renderHome();
    expect(container.querySelectorAll('main > section')).toHaveLength(5);
    expect(screen.getAllByText('© 2026 RYAN CHAN')).toHaveLength(1);
  });
});
