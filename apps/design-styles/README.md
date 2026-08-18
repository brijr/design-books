# Design Styles

> [design-styles.com](https://design-styles.com)

A visual field guide to the movements and visual languages that shape design.
Launch catalog: the 24 entries locked in `content/design-styles.md`.

## Stack

- Astro 7 with the `@astrojs/cloudflare` adapter. Fully prerendered.
- Tailwind CSS v4 via `@tailwindcss/vite`
- Content collections (`src/content.config.ts`) for style and movement entries
- Live HTML/CSS specimens for digitally native styles; diagram recreations for historical movements

The site stays `noindex` until the proving batch is ready to ship.

## Commands

| Command | What it does |
| --- | --- |
| `pnpm --filter design-styles dev` | Astro dev server |
| `pnpm --filter design-styles build` | Production build to `dist/` |
| `pnpm --filter design-styles check` | `astro check` |
