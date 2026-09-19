import type { CSSProperties } from 'react';
import { useScenePause } from '../hooks/useScenePause';
import { useTheme } from '../hooks/useTheme';

/** Every scene layer is a full-bleed cover image. There is no z-index in this
 *  scene — document order IS the paint order, so do not reorder these. */
const LAYER: CSSProperties = {
  position: 'absolute',
  inset: 0,
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  imageRendering: 'pixelated',
};

const GROUP: CSSProperties = { position: 'absolute', inset: 0 };

/** The three parallax-less backdrops are background-images anchored to the
 *  bottom, not <img>, because they must not stretch. */
const BG: CSSProperties = {
  position: 'absolute',
  inset: 0,
  backgroundRepeat: 'no-repeat',
  backgroundSize: 'cover',
  backgroundPosition: 'bottom',
  imageRendering: 'pixelated',
};

/** Frames the waterfall/camera/computer scene against the shared backdrop. */
const FRAMED: CSSProperties = { ...LAYER, objectPosition: '20% 50%' };

/** Trees sway from the base; the swing and computer sway from the top. */
const FROM_BASE: CSSProperties = { ...LAYER, transformOrigin: '50% 100%' };
const FROM_TOP: CSSProperties = { ...LAYER, transformOrigin: '50% 0%' };

const sway = (secs: string, reverse = false) =>
  `pxsway ${secs} steps(6,end) infinite ${reverse ? 'alternate-reverse' : 'alternate'}`;

const VIGNETTE =
  'radial-gradient(circle at 50% 85%, transparent 0%, rgba(12,9,6,.22) 14%, ' +
  'rgba(10,8,6,.45) 28%, rgba(8,7,6,.65) 44%, rgba(6,10,14,.8) 62%, ' +
  'rgba(6,10,14,.88) 100%)';

/** Layers 7-13 plus the campfire base: no theme value reaches any of them, so
 *  they are built once. They sit between the sky groups and the flame group --
 *  document order is paint order, so this constant may not move. */
const BACKDROPS_AND_TENNIS = (
  <>
    {/* 7-9  backdrops */}
    <div aria-hidden="true" style={{ ...BG, backgroundImage: "url(/assets/hero/mountains-back.png)" }} />
    <div aria-hidden="true" style={{ ...BG, backgroundImage: "url(/assets/hero/mountains-front.png)" }} />
    <div aria-hidden="true" style={{ ...BG, backgroundImage: "url(/assets/hero/grass.png)" }} />

    {/* 10-13  tennis */}
    <img aria-hidden="true" decoding="async" src="/assets/hero/tennis-net.png" style={LAYER} />
    <img aria-hidden="true" decoding="async" src="/assets/hero/tennis-player-1.png" style={{ ...LAYER, animation: 'pxpersonbob 1.6s steps(4,end) infinite alternate' }} />
    <img aria-hidden="true" decoding="async" src="/assets/hero/tennis-player-2.png" style={{ ...LAYER, animation: 'pxpersonbob 1.6s steps(4,end) infinite alternate-reverse' }} />
    <img aria-hidden="true" decoding="async" src="/assets/hero/tennis-ball.png" style={{ ...LAYER, animation: 'pxballswing 1s steps(8,end) infinite alternate' }} />

    <img aria-hidden="true" decoding="async" src="/assets/hero/campfire.png" style={LAYER} />
  </>
);

/** Between the flame group and the smoke group. Static. */
const CAMPFIRE_BODY = (
  <>
    <img aria-hidden="true" decoding="async" src="/assets/hero/campfire-logs.png" style={LAYER} />
    <img aria-hidden="true" decoding="async" src="/assets/hero/campfire-person-2.png" style={{ ...LAYER, animation: 'pxpersonbob 2s steps(4,end) infinite alternate' }} />
    <img aria-hidden="true" decoding="async" src="/assets/hero/campfire-person-1.png" style={LAYER} />
  </>
);

