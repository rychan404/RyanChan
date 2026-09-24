import { PixelIcon } from '../components/PixelIcon';
import { useTheme } from '../hooks/useTheme';

/** Sections 1-4; the portrait is section 0, home. */
const LINKS = [
  { id: 'about', label: 'ABOUT', icon: 'ui/user-solid' },
  { id: 'projects', label: 'PROJECTS', icon: 'ui/briefcase-solid' },
  { id: 'skills', label: 'SKILLS', icon: 'ui/bolt-solid' },
  { id: 'contact', label: 'CONTACT', icon: 'ui/envelope-solid' },
] as const;

type Props = {
  route: 'home' | 'detail';
  active: number;
  onNavigate?: (index: number) => void;
};

/** The hotbar, slim: one black frame of icon cells, the headshot as the first
 *  cell and the way home, an XP strip riding the frame's top edge (--xp, written by
 *  useScrollSpy), each cell's name under its icon, and a selector on the
 *  current section. One markup at every width. */
export function NavRail({ route, active, onNavigate }: Props) {
  const { themeIcon, toggleTheme } = useTheme();
  const href = (id: string) => (route === 'home' ? `#${id}` : `/#${id}`);

  return (
    <nav className="rc-hotbar">
      <div className="rc-hotbar-links">
        <div aria-hidden="true" className="rc-xp"><span className="rc-xp-fill" /></div>
        <a
          href={href('home')}
          onClick={() => onNavigate?.(0)}
          className="rc-portrait"
          {...(active === 0 ? { 'aria-current': 'true' as const } : {})}
        >
          <img src="/assets/brand/logo-head.png" alt="Ryan Chan" />
        </a>
        {LINKS.map((link, i) => (
          <a
            key={link.id}
            href={href(link.id)}
            onClick={() => onNavigate?.(i + 1)}
            aria-label={link.label}
            className="rc-slot rc-nav-link"
            {...(active === i + 1 ? { 'aria-current': 'true' as const } : {})}
          >
            <PixelIcon name={link.icon} size={22} />
            <span aria-hidden="true" className="rc-slot-label">{link.label}</span>
          </a>
        ))}
      </div>

      <span aria-hidden="true" className="rc-hotbar-divider" />
      <button onClick={toggleTheme} title="Toggle light / dark" aria-label="Toggle light / dark" className="rc-theme">
        <PixelIcon name={themeIcon} size={16} />
      </button>
    </nav>
  );
}
