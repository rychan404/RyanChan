import { memo, useState } from 'react';
import { PixelIcon } from '../components/PixelIcon';
import { ProjectCard } from '../components/ProjectCard';
import {
  DEFAULT_FILTER, FILTER_LABELS, filterProjects, type Filter, type Project, type ProjectKind,
} from '../content/projects';
import { useIsMobile } from '../hooks/useMediaQuery';
import { DitherFade } from '../layout/DitherFade';

const FILTERS: Filter[] = ['all', 'code', 'video', 'misc'];

/** Roster portrait icon per kind; the tile tints live in patterns.css. */
const KIND_ICON: Record<ProjectKind, string> = {
  code: 'ui/code-solid',
  video: 'ui/video-camera-solid',
  misc: 'ui/seedlings-solid',
};

const DROPDOWN_ITEM = {
  textAlign: 'left' as const, padding: '12px 24px', background: 'none',
  border: 'none', cursor: 'pointer', fontFamily: 'var(--font-display)',
  fontSize: 'var(--fs-16)', textTransform: 'uppercase' as const, letterSpacing: '.5px',
  color: 'var(--color-text)',
};

function ProjectsImpl({ projects }: { projects: Project[] }) {
  const isMobile = useIsMobile();
  const [filter, setFilter] = useState<Filter>(DEFAULT_FILTER);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const visible = filterProjects(projects, filter);
  // Derived, not synced: a filter that hides the pick falls back to the first tile.
  const selected = visible.find((p) => p.id === selectedId) ?? visible[0];

  const select = (f: Filter) => () => {
    setFilter(f);
    setDropdownOpen(false);
  };

  return (
    <section
      id="projects"
      className="rc-section"
      style={{ position: 'relative', background: 'var(--color-bg)', order: 2 }}
    >
      <DitherFade ink="var(--color-surface)" />
      <div className="rc-section-inner">
        <h2 className="rc-section-title">
          Projects
        </h2>
        <p className="rc-section-lede">
          Things I love to tinker with<br />
        </p>

        {isMobile ? (
          <div style={{ position: 'relative', margin: '40px 0 40px', maxWidth: '220px' }}>
            <button
              onClick={() => setDropdownOpen((o) => !o)}
              aria-expanded={dropdownOpen}
              style={{
                width: '100%', display: 'flex', alignItems: 'center',
                justifyContent: 'space-between', gap: '12px',
                fontFamily: 'var(--font-display)', fontSize: 'var(--fs-16)',
                textTransform: 'uppercase', letterSpacing: '.5px',
                color: 'var(--color-text)', background: 'var(--color-surface)',
                border: 'var(--border-thick) solid var(--color-border)', padding: '12px 24px',
                cursor: 'pointer', lineHeight: '1.2',
              }}
            >
              <span>{FILTER_LABELS[filter]}</span>
              <PixelIcon name="ui/chevron-down-solid" size={14} color="var(--color-text)" />
            </button>
            {dropdownOpen && (
              <div
                style={{
                  position: 'absolute', left: 0, right: 0, top: 'calc(100% + 6px)',
                  background: 'var(--color-surface)',
                  border: 'var(--border-thick) solid var(--color-border)',
                  boxShadow: 'var(--shadow-card) var(--color-border)',
                  zIndex: 20, display: 'flex', flexDirection: 'column',
                }}
              >
                {FILTERS.map((f) => (
                  <button key={f} onClick={select(f)} className="rc-filter-option" style={DROPDOWN_ITEM}>
                    {FILTER_LABELS[f]}
                  </button>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="pixel-tabs" style={{ margin: '40px 0 40px', borderBottomColor: 'var(--color-border-light)' }}>
            {FILTERS.map((f) => (
              <button
                key={f}
                onClick={select(f)}
                className={filter === f ? 'pixel-tab pixel-tab--active' : 'pixel-tab'}
              >
                {FILTER_LABELS[f]}
              </button>
            ))}
          </div>
        )}

        <div className="rc-roster">
          <div aria-live="polite">
            {selected && <ProjectCard project={selected} />}
          </div>
          <div className="rc-roster-grid" role="group" aria-label="Project list">
            {visible.map((p) => (
              <button
                key={p.id}
                type="button"
                className={`rc-roster-tile rc-roster-tile--${p.kind}`}
                aria-pressed={p === selected}
                onClick={() => setSelectedId(p.id)}
              >
                <span className="rc-roster-portrait">
                  {p.image
                    ? <img src={p.image} alt="" />
                    : <PixelIcon name={KIND_ICON[p.kind]} size={40} />}
                  <DitherFade ink="var(--tile-bar)" height={32} className="dither-fade--up rc-media-fade" />
                </span>
                <span className="rc-roster-name">{p.title}</span>
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
export const Projects = memo(ProjectsImpl);
