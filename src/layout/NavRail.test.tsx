import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ThemeProvider } from '../hooks/useTheme';
import { NavRail } from './NavRail';

function setViewport(isMobile: boolean) {
  vi.stubGlobal('matchMedia', (query: string) => ({
    matches: isMobile,
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(),
    onchange: null,
  }));
}

const renderNav = (props: Parameters<typeof NavRail>[0]) =>
  render(<ThemeProvider><NavRail {...props} /></ThemeProvider>);

beforeEach(() => {
  localStorage.clear();
  vi.unstubAllGlobals();
});

describe('NavRail on desktop', () => {
  beforeEach(() => setViewport(false));

  it('renders the five links in rendered order', () => {
    renderNav({ route: 'home', active: 0 });
    const nav = screen.getByRole('navigation');
    expect(within(nav).getAllByRole('link').map((a) => a.textContent)).toEqual([
      '', 'HOME', 'ABOUT', 'PROJECTS', 'SKILLS', 'CONTACT',
    ]);
  });

  it('links to in-page anchors on the home route', () => {
    renderNav({ route: 'home', active: 0 });
    expect(screen.getByRole('link', { name: 'PROJECTS' })).toHaveAttribute('href', '#projects');
  });

  it('links back to the home route from the detail route', () => {
    renderNav({ route: 'detail', active: 2 });
    expect(screen.getByRole('link', { name: 'PROJECTS' })).toHaveAttribute('href', '/#projects');
  });

  it('marks the active link with aria-current', () => {
    renderNav({ route: 'home', active: 3 });
    expect(screen.getByRole('link', { name: 'SKILLS' })).toHaveAttribute('aria-current', 'true');
    expect(screen.getByRole('link', { name: 'HOME' })).not.toHaveAttribute('aria-current');
  });

  it('translates the cursor to active * 64px with a stepped transition', () => {
    const { container } = renderNav({ route: 'home', active: 3 });
    const cursor = container.querySelector('i[aria-hidden="true"]') as HTMLElement;
    expect(cursor.style.transform).toBe('translateY(192px)');
    expect(cursor.style.transition).toBe('transform 180ms steps(3,end)');
    expect(cursor.style.height).toBe('64px');
    expect(cursor.style.width).toBe('6px');
  });

  it('pins the cursor at top:128px with no transition on the detail route', () => {
    const { container } = renderNav({ route: 'detail', active: 2 });
    const cursor = container.querySelector('i[aria-hidden="true"]') as HTMLElement;
    expect(cursor.style.top).toBe('128px');
    expect(cursor.style.transform).toBe('');
    expect(cursor.style.transition).toBe('');
  });

  it('calls onNavigate with the section index', async () => {
    const onNavigate = vi.fn();
    renderNav({ route: 'home', active: 0, onNavigate });
    await userEvent.click(screen.getByRole('link', { name: 'CONTACT' }));
    expect(onNavigate).toHaveBeenCalledWith(4);
  });

  it('shows the theme label and toggles', async () => {
    renderNav({ route: 'home', active: 0 });
    const toggle = screen.getByTitle('Toggle light / dark');
    expect(toggle).toHaveTextContent('DARK');
    await userEvent.click(toggle);
    expect(toggle).toHaveTextContent('LIGHT');
  });

  it('renders no hamburger', () => {
    renderNav({ route: 'home', active: 0 });
    expect(screen.queryByLabelText('Toggle menu')).toBeNull();
  });
});

describe('NavRail on mobile', () => {
  beforeEach(() => setViewport(true));

  it('renders the bar with a hamburger and no rail links', () => {
    renderNav({ route: 'home', active: 0 });
    expect(screen.getByLabelText('Toggle menu')).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'PROJECTS' })).toBeNull();
  });

  it('opens the overlay and reports it via aria-expanded', async () => {
    renderNav({ route: 'home', active: 0 });
    const burger = screen.getByLabelText('Toggle menu');
    expect(burger).toHaveAttribute('aria-expanded', 'false');

    await userEvent.click(burger);
    expect(burger).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByRole('link', { name: 'PROJECTS' })).toBeInTheDocument();
  });

  it('swaps the hamburger glyph for a close glyph when open', async () => {
    const { container } = renderNav({ route: 'home', active: 0 });
    const glyph = () =>
      (container.querySelector('[aria-label="Toggle menu"] .pixel-icon') as HTMLElement).style.maskImage;
    expect(glyph()).toBe('url(/icons/ui/bars-solid.svg)');
    await userEvent.click(screen.getByLabelText('Toggle menu'));
    expect(glyph()).toBe('url(/icons/ui/times-solid.svg)');
  });

  it('marks the active overlay row with a 4px primary left border', async () => {
    renderNav({ route: 'home', active: 2 });
    await userEvent.click(screen.getByLabelText('Toggle menu'));
    expect(screen.getByRole('link', { name: 'PROJECTS' }).style.borderLeft)
      .toBe('4px solid var(--color-primary)');
    expect(screen.getByRole('link', { name: 'HOME' }).style.borderLeft)
      .toBe('4px solid transparent');
  });

  it('closes the overlay when a row is clicked', async () => {
    renderNav({ route: 'home', active: 0, onNavigate: vi.fn() });
    await userEvent.click(screen.getByLabelText('Toggle menu'));
    await userEvent.click(screen.getByRole('link', { name: 'ABOUT' }));
    expect(screen.queryByRole('link', { name: 'ABOUT' })).toBeNull();
  });
});
