import { useEffect, useRef } from 'react';

/** The class patterns.css pauses on. */
export const SCENE_PAUSED = 'rc-scene-paused';

/** Stops a scene's CSS animations while the scene is off screen.
 *
 *  Worth doing because several hero layers animate `filter: drop-shadow(...)`
 *  — sun, moon, stars, fire. A changing blur radius cannot be composited, so
 *  the layer is re-rasterised every frame, at full viewport size, for as long
 *  as the animation runs. That bill was being paid from the moment the page
 *  loaded until it closed, however far down the page the reader had scrolled.
 *
 *  Same shape as BeachScene's frame-advance observer: the scene starts RUNNING
 *  and the observer only ever pauses it, so anywhere IntersectionObserver never
 *  reports, the fallback is the old always-on behaviour rather than a frozen
 *  scene.
 *
 *  Safe for the theme tape, which is a `forwards` animation that must finish:
 *  a toggle made while the scene is off screen resolves anyway, because
 *  transPhase returns to 'idle' on its own timer and groupStyle then replaces
 *  the animation with the plain transform. */
export function useScenePause<T extends HTMLElement>() {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) el.classList.toggle(SCENE_PAUSED, !entry.isIntersecting);
      },
      { threshold: 0 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      el.classList.remove(SCENE_PAUSED);
    };
  }, []);

  return ref;
}
