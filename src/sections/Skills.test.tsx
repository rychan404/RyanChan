import { render, screen, within } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ThemeProvider } from '../hooks/useTheme';
import { Skills } from './Skills';

beforeEach(() => {
  localStorage.clear();
  vi.stubGlobal('matchMedia', (q: string) => ({
    matches: false, media: q,
    addEventListener: vi.fn(), removeEventListener: vi.fn(),
    addListener: vi.fn(), removeListener: vi.fn(), dispatchEvent: vi.fn(), onchange: null,
  }));
});

const renderSkills = () => render(<ThemeProvider><Skills /></ThemeProvider>);

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

  it('renders all three groups unconditionally', () => {
    const { container } = renderSkills();
    expect(container.querySelectorAll('.pixel-card')).toHaveLength(3);
    expect(screen.getByText('CODE')).toBeInTheDocument();
    expect(screen.getByText('BUILD')).toBeInTheDocument();
    expect(screen.getByText('POST')).toBeInTheDocument();
  });

  it('renders every skill as a large tag chip', () => {
    const { container } = renderSkills();
    const chips = Array.from(container.querySelectorAll('.pixel-tag')) as HTMLElement[];
    expect(chips).toHaveLength(16);          // 5 + 8 + 3
    expect(chips[0].style.fontSize).toBe('var(--fs-16)');
    expect(chips[0].style.padding).toBe('10px 18px');
  });

  it('puts the right skills in the right card', () => {
    const { container } = renderSkills();
    const cards = Array.from(container.querySelectorAll('.pixel-card')) as HTMLElement[];
    expect(within(cards[2]).getByText('Davinci Resolve')).toBeInTheDocument();
    expect(within(cards[2]).queryByText('Python')).toBeNull();
  });

  it('accents each group icon', () => {
    const { container } = renderSkills();
    const icons = Array.from(container.querySelectorAll('.pixel-icon')) as HTMLElement[];
    expect(icons.map((i) => i.style.maskImage)).toEqual([
      'url(/icons/ui/code-solid.svg)',
      'url(/icons/ui/cog-solid.svg)',
      'url(/icons/ui/video-camera-solid.svg)',
    ]);
    expect(icons.every((i) => i.style.color === 'var(--color-accent-text)')).toBe(true);
  });

  it('has no filter control and no skill bars', () => {
    const { container } = renderSkills();
    expect(container.querySelectorAll('button')).toHaveLength(0);
    expect(container.querySelector('.pixel-tabs')).toBeNull();
  });
});
