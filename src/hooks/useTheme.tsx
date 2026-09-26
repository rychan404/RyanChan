import {
  createContext, useCallback, useContext, useEffect, useLayoutEffect, useMemo, useRef, useState,
  type CSSProperties, type ReactNode,
} from 'react';
import { prefersReducedMotion } from '../lib/motion';
import {
  INTRO_DELAY, TAPE_DUR, THEME_KEY, type Theme, type TransPhase,
  groupStyle as pureGroup, introStartTheme,
  moonGlowStyle as pureMoonGlow, themeClass as pureClass,
} from '../lib/theme';

type ThemeValue = {
  theme: Theme;
  isDark: boolean;
  transPhase: TransPhase;
  sceneFrom: Theme | null;
  toggleTheme: () => void;
  themeClass: string;
  groupStyle: (isLightGroup: boolean) => CSSProperties;
  moonGlowStyle: CSSProperties;
  themeIcon: string;
  themeLabel: string;
};

const Ctx = createContext<ThemeValue | null>(null);

/** null means nothing picked yet. Blocked storage reads as dark. */
function readStoredTheme(): Theme | null {
  try {
    const stored = localStorage.getItem(THEME_KEY);
    return stored === 'light' || stored === 'dark' ? stored : null;
  } catch {
    return 'dark';
  }
}

const systemTheme = (): Theme =>
  window.matchMedia?.('(prefers-color-scheme: light)').matches ? 'light' : 'dark';

// useLayoutEffect warns in a server render; on the client it runs before paint.
const useIsoLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect;

/** intro: every load, play the tape from the opposite theme into the reader's
 *  own — the stored pick, else the OS theme. */
export function ThemeProvider({ children, intro = false }: { children: ReactNode; intro?: boolean }) {
  const [theme, setTheme] = useState<Theme>('dark');
  const [transPhase, setTransPhase] = useState<TransPhase>('idle');
  const [sceneFrom, setSceneFrom] = useState<Theme | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout>>();
  const introPending = useRef(false);

  // Start dark on both sides so hydration matches the server HTML, then apply
  // the real start theme before first paint. Until then the boot script's
  // theme-light on <html> keeps the tokens right. React owns the class on the
  // app root from here on, so drop the boot copy.
  useIsoLayoutEffect(() => {
    const target = readStoredTheme() ?? (intro ? systemTheme() : 'dark');
    const reduced = prefersReducedMotion();
    introPending.current = intro && !reduced;
    setTheme(intro ? introStartTheme(target, reduced) : target);
    document.documentElement.classList.remove('theme-light');
  }, []);

  useEffect(() => () => clearTimeout(timer.current), []);

  const tape = useCallback((persist: boolean) => {
    // Guard: a double-toggle mid-tape strands a scene layer off-screen.
    setTransPhase((phase) => {
      if (phase !== 'idle') return phase;
      setTheme((current) => {
        setSceneFrom(current);
        const next: Theme = current === 'dark' ? 'light' : 'dark';
        if (persist) {
          try {
            localStorage.setItem(THEME_KEY, next);
          } catch {
            /* private mode: the toggle still works, it just does not persist */
          }
        }
        return next;
      });
      timer.current = setTimeout(() => setTransPhase('idle'), TAPE_DUR);
      return 'moving';
    });
  }, []);

  // A reader who toggles before the intro fires has picked; the intro stands down.
  const toggleTheme = useCallback(() => {
    introPending.current = false;
    tape(true);
  }, [tape]);

  // Wait for load so the scene art is in before it slides. The intro does not
  // persist, so a reader who never toggles keeps following the OS theme.
  useEffect(() => {
    if (!intro) return;
    let t: ReturnType<typeof setTimeout>;
    const play = () => {
      t = setTimeout(() => {
        if (!introPending.current) return;
        introPending.current = false;
        tape(false);
      }, INTRO_DELAY);
    };
    if (document.readyState === 'complete') play();
    else window.addEventListener('load', play, { once: true });
    return () => {
      window.removeEventListener('load', play);
      clearTimeout(t);
    };
  }, [intro, tape]);

  const value = useMemo<ThemeValue>(
    () => ({
      theme,
      isDark: theme === 'dark',
      transPhase,
      sceneFrom,
      toggleTheme,
      themeClass: pureClass(theme, transPhase),
      groupStyle: (isLightGroup: boolean) => pureGroup(transPhase, sceneFrom, theme, isLightGroup),
      moonGlowStyle: pureMoonGlow(transPhase, theme),
      themeIcon: theme === 'dark' ? 'ui/moon-solid' : 'ui/brightness-high-solid',
      themeLabel: theme === 'dark' ? 'DARK' : 'LIGHT',
    }),
    [theme, transPhase, sceneFrom, toggleTheme],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useTheme(): ThemeValue {
  const v = useContext(Ctx);
  if (!v) throw new Error('useTheme must be used inside <ThemeProvider>');
  return v;
}
