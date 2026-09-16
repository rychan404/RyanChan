import { PixelIcon } from '../components/PixelIcon';
import { TagChip } from '../components/TagChip';
import { SKILL_GROUPS } from '../content/skills';
import { useIsMobile } from '../hooks/useMediaQuery';
import { DitherFade } from '../layout/DitherFade';
import { sectionHeadingShadow } from '../lib/responsive';

const CARD_EDGE =
  'var(--px-edge, hsl(from var(--color-surface) calc(h + 36) calc(s * 1.15) calc(l * 0.3)))';

export function Skills() {
  const isMobile = useIsMobile();

  return (
    <section
      id="skills"
      style={{ position: 'relative', background: 'var(--color-surface)', padding: '0 0 112px', order: 3 }}
    >
      <DitherFade ink="var(--color-bg)" />
      <div style={{ padding: '56px var(--section-pad-x) 0' }}>
        <h2
          style={{
            fontSize: 'clamp(40px,6vw,76px)',
            color: '#A9BF6D',
            textShadow: sectionHeadingShadow(isMobile),
          }}
        >
          Skills
        </h2>
        <p
          style={{
            fontSize: '19px', lineHeight: '1.7', maxWidth: '62ch',
            color: 'var(--color-text-muted)', margin: '20px 0 0',
          }}
        >
          Tech I use on a daily basis
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', marginTop: '48px' }}>
          {SKILL_GROUPS.map((group) => (
            <div
              key={group.name}
              className="pixel-card"
              style={{
                padding: '24px',
                background: 'var(--color-bg)',
                '--color-border': CARD_EDGE,
                '--shadow-pixel': `2px 2px 0 ${CARD_EDGE}`,
              } as React.CSSProperties}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                <PixelIcon name={group.icon} size={22} color="var(--color-accent-text)" />
                <span
                  style={{
                    fontFamily: 'var(--font-display)', fontSize: '22px',
                    letterSpacing: '.04em', color: 'var(--color-text)',
                  }}
                >
                  {group.name}
                </span>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                {group.skills.map((s) => (
                  <TagChip key={s} name={s} size="lg" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
