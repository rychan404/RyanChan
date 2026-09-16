import {
  createContext, useCallback, useContext, useEffect, useMemo, useRef, useState,
  type CSSProperties, type ReactNode,
} from 'react';
import {
  TAPE_DUR, THEME_KEY, type Theme, type TransPhase,
  fadeStyle as pureFade, groupStyle as pureGroup,
  moonGlowStyle as pureMoonGlow, themeClass as pureClass,
} from '../lib/theme';

type ThemeValue = {
  theme: Theme;
  isDark: boolean;
  isLight: boolean;
  transPhase: TransPhase;
  sceneFrom: Theme | null;
  toggleTheme: () => void;
  themeClass: string;
  groupStyle: (isLightGroup: boolean) => CSSProperties;
  fadeStyle: (visible: boolean) => CSSProperties;
  moonGlowStyle: CSSProperties;
  themeIcon: string;
  themeLabel: string;
};

const Ctx = createContext<ThemeValue | null>(null);

function readStoredTheme(): Theme {
  try {
    return localStorage.getItem(THEME_KEY) === 'light' ? 'light' : 'dark';
  } catch {
    return 'dark';
  }
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(readStoredTheme);
  const [transPhase, setTransPhase] = useState<TransPhase>('idle');
  const [sceneFrom, setSceneFrom] = useState<Theme | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout>>();

  // index.html's boot script puts theme-light on <html> to avoid a flash of
  // the wrong theme. React owns the class on the app root from here on, so
  // drop the boot copy or the two fight over the light-theme token overrides.
  useEffect(() => {
    document.documentElement.classList.remove('theme-light');
  }, []);

  useEffect(() => () => clearTimeout(timer.current), []);

  const toggleTheme = useCallback(() => {
    // Guard: a double-toggle mid-tape strands a scene layer off-screen.
    setTransPhase((phase) => {
      if (phase !== 'idle') return phase;
      setTheme((current) => {
        setSceneFrom(current);
        const next: Theme = current === 'dark' ? 'light' : 'dark';
        try {
          localStorage.setItem(THEME_KEY, next);
        } catch {
          /* private mode: the toggle still works, it just does not persist */
        }
        return next;
      });
      timer.current = setTimeout(() => setTransPhase('idle'), TAPE_DUR);
      return 'moving';
    });
  }, []);

  const value = useMemo<ThemeValue>(
    () => ({
      theme,
      isDark: theme === 'dark',
      isLight: theme === 'light',
      transPhase,
      sceneFrom,
      toggleTheme,
      themeClass: pureClass(theme, transPhase),
      groupStyle: (isLightGroup: boolean) => pureGroup(transPhase, sceneFrom, theme, isLightGroup),
      fadeStyle: pureFade,
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
