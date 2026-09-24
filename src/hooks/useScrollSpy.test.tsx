import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { StrictMode, useRef } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { SECTIONS } from '../lib/scrollSpy';
import { useScrollSpy } from './useScrollSpy';

const TOPS = [0, 1200, 2600, 4400, 5600];

function Harness() {
  const rootRef = useRef<HTMLDivElement>(null);
  const { active, jumpTo } = useScrollSpy(rootRef);
  return (
    <div ref={rootRef}>
      <span data-testid="active">{active}</span>
      <button onClick={() => jumpTo(3)}>jump</button>
      {SECTIONS.map((id) => (
        <section key={id} id={id} />
      ))}
    </div>
  );
}

function setScroll(y: number) {
  Object.defineProperty(window, 'scrollY', { value: y, configurable: true });
  window.dispatchEvent(new Event('scroll'));
}

beforeEach(() => {
  vi.useFakeTimers({ shouldAdvanceTime: true });
  // jsdom leaves offsetTop at 0 and has no rAF timing; stub both.
  vi.stubGlobal('requestAnimationFrame', (cb: FrameRequestCallback) => {
    cb(0);
    return 1;
  });
  Object.defineProperty(window, 'innerHeight', { value: 1000, configurable: true });
  Object.defineProperty(HTMLElement.prototype, 'offsetTop', {
    configurable: true,
    get(this: HTMLElement) {
      const i = SECTIONS.indexOf(this.id as (typeof SECTIONS)[number]);
      return i === -1 ? 0 : TOPS[i];
    },
  });
  window.scrollTo = vi.fn((opts?: ScrollToOptions | number) => {
    const top = typeof opts === 'object' && opts !== null ? (opts.top ?? 0) : 0;
    Object.defineProperty(window, 'scrollY', { value: top, configurable: true });
  });
});
afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
});

describe('useScrollSpy', () => {
  it('writes the XP fill to --xp on the root without re-rendering', () => {
    const { container } = render(<Harness />);
    const root = container.firstElementChild as HTMLElement;
    // 2250 + 350 puts the 35% line on Projects' top: exactly two fifths.
    act(() => setScroll(2250));
    expect(Number(root.style.getPropertyValue('--xp'))).toBeCloseTo(2 / 5);
  });

  it('tracks the active section as the page scrolls', () => {
    render(<Harness />);
    act(() => setScroll(2300));
    expect(screen.getByTestId('active')).toHaveTextContent('2');
    act(() => setScroll(5300));
    expect(screen.getByTestId('active')).toHaveTextContent('4');
  });

  it('sets the active index optimistically on a nav click', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(<Harness />);
    await user.click(screen.getByRole('button'));
    expect(screen.getByTestId('active')).toHaveTextContent('3');
  });

  it('ignores scroll updates during the 900ms lock, then resumes', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(<Harness />);
    await user.click(screen.getByRole('button'));

    act(() => setScroll(0));
    expect(screen.getByTestId('active')).toHaveTextContent('3');   // locked

    act(() => { vi.advanceTimersByTime(901); });
    act(() => setScroll(0));
    expect(screen.getByTestId('active')).toHaveTextContent('0');   // released
  });

  it('smooth-scrolls to the top only for index 0', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(<Harness />);
    await user.click(screen.getByRole('button'));   // jumpTo(3)
    expect(window.scrollTo).not.toHaveBeenCalled();
  });

  it('keeps tracking after a remount cancels an in-flight frame', () => {
    // The synchronous rAF stub hides the real ordering: StrictMode mounts,
    // schedules a frame, then tears the effect down before the frame runs.
    const frames: Array<FrameRequestCallback | null> = [];
    vi.stubGlobal('requestAnimationFrame', (cb: FrameRequestCallback) => frames.push(cb));
    vi.stubGlobal('cancelAnimationFrame', (id: number) => { frames[id - 1] = null; });
    const flush = () => act(() => {
      const due = frames.splice(0, frames.length);
      due.forEach((cb) => cb?.(0));
    });

    render(<StrictMode><Harness /></StrictMode>);
    flush();

    act(() => setScroll(2300));
    flush();
    expect(screen.getByTestId('active')).toHaveTextContent('2');
  });

  it('restores the hash target on mount', () => {
    window.location.hash = '#skills';
    render(<Harness />);
    expect(window.scrollTo).toHaveBeenCalledWith({ top: 4400, behavior: 'auto' });
    expect(screen.getByTestId('active')).toHaveTextContent('3');
    window.location.hash = '';
  });
});
