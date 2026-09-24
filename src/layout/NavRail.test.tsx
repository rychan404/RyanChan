import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ThemeProvider } from '../hooks/useTheme';
import { NavRail } from './NavRail';

const renderNav = (props: Parameters<typeof NavRail>[0]) =>
  render(<ThemeProvider><NavRail {...props} /></ThemeProvider>);

beforeEach(() => {
  localStorage.clear();
});

describe('NavRail hotbar', () => {
  it('renders the four section slots in rendered order', () => {
    renderNav({ route: 'home', active: 0 });
    const slots = screen.getByRole('navigation').querySelectorAll('a.rc-slot');
    expect([...slots].map((a) => a.getAttribute('aria-label'))).toEqual([
      'ABOUT', 'PROJECTS', 'SKILLS', 'CONTACT',
    ]);
  });

  it('gives each slot its pixel icon', () => {
    renderNav({ route: 'home', active: 0 });
    const icon = screen.getByRole('link', { name: 'SKILLS' }).querySelector('.pixel-icon') as HTMLElement;
    expect(icon.style.maskImage).toBe('url(/icons/ui/bolt-solid.svg)');
  });

  it('links to in-page anchors on the home route', () => {
    renderNav({ route: 'home', active: 0 });
    expect(screen.getByRole('link', { name: 'PROJECTS' })).toHaveAttribute('href', '#projects');
  });

  it('links back to the home route from the detail route', () => {
    renderNav({ route: 'detail', active: 2 });
    expect(screen.getByRole('link', { name: 'PROJECTS' })).toHaveAttribute('href', '/#projects');
  });

  it('marks the active slot with aria-current', () => {
    renderNav({ route: 'home', active: 3 });
    expect(screen.getByRole('link', { name: 'SKILLS' })).toHaveAttribute('aria-current', 'true');
    expect(screen.getByRole('link', { name: 'Ryan Chan' })).not.toHaveAttribute('aria-current');
  });

  it('calls onNavigate with the section index', async () => {
    const onNavigate = vi.fn();
    renderNav({ route: 'home', active: 0, onNavigate });
    await userEvent.click(screen.getByRole('link', { name: 'CONTACT' }));
    expect(onNavigate).toHaveBeenCalledWith(4);
  });

  it('shows the headshot portrait, linking home', async () => {
    const onNavigate = vi.fn();
    renderNav({ route: 'detail', active: 2, onNavigate });
    const portrait = screen.getByRole('link', { name: 'Ryan Chan' });
    expect(screen.getByRole('navigation')).toContainElement(portrait);
    expect(portrait).toHaveAttribute('href', '/#home');
    await userEvent.click(portrait);
    expect(onNavigate).toHaveBeenCalledWith(0);
  });

  it('marks the portrait current on the hero, standing in for home', () => {
    renderNav({ route: 'home', active: 0 });
    expect(screen.getByRole('link', { name: 'Ryan Chan' })).toHaveAttribute('aria-current', 'true');
    expect(screen.queryByRole('link', { name: 'HOME' })).toBeNull();
  });

  it('draws the XP bar, hidden from screen readers', () => {
    const { container } = renderNav({ route: 'home', active: 0 });
    const xp = container.querySelector('.rc-xp')!;
    expect(xp).toHaveAttribute('aria-hidden', 'true');
    expect(xp.querySelector('.rc-xp-fill')).not.toBeNull();
  });

  it('toggles the theme from its half-width cell, swapping moon for sun', async () => {
    renderNav({ route: 'home', active: 0 });
    const toggle = screen.getByRole('button', { name: 'Toggle light / dark' });
    const glyph = () => (toggle.querySelector('.pixel-icon') as HTMLElement).style.maskImage;
    expect(glyph()).toBe('url(/icons/ui/moon-solid.svg)');
    await userEvent.click(toggle);
    expect(glyph()).toBe('url(/icons/ui/brightness-high-solid.svg)');
  });
});
