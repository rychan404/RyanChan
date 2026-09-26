import type { CSSProperties } from 'react';

export type Theme = 'light' | 'dark';
export type TransPhase = 'idle' | 'moving';

export const TAPE_DUR = 620;
export const THEME_KEY = 'rc-theme';

/** Beat between page load and the first-visit intro tape, so the start scene registers. */
export const INTRO_DELAY = 400;

const EASE = 'cubic-bezier(.45,0,.2,1)';

/** The home page opens on the opposite of the reader's theme and tapes into
 *  it; under reduced motion it opens on their theme and stays. The boot script
 *  in Base.astro repeats this so the pre-hydration paint matches. */
export function introStartTheme(target: Theme, reducedMotion: boolean): Theme {
  if (reducedMotion) return target;
  return target === 'dark' ? 'light' : 'dark';
}

export function themeClass(theme: Theme, phase: TransPhase): string {
  return (theme === 'dark' ? '' : 'theme-light') + (phase !== 'idle' ? ' theme-transitioning' : '');
}

/** The tape transition. isLightGroup is true for the light scene group
 *  (day sky + birds + sun), false for the dark one.
 *  Mid-transition, which group WAS visible comes from sceneFrom — by then
 *  `theme` has already flipped. */
export function groupStyle(
  phase: TransPhase,
  sceneFrom: Theme | null,
  theme: Theme,
  isLightGroup: boolean,
): CSSProperties {
  if (phase === 'moving') {
    const fromDark = sceneFrom === 'dark';
    const wasVisible = isLightGroup ? !fromDark : fromDark;
    return { animation: `${wasVisible ? 'pxtapeExit' : 'pxtapeEnter'} ${TAPE_DUR}ms ${EASE} forwards` };
  }
  const visible = isLightGroup ? theme === 'light' : theme === 'dark';
  return { transform: `translateY(${visible ? '0' : '-100%'})` };
}

/** Persistent layers — the vignette, the fire, the smoke — cross-fade by
 *  opacity and are never unmounted, so their long-running animations survive
 *  a theme toggle. */
export function fadeStyle(visible: boolean): CSSProperties {
  return { opacity: visible ? 1 : 0, transition: `opacity ${TAPE_DUR}ms ${EASE}` };
}

export function moonGlowStyle(phase: TransPhase, theme: Theme): CSSProperties {
  return {
    opacity: phase === 'idle' && theme === 'dark' ? 1 : 0,
    transition: 'opacity 200ms linear',
  };
}
