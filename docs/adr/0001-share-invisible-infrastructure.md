# 0001 — Share invisible infrastructure, not visible identity

Date: 2026-08-14
Status: accepted

## Context

design-sites hosts three sites about design (design-books, design-styles,
design-reference). Sites about design carry an unusual constraint: looking
alike would undercut the subject matter, but drifting on quality would too.
Two prior in-house design systems existed as candidates for a shared UI
layer: `brijr/ds` (pure-CSS theme-profile architecture, React/Base UI
components, no prose system) and `brijr/craft` (one-file React design system
with a strong Prose typography layer over a semantic token sheet). Both are
React/Next-oriented; these sites are Astro-first with rare React islands.

## Decision

Adopt neither system wholesale and port no React components. Cherry-pick
into two packages:

- `@design-sites/ui` — craft's semantic-token sheet as a **names-only
  contract** (each app supplies values), craft's Prose re-expressed as
  `.astro`/CSS on those tokens, `cn()`, and the theme-profile contract
  taken from ds: each app declares its identity in one `theme-profile.css`
  overriding an approved allowlist (fonts, palette, radius, accent,
  container width).
- `@design-sites/config` — tsconfig base and prettier config only.

SEO helpers stay per-site until a second *real* site needs metadata.
Shared `.astro` components are added only on concrete second-site demand.
ds's architecture doc and review checklist are adapted into `docs/design/`
as repo-wide design law.

## Consequences

- The three sites share a quality floor (tokens, dark-mode plumbing, prose
  typography, review discipline) while remaining visually distinct — no
  shared face, by design.
- Zero hydration cost from the shared layer: everything is CSS, class
  strings, or `.astro`.
- Abstractions are grown from at least two consumers, never speculated from
  one; the cost is occasional short-lived duplication (e.g. stubs copy
  styles until extraction lands).
