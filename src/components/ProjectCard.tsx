import { useNavigate } from 'react-router-dom';
import type { Project } from '../content/projects';
import { ImageSlot } from './ImageSlot';
import { TagChip } from './TagChip';

const CARD_EDGE =
  'var(--px-edge, hsl(from var(--color-surface) calc(h + 36) calc(s * 1.15) calc(l * 0.3)))';
const IMAGE_EDGE =
  'var(--px-edge, hsl(from var(--color-bg-alt) calc(h + 36) calc(s * 1.15) calc(l * 0.3)))';

export function ProjectCard({ project }: { project: Project }) {
  const navigate = useNavigate();
  const open = () => navigate(`/projects/${project.id}`);

  return (
    <div
      role="link"
      tabIndex={0}
      onClick={open}
      onKeyDown={(e) => {
        if (e.key === 'Enter') open();
      }}
      className="pixel-card rc-project-card"
      style={{
        padding: 0, cursor: 'pointer', display: 'flex', flexDirection: 'column',
        transition: 'transform 120ms steps(2,end),box-shadow 120ms steps(2,end)',
        '--color-border': CARD_EDGE,
        '--shadow-pixel': `2px 2px 0 ${CARD_EDGE}`,
      } as React.CSSProperties}
    >
      <div
        style={{
          position: 'relative', height: '190px',
          borderBottom: `4px solid ${IMAGE_EDGE}`,
          background: 'var(--color-bg-alt)',
        }}
      >
        <ImageSlot placeholder={project.slotHint} src={project.image} alt={project.title} />
      </div>

      <div style={{ padding: '20px 20px 24px', display: 'flex', flexDirection: 'column', gap: '12px', flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: '12px' }}>
          <h3 style={{ fontSize: '26px', color: 'var(--color-text)' }}>{project.title}</h3>
          <span style={{ display: 'flex', alignItems: 'center', gap: '14px', flex: 'none' }}>
            <span
              className={project.statusCls ? `pixel-badge ${project.statusCls}` : 'pixel-badge'}
              style={{ fontSize: '11px', padding: '3px 7px' }}
            >
              {project.status}
            </span>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '15px', color: 'var(--color-text-dim)' }}>
              {project.year}
            </span>
          </span>
        </div>

        <p style={{ fontSize: '16px', lineHeight: '1.65', color: 'var(--color-text-muted)', margin: 0, flex: 1 }}>
          {project.blurb}
        </p>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {project.tags.map((t) => (
            <TagChip key={t} name={t} />
          ))}
        </div>
      </div>
    </div>
  );
}
