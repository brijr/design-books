/// <reference types="astro/client" />

/**
 * Cloudflare runtime bindings.
 *
 * `cloudflare:workers` types its exported `env` against `Cloudflare.Env`, so
 * this namespace augmentation is what makes
 * `import { env } from "cloudflare:workers"` type-safe across the project.
 * Declaring a bare global `interface Env` does NOT reach it.
 *
 * The base interface is generated into worker-configuration.d.ts by
 * `pnpm types` (wrangler types) from wrangler.jsonc. Secrets never appear
 * there -- they are not declared in wrangler.jsonc by design -- so they are
 * merged in here instead.
 *
 * The webhook URL is optional because it is set as a Workers secret in
 * production (`wrangler secret put`) and via a gitignored `.dev.vars` locally --
 * neither is guaranteed to be present, and the submissions endpoint returns a
 * 503 rather than throwing when it is missing.
 */
declare namespace Cloudflare {
  interface Env {
    DISCORD_BOOK_SUBMISSIONS_WEBHOOK_URL?: string;
  }
}
