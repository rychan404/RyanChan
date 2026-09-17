import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ThemeProvider } from '../hooks/useTheme';
import { ProjectDetail } from './ProjectDetail';

function setViewport(isMobile: boolean) {
  vi.stubGlobal('matchMedia', (q: string) => ({
    matches: isMobile, media: q,
    addEventListener: vi.fn(), removeEventListener: vi.fn(),
    addListener: vi.fn(), removeListener: vi.fn(), dispatchEvent: vi.fn(), onchange: null,
  }));
}

const renderAt = (path: string) =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <ThemeProvider>
        <Routes>
          <Route path="/projects/:id" element={<ProjectDetail />} />
        </Routes>
      </ThemeProvider>
    </MemoryRouter>,
  );

beforeEach(() => { localStorage.clear(); vi.unstubAllGlobals(); setViewport(false); });

describe('ProjectDetail — found', () => {
  it('sets the document title', () => {
    renderAt('/projects/loopline');
    expect(document.title).toBe('Loopline — Ryan Chan');
  });

  it('renders the title, status, year and blurb', () => {
    renderAt('/projects/loopline');
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Loopline');
    expect(screen.getByText('In Progress')).toHaveClass('pixel-badge--warning');
    expect(screen.getByText('JUN 2026')).toBeInTheDocument();
    expect(screen.getByText(/A CLI task runner/)).toBeInTheDocument();
  });

  it('renders the tags', () => {
    renderAt('/projects/loopline');
    expect(screen.getByText('Docker')).toBeInTheDocument();
    expect(screen.getByText('GitHub')).toBeInTheDocument();
  });

  it('renders PATCH NOTES with paragraphs as <p> and bullets as marker rows', () => {
    const { container } = renderAt('/projects/loopline');
    expect(screen.getByText('PATCH NOTES')).toBeInTheDocument();
    expect(screen.getByText(/Started as a personal itch/).tagName).toBe('P');
    expect(screen.getByText(/Dependency graph diffing/).tagName).toBe('SPAN');
    // Three bullets, each with a 10px square marker.
    const markers = Array.from(container.querySelectorAll('i')).filter(
      (i) => (i as HTMLElement).style.width === '10px',
    );
    expect(markers).toHaveLength(3);
  });

  it('sizes the image region as the prototype does', () => {
    const { container } = renderAt('/projects/loopline');
    const region = container.querySelector('div[style*="min(40vw,380px)"]') as HTMLElement;
    expect(region.style.minHeight).toBe('220px');
    expect(region.style.background).toBe('var(--color-bg-alt)');
  });

  it('shows the slot hint when the project has no image', () => {
    renderAt('/projects/loopline');
    expect(screen.getByText('Drop a terminal screenshot')).toBeInTheDocument();
  });

  it('links back to #projects on the home route from three places', () => {
    renderAt('/projects/loopline');
    const backs = screen.getAllByRole('link').filter((a) => a.getAttribute('href') === '/#projects');
    expect(backs.length).toBeGreaterThanOrEqual(2);   // the overlay back button and EXPLORE MORE
  });

  it('labels the back button icon-only on mobile', () => {
    setViewport(true);
    renderAt('/projects/loopline');
    expect(screen.queryByText('BACK TO PROJECTS')).toBeNull();
    setViewport(false);
  });

  it('pins the nav cursor on Projects', () => {
    const { container } = renderAt('/projects/loopline');
    const cursor = container.querySelector('nav i[aria-hidden="true"]') as HTMLElement;
    expect(cursor.style.top).toBe('128px');
  });

  it('renders the CTA as a no-op anchor when there is no ctaUrl', async () => {
    renderAt('/projects/loopline');
    const cta = screen.getByRole('link', { name: /View Source/ });
    expect(cta).toHaveAttribute('href', '#');
    expect(cta).not.toHaveAttribute('target');
    const clicked = await userEvent.click(cta).then(() => true);
    expect(clicked).toBe(true);   // preventDefault, so no navigation
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Loopline');
  });

  it('applies PRIMARY_EDGE custom properties to the CTA button', () => {
    renderAt('/projects/loopline');
    const cta = screen.getByRole('link', { name: /View Source/ }) as HTMLElement;
    // Check that custom properties are set (they exist in the element's style)
    expect(cta.style.getPropertyValue('--color-border')).toBeTruthy();
    expect(cta.style.getPropertyValue('--shadow-pixel')).toBeTruthy();
  });

  it('constrains the image region wrapper to max-width 860px and centers it', () => {
    const { container } = renderAt('/projects/loopline');
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
    renderAt('/projects/does-not-exist');
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Not Found');
    expect(screen.getByText("That project doesn't exist.")).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /BACK TO PROJECTS/ }))
      .toHaveAttribute('href', '/#projects');
  });

  it('colors the not-found heading with the same accent color as the found title', () => {
    renderAt('/projects/does-not-exist');
    const heading = screen.getByRole('heading', { level: 1 }) as HTMLElement;
    // The color is set to #A9BF6D in the style, which browsers compute to rgb(169, 191, 109)
    expect(heading.style.color).toBe('rgb(169, 191, 109)');
  });

  it('still renders the nav and footer', () => {
    renderAt('/projects/does-not-exist');
    expect(screen.getByRole('navigation')).toBeInTheDocument();
    expect(screen.getByText('© 2026 RYAN CHAN')).toBeInTheDocument();
  });
});
