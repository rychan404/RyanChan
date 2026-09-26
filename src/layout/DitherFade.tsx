const DENSITIES = ['dither-75', 'dither-50', 'dither-25', 'dither-12'] as const;

type Props = {
  /** --dither-ink: the colour of the section ABOVE this fade. */
  ink: string;
  /** 80 in the five section fades, 64 in the two footer fades and on the
   *  project card's photo, 32 on the roster tiles' photos. */
  height?: 80 | 64 | 32;
  /** Extra classes: 'dither-fade--up rc-media-fade' lays it over a photo's bottom edge. */
  className?: string;
};

/** A <span>, so it can sit inside a roster tile's <button>. */
export function DitherFade({ ink, height = 80, className }: Props) {
  const band = `${height / 4}px`;
  return (
    <span
      className={className ? `dither-fade ${className}` : 'dither-fade'}
      aria-hidden="true"
      style={{ height: `${height}px`, '--dither-ink': ink } as React.CSSProperties}
    >
      {DENSITIES.map((d) => (
        <i key={d} className={`dither ${d}`} style={{ height: band }} />
      ))}
    </span>
  );
}
