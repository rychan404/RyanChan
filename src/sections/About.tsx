import { CSSProperties, memo, useEffect, useRef, useState } from 'react';
import { FACTS, type FactId } from '../content/facts';
import { useSpriteSheet } from '../hooks/useSpriteSheet';
import { DitherFade } from '../layout/DitherFade';
import { PixelIcon } from '../components/PixelIcon';
import { FactPopover } from '../components/FactPopover';

const STATS = [
  { value: '6+', label: <>Projects<br />SHIPPED</>, padding: '16px 8px' },
  { value: '5K+', label: 'Views on social media content', padding: '16px 12px' },
  { value: '50K+', label: 'LINES of Code written', padding: '16px 12px' },
];

const BIO = {
  fontSize: 'var(--fs-17)',
  lineHeight: '1.75',
  color: 'var(--color-text)',
  margin: 0,
  textWrap: 'pretty',
} as CSSProperties;

const QUEST_LOG = [
  { text: 'Software Engineer Intern @ Capital Technology Group', icon: 'ui/check-box-solid', color: 'var(--color-primary)' },
  { text: 'Videographer for UMD JASA & Black Rocket Productions', icon: 'ui/check-box-solid', color: 'var(--color-primary)' },
  { text: 'On the internship grind...', icon: 'ui/clock-solid', color: 'var(--color-warning)' },
];

function AboutImpl() {
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
      className="rc-section"
      style={{
        position: 'relative',
        background: 'var(--color-surface)',
        order: 1,
      }}
    >
      <DitherFade ink="var(--dither-ink-about)" />

      <div className="rc-section-inner">
        <h2 className="rc-section-title">
          About
        </h2>

        <div
          className="rc-grid-about"
          style={{
            display: 'grid',
            marginTop: '44px',
            alignItems: 'start',
          } as CSSProperties}
        >
          {/* Left column */}
          <div className="rc-about-col">
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
              <img
                src="/assets/about/about-headshot.webp"
                alt="Ryan Chan"
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  objectPosition: 'top',
                  opacity: playing ? 0 : 1,
                  transition: 'opacity 140ms steps(3,end)',
                }}
              />
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
            <div className="rc-stats" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(96px,1fr))' }}>
              {STATS.map((stat, idx) => (
                <div key={idx} className="rc-stat" style={{ '--stat-pad': stat.padding } as CSSProperties}>
                  <div className="rc-stat-value">{stat.value}</div>
                  <div className="rc-stat-label">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Fun facts panel */}
            <div
              ref={factsRef}
              className="rc-panel rc-about-facts"
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
          <div className="rc-about-col rc-about-bio">
            {/* Bio paragraphs, at body size */}
            <p style={BIO}>
              I'm an aspiring software engineer and video editor in the DMV who builds technology around what
              people actually want. Also, I'm a problem solver at heart, fixing bugs in systems before adding
              more features. See this in{' '}
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
              .
            </p>

            <p style={BIO}>
              Computer science sophomore at the University of Maryland with junior-level credits, focused on
              full-stack development.
            </p>

            <p style={BIO}>
              While I'm not coding, you might see me editing videos for fun or chasing down shots on the tennis court.
            </p>

            {/* Quest log panel */}
            <div className="rc-panel rc-about-quest">
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
