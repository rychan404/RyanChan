import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { PixelIcon } from './PixelIcon';
import { ImageSlot } from './ImageSlot';
import { DitherFade } from '../layout/DitherFade';

describe('PixelIcon', () => {
  it('masks the vendored icon at the requested size', () => {
    const { container } = render(<PixelIcon name="ui/home-solid" size={24} />);
    const el = container.firstElementChild as HTMLElement;
    expect(el).toHaveClass('pixel-icon');
    expect(el.style.width).toBe('24px');
    expect(el.style.height).toBe('24px');
    expect(el.style.maskImage).toBe('url(/icons/ui/home-solid.svg)');
    expect(el).toHaveAttribute('aria-hidden', 'true');
  });

  it('resolves a brand icon under the same root', () => {
    const { container } = render(<PixelIcon name="brands/github" size={24} />);
    expect((container.firstElementChild as HTMLElement).style.maskImage)
      .toBe('url(/icons/brands/github.svg)');
  });

  it('applies colour only when given', () => {
    const { container: withColor } = render(
      <PixelIcon name="ui/moon-solid" size={22} color="var(--color-text-muted)" />,
    );
    expect((withColor.firstElementChild as HTMLElement).style.color)
      .toBe('var(--color-text-muted)');

    const { container: bare } = render(<PixelIcon name="ui/moon-solid" size={22} />);
    expect((bare.firstElementChild as HTMLElement).style.color).toBe('');
  });
});
describe('ImageSlot', () => {
  it('shows the placeholder caption in development when there is no image', () => {
    render(<ImageSlot placeholder="Drop a gameplay screenshot" />);
    expect(screen.getByText('Drop a gameplay screenshot')).toBeInTheDocument();
    expect(screen.queryByRole('img')).toBeNull();
  });

  it('keeps the placeholder caption out of production builds', () => {
    vi.stubEnv('DEV', false);
    try {
      const { container } = render(<ImageSlot placeholder="Drop a gameplay screenshot" />);
      expect(screen.queryByText('Drop a gameplay screenshot')).toBeNull();
      expect(container.querySelector('.rc-slot-empty')).not.toBeNull();
      expect(container.querySelector('.rc-slot-empty .pixel-icon')).toBeNull();
    } finally {
      vi.unstubAllEnvs();
    }
  });

  it('shows the image and hides the placeholder when there is one', () => {
    render(<ImageSlot placeholder="Drop a photo" src="/assets/about/fact-eggs.webp" alt="Eggs" />);
    const img = screen.getByRole('img', { name: 'Eggs' });
    expect(img).toHaveAttribute('src', '/assets/about/fact-eggs.webp');
    expect(screen.queryByText('Drop a photo')).toBeNull();
  });
});

describe('DitherFade', () => {
  it('renders four bands of one quarter the height', () => {
    const { container } = render(<DitherFade ink="var(--color-surface)" />);
    const fade = container.firstElementChild as HTMLElement;
    expect(fade).toHaveClass('dither-fade');
    expect(fade).toHaveAttribute('aria-hidden', 'true');
    expect(fade.style.height).toBe('80px');
    expect(fade.style.getPropertyValue('--dither-ink')).toBe('var(--color-surface)');

    const bands = Array.from(fade.children) as HTMLElement[];
    expect(bands.map((b) => b.className)).toEqual([
      'dither dither-75', 'dither dither-50', 'dither dither-25', 'dither dither-12',
    ]);
    expect(bands.every((b) => b.style.height === '20px')).toBe(true);
  });

  it('supports the 64px footer variant with 16px bands', () => {
    const { container } = render(<DitherFade ink="var(--color-bg)" height={64} />);
    const fade = container.firstElementChild as HTMLElement;
    expect(fade.style.height).toBe('64px');
    expect((fade.children[0] as HTMLElement).style.height).toBe('16px');
  });

  it('takes extra classes, for the flipped fade over a photo', () => {
    const { container } = render(<DitherFade ink="var(--tile-bar)" height={32} className="dither-fade--up rc-media-fade" />);
    const fade = container.firstElementChild as HTMLElement;
    expect(fade).toHaveClass('dither-fade', 'dither-fade--up', 'rc-media-fade');
    expect((fade.children[0] as HTMLElement).style.height).toBe('8px');
  });
});
