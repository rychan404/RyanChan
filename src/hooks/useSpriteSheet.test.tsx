import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useSpriteSheet } from './useSpriteSheet';

let observerCallback: IntersectionObserverCallback | null = null;
const disconnect = vi.fn();

function Harness() {
  const { panelRef, spriteRef, playing, toggle } = useSpriteSheet();
  return (
    <div ref={panelRef} data-testid="panel">
      <div ref={spriteRef} data-testid="sprite" />
      <span data-testid="playing">{String(playing)}</span>
      <button onClick={toggle}>toggle</button>
    </div>
  );
}

beforeEach(() => {
  vi.useFakeTimers({ shouldAdvanceTime: true });
  disconnect.mockClear();
  observerCallback = null;

  vi.stubGlobal('IntersectionObserver', class {
    constructor(cb: IntersectionObserverCallback) { observerCallback = cb; }
    observe = vi.fn();
    disconnect = disconnect;
    unobserve = vi.fn();
    takeRecords = vi.fn();
    root = null; rootMargin = ''; thresholds = [];
  });
  vi.stubGlobal('ResizeObserver', class {
    observe = vi.fn(); disconnect = vi.fn(); unobserve = vi.fn();
  });

  // jsdom reports 0 for every layout box; give the panel a real size.
  Object.defineProperty(HTMLElement.prototype, 'clientWidth', { configurable: true, value: 380 });
  Object.defineProperty(HTMLElement.prototype, 'clientHeight', { configurable: true, value: 380 });
});
afterEach(() => { vi.useRealTimers(); vi.unstubAllGlobals(); });

const bgPos = () => (screen.getByTestId('sprite') as HTMLElement).style.backgroundPosition;

describe('useSpriteSheet', () => {
  it('paints frame 0 on mount and starts paused', () => {
    render(<Harness />);
    expect(screen.getByTestId('playing')).toHaveTextContent('false');
    expect((screen.getByTestId('sprite') as HTMLElement).style.backgroundSize).not.toBe('');
  });

  it('does not advance while paused', () => {
    render(<Harness />);
    const before = bgPos();
    act(() => { vi.advanceTimersByTime(1000); });
    expect(bgPos()).toBe(before);
  });

  it('advances at 12fps while playing', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(<Harness />);
    await user.click(screen.getByRole('button'));
    const frame0 = bgPos();
    act(() => { vi.advanceTimersByTime(1000 / 12); });
    expect(bgPos()).not.toBe(frame0);
  });

  it('resets to frame 0 when paused', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(<Harness />);
    const frame0 = bgPos();
    await user.click(screen.getByRole('button'));
    act(() => { vi.advanceTimersByTime(500); });
    expect(bgPos()).not.toBe(frame0);
    await user.click(screen.getByRole('button'));
    expect(bgPos()).toBe(frame0);
    expect(screen.getByTestId('playing')).toHaveTextContent('false');
  });

  it('auto-plays once on intersection, then stops and disconnects', () => {
    render(<Harness />);
    act(() => {
      observerCallback!([{ isIntersecting: true } as IntersectionObserverEntry], {} as IntersectionObserver);
    });
    expect(screen.getByTestId('playing')).toHaveTextContent('true');
    expect(disconnect).toHaveBeenCalledOnce();

    // 68 frames at 12fps is a hair under 5.7s; run past the wrap.
    act(() => { vi.advanceTimersByTime((1000 / 12) * 69); });
    expect(screen.getByTestId('playing')).toHaveTextContent('false');
  });

  it('loops forever when started by the button instead', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(<Harness />);
    await user.click(screen.getByRole('button'));
    act(() => { vi.advanceTimersByTime((1000 / 12) * 200); });
    expect(screen.getByTestId('playing')).toHaveTextContent('true');
  });
});
