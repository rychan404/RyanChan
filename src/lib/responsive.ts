import type { CSSProperties } from 'react';

export type Route = 'home' | 'detail';

/** The --px-edge fallback the prototype repeats on every surface-coloured
 *  border. Kept as one constant so a typo cannot desync two call sites. */
export const PX_EDGE_SURFACE =
  'var(--px-edge, hsl(from var(--color-surface) calc(h + 36) calc(s * 1.15) calc(l * 0.3)))';

/** The primary-coloured edge for the nav logo and contact form button.
 *  Kept as one constant so a typo cannot desync multiple call sites. */
export const PRIMARY_EDGE =
  'hsl(from var(--color-primary) calc(h + 36) calc(s * 1.15) calc(l * 0.3))';

const SHADOW9 = (n: number, drop: number) =>
  [
    `-${n}px -${n}px 0 #216C50`, `${n}px -${n}px 0 #216C50`,
    `-${n}px ${n}px 0 #216C50`, `${n}px ${n}px 0 #216C50`,
    `-${n}px 0 0 #216C50`, `${n}px 0 0 #216C50`,
    `0 -${n}px 0 #216C50`, `0 ${n}px 0 #216C50`,
    `${drop}px ${drop}px 0 #216C50`,
  ].join(',');

export function navStyle(isMobile: boolean, route: Route): CSSProperties {
  if (isMobile) {
    return {
      position: 'fixed', left: 0, top: 0, right: 0, bottom: 'auto',
      width: '100%', height: '64px',
      background: 'var(--color-surface)',
      borderRight: 'none',
      borderBottom: `4px solid ${PX_EDGE_SURFACE}`,
      display: 'flex', flexDirection: 'row',
      alignItems: 'center', justifyContent: 'space-between',
      padding: '0 16px', zIndex: 60,
    };
  }
  return {
    position: 'fixed', left: 0, top: 0, bottom: 0, width: '88px',
    background: 'var(--color-surface)',
    // The home rail can overflow on a short viewport; the detail rail cannot,
    // and the prototype does not give it these two declarations.
    ...(route === 'home' ? { overflowY: 'auto' as const, scrollbarWidth: 'none' as const } : {}),
    borderRight: `4px solid ${PX_EDGE_SURFACE}`,
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    padding: '16px 0 12px', zIndex: 60,
  };
}

export function mainStyle(isMobile: boolean, route: Route): CSSProperties {
  return {
    marginLeft: isMobile ? 0 : '88px',
    ...(isMobile ? { paddingTop: '64px' } : {}),
    ...(route === 'detail' ? { minHeight: '100vh' } : {}),
    display: 'flex',
    flexDirection: 'column',
  };
}

export const heroPad = (isMobile: boolean): CSSProperties => ({
  padding: isMobile ? '56px 20px 72px' : '96px 56px 120px',
});

export const heroShift = (isMobile: boolean) =>
  isMobile ? 'translateY(-40px)' : 'translateY(-110px)';

export const footerPad = (isMobile: boolean) => (isMobile ? '24px 20px' : '24px 56px');
export const logoFontSize = (isMobile: boolean) => (isMobile ? '20px' : '28px');
export const logoBorderW = (isMobile: boolean) => (isMobile ? '3px' : '4px');

export const projGridCols = (isMobile: boolean) =>
  isMobile ? '1fr' : 'repeat(auto-fill,minmax(330px,1fr))';
export const aboutGridCols = (isMobile: boolean) =>
  isMobile ? '1fr' : 'repeat(auto-fit,minmax(320px,1fr))';
export const contactGridCols = (isMobile: boolean) =>
  isMobile ? '1fr' : 'minmax(320px,640px) minmax(320px,640px)';

/** 100% only resolves inside the desktop two-column stretched grid row;
 *  on mobile the row is auto-height and 100% collapses, so 340px is literal. */
export const contactSceneHeight = (isMobile: boolean) => (isMobile ? '340px' : '100%');

export const heroNameShadow = (isMobile: boolean) =>
  isMobile ? SHADOW9(3, 5) : SHADOW9(6, 10);
export const sectionHeadingShadow = (isMobile: boolean) =>
  isMobile ? SHADOW9(2, 3) : SHADOW9(4, 6);
export const detailHeadingShadow = (isMobile: boolean) =>
  isMobile ? SHADOW9(2, 3) : SHADOW9(3, 5);

export const contentPadTop = (isMobile: boolean) =>
  isMobile ? '24px 20px 0' : '40px 56px 0';
export const contentPadBody = (isMobile: boolean) =>
  isMobile ? '24px 20px 72px' : '40px 56px 96px';
export const notFoundPad = (isMobile: boolean) => (isMobile ? '20px' : '56px');
export const backBtnPad = (isMobile: boolean) => (isMobile ? '10px' : '8px 14px');
