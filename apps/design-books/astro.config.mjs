import { defineConfig } from "astro/config";

import cloudflare from "@astrojs/cloudflare";
import mdx from "@astrojs/mdx";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";

// https://astro.build/config
export default defineConfig({
  site: "https://design-books.com",
  output: "static",
  // Production serves /a-pattern-language directly and 308s the trailing-slash
  // form away. Astro's directory format does the exact inverse, which would put
  // a redirect hop in front of every inbound link, every sitemap <loc>, and
  // every JSON-LD url -- and contradict our own canonical tags. `file` format
  // emits a-pattern-language.html so the no-slash URL is the one that resolves.
  trailingSlash: "never",
  build: { format: "file" },
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
