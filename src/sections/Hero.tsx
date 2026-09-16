import { CSSProperties } from 'react';
import { HeroScene } from '../scenes/HeroScene';
import { useIsMobile } from '../hooks/useMediaQuery';
import { heroNameShadow, heroPad, heroShift } from '../lib/responsive';

const EYEBROW_BASE = {
  fontFamily: 'var(--font-display)',
  fontSize: 'clamp(20px,2.2vw,30px)',
  letterSpacing: '.06em',
  color: '#A9BF6D',
  textTransform: 'uppercase' as const,
  textShadow: '-2px -2px 0 #216C50,2px -2px 0 #216C50,-2px 2px 0 #216C50,2px 2px 0 #216C50',
};

export function Hero({ onNavigate }: { onNavigate: () => void }) {
  const isMobile = useIsMobile();

  return (
    <section
      id="home"
      className="px-hero"
      style={{
        position: 'relative',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        ...heroPad(isMobile),
      }}
    >
      <HeroScene />

      {/* .px-hero-content is the hook for global.css's landscape /
          short-viewport override. Do not rename it. */}
      <div
        className="px-hero-content"
        style={{
          position: 'relative', zIndex: 3, maxWidth: '1180px', width: '100%',
          textAlign: 'center', margin: '0 auto', transform: heroShift(isMobile),
        }}
      >
        {isMobile ? (
          <p style={{ ...EYEBROW_BASE, margin: '0 0 8px', lineHeight: '1.1' }}>
            Software Engineer<br />and Video Editor
          </p>
        ) : (
          <p style={{ ...EYEBROW_BASE, margin: '0 0 -8px' }}>
            Software Engineer and Video Editor
          </p>
        )}

        <h1
          style={{
            fontSize: 'clamp(56px,10vw,152px)',
            lineHeight: '.9',
            wordSpacing: '-0.25em',
            color: '#A9BF6D',
            textShadow: heroNameShadow(isMobile),
            margin: 0,
          }}
        >
          RYAN CHAN
        </h1>

        <p
          style={{
            fontSize: '17px', lineHeight: '1.15', maxWidth: '32ch',
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
            fontSize: '16px', letterSpacing: '.08em', color: 'var(--color-text-muted)',
            cursor: 'pointer', transition: 'color .1s var(--ease-pixel)',
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
