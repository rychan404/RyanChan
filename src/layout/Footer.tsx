import { PixelIcon } from '../components/PixelIcon';
import { useIsMobile } from '../hooks/useMediaQuery';
import { footerPad } from '../lib/responsive';
import { DitherFade } from './DitherFade';

const SOCIALS = [
  { title: 'LinkedIn', href: 'https://linkedin.com', icon: 'brands/linkedin' },
  { title: 'GitHub', href: 'https://github.com', icon: 'brands/github' },
  { title: 'YouTube', href: 'https://youtube.com', icon: 'brands/youtube' },
] as const;

/** marginTop is '80px' below the Contact section and 'auto' on the detail
 *  page, where it pins the footer to the bottom of a short page. */
export function Footer({ marginTop }: { marginTop: '80px' | 'auto' }) {
  const isMobile = useIsMobile();
  return (
    <div style={{ marginTop, background: 'var(--color-surface)' }}>
      <DitherFade ink="var(--color-bg)" height={64} />
      <div
        style={{
          padding: footerPad(isMobile),
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          gap: '16px', flexWrap: 'wrap',
          fontFamily: 'var(--font-display)', fontSize: '15px',
          letterSpacing: '.05em', color: 'var(--color-text-dim)',
        }}
      >
        <span>© 2026 RYAN CHAN</span>
        <div style={{ display: 'flex', gap: '20px' }}>
          {SOCIALS.map((s) => (
            <a
              key={s.title}
              href={s.href}
              title={s.title}
              className="rc-footer-link"
              style={{ color: 'var(--color-text-dim)' }}
            >
              <PixelIcon name={s.icon} size={24} />
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
