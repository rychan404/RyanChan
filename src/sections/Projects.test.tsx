import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { TEST_PROJECTS } from '../test-projects';
import { ThemeProvider } from '../hooks/useTheme';
import { Projects } from './Projects';

function setViewport(isMobile: boolean) {
  vi.stubGlobal('matchMedia', (q: string) => ({
    matches: isMobile, media: q,
    addEventListener: vi.fn(), removeEventListener: vi.fn(),
    addListener: vi.fn(), removeListener: vi.fn(), dispatchEvent: vi.fn(), onchange: null,
  }));
}

const renderProjects = () =>
  render(<ThemeProvider><Projects projects={TEST_PROJECTS} /></ThemeProvider>);

/** The roster's tile names, in order. */
const cardTitles = () =>
  Array.from(screen.getByRole('group', { name: 'Project list' }).querySelectorAll('.rc-roster-name'))
    .map((n) => n.textContent);
const pick = (title: string) => userEvent.click(screen.getByRole('button', { name: title }));
const shownCard = () => screen.getByRole('heading', { level: 3 }).textContent;

beforeEach(() => { localStorage.clear(); vi.unstubAllGlobals(); });

describe('Projects on desktop', () => {
  beforeEach(() => setViewport(false));

  it('is a bg-coloured section with id="projects" and order 2', () => {
    const { container } = renderProjects();
    const section = container.querySelector('#projects') as HTMLElement;
    expect(section.style.order).toBe('2');
    expect(section.style.background).toBe('var(--color-bg)');
  });

  it('renders the heading and subtitle', () => {
    renderProjects();
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Projects');
    expect(screen.getByText(/Things I love to tinker with/)).toBeInTheDocument();
  });

  it('opens on All, with the first nine projects in the roster', () => {
    renderProjects();
    expect(screen.getByRole('button', { name: 'All' })).toHaveClass('pixel-tab--active');
    expect(screen.getByRole('button', { name: 'Code' })).not.toHaveClass('pixel-tab--active');
    expect(cardTitles()).toEqual(TEST_PROJECTS.slice(0, 9).map((p) => p.title));
  });

  it('pages through the roster nine at a time, and back to page one on a new filter', async () => {
    renderProjects();
    const pages = Math.ceil(TEST_PROJECTS.length / 9);
    const prev = screen.getByRole('button', { name: 'Previous page' });
    const next = screen.getByRole('button', { name: 'Next page' });
    expect(prev).toBeDisabled();
    expect(screen.getByText(`1 / ${pages}`)).toBeInTheDocument();
    await userEvent.click(next);
    expect(cardTitles()).toEqual(TEST_PROJECTS.slice(9, 18).map((p) => p.title));
    expect(prev).toBeEnabled();
    for (let i = 2; i < pages; i++) await userEvent.click(next);
    expect(next).toBeDisabled();
    await userEvent.click(screen.getByRole('button', { name: 'Code' }));
    await userEvent.click(screen.getByRole('button', { name: 'All' }));
    expect(screen.getByText(`1 / ${pages}`)).toBeInTheDocument();
  });

  it('switches the visible set when a tab is clicked', async () => {
    renderProjects();
    await userEvent.click(screen.getByRole('button', { name: 'Video' }));
    expect(cardTitles()).toEqual(['Dust & Neon', 'Devlog Series', 'Terra Nova Trailer']);
    await userEvent.click(screen.getByRole('button', { name: 'Misc' }));
    expect(cardTitles()).toEqual(['Piano Covers', '3D Origami Sculptures']);
    await userEvent.click(screen.getByRole('button', { name: 'All' }));
    expect(cardTitles()).toHaveLength(9);
  });

  it('shows the first tile card, and swaps it when another tile is pressed', async () => {
    renderProjects();
    expect(screen.getByRole('button', { name: 'UMD Coffee Website' })).toHaveAttribute('aria-pressed', 'true');
    expect(shownCard()).toBe('UMD Coffee Website');
    await pick('Nightshift');
    expect(screen.getByRole('button', { name: 'Nightshift' })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('button', { name: 'UMD Coffee Website' })).toHaveAttribute('aria-pressed', 'false');
    expect(shownCard()).toBe('Nightshift');
  });

  it('keeps the pick across filters that include it, and falls back when one hides it', async () => {
    renderProjects();
    await pick('Nightshift');
    await userEvent.click(screen.getByRole('button', { name: 'All' }));
    expect(shownCard()).toBe('Nightshift');
    await userEvent.click(screen.getByRole('button', { name: 'Video' }));
    expect(shownCard()).toBe('Dust & Neon');
  });

  it('shows a project image on its tile, and the kind icon when there is none', async () => {
    render(<ThemeProvider><Projects projects={[
      { ...TEST_PROJECTS[0], image: '/shot.png' },
      { ...TEST_PROJECTS[1], image: undefined },
    ]} /></ThemeProvider>);
    const [withImage, without] = screen.getByRole('group', { name: 'Project list' }).querySelectorAll('button');
    expect(withImage.querySelector('img')).toHaveAttribute('src', '/shot.png');
    expect(without.querySelector('img')).toBeNull();
    expect(without.querySelector('.pixel-icon')).not.toBeNull();
    for (const tile of [withImage, without]) {
      const fade = tile.querySelector('.rc-roster-portrait > .dither-fade') as HTMLElement;
      expect(fade.style.getPropertyValue('--dither-ink')).toBe('var(--tile-bar)');
      expect(fade.style.height).toBe('32px');
    }
  });

  it('tints each tile by kind', async () => {
    renderProjects();
    await userEvent.click(screen.getByRole('button', { name: 'All' }));
    expect(screen.getByRole('button', { name: 'Loopline' })).toHaveClass('rc-roster-tile--code');
    expect(screen.getByRole('button', { name: 'Devlog Series' })).toHaveClass('rc-roster-tile--video');
    expect(screen.getByRole('button', { name: 'Piano Covers' })).toHaveClass('rc-roster-tile--misc');
  });

  it('renders no mobile dropdown', () => {
    renderProjects();
    expect(screen.queryByRole('button', { expanded: false })).toBeNull();
  });
});

