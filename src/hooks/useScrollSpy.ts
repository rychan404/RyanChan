import { useCallback, useEffect, useRef, useState, type RefObject } from 'react';
import { NAV_LOCK_MS, SECTIONS, activeIndexFor } from '../lib/scrollSpy';

/** One rAF-throttled scroll listener, doing only scroll-spy. The prototype's
 *  [data-parallax] loop is dead code — no element carries the attribute
 *  (spec section 4.2) — and is deliberately not ported. */
export function useScrollSpy(rootRef: RefObject<HTMLElement>) {
  const [active, setActive] = useState(0);
  const lockUntil = useRef(0);
  const rafPending = useRef(false);
  const rafId = useRef<number | null>(null);
  const sections = useRef<HTMLElement[]>([]);
  // Section offsets, measured lazily. Reading offsetTop forces the browser to
  // flush layout, so doing it every scroll frame cost a reflow per frame; it
  // only actually changes when the page reflows, which the observers below catch.
  const tops = useRef<number[]>([]);
  const topsStale = useRef(true);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    sections.current = SECTIONS
      .map((id) => root.querySelector<HTMLElement>(`#${id}`))
      .filter((el): el is HTMLElement => el !== null);
    topsStale.current = true;

    const onScroll = () => {
      if (rafPending.current) return;
      rafPending.current = true;
      rafId.current = requestAnimationFrame(() => {
        rafPending.current = false;
        if (Date.now() <= lockUntil.current) return;
        if (topsStale.current) {
          tops.current = sections.current.map((el) => el.offsetTop);
          topsStale.current = false;
        }
        setActive(activeIndexFor(tops.current, window.scrollY, window.innerHeight));
      });
    };

    // Anything that can move a section: a viewport resize, and — via the
    // observer on the root — images finishing, fonts swapping, a filter
    // changing the project grid's height.
    const invalidate = () => {
      topsStale.current = true;
      onScroll();
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', invalidate);
    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(invalidate) : null;
    ro?.observe(root);

    // Hash restore on mount: this is what makes "back to projects" from the
    // detail page land on the right section.
    const hashId = window.location.hash.slice(1);
    const target = hashId ? root.querySelector<HTMLElement>(`#${hashId}`) : null;
    if (target) window.scrollTo({ top: target.offsetTop, behavior: 'auto' });
    onScroll();

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', invalidate);
      ro?.disconnect();
      // Cancelling the frame means its callback never clears the latch, so
      // clear it here: StrictMode tears the effect down mid-frame, and a
      // latch left set makes every scroll after the remount a no-op.
      if (rafId.current !== null) cancelAnimationFrame(rafId.current);
      rafId.current = null;
      rafPending.current = false;
    };
  }, [rootRef]);

  const jumpTo = useCallback((index: number) => {
    lockUntil.current = Date.now() + NAV_LOCK_MS;
    setActive(index);
    // Index 0 has no anchor above it to scroll to; the rest rely on the
    // anchor href plus html{scroll-behavior:smooth}.
    if (index === 0) window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return { active, jumpTo };
}
