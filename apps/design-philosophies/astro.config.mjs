import { defineConfig } from "astro/config";

import cloudflare from "@astrojs/cloudflare";
import tailwindcss from "@tailwindcss/vite";

// Mirrors apps/design-books (see its astro.config.mjs for the rationale on
// imageService): fully prerendered, no runtime image service, no Cloudflare
// Images binding.
export default defineConfig({
  site: "https://design-philosophies.com",
  output: "static",
  // Pinned so `pnpm dev` at the repo root can run every app at once.
  server: { port: 4324 },
  adapter: cloudflare({
    imageService: { build: "compile", runtime: "passthrough" },
    platformProxy: {
      enabled: true,
    },
  }),
  vite: {
    plugins: [tailwindcss()],
  },
});
