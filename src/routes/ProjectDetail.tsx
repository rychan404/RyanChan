import { useParams } from 'react-router-dom';
import { NavRail } from '../layout/NavRail';
import { Footer } from '../layout/Footer';
import { ImageSlot } from '../components/ImageSlot';
import { TagChip } from '../components/TagChip';
import { PixelIcon } from '../components/PixelIcon';
import { findProject, type Project } from '../content/projects';
import { useIsMobile } from '../hooks/useMediaQuery';
import { useTheme } from '../hooks/useTheme';
import {
  mainStyle,
  contentPadTop,
  contentPadBody,
  backBtnPad,
  detailHeadingShadow,
  notFoundPad,
  PX_EDGE_SURFACE,
  PRIMARY_EDGE,
} from '../lib/responsive';

function Found({ project, isMobile }: { project: Project; isMobile: boolean }) {
  return (
    <>
      {/* Image region wrapper */}
      <div style={{ maxWidth: '860px', margin: '0 auto', width: '100%', padding: contentPadTop(isMobile) }}>
        <div
          style={{
            position: 'relative',
            height: 'min(40vw,380px)',
            minHeight: '220px',
            background: 'var(--color-bg-alt)',
            border: `4px solid ${PX_EDGE_SURFACE}`,
          }}
        >
          <ImageSlot placeholder={project.slotHint} src={project.image} alt={project.title} />
          <a
            href="/#projects"
            className="rc-pixel-back"
            style={{
              position: 'absolute',
              left: '16px',
              top: '16px',
              border: '4px solid #000',
              boxShadow: '3px 3px 0 #000',
              padding: backBtnPad(isMobile),
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              color: 'var(--color-text)',
              textDecoration: 'none',
              cursor: 'pointer',
              background: 'var(--color-surface)',
              fontFamily: 'var(--font-display)',
              fontSize: '15px',
              letterSpacing: '.05em',
            }}
          >
            <PixelIcon name="ui/arrow-left-solid" size={16} />
            {!isMobile && 'BACK TO PROJECTS'}
          </a>
        </div>
      </div>

      {/* Body wrapper */}
      <div
        style={{
          maxWidth: '860px',
          margin: '0 auto',
          padding: contentPadBody(isMobile),
          display: 'flex',
          flexDirection: 'column',
          gap: '28px',
        }}
      >
        {/* Title row */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
          <h1
            style={{
              fontSize: 'clamp(34px,5vw,58px)',
              letterSpacing: '.02em',
              color: '#A9BF6D',
              textShadow: detailHeadingShadow(isMobile),
              margin: '4px 0 0',
            }}
          >
            {project.title}
          </h1>
          <span style={{ display: 'flex', alignItems: 'center', gap: '22px', flex: 'none' }}>
            <span className={`pixel-badge ${project.statusCls}`}>{project.status}</span>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '15px', color: 'var(--color-text-dim)' }}>{project.year}</span>
          </span>
        </div>

        {/* Blurb */}
        <p style={{ fontSize: '19px', lineHeight: '1.7', color: 'var(--color-text)', margin: 0 }}>
          {project.blurb}
        </p>

        {/* Tags */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {project.tags.map((tag) => (
            <TagChip key={tag} name={tag} />
          ))}
        </div>

        {/* PATCH NOTES */}
        <div>
          <div style={{ fontSize: '18px', display: 'block', color: 'var(--color-accent-text)', marginBottom: '12px', fontFamily: 'var(--font-display)', letterSpacing: '.05em' }}>
            PATCH NOTES
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {project.notes.map((n, i) =>
              typeof n === 'string' ? (
                <div key={i} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                  <i style={{ width: '10px', height: '10px', background: 'var(--color-primary)', marginTop: '8px', flexShrink: 0 }} />
                  <span style={{ fontSize: '16px', lineHeight: '1.65', color: 'var(--color-text-muted)' }}>{n}</span>
                </div>
              ) : (
                <p key={i} style={{ fontSize: '16px', lineHeight: '1.75', color: 'var(--color-text-muted)', margin: 0 }}>{n.p}</p>
              ),
            )}
          </div>
        </div>

        {/* CTA row */}
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginTop: '8px', flexWrap: 'wrap' }}>
          <a
            {...(project.ctaUrl
              ? { href: project.ctaUrl, target: '_blank', rel: 'noopener noreferrer' }
              : { href: '#', onClick: (e: React.MouseEvent) => e.preventDefault() })}
            className="pixel-btn"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              '--color-border': PRIMARY_EDGE,
              '--shadow-pixel': `2px 2px 0 ${PRIMARY_EDGE}`,
              textDecoration: 'none',
              cursor: 'pointer',
            } as React.CSSProperties}
          >
            <PixelIcon name="ui/external-link-solid" size={18} />
            {project.cta}
          </a>
          <a
            href="/#projects"
            className="rc-pixel-back"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '16px 24px',
              fontFamily: 'var(--font-display)',
              fontSize: '15px',
              letterSpacing: '.05em',
              color: 'var(--color-text)',
              background: 'var(--color-surface)',
              border: '4px solid #000',
              boxShadow: '3px 3px 0 #000',
              textDecoration: 'none',
              cursor: 'pointer',
            }}
          >
            <PixelIcon name="ui/arrow-left-solid" size={16} />
            EXPLORE MORE
          </a>
        </div>
      </div>
    </>
  );
}

function NotFound({ isMobile }: { isMobile: boolean }) {
  return (
    <div
      style={{
        padding: `0 ${notFoundPad(isMobile)}`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '60vh',
        gap: '16px',
      }}
    >
      <h1
        style={{
          fontSize: 'clamp(32px,5vw,52px)',
          color: '#A9BF6D',
          textShadow: detailHeadingShadow(isMobile),
          margin: '0',
          textAlign: 'center',
        }}
      >
        Not Found
      </h1>
      <p style={{ fontSize: '18px', color: 'var(--color-text-muted)', margin: 0, textAlign: 'center' }}>
        That project doesn't exist.
      </p>
      <a
        href="/#projects"
        className="rc-pixel-back"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '8px 14px',
          fontFamily: 'var(--font-display)',
          fontSize: '15px',
          letterSpacing: '.05em',
          color: 'var(--color-text)',
          background: 'var(--color-surface)',
          border: '4px solid #000',
          boxShadow: '3px 3px 0 #000',
          textDecoration: 'none',
          cursor: 'pointer',
          marginTop: '8px',
        }}
      >
        <PixelIcon name="ui/arrow-left-solid" size={16} />
        BACK TO PROJECTS
      </a>
    </div>
  );
}

export function ProjectDetail(): JSX.Element {
  const { id = '' } = useParams();
  const project = findProject(id);
  const isMobile = useIsMobile();
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
      <div style={mainStyle(isMobile, 'detail')}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          {project ? <Found project={project} isMobile={isMobile} /> : <NotFound isMobile={isMobile} />}
        </div>
        <Footer marginTop="auto" />
      </div>
    </div>
  );
}
