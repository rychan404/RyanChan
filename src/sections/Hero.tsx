import { CSSProperties, memo } from 'react';
import { HeroScene } from '../scenes/HeroScene';
import { useHydrated } from '../hooks/useHydrated';

const EYEBROW: CSSProperties = {
  fontFamily: 'var(--font-display)',
  fontSize: 'var(--fs-hero-tagline)',
  letterSpacing: '.06em',
  color: 'var(--color-heading)',
  textTransform: 'uppercase',
  textShadow: '-2px -2px 0 var(--color-heading-shadow),2px -2px 0 var(--color-heading-shadow),-2px 2px 0 var(--color-heading-shadow),2px 2px 0 var(--color-heading-shadow)',
};

function HeroImpl({ onNavigate }: { onNavigate: () => void }) {
  const hydrated = useHydrated();

  return (
    <section
      id="home"
      className="px-hero"
      style={{
        position: 'relative',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      {hydrated ? <HeroScene /> : null}

      {/* .px-hero-content is the hook for global.css's landscape /
          short-viewport override. Do not rename it. */}
      <div
        className="px-hero-content"
        style={{
          position: 'relative', zIndex: 3, maxWidth: '1180px', width: '100%',
          textAlign: 'center', margin: '0 auto',
        }}
      >
        <p className="rc-hero-eyebrow" style={EYEBROW}>
          Software Engineer <br className="rc-mobile-only" />and Video Editor
        </p>

        <h1
          className="rc-hero-name"
          style={{
            fontSize: 'var(--fs-hero-name)',
            lineHeight: '.9',
            wordSpacing: '-0.25em',
            color: 'var(--color-heading)',
            margin: 0,
          }}
        >
          RYAN CHAN
        </h1>

        <p
          style={{
            fontSize: 'var(--fs-17)', lineHeight: '1.15', maxWidth: '32ch',
            color: 'var(--color-text-muted)', margin: '8px auto 0', ...({ textWrap: 'pretty' } as CSSProperties),
          }}
        >
          Building technology around what people actually want.
        </p>

        <a
          href="#about"
          onClick={onNavigate}
          className="rc-hero-cta"
          style={{
            margin: '20px auto 0', zIndex: 3, display: 'flex', alignItems: 'center',
            justifyContent: 'center', gap: '12px', fontFamily: 'var(--font-display)',
            fontSize: 'var(--fs-16)', letterSpacing: '.08em', cursor: 'pointer',
          }}
        >
          <span style={{ animation: 'pxbob 1.1s steps(2,end) infinite alternate' }}>▼</span>
          <span>CLICK TO CONTINUE</span>
          <span
            style={{
              animation: 'pxblink 1s steps(1,end) infinite',
              background: 'currentColor', width: '12px', height: '20px',
              display: 'inline-block', transition: 'background-color .1s var(--ease-pixel)',
            }}
          />
        </a>
      </div>
    </section>
  );
}

// Memoized so a theme toggle, which re-renders Home for its themeClass,
// does not cascade through every section. The scenes subscribe to the theme
// context directly, so they still update.
export const Hero = memo(HeroImpl);
