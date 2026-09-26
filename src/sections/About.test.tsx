import { readFileSync } from 'node:fs';
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
const bubble = () => document.querySelector('.rc-bubble-text') as HTMLElement;
const ask = (label: string) => userEvent.click(screen.getByRole('button', { name: label }));

describe('About layout', () => {
  it('is a surface-coloured section with id="about" and order 1', () => {
    const { container } = renderAbout();
    const section = container.querySelector('#about') as HTMLElement;
    expect(section.style.background).toBe('var(--color-surface)');
    expect(section.style.order).toBe('1');
    expect(section.classList.contains('rc-section')).toBe(true);
  });

  it('inks its dither fade from the per-theme token', () => {
    const { container } = renderAbout();
    expect((container.querySelector('.dither-fade') as HTMLElement).style.getPropertyValue('--dither-ink'))
      .toBe('var(--dither-ink-about)');
    // #0d2323 on dark, #194D46 (--pixel-teal-1) on light
    const css = readFileSync('src/styles/tokens/colors.css', 'utf8');
    expect(css).toContain('--dither-ink-about:#0d2323;');
    expect(css).toContain('.theme-light{--dither-ink-about:var(--pixel-teal-1)}');
    expect(css).toContain('--pixel-teal-1:#194d46;');
  });

  it('renders the heading and a character sheet with the name and three stats', () => {
    renderAbout();
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('About');
    expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent('Ryan Chan');
    const stats = Array.from(document.querySelectorAll('.rc-about-stat')).map((s) => s.textContent);
    expect(stats).toEqual(['Projects shipped6+', 'Social media views5K+', 'Lines of code50K+']);
  });

  it('offers four topics, with "Who are you?" picked first', () => {
    renderAbout();
    const menu = screen.getByRole('group', { name: 'Ask Ryan' });
    const opts = Array.from(menu.querySelectorAll('button'));
    expect(opts.map((b) => b.textContent)).toEqual(['Who are you?', 'Fun facts', 'Quest log', 'Off the clock']);
    expect(opts.map((b) => b.getAttribute('aria-pressed'))).toEqual(['true', 'false', 'false', 'false']);
  });
});

describe('About speech bubble', () => {
  it('shows the whole bio at once, link included', () => {
    renderAbout();
    expect(bubble()).toHaveTextContent('aspiring software engineer and video editor in the DMV');
    expect(bubble()).toHaveTextContent('problem solver at heart');
    expect(bubble()).toHaveTextContent('Computer science sophomore at the University of Maryland');
    expect(screen.getByRole('link', { name: 'my projects' })).toHaveAttribute('href', '#projects');
  });

  it('switches topic from the menu and shows all its lines', async () => {
    renderAbout();
    await ask('Quest log');
    expect(screen.getByRole('button', { name: 'Quest log' })).toHaveAttribute('aria-pressed', 'true');
    expect(bubble()).not.toHaveTextContent('problem solver at heart');
    for (const line of [
      'Software Engineer Intern @ Capital Technology Group',
      'Videographer for Black Rocket Productions',
      'Hack4Impact @ UMD',
      'On the internship grind...',
    ]) expect(bubble()).toHaveTextContent(line);
    const icons = bubble().querySelectorAll('.pixel-icon') as NodeListOf<HTMLElement>;
    const last = icons[icons.length - 1];
    expect(last.style.maskImage).toContain('clock-solid');
    expect(last.style.color).toBe('var(--color-warning)');
  });

  it('has no paging control', () => {
    renderAbout();
    expect(screen.queryByRole('button', { name: 'Next line' })).toBeNull();
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
  it('shows every fact at once, each with its term', async () => {
    renderAbout();
    await ask('Fun facts');
    for (const term of ['barns', 'cook eggs', 'sing']) expect(screen.getByText(term)).toBeInTheDocument();
  });

  it('opens one popover at a time', async () => {
    renderAbout();
    await ask('Fun facts');
    await userEvent.click(screen.getByText('barns'));
    expect(screen.getByText("It's an ancient relic!")).toBeInTheDocument();
    await userEvent.click(screen.getByText('cook eggs'));
    expect(screen.queryByText("It's an ancient relic!")).toBeNull();
    expect(screen.getByText('I love eggs in 4 ways')).toBeInTheDocument();
  });

  it('closes the popover when the topic changes', async () => {
    renderAbout();
    await ask('Fun facts');
    await userEvent.click(screen.getByText('barns'));
    await ask('Quest log');
    expect(screen.queryByText("It's an ancient relic!")).toBeNull();
  });

  it('closes on an outside mousedown', async () => {
    renderAbout();
    await ask('Fun facts');
    await userEvent.click(screen.getByText('barns'));
    await userEvent.click(document.body);
    expect(screen.queryByText("It's an ancient relic!")).toBeNull();
  });

  it('closes on Escape', async () => {
    renderAbout();
    await ask('Fun facts');
    await userEvent.click(screen.getByText('barns'));
    await userEvent.keyboard('{Escape}');
    expect(screen.queryByText("It's an ancient relic!")).toBeNull();
  });
});
