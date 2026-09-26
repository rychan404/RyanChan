import { PixelIcon } from '../components/PixelIcon';
import { CONTACT_EMAIL } from '../lib/contact';
import { DitherFade } from './DitherFade';

/** Email, then the socials: the footer's icons and the Contact section's slots. */
export const SOCIALS = [
  { title: 'Email', href: `mailto:${CONTACT_EMAIL}`, icon: 'ui/envelope-solid' },
  { title: 'LinkedIn', href: 'https://www.linkedin.com/in/ryanchan404/', icon: 'brands/linkedin' },
  { title: 'GitHub', href: 'https://github.com/rychan404', icon: 'brands/github' },
  { title: 'YouTube', href: 'https://www.youtube.com/@rychan404', icon: 'brands/youtube' },
] as const;

/** marginTop is '80px' below the Contact section and 'auto' on the detail
 *  page, where it pins the footer to the bottom of a short page. */
export function Footer({ marginTop }: { marginTop: '80px' | 'auto' }) {
  return (
    <div style={{ marginTop, background: 'var(--color-surface)' }}>
      <DitherFade ink="var(--color-bg)" height={64} />
      <div
        className="rc-footer-bar"
        style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          gap: '16px', flexWrap: 'wrap',
          fontFamily: 'var(--font-display)', fontSize: 'var(--fs-15)',
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
