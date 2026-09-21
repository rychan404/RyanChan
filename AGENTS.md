# AGENTS.md

Pixel-art portfolio for Ryan Chan. Astro 7 + React 18 islands + TypeScript + MDX. No
CSS framework, no state library, no backend. Ported from the Claude Design handoff in
`docs/design/` — those `.dc.html` files are the visual reference of record.

## Layout

See the Project structure tree in [`README.md`](README.md#project-structure).

## Commands

`npm run dev` (`astro dev`) · `npm test` · `npm run typecheck` · `npm run build` (typechecks first).

Tests are Vitest, colocated: `Foo.tsx` → `Foo.test.tsx`. Run `npm test` before claiming
something works.

## Styling

Tokens live in `src/styles/tokens/*.css`. `src/styles/guidelines.test.ts` enforces the
rules below and names the file, the line and the rule when one breaks.

The rules in short — never a raw value where a token exists:

- colours → `--color-*` / `--pixel-*` / `--edge-*` (`hsl(from var(--token) …)` is fine)
- font sizes → `--fs-*`
- fonts → `var(--font-display)` or `var(--font-body)`, those two only
- border widths → `--border-*`
- shadows → `var(--shadow-control)` (3px) or `var(--shadow-card)` (4px), then a colour;
  presses → `var(--press-control)` / `var(--press-card)`

Untested convention: **a pattern used in more than one place is a class in
`patterns.css`**, not a copied inline `style={{…}}`. Keep inline styles for layout and
for values that depend on state (`playing`, the active nav row). Mobile vs desktop
values go in the `@media (max-width:860px)` block in `patterns.css`, not in JS;
`useIsMobile` is only for swapping markup (the nav, the project filter).

Derived tokens go in the `:root,.theme-light{…}` block at the bottom of `colors.css`.
`.theme-light` sits on the app's root `<div>`, not `<html>`, so a `var()`-derived token
declared only in `:root` would lock in the dark value.

## Content

Projects are markdown folders under `src/content/projects/`. Frontmatter validation is
strict and fails the build deliberately — bodies are MDX; paragraphs and bullet lists
get the PATCH NOTES style (`.rc-patch-notes`). The schema is in `src/content/schema.ts`.

## Conventions

- Conventional commits, lowercase subject: `feat: …`, `fix: …`, `chore: …`, `docs: …`.
- Runtime dependencies are deliberately five (React, React DOM, Astro, @astrojs/react,
  @astrojs/mdx). Ask before adding another.
- When the live site and the design mock disagree, it is the owner's call. Ask.
- Adding, removing or renaming a top-level folder in `src/` (or a root config file)
  means updating the Project structure tree in `README.md` in the same change.

## More

- [`README.md`](README.md) — project structure, building
- `docs/superpowers/` — the original spec and implementation plan
