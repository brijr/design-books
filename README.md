# Design Books

> 🔗 [designbooks.org](https://designbooks.org)

This is the Astro application for [designbooks.org](https://designbooks.org), deployed on Cloudflare. Created by [Bridger Tower](https://bridger.to).

## Stack

- [Astro 5](https://astro.build) (static output, `@astrojs/cloudflare` adapter)
- [Tailwind CSS v4](https://tailwindcss.com) via `@tailwindcss/vite`
- [`@astrojs/react`](https://docs.astro.build/en/guides/integrations-guide/react/) for two islands: the home page book browser and the submission dialog. Everything else is zero-JS `.astro`.
- Content collections (`src/content.config.ts`) for books and topics -- no CMS, no database.
- [Lenis](https://lenis.darkroom.engineering/) for smooth scroll, loaded via a small inline script that respects `prefers-reduced-motion`.

## Development

```bash
pnpm install
pnpm dev
```

The book submission API route (`src/pages/api/book-submissions.ts`) reads its
Discord webhook URL from the Cloudflare runtime env, not `process.env`. For
local dev, copy `.dev.vars.example` to `.dev.vars` and fill in
`DISCORD_BOOK_SUBMISSIONS_WEBHOOK_URL`. Without it, the endpoint responds
`503` instead of crashing.

In production (Cloudflare Pages), set the same secret with:

```bash
wrangler pages secret put DISCORD_BOOK_SUBMISSIONS_WEBHOOK_URL
```

## Adding a book

The primary way to add a book to the reading list.

### Option 1: the script (recommended)

```bash
pnpm add-book
```

This prompts for title, author(s), description, purchase link, and topics
(it lists the existing topics from `src/content/topics/` so you can pick
valid slugs), then writes a correctly-shaped MDX file to
`src/content/books/<slug>.mdx`, where `<slug>` is derived from the title.

The script validates the purchase link is a real `http(s)` URL and that any
topic slugs you enter actually exist, so you can't typo a topic into an
orphaned reference.

### Option 2: by hand

Create `src/content/books/<slug>.mdx` (the filename, minus extension, is the
book's URL slug and its `id` for topic/author lookups) with frontmatter
matching the schema in `src/content.config.ts`:

```yaml
---
title: "Understanding Comics"
author: "Scott McCloud"
description: "A comic-format exploration of how sequential art communicates."
link: "https://bookshop.org/..." # optional, external purchase URL
topics:
  - visual-design
  - systems
cover: understanding-comics.jpg # optional, see below
publisher: "William Morrow Paperbacks" # optional
year: "1993" # optional
pages: "224" # optional
isbn: "978-0060976255" # optional
---

Optional long-form summary prose goes here as the MDX body. It's often left
empty -- the page only renders this section when there's content.
```

**Cover images** go in `src/assets/covers/`, and the frontmatter `cover`
field is the filename relative to that folder (not relative to the MDX
file). The schema resolves it through Astro's `image()` helper, so covers
are optimized at build time and typed with real intrinsic dimensions --
there's no way to reference an image that doesn't exist and have it fail
silently.

**Topics resolve as references, not free text.** The `topics` field is
validated against the actual `src/content/topics/*.json` collection at build
time. If you typo a topic slug (or reference one that hasn't been created
yet), `astro build` fails immediately with a clear "does not exist" error
instead of silently rendering a book with no topics. To add a new topic
first, create `src/content/topics/<slug>.json`:

```json
{
  "title": "Systems",
  "slug": "systems",
  "description": "Design systems, component libraries, and the tooling that scales a practice."
}
```

**Authors are not a collection.** The `author` field is a raw
comma-separated string (e.g. `"Scott McCloud, Ivan Brunetti"`). Author pages
and the `/authors` index are derived at build time by splitting on commas
and slugifying each name (`src/lib/taxonomy.ts`) -- there's nothing else to
create.
