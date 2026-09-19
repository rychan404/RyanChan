import type { Fact } from '../content/facts';
import { ImageSlot } from './ImageSlot';

type Props = {
  fact: Fact;
  open: boolean;
  onToggle: () => void;
  onClose: () => void;
};

export function FactPopover({ fact, open, onToggle, onClose }: Props) {
  return (
    <>
      {fact.before}
      <span
        className="rc-fact-term"
        role="button"
        tabIndex={0}
        aria-expanded={open}
        onClick={(e) => { e.stopPropagation(); onToggle(); }}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onToggle(); }
        }}
        style={{
          position: 'relative', display: 'inline-block',
          color: 'var(--color-accent-text)',
          textDecoration: 'underline dotted', textUnderlineOffset: '3px',
          cursor: 'pointer',
        }}
      >
        {fact.term}
        {open && (
          <span
            style={{
              position: 'absolute', top: '100%', right: 0, marginTop: '8px',
              width: '220px', zIndex: 20, background: 'var(--color-surface)',
              border: 'var(--border-mid) solid var(--color-border)',
              boxShadow: 'var(--shadow-card) var(--color-border)', padding: '8px',
            }}
          >
            <span style={{ position: 'relative', display: 'block', width: '100%', height: '120px' }}>
              <ImageSlot
                placeholder={fact.slotHint}
                src={fact.image}
                srcWebp={fact.imageWebp}
                alt={fact.image ? fact.caption : undefined}
              />
            </span>
            <span
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                gap: '8px', marginTop: '6px',
              }}
            >
              <span style={{ fontSize: 'var(--fs-12)', color: 'var(--color-text-dim)', flex: 1, minWidth: 0 }}>
                {fact.caption}
              </span>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); onClose(); }}
                title="Close"
                className="rc-popover-close"
                style={{
                  flexShrink: 0, width: '22px', height: '22px', display: 'flex',
                  alignItems: 'center', justifyContent: 'center',
                  background: 'var(--color-surface)',
                  border: 'var(--border-thin) solid var(--color-border)',
                  boxShadow: 'var(--shadow-control) var(--color-border)',
                  cursor: 'pointer', padding: 0,
                  fontFamily: 'var(--font-display)', fontSize: 'var(--fs-20)',
                  color: 'var(--color-text)',
                }}
              >
                ×
              </button>
            </span>
          </span>
        )}
      </span>
      {fact.after}
    </>
  );
}
