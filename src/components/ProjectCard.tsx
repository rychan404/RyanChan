import type { Project } from '../content/projects';
import { tagIcon } from '../content/tags';
import { ImageSlot } from './ImageSlot';
import { DitherFade } from '../layout/DitherFade';
import { SkillIcon } from './SkillIcon';

export function ProjectCard({ project }: { project: Project }) {
  // Skill-slot tags; tags without a logo (Piano, YouTube…) are left out.
  const tools = project.tags.filter(tagIcon);
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
        className="rc-card-media"
        style={{
          position: 'relative',
          background: 'var(--color-bg-alt)',
        }}
      >
        <ImageSlot placeholder={project.slotHint} src={project.image} alt={project.title} />
        <DitherFade ink="var(--color-surface)" height={64} className="dither-fade--up rc-media-fade" />
      </div>

      <div style={{ padding: '20px 20px 24px', display: 'flex', flexDirection: 'column', gap: '12px', flex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '16px' }}>
          <h3 className="rc-card-title" style={{ color: 'var(--color-text)' }}>{project.title}</h3>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--fs-15)', color: 'var(--color-text-dim)', flex: 'none' }}>
            {project.year}
          </span>
        </div>

        <p className="rc-card-blurb" style={{ lineHeight: '1.65', color: 'var(--color-text-muted)', margin: 0, flex: 1 }}>
          {project.blurb}
        </p>

        {tools.length ? (
          <div className="rc-tag-slots">
            {tools.map((t) => (
              <span key={t} className="rc-tag"><SkillIcon name={t} />{t}</span>
            ))}
          </div>
        ) : null}
      </div>
    </a>
  );
}
