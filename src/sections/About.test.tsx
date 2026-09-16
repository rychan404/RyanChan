import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ThemeProvider } from '../hooks/useTheme';
import { About } from './About';

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
});

const renderAbout = () => render(<ThemeProvider><About /></ThemeProvider>);

describe('About layout', () => {
  it('is a surface-coloured section with id="about" and order 1', () => {
    const { container } = renderAbout();
    const section = container.querySelector('#about') as HTMLElement;
    expect(section.style.background).toBe('var(--color-surface)');
    expect(section.style.order).toBe('1');
    expect(section.style.padding).toBe('0px 0px 112px 0px');
  });

  it('inks its dither fade per theme', () => {
    const { container } = renderAbout();
    expect((container.querySelector('.dither-fade') as HTMLElement).style.getPropertyValue('--dither-ink'))
      .toBe('#0d2323');

    localStorage.setItem('rc-theme', 'light');
    const light = renderAbout();
    expect((light.container.querySelector('.dither-fade') as HTMLElement).style.getPropertyValue('--dither-ink'))
      .toBe('#194D46');
  });

  it('renders the heading and the three stats', () => {
    renderAbout();
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('About');
    expect(screen.getByText('6+')).toBeInTheDocument();
    expect(screen.getByText('5K+')).toBeInTheDocument();
    expect(screen.getByText('50K+')).toBeInTheDocument();
    expect(screen.getByText('Views on social media content')).toBeInTheDocument();
    expect(screen.getByText('LINES of Code written')).toBeInTheDocument();
  });

  it('renders the three bio paragraphs and the projects link', () => {
    renderAbout();
    expect(screen.getByRole('link', { name: 'my projects' })).toHaveAttribute('href', '#projects');
    expect(document.body.textContent).toContain('Computer science sophomore at the University of Maryland');
    expect(document.body.textContent).toContain('chasing down shots on the tennis court');
  });

  it('renders the quest log with two done entries and one in progress', () => {
    const { container } = renderAbout();
    expect(screen.getByText('QUEST LOG')).toBeInTheDocument();
    expect(screen.getByText('Software Engineer Intern @ Capital Technology Group')).toBeInTheDocument();
    expect(screen.getByText('Videographer for UMD JASA & Black Rocket Productions')).toBeInTheDocument();
    expect(screen.getByText('On the internship grind...')).toBeInTheDocument();
    const icons = Array.from(container.querySelectorAll('.pixel-icon')) as HTMLElement[];
    expect(icons.some((i) => i.style.maskImage.includes('clock-solid') && i.style.color === 'var(--color-warning)')).toBe(true);
  });
});

describe('About sprite panel', () => {
  it('labels the sprite layer for assistive tech', () => {
    renderAbout();
    expect(screen.getByRole('img', { name: 'Ryan Chan, animated' })).toBeInTheDocument();
  });

  it('starts on the headshot with the sprite hidden', () => {
    const { container } = renderAbout();
    const sprite = screen.getByRole('img', { name: 'Ryan Chan, animated' });
    const headshot = container.querySelector('img[alt="Ryan Chan"]') as HTMLElement;
    expect(sprite.style.opacity).toBe('0');
    expect(headshot.style.opacity).toBe('1');
    expect(headshot.style.transition).toBe('opacity 140ms steps(3,end)');
  });

  it('swaps to the sprite when play is pressed', async () => {
    renderAbout();
    await userEvent.click(screen.getByTitle('Play the animated sprite'));
    expect(screen.getByRole('img', { name: 'Ryan Chan, animated' }).style.opacity).toBe('1');
  });

  it('swaps the button glyph between play and pause', async () => {
    const { container } = renderAbout();
    const glyph = () =>
      (container.querySelector('[title="Play the animated sprite"] .pixel-icon') as HTMLElement).style.maskImage;
    expect(glyph()).toBe('url(/icons/ui/play-solid.svg)');
    await userEvent.click(screen.getByTitle('Play the animated sprite'));
    expect(glyph()).toBe('url(/icons/ui/pause-solid.svg)');
  });
});

describe('About fun facts', () => {
  it('renders all three terms', () => {
    renderAbout();
    expect(screen.getByText('FUN FACTS')).toBeInTheDocument();
    expect(screen.getByText('barns')).toBeInTheDocument();
    expect(screen.getByText('cook eggs')).toBeInTheDocument();
    expect(screen.getByText('sing')).toBeInTheDocument();
  });

  it('opens one popover at a time', async () => {
    renderAbout();
    await userEvent.click(screen.getByText('barns'));
    expect(screen.getByText("It's an ancient relic!")).toBeInTheDocument();
    await userEvent.click(screen.getByText('cook eggs'));
    expect(screen.queryByText("It's an ancient relic!")).toBeNull();
    expect(screen.getByText('I love eggs in 4 ways')).toBeInTheDocument();
  });

  it('closes on an outside mousedown', async () => {
    renderAbout();
    await userEvent.click(screen.getByText('barns'));
    await userEvent.click(document.body);
    expect(screen.queryByText("It's an ancient relic!")).toBeNull();
  });

  it('closes on Escape', async () => {
    renderAbout();
    await userEvent.click(screen.getByText('barns'));
    await userEvent.keyboard('{Escape}');
    expect(screen.queryByText("It's an ancient relic!")).toBeNull();
  });
});