describe('ProjectCard', () => {
  beforeEach(() => setViewport(false));

  it('shows the title, year, blurb and tags as skill slots, with no status badge', async () => {
    renderProjects();
    await pick('Loopline');
    const card = screen.getByRole('heading', { name: 'Loopline' }).closest('.pixel-card') as HTMLElement;
    expect(within(card).queryByText('In Progress')).toBeNull();
    expect(within(card).getByText('JUN 2026')).toBeInTheDocument();
    expect(within(card).getByText(/A CLI task runner/)).toBeInTheDocument();
    expect([...card.querySelectorAll('.rc-tag')].map((s) => s.textContent)).toEqual(['Docker']);
    expect(card.querySelectorAll('.rc-tag > .rc-inv-icon')).toHaveLength(1);
    expect(card.querySelector('.pixel-tag')).toBeNull();
  });

  it('draws no slots for tags without a logo', async () => {
    renderProjects();
    await pick('Piano Covers');
    const card = screen.getByRole('heading', { name: 'Piano Covers' }).closest('.pixel-card') as HTMLElement;
    expect(card.querySelector('.rc-tag-slots')).toBeNull();
  });

  it('gives the image region its height class and dithers it into the card, with no border', () => {
    renderProjects();
    const card = screen.getByRole('heading', { name: 'UMD Coffee Website' }).closest('.pixel-card') as HTMLElement;
    const region = card.firstElementChild as HTMLElement;
    expect(region).toHaveClass('rc-card-media');
    expect(region.style.borderBottom).toBe('');
    const fade = region.querySelector('.dither-fade') as HTMLElement;
    expect(fade).toHaveClass('dither-fade--up', 'rc-media-fade');
    expect(fade.style.getPropertyValue('--dither-ink')).toBe('var(--color-surface)');
    expect(fade.style.height).toBe('64px');
  });

  it('links to the project page', async () => {
    renderProjects();
    await pick('Nightshift');
    const card = screen.getByRole('heading', { name: 'Nightshift' }).closest('a');
    expect(card).toHaveAttribute('href', '/projects/nightshift');
  });
});

describe('Projects on mobile', () => {
  beforeEach(() => setViewport(true));

  it('replaces the tabs with a dropdown showing the current filter', () => {
    renderProjects();
    expect(screen.queryByRole('button', { name: 'Code' })).toBeNull();
    const trigger = screen.getByRole('button', { expanded: false });
    expect(trigger).toHaveTextContent('All');
  });

  it('opens, selects and closes', async () => {
    renderProjects();
    const trigger = screen.getByRole('button', { expanded: false });
    await userEvent.click(trigger);
    expect(trigger).toHaveAttribute('aria-expanded', 'true');

    await userEvent.click(screen.getByRole('button', { name: 'Code' }));
    expect(cardTitles()).toEqual(TEST_PROJECTS.filter((p) => p.kind === 'code').map((p) => p.title));
    expect(screen.getByRole('button', { expanded: false })).toHaveTextContent('Code');
  });
});