/** Layers 20-32: trees, swing, desk, waterfall and camera. All static. */
const FOREGROUND = (
  <>
    {/* 20-24  trees, each with its own duration and direction */}
    <img aria-hidden="true" decoding="async" src="/assets/hero/tree-5-z2.png" style={{ ...FROM_BASE, animation: sway('3.6s') }} />
    <img aria-hidden="true" decoding="async" src="/assets/hero/tree-4-z3.png" style={{ ...FROM_BASE, animation: sway('4.2s', true) }} />
    <img aria-hidden="true" decoding="async" src="/assets/hero/tree-3-z3.png" style={{ ...FROM_BASE, animation: sway('3.8s') }} />
    <img aria-hidden="true" decoding="async" src="/assets/hero/tree-2-z1.png" style={{ ...FROM_BASE, animation: sway('4s', true) }} />
    <img aria-hidden="true" decoding="async" src="/assets/hero/tree-1-z1.png" style={{ ...FROM_BASE, animation: sway('3.4s') }} />

    {/* 25-27  swing and desk, pivoting from the top */}
    <img aria-hidden="true" decoding="async" src="/assets/hero/swing.png" style={{ ...FROM_TOP, animation: sway('3.6s') }} />
    <img aria-hidden="true" decoding="async" src="/assets/hero/computer-person.png" style={{ ...FROM_TOP, animation: sway('3.6s') }} />
    <img aria-hidden="true" decoding="async" src="/assets/hero/computer.png" style={{ ...FROM_TOP, animation: sway('3.6s') }} />

    {/* 28-32  waterfall and camera, framed at 20% 50% */}
    <img aria-hidden="true" decoding="async" src="/assets/hero/waterfall-ocean.png" style={FRAMED} />
    <img aria-hidden="true" decoding="async" src="/assets/hero/waterfall-splash.png" style={{ ...FRAMED, animation: 'pxsplash 1.2s steps(4,end) infinite' }} />
    <img aria-hidden="true" decoding="async" src="/assets/hero/camera.png" style={FRAMED} />
    <img aria-hidden="true" decoding="async" src="/assets/hero/camera-record-off.png" style={FRAMED} />
    <img aria-hidden="true" decoding="async" src="/assets/hero/camera-record-on.png" style={{ ...FRAMED, animation: 'pxrecdotblink 1s steps(1,end) infinite' }} />
  </>
);

export function HeroScene() {
  const { groupStyle, fadeStyle, moonGlowStyle, isDark } = useTheme();
  // Parks every animation below while the hero is off screen. The four
  // drop-shadow keyframes here are the expensive ones -- see useScenePause.
  const sceneRef = useScenePause<HTMLDivElement>();
  const light = groupStyle(true);
  const dark = groupStyle(false);
  // The vignette, fire and smoke all track "is it night", by opacity only.
  const nightFade = fadeStyle(isDark);

  return (
    <div
      ref={sceneRef}
      aria-hidden="true"
      className="rc-scene"
      style={{ position: 'absolute', inset: 0, overflow: 'hidden', imageRendering: 'pixelated' }}
    >
      {/* 1-3  day sky, birds, sun — tape group */}
      <div aria-hidden="true" className="rc-tape" style={{ ...GROUP, ...light }}>
        <img aria-hidden="true" decoding="async" src="/assets/hero/sky-day.png" style={LAYER} />
        <img aria-hidden="true" decoding="async" src="/assets/hero/birds.png" style={{ ...LAYER, animation: 'pxbirds 6s steps(4,end) infinite alternate' }} />
        <img aria-hidden="true" decoding="async" src="/assets/hero/sun.png" style={{ ...LAYER, animation: 'pxsunglow 8s steps(8,end) infinite' }} />
      </div>

      {/* 4  night sky — tape group */}
      <div aria-hidden="true" className="rc-tape" style={{ ...GROUP, ...dark }}>
        <img aria-hidden="true" decoding="async" src="/assets/hero/sky-night.png" style={LAYER} />
      </div>

      {/* 5-6  stars and moon — tape group */}
      <div aria-hidden="true" className="rc-tape" style={{ ...GROUP, ...dark }}>
        <img aria-hidden="true" decoding="async" src="/assets/hero/stars.png" style={{ ...LAYER, animation: 'pxstartwinkle 8.5s steps(9,end) infinite' }} />
        <img aria-hidden="true" decoding="async" src="/assets/hero/moon.png" style={{ ...LAYER, animation: 'pxmoonglow 9s steps(8,end) infinite' }} />
      </div>

      {BACKDROPS_AND_TENNIS}

      {/* 14-19  campfire. The flame and smoke groups are PERSISTENT: they
          cross-fade by opacity and must never be conditionally unmounted,
          or their animations restart on every theme toggle. */}
      <div aria-hidden="true" style={{ ...GROUP, ...nightFade }}>
        <img aria-hidden="true" decoding="async" src="/assets/hero/campfire-flames.png" style={{ ...LAYER, animation: 'pxflicker 0.9s steps(3,end) infinite alternate, pxfireglow 6s steps(8,end) infinite' }} />
      </div>
      {CAMPFIRE_BODY}
      <div aria-hidden="true" style={{ ...GROUP, ...nightFade }}>
        <img aria-hidden="true" decoding="async" src="/assets/hero/campfire-smoke.png" style={{ ...LAYER, animation: 'pxsmoke 5s steps(5,end) infinite' }} />
      </div>

      {FOREGROUND}

      {/* 33  vignette — persistent, opacity only */}
      <div aria-hidden="true" style={{ ...GROUP, background: VIGNETTE, ...nightFade }} />

      {/* 34  moon glow — persistent, opacity only, screen-blended */}
      <div aria-hidden="true" style={{ ...GROUP, mixBlendMode: 'screen', ...moonGlowStyle }}>
        <img aria-hidden="true" decoding="async" src="/assets/hero/stars.png" style={{ ...LAYER, animation: 'pxstartwinkle 8.5s steps(9,end) infinite' }} />
        <img aria-hidden="true" decoding="async" src="/assets/hero/moon.png" style={{ ...LAYER, animation: 'pxmoonglow 9s steps(8,end) infinite' }} />
      </div>
    </div>
  );
}
