import { useSyncExternalStore } from 'react';

const subscribe = () => () => {};

/** False in the server render and during hydration, true after. For output
 *  that depends on client-only state and would otherwise flash wrong. */
export function useHydrated(): boolean {
  return useSyncExternalStore(subscribe, () => true, () => false);
}
