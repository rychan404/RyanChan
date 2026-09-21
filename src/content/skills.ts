/** Three skill groups, verbatim from docs/design/portfolio-home.dc.html:545-552.
 *  Rendered as tag chips, not bars, and not filterable — the README's
 *  description of this section is wrong (spec section 4.3). */
export type SkillGroup = {
  name: string;
  /** path fragment under /icons/, e.g. 'ui/code-solid' */
  icon: string;
  skills: string[];
};

export const SKILL_GROUPS: SkillGroup[] = [
  {
    name: 'CODE',
    icon: 'ui/code-solid',
    skills: ['Python', 'TypeScript', 'JavaScript', 'HTML', 'CSS'],
  },
  {
    name: 'BUILD',
    icon: 'ui/cog-solid',
    skills: ['React', 'FastAPI', 'Tailwind CSS', 'MongoDB', 'PostgreSQL', 'Docker', 'AWS', 'Pandas'],
  },
  {
    name: 'POST',
    icon: 'ui/video-camera-solid',
    skills: ['DaVinci Resolve', 'Audacity', 'Figma'],
  },
];
