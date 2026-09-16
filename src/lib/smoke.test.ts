import { describe, expect, it } from 'vitest';
import { harnessReady } from './smoke';

describe('test harness', () => {
  it('runs TypeScript under vitest', () => {
    expect(harnessReady()).toBe(true);
  });

  it('has a DOM', () => {
    document.body.innerHTML = '<p id="x">hi</p>';
    expect(document.getElementById('x')?.textContent).toBe('hi');
  });
});
