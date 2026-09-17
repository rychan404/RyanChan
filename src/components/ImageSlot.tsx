import type { CSSProperties } from 'react';

type Props = {
  /** Caption shown in the empty state. */
  placeholder: string;
  src?: string;
  /** Optional WebP variant; when present the img becomes a <picture>. */
  srcWebp?: string;
  alt?: string;
  style?: CSSProperties;
};

const HOST: CSSProperties = {
  display: 'block',
  position: 'absolute',
  inset: 0,
  overflow: 'hidden',
  color: 'inherit',
  font: '13px/1.3 system-ui, -apple-system, sans-serif',
};

const FILL: CSSProperties = {
  position: 'absolute',
  inset: 0,
  width: '100%',
  height: '100%',
  objectFit: 'cover',
};

/** Replaces the prototype's <image-slot> (D3). image-slot.js is a preview shim
 *  and is not ported; this reproduces its empty-state chrome — tinted frame,
 *  1.5px dashed ring at .35, 28px glyph at .45, 13px caption at .75 — minus
 *  the shim's "or browse files" line, which is an editor affordance. */
export function ImageSlot({ placeholder, src, srcWebp, alt = '', style }: Props) {
  if (src) {
    const img = <img src={src} alt={alt} style={{ ...FILL, ...style }} />;
    return srcWebp ? (
      <picture>
        <source srcSet={srcWebp} type="image/webp" />
        {img}
      </picture>
    ) : (
      img
    );
  }

  return (
    <div data-slot-placeholder="true" style={{ ...HOST, background: 'rgba(127,127,127,.08)', ...style }}>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '6px',
          textAlign: 'center',
          padding: '12px',
        }}
      >
        <svg
          aria-hidden="true"
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ opacity: 0.45 }}
        >
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <circle cx="8.5" cy="8.5" r="1.5" />
          <path d="m21 15-5-5L5 21" />
        </svg>
        <div style={{ maxWidth: '90%', fontWeight: 500, letterSpacing: '.01em', opacity: 0.75 }}>
          {placeholder}
        </div>
      </div>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          border: '1.5px dashed currentColor',
          opacity: 0.35,
        }}
      />
    </div>
  );
}
