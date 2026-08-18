import { defineConfig } from "astro/config";

import cloudflare from "@astrojs/cloudflare";
import mdx from "@astrojs/mdx";
import tailwindcss from "@tailwindcss/vite";

// Mirrors apps/design-books (see its astro.config.mjs for the rationale on
// imageService and trailingSlash): fully prerendered, no runtime image
// service, no Cloudflare Images binding. `file` format keeps the no-slash
// URL as the one that resolves.
export default defineConfig({
  site: "https://design-styles.com",
  output: "static",
  // Pinned so `pnpm dev` at the repo root can run every app at once.
  server: { port: 4322 },
  trailingSlash: "never",
  build: { format: "file" },
  adapter: cloudflare({
    imageService: { build: "compile", runtime: "passthrough" },
    platformProxy: {
      enabled: true,
    },
  }),
  integrations: [mdx()],
  vite: {
    plugins: [tailwindcss()],
  },
});
