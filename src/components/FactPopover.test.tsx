import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { FACTS } from '../content/facts';
import { FactPopover } from './FactPopover';

const barns = FACTS[0];
const eggs = FACTS[1];

describe('FactPopover', () => {
  it('renders the sentence with the term as a button-like span', () => {
    render(<FactPopover fact={barns} open={false} onToggle={vi.fn()} onClose={vi.fn()} />);
    expect(screen.getByText('barns')).toHaveClass('rc-fact-term');
    expect(document.body.textContent).toContain('Always passed by abandoned');
    expect(document.body.textContent).toContain('and horses in my hometown');
  });

  it('shows nothing extra when closed', () => {
    render(<FactPopover fact={barns} open={false} onToggle={vi.fn()} onClose={vi.fn()} />);
    expect(screen.queryByText("It's an ancient relic!")).toBeNull();
  });

  it('shows the caption, a slot and a close button when open', () => {
    render(<FactPopover fact={barns} open onToggle={vi.fn()} onClose={vi.fn()} />);
    expect(screen.getByText("It's an ancient relic!")).toBeInTheDocument();
    expect(screen.getByText('Drop a hometown photo')).toBeInTheDocument();
    expect(screen.getByTitle('Close')).toBeInTheDocument();
  });

  it('shows the image instead of the slot when the fact has one', () => {
    render(<FactPopover fact={eggs} open onToggle={vi.fn()} onClose={vi.fn()} />);
    expect(screen.getByRole('img')).toHaveAttribute('src', '/assets/about/fact-eggs.webp');
    expect(screen.queryByText('Drop an egg photo')).toBeNull();
  });

  it('reports its state with aria-expanded', () => {
    const { rerender } = render(
      <FactPopover fact={barns} open={false} onToggle={vi.fn()} onClose={vi.fn()} />,
    );
    expect(screen.getByText('barns')).toHaveAttribute('aria-expanded', 'false');
    rerender(<FactPopover fact={barns} open onToggle={vi.fn()} onClose={vi.fn()} />);
    expect(screen.getByText('barns')).toHaveAttribute('aria-expanded', 'true');
  });

  it('toggles on click and closes on the close button', async () => {
    const onToggle = vi.fn();
    const onClose = vi.fn();
    render(<FactPopover fact={barns} open onToggle={onToggle} onClose={onClose} />);
    await userEvent.click(screen.getByText('barns'));
    expect(onToggle).toHaveBeenCalledOnce();
    await userEvent.click(screen.getByTitle('Close'));
    expect(onClose).toHaveBeenCalledOnce();
  });
});
