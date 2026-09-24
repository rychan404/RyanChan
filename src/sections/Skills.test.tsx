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

  it('labels the three groups above their rows', () => {
    const { container } = renderSkills();
    const labels = Array.from(container.querySelectorAll('.rc-inv-group > .rc-inv-label')).map((l) => l.textContent);
    expect(labels).toEqual(['CODE', 'BUILD', 'POST']);
  });

  it('gives every skill a slot with its icon, and pads each row to the widest group', () => {
    const { container } = renderSkills();
    expect(slots()).toHaveLength(16);          // 5 + 8 + 3
    expect((slots()[0].querySelector('.rc-inv-icon') as HTMLElement).style.maskImage).toBe('url(/icons/tags/python.svg)');
    expect(container.querySelectorAll('.rc-inv-empty')).toHaveLength(3 + 0 + 5);
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
    expect(within(detail()).getByText('BUILD')).toBeInTheDocument();
    expect(within(detail()).getByRole('link', { name: 'Loopline' })).toBeInTheDocument();
  });

  it('leaves out the used-in list when no project uses the skill', () => {
    renderSkills();
    expect(within(detail()).queryByText('Used in')).toBeNull();
    expect(detail().querySelector('.rc-inv-used')).toBeNull();
  });

  it('marks the short groups so a phone can drop their empty second row', () => {
    const { container } = renderSkills();
    const grids = Array.from(container.querySelectorAll('.rc-inv-grid')) as HTMLElement[];
    expect(grids.map((g) => g.hasAttribute('data-short'))).toEqual([false, false, true]);
  });
});
