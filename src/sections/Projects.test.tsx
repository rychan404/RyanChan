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

const cardTitles = () =>
  screen.getAllByRole('heading', { level: 3 }).map((h) => h.textContent);

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

  it('opens on Code, not All', () => {
    renderProjects();
    expect(screen.getByRole('button', { name: 'Code' })).toHaveClass('pixel-tab--active');
    expect(screen.getByRole('button', { name: 'All' })).not.toHaveClass('pixel-tab--active');
    expect(cardTitles()).toEqual(['Tilebreaker', 'Loopline', 'Nightshift', 'Pixelforge']);
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

  it('uses the auto-fill track on desktop', () => {
    const { container } = renderProjects();
    const grid = container.querySelector('#projects div[style*="display: grid"]') as HTMLElement;
    expect(grid.style.gridTemplateColumns).toBe('repeat(auto-fill,minmax(330px,1fr))');
    expect(grid.style.gap).toBe('32px');
  });

  it('renders no mobile dropdown', () => {
    renderProjects();
    expect(screen.queryByRole('button', { expanded: false })).toBeNull();
  });
});

describe('ProjectCard', () => {
  beforeEach(() => setViewport(false));

  it('shows the title, status badge, year, blurb and tags', () => {
    renderProjects();
    const card = screen.getByRole('heading', { name: 'Loopline' }).closest('.pixel-card') as HTMLElement;
    expect(within(card).getByText('In Progress')).toHaveClass('pixel-badge--warning');
    expect(within(card).getByText('JUN 2026')).toBeInTheDocument();
    expect(within(card).getByText(/A CLI task runner/)).toBeInTheDocument();
    expect(within(card).getByText('Docker')).toBeInTheDocument();
    expect(within(card).getByText('GitHub')).toBeInTheDocument();
  });

  it('uses the plain badge for a completed project', () => {
    renderProjects();
    const card = screen.getByRole('heading', { name: 'Tilebreaker' }).closest('.pixel-card') as HTMLElement;
    expect(within(card).getByText('Completed')).not.toHaveClass('pixel-badge--warning');
  });

  it('shows the slot hint when there is no image', () => {
    renderProjects();
    const card = screen.getByRole('heading', { name: 'Tilebreaker' }).closest('.pixel-card') as HTMLElement;
    expect(within(card).getByText('Drop a gameplay screenshot')).toBeInTheDocument();
  });

  it('gives the image region a 190px height and a 4px bottom border', () => {
    renderProjects();
    const card = screen.getByRole('heading', { name: 'Tilebreaker' }).closest('.pixel-card') as HTMLElement;
    const region = card.firstElementChild as HTMLElement;
    expect(region.style.height).toBe('190px');
    expect(region.style.borderBottom).toContain('var(--border-thick) solid');
  });

  it('links to the project page', () => {
    renderProjects();
    const card = screen.getByRole('heading', { name: 'Nightshift' }).closest('a');
    expect(card).toHaveAttribute('href', '/projects/nightshift');
  });
});

describe('Projects on mobile', () => {
  beforeEach(() => setViewport(true));

  it('replaces the tabs with a dropdown showing the current filter', () => {
    renderProjects();
    expect(screen.queryByRole('button', { name: 'All' })).toBeNull();
    const trigger = screen.getByRole('button', { expanded: false });
    expect(trigger).toHaveTextContent('Code');
  });

  it('opens, selects and closes', async () => {
    renderProjects();
    const trigger = screen.getByRole('button', { expanded: false });
    await userEvent.click(trigger);
    expect(trigger).toHaveAttribute('aria-expanded', 'true');

    await userEvent.click(screen.getByRole('button', { name: 'Misc' }));
    expect(cardTitles()).toEqual(['Piano Covers', '3D Origami Sculptures']);
    expect(screen.getByRole('button', { expanded: false })).toHaveTextContent('Misc');
  });

  it('uses a single-column grid', () => {
    const { container } = renderProjects();
    const grid = container.querySelector('#projects div[style*="display: grid"]') as HTMLElement;
    expect(grid.style.gridTemplateColumns).toBe('1fr');
  });
});
