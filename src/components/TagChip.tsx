import { tagColor, tagIcon } from '../content/tags';

type Props = {
  name: string;
  /** 'sm' = project cards and the detail page; 'lg' = the Skills section. */
  size?: 'sm' | 'lg';
};

export function TagChip({ name, size = 'sm' }: Props) {
  const icon = tagIcon(name);
  const lg = size === 'lg';
  const iconPx = lg ? '17px' : '13px';
  return (
    <span
      className="pixel-tag"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: lg ? '9px' : '6px',
        border: 'none',
        borderBottom: `5px solid ${tagColor(name)}`,
        ...(lg ? { fontSize: '16px', padding: '10px 18px' } : {}),
      }}
    >
      {icon && (
        <span
          aria-hidden="true"
          style={{
            width: iconPx,
            height: iconPx,
            flex: 'none',
            maskImage: `url(${icon})`,
            WebkitMaskImage: `url(${icon})`,
            maskRepeat: 'no-repeat',
            maskPosition: 'center',
            maskSize: 'contain',
            backgroundColor: 'currentColor',
          }}
        />
      )}
      {name}
    </span>
  );
}
