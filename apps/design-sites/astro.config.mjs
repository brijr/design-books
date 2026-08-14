import { defineConfig } from "astro/config";

import cloudflare from "@astrojs/cloudflare";
import tailwindcss from "@tailwindcss/vite";

// Mirrors apps/design-books (see its astro.config.mjs for the rationale on
// imageService): fully prerendered, no runtime image service, no Cloudflare
// Images binding.
export default defineConfig({
  site: "https://design-sites.com",
  output: "static",
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
