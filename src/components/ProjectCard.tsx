import type { Project } from '../content/projects';
import { ImageSlot } from './ImageSlot';
import { TagChip } from './TagChip';

export function ProjectCard({ project }: { project: Project }) {
  return (
    <a
      href={`/projects/${project.id}`}
      className="pixel-card rc-project-card"
      style={{
        padding: 0, cursor: 'pointer', display: 'flex', flexDirection: 'column',
        transition: 'transform 120ms steps(2,end),box-shadow 120ms steps(2,end)',
        color: 'inherit', textDecoration: 'none',
        '--color-border': 'var(--edge-on-surface)',
      } as React.CSSProperties}
    >
      <div
        style={{
          position: 'relative', height: '190px',
          borderBottom: 'var(--border-thick) solid var(--edge-on-bg-alt)',
          background: 'var(--color-bg-alt)',
        }}
      >
        <ImageSlot placeholder={project.slotHint} src={project.image} alt={project.title} />
      </div>

      <div style={{ padding: '20px 20px 24px', display: 'flex', flexDirection: 'column', gap: '12px', flex: 1 }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '8px' }}>
          <h3 style={{ fontSize: 'var(--fs-26)', color: 'var(--color-text)' }}>{project.title}</h3>
          <span style={{ display: 'flex', alignItems: 'center', gap: '14px', flex: 'none' }}>
            <span
              className={project.statusCls ? `pixel-badge rc-card-status ${project.statusCls}` : 'pixel-badge rc-card-status'}
            >
              {project.status}
            </span>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--fs-15)', color: 'var(--color-text-dim)' }}>
              {project.year}
            </span>
          </span>
        </div>

        <p style={{ fontSize: 'var(--fs-16)', lineHeight: '1.65', color: 'var(--color-text-muted)', margin: 0, flex: 1 }}>
          {project.blurb}
        </p>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {project.tags.map((t) => (
            <TagChip key={t} name={t} />
          ))}
        </div>
      </div>
    </a>
  );
}
