/** Tag icons: a simple-icons slug (node_modules/simple-icons/icons/<slug>.svg,
 *  served at /icons/tags/ by the icons integration in astro.config.mjs), or
 *  'custom/<file>' for a logo simple-icons doesn't carry, kept in
 *  public/icons/custom/. Keys and colours are the prototype's
 *  (docs/design/portfolio-home.dc.html:527-543). */
export const TAG_ICONS: Record<string, string> = {
  'Python': 'python',
  'Java': 'custom/java.svg',
  'TypeScript': 'typescript',
  'JavaScript': 'javascript',
  'TypeScript / JavaScript': 'typescript',
  'HTML': 'html5',
  'CSS': 'css',
  'HTML / CSS': 'html5',
  'C': 'c',
  'React': 'react',
  'FastAPI': 'fastapi',
  'Tailwind CSS': 'tailwindcss',
  'MongoDB': 'mongodb',
  'PostgreSQL': 'postgresql',
  'Docker': 'docker',
  'AWS': 'custom/amazon-web-services.png',
  'Pandas': 'pandas',
  'Eclipse': 'eclipseide',
  'DaVinci Resolve': 'davinciresolve',
  'Audacity': 'audacity',
  'Git': 'git',
  'Figma': 'figma',
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
  'Figma': '#F24E1E',
  'Premiere Pro': '#9999FF',
  'After Effects': '#9999FF',
};

/** '' when the tag has no icon. Unmapped tags are real and intentional:
 *  YouTube, Motion, Writing, Trailer, Sound, Client, Piano, Music, Origami,
 *  Craft all render with no icon and currentColor on the bottom border.
 *  Premiere Pro and After Effects are also unmapped (simple-icons dropped Adobe's logos;
 *  add them under custom/ to show one), though they have colors. */
export function tagIcon(name: string): string {
  const v = TAG_ICONS[name];
  if (!v) return '';
  return v.startsWith('custom/') ? `/icons/${v}` : `/icons/tags/${v}.svg`;
}

export function tagColor(name: string): string {
  return TAG_COLORS[name] || 'currentColor';
}
