import type { CSSProperties } from 'react';
import { useScenePause } from '../hooks/useScenePause';
import { useTheme } from '../hooks/useTheme';
import { fadeStyle } from '../lib/theme';

/** Every scene layer is a full-bleed cover image. There is no z-index in this
 *  scene — document order IS the paint order, so do not reorder these.
 *  Anchored to the bottom like the BG backdrops, so on a screen wider than
 *  16:9 (a phone in landscape) the top of the sky crops away and everything
 *  standing on the grass stays on the grass. */
const LAYER: CSSProperties = {
  position: 'absolute',
  inset: 0,
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  objectPosition: '50% 100%',
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

/** Ground groups. `object-position: X%` pins the art's X% point to the
 *  container's X%, so when a narrow screen crops the 16:9 cover sideways the
 *  groups draw closer instead of sliding off. No effect at 16:9 or wider.
 *  Each group is pulled only part of the way from centre (50%) towards where
 *  it sits in the 320-wide art, so the outer edges crop a little and the
 *  groups keep room between them. */
const AT = (x: string, y = '100%'): CSSProperties => ({ ...LAYER, objectPosition: `${x} ${y}` });
const FRAMED = AT('20%'); // waterfall + camera, x 0-33
const TENNIS = AT('38%'); // net + players + ball, x 77-113
const GROVE = '80%'; // trees, swing and desk, x 218-319; desk at x 262-275
const SKY = AT('80%', '0%'); // sun and moon, x 225-268; anchored top so a wide screen doesn't crop them

/** Trees sway from the base; the swing and computer sway from the top. */
const FROM_BASE: CSSProperties = { ...AT(GROVE), transformOrigin: '50% 100%' };
const FROM_TOP: CSSProperties = { ...AT(GROVE), transformOrigin: '50% 0%' };

/** The moon glow is painted over everything (so the vignette can't dim it),
 *  which would put the moon and stars in front of whatever they overlap.
 *  This mask cuts the glow out wherever a mountain, the grass or a tree is
 *  opaque: a full layer minus the union of those silhouettes. Each silhouette
 *  must sit where its layer sits, so the positions mirror BG and GROVE. */
const SILHOUETTES: [src: string, pos: string][] = [
  ['mountains-back', '50% 100%'],
  ['mountains-front', '50% 100%'],
  ['grass', '50% 100%'],
  ...['tree-1-z1', 'tree-2-z1', 'tree-3-z3', 'tree-4-z3', 'tree-5-z2'].map(
    (t): [string, string] => [t, `${GROVE} 100%`],
  ),
];
const GLOW_MASK: CSSProperties = {
  maskImage: ['linear-gradient(#000 0 0)', ...SILHOUETTES.map(([s]) => `url(/assets/hero/${s}.png)`)].join(', '),
  maskPosition: ['0 0', ...SILHOUETTES.map(([, p]) => p)].join(', '),
  maskSize: 'cover',
  maskRepeat: 'no-repeat',
  // One value per layer: CSS repeats a short list, so 'subtract, add' would not do.
  maskComposite: ['subtract', ...SILHOUETTES.map(() => 'add')].join(', '),
};

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
    <img aria-hidden="true" decoding="async" src="/assets/hero/tennis-net.png" style={TENNIS} />
    <img aria-hidden="true" decoding="async" src="/assets/hero/tennis-player-1.png" style={{ ...TENNIS, animation: 'pxpersonbob 1.6s steps(4,end) infinite alternate' }} />
    <img aria-hidden="true" decoding="async" src="/assets/hero/tennis-player-2.png" style={{ ...TENNIS, animation: 'pxpersonbob 1.6s steps(4,end) infinite alternate-reverse' }} />
    <img aria-hidden="true" decoding="async" src="/assets/hero/tennis-ball.png" style={{ ...TENNIS, animation: 'pxballswing 1s steps(8,end) infinite alternate' }} />

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
  const { groupStyle, moonGlowStyle, isDark } = useTheme();
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
        <img aria-hidden="true" decoding="async" src="/assets/hero/sun.png" style={{ ...SKY, animation: 'pxsunglow 8s steps(8,end) infinite' }} />
      </div>

      {/* 4  night sky — tape group */}
      <div aria-hidden="true" className="rc-tape" style={{ ...GROUP, ...dark }}>
        <img aria-hidden="true" decoding="async" src="/assets/hero/sky-night.png" style={LAYER} />
      </div>

      {/* 5-6  stars and moon — tape group */}
      <div aria-hidden="true" className="rc-tape" style={{ ...GROUP, ...dark }}>
        <img aria-hidden="true" decoding="async" src="/assets/hero/stars.png" style={{ ...LAYER, animation: 'pxstartwinkle 8.5s steps(9,end) infinite' }} />
        <img aria-hidden="true" decoding="async" src="/assets/hero/moon.png" style={{ ...SKY, animation: 'pxmoonglow 9s steps(8,end) infinite' }} />
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
      <div aria-hidden="true" style={{ ...GROUP, ...GLOW_MASK, mixBlendMode: 'screen', ...moonGlowStyle }}>
        <img aria-hidden="true" decoding="async" src="/assets/hero/stars.png" style={{ ...LAYER, animation: 'pxstartwinkle 8.5s steps(9,end) infinite' }} />
        <img aria-hidden="true" decoding="async" src="/assets/hero/moon.png" style={{ ...SKY, animation: 'pxmoonglow 9s steps(8,end) infinite' }} />
      </div>
    </div>
  );
}
