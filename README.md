# Design Books

> 🔗 [designbooks.org](https://designbooks.org)

This is the Astro application for [designbooks.org](https://designbooks.org), deployed on Cloudflare Workers. Created by [Bridger Tower](https://bridger.to).

## Stack

- [Astro 7](https://astro.build) with the `@astrojs/cloudflare` adapter. Every page is prerendered except the submissions endpoint.
- [Tailwind CSS v4](https://tailwindcss.com) via `@tailwindcss/vite`
- [`@astrojs/react`](https://docs.astro.build/en/guides/integrations-guide/react/) for two islands: the home page book browser and the submission dialog. Everything else is zero-JS `.astro`.
- Content collections (`src/content.config.ts`) for books and topics — no CMS, no database.
- [Lenis](https://lenis.darkroom.engineering/) for smooth scroll, loaded via a small inline script that respects `prefers-reduced-motion`.

Covers are optimized at build time (`imageService: { build: "compile", runtime: "passthrough" }`), so the deployed site makes no runtime image requests and needs no Cloudflare Images binding.

## Commands

| Command | What it does |
| --- | --- |
| `pnpm dev` | Astro dev server |
| `pnpm build` | Production build to `dist/` |
| `pnpm preview` | Serve the build locally in workerd via `wrangler dev` |
| `pnpm check` | `astro check` — types, schema, and template diagnostics |
| `pnpm types` | Regenerate `worker-configuration.d.ts` from `wrangler.jsonc` |
| `pnpm add-book` | Interactive scaffold for a new book (see below) |
| `pnpm deploy` | Build and deploy to Cloudflare Workers |

## Development

```bash
pnpm install
pnpm dev
```

The submissions endpoint (`src/pages/api/book-submissions.ts`) reads its Discord
webhook from the Workers runtime env rather than `process.env`. For local dev,
copy `.dev.vars.example` to `.dev.vars` and fill in
`DISCORD_BOOK_SUBMISSIONS_WEBHOOK_URL`. Without it the endpoint returns `503`
rather than crashing.

In production, set the same value as a Workers secret:

```bash
wrangler secret put DISCORD_BOOK_SUBMISSIONS_WEBHOOK_URL
```

Secrets are deliberately not declared in `wrangler.jsonc` — anything in `vars`
there is committed in plaintext. Their types live in `src/env.d.ts`, which
augments `Cloudflare.Env`.

## Adding a book

### Option 1: the script (recommended)

```bash
pnpm add-book
```

Prompts for title, author(s), description, purchase link, topics (it lists the
existing topic slugs so you can pick valid ones), the optional bibliographic
fields, and the date added — defaulting to today. It writes a correctly-shaped
MDX file to `src/content/books/<slug>.mdx`, deriving `<slug>` from the title,
and expands the cover filename into the relative path the schema expects.

It also accepts piped input, one answer per line, for scripted adds:

```bash
pnpm add-book < answers.txt
```

### Option 2: by hand

Create `src/content/books/<slug>.mdx`. The filename minus extension is the
book's URL slug and its id for topic and author lookups.

```yaml
---
title: "Understanding Comics"
author: "Scott McCloud"
description: "A comic-format exploration of how sequential art communicates."
addedAt: "2026-08-12"
link: "https://bookshop.org/..." # optional, external purchase URL
topics:
  - graphic-design
  - visual-perception
cover: "../../assets/covers/understanding-comics.jpg" # optional
publisher: "William Morrow Paperbacks" # optional
year: "1993" # optional
pages: "224" # optional
isbn: "978-0060976255" # optional
---

Optional long-form summary prose goes here as the MDX body. It is often left
empty — the page only renders this section when there is content.
```

Everything the schema can catch, it catches at build time. `.strict()` means an
unrecognized key is an error too, so a typo'd field name cannot silently do
nothing.

**`addedAt` is required.** It drives the "Recently added" sort on the home page.
It is an authored value rather than a file timestamp on purpose: mtimes are all
identical in a fresh CI checkout, which would make the sort meaningless.

**Cover images** go in `src/assets/covers/`, and the `cover` field is the path
to the image *relative to the MDX file* — which is why it starts with
`../../`. `pnpm add-book` writes this for you from a bare filename. The schema
resolves it through Astro's `image()` helper, so covers are optimized at build
time and carry real intrinsic dimensions (no layout shift), and a path that
does not resolve fails the build.

**Topics resolve as references, not free text.** The `topics` field is validated
against the actual `src/content/topics/*.json` collection at build time. A
typo'd slug fails the build naming the file and the bad value. To add a new
topic, create `src/content/topics/<slug>.json`:

```json
{
  "title": "Systems Thinking",
  "slug": "systems-thinking",
  "description": "Books about feedback loops, leverage points, constraints, and the behavior of complex systems."
}
```

**Authors are not a collection.** The `author` field is a raw comma-separated
string (e.g. `"Scott McCloud, Ivan Brunetti"`). Author pages and the `/authors`
index are derived at build time by splitting on commas and slugifying each name
(`src/lib/taxonomy.ts`) — there is nothing else to create.

## Content provenance

The catalog was migrated off Payload CMS + Turso. `scripts/extract-from-live.mjs`
reconstructed all 66 books and 18 topics from the live site's schema.org
JSON-LD. It is kept for reference; it is not part of the build.
