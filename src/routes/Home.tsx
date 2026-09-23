import { StrictMode, useCallback, useRef } from 'react';
import { NavRail } from '../layout/NavRail';
import { About } from '../sections/About';
import { Contact } from '../sections/Contact';
import { Hero } from '../sections/Hero';
import { Projects } from '../sections/Projects';
import { Skills } from '../sections/Skills';
import type { Project } from '../content/projects';
import { useScrollSpy } from '../hooks/useScrollSpy';
import { ThemeProvider, useTheme } from '../hooks/useTheme';

export function Home({ projects }: { projects: Project[] }) {
  const { themeClass } = useTheme();
  const rootRef = useRef<HTMLDivElement>(null);
  const { active, jumpTo } = useScrollSpy(rootRef);
  // Stable, or Hero's memo is defeated by a fresh arrow on every render.
  const toAbout = useCallback(() => jumpTo(1), [jumpTo]);

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
        <Skills />
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
      <ThemeProvider><Home projects={projects} /></ThemeProvider>
    </StrictMode>
  );
}
