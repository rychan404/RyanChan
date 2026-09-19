import { useEffect, useRef, type CSSProperties } from 'react';
import { prefersReducedMotion } from '../lib/motion';
import { useScenePause } from '../hooks/useScenePause';
import { useTheme } from '../hooks/useTheme';

const LAYER: CSSProperties = {
  position: 'absolute', inset: 0, width: '100%', height: '100%',
  objectFit: 'cover', imageRendering: 'pixelated',
};

const GROUP: CSSProperties = { position: 'absolute', inset: 0 };
const CLIPPED: CSSProperties = { ...GROUP, overflow: 'hidden' };

/** Overscan so the +/-8px sway can never expose an edge. */
const WAVE: CSSProperties = {
  position: 'absolute', top: 0, left: '-6%', width: '112%', height: '100%',
  objectFit: 'cover', imageRendering: 'pixelated',
};

/** Overscan for the same reason, on a layer that also drifts. */
const CLOUD: CSSProperties = {
  position: 'absolute', top: '-50%', left: '-50%', width: '200%', height: '200%',
  objectFit: 'contain', imageRendering: 'pixelated',
};

/** PHASE LOCK. The two suns and both cloud layers share this animation name,
 *  duration and negative delay, and none of them may ever be conditionally
 *  mounted or keyed on theme — an early return, a conditional mount or a
 *  changing React key here makes the sun visibly jump on theme toggle.
 *  The negative delay starts the cycle mid-flight and locks the four together. */
const SUNSLIDE: CSSProperties = {
  animation: 'pxsunslide 34s linear infinite',
  animationDelay: '-17s',
};

const RYAN_FRAMES = Array.from(
  { length: 11 },
  (_, i) => `/assets/contact/ryan-wave-${String(i + 1).padStart(2, '0')}.png`,
);

export function BeachScene() {
  const { groupStyle, isDark } = useTheme();
  const light = groupStyle(true);
  const dark = groupStyle(false);
  const ryanRef = useRef<HTMLImageElement>(null);
  const frame = useRef(0);
  // A root of its own, so the same off-screen pause the hero uses has something
  // to hang the class on. Absolute + inset 0 inside Contact's already-relative
  // box, so the layers sit exactly where they did as loose children.
  const sceneRef = useScenePause<HTMLDivElement>();

  // Frames 2-11 are never in the markup -- they only exist as assignments to
  // .src below, so without this the first pass through the cycle fetches one
  // frame every 250ms and Ryan pops in and out while it does. Warming them as
  // detached Images costs 10 requests of a few KB each and buys a clean first
  // loop. (The About walk cycle avoids the problem outright by being a single
  // 68-frame strip; the same could be done here, but not without redoing the
  // cover-fit maths that keeps Ryan aligned with the duck and the waves.)
  useEffect(() => {
    for (const src of RYAN_FRAMES.slice(1)) {
      const img = new Image();
      img.decoding = 'async';
      img.src = src;
    }
  }, []);

  // Frame advance is imperative, and only while the scene is on screen. Routing
  // it through state re-rendered all 13 layers four times a second for the life
  // of the page -- the same reason useSpriteSheet drives the walk cycle by ref.
  // The <img> itself never unmounts, so the phase lock above is untouched.
  useEffect(() => {
    const el = ryanRef.current;
    if (!el) return;
    // Reduced motion: Ryan holds frame 1. The CSS half of the rule cannot
    // reach a setInterval, so it is checked here too.
    if (prefersReducedMotion()) return;

    let id: ReturnType<typeof setInterval> | null = null;
    const start = () => {
      if (id !== null) return;
      id = setInterval(() => {
        frame.current = (frame.current + 1) % RYAN_FRAMES.length;
        el.src = RYAN_FRAMES[frame.current];
      }, 250);
    };
    const stop = () => {
      if (id === null) return;
      clearInterval(id);
      id = null;
    };

    // Start unconditionally, then let the observer PAUSE it off screen. The
    // other way round -- start only once the observer reports a hit -- leaves the
    // scene frozen anywhere IntersectionObserver never reports, so the failure
    // mode here is the old always-on behaviour rather than a dead animation.
    start();
    if (typeof IntersectionObserver === 'undefined') return stop;

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) (entry.isIntersecting ? start : stop)();
      },
      { threshold: 0 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      stop();
    };
  }, []);

  return (
    <div
      ref={sceneRef}
      aria-hidden="true"
      className="rc-scene"
      style={{ position: 'absolute', inset: 0 }}
    >
      {/* 1  skies — tape transition, same as the hero */}
      <div aria-hidden="true" className="rc-tape" style={{ ...GROUP, ...light }}>
        <img decoding="async" src="/assets/contact/sky-day.png" style={LAYER} alt="" />
      </div>
      <div aria-hidden="true" className="rc-tape" style={{ ...GROUP, ...dark }}>
        <img decoding="async" src="/assets/contact/sky-night.png" style={LAYER} alt="" />
      </div>

      {/* 2  both suns, always mounted, cross-faded by opacity */}
      <div aria-hidden="true" style={CLIPPED}>
        <img
          decoding="async"
          src="/assets/contact/sun-day.png"
          alt=""
          style={{ ...LAYER, ...SUNSLIDE, opacity: isDark ? 0 : 1, transition: 'opacity 1.2s ease' }}
        />
        <img
          decoding="async"
          src="/assets/contact/sun-night.png"
          alt=""
          style={{ ...LAYER, ...SUNSLIDE, opacity: isDark ? 1 : 0, transition: 'opacity 1.2s ease' }}
        />
      </div>

      {/* 3  back clouds — the wrapper slides, the image drifts */}
      <div aria-hidden="true" className="rc-tape" style={{ ...CLIPPED, ...light }}>
        <img decoding="async" src="/assets/contact/clouds-back.png" alt="" style={{ ...CLOUD, ...SUNSLIDE }} />
      </div>

      {/* 4-5  duck and Ryan */}
      <img
        aria-hidden="true"
        decoding="async"
        src="/assets/contact/duck.png"
        alt=""
        style={{ ...LAYER, animation: 'pxwavesway 6s ease-in-out infinite' }}
      />
      <img
        ref={ryanRef}
        aria-hidden="true"
        decoding="async"
        src={RYAN_FRAMES[0]}
        alt=""
        style={{ ...LAYER, animation: 'pxwavesway 6s ease-in-out infinite' }}
      />

      {/* 6  front clouds */}
      <div aria-hidden="true" className="rc-tape" style={{ ...CLIPPED, ...light }}>
        <img decoding="async" src="/assets/contact/clouds-front.png" alt="" style={{ ...CLOUD, ...SUNSLIDE }} />
      </div>

      {/* 7  birds */}
      <div aria-hidden="true" className="rc-tape" style={{ ...GROUP, ...light }}>
        <img
          decoding="async"
          src="/assets/contact/birds.png"
          alt=""
          style={{ ...LAYER, animation: 'pxbirds 5s ease-in-out infinite' }}
        />
      </div>

      {/* 8-9  waves */}
      <img
        aria-hidden="true"
        decoding="async"
        src="/assets/contact/waves-back.png"
        alt=""
        style={{ ...WAVE, animation: 'pxwavesway 6s ease-in-out infinite reverse' }}
      />
      <img
        aria-hidden="true"
        decoding="async"
        src="/assets/contact/waves-front.png"
        alt=""
        style={{ ...WAVE, animation: 'pxwavesway 6s ease-in-out infinite' }}
      />
    </div>
  );
}
