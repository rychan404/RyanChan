import { StrictMode, type ReactNode } from 'react';
import { NavRail } from '../layout/NavRail';
import { Footer } from '../layout/Footer';
import { ImageSlot } from '../components/ImageSlot';
import { PixelIcon } from '../components/PixelIcon';
import { KIND_ICON, type LinkKind, type Project } from '../content/projects';
import { ThemeProvider, useTheme } from '../hooks/useTheme';

/** The project's link buttons, in this order. The first one a project has is
 *  the green primary; the rest share the back link's secondary style. */
const LINKS: { kind: LinkKind; label: string; icon: string }[] = [
  { kind: 'site', label: 'LIVE SITE', icon: 'ui/globe-solid' },
  { kind: 'github', label: 'GITHUB', icon: 'brands/github' },
  { kind: 'video', label: 'WATCH VIDEO', icon: 'ui/play-solid' },
  { kind: 'slides', label: 'SLIDES', icon: 'ui/chart-line-solid' },
  { kind: 'devpost', label: 'DEVPOST', icon: 'ui/trophy-solid' },
];

/** A neighbouring project, as the previous / next cards draw it. */
type Neighbour = Pick<Project, 'id' | 'title'>;

function NeighbourLink({ to, rel }: { to: Neighbour; rel: 'prev' | 'next' }) {
  const arrow = (
    <PixelIcon name="ui/arrow-left-solid" size={16} className="rc-detail-arrow" style={rel === 'next' ? { transform: 'scaleX(-1)' } : undefined} />
  );
  return (
    <a href={`/projects/${to.id}`} rel={rel} className="rc-detail-link">
      {rel === 'prev' ? arrow : null}
      <span className="rc-detail-link-text">
        <span className="rc-detail-link-dir">{rel === 'prev' ? 'Previous' : 'Next'}</span>
        <span className="rc-detail-link-name">{to.title}</span>
      </span>
      {rel === 'next' ? arrow : null}
    </a>
  );
}

function Found({ project, prev, next, children }: { project: Project; prev?: Neighbour; next?: Neighbour; children: ReactNode }) {
  const links = LINKS.filter((l) => project.links?.[l.kind]);
  return (
    <>
      {/* Image region wrapper */}
      <div className="rc-detail-top" style={{ maxWidth: '860px', margin: '0 auto', width: '100%' }}>
        <div
          style={{
            position: 'relative',
            height: 'min(40vw,380px)',
            minHeight: '220px',
            background: 'var(--color-bg-alt)',
            border: 'var(--border-thick) solid var(--edge-on-surface)',
          }}
        >
          <ImageSlot icon={KIND_ICON[project.kind]} src={project.image} alt={project.title} />
        </div>
      </div>

      {/* Body wrapper */}
      <div
        className="rc-detail-body"
        style={{
          maxWidth: '860px',
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '28px',
        }}
      >
        {/* Title row */}
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
          <h1
            className="rc-detail-title"
            style={{
              fontSize: 'var(--fs-detail-title)',
              letterSpacing: '.02em',
              color: 'var(--color-heading)',
              margin: '4px 0 0',
            }}
          >
            {project.title}
          </h1>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--fs-15)', color: 'var(--color-text-dim)' }}>{project.year}</span>
        </div>

        {/* Blurb */}
        <p style={{ fontSize: 'var(--fs-19)', lineHeight: '1.7', color: 'var(--color-text)', margin: 0 }}>
          {project.blurb}
        </p>

        <dl className="rc-detail-stats">
          <div className="rc-stat"><dt>Role</dt><dd>{project.role}</dd></div>
          <div className="rc-stat"><dt>Stack</dt><dd>{project.tags.join(', ')}</dd></div>
          {project.outcome ? <div className="rc-stat rc-stat-outcome"><dt>Outcome</dt><dd>{project.outcome}</dd></div> : null}
        </dl>

        {/* PATCH NOTES */}
        <div>
          <div style={{ fontSize: 'var(--fs-18)', display: 'block', color: 'var(--color-accent-text)', marginBottom: '12px', fontFamily: 'var(--font-display)', letterSpacing: '.05em' }}>
            PATCH NOTES
          </div>
          <div className="rc-patch-notes">{children}</div>
        </div>

        {/* Link buttons; the nav rail's PROJECTS is the way back */}
        {links.length ? (
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginTop: '8px', flexWrap: 'wrap' }}>
            {links.map((l, i) => (
              <a
                key={l.kind}
                href={project.links![l.kind]}
                target="_blank"
                rel="noopener noreferrer"
                className={i === 0 ? 'pixel-btn rc-link-primary' : 'rc-pixel-back'}
                style={{ padding: '16px 24px' }}
              >
                <PixelIcon name={l.icon} size={18} />
                {l.label}
              </a>
            ))}
          </div>
        ) : null}

        {prev && next ? (
          <nav className="rc-detail-nav" aria-label="More projects">
            <NeighbourLink to={prev} rel="prev" />
            <NeighbourLink to={next} rel="next" />
          </nav>
        ) : null}
      </div>
    </>
  );
}

function NotFound() {
  return (
    <div
      className="rc-notfound"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '60vh',
        gap: '16px',
      }}
    >
      <h1
        className="rc-detail-title"
        style={{
          fontSize: 'var(--fs-notfound-title)',
          color: 'var(--color-heading)',
          margin: '0',
          textAlign: 'center',
        }}
      >
        Not Found
      </h1>
      <p style={{ fontSize: 'var(--fs-18)', color: 'var(--color-text-muted)', margin: 0, textAlign: 'center' }}>
        That project doesn't exist.
      </p>
      <a
        href="/#projects"
        className="rc-pixel-back"
        style={{ padding: '8px 14px', marginTop: '8px' }}
      >
        <PixelIcon name="ui/arrow-left-solid" size={16} />
        BACK TO PROJECTS
      </a>
    </div>
  );
}

export type Props = { project?: Project; prev?: Neighbour; next?: Neighbour; children?: ReactNode };

export function ProjectDetail({ project, prev, next, children }: Props): JSX.Element {
  const { themeClass } = useTheme();

  return (
    <div
      className={themeClass}
      style={{
        background: 'var(--color-bg)',
        color: 'var(--color-text)',
        fontFamily: 'var(--font-body)',
        minHeight: '100vh',
        position: 'relative',
      }}
    >
      <NavRail route="detail" active={2} />
      <div className="rc-main rc-page-dissolve" style={{ minHeight: '100vh' }}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          {project ? <Found project={project} prev={prev} next={next}>{children}</Found> : <NotFound />}
        </div>
        <Footer marginTop="auto" />
      </div>
    </div>
  );
}

/** What the Astro page mounts; `children` is the Astro-rendered MDX body. */
export function ProjectDetailIsland(props: Props) {
  return (
    <StrictMode>
      <ThemeProvider><ProjectDetail {...props} /></ThemeProvider>
    </StrictMode>
  );
}
