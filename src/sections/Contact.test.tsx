import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ThemeProvider } from '../hooks/useTheme';
import { Contact } from './Contact';

vi.mock('../lib/contact', () => ({
  WEB3FORMS_ENDPOINT: 'https://api.web3forms.com/submit',
  submitContactForm: vi.fn(),
}));
import { submitContactForm } from '../lib/contact';

function setViewport(isMobile: boolean) {
  vi.stubGlobal('matchMedia', (q: string) => ({
    matches: isMobile, media: q,
    addEventListener: vi.fn(), removeEventListener: vi.fn(),
    addListener: vi.fn(), removeListener: vi.fn(), dispatchEvent: vi.fn(), onchange: null,
  }));
}

const renderContact = () => render(<ThemeProvider><Contact /></ThemeProvider>);

async function fillForm(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByLabelText('Name'), 'Ada');
  await user.type(screen.getByLabelText('Email'), 'ada@example.com');
  await user.type(screen.getByLabelText('Message'), 'Hello there');
}

beforeEach(() => {
  localStorage.clear();
  vi.clearAllMocks();
  vi.unstubAllGlobals();
  setViewport(false);
});

describe('Contact layout', () => {
  it('is a bg-coloured section with id="contact" and order 4', () => {
    const { container } = renderContact();
    const section = container.querySelector('#contact') as HTMLElement;
    expect(section.style.order).toBe('4');
    expect(section.style.background).toBe('var(--color-bg)');
  });

  it('renders the heading, subtitle and the three labelled fields', () => {
    renderContact();
    const heading = screen.getByRole('heading', { level: 2 });
    expect(heading).toHaveTextContent('Contact Me');
    // Verify heading has the large green heading style matching other sections
    expect(heading.style.fontSize).toMatch(/clamp/);
    // Browser normalizes #A9BF6D to rgb(169, 191, 109)
    expect(heading.style.color).toMatch(/rgb\(169,\s*191,\s*109\)|#A9BF6D/);
    expect(screen.getByText('Feel free to reach out about the work I do!')).toBeInTheDocument();
    expect(screen.getByLabelText('Name')).toHaveClass('pixel-input');
    expect(screen.getByLabelText('Email')).toHaveAttribute('type', 'email');
    expect(screen.getByLabelText('Message')).toHaveAttribute('rows', '5');
  });

  it('mounts the beach scene at full height on desktop', () => {
    const { container } = renderContact();
    expect(container.querySelector('img[src="/assets/contact/waves-front.png"]')).toBeTruthy();
    const panel = container.querySelector('img[src="/assets/contact/sky-day.png"]')!
      .closest('div[style*="border"]') as HTMLElement;
    expect(panel.style.height).toBe('100%');
  });

  it('gives the scene a literal 340px on mobile', () => {
    setViewport(true);
    const { container } = renderContact();
    const panel = container.querySelector('img[src="/assets/contact/sky-day.png"]')!
      .closest('div[style*="border"]') as HTMLElement;
    expect(panel.style.height).toBe('340px');
  });

  it('uses correct spacing: gap 48px and marginTop 44px', () => {
    const { container } = renderContact();
    const grid = container.querySelector('section#contact div[style*="display: grid"]') as HTMLElement;
    expect(grid.style.gap).toBe('48px');
    expect(grid.style.marginTop).toBe('44px');
  });

  it('renders the footer below the section', () => {
    renderContact();
    expect(screen.getByText('© 2026 RYAN CHAN')).toBeInTheDocument();
  });

  it('positions the footer as a direct sibling of the padding wrapper, not nested inside', () => {
    const { container } = renderContact();
    const section = container.querySelector('#contact') as HTMLElement;
    const footerDiv = Array.from(section.children).find(
      (child) => (child as HTMLElement).style.background === 'var(--color-surface)' &&
                   (child as HTMLElement).style.marginTop === '80px'
    ) as HTMLElement;
    expect(footerDiv).toBeTruthy();
    expect(footerDiv.parentElement).toBe(section);
  });
});

describe('Contact submission', () => {
  it('starts idle with an enabled Send Message button', () => {
    renderContact();
    const btn = screen.getByRole('button', { name: /Send Message/ });
    expect(btn).toBeEnabled();
    expect(btn).toHaveAttribute('type', 'submit');
  });

  it('shows SENDING… while the request is in flight', async () => {
    let resolve!: () => void;
    vi.mocked(submitContactForm).mockReturnValue(new Promise<void>((r) => { resolve = r; }));
    const user = userEvent.setup();
    renderContact();
    await fillForm(user);
    await user.click(screen.getByRole('button', { name: /Send Message/ }));

    const btn = screen.getByRole('button', { name: /SENDING/ });
    expect(btn).toBeDisabled();
    resolve();
    await waitFor(() => expect(screen.getByRole('status')).toBeInTheDocument());
  });

  it('sends the entered values', async () => {
    vi.mocked(submitContactForm).mockResolvedValue(undefined);
    const user = userEvent.setup();
    renderContact();
    await fillForm(user);
    await user.click(screen.getByRole('button', { name: /Send Message/ }));
    await waitFor(() =>
      expect(submitContactForm).toHaveBeenCalledWith({
        name: 'Ada', email: 'ada@example.com', message: 'Hello there',
      }),
    );
  });

  it('replaces the form with the success toast', async () => {
    vi.mocked(submitContactForm).mockResolvedValue(undefined);
    const user = userEvent.setup();
    renderContact();
    await fillForm(user);
    await user.click(screen.getByRole('button', { name: /Send Message/ }));

    const toast = await screen.findByRole('status');
    expect(toast).toHaveTextContent("Message sent! Thank you. I'll respond ASAP!");
    expect(toast.querySelector('.pixel-toast')).toHaveClass('pixel-toast--success');
    expect(screen.queryByRole('button', { name: /Send Message/ })).toBeNull();
    expect(screen.getByRole('button', { name: /Send Another/ })).toBeInTheDocument();
  });

  it('clears all three fields on Send Another', async () => {
    vi.mocked(submitContactForm).mockResolvedValue(undefined);
    const user = userEvent.setup();
    renderContact();
    await fillForm(user);
    await user.click(screen.getByRole('button', { name: /Send Message/ }));
    await user.click(await screen.findByRole('button', { name: /Send Another/ }));

    expect(screen.getByLabelText('Name')).toHaveValue('');
    expect(screen.getByLabelText('Email')).toHaveValue('');
    expect(screen.getByLabelText('Message')).toHaveValue('');
  });

  it('shows the danger toast on failure and keeps the fields', async () => {
    vi.mocked(submitContactForm).mockRejectedValue(
      new Error('The contact form is not configured yet. Please email me directly.'),
    );
    const user = userEvent.setup();
    renderContact();
    await fillForm(user);
    await user.click(screen.getByRole('button', { name: /Send Message/ }));

    const toast = await screen.findByRole('status');
    expect(toast).toHaveTextContent(/not configured yet/);
    expect(toast.querySelector('.pixel-toast')).toHaveClass('pixel-toast--danger');
    expect(screen.getByLabelText('Name')).toHaveValue('Ada');
  });

  it('returns to idle on retry with the fields intact', async () => {
    vi.mocked(submitContactForm).mockRejectedValue(new Error('nope'));
    const user = userEvent.setup();
    renderContact();
    await fillForm(user);
    await user.click(screen.getByRole('button', { name: /Send Message/ }));
    await user.click(await screen.findByRole('button', { name: /Try Again/ }));

    expect(screen.getByRole('button', { name: /Send Message/ })).toBeEnabled();
    expect(screen.getByLabelText('Message')).toHaveValue('Hello there');
  });
});
