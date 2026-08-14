# design-sites

Websites about design by [Bridger Tower](https://bridger.to) — a pnpm monorepo
of [Astro](https://astro.build) apps deployed to Cloudflare Workers.

| App | Domain | What it is |
| --- | --- | --- |
| [`apps/design-books`](apps/design-books) | [design-books.com](https://design-books.com) · [designbooks.org](https://designbooks.org) | A curated library of the best books on design and HCI |
| `apps/design-styles` | design-styles.com | Coming soon |
| `apps/design-reference` | design-reference.com | Coming soon |
| `apps/design-philosophies` | design-philosophies.com | Coming soon |

## Development

```bash
pnpm install
pnpm dev            # design-books dev server
pnpm --filter <app> dev
pnpm build          # build every app
```

Each app deploys as its own Cloudflare Worker via git-connected Workers Builds,
with the project's root directory set to `apps/<app>` and build watch paths
scoped so a commit to one app doesn't rebuild the others. App-specific docs
live in each app's README.
