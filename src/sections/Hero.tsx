import { memo } from 'react';
import { HeroScene } from '../scenes/HeroScene';

function HeroImpl({ onNavigate }: { onNavigate: () => void }) {
  return (
    <section
      id="home"
      className="px-hero"
      style={{
        position: 'relative',
        display: 'flex',
      }}
    >
      <HeroScene />

      {/* .px-hero-content is the hook for patterns.css's short-landscape
          override. Do not rename it. */}
      <div
        className="px-hero-content"
        style={{
          position: 'relative', zIndex: 3, maxWidth: '1180px', width: '100%',
          textAlign: 'center', margin: '0 auto',
        }}
      >
        <h1 style={{ margin: 0 }}>
          <img
            className="rc-hero-logo"
            src="/assets/brand/ryan-chan-hero-logo.png"
            alt="Ryan Chan — Software Engineer and Video Editor. Building tech around what people want."
            width={750}
            height={250}
          />
        </h1>

        <a
          href="#about"
          onClick={onNavigate}
          className="rc-hero-cta"
          style={{
            zIndex: 3, display: 'flex', alignItems: 'center',
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
