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

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    sections.current = SECTIONS
      .map((id) => root.querySelector<HTMLElement>(`#${id}`))
      .filter((el): el is HTMLElement => el !== null);

    const onScroll = () => {
      if (rafPending.current) return;
      rafPending.current = true;
      rafId.current = requestAnimationFrame(() => {
        rafPending.current = false;
        if (Date.now() <= lockUntil.current) return;
        const tops = sections.current.map((el) => el.offsetTop);
        setActive(activeIndexFor(tops, window.scrollY, window.innerHeight));
      });
    };

    window.addEventListener('scroll', onScroll, { passive: true });

    // Hash restore on mount: this is what makes "back to projects" from the
    // detail page land on the right section.
    const hashId = window.location.hash.slice(1);
    const target = hashId ? root.querySelector<HTMLElement>(`#${hashId}`) : null;
    if (target) window.scrollTo({ top: target.offsetTop, behavior: 'auto' });
    onScroll();

    return () => {
      window.removeEventListener('scroll', onScroll);
      if (rafId.current !== null) cancelAnimationFrame(rafId.current);
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
