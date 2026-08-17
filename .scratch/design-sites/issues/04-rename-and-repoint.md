# Rename to design-sites and re-point Workers Builds

Type: task
Status: resolved
Blocked by: 03

## Question

Make the restructured repo *be* design-sites and prove design-books still ships. The restructure lives on branch `monorepo-restructure` (commit `c047e5d`) — **re-point the Workers Builds root directory before merging it to main**, or the live project will build at the repo root and go red (see the answer on [Restructure into a pnpm workspace](03-restructure-pnpm-workspace.md)).

- Rename `brijr/design-books` → `brijr/design-sites` on GitHub (`gh repo rename`; GitHub redirects the old URL, stars carry over). Update the local remote, repo description, and README framing.
- Re-point the existing design-books Workers Builds project: root directory `apps/design-books`, build watch paths, and version settings per [How Workers Builds deploys a pnpm monorepo](01-workers-builds-monorepo.md). Dashboard steps are HITL — hand Bridger a precise checklist for anything the CLI can't do.
- Verify: a push triggers a green Workers Builds deploy; designbooks.org and design-books.com serve it; the `DISCORD_BOOK_SUBMISSIONS_WEBHOOK_URL` secret survived (secrets live on the Worker and should persist — confirm, don't assume); `workers_dev` fallback still up.

Resolution records what was done plus any facts later tickets depend on (dashboard setting names, gotchas hit).

## Answer

Resolved 2026-08-14. The repo IS design-sites now, and design-books ships from inside it.

- Renamed `brijr/design-books` → `brijr/design-sites` via `gh repo rename` (redirects active, local remote auto-updated); description updated. README split: app docs moved to `apps/design-books/README.md`, new root monorepo README (commit `c417bfe`).
- Bridger re-pointed the Workers Builds project per checklist: root directory `/apps/design-books`, build `pnpm run build`, deploy `npx wrangler deploy`, `PNPM_VERSION=11.5.2`, watch paths (`apps/design-books/*`, `packages/*`, `pnpm-lock.yaml`, `pnpm-workspace.yaml`, `package.json`), build cache on. The GitHub App connection survived the repo rename.
- Merged `monorepo-restructure` → main (fast-forward to `c417bfe`), pushed ~20:04Z. **Verified:** new deployment created 2026-08-14T20:07:31Z via Workers Builds; design-books.com serves 200 with correct title; designbooks.org 301s to design-books.com (expected canonical redirect); `wrangler secret list` shows `DISCORD_BOOK_SUBMISSIONS_WEBHOOK_URL` intact.

Facts later tickets depend on:
- **CF account** for these Workers: "WIP", account id `4976e8a5df6887f41b287a83e6b5c18f`. It is NOT in the current wrangler OAuth token's account list (token predates it), but CLI commands work with `CLOUDFLARE_ACCOUNT_ID=4976e8a5df6887f41b287a83e6b5c18f` set. Ticket 05 needs this for the two new Workers projects.
- GitHub flagged 9 pre-existing dependabot vulnerabilities (5 high, 4 moderate) on push — logged under housekeeping fog, not caused by the restructure.
