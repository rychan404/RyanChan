# Ryan Chan — portfolio

A pixel-art portfolio built with Astro, React islands, TypeScript and MDX.
Styling rules are in [`AGENTS.md`](AGENTS.md#styling), enforced by `npm test`.

## Project structure

```
public/              fonts, icons, pixel-art assets, og.png
src/
  pages/             the three routes
  layouts/           Base.astro: head, OG tags, theme boot script
  routes/            Home and ProjectDetail React trees + their islands
  sections/          Hero, About, Projects, Skills, Contact
  scenes/            layered pixel-art scene animations
  components/        cards, chips, popovers
  layout/            NavRail, Footer
  lib/               pure logic
  hooks/             React hooks wrapping lib/
  content/           projects (markdown folders), skills, facts, tag map
  styles/            tokens, shared patterns, interaction states
  content.config.ts  project collection (schema in content/schema.ts)
astro.config.mjs     Astro config
vitest.config.ts     test config
```

## Building

Needs Node 22.12+.

```bash
npm install
npm run build      # astro sync + typecheck, then a static build into dist/
npm run preview    # serve dist/ locally
```
