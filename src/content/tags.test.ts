import { describe, expect, it } from 'vitest';
import { TAG_COLORS, TAG_ICONS, tagColor, tagIcon } from './tags';

describe('tagIcon', () => {
  it('resolves a simpleicons slug to the vendored file', () => {
    expect(tagIcon('Python')).toBe('/icons/tags/python.svg');
  });

  it('resolves the vendored AWS raster icon', () => {
    expect(tagIcon('AWS')).toBe('/icons/tags/amazon-web-services.png');
  });

  it('returns empty string for the intentionally unmapped tags', () => {
    // D6 vendoring gap: Premiere Pro and After Effects have no fetchable icon slugs.
    // The other 10 tags (YouTube, Motion, etc.) are unmapped by original design.
    for (const t of ['YouTube', 'Motion', 'Writing', 'Trailer', 'Sound', 'Client', 'Piano', 'Music', 'Origami', 'Craft', 'Premiere Pro', 'After Effects']) {
      expect(tagIcon(t)).toBe('');
    }
  });

  it('maps the two aliased names onto their base icons', () => {
    expect(tagIcon('TypeScript / JavaScript')).toBe('/icons/tags/typescript.svg');
    expect(tagIcon('HTML / CSS')).toBe('/icons/tags/html5.svg');
  });
});

describe('tagColor', () => {
  it('returns the mapped hex', () => {
    expect(tagColor('Docker')).toBe('#2496ED');
  });

  it('falls back to currentColor for unmapped tags', () => {
    expect(tagColor('Origami')).toBe('currentColor');
    expect(tagColor('')).toBe('currentColor');
  });

  it('returns the mapped color for tags without icons', () => {
    // Premiere Pro and After Effects have colors but no vendored icons
    expect(tagColor('Premiere Pro')).toBe('#9999FF');
    expect(tagColor('After Effects')).toBe('#9999FF');
  });
});

describe('the lookup tables', () => {
  it('have the correct entry counts with matching keys', () => {
    // TAG_ICONS has 22 entries (Premiere Pro and After Effects removed due to D6 gap)
    // TAG_COLORS has 24 entries (both included for color coverage)
    expect(Object.keys(TAG_ICONS)).toHaveLength(22);
    expect(Object.keys(TAG_COLORS)).toHaveLength(24);
    // TAG_ICONS keys are a subset of TAG_COLORS keys
    expect(Object.keys(TAG_ICONS).every(k => k in TAG_COLORS)).toBe(true);
  });
});
