import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { PixelIcon } from './PixelIcon';
import { TagChip } from './TagChip';
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

describe('TagChip', () => {
  it('renders a mapped tag with its icon and bottom-border colour', () => {
    const { container } = render(<TagChip name="Docker" />);
    const chip = container.firstElementChild as HTMLElement;
    expect(chip).toHaveClass('pixel-tag');
    expect(chip).toHaveTextContent('Docker');
    expect(chip.style.borderBottom).toBe('var(--border-tag) solid #2496ED');
    const icon = chip.querySelector('span[style*="mask-image"]') as HTMLElement;
    expect(icon.style.maskImage).toBe('url(/icons/tags/docker.svg)');
    expect(icon.style.width).toBe('13px');
  });

  it('renders an unmapped tag with no icon and currentColor', () => {
    const { container } = render(<TagChip name="Origami" />);
    const chip = container.firstElementChild as HTMLElement;
    expect(chip).toHaveTextContent('Origami');
    expect(chip.style.borderBottom).toBe('var(--border-tag) solid currentColor');
    expect(chip.querySelector('span[style*="mask-image"]')).toBeNull();
  });

  it('uses the larger skills geometry at size="lg"', () => {
    const { container } = render(<TagChip name="React" size="lg" />);
    const chip = container.firstElementChild as HTMLElement;
    expect(chip.style.fontSize).toBe('var(--fs-16)');
    expect(chip.style.padding).toBe('10px 18px');
    expect(chip.style.gap).toBe('9px');
    const icon = chip.querySelector('span[style*="mask-image"]') as HTMLElement;
    expect(icon.style.width).toBe('17px');
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
      expect(container.querySelector('.rc-slot-empty .pixel-icon')).not.toBeNull();
    } finally {
      vi.unstubAllEnvs();
    }
  });

  it('shows the image and hides the placeholder when there is one', () => {
    render(<ImageSlot placeholder="Drop a photo" src="/assets/about/fact-eggs.png" alt="Eggs" />);
    const img = screen.getByRole('img', { name: 'Eggs' });
    expect(img).toHaveAttribute('src', '/assets/about/fact-eggs.png');
    expect(screen.queryByText('Drop a photo')).toBeNull();
  });

  it('emits a <picture> with a WebP source when given one', () => {
    const { container } = render(
      <ImageSlot placeholder="x" src="/a.png" srcWebp="/a.webp" alt="A" />,
    );
    const source = container.querySelector('source');
    expect(source).toHaveAttribute('srcset', '/a.webp');
    expect(source).toHaveAttribute('type', 'image/webp');
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
});
