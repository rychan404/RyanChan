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

/** How far through the page the reader is, 0 to 1, in section-sized steps:
 *  each section owns an equal fifth of the XP bar, filled by how far the 35%
 *  line has travelled from its top to the next one's. The last section runs
 *  to where the line sits at the bottom of the page, so the bar ends full. */
export function xpFor(tops: number[], scrollY: number, innerHeight: number, maxScroll: number): number {
  if (tops.length === 0) return 0;
  const line = scrollY + innerHeight * 0.35;
  const i = activeIndexFor(tops, scrollY, innerHeight);
  // Floor the start at the line's resting spot so the bar is empty at the top.
  const start = Math.max(tops[i], innerHeight * 0.35);
  const end = tops[i + 1] ?? maxScroll + innerHeight * 0.35;
  const within = end > start ? Math.min(1, Math.max(0, (line - start) / (end - start))) : 1;
  return (i + within) / tops.length;
}
