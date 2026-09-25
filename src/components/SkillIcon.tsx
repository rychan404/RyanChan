import { tagIcon } from '../content/tags';

/** The brand logo as a mask filled with the text colour, so every icon (a dark
 *  navy logo included) reads the same on the dark and the light theme. */
export function SkillIcon({ name }: { name: string }) {
  const url = `url(${tagIcon(name)})`;
  return <span aria-hidden="true" className="rc-inv-icon" style={{ maskImage: url, WebkitMaskImage: url }} />;
}
