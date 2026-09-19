/** about-sprite.png is a single 3808 x 61 strip of 68 frames, 56px each. */
export const FW = 56;
export const FH = 61;
export const N = 68;
export const FPS = 12;

/** Cover-fit one frame in a container, biased 10% down rather than centred
 *  vertically so the walk cycle's feet stay in the panel. The scale is rounded
 *  up to a whole number and offsets to whole pixels so the nearest-neighbour
 *  upscale stays crisp: every sprite pixel maps to the same NxN screen block,
 *  and frame boundaries never land mid-pixel. */
export function spriteFrameStyle(cw: number, ch: number, frame: number) {
  const scale = Math.ceil(Math.max(cw / FW, ch / FH));
  const bw = FW * scale;
  const bh = FH * scale;
  const offX = Math.round((cw - bw) / 2);
  const offY = Math.round((ch - bh) * 0.1);
  return {
    backgroundSize: `${N * bw}px ${bh}px`,
    backgroundPosition: `${offX - frame * bw}px ${offY}px`,
  };
}
