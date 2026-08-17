# Ship the design-styles and design-reference stubs

Type: task
Status: claimed
Blocked by: 04

## Question

Two minimal Astro apps, live on their domains:

- Scaffold `apps/design-styles` and `apps/design-reference`: tasteful-but-bare type-driven one-pagers borrowing design-books' Manrope + Tailwind 4 setup **by copy, not import** — [Decide the shared packages strategy](06-shared-packages-strategy.md) ruled that stubs consume no shared packages; the extraction effort wires all three apps later. No design session — a placeholder is a placeholder.
- Each gets its own `wrangler.jsonc` (worker names `design-styles`, `design-reference`) mirroring design-books' hard-won config (comments included where they apply).
- Create two new git-connected Workers Builds projects with the settings proven by [Rename to design-sites and re-point Workers Builds](04-rename-and-repoint.md); attach design-styles.com and design-reference.com (already in the CF account via Cloudflare Registrar).
- `noindex` robots.txt until real content exists.
- Done when both domains serve their stubs from a green Workers Builds deploy.
