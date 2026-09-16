import { useSyncExternalStore } from 'react';

const QUERY = '(max-width: 860px)';

function subscribe(onChange: () => void) {
  const mq = window.matchMedia(QUERY);
  mq.addEventListener('change', onChange);
  return () => mq.removeEventListener('change', onChange);
}

/** The prototype's isMobile. Selects between structurally different nav
 *  markup and different text-shadow strings, so it must stay in JS. */
export function useIsMobile(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(QUERY).matches,
    () => false, // SSR / prerender: assume desktop, matching the prototype's initial state
  );
}
