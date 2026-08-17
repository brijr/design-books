# How Workers Builds deploys a pnpm monorepo

Type: research
Status: resolved

## Question

How should the design-sites pnpm monorepo be configured so Cloudflare Workers Builds deploys each app as its own Workers project? Specifically:

1. **Root directory** — per-project root directory setting: does the install run at the workspace root or the app dir, and where must the build command run for a pnpm workspace?
2. **Build watch paths** — how to configure path filtering so a commit touching only one app doesn't rebuild the other two (does Workers Builds support watch paths the way Pages does, and what syntax?).
3. **Version resolution** — is `packageManager` (pnpm 11 pin) honored in a monorepo build? Is the pnpm 10/11 compat shim in the current `pnpm-workspace.yaml` (see its comments — `packages`, `onlyBuiltDependencies` vs `allowBuilds`) still needed once the file becomes a *real* workspace declaration, and what does the merged file look like?
4. **Astro adapter from a subdirectory** — any quirks with `@astrojs/cloudflare`'s redirected config (`dist/server/wrangler.json`) when the app lives in `apps/design-books`? Do the existing custom domains stay attached when deploys start coming from Workers Builds with a new root directory?

Output: facts with citations to Cloudflare/Astro docs + a recommended Workers Builds settings block per app (root dir, build command, watch paths) and the recommended workspace-root file set.

Findings land on branch `research/workers-builds-monorepo` as a markdown file; link it here on resolution.

## Answer

Resolved 2026-08-14. Full findings with citations: `docs/research/workers-builds-monorepo.md` on branch `research/workers-builds-monorepo` (commit 325add3, not pushed).

1. **Root directory** — Per-project setting; both the build command and the deploy command run there, and the app's `wrangler.jsonc` is looked up there (workers/ci-cd/builds/configuration + advanced-setups docs). The automatic dependency install works from the app dir because pnpm walks up to `pnpm-workspace.yaml` and "inside a workspace, pnpm install installs all dependencies in all the projects" (pnpm.io/cli/install). Set root dir `/apps/design-books` etc., one Workers project per app. Dashboard Worker name must match wrangler config `name` or the build fails.

2. **Build watch paths** — Yes, Workers Builds supports them (Settings > Build > Build watch paths; docs page workers/ci-cd/builds/build-watch-paths). Include/Exclude lists, repo-relative, `*` wildcard at start/end or alone; excludes evaluated first; defaults include=`[*]` exclude=`[]`. Recommended include per app: `apps/<app>/*`, `packages/*`, `pnpm-lock.yaml`, `pnpm-workspace.yaml`, `package.json`. Caveat: skipping is bypassed for pushes with 3000+ files or 20+ commits.

3. **Version resolution** — `packageManager` is NOT honored by Workers Builds (build-image doc lists env-var/version-file overrides only; pnpm default is 10.11.1, override via `PNPM_VERSION` build variable — no version file for pnpm). Set `PNPM_VERSION=11.5.2` on all three projects. The merged workspace file: real `packages: [apps/*, packages/*]` (satisfies every pnpm version — the "packages field missing or empty" hard error is pnpm <= 10.9, relaxed in 10.10, verified in pnpm source) + keep BOTH `onlyBuiltDependencies` (pnpm <= 10.25) and `allowBuilds` (pnpm >= 10.26/11 — v11 removed the old key, per pnpm.io/settings/build + pnpm.io/migration) + keep `minimumReleaseAgeExclude` (v11 defaults minimumReleaseAge to 1440). Footgun: never write bare `pnpm deploy` in CI (pnpm 10 built-in shadows the script; fixed only in v11) — use `pnpm run deploy` / `npx wrangler deploy`.

4. **Astro adapter from a subdirectory** — No quirks: wrangler finds `.wrangler/deploy/config.json` by walking up from the cwd (= root directory), so the redirected `dist/server/wrangler.json` flow is unchanged at `apps/design-books`; `wrangler versions upload` (preview builds) honors it too. Custom domains STAY attached: verified in wrangler 4.121.0 source that `triggersDeploy` only touches domains/routes when the deployed config declares them (no reconcile-to-empty), so config-less deploys from Workers Builds never detach `designbooks.org`/`design-books.com`. `wrangler deploy --domain` is a documented flag. Critical: connect the repo to the EXISTING design-books Worker and keep `name: design-books` — a new/renamed Worker would not carry the domains or secrets.

Recommended per-app settings block and workspace-root file set are in the branch doc. Nothing found invalidates the plan.
