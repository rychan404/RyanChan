import { describe, expect, it } from 'vitest';
import {
  DEFAULT_FILTER,
  FILTER_LABELS,
  PROJECTS,
  filterProjects,
  findProject,
} from './projects';

describe('the nine seed projects', () => {
  it('all parse and compile', () => {
    expect(PROJECTS).toHaveLength(9);
  });

  it('sort by numeric prefix, not by filesystem order', () => {
    expect(PROJECTS.map((p) => p.order)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9]);
    expect(PROJECTS.map((p) => p.id)).toEqual([
      'tilebreaker', 'loopline', 'nightshift', 'pixelforge', 'dust-and-neon',
      'devlog-series', 'terra-nova-trailer', 'piano-covers', 'origami-sculptures',
    ]);
  });

  it('carries the prototype content verbatim for a representative project', () => {
    const p = findProject('loopline')!;
    expect(p.kind).toBe('code');
    expect(p.title).toBe('Loopline');
    expect(p.year).toBe('JUN 2026');
    expect(p.status).toBe('In Progress');
    expect(p.statusCls).toBe('pixel-badge--warning');
    expect(p.tags).toEqual(['Docker', 'GitHub']);
    expect(p.role).toBe('Maintainer');
    expect(p.stack).toBe('Rust, tokio, notify');
    expect(p.cta).toBe('View Source');
    expect(p.ctaUrl).toBeUndefined();
    expect(p.image).toBeUndefined();
    expect(p.notes[0]).toEqual({
      p: 'Started as a personal itch — I was tired of rerunning a full test suite after changing one file. Loopline watches the filesystem, builds a dependency graph of what actually depends on what, and only reruns the slice of work that changed.',
    });
    expect(p.notes.slice(1)).toEqual([
      'Dependency graph diffing cut my own build loop from 40s to under 3s.',
      'Config is a twelve-line TOML file — no plugin system, on purpose.',
      'Currently at 190 stars and four outside contributors.',
    ]);
  });

  it('derives statusCls consistently across all nine', () => {
    for (const p of PROJECTS) {
      expect(p.statusCls).toBe(p.status === 'In Progress' ? 'pixel-badge--warning' : '');
    }
  });

  it('preserves the double quotes inside the nightshift bullet', () => {
    expect(findProject('nightshift')!.notes).toContain(
      'Timezone parsing accepts anything from "9pm PST" to "tomorrow morning".',
    );
  });
});

describe('findProject', () => {
  it('finds a project by slug', () => {
    expect(findProject('tilebreaker')?.title).toBe('Tilebreaker');
  });

  it('returns undefined for an unknown slug', () => {
    expect(findProject('does-not-exist')).toBeUndefined();
    expect(findProject('')).toBeUndefined();
  });
});

describe('filterProjects', () => {
  it('returns everything for "all"', () => {
    expect(filterProjects(PROJECTS, 'all')).toHaveLength(9);
  });

  it('splits the nine seed projects 4 / 3 / 2', () => {
    expect(filterProjects(PROJECTS, 'code').map((p) => p.id)).toEqual([
      'tilebreaker', 'loopline', 'nightshift', 'pixelforge',
    ]);
    expect(filterProjects(PROJECTS, 'video').map((p) => p.id)).toEqual([
      'dust-and-neon', 'devlog-series', 'terra-nova-trailer',
    ]);
    expect(filterProjects(PROJECTS, 'misc').map((p) => p.id)).toEqual([
      'piano-covers', 'origami-sculptures',
    ]);
  });

  it('preserves order within a filter', () => {
    const codes = filterProjects(PROJECTS, 'code');
    expect(codes.map((p) => p.order)).toEqual([1, 2, 3, 4]);
  });
});

describe('filter presentation', () => {
  it('defaults to code, not all', () => {
    expect(DEFAULT_FILTER).toBe('code');
  });

  it('labels every filter', () => {
    expect(FILTER_LABELS).toEqual({ all: 'All', code: 'Code', video: 'Video', misc: 'Misc' });
  });
});
