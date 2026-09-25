import { memo, useState } from 'react';
import type { Project } from '../content/projects';
import { SKILL_GROUPS } from '../content/skills';
import { SkillIcon } from '../components/SkillIcon';
import { DitherFade } from '../layout/DitherFade';

/** Slot captions for the names too long to fit under the icon. */
const SHORT: Record<string, string> = {
  'Tailwind CSS': 'Tailwind',
  PostgreSQL: 'Postgres',
  'DaVinci Resolve': 'DaVinci',
};

/** Slots per row: 8 wide, 4 on a phone (the .rc-inv-grid columns in patterns.css).
 *  A group fills whole rows, padding with empty slots, and past 8 skills it grows another row. */
const COLS = 8;
const PHONE_COLS = 4;
const fill = (n: number, cols: number) => Math.ceil(n / cols) * cols;

const GROUP_OF = new Map(SKILL_GROUPS.flatMap((g) => g.skills.map((s) => [s, g.name] as const)));

function SkillsImpl({ projects }: { projects: Project[] }) {
  const [picked, setPicked] = useState(SKILL_GROUPS[0].skills[0]);
  const usedIn = projects.filter((p) => p.tags.includes(picked));

  return (
    <section
      id="skills"
      className="rc-section"
      style={{ position: 'relative', background: 'var(--color-surface)', order: 3 }}
    >
      <DitherFade ink="var(--color-bg)" />
      <div className="rc-section-inner">
        <h2 className="rc-section-title">
          Skills
        </h2>
        <p className="rc-section-lede">
          Tech I use on a daily basis
        </p>

        <div className="rc-inv">
          <div className="rc-inv-slots" role="group" aria-label="Skills">
            {SKILL_GROUPS.map((g) => (
              <div key={g.name} className="rc-inv-group">
                <h3 className="rc-inv-label">{g.name}</h3>
                <div className="rc-inv-grid">
                  {g.skills.map((s) => (
                    <button
                      key={s}
                      type="button"
                      className="rc-inv-slot"
                      aria-label={s}
                      aria-pressed={s === picked}
                      onClick={() => setPicked(s)}
                    >
                      <SkillIcon name={s} />
                      <span className="rc-inv-caption">{SHORT[s] ?? s}</span>
                    </button>
                  ))}
                  {/* data-wide: an empty slot past the last 4-wide row a phone needs, so a phone drops it. */}
                  {Array.from({ length: fill(g.skills.length, COLS) - g.skills.length }, (_, i) => (
                    <span
                      key={i}
                      className="rc-inv-empty"
                      aria-hidden="true"
                      data-wide={g.skills.length + i >= fill(g.skills.length, PHONE_COLS) || undefined}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="rc-inv-detail" aria-live="polite">
            <div className="rc-inv-head">
              <span className="rc-inv-big"><SkillIcon name={picked} /></span>
              <div>
                <p className="rc-inv-name">{picked}</p>
                <p className="rc-inv-group-name">{GROUP_OF.get(picked)}</p>
              </div>
            </div>
            {usedIn.length ? (
              <div className="rc-inv-used">
                <h3 className="rc-inv-label">Used in</h3>
                <div className="rc-inv-links">
                  {usedIn.map((p) => (
                    <a key={p.id} href={`/projects/${p.id}`}>{p.title}</a>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}

// Memoized so a theme toggle, which re-renders Home for its themeClass,
// does not cascade through every section. The scenes subscribe to the theme
// context directly, so they still update.
export const Skills = memo(SkillsImpl);
