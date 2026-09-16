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
} from '../lib/responsive';

function Found({ project, isMobile }: { project: Project; isMobile: boolean }) {
  return (
    <>
      {/* Image region wrapper */}
      <div style={{ padding: contentPadTop(isMobile) }}>
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
              gap: isMobile ? '0' : '8px',
              color: '#000',
              textDecoration: 'none',
              cursor: 'pointer',
              background: 'var(--color-surface)',
            }}
          >
            <PixelIcon name="ui/arrow-left-solid" size={16} />
            {!isMobile && <span style={{ fontSize: '12px', letterSpacing: '.02em' }}>BACK TO PROJECTS</span>}
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
        <div>
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
          <div
            style={{
              flex: 'none',
              display: 'flex',
              gap: '22px',
              alignItems: 'center',
              marginTop: '12px',
            }}
          >
            <span className={`pixel-badge ${project.statusCls}`}>{project.status}</span>
            <span style={{ fontSize: '14px', color: 'var(--color-text-muted)' }}>{project.year}</span>
          </div>
        </div>

        {/* Blurb */}
        <p style={{ fontSize: '16px', lineHeight: '1.65', color: 'var(--color-text-muted)', margin: 0 }}>
          {project.blurb}
        </p>

        {/* Tags */}
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          {project.tags.map((tag) => (
            <TagChip key={tag} name={tag} />
          ))}
        </div>

        {/* PATCH NOTES */}
        <div>
          <div style={{ fontSize: '18px', display: 'block', color: 'var(--color-accent-text)', marginBottom: '16px' }}>
            PATCH NOTES
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
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
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginTop: '8px' }}>
          <a
            {...(project.ctaUrl
              ? { href: project.ctaUrl, target: '_blank', rel: 'noopener noreferrer' }
              : { href: '#', onClick: (e: React.MouseEvent) => e.preventDefault() })}
            className="pixel-btn"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 16px',
              border: `4px solid var(--color-border)`,
              boxShadow: 'var(--shadow-pixel)',
              background: 'var(--color-primary)',
              color: '#000',
              textDecoration: 'none',
              cursor: 'pointer',
            }}
          >
            <PixelIcon name="ui/external-link-solid" size={18} color="#000" />
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
              color: 'var(--color-text-muted)',
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
        padding: notFoundPad(isMobile),
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
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '8px 14px',
          color: 'var(--color-text-muted)',
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
