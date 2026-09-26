import { describe, expect, it } from 'vitest';
import { TAPE_DUR, fadeStyle, groupStyle, introStartTheme, moonGlowStyle, themeClass } from './theme';

const ANIM = (name: string) => `${name} ${TAPE_DUR}ms cubic-bezier(.45,0,.2,1) forwards`;

describe('groupStyle at rest', () => {
  it('shows the light group and hides the dark group in light theme', () => {
    expect(groupStyle('idle', null, 'light', true)).toEqual({ transform: 'translateY(0)' });
    expect(groupStyle('idle', null, 'light', false)).toEqual({ transform: 'translateY(-100%)' });
  });

  it('shows the dark group and hides the light group in dark theme', () => {
    expect(groupStyle('idle', null, 'dark', false)).toEqual({ transform: 'translateY(0)' });
    expect(groupStyle('idle', null, 'dark', true)).toEqual({ transform: 'translateY(-100%)' });
  });
});

describe('groupStyle mid-tape', () => {
  it('exits the light group and enters the dark group when leaving light', () => {
    // sceneFrom is the theme we are LEAVING; theme has already flipped to dark.
    expect(groupStyle('moving', 'light', 'dark', true)).toEqual({ animation: ANIM('pxtapeExit') });
    expect(groupStyle('moving', 'light', 'dark', false)).toEqual({ animation: ANIM('pxtapeEnter') });
  });

  it('exits the dark group and enters the light group when leaving dark', () => {
    expect(groupStyle('moving', 'dark', 'light', false)).toEqual({ animation: ANIM('pxtapeExit') });
    expect(groupStyle('moving', 'dark', 'light', true)).toEqual({ animation: ANIM('pxtapeEnter') });
  });

  it('reads sceneFrom, not theme — a stale theme must not change the answer', () => {
    expect(groupStyle('moving', 'dark', 'dark', false)).toEqual({ animation: ANIM('pxtapeExit') });
  });
});

describe('fadeStyle', () => {
  it('cross-fades by opacity over the tape duration', () => {
    expect(fadeStyle(true)).toEqual({
      opacity: 1,
      transition: `opacity ${TAPE_DUR}ms cubic-bezier(.45,0,.2,1)`,
    });
    expect(fadeStyle(false)).toEqual({
      opacity: 0,
      transition: `opacity ${TAPE_DUR}ms cubic-bezier(.45,0,.2,1)`,
    });
  });
});

describe('moonGlowStyle', () => {
  it('is visible only when dark and settled', () => {
    expect(moonGlowStyle('idle', 'dark')).toEqual({ opacity: 1, transition: 'opacity 200ms linear' });
    expect(moonGlowStyle('idle', 'light')).toEqual({ opacity: 0, transition: 'opacity 200ms linear' });
    expect(moonGlowStyle('moving', 'dark')).toEqual({ opacity: 0, transition: 'opacity 200ms linear' });
  });
});

describe('themeClass', () => {
  it('is empty in settled dark', () => {
    expect(themeClass('dark', 'idle')).toBe('');
  });

  it('adds theme-light in light', () => {
    expect(themeClass('light', 'idle')).toBe('theme-light');
  });

  it('adds theme-transitioning while moving', () => {
    expect(themeClass('dark', 'moving')).toBe(' theme-transitioning');
    expect(themeClass('light', 'moving')).toBe('theme-light theme-transitioning');
  });
});

describe('introStartTheme', () => {
  it('opens opposite the target, or on it under reduced motion', () => {
    expect(introStartTheme('dark', false)).toBe('light');
    expect(introStartTheme('light', false)).toBe('dark');
    expect(introStartTheme('dark', true)).toBe('dark');
    expect(introStartTheme('light', true)).toBe('light');
  });
});
