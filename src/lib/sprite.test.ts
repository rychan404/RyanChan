import { describe, expect, it } from 'vitest';
import { FH, FPS, FW, N, spriteFrameStyle } from './sprite';

describe('the sprite constants', () => {
  it('match about-sprite.png at 3808 x 61', () => {
    expect(FW).toBe(56);
    expect(FH).toBe(61);
    expect(N).toBe(68);
    expect(N * FW).toBe(3808);
    expect(FPS).toBe(12);
  });
});

describe('spriteFrameStyle', () => {
  it('scales by a whole number to cover a square panel and centres horizontally', () => {
    // 380x380 panel: max(380/56, 380/61) = 6.7857…, rounded up to 7
    const { backgroundSize, backgroundPosition } = spriteFrameStyle(380, 380, 0);
    const bw = 56 * 7;
    const bh = 61 * 7;
    expect(backgroundSize).toBe(`${68 * bw}px ${bh}px`);
    expect(backgroundPosition).toBe(`${Math.round((380 - bw) / 2)}px ${Math.round((380 - bh) * 0.1)}px`);
  });

  it('steps left by one frame width per frame', () => {
    const f0 = spriteFrameStyle(280, 280, 0);
    const f1 = spriteFrameStyle(280, 280, 1);
    const bw = 56 * Math.ceil(Math.max(280 / 56, 280 / 61));
    const x = (s: string) => parseFloat(s.split(' ')[0]);
    expect(x(f0.backgroundPosition) - x(f1.backgroundPosition)).toBeCloseTo(bw, 6);
  });

  it('keeps backgroundSize constant across frames', () => {
    expect(spriteFrameStyle(300, 300, 0).backgroundSize)
      .toBe(spriteFrameStyle(300, 300, 67).backgroundSize);
  });

  it('offsets vertically by 10% of the overflow, not by half', () => {
    const { backgroundPosition } = spriteFrameStyle(200, 400, 0);
    const bh = 61 * Math.ceil(Math.max(200 / 56, 400 / 61));
    expect(parseFloat(backgroundPosition.split(' ')[1])).toBe(Math.round((400 - bh) * 0.1));
  });

  it('is safe on a zero-sized container', () => {
    expect(() => spriteFrameStyle(0, 0, 0)).not.toThrow();
  });
});
