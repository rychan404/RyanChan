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

describe('Home dither dissolve', () => {
  it('arms the blocks below the trigger line, dissolves them in as they rise past it and out as they sink below it', () => {
    type Entry = { target: Element; isIntersecting: boolean; boundingClientRect?: { top: number }; rootBounds?: { top: number; bottom: number } };
    let fire: (e: Entry[]) => void = () => {};
    const view = { top: 0, bottom: 700 };
    vi.stubGlobal('IntersectionObserver', class {
      constructor(cb: typeof fire) { fire = cb; }
      observe = vi.fn(); unobserve = vi.fn(); disconnect = vi.fn(); takeRecords = vi.fn();
      root = null; rootMargin = ''; thresholds = [];
    });
    const rect = vi.spyOn(Element.prototype, 'getBoundingClientRect').mockImplementation(function (this: Element) {
      return { top: this.closest('#projects') ? 100 : 2000 } as DOMRect;
    });
    const { container } = renderHome();
    const title = (id: string) => container.querySelector(`#${id} .rc-section-title`) as HTMLElement;
    const lede = container.querySelector('#skills .rc-section-lede') as HTMLElement;
    expect(container.querySelector('#home [data-dissolve]')).toBeNull();
    expect(title('projects').dataset.dissolve).toBeUndefined();
    expect(title('skills').dataset.dissolve).toBe('armed');
    fire([{ target: title('skills'), isIntersecting: true }, { target: lede, isIntersecting: true }]);
    expect(title('skills').dataset.dissolve).toBe('in');
    expect(lede.style.getPropertyValue('--i')).toBe('1');
    // Off the top: stays in. Back below the line: out. Up again: in.
    fire([{ target: lede, isIntersecting: false, boundingClientRect: { top: -300 }, rootBounds: view }]);
    expect(lede.dataset.dissolve).toBe('in');
    fire([{ target: lede, isIntersecting: false, boundingClientRect: { top: 750 }, rootBounds: view }]);
    expect(lede.dataset.dissolve).toBe('out');
    fire([{ target: lede, isIntersecting: true }]);
    expect(lede.dataset.dissolve).toBe('in');
    // Shown on load: a sink below the line takes it out too.
    fire([{ target: title('projects'), isIntersecting: false, boundingClientRect: { top: 750 }, rootBounds: view }]);
    expect(title('projects').dataset.dissolve).toBe('out');
    rect.mockRestore();
  });
});

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
    expect(main).toHaveClass('rc-main');
  });

  it('sets the section padding variable and the page chrome on the root', () => {
    const { container } = renderHome();
    const root = container.firstElementChild as HTMLElement;
    expect(root.style.getPropertyValue('--section-pad-x')).toBe('max(clamp(20px,10vw,240px),calc((100% - var(--container-max)) / 2))');
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
