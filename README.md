# Ryan Chan Portfolio

A pixel-art portfolio built with Astro, React islands, TypeScript and MDX.
Styling rules are in [`AGENTS.md`](AGENTS.md#styling), enforced by `npm test`.

## Project Structure

```
public/              fonts, custom icons, pixel-art assets, og.png
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
astro.config.mjs     Astro config, and the integration serving /icons/ from npm
vitest.config.ts     test config
```

## Run Locally

Needs Node 22.12+.

```bash
npm install
npm run build      # astro sync + typecheck, then a static build into dist/
npm run preview    # serve dist/ locally
```
## Icons

Icons are served from npm packages at build time, so the live site requests nothing
from a CDN:

| URL | Source |
|---|---|
| `/icons/ui/<name>.svg` | `@hackernoon/pixel-icon-library`, solid set ([pixeliconlibrary.com](https://pixeliconlibrary.com)) |
| `/icons/brands/<name>.svg` | the same library, brands set |
| `/icons/tags/<slug>.svg` | `simple-icons` ([simpleicons.org](https://simpleicons.org)) |
| `/icons/custom/<file>` | `public/icons/custom/`, hand-made or downloaded |

- **Pixel icon:** `<PixelIcon name="ui/<name>" … />`, with the name as listed on pixeliconlibrary.com.
- **Tag logo:** add `'Rust': 'rust'` to `TAG_ICONS` and a colour to `TAG_COLORS` in
  `src/content/tags.ts`. The slug is the one in the simpleicons.org URL.
- **No icon exists** (simple-icons doesn't have the brand, or it was removed): put an SVG in
  `public/icons/custom/` and map it as `'Java': 'custom/java.svg'`. For a pixel icon, use
  `name="custom/<file>"`. A single-colour SVG works best, since only its shape is drawn and
  the text colour fills it.

`npm test` fails on a tag pointing at a file that doesn't exist, and so does the build.
