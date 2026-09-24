import { useSyncExternalStore } from 'react';

const QUERY = '(max-width: 860px)';

// A MediaQueryList is live — `.matches` tracks the viewport on its own — so one
// object serves every caller for the life of the page. Without this, getSnapshot
// allocated a fresh list on each of ~9 call sites per render pass.
//
// Keyed on the matchMedia identity rather than cached outright: tests swap
// window.matchMedia to move the viewport, and a new function means a new list.
let cachedFrom: typeof window.matchMedia | null = null;
let cached: MediaQueryList | null = null;

function mediaQueryList(): MediaQueryList | null {
  if (typeof window === 'undefined' || !window.matchMedia) return null;
  if (cachedFrom !== window.matchMedia) {
    cachedFrom = window.matchMedia;
    cached = window.matchMedia(QUERY);
  }
  return cached;
}

function subscribe(onChange: () => void) {
  const mq = mediaQueryList();
  if (!mq) return () => {};
  mq.addEventListener('change', onChange);
  return () => mq.removeEventListener('change', onChange);
}

function getSnapshot(): boolean {
  return mediaQueryList()?.matches ?? false;
}

/** The prototype's isMobile. Selects between structurally different filter
 *  markup and different text-shadow strings, so it must stay in JS. */
export function useIsMobile(): boolean {
  return useSyncExternalStore(
    subscribe,
    getSnapshot,
    () => false, // SSR / prerender: assume desktop, matching the prototype's initial state
  );
}
