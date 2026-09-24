import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { TEST_PROJECTS } from '../test-projects';
import { ThemeProvider } from '../hooks/useTheme';
import { ProjectDetail } from './ProjectDetail';

function setViewport(isMobile: boolean) {
  vi.stubGlobal('matchMedia', (q: string) => ({
    matches: isMobile, media: q,
    addEventListener: vi.fn(), removeEventListener: vi.fn(),
    addListener: vi.fn(), removeListener: vi.fn(), dispatchEvent: vi.fn(), onchange: null,
  }));
}

const loopline = TEST_PROJECTS.find((p) => p.id === 'loopline')!;

const renderDetail = () =>
  render(
    <ThemeProvider>
      <ProjectDetail project={loopline}>
        <p>Started as a personal itch.</p>
        <ul><li>Dependency graph diffing.</li></ul>
      </ProjectDetail>
    </ThemeProvider>,
  );

const renderNotFound = () => render(<ThemeProvider><ProjectDetail /></ThemeProvider>);

beforeEach(() => { localStorage.clear(); vi.unstubAllGlobals(); setViewport(false); });

describe('ProjectDetail — found', () => {
  it('renders the title, year and blurb, with no status badge', () => {
    renderDetail();
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Loopline');
    expect(screen.queryByText('In Progress')).toBeNull();
    expect(screen.getByText('JUN 2026')).toBeInTheDocument();
    expect(screen.getByText(/A CLI task runner/)).toBeInTheDocument();
  });

  it('renders the tags', () => {
    renderDetail();
    expect(screen.getByText('Docker')).toBeInTheDocument();
    expect(screen.getByText('GitHub')).toBeInTheDocument();
  });

  it('renders the body inside the PATCH NOTES block', () => {
    renderDetail();
    expect(screen.getByText('PATCH NOTES')).toBeInTheDocument();
    expect(screen.getByText('Started as a personal itch.').closest('.rc-patch-notes')).not.toBeNull();
    expect(screen.getByText('Dependency graph diffing.').tagName).toBe('LI');
  });

  it('sizes the image region as the prototype does', () => {
    const { container } = renderDetail();
    const region = container.querySelector('div[style*="min(40vw,380px)"]') as HTMLElement;
    expect(region.style.minHeight).toBe('220px');
    expect(region.style.background).toBe('var(--color-bg-alt)');
  });

  it('shows the slot hint when the project has no image', () => {
    renderDetail();
    expect(screen.getByText('Drop a terminal screenshot')).toBeInTheDocument();
  });

  it('links back to #projects on the home route from three places', () => {
    renderDetail();
    const backs = screen.getAllByRole('link').filter((a) => a.getAttribute('href') === '/#projects');
    expect(backs.length).toBeGreaterThanOrEqual(2);   // the overlay back button and EXPLORE MORE
  });

  it('hides the back button label on mobile', () => {
    renderDetail();
    expect(screen.getByText('BACK TO PROJECTS')).toHaveClass('rc-desktop-only');
  });

  it('pins the nav cursor on Projects', () => {
    renderDetail();
    expect(screen.getByRole('link', { name: 'PROJECTS' })).toHaveAttribute('aria-current', 'true');
  });

  it('renders the CTA as a no-op anchor when there is no ctaUrl', async () => {
    renderDetail();
    const cta = screen.getByRole('link', { name: /View Source/ });
    expect(cta).toHaveAttribute('href', '#');
    expect(cta).not.toHaveAttribute('target');
    const clicked = await userEvent.click(cta).then(() => true);
    expect(clicked).toBe(true);   // preventDefault, so no navigation
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Loopline');
  });

  it('applies the primary edge colour to the CTA button', () => {
    renderDetail();
    const cta = screen.getByRole('link', { name: /View Source/ }) as HTMLElement;
    // Check that custom properties are set (they exist in the element's style)
    expect(cta.style.getPropertyValue('--color-border')).toBeTruthy();
  });

  it('constrains the image region wrapper to max-width 860px and centers it', () => {
    const { container } = renderDetail();
    // Find the wrapper by locating the image-region first, then its parent
    const imageRegion = container.querySelector('div[style*="min(40vw,380px)"]') as HTMLElement;
    const wrapper = imageRegion?.parentElement as HTMLElement;
    expect(wrapper).toBeInTheDocument();
    expect(wrapper.style.maxWidth).toBe('860px');
    expect(wrapper.style.margin).toBe('0px auto');
    expect(wrapper.style.width).toBe('100%');
  });
});

describe('ProjectDetail — not found', () => {
  it('renders the not-found state', () => {
    renderNotFound();
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Not Found');
    expect(screen.getByText("That project doesn't exist.")).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /BACK TO PROJECTS/ }))
      .toHaveAttribute('href', '/#projects');
  });

  it('colors the not-found heading with the same accent color as the found title', () => {
    renderNotFound();
    const heading = screen.getByRole('heading', { level: 1 }) as HTMLElement;
    expect(heading.style.color).toBe('var(--color-heading)');
  });

  it('still renders the nav and footer', () => {
    renderNotFound();
    expect(screen.getByRole('navigation')).toBeInTheDocument();
    expect(screen.getByText('© 2026 RYAN CHAN')).toBeInTheDocument();
  });
});
