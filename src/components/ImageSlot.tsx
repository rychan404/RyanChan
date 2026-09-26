import type { CSSProperties } from 'react';

type Props = {
  /** Caption shown in the empty state, in development only. */
  placeholder?: string;
  src?: string;
  alt?: string;
  style?: CSSProperties;
};

const FILL: CSSProperties = {
  position: 'absolute',
  inset: 0,
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  // Photos and screenshots, not pixel art: effects.css makes every <img> pixelated,
  // which drops detail when a large image is scaled down to fit the slot.
  imageRendering: 'auto',
};

/** Replaces the prototype's <image-slot> (D3). An empty slot is what visitors
 *  see until a project has its image, so it is drawn in the site's own
 *  language: a light dither over the frame's fill.
 *  The placeholder hint ("Drop a gameplay screenshot") is a note to the owner,
 *  so it only renders in development. */
export function ImageSlot({ placeholder, src, alt = '', style }: Props) {
  if (src) return <img src={src} alt={alt} style={{ ...FILL, ...style }} />;

  return (
    <span data-slot-placeholder="true" aria-hidden="true" className="rc-slot-empty" style={style}>
      <span className="dither-12 rc-slot-dither" />
      {import.meta.env.DEV && placeholder && <span className="rc-slot-hint">{placeholder}</span>}
    </span>
  );
}
