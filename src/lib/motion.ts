/** The reduced-motion query, read imperatively.
 *
 *  Not a hook and not subscribed: both callers need the answer once, inside an
 *  effect, to decide whether to start a timer at all. The CSS half of the rule
 *  lives in global.css and is live on its own, so a user who flips the OS
 *  setting mid-visit still gets the scene animations paused — only the two JS
 *  frame-advancers wait for a reload, which is the cheap trade here. */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined' || !window.matchMedia) return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}
