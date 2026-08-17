# What's portable from ds and craft

Type: research
Status: resolved

## Question

What in `brijr/ds` (design system by bridger tower) and `brijr/craft` (AI-first lightweight design system for responsive layouts + prose in React) is portable to an Astro-first shared UI layer for the design-sites monorepo?

Both are React/Next-oriented. design-books today uses Tailwind 4, `@tailwindcss/typography`, Manrope variable font, `clsx` + `tailwind-merge`, and some React islands via `@astrojs/react`.

Inventory what each repo offers (tokens, typography scale, layout primitives, prose styling, component patterns), assess which parts survive in Astro sites (pure-CSS/Tailwind-preset parts port trivially; React components only work as islands), and recommend one of: **adapt one wholesale**, **cherry-pick specific pieces**, or **grow a fresh shared layer**.

Output feeds [Decide the shared packages strategy](06-shared-packages-strategy.md).

Findings land on branch `research/ds-craft-portability` as a markdown file; link it here on resolution.

## Answer

**Cherry-pick — adopt neither repo wholesale, and port no React components.** Full findings with inventory tables: `docs/research/ds-craft-portability.md` on branch `research/ds-craft-portability` (commit ad5c2e2, not pushed).

- **`brijr/ds`** (1fa8fa2, WIP): its gold is architecture, not code — a pure-CSS theme package with a "Theme Profile" contract (semantic `--ds-*` variables, documented allowlist, one profile file per app, light/dark via `prefers-color-scheme` + `[data-theme]`) plus a strong design-philosophy doc and review checklist. Its 4 components wrap `@base-ui/react` and its vocabulary is product-app-shaped (controls, forms, settings); no prose system at all.
- **`brijr/craft`** (1333d16, v0.3.56): one-file `ds.tsx` — `cn()`, trivial layout wrappers, and a rich **Prose** typography system as Tailwind 4 class strings over shadcn oklch tokens (`packages/ui/globals.css`). Everything is stateless class strings, so it ports to Astro with zero hydration.

**Recommendation** — seed the shared layer with five transplants: (1) `cn()` (design-books already has craft's verbatim); (2) craft's shadcn-style Tailwind 4 token sheet as the shared semantic-token + dark-mode contract, values per-site; (3) craft's Prose re-expressed as an `.astro` component / CSS class on those tokens; (4) ds's theme-profile *pattern* — one `theme-profile.css` per site overriding approved variables (fonts, palette, radius, accent, container width); (5) ds's architecture doc + review checklist as monorepo agent guidance. Skip: ds components/patterns + Base UI, craft's Layout/Nav/Container components, its CLI, `next-themes`.

Counter-position honored: three design sites should look distinct, so only invisible infrastructure (token *names*, `cn`, dark-mode plumbing, prose quality floor, review discipline) is shared; identity-bearing values stay per-site behind the profile contract. Grow shared `.astro` components only on concrete second-site demand.

Feeds [06-shared-packages-strategy.md](06-shared-packages-strategy.md).
