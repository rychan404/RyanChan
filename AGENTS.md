# AGENTS.md

Pixel-art portfolio for Ryan Chan. Vite + React 18 + TypeScript. No CSS framework, no
state library, no backend. Ported from the Claude Design handoff in `docs/design/` —
those `.dc.html` files are the visual reference of record.

## Layout

| Path | What |
|---|---|
| `src/routes/` | `Home` (every section, scroll-spy) and `ProjectDetail` |
| `src/sections/` | Hero, About, Projects, Skills, Contact |
| `src/scenes/` | the layered pixel-art scenes — animation, not UI chrome |
| `src/components/`, `src/layout/` | cards, chips, popovers; NavRail and Footer |
| `src/lib/`, `src/hooks/` | pure logic, and the hooks that wrap it |
| `src/content/` | projects (markdown folders), skills, facts, the tag → icon/colour map |
| `src/styles/` | tokens, shared patterns, interaction states |

## Commands

`npm run dev` · `npm test` · `npm run typecheck` · `npm run build` (typechecks first).

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
for values that depend on state (`isMobile`, `playing`, the active nav row).

Derived tokens go in the `:root,.theme-light{…}` block at the bottom of `colors.css`.
`.theme-light` sits on the app's root `<div>`, not `<html>`, so a `var()`-derived token
declared only in `:root` would lock in the dark value.

## Content

Projects are markdown folders under `src/content/projects/`. Frontmatter validation is
strict and fails the build deliberately — the design renders exactly two note forms.
See the README before adding or editing one.

## Conventions

- Conventional commits, lowercase subject: `feat: …`, `fix: …`, `chore: …`, `docs: …`.
- Runtime dependencies are deliberately three (React, React DOM, Router). Ask before
  adding a fourth.
- When the live site and the design mock disagree, it is the owner's call. Ask, then
  record the answer in the decision log at the bottom of `STYLEGUIDE.md`.

## More

- [`README.md`](README.md) — setup, env vars, adding a project, deploying
- [`STYLEGUIDE.md`](STYLEGUIDE.md) — tokens, shared patterns, decision log
- `docs/superpowers/` — the original spec and implementation plan
