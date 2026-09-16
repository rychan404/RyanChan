import type { CSSProperties } from 'react';

type Props = {
  /** Path under /icons/, without the extension: 'ui/home-solid', 'brands/github'. */
  name: string;
  size: number;
  color?: string;
  className?: string;
  style?: CSSProperties;
};

/** The prototype's <span class="pixel-icon" style="…mask-image:url(CDN…)">,
 *  pointed at the vendored icon (D6). The -webkit- pair is a compat addition,
 *  not a change: tokens/components.css already prefixes every other mask
 *  property, and the two declarations render identically. */
export function PixelIcon({ name, size, color, className, style }: Props) {
  const url = `url(/icons/${name}.svg)`;
  return (
    <span
      aria-hidden="true"
      className={className ? `pixel-icon ${className}` : 'pixel-icon'}
      style={{
        width: size,
        height: size,
        ...(color ? { color } : {}),
        maskImage: url,
        WebkitMaskImage: url,
        ...style,
      }}
    />
  );
}
