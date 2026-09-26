import { render, screen, within } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { Project } from '../content/projects';
import { ThemeProvider } from '../hooks/useTheme';
import { ProjectDetail } from './ProjectDetail';

function setViewport(isMobile: boolean) {
  vi.stubGlobal('matchMedia', (q: string) => ({
    matches: isMobile, media: q,
    addEventListener: vi.fn(), removeEventListener: vi.fn(),
    addListener: vi.fn(), removeListener: vi.fn(), dispatchEvent: vi.fn(), onchange: null,
  }));
}

// A fixed project, not one from src/content/projects, so editing real content never breaks these.
const loopline: Project = {
  id: 'loopline', order: 2, kind: 'code', title: 'Loopline', year: 'JUN 2026',
  blurb: 'A CLI task runner that watches your project and reruns only what actually changed.',
  tags: ['Rust', 'Docker'], role: 'Maintainer',
  outcome: 'Cut the build loop from 40s to under 3s',
};
const neighbour = (id: string, title: string): Project => ({ ...loopline, id, title });

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

  it('renders role, the tags as the stack, and outcome as stat cards', () => {
    renderDetail();
    const stat = (k: string) => screen.getByText(k).closest('.rc-stat');
    expect(stat('Role')).toHaveTextContent('Maintainer');
    expect(stat('Stack')).toHaveTextContent('Rust, Docker');
    expect(stat('Outcome')).toHaveTextContent(loopline.outcome!);
  });

  it('leaves the outcome card out when the project has none', () => {
    render(<ThemeProvider><ProjectDetail project={{ ...loopline, outcome: undefined }} /></ThemeProvider>);
    expect(screen.queryByText('Outcome')).toBeNull();
    expect(screen.getByText('Role')).toBeInTheDocument();
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

  it('shows the empty image slot with the kind icon, and no hint, when the project has no image', () => {
    const { container } = renderDetail();
    const icon = container.querySelector('[data-slot-placeholder] .pixel-icon') as HTMLElement;
    expect(icon.style.maskImage).toBe('url(/icons/ui/code-solid.svg)');
    expect(container.querySelector('.rc-slot-hint')).toBeNull();
  });

  it('links to the previous and next projects, with no EXPLORE MORE', () => {
    const [prev, next] = [neighbour('tilebreaker', 'Tilebreaker'), neighbour('nightshift', 'Nightshift')];
    render(<ThemeProvider><ProjectDetail project={loopline} prev={prev} next={next} /></ThemeProvider>);
    const nav = screen.getByRole('navigation', { name: 'More projects' });
    const links = within(nav).getAllByRole('link');
    expect(links.map((a) => [a.getAttribute('rel'), a.getAttribute('href')])).toEqual([
      ['prev', `/projects/${prev.id}`], ['next', `/projects/${next.id}`],
    ]);
    expect(links[0]).toHaveTextContent(prev.title);
    expect(nav.querySelector('.rc-detail-kind')).toBeNull();
    expect(screen.queryByText(/EXPLORE MORE/)).toBeNull();
  });

  it('draws no neighbour cards without neighbours', () => {
    renderDetail();
    expect(screen.queryByRole('navigation', { name: 'More projects' })).toBeNull();
  });

  it('pins the nav cursor on Projects', () => {
    renderDetail();
    expect(screen.getByRole('link', { name: 'PROJECTS' })).toHaveAttribute('aria-current', 'true');
  });

  it('draws one button per link, in site / github / video / slides / devpost order, each in a new tab', () => {
    const links = { devpost: 'https://devpost.com/x', slides: '/slides/x.pdf', github: 'https://github.com/x', site: 'https://x.dev' };
    render(<ThemeProvider><ProjectDetail project={{ ...loopline, links }} /></ThemeProvider>);
    const buttons = ['LIVE SITE', 'GITHUB', 'SLIDES', 'DEVPOST'].map((name) => screen.getByRole('link', { name }));
    expect(buttons.map((a) => a.getAttribute('href'))).toEqual([links.site, links.github, links.slides, links.devpost]);
    for (const a of buttons) {
      expect(a).toHaveAttribute('target', '_blank');
      expect(a).toHaveAttribute('rel', 'noopener noreferrer');
    }
    expect(buttons[0]).toHaveClass('pixel-btn', 'rc-link-primary');
    expect(buttons[1]).toHaveClass('rc-pixel-back');
    expect(screen.queryByRole('link', { name: 'WATCH VIDEO' })).toBeNull();
  });

  it('makes the first link present the primary one', () => {
    render(<ThemeProvider><ProjectDetail project={{ ...loopline, links: { video: 'https://youtu.be/x' } }} /></ThemeProvider>);
    expect(screen.getByRole('link', { name: 'WATCH VIDEO' })).toHaveClass('pixel-btn');
  });

  it('draws no link buttons when the project has no links', () => {
    const { container } = renderDetail();
    expect(container.querySelector('.pixel-btn, .rc-pixel-back:not(.rc-detail-back)')).toBeNull();
  });

  it('puts a BACK TO PROJECTS link at the top of the page', () => {
    const { container } = renderDetail();
    const back = screen.getByRole('link', { name: 'Back to projects' });
    expect(back).toHaveAttribute('href', '/#projects');
    expect(container.querySelector('.rc-main a')).toBe(back);
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
