import { StrictMode, useCallback, useEffect, useRef } from 'react';
import { NavRail } from '../layout/NavRail';
import { About } from '../sections/About';
import { Contact } from '../sections/Contact';
import { Hero } from '../sections/Hero';
import { Projects } from '../sections/Projects';
import { Skills } from '../sections/Skills';
import type { Project } from '../content/projects';
import { useScrollSpy } from '../hooks/useScrollSpy';
import { ThemeProvider, useTheme } from '../hooks/useTheme';
import { prefersReducedMotion } from '../lib/motion';

/** The blocks that dissolve in: each section's heading, lede and tabs, and the panels of its layout. */
const DISSOLVE = ['.rc-section-title', '.rc-section-lede', '.pixel-tabs', '.rc-roster > *', '.rc-about > *', '.rc-inv > *', '.rc-grid-contact > *']
  .map((s) => `.rc-main > section:not(#home) ${s}`).join(',');

export function Home({ projects }: { projects: Project[] }) {
  const { themeClass } = useTheme();
  const rootRef = useRef<HTMLDivElement>(null);
  const { active, jumpTo } = useScrollSpy(rootRef);
  // Stable, or Hero's memo is defeated by a fresh arrow on every render.
  const toAbout = useCallback(() => jumpTo(1), [jumpTo]);

  // The dither dissolve (patterns.css): a block dissolves in through the dither steps as it
  // rises past the trigger line (the observer's -10% margin), and back out as it sinks below
  // it again; blocks arriving together go one after another (--i). Leaving off the top
  // changes nothing. Blocks already past the line on load start shown, the rest armed
  // (hidden); both after hydration, so without JS (or with reduced motion) everything shows.
  useEffect(() => {
    if (prefersReducedMotion() || typeof IntersectionObserver === 'undefined') return;
    const io = new IntersectionObserver((entries) => {
      let i = 0;
      for (const e of entries) {
        const el = e.target as HTMLElement;
        if (e.isIntersecting) {
          if (!el.dataset.dissolve) continue; // shown on load, never left
          el.style.setProperty('--i', String(i++));
          el.dataset.dissolve = 'in';
        } else if (e.boundingClientRect.top > e.rootBounds!.bottom && el.dataset.dissolve !== 'armed') {
          el.dataset.dissolve = 'out';
        }
      }
    }, { rootMargin: '0px 0px -10% 0px' });
    for (const el of rootRef.current!.querySelectorAll<HTMLElement>(DISSOLVE)) {
      if (el.getBoundingClientRect().top >= window.innerHeight * 0.9) el.dataset.dissolve = 'armed';
      io.observe(el);
    }
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={rootRef}
      className={themeClass}
      style={{
        '--section-pad-x': 'max(clamp(20px,10vw,240px),calc((100% - var(--container-max)) / 2))',
        background: 'var(--color-bg)',
        color: 'var(--color-text)',
        fontFamily: 'var(--font-body)',
        minHeight: '100vh',
        position: 'relative',
        overflowX: 'hidden',
      } as React.CSSProperties}
    >
      <NavRail route="home" active={active} onNavigate={jumpTo} />

      {/* DOM order is Home, Projects, About, Skills, Contact; each section
          carries its own CSS `order` so the flex column renders them as
          Home, About, Projects, Skills, Contact. Both halves of that are
          load-bearing — see spec section 4.1. */}
      <main className="rc-main">
        <Hero onNavigate={toAbout} />
        <Projects projects={projects} />
        <About />
        <Skills projects={projects} />
        <Contact />
      </main>
    </div>
  );
}

/** What the Astro page mounts. The provider lives inside the island, because
 *  React context does not cross an island boundary. */
export function HomeIsland({ projects }: { projects: Project[] }) {
  return (
    <StrictMode>
      <ThemeProvider intro><Home projects={projects} /></ThemeProvider>
    </StrictMode>
  );
}
