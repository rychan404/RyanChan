import { describe, expect, it } from 'vitest';
import { NAV_LOCK_MS, SECTIONS, activeIndexFor, xpFor } from './scrollSpy';

// A plausible page: five sections, 1000px viewport, so the active line is
// scrollY + 350.
const TOPS = [0, 1200, 2600, 4400, 5600];
const VH = 1000;

describe('SECTIONS', () => {
  it('is in RENDERED order, which is not DOM order', () => {
    expect(SECTIONS).toEqual(['home', 'about', 'projects', 'skills', 'contact']);
  });
});

describe('activeIndexFor', () => {
  it('starts on home', () => {
    expect(activeIndexFor(TOPS, 0, VH)).toBe(0);
  });

  it('picks the last section whose top is at or above the 35% line', () => {
    expect(activeIndexFor(TOPS, 900, VH)).toBe(1);    // line 1250 >= 1200
    expect(activeIndexFor(TOPS, 2300, VH)).toBe(2);   // line 2650 >= 2600
    expect(activeIndexFor(TOPS, 4100, VH)).toBe(3);   // line 4450 >= 4400
    expect(activeIndexFor(TOPS, 5300, VH)).toBe(4);   // line 5650 >= 5600
  });

  it('does not advance while the line is still short of the next top', () => {
    expect(activeIndexFor(TOPS, 849, VH)).toBe(0);    // line 1199 < 1200
  });

  it('stays on the last section past the end of the page', () => {
    expect(activeIndexFor(TOPS, 99_999, VH)).toBe(4);
  });

  it('returns 0 for an empty section list', () => {
    expect(activeIndexFor([], 500, VH)).toBe(0);
  });
});

describe('xpFor', () => {
  // Five sections, 1000px apart, 800px viewport: the 35% line sits 280px down.
  const tops = [0, 1000, 2000, 3000, 4000];
  const max = 4600;

  it('is empty at the top of the page', () => {
    expect(xpFor(tops, 0, 800, max)).toBe(0);
  });

  it('is a whole number of fifths when the line sits on a section top', () => {
    expect(xpFor(tops, 2000 - 280, 800, max)).toBeCloseTo(2 / 5);
  });

  it('fills the current fifth by how far the line is through the section', () => {
    expect(xpFor(tops, 1500 - 280, 800, max)).toBeCloseTo(1.5 / 5);
  });

  it('is full at the bottom of the page', () => {
    expect(xpFor(tops, max, 800, max)).toBe(1);
  });

  it('returns 0 for an empty section list', () => {
    expect(xpFor([], 0, 800, 0)).toBe(0);
  });
});

describe('NAV_LOCK_MS', () => {
  it('is 900ms, long enough to outlast a smooth scroll', () => {
    expect(NAV_LOCK_MS).toBe(900);
  });
});
