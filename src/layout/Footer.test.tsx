import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Footer } from './Footer';

beforeEach(() => {
  vi.stubGlobal('matchMedia', (q: string) => ({
    matches: false, media: q,
    addEventListener: vi.fn(), removeEventListener: vi.fn(),
    addListener: vi.fn(), removeListener: vi.fn(), dispatchEvent: vi.fn(), onchange: null,
  }));
});

describe('Footer', () => {
  it('renders the copyright and three brand links', () => {
    render(<Footer marginTop="80px" />);
    expect(screen.getByText('© 2026 RYAN CHAN')).toBeInTheDocument();
    expect(screen.getByTitle('LinkedIn')).toHaveAttribute('href', 'https://linkedin.com');
    expect(screen.getByTitle('GitHub')).toHaveAttribute('href', 'https://github.com');
    expect(screen.getByTitle('YouTube')).toHaveAttribute('href', 'https://youtube.com');
  });

  it('opens its 64px dither fade over the page background', () => {
    const { container } = render(<Footer marginTop="80px" />);
    const fade = container.querySelector('.dither-fade') as HTMLElement;
    expect(fade.style.height).toBe('64px');
    expect(fade.style.getPropertyValue('--dither-ink')).toBe('var(--color-bg)');
  });

  it('takes its top margin from the prop', () => {
    const { container: home } = render(<Footer marginTop="80px" />);
    expect((home.firstElementChild as HTMLElement).style.marginTop).toBe('80px');
    const { container: detail } = render(<Footer marginTop="auto" />);
    expect((detail.firstElementChild as HTMLElement).style.marginTop).toBe('auto');
  });
});
