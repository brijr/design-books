import { defineConfig } from "astro/config";

import cloudflare from "@astrojs/cloudflare";
import mdx from "@astrojs/mdx";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";

// https://astro.build/config
export default defineConfig({
  site: "https://designbooks.org",
  output: "static",
  adapter: cloudflare({
    // Every page that renders a cover is prerendered, so transform images at
    // build time and ship no runtime image service at all. The adapter's
    // default routes <Image> through /_image backed by the Cloudflare Images
    // binding -- a paid, separately-provisioned service this site does not
    // need, and which would 404 every cover if it were ever unbound.
    imageService: { build: "compile", runtime: "passthrough" },
    platformProxy: {
      enabled: true,
    },
  }),
  integrations: [mdx(), react(), sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
});
