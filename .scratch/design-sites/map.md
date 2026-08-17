# Map: design-sites monorepo

Label: wayfinder:map
Tracker: local markdown — tickets are files in `issues/`, per `docs/agents` local-tracker conventions.

## Destination

`brijr/design-sites` exists (the design-books repo renamed in place) as a pnpm monorepo: design-books deploys green from `apps/design-books` via Workers Builds on its existing domains (designbooks.org, design-books.com), and tasteful-but-bare stubs are live on design-styles.com, design-reference.com, and design-philosophies.com (scope extended 2026-08-14 for the newly registered domain). **Execution is carried in-map** — the map is done when the monorepo is real, not when it's merely specified.

## Notes

- Solo dev (Bridger, they/them pronouns unconfirmed — use name). All tickets claimed by the same person; concurrency between agent sessions still possible.
- **Locked stack (do not re-litigate):** Astro + Cloudflare Workers via git-connected Workers Builds (one CF project per app) + pnpm workspace + Tailwind 4. Plain pnpm — no Turborepo.
- **Conventions decided at charting:** app dirs use full names matching worker name and domain (`apps/design-books`, `apps/design-styles`, `apps/design-reference`); the migration is purely mechanical (file moves, no refactors); stubs are type-driven one-pagers borrowing design-books' Manrope/Tailwind setup, no design session.
- **Facts confirmed at charting (2026-08-14):** design-styles.com (reg. 2026-08-14) and design-reference.com (reg. 2026-08-12) are registered via Cloudflare Registrar in Bridger's CF account. design-books deploys via git-connected Workers Builds. Working tree clean at charting time.
- **Load-bearing knowledge to preserve:** the comments in `wrangler.jsonc` (Astro adapter's redirected config drops `routes` → domains attach via `wrangler deploy --domain`; `workers_dev` kept on deliberately; Discord webhook is a secret, never a var) and the pnpm 10/11 compat commentary in the current `pnpm-workspace.yaml`.
- Skills per ticket type: grilling tickets use `/grilling` + `/domain-modeling`; research tickets use `/research`.

## Decisions so far

<!-- one line per closed ticket: gist + link -->

- [How Workers Builds deploys a pnpm monorepo](issues/01-workers-builds-monorepo.md) — plan confirmed viable: per-app root directory (`/apps/<app>`), build watch paths exist, `PNPM_VERSION=11.5.2` build var required (`packageManager` is ignored), real `packages: [apps/*, packages/*]` retires half the compat shim (keep both build-approval keys), redirected-config and custom domains unaffected — but the repo must stay connected to the *existing* design-books Worker with `name: design-books`. Findings on branch `research/workers-builds-monorepo`.
- [Restructure into a pnpm workspace](issues/03-restructure-pnpm-workspace.md) — done on branch `monorepo-restructure` (commit `c047e5d`): site moved unchanged to `apps/design-books`, real workspace files at root, install/build/check green. Deliberately unmerged — the Workers Builds root directory must be re-pointed first (next ticket).
- [Rename to design-sites and re-point Workers Builds](issues/04-rename-and-repoint.md) — done and verified: repo is `brijr/design-sites`, Workers Builds re-pointed to `/apps/design-books` and deployed green from the monorepo (2026-08-14T20:07Z), domains and Discord secret intact. CF account is "WIP" (`4976e8a5…`) — see ticket for CLI access note.
- [Decide the shared packages strategy](issues/06-shared-packages-strategy.md) — share invisible infrastructure, not visible identity: `@design-sites/ui` (token contract, Prose, `cn()`) + `@design-sites/config`, theme profiles keep identity per-site, SEO stays per-site until the second real site, stubs consume nothing. ADR at `docs/adr/0001`; extraction outline recorded for the follow-on effort.
- [What's portable from ds and craft](issues/02-ds-craft-portability.md) — cherry-pick, no wholesale adoption, no React ports: share `cn()`, craft's semantic-token sheet (names shared, values per-site), craft's Prose re-expressed for Astro, ds's theme-profile pattern, and ds's architecture/review docs; identity stays per-site. Findings on branch `research/ds-craft-portability`.

## Not yet specified

- **Monorepo housekeeping** — dependency-update automation across apps; 9 pre-existing dependabot alerts (5 high, 4 moderate) to triage. (Root README done in the rename ticket.) Hangs on [Restructure into a pnpm workspace](issues/03-restructure-pnpm-workspace.md). (The compat-shim question graduated: answered by [How Workers Builds deploys a pnpm monorepo](issues/01-workers-builds-monorepo.md), applied in the restructure ticket.)
- **Root-level dev ergonomics** — scripts and a short "adding site #4" doc for future-you. Hangs on the restructure landing.

## Out of scope

- **A hub homepage on design-sites.com** — briefly scoped in at Bridger's request (2026-08-14), then closed when the domain turned out to be a third-party parked registration, not owned. Built, shipped, and fully reverted the same day; the family will be linked from bridger.to instead. See [Ship the design-sites.com hub homepage](issues/07-ship-hub-homepage.md) (closed).
- **What design-styles.com and design-reference.com actually become** — content, product, design. Each is its own future effort once its stub is live.
- **Absorbing other existing sites** (design-md, etc.) into the monorepo. The `apps/*` structure accommodates them whenever; nothing here needs to anticipate them.
- **Executing the shared-package extraction** — [Decide the shared packages strategy](issues/06-shared-packages-strategy.md) produces the decision; the extraction itself is a follow-on effort.
- **Turborepo / task-runner adoption** — revisit only if `packages/` grows real consumers.
