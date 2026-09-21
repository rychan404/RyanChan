/** Tag icon files, vendored under /icons/tags/ (decision D6).
 *  Keys and colours are the prototype's, verbatim
 *  (docs/design/portfolio-home.dc.html:527-543). */
export const TAG_ICONS: Record<string, string> = {
  'Python': 'python.svg',
  'Java': 'java.svg',
  'TypeScript': 'typescript.svg',
  'JavaScript': 'javascript.svg',
  'TypeScript / JavaScript': 'typescript.svg',
  'HTML': 'html5.svg',
  'CSS': 'css.svg',
  'HTML / CSS': 'html5.svg',
  'C': 'c.svg',
  'React': 'react.svg',
  'FastAPI': 'fastapi.svg',
  'Tailwind CSS': 'tailwindcss.svg',
  'MongoDB': 'mongodb.svg',
  'PostgreSQL': 'postgresql.svg',
  'Docker': 'docker.svg',
  'AWS': 'amazon-web-services.png',
  'Pandas': 'pandas.svg',
  'Eclipse': 'eclipseide.svg',
  'DaVinci Resolve': 'davinciresolve.svg',
  'Audacity': 'audacity.svg',
  'Git': 'git.svg',
  'GitHub': 'github.svg',
  'Figma': 'figma.svg',
};

export const TAG_COLORS: Record<string, string> = {
  'Python': '#3776AB',
  'Java': '#ED8B00',
  'TypeScript': '#3178C6',
  'JavaScript': '#F7DF1E',
  'TypeScript / JavaScript': '#3178C6',
  'HTML': '#E34F26',
  'CSS': '#1572B6',
  'HTML / CSS': '#E34F26',
  'C': '#A8B9CC',
  'React': '#61DAFB',
  'FastAPI': '#009688',
  'Tailwind CSS': '#38BDF8',
  'MongoDB': '#47A248',
  'PostgreSQL': '#4169E1',
  'Docker': '#2496ED',
  'AWS': '#FF9900',
  'Pandas': '#E70488',
  'Eclipse': '#2C2255',
  'DaVinci Resolve': '#EF3F24',
  'Audacity': '#0000CC',
  'Git': '#F05032',
  'GitHub': '#8B949E',
  'Figma': '#F24E1E',
  'Premiere Pro': '#9999FF',
  'After Effects': '#9999FF',
};

/** '' when the tag has no icon. Unmapped tags are real and intentional:
 *  YouTube, Motion, Writing, Trailer, Sound, Client, Piano, Music, Origami,
 *  Craft all render with no icon and currentColor on the bottom border.
 *  Premiere Pro and After Effects are also unmapped due to D6 vendoring gap
 *  (no fetchable icon slugs), though they have colors. */
export function tagIcon(name: string): string {
  const v = TAG_ICONS[name];
  return v ? `/icons/tags/${v}` : '';
}

export function tagColor(name: string): string {
  return TAG_COLORS[name] || 'currentColor';
}
