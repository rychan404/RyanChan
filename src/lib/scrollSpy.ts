/** Rendered order, which drives the nav highlight. DOM order is different
 *  (Home, Projects, About, Skills, Contact) and is reconciled by CSS `order`
 *  in Home.tsx — see spec section 4.1. */
export const SECTIONS = ['home', 'about', 'projects', 'skills', 'contact'] as const;

/** How long after a nav click the scroll-spy stops updating, so a smooth
 *  scroll cannot fight the optimistic highlight. */
export const NAV_LOCK_MS = 900;

/** The last section whose top is at or above the 35%-of-viewport line. */
export function activeIndexFor(tops: number[], scrollY: number, innerHeight: number): number {
  const line = scrollY + innerHeight * 0.35;
  let i = 0;
  tops.forEach((top, idx) => {
    if (top <= line) i = idx;
  });
  return i;
}
