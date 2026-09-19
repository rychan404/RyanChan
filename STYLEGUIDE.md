# Style guide

How this site is styled, and the rules that keep it consistent. The visual language
comes from the Pixel Pro design system (the handoff in `docs/design/`): two fonts,
square corners, solid 2–4px outlines with hard offset shadows, and a 32-colour
pixel-art palette. This file covers how the code uses it.

## The rules

`src/styles/guidelines.test.ts` enforces these, and `npm test` fails if a component
breaks one. The failure names the file, the line and the rule.

1. **No raw colours.** Use a token (`var(--color-heading)`, `var(--color-text-muted)`,
   `var(--edge-on-bg)` …). A colour derived from a token is fine:
   `hsl(from var(--color-primary) h calc(s * 1.1) calc(l * 1.15))`.
2. **No raw font sizes.** Use a `--fs-*` token.
3. **Two fonts only:** `var(--font-display)` (Edit Undo BRK) or `var(--font-body)`
   (JetBrains Mono). Never `monospace` or a system font.
4. **No raw border widths.** Use a `--border-*` token.
5. **No raw shadow or press offsets.** Use `var(--shadow-control)` or `var(--shadow-card)`
   followed by a colour, and `var(--press-control)` / `var(--press-card)` for `:active`.

And one convention the test can't check: **a pattern used in more than one place is a
class in `src/styles/patterns.css`**, not a copied inline `style={{…}}` object. Keep
inline styles for layout, and for values that depend on state (`isMobile`, `playing`,
the active nav row).

## Tokens

All tokens live in `src/styles/tokens/`.

### Colour — `colors.css`

The `--pixel-*` ramps are the palette. Components use the semantic names:

| Token | Use |
|---|---|
| `--color-heading` | green section titles (`--pixel-green-4`, `#a9bf6d`) |
| `--color-heading-shadow` | the outline text-shadow on those titles (`--pixel-green-1`) |
| `--color-text` / `-muted` / `-dim` | body copy / secondary copy / captions and labels |
| `--color-bg` / `-bg-alt` / `-surface` / `-surface-raised` | page, teal band, panels, hover fills |
| `--color-border` | the black outline on design-system components |
| `--color-ink` | pure black outlines on the project-page buttons |
| `--color-primary`, `--color-accent-text`, `--color-warning` … | accents (`--color-primary` is the darker green on the About stat numbers); use `--color-accent-text` when an accent colours **text** (it turns violet in light mode for contrast) |
| `--edge-on-bg` / `--edge-on-surface` / `--edge-on-bg-alt` | the tinted outline for a card sitting on that background |
| `--edge-primary` | the outline around green buttons and the logo |
| `--dither-ink-about` | the About section's dither fade |

### Font size — `typography.css`

Tokens are named after their size, so the set is closed and easy to scan. Pick the
closest role below. Don't add a new size unless nothing here fits.

| Token | Role |
|---|---|
| `--fs-11` | status badge on a project card |
| `--fs-12` | mobile nav labels, popover caption |
| `--fs-13` | stat labels, desktop nav labels |
| `--fs-14` | form labels (via `.pixel-label`) |
| `--fs-15` | meta text: dates, footer, back button |
| `--fs-16` | UI text: buttons, tabs, large tag chips, card blurbs, detail notes |
| `--fs-17` | About panel lines, hero tagline |
| `--fs-18` | About panel headings, bio, detail-page sub-labels |
| `--fs-19` | section intro paragraphs, detail intro |
| `--fs-20` | bio lead paragraph, mobile logo, popover title |
| `--fs-22` | skill group titles |
| `--fs-26` | project card titles |
| `--fs-28` | desktop logo |
| `--fs-34` | stat numbers |
| `--fs-section-title` | section `<h2>` — `clamp(40px,6vw,76px)` |
| `--fs-hero-name` | hero name — `clamp(56px,10vw,152px)` |
| `--fs-hero-tagline` | hero eyebrow — `clamp(20px,2.2vw,30px)` |
| `--fs-detail-title` | project page title — `clamp(34px,5vw,58px)` |
| `--fs-notfound-title` | not-found title — `clamp(32px,5vw,52px)` |

The design system's own `--text-*` scale is used inside `components.css`. Don't mix
it into components.

### Border width — `effects.css`

| Token | Width | Use |
|---|---|---|
| `--border-thin` | 2px | small controls, list dividers |
| `--border-mid` | 3px | the About photo button, popovers, mobile logo |
| `--border-thick` | 4px | cards, panels, frames, nav rail — the default |
| `--border-tag` | 5px | the coloured underline on tag chips |

