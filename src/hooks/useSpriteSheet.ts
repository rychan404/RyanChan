import { useCallback, useEffect, useRef, useState } from 'react';
import { FPS, N, spriteFrameStyle } from '../lib/sprite';

/** Drives the About walk cycle. Frame advance is imperative — writing
 *  backgroundPosition straight onto the node at 12fps — because routing it
 *  through state would re-render the whole About section 12 times a second. */
export function useSpriteSheet() {
  const panelRef = useRef<HTMLDivElement>(null);
  const spriteRef = useRef<HTMLDivElement>(null);
  const [playing, setPlaying] = useState(false);

  const frame = useRef(0);
  // Refs, not state: neither should cause a render.
  const playOnce = useRef(false);
  const autoPlayed = useRef(false);

  const paint = useCallback(() => {
    const el = spriteRef.current;
    if (!el) return;
    const { clientWidth: cw, clientHeight: ch } = el;
    if (!cw || !ch) return;
    const { backgroundSize, backgroundPosition } = spriteFrameStyle(cw, ch, frame.current);
    el.style.backgroundSize = backgroundSize;
    el.style.backgroundPosition = backgroundPosition;
  }, []);

  // First paint, plus a ResizeObserver so the frame stays cover-fitted.
  useEffect(() => {
    paint();
    const el = spriteRef.current;
    if (!el || typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver(paint);
    ro.observe(el);
    return () => ro.disconnect();
  }, [paint]);

  // The 12fps advance. Only mounted while playing.
  useEffect(() => {
    if (!playing) return;
    const id = setInterval(() => {
      frame.current += 1;
      if (frame.current >= N) {
        frame.current = 0;
        if (playOnce.current) {
          playOnce.current = false;
          setPlaying(false);
          paint();
          return;
        }
      }
      paint();
    }, 1000 / FPS);
    return () => clearInterval(id);
  }, [playing, paint]);

  // Auto-play the cycle exactly once when the panel scrolls into view.
  useEffect(() => {
    const el = panelRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting || autoPlayed.current) continue;
          autoPlayed.current = true;
          playOnce.current = true;
          frame.current = 0;
          setPlaying(true);
          io.disconnect();
        }
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const toggle = useCallback(() => {
    setPlaying((p) => {
      if (p) {
        frame.current = 0;
        playOnce.current = false;
        // paint() reads the ref we just reset; the effect teardown handles
        // the interval.
        queueMicrotask(paint);
        return false;
      }
      playOnce.current = false;
      return true;
    });
  }, [paint]);

  return { panelRef, spriteRef, playing, toggle };
}
