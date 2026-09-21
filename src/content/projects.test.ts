import { describe, expect, it } from 'vitest';
import { TEST_PROJECTS as PROJECTS } from '../test-projects';
import {
  DEFAULT_FILTER, FILTER_LABELS, filterProjects, toProject, type ProjectData,
} from './projects';

const find = (id: string) => PROJECTS.find((p) => p.id === id)!;

describe('the nine seed projects', () => {
  it('all load', () => {
    expect(PROJECTS).toHaveLength(9);
  });

  it('sort by numeric prefix, not by filesystem order', () => {
    expect(PROJECTS.map((p) => p.order)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9]);
    expect(PROJECTS.map((p) => p.id)).toEqual([
      'tilebreaker', 'loopline', 'nightshift', 'pixelforge', 'dust-and-neon',
      'devlog-series', 'terra-nova-trailer', 'piano-covers', 'origami-sculptures',
    ]);
  });

  it('carries the frontmatter verbatim for a representative project', () => {
    const p = find('loopline');
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
  });

  it('derives statusCls consistently across all nine', () => {
    for (const p of PROJECTS) {
      expect(p.statusCls).toBe(p.status === 'In Progress' ? 'pixel-badge--warning' : '');
    }
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
    expect(filterProjects(PROJECTS, 'code').map((p) => p.order)).toEqual([1, 2, 3, 4]);
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
