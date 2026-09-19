import { render } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { SCENE_PAUSED, useScenePause } from './useScenePause';

type Cb = (entries: { isIntersecting: boolean }[]) => void;

let observed: Element[] = [];
let fire: Cb;
const disconnect = vi.fn();

function installObserver() {
  observed = [];
  disconnect.mockClear();
  vi.stubGlobal('IntersectionObserver', class {
    constructor(cb: Cb) { fire = cb; }
    observe(el: Element) { observed.push(el); }
    disconnect = disconnect;
    unobserve() {}
    takeRecords() { return []; }
    root = null; rootMargin = ''; thresholds = [];
  });
}

function Scene() {
  const ref = useScenePause<HTMLDivElement>();
  return <div ref={ref} data-testid="scene" className="rc-scene" />;
}

beforeEach(installObserver);
afterEach(() => vi.unstubAllGlobals());

describe('useScenePause', () => {
  it('leaves the scene running until the observer says otherwise', () => {
    const { getByTestId } = render(<Scene />);
    expect(getByTestId('scene').className).toBe('rc-scene');
    expect(observed).toEqual([getByTestId('scene')]);
  });

  it('pauses off screen and resumes back on screen', () => {
    const { getByTestId } = render(<Scene />);
    const el = getByTestId('scene');

    fire([{ isIntersecting: false }]);
    expect(el.classList.contains(SCENE_PAUSED)).toBe(true);

    fire([{ isIntersecting: true }]);
    expect(el.classList.contains(SCENE_PAUSED)).toBe(false);
  });

  it('disconnects and clears the class on unmount', () => {
    const { getByTestId, unmount } = render(<Scene />);
    const el = getByTestId('scene');
    fire([{ isIntersecting: false }]);
    unmount();
    expect(disconnect).toHaveBeenCalled();
    expect(el.classList.contains(SCENE_PAUSED)).toBe(false);
  });

  it('stays running where IntersectionObserver does not exist', () => {
    vi.stubGlobal('IntersectionObserver', undefined);
    const { getByTestId } = render(<Scene />);
    expect(getByTestId('scene').className).toBe('rc-scene');
  });
});
