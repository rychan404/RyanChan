import { CSSProperties, memo, useEffect, useRef, useState } from 'react';
import { FACTS, type FactId } from '../content/facts';
import { useIsMobile } from '../hooks/useMediaQuery';
import { useSpriteSheet } from '../hooks/useSpriteSheet';
import { aboutGridCols, sectionHeadingShadow } from '../lib/responsive';
import { DitherFade } from '../layout/DitherFade';
import { PixelIcon } from '../components/PixelIcon';
import { FactPopover } from '../components/FactPopover';

const STATS = [
  { value: '6+', label: <>Projects<br />SHIPPED</>, padding: '16px 8px' },
  { value: '5K+', label: 'Views on social media content', padding: '16px 12px' },
  { value: '50K+', label: 'LINES of Code written', padding: '16px 12px' },
];

const QUEST_LOG = [
  { text: 'Software Engineer Intern @ Capital Technology Group', icon: 'ui/check-box-solid', color: 'var(--color-primary)' },
  { text: 'Videographer for UMD JASA & Black Rocket Productions', icon: 'ui/check-box-solid', color: 'var(--color-primary)' },
  { text: 'On the internship grind...', icon: 'ui/clock-solid', color: 'var(--color-warning)' },
];

function AboutImpl() {
  const isMobile = useIsMobile();
  const { panelRef, spriteRef, playing, toggle } = useSpriteSheet();

  const [openFact, setOpenFact] = useState<FactId | null>(null);
  const factsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!openFact) return;
    const onDown = (e: MouseEvent) => {
      if (!factsRef.current?.contains(e.target as Node)) setOpenFact(null);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpenFact(null);
    };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [openFact]);

  return (
    <section
      id="about"
      style={{
        position: 'relative',
        background: 'var(--color-surface)',
        padding: '0 0 112px',
        order: 1,
      }}
    >
      <DitherFade ink="var(--dither-ink-about)" />

      <div style={{ padding: '56px var(--section-pad-x) 0' }}>
        <h2 className="rc-section-title" style={{ textShadow: sectionHeadingShadow(isMobile) }}>
          About
        </h2>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: aboutGridCols(isMobile),
            gap: '48px',
            marginTop: '44px',
            alignItems: 'start',
          } as CSSProperties}
        >
          {/* Left column */}
          <div>
            {/* Sprite panel */}
            <div ref={panelRef} className="rc-photo-frame">
              <div
                ref={spriteRef}
                role="img"
                aria-label="Ryan Chan, animated"
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  backgroundImage: 'url(/assets/about/about-sprite.png)',
                  backgroundSize: 'cover',
                  backgroundPosition: '0 0',
                  imageRendering: 'pixelated',
                  opacity: playing ? 1 : 0,
                  transition: 'opacity 140ms steps(3,end)',
                }}
              />
              <picture>
                <source srcSet="/assets/about/about-headshot.webp" type="image/webp" />
                <img
                  src="/assets/about/about-headshot.png"
                  alt="Ryan Chan"
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    opacity: playing ? 0 : 1,
                    transition: 'opacity 140ms steps(3,end)',
                  }}
                />
              </picture>
              <button
                className="rc-sprite-toggle rc-photo-toggle"
                title="Play the animated sprite"
                onClick={toggle}
              >
                <PixelIcon
                  name={playing ? 'ui/pause-solid' : 'ui/play-solid'}
                  size={14}
                  color="var(--color-text-muted)"
                />
              </button>
            </div>

            {/* Stats grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(96px,1fr))', gap: '12px', marginBottom: '40px' }}>
              {STATS.map((stat, idx) => (
                <div key={idx} className="rc-stat" style={{ padding: stat.padding }}>
                  <div className="rc-stat-value">{stat.value}</div>
                  <div className="rc-stat-label">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Fun facts panel */}
            <div
              ref={factsRef}
              className="rc-panel"
            >
              <h3 className="rc-panel-heading">
                FUN FACTS
              </h3>
              <div className="rc-panel-lines">
                {FACTS.map((fact) => (
                  <div key={fact.id} className="rc-panel-line">
                    <PixelIcon
                      name={fact.icon}
                      size={20}
                      color="var(--color-primary)"
                      style={{ marginTop: '2px', flexShrink: 0 }}
                    />
                    <p>
                      <FactPopover
                        fact={fact}
                        open={openFact === fact.id}
                        onToggle={() => setOpenFact(openFact === fact.id ? null : fact.id)}
                        onClose={() => setOpenFact(null)}
                      />
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Bio paragraphs */}
            <p
              style={{
                fontSize: 'var(--fs-20)',
                lineHeight: '1.75',
                color: 'var(--color-text)',
                margin: 0,
                textWrap: 'pretty',
              } as CSSProperties}
            >
              Computer science sophomore at the University of Maryland, passionate about software engineering
              and creative media. I'm also an avid videographer and filmmaker, constantly exploring the intersection of code and creativity.
              <br />
              <br />
              You can find me{' '}
              <a
                href="#projects"
                className="rc-fact-term"
                style={{
                  color: 'var(--color-accent-text)',
                  textDecoration: 'underline dotted',
                  textUnderlineOffset: '3px',
                  cursor: 'pointer',
                }}
              >
                my projects
              </a>
              {' '}showcasing everything from web apps to{' '}
            </p>

            <p
              style={{
                fontSize: 'var(--fs-18)',
                lineHeight: '1.75',
                color: 'var(--color-text)',
                margin: 0,
                textWrap: 'pretty',
              } as CSSProperties}
            >
              production-grade video content. Beyond the computer screen, I'm constantly chasing down shots on
              the tennis court, whether it's hitting aces in matches or creating dynamic video reels.
            </p>

            <p
              style={{
                fontSize: 'var(--fs-18)',
                lineHeight: '1.75',
                color: 'var(--color-text)',
                margin: 0,
                textWrap: 'pretty',
              } as CSSProperties}
            >
              Everything I create is driven by one goal: to bring ideas to life through thoughtful design and solid engineering.
            </p>

            {/* Quest log panel */}
            <div className="rc-panel">
              <h3 className="rc-panel-heading">
                QUEST LOG
              </h3>
              <div className="rc-panel-lines">
                {QUEST_LOG.map((entry, idx) => (
                  <div key={idx} className="rc-panel-line">
                    <PixelIcon
                      name={entry.icon}
                      size={20}
                      color={entry.color}
                      style={{ marginTop: '2px', flexShrink: 0 }}
                    />
                    <p>
                      {entry.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// Memoized so a theme toggle, which re-renders Home for its themeClass,
// does not cascade through every section. The scenes subscribe to the theme
// context directly, so they still update.
export const About = memo(AboutImpl);
