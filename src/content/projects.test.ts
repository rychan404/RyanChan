import { describe, expect, it } from 'vitest';
import { TEST_PROJECTS as PROJECTS } from '../test-projects';
import {
  DEFAULT_FILTER, FILTER_LABELS, filterProjects, toProject, type ProjectData,
} from './projects';

const find = (id: string) => PROJECTS.find((p) => p.id === id)!;

describe('the nine seed projects', () => {
  it('all load', () => {
    expect(PROJECTS).toHaveLength(19);
  });

  it('sort newest first by year, not by directory prefix', () => {
    expect(PROJECTS.map((p) => p.year)).toEqual([
      'SEP 2026', 'JUN 2026', 'FEB 2026', 'JAN 2026', 'NOV 2025', 'SEP 2025', 'JUL 2025', 'MAY 2025', 'APR 2025',
    ]);
    expect(PROJECTS.map((p) => p.id)).toEqual([
      'tilebreaker', 'loopline', 'dust-and-neon', 'piano-covers', 'devlog-series',
      'nightshift', 'terra-nova-trailer', 'origami-sculptures', 'pixelforge',
    ]);
  });

  it('carries the frontmatter verbatim for a representative project', () => {
    const p = find('loopline');
    expect(p.kind).toBe('code');
    expect(p.title).toBe('Loopline');
    expect(p.year).toBe('JUN 2026');
    expect(p.tags).toEqual(['Docker']);
    expect(p.role).toBe('Maintainer');
    expect(p.links).toBeUndefined();
    expect(p.image).toBeUndefined();
  });
});

describe('toProject', () => {
  const data: ProjectData = find('loopline');

  it('takes the slug and order from the directory name', () => {
    expect(toProject('10-my-thing', data)).toMatchObject({ id: 'my-thing', order: 10 });
  });

  it('rejects a directory without a numeric prefix', () => {
    expect(() => toProject('my-thing', data)).toThrow('needs a numeric prefix');
  });
});

describe('filterProjects', () => {
  it('returns everything for "all"', () => {
    expect(filterProjects(PROJECTS, 'all')).toHaveLength(19);
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
    expect(filterProjects(PROJECTS, 'code').map((p) => p.id)).toEqual(['tilebreaker', 'loopline', 'nightshift', 'pixelforge']);
  });
});

describe('filter presentation', () => {
  it('defaults to all', () => {
    expect(DEFAULT_FILTER).toBe('all');
  });

  it('labels every filter', () => {
    expect(FILTER_LABELS).toEqual({ all: 'All', code: 'Code', video: 'Video', misc: 'Misc' });
  });
});
