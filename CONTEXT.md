# Context

Glossary of canonical terms for the design-sites monorepo. Vocabulary only —
implementation lives in code, decisions in `docs/adr/`.

## App

One deployable Astro site under `apps/<name>`. An app owns its **identity** —
palette values, fonts, radius, accent — and deploys as its own Cloudflare
Worker. Apps are expected to look distinct from one another.

## Shared layer

The packages under `packages/` (`@design-sites/ui`, `@design-sites/config`).
Invisible infrastructure only: utilities, contracts, tooling config, and
quality floors. The shared layer never carries an app's visible identity.

## Token contract

The shared set of semantic CSS token *names* (and their light/dark plumbing)
that every app implements. The contract fixes what tokens exist and mean;
each app supplies its own values.

## Theme Profile

An app's single CSS file assigning values to the approved allowlist of tokens
(fonts, palette, radius, accent, container width). The only place an app's
identity lives; everything else styles against the token contract.

## Prose

The shared long-form typography treatment for article and content flows. The
quality floor for reading experiences, built on the token contract so it
renders in each app's own voice.

## Stub

A placeholder one-pager app holding a domain before the real site exists.
Stubs copy what they borrow rather than importing from the shared layer.