### Shadow — `effects.css`

Every box casts a hard, unblurred shadow down and to the right. There are two sizes:

| Token | Offset | Use |
|---|---|---|
| `--shadow-control` | 3px | buttons, the logo, the About play button, popover close, back buttons |
| `--shadow-card` | 4px | cards, panels, popovers, the filter dropdown, toasts, **and image frames** |
| `--shadow-card-hover` | 6px | a project card on hover: it rises `--lift-hover` (2px) and the shadow grows by the same amount, so the shadow's corner stays put |

These tokens hold only the offset, so the colour goes after them:
`box-shadow: var(--shadow-card) var(--edge-on-bg)`. `.pixel-card`, `.pixel-toast` and
`.pixel-btn` already use them with `--color-border`. To tint one, set `--color-border`
on the element, not the shadow.

When pressed, an element slides by its own offset and the shadow drops to zero, so it
lands flush: `transform: var(--press-control)` or `var(--press-card)`, with
`box-shadow: 0 0 0 …`. The offsets come from `--lift-control` / `--lift-card`, so
changing one of those moves the resting shadow and the press together.

## Shared patterns — `patterns.css`

| Class | What |
|---|---|
| `.rc-section-title` | section `<h2>`; pair with an inline `textShadow: sectionHeadingShadow(isMobile)` |
| `.rc-section-lede` | the paragraph under a section title |
| `.rc-panel`, `.rc-panel-heading`, `.rc-panel-lines`, `.rc-panel-line` | About's FUN FACTS / QUEST LOG boxes |
| `.rc-stat`, `.rc-stat-value`, `.rc-stat-label` | About stat cards |
| `.rc-photo-frame`, `.rc-photo-toggle` | About photo and its play button |
| `.rc-scene`, `.rc-scene-paused` | scene root, and the class `useScenePause` toggles to park its animations off screen |
| `.rc-tape` | a theme-tape group. Marks a `forwards` animation that must reach 100%, so `prefers-reduced-motion` leaves it alone |

Hover and press states live in `interactions.css`, keyed on the `rc-*` classes.

## Adding a value

1. Check the tables above. Most "new" values are an existing role.
2. If it really is new, add the token to the right file in `src/styles/tokens/` and
   add a row here.
3. If it's a repeated pattern, add a class to `patterns.css` instead of repeating
   inline styles.

## Gotcha: theme-derived tokens

The `.theme-light` class sits on the app's root `<div>`, not on `<html>`. A custom
property whose value uses `var()` is resolved on the element that declares it. A token
like `--edge-on-surface` declared only in `:root` would lock in the dark-theme surface
colour, and light mode would get the wrong outline. So every derived token is declared
in the `:root,.theme-light{…}` block at the bottom of `colors.css`, and a test checks
this.

## Exemptions

The test skips these, each for a reason:

- `src/scenes/**`, `keyframes.css`: pixel-art scene lighting, not UI.
- `src/content/tags.ts`: each technology's own brand colour for its tag underline.
- `src/components/ImageSlot.tsx`: a deliberately neutral placeholder for missing images.

## Decision log

When the live site and the design mock (`docs/design/*.dc.html`) disagree, the owner
decides each case.

| Date | Decision |
|---|---|
| 2026-09-19 | **Colour: the live site wins** unless the owner calls out a specific change (see below). |
| 2026-09-19 | About stat cards: display font and 4px tinted edge (mock). Numbers are `--color-primary`, the darker green, in both themes (owner). |
| 2026-09-19 | About FUN FACTS / QUEST LOG headings: 18px display font, grey `--color-text-dim` (mock, owner). |
| 2026-09-19 | About panels: 4px `--edge-on-bg`, 24px padding, page background (mock). |
| 2026-09-19 | About panel lines: 17px, `--color-text-muted`, 12px icon gap (mock). |
| 2026-09-19 | About photo frame: 4px `--edge-on-bg-alt` (mock); background stays `--color-surface`. Play button: 3px border, 3px shadow (mock). |
| 2026-09-19 | **Shadows: two sizes site-wide** (owner). Controls 3px, cards/panels/frames 4px. Image frames match cards, so the contact art and the contact form now match; this replaces the mock's 2px cards and 6px frames. |
| 2026-09-19 | Contact art frame: border and shadow use `--edge-on-surface`, matching the contact form beside it (owner). The mock and the old live site used the teal `--color-bg-alt`. |
| 2026-09-19 | Contact form: labels use the 14px `.pixel-label` size; the message box uses JetBrains Mono like the other fields (mock). |
