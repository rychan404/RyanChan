import { describe, expect, it } from 'vitest';
import { SKILL_GROUPS } from './skills';
import { FACTS } from './facts';
import { tagColor, tagIcon } from './tags';

describe('SKILL_GROUPS', () => {
  it('has the prototype\'s three groups at the right sizes', () => {
    expect(SKILL_GROUPS.map((g) => [g.name, g.skills.length])).toEqual([
      ['CODE', 5],
      ['BUILD', 8],
      ['POST', 3],
    ]);
  });

  it('points each group icon at a vendored UI icon', () => {
    expect(SKILL_GROUPS.map((g) => g.icon)).toEqual([
      'ui/code-solid',
      'ui/cog-solid',
      'ui/video-camera-solid',
    ]);
  });

  it('names skills that all resolve to a tag icon and colour', () => {
    for (const g of SKILL_GROUPS) {
      for (const s of g.skills) {
        expect(tagIcon(s), `${s} should have an icon`).not.toBe('');
        expect(tagColor(s), `${s} should have a colour`).not.toBe('currentColor');
      }
    }
  });
});

describe('FACTS', () => {
  it('has the three facts in order', () => {
    expect(FACTS.map((f) => f.id)).toEqual(['barns', 'eggs', 'tennis']);
  });

  it('reassembles each sentence exactly as the prototype renders it', () => {
    const sentence = (i: number) => FACTS[i].before + FACTS[i].term + FACTS[i].after;
    expect(sentence(0)).toBe('Always passed by abandoned barns and horses in my hometown');
    expect(sentence(1)).toBe('On a quest to perfect the ultimate way to cook eggs');
    expect(sentence(2)).toBe('Would drop everything to sing my heart out to pop songs on the radio');
  });

  it('gives only the eggs fact an image', () => {
    expect(FACTS.filter((f) => f.image).map((f) => f.id)).toEqual(['eggs']);
    expect(FACTS[1].image).toBe('/assets/about/fact-eggs.png');
  });

  it('pairs the eggs image with its WebP variant', () => {
    expect(FACTS[1].imageWebp).toBe('/assets/about/fact-eggs.webp');
    expect(FACTS.filter((f) => f.imageWebp).map((f) => f.id)).toEqual(['eggs']);
  });

  it('carries the prototype\'s captions and slot hints', () => {
    expect(FACTS.map((f) => f.caption)).toEqual([
      "It's an ancient relic!",
      'I love eggs in 4 ways',
      'Riptide by Vance Joy!',
    ]);
    expect(FACTS.map((f) => f.slotHint)).toEqual([
      'Drop a hometown photo',
      'Drop an egg photo',
      'Drop a tennis photo',
    ]);
  });
});
