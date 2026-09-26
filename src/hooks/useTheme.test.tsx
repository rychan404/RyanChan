import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderToString } from 'react-dom/server';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ThemeProvider, useTheme } from './useTheme';

function Probe() {
  const t = useTheme();
  return (
    <div>
      <span data-testid="theme">{t.theme}</span>
      <span data-testid="phase">{t.transPhase}</span>
      <span data-testid="from">{String(t.sceneFrom)}</span>
      <span data-testid="cls">{t.themeClass}</span>
      <span data-testid="icon">{t.themeIcon}</span>
      <span data-testid="label">{t.themeLabel}</span>
      <button onClick={t.toggleTheme}>toggle</button>
    </div>
  );
}

const renderProbe = (intro = false) => render(<ThemeProvider intro={intro}><Probe /></ThemeProvider>);
const stubSystem = (dark: boolean) =>
  vi.stubGlobal('matchMedia', (q: string) => ({ matches: q.includes(dark ? 'dark' : 'light') }));

beforeEach(() => {
  localStorage.clear();
  document.documentElement.className = '';
  vi.useFakeTimers({ shouldAdvanceTime: true });
});
afterEach(() => { vi.useRealTimers(); vi.unstubAllGlobals(); });

describe('ThemeProvider', () => {
  it('defaults to dark', () => {
    renderProbe();
    expect(screen.getByTestId('theme')).toHaveTextContent('dark');
    expect(screen.getByTestId('icon')).toHaveTextContent('ui/moon-solid');
    expect(screen.getByTestId('label')).toHaveTextContent('DARK');
  });

  it('restores the stored theme', () => {
    localStorage.setItem('rc-theme', 'light');
    renderProbe();
    expect(screen.getByTestId('theme')).toHaveTextContent('light');
    expect(screen.getByTestId('icon')).toHaveTextContent('ui/brightness-high-solid');
    expect(screen.getByTestId('label')).toHaveTextContent('LIGHT');
  });

  it('clears the boot class off <html> on mount', () => {
    document.documentElement.classList.add('theme-light');
    localStorage.setItem('rc-theme', 'light');
    renderProbe();
    expect(document.documentElement.classList.contains('theme-light')).toBe(false);
  });

  it('runs the tape: moving for 620ms, then idle, and persists', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    renderProbe();
    await user.click(screen.getByRole('button'));

    expect(screen.getByTestId('theme')).toHaveTextContent('light');
    expect(screen.getByTestId('phase')).toHaveTextContent('moving');
    expect(screen.getByTestId('from')).toHaveTextContent('dark');
    expect(screen.getByTestId('cls')).toHaveTextContent('theme-light theme-transitioning');
    expect(localStorage.getItem('rc-theme')).toBe('light');

    act(() => { vi.advanceTimersByTime(620); });
    expect(screen.getByTestId('phase')).toHaveTextContent('idle');
    expect(screen.getByTestId('cls')).toHaveTextContent('theme-light');
  });

  it('ignores a second toggle mid-tape, so no layer is stranded', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    renderProbe();
    await user.click(screen.getByRole('button'));
    act(() => { vi.advanceTimersByTime(300); });
    await user.click(screen.getByRole('button'));

    expect(screen.getByTestId('theme')).toHaveTextContent('light');
    expect(screen.getByTestId('phase')).toHaveTextContent('moving');

    act(() => { vi.advanceTimersByTime(620); });
    expect(screen.getByTestId('theme')).toHaveTextContent('light');
    expect(screen.getByTestId('phase')).toHaveTextContent('idle');
  });

  it('server-renders dark even when light is stored, so hydration matches', () => {
    localStorage.setItem('rc-theme', 'light');
    expect(renderToString(<ThemeProvider><Probe /></ThemeProvider>)).toContain('>dark<');
  });

  it('survives localStorage throwing', () => {
    const spy = vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('blocked');
    });
    expect(() => renderProbe()).not.toThrow();
    expect(screen.getByTestId('theme')).toHaveTextContent('dark');
    spy.mockRestore();
  });

  it('intro: opens opposite the OS theme, tapes into it, and does not persist', () => {
    stubSystem(true);
    renderProbe(true);
    expect(screen.getByTestId('theme')).toHaveTextContent('light');
    act(() => { vi.advanceTimersByTime(400); });
    expect(screen.getByTestId('theme')).toHaveTextContent('dark');
    expect(screen.getByTestId('phase')).toHaveTextContent('moving');
    expect(localStorage.getItem('rc-theme')).toBeNull();
  });

  it('intro plays on every load, into the stored pick over the OS theme', () => {
    stubSystem(true);
    localStorage.setItem('rc-theme', 'light');
    renderProbe(true);
    expect(screen.getByTestId('theme')).toHaveTextContent('dark');
    act(() => { vi.advanceTimersByTime(400); });
    expect(screen.getByTestId('theme')).toHaveTextContent('light');
  });

  it('intro does not undo a toggle the reader made first', async () => {
    stubSystem(false);
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    renderProbe(true);
    expect(screen.getByTestId('theme')).toHaveTextContent('dark');
    await user.click(screen.getByRole('button'));
    act(() => { vi.advanceTimersByTime(1000); });
    expect(screen.getByTestId('theme')).toHaveTextContent('light');
  });
});
