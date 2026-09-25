import { fireEvent, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ThemeProvider } from '../hooks/useTheme';
import { TEST_PROJECTS } from '../test-projects';
import { Skills } from './Skills';

beforeEach(() => {
  localStorage.clear();
  vi.stubGlobal('matchMedia', (q: string) => ({
    matches: false, media: q,
    addEventListener: vi.fn(), removeEventListener: vi.fn(),
    addListener: vi.fn(), removeListener: vi.fn(), dispatchEvent: vi.fn(), onchange: null,
  }));
});

const renderSkills = () => render(<ThemeProvider><Skills projects={TEST_PROJECTS} /></ThemeProvider>);
const slots = () => within(screen.getByRole('group', { name: 'Skills' })).getAllByRole('button');
const detail = () => document.querySelector('.rc-inv-detail') as HTMLElement;

describe('Skills', () => {
  it('is a surface-coloured section with id="skills" and order 3', () => {
    const { container } = renderSkills();
    const section = container.querySelector('#skills') as HTMLElement;
    expect(section.style.background).toBe('var(--color-surface)');
    expect(section.style.order).toBe('3');
  });

  it('renders the heading and subtitle', () => {
    renderSkills();
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Skills');
    expect(screen.getByText('Tech I use on a daily basis')).toBeInTheDocument();
  });

  it('labels the groups above their rows', () => {
    const { container } = renderSkills();
    const labels = Array.from(container.querySelectorAll('.rc-inv-group > .rc-inv-label')).map((l) => l.textContent);
    expect(labels).toEqual(['CODE', 'BUILD', 'DEPLOY', 'POST']);
  });

  it('gives every skill a slot with its icon, and pads each group to full rows of 8', () => {
    const { container } = renderSkills();
    expect(slots()).toHaveLength(17);          // 5 + 7 + 2 + 3
    expect((slots()[0].querySelector('.rc-inv-icon') as HTMLElement).style.maskImage).toBe('url(/icons/tags/python.svg)');
    const empties = Array.from(container.querySelectorAll('.rc-inv-grid')).map((g) => g.querySelectorAll('.rc-inv-empty').length);
    expect(empties).toEqual([3, 1, 6, 5]);
    expect(screen.getByRole('button', { name: 'Tailwind CSS' })).toHaveTextContent('Tailwind');
  });

  it('starts on Python and shows it in the detail panel', () => {
    renderSkills();
    expect(screen.getByRole('button', { name: 'Python' })).toHaveAttribute('aria-pressed', 'true');
    expect(within(detail()).getByText('Python')).toBeInTheDocument();
    expect(within(detail()).getByText('CODE')).toBeInTheDocument();
  });

  it('picks a slot on click only, and lists the projects that use it', async () => {
    renderSkills();
    await userEvent.click(screen.getByRole('button', { name: 'JavaScript' }));
    expect(screen.getByRole('button', { name: 'JavaScript' })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('button', { name: 'Python' })).toHaveAttribute('aria-pressed', 'false');
    expect(within(detail()).getByRole('link', { name: 'Nightshift' })).toHaveAttribute('href', '/projects/nightshift');
    expect(within(detail()).getByRole('link', { name: 'Pixelforge' })).toHaveAttribute('href', '/projects/pixelforge');

    fireEvent.mouseEnter(screen.getByRole('button', { name: 'Docker' }));
    fireEvent.focus(screen.getByRole('button', { name: 'Docker' }));
    expect(within(detail()).getByText('JavaScript')).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: 'Docker' }));
    expect(within(detail()).getByText('DEPLOY')).toBeInTheDocument();
    expect(within(detail()).getByRole('link', { name: 'Loopline' })).toBeInTheDocument();
  });

  it('leaves out the used-in list when no project uses the skill', () => {
    renderSkills();
    expect(within(detail()).queryByText('Used in')).toBeNull();
    expect(detail().querySelector('.rc-inv-used')).toBeNull();
  });

  it('marks the empty slots past the last 4-wide row, so a phone drops fully empty rows', () => {
    const { container } = renderSkills();
    const grids = Array.from(container.querySelectorAll('.rc-inv-grid'));
    // CODE 5 -> 8 cells on a phone; BUILD 7 -> 8; DEPLOY 2 -> 4; POST 3 -> 4.
    expect(grids.map((g) => g.querySelectorAll('[data-wide]').length)).toEqual([0, 0, 4, 4]);
  });
});
