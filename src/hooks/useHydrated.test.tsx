import { render, screen } from '@testing-library/react';
import { renderToString } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { useHydrated } from './useHydrated';

function Probe() {
  return <span>{String(useHydrated())}</span>;
}

describe('useHydrated', () => {
  it('is false in a server render', () => {
    expect(renderToString(<Probe />)).toContain('false');
  });

  it('is true in a client render', () => {
    render(<Probe />);
    expect(screen.getByText('true')).toBeInTheDocument();
  });
});
