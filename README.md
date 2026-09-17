# Ryan Chan — portfolio

A pixel-art portfolio built with Vite, React and TypeScript. Rebuilt from the
Claude Design handoff in `docs/design/`, at pixel-perfect fidelity.

- Design spec: `docs/superpowers/specs/2026-09-02-portfolio-pixel-site-design.md`
- Implementation plan: `docs/superpowers/plans/2026-09-02-portfolio-pixel-site-rebuild.md`

## Requirements

Node 20 LTS.

## Getting started

```bash
npm install
cp .env.example .env.local     # then fill in the two VITE_ values
npm run dev
```

Without a `VITE_WEB3FORMS_KEY` the contact form still renders and validates,
but submitting shows an error toast instead of reporting a success that never
left the browser. Without `VITE_SITE_URL` the build still succeeds; project
links just unfurl without a card image.

## Scripts

| Script | What it does |
|---|---|
| `npm run dev` | dev server |
| `npm run build` | typecheck, then a static build into `dist/` |
| `npm run preview` | serve `dist/` |
| `npm test` | unit tests (Vitest) |
| `npm run typecheck` | TypeScript only |
| `node scripts/fetch-assets.mjs` | re-vendor the CDN icons and fonts |
| `npm run optimize:images` | re-encode the two oversized About images |

## Adding a project

Drop a folder in `src/content/projects/`:

```
src/content/projects/10-my-thing/
  index.md
  cover.png        # optional
```

```markdown
---
kind: "code"                 # code | video | misc
title: "My Thing"
year: "MAR 2026"
status: "Completed"          # Completed | In Progress
blurb: "One sentence for the card."
tags: ["React", "Docker"]    # see src/content/tags.ts for the icon/colour map
role: "Solo developer"
stack: "React, Vite"
slotHint: "Drop a screenshot"
cta: "View Source"
ctaUrl: "https://github.com/…"   # optional; without it the CTA is inert
image: "./cover.png"             # optional
---

An optional opening paragraph.

- A bullet.
- Another bullet.
```

The directory name supplies both the URL slug (`/projects/my-thing`) and the
sort order (`10`). No TypeScript to edit. The build also emits
`dist/projects/my-thing/index.html` with that project's own title, description
and Open Graph tags, so the link unfurls correctly when shared.

Validation is strict and runs at build time. Unknown frontmatter keys, values
outside the `kind`/`status` enums, and any body content other than paragraphs
and bullet lists all **fail the build**, naming the file and the problem. That
is deliberate: the design renders exactly two note forms and has no styling for
a heading or a code block.

Restart the dev server after adding a folder — `import.meta.glob` resolves at
module-graph build time. Editing an existing `index.md` hot-reloads.

## Deploying

Cloudflare Pages, git-connected to `main`. Build command `npm run build`, output
directory `dist`, Node pinned by `.node-version`.

- `public/_redirects` sends anything without a matching file to `index.html`, so
  an unknown path reaches the SPA's not-found state rather than a Cloudflare 404.
  Project routes do not rely on it — they are real files (see the plan's Task 24).
- `VITE_SITE_URL` and `VITE_WEB3FORMS_KEY` are build-time variables set in the
  Pages project. Changing one needs a redeploy.
- The domain is registered in Cloudflare Registrar and attached under the Pages
  project's custom domains, so DNS is managed in the same account.

## Known follow-ups

- Every route shares one `og:image` (`public/og.png`). Per-project cover art in
  previews would mean resolving each `image:` frontmatter path to its hashed
  build output.
- `prefers-reduced-motion` is not handled. The prototype does not handle it
  either and the scenes are the product, so the spec flags it as a decision
  rather than silently adding a blanket motion kill.
- Footer social links point at bare `linkedin.com` / `github.com` /
  `youtube.com`.
- The nine seed projects are fictional placeholders (decision D2).
