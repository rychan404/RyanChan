import { useEffect, useState, type CSSProperties } from 'react';
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
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setFrame((f) => (f + 1) % RYAN_FRAMES.length), 250);
    return () => clearInterval(id);
  }, []);

  return (
    <>
      {/* 1  skies — tape transition, same as the hero */}
      <div aria-hidden="true" style={{ ...GROUP, ...light }}>
        <img src="/assets/contact/sky-day.png" style={LAYER} alt="" />
      </div>
      <div aria-hidden="true" style={{ ...GROUP, ...dark }}>
        <img src="/assets/contact/sky-night.png" style={LAYER} alt="" />
      </div>

      {/* 2  both suns, always mounted, cross-faded by opacity */}
      <div aria-hidden="true" style={CLIPPED}>
        <img
          src="/assets/contact/sun-day.png"
          alt=""
          style={{ ...LAYER, ...SUNSLIDE, opacity: isDark ? 0 : 1, transition: 'opacity 1.2s ease' }}
        />
        <img
          src="/assets/contact/sun-night.png"
          alt=""
          style={{ ...LAYER, ...SUNSLIDE, opacity: isDark ? 1 : 0, transition: 'opacity 1.2s ease' }}
        />
      </div>

      {/* 3  back clouds — the wrapper slides, the image drifts */}
      <div aria-hidden="true" style={{ ...CLIPPED, ...light }}>
        <img src="/assets/contact/clouds-back.png" alt="" style={{ ...CLOUD, ...SUNSLIDE }} />
      </div>

      {/* 4-5  duck and Ryan */}
      <img
        aria-hidden="true"
        src="/assets/contact/duck.png"
        alt=""
        style={{ ...LAYER, animation: 'pxwavesway 6s ease-in-out infinite' }}
      />
      <img
        aria-hidden="true"
        src={RYAN_FRAMES[frame]}
        alt=""
        style={{ ...LAYER, animation: 'pxwavesway 6s ease-in-out infinite' }}
      />

      {/* 6  front clouds */}
      <div aria-hidden="true" style={{ ...CLIPPED, ...light }}>
        <img src="/assets/contact/clouds-front.png" alt="" style={{ ...CLOUD, ...SUNSLIDE }} />
      </div>

      {/* 7  birds */}
      <div aria-hidden="true" style={{ ...GROUP, ...light }}>
        <img
          src="/assets/contact/birds.png"
          alt=""
          style={{ ...LAYER, animation: 'pxbirds 5s ease-in-out infinite' }}
        />
      </div>

      {/* 8-9  waves */}
      <img
        aria-hidden="true"
        src="/assets/contact/waves-back.png"
        alt=""
        style={{ ...WAVE, animation: 'pxwavesway 6s ease-in-out infinite reverse' }}
      />
      <img
        aria-hidden="true"
        src="/assets/contact/waves-front.png"
        alt=""
        style={{ ...WAVE, animation: 'pxwavesway 6s ease-in-out infinite' }}
      />
    </>
  );
}
