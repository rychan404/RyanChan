/** The skill groups, from docs/design/portfolio-home.dc.html:545-552, plus DEPLOY.
 *  Rendered as a grid of slots, one per skill, not bars and not filterable. */
export type SkillGroup = {
  name: string;
  skills: string[];
};

export const SKILL_GROUPS: SkillGroup[] = [
  {
    name: 'CODE',
    skills: ['Python', 'TypeScript', 'JavaScript', 'HTML', 'CSS'],
  },
  {
    name: 'BUILD',
    skills: ['React', 'FastAPI', 'Tailwind CSS', 'MongoDB', 'PostgreSQL', 'AWS', 'Pandas'],
  },
  {
    name: 'DEPLOY',
    skills: ['Docker', 'Vercel'],
  },
  {
    name: 'POST',
    skills: ['DaVinci Resolve', 'Audacity', 'Figma'],
  },
];
