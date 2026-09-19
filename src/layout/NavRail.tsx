import { useEffect, useState } from 'react';
import { PixelIcon } from '../components/PixelIcon';
import { useTheme } from '../hooks/useTheme';
import { useIsMobile } from '../hooks/useMediaQuery';
import { PRIMARY_EDGE, logoBorderW, logoFontSize, navStyle, type Route } from '../lib/responsive';

const LINKS = [
  { id: 'home', label: 'HOME', icon: 'ui/home-solid' },
  { id: 'about', label: 'ABOUT', icon: 'ui/user-solid' },
  { id: 'projects', label: 'PROJECTS', icon: 'ui/briefcase-solid' },
  { id: 'skills', label: 'SKILLS', icon: 'ui/bolt-solid' },
  { id: 'contact', label: 'CONTACT', icon: 'ui/envelope-solid' },
] as const;

type Props = {
  route: Route;
  active: number;
  onNavigate?: (index: number) => void;
};

export function NavRail({ route, active, onNavigate }: Props) {
  const isMobile = useIsMobile();
  const { themeIcon, themeLabel, toggleTheme } = useTheme();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  // The prototype force-closes the overlay whenever the breakpoint changes,
  // so a resize to desktop cannot leave an orphaned overlay mounted.
  useEffect(() => setMobileNavOpen(false), [isMobile]);

  const href = (id: string) => (route === 'home' ? `#${id}` : `/#${id}`);
  const click = (index: number) => () => {
    setMobileNavOpen(false);
    onNavigate?.(index);
  };

  const logoW = logoBorderW(isMobile);

  return (
    <>
      <nav style={navStyle(isMobile, route)}>
        <a
          href={href('home')}
          onClick={click(0)}
          className="rc-logo"
          style={{
            display: 'flex', alignItems: 'center', cursor: 'pointer',
            border: `${logoW} solid ${PRIMARY_EDGE}`,
            background: 'var(--color-primary)',
            padding: logoW,
            boxShadow: `var(--shadow-control) ${PRIMARY_EDGE}`,
            transition: 'transform 100ms steps(2,end)',
          }}
        >
          <img
            src="/assets/brand/logo-head.png"
            alt="Ryan Chan"
            style={{
              height: `calc(${logoFontSize(isMobile)} * 2)`,
              width: 'auto',
              imageRendering: 'pixelated',
              display: 'block',
            }}
          />
        </a>

        {isMobile && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              onClick={toggleTheme}
              title="Toggle light / dark"
              style={{
                background: 'none', border: 'none', cursor: 'pointer', padding: '10px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                width: '44px', height: '44px',
              }}
            >
              <PixelIcon name={themeIcon} size={22} color="var(--color-text-muted)" />
            </button>
            <button
              onClick={() => setMobileNavOpen((o) => !o)}
              aria-label="Toggle menu"
              aria-expanded={mobileNavOpen}
              style={{
                background: 'none', border: 'none', cursor: 'pointer', padding: '10px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                width: '44px', height: '44px',
              }}
            >
              <PixelIcon
                name={mobileNavOpen ? 'ui/times-solid' : 'ui/bars-solid'}
                size={24}
                color="var(--color-text)"
              />
            </button>
          </div>
        )}

        {!isMobile && (
          <>
            <div
              style={{
                position: 'relative', width: '100%', marginTop: '28px',
                display: 'flex', flexDirection: 'column',
              }}
            >
              <i
                aria-hidden="true"
                style={{
                  position: 'absolute', left: 0,
                  // Home animates the cursor; the detail page pins it on Projects.
                  ...(route === 'home'
                    ? {
                        top: 0,
                        transform: `translateY(${active * 64}px)`,
                        transition: 'transform 180ms steps(3,end)',
                      }
                    : { top: '128px' }),
                  width: '6px', height: '64px', background: 'var(--color-primary)',
                }}
              />
              {LINKS.map((link, i) => (
                <a
                  key={link.id}
                  href={href(link.id)}
                  onClick={click(i)}
                  className="rc-nav-link"
                  {...(active === i ? { 'aria-current': 'true' as const } : {})}
                  style={{
                    display: 'flex', flexDirection: 'column', alignItems: 'center',
                    justifyContent: 'center', gap: '5px', height: '64px',
                    color: 'var(--color-text-muted)',
                  }}
                >
                  <PixelIcon name={link.icon} size={24} />
                  <span
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: 'var(--fs-13)',
                      letterSpacing: '.04em',
                    }}
                  >
                    {link.label}
                  </span>
                </a>
              ))}
            </div>

            <button
              onClick={toggleTheme}
              title="Toggle light / dark"
              style={{
                marginTop: 'auto', display: 'flex', flexDirection: 'column',
                alignItems: 'center', gap: '8px', background: 'none', border: 'none',
                cursor: 'pointer', padding: '8px 0',
              }}
            >
              <PixelIcon name={themeIcon} size={24} color="var(--color-text-muted)" />
              <span
                style={{
                  fontFamily: 'var(--font-display)', fontSize: 'var(--fs-12)',
                  letterSpacing: '.04em', color: 'var(--color-text-dim)',
                }}
              >
                {themeLabel}
              </span>
            </button>
          </>
        )}
      </nav>

      {mobileNavOpen && (
        <div
          style={{
            position: 'fixed', left: 0, right: 0, top: '64px', bottom: 0,
            background: 'var(--color-surface)', zIndex: 59,
            display: 'flex', flexDirection: 'column', overflowY: 'auto',
          }}
        >
          {LINKS.map((link, i) => (
            <a
              key={link.id}
              href={href(link.id)}
              onClick={click(i)}
              className="rc-nav-link"
              {...(active === i ? { 'aria-current': 'true' as const } : {})}
              style={{
                display: 'flex', alignItems: 'center', gap: '16px', height: '64px',
                padding: '0 24px', color: 'var(--color-text-muted)',
                borderBottom: 'var(--border-thin) solid var(--color-border-light)',
                borderLeft: `var(--border-thick) solid ${active === i ? 'var(--color-primary)' : 'transparent'}`,
              }}
            >
              <PixelIcon name={link.icon} size={24} />
              <span
                style={{
                  fontFamily: 'var(--font-display)', fontSize: 'var(--fs-16)',
                  letterSpacing: '.04em',
                }}
              >
                {link.label}
              </span>
            </a>
          ))}
        </div>
      )}
    </>
  );
}
