import { describe, expect, it } from 'vitest';
import {
  aboutGridCols, backBtnPad, contactGridCols, contactSceneHeight, contentPadBody,
  contentPadTop, detailHeadingShadow, footerPad, heroNameShadow, heroPad, heroShift,
  logoBorderW, logoFontSize, mainStyle, navStyle, notFoundPad, projGridCols,
  sectionHeadingShadow,
} from './responsive';

describe('navStyle', () => {
  it('is an 88px fixed left rail on desktop', () => {
    const s = navStyle(false, 'home');
    expect(s.position).toBe('fixed');
    expect(s.width).toBe('88px');
    expect(s.flexDirection).toBe('column');
    expect(s.zIndex).toBe(60);
    expect(s.borderRight).toContain('var(--border-thick) solid');
  });

  it('is a 64px fixed top bar on mobile', () => {
    const s = navStyle(true, 'home');
    expect(s.height).toBe('64px');
    expect(s.flexDirection).toBe('row');
    expect(s.borderRight).toBe('none');
    expect(s.borderBottom).toContain('var(--border-thick) solid');
  });

  it('scrolls only on the home route, where the rail can overflow', () => {
    expect(navStyle(false, 'home').overflowY).toBe('auto');
    expect(navStyle(false, 'home').scrollbarWidth).toBe('none');
    expect(navStyle(false, 'detail').overflowY).toBeUndefined();
  });

  it('is identical on mobile for both routes', () => {
    expect(navStyle(true, 'home')).toEqual(navStyle(true, 'detail'));
  });
});

describe('mainStyle', () => {
  it('offsets by the rail on desktop and by the bar on mobile', () => {
    expect(mainStyle(false, 'home').marginLeft).toBe('88px');
    expect(mainStyle(true, 'home').paddingTop).toBe('64px');
    expect(mainStyle(true, 'home').marginLeft).toBe(0);
  });

  it('is a column flex container so the section order values apply', () => {
    expect(mainStyle(false, 'home').display).toBe('flex');
    expect(mainStyle(false, 'home').flexDirection).toBe('column');
  });

  it('adds min-height only on the detail route', () => {
    expect(mainStyle(false, 'detail').minHeight).toBe('100vh');
    expect(mainStyle(false, 'home').minHeight).toBeUndefined();
  });
});

describe('the hero and heading measurements', () => {
  it('shifts the hero content further up on desktop', () => {
    expect(heroShift(false)).toBe('translateY(-110px)');
    expect(heroShift(true)).toBe('translateY(-40px)');
  });

  it('pads the hero differently per viewport', () => {
    expect(heroPad(false).padding).toBe('96px 56px 120px');
    expect(heroPad(true).padding).toBe('56px 20px 72px');
  });

  it('uses a 9-part text-shadow at 6px desktop / 3px mobile for the name', () => {
    expect(heroNameShadow(false).split(',')).toHaveLength(9);
    expect(heroNameShadow(false)).toContain('-6px -6px 0 var(--color-heading-shadow)');
    expect(heroNameShadow(false)).toContain('10px 10px 0 var(--color-heading-shadow)');
    expect(heroNameShadow(true)).toContain('-3px -3px 0 var(--color-heading-shadow)');
    expect(heroNameShadow(true)).toContain('5px 5px 0 var(--color-heading-shadow)');
  });

  it('uses 4px desktop / 2px mobile for section headings', () => {
    expect(sectionHeadingShadow(false)).toContain('-4px -4px 0 var(--color-heading-shadow)');
    expect(sectionHeadingShadow(false)).toContain('6px 6px 0 var(--color-heading-shadow)');
    expect(sectionHeadingShadow(true)).toContain('3px 3px 0 var(--color-heading-shadow)');
  });

  it('uses 3px desktop / 2px mobile on the detail page heading', () => {
    expect(detailHeadingShadow(false)).toContain('-3px -3px 0 var(--color-heading-shadow)');
    expect(detailHeadingShadow(false)).toContain('5px 5px 0 var(--color-heading-shadow)');
    expect(detailHeadingShadow(true)).toEqual(sectionHeadingShadow(true));
  });
});

describe('the grid columns', () => {
  it('collapses every grid to one column on mobile', () => {
    expect(projGridCols(true)).toBe('1fr');
    expect(aboutGridCols(true)).toBe('1fr');
    expect(contactGridCols(true)).toBe('1fr');
  });

  it('uses the prototype tracks on desktop', () => {
    expect(projGridCols(false)).toBe('repeat(auto-fill,minmax(330px,1fr))');
    expect(aboutGridCols(false)).toBe('repeat(auto-fit,minmax(320px,1fr))');
    expect(contactGridCols(false)).toBe('minmax(320px,640px) minmax(320px,640px)');
  });
});

describe('contactSceneHeight', () => {
  it('is 100% on desktop, where the stretched grid row resolves it', () => {
    expect(contactSceneHeight(false)).toBe('100%');
  });

  it('is a literal 340px on mobile, where 100% would collapse', () => {
    expect(contactSceneHeight(true)).toBe('340px');
  });
});

describe('the remaining paddings', () => {
  it('matches the prototype', () => {
    expect(footerPad(false)).toBe('24px 56px');
    expect(footerPad(true)).toBe('24px 20px');
    expect(logoFontSize(false)).toBe('var(--fs-28)');
    expect(logoFontSize(true)).toBe('var(--fs-20)');
    expect(logoBorderW(false)).toBe('var(--border-thick)');
    expect(logoBorderW(true)).toBe('var(--border-mid)');
    expect(contentPadTop(false)).toBe('40px 56px 0');
    expect(contentPadTop(true)).toBe('24px 20px 0');
    expect(contentPadBody(false)).toBe('40px 56px 96px');
    expect(contentPadBody(true)).toBe('24px 20px 72px');
    expect(notFoundPad(false)).toBe('56px');
    expect(notFoundPad(true)).toBe('20px');
    expect(backBtnPad(false)).toBe('8px 14px');
    expect(backBtnPad(true)).toBe('10px');
  });
});
