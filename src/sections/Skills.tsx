import { PixelIcon } from '../components/PixelIcon';
import { TagChip } from '../components/TagChip';
import { SKILL_GROUPS } from '../content/skills';
import { useIsMobile } from '../hooks/useMediaQuery';
import { DitherFade } from '../layout/DitherFade';
import { sectionHeadingShadow } from '../lib/responsive';

const CARD_EDGE =
  'var(--edge-on-surface)';

export function Skills() {
  const isMobile = useIsMobile();

  return (
    <section
      id="skills"
      style={{ position: 'relative', background: 'var(--color-surface)', padding: '0 0 112px', order: 3 }}
    >
      <DitherFade ink="var(--color-bg)" />
      <div style={{ padding: '56px var(--section-pad-x) 0' }}>
        <h2 className="rc-section-title" style={{ textShadow: sectionHeadingShadow(isMobile) }}>
          Skills
        </h2>
        <p className="rc-section-lede">
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
              } as React.CSSProperties}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                <PixelIcon name={group.icon} size={22} color="var(--color-accent-text)" />
                <span
                  style={{
                    fontFamily: 'var(--font-display)', fontSize: 'var(--fs-22)',
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
