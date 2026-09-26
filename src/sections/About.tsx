import { memo, type ReactNode, useEffect, useRef, useState } from 'react';
import { FACTS, type FactId } from '../content/facts';
import { useSpriteSheet } from '../hooks/useSpriteSheet';
import { DitherFade } from '../layout/DitherFade';
import { PixelIcon } from '../components/PixelIcon';
import { FactPopover } from '../components/FactPopover';

const STATS = [
  { value: '6+', label: 'Projects shipped' },
  { value: '5K+', label: 'Social media views' },
  { value: '50K+', label: 'Lines of code' },
];

const QUEST_LOG = [
  { text: 'Previous Software Engineer Intern @ Capital Technology Group', icon: 'ui/check-box-solid', color: 'var(--color-primary)' },
  { text: 'Tech Lead Developer @ UMD Coffee', icon: 'ui/check-box-solid', color: 'var(--color-primary)' },
  { text: 'Geospatial Undergraduate Researcher @ UMD Gestalt', icon: 'ui/check-box-solid', color: 'var(--color-primary)' },
  { text: 'Social Media Manager @ UMD Hack4Impact', icon: 'ui/check-box-solid', color: 'var(--color-primary)' },
  { text: 'Social Media Content Creator @ Black Rocket Productions', icon: 'ui/check-box-solid', color: 'var(--color-primary)' },
  { text: 'Videographer @ UMD Japanese American Student Association', icon: 'ui/check-box-solid', color: 'var(--color-primary)' },
  { text: 'Seeking internships/job experience!', icon: 'ui/clock-solid', color: 'var(--color-warning)' },
];

type Topic = 'bio' | 'facts' | 'quests' | 'off';

const TOPICS: { id: Topic; label: string }[] = [
  { id: 'bio', label: 'Who are you?' },
  { id: 'facts', label: 'Fun facts' },
  { id: 'quests', label: 'Quest log' },
  { id: 'off', label: 'Off the clock' },
];

const BIO: ReactNode[] = [
  "I'm an aspiring software engineer and video editor in the DMV who builds technology around what people actually want.",
  <>
    Also, I'm a problem solver at heart, fixing bugs in systems before adding more features. See this in{' '}
    <a href="#projects" className="rc-fact-term">my projects</a>.
  </>,
  'Computer science sophomore at the University of Maryland, focused on full-stack development.',
];

const OFF: ReactNode[] = [
  "While I'm not coding, you might see me editing videos for fun or chasing down shots on the tennis court.",
];

function Line({ icon, color, children }: { icon: string; color: string; children: ReactNode }) {
  return (
    <span className="rc-bubble-line">
      <PixelIcon name={icon} size={20} color={color} style={{ marginTop: '4px', flexShrink: 0 }} />
      <span>{children}</span>
    </span>
  );
}

function AboutImpl() {
  const { panelRef, spriteRef, playing, toggle } = useSpriteSheet();

  const [topic, setTopic] = useState<Topic>('bio');
  const [openFact, setOpenFact] = useState<FactId | null>(null);
  const bubbleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!openFact) return;
    const onDown = (e: MouseEvent) => {
      if (!bubbleRef.current?.contains(e.target as Node)) setOpenFact(null);
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

  const lines: ReactNode[] =
    topic === 'bio' ? BIO
    : topic === 'off' ? OFF
    : topic === 'quests' ? QUEST_LOG.map((q) => <Line key={q.text} icon={q.icon} color={q.color}>{q.text}</Line>)
    : FACTS.map((fact) => (
      <Line key={fact.id} icon={fact.icon} color="var(--color-primary)">
        <FactPopover
          fact={fact}
          open={openFact === fact.id}
          onToggle={() => setOpenFact(openFact === fact.id ? null : fact.id)}
          onClose={() => setOpenFact(null)}
        />
      </Line>
    ));

  const pick = (id: Topic) => {
    setOpenFact(null);
    setTopic(id);
  };

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

        <div className="rc-about">
          {/* Character sheet: portrait, name and stats */}
          <aside className="rc-about-sheet">
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

            <div className="rc-about-id">
              <h3 className="rc-about-name">Ryan Chan</h3>
              <p className="rc-about-sub">CS sophomore, UMD</p>
            </div>

            <dl className="rc-about-stats">
              {STATS.map((stat) => (
                <div key={stat.label} className="rc-about-stat">
                  <dt>{stat.label}</dt>
                  <dd>{stat.value}</dd>
                </div>
              ))}
            </dl>
          </aside>

          {/* Speech bubble: every line of the current topic */}
          <div ref={bubbleRef} className="rc-bubble">
            <div className="rc-bubble-text" aria-live="polite">
              {lines.map((line, i) => <div key={i}>{line}</div>)}
            </div>
            <span className="rc-bubble-tail" aria-hidden="true" />
          </div>

          {/* Topic menu */}
          <div className="rc-about-menu" role="group" aria-label="Ask Ryan">
            {TOPICS.map((t) => (
              <button
                key={t.id}
                type="button"
                className="rc-about-opt"
                aria-pressed={topic === t.id}
                onClick={() => pick(t.id)}
              >
                {t.label}
              </button>
            ))}
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
