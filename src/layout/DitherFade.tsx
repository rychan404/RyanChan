const DENSITIES = ['dither-75', 'dither-50', 'dither-25', 'dither-12'] as const;

type Props = {
  /** --dither-ink: the colour of the section ABOVE this fade. */
  ink: string;
  /** 80 in the five section fades, 64 in the two footer fades. */
  height?: 80 | 64;
};

export function DitherFade({ ink, height = 80 }: Props) {
  const band = `${height / 4}px`;
  return (
    <div
      className="dither-fade"
      aria-hidden="true"
      style={{ height: `${height}px`, '--dither-ink': ink } as React.CSSProperties}
    >
      {DENSITIES.map((d) => (
        <i key={d} className={`dither ${d}`} style={{ height: band }} />
      ))}
    </div>
  );
}
