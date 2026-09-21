# AGENTS.md

Pixel-art portfolio for Ryan Chan. Astro 7 + React 18 islands + TypeScript + MDX. No
CSS framework, no state library, no backend. Ported from the Claude Design handoff in
`docs/design/` — those `.dc.html` files are the visual reference of record.

## Layout

| Path | What |
|---|---|
| `src/pages/` | the three routes, each mounting one `*Island` |
| `src/layouts/` | `Base.astro`: head, OG tags, theme boot script |
| `src/routes/` | `Home` and `ProjectDetail` React trees, plus the `*Island` wrappers the pages mount |
| `src/sections/` | Hero, About, Projects, Skills, Contact |
| `src/scenes/` | the layered pixel-art scenes — animation, not UI chrome |
| `src/components/`, `src/layout/` | cards, chips, popovers; NavRail and Footer |
| `src/lib/`, `src/hooks/` | pure logic, and the hooks that wrap it |
| `src/content/` | projects (markdown folders), skills, facts, the tag → icon/colour map |
| `src/content.config.ts` | project collection; schema in `src/content/schema.ts` |
| `src/styles/` | tokens, shared patterns, interaction states |

## Commands

`npm run dev` (`astro dev`) · `npm test` · `npm run typecheck` · `npm run build` (typechecks first).

Tests are Vitest, colocated: `Foo.tsx` → `Foo.test.tsx`. Run `npm test` before claiming
something works.

## Styling

**Read [`STYLEGUIDE.md`](STYLEGUIDE.md) before changing any style.** It holds the token
tables. `src/styles/guidelines.test.ts` enforces the rules and names the file, the line
and the rule when one breaks.

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
get the PATCH NOTES style (`.rc-patch-notes`). See the README before adding or editing
one.

## Conventions

- Conventional commits, lowercase subject: `feat: …`, `fix: …`, `chore: …`, `docs: …`.
- Runtime dependencies are deliberately five (React, React DOM, Astro, @astrojs/react,
  @astrojs/mdx). Ask before adding another.
- When the live site and the design mock disagree, it is the owner's call. Ask, then
  record the answer in the decision log at the bottom of `STYLEGUIDE.md`.

## More

- [`README.md`](README.md) — setup, env vars, adding a project, deploying
- [`STYLEGUIDE.md`](STYLEGUIDE.md) — tokens, shared patterns, decision log
- `docs/superpowers/` — the original spec and implementation plan
