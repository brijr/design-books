# Restructure into a pnpm workspace

Type: task
Status: resolved
Blocked by: 01

## Question

Purely mechanical restructure of this repo into a pnpm workspace — no refactors, every hunk a file move:

- Move the entire site into `apps/design-books` unchanged (source, `wrangler.jsonc`, `public/`, `scripts/`, configs).
- Replace the pnpm 10/11 compat-shim `pnpm-workspace.yaml` with a real workspace file (`packages: apps/*`, `packages/*`) — carrying forward whatever [How Workers Builds deploys a pnpm monorepo](01-workers-builds-monorepo.md) learned about which compat keys are still needed.
- Root `package.json` with the `packageManager` pin and workspace-level scripts.
- Preserve the load-bearing comments in `wrangler.jsonc` and the `.dev.vars` Discord-webhook setup.
- Done when `pnpm install` + `pnpm --filter design-books build` are green locally and `astro check` passes.

Do **not** rename the repo or touch Cloudflare in this ticket — that's [Rename to design-sites and re-point Workers Builds](04-rename-and-repoint.md).

## Answer

Resolved 2026-08-14. Done as commit `c047e5d` on branch **`monorepo-restructure`** (186 files; every app file a 100% git rename, so history follows).

- Entire site moved unchanged into `apps/design-books` (src, public, scripts, configs, `wrangler.jsonc` with its comments, `.dev.vars.example`).
- Root `pnpm-workspace.yaml` is now the real workspace declaration from the research findings: `packages: [apps/*, packages/*]` + both build-approval spellings + `minimumReleaseAgeExclude`, comments updated.
- New root `package.json` (`design-sites`, private) owns the `packageManager: pnpm@11.5.2` pin; app package renamed `designbooks` → `design-books` so worker name, domain, dir, and `pnpm --filter` all match.
- `.gitignore`: `node_modules`/`dist`/`coverage` unanchored to ignore at any depth. `.node-version` (22) copied into the app dir — Workers Builds reads version files from the project root directory.
- Verified green: `pnpm install` (pnpm 11.5.2), `pnpm --filter design-books build`, `astro check` (0 errors, 0 warnings). Redirect file lands at `apps/design-books/.wrangler/deploy/config.json` pointing at `../../dist/server/wrangler.json`, as the research predicted.
- **Sequencing constraint for the next ticket:** the branch is deliberately NOT merged to main. Merging before the Workers Builds root directory is re-pointed would make the live project build at the repo root and fail (site stays up, build goes red). Re-point first, then merge.
- Local dev note: no `.dev.vars` existed at restructure time; anyone recreating one should now put it at `apps/design-books/.dev.vars`.
