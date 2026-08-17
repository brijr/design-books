# Decide the shared packages strategy

Type: grilling
Status: resolved
Blocked by: 02

## Question

What shared packages should design-sites have, and what goes in them? Candidates: `packages/config` (tsconfig, prettier, Tailwind preset), `packages/seo` (the meta/OG/sitemap helpers now in `src/lib/seo.ts`), `packages/ui` (layout primitives, typography). Informed by [What's portable from ds and craft](02-ds-craft-portability.md) — adapt, cherry-pick, or grow fresh.

Also decide the counter-position honestly: three sites *about design* may want to look distinct — how much sharing is actually desirable vs. drift being fine?

Resolution is a **decision plus a rough extraction outline** for the follow-on effort. Executing the extraction is out of scope for this map (see map's Out of scope).

Run with `/grilling` + `/domain-modeling`.

## Answer

Resolved 2026-08-14 via two grilling rounds. **Strategy: share invisible infrastructure, not visible identity** (ADR `docs/adr/0001-share-invisible-infrastructure.md`; glossary terms in root `CONTEXT.md`).

Decisions:
- The research's five-transplant cherry-pick is the backbone: `cn()`, craft's semantic-token sheet as a names-only contract (values per-site), craft's Prose re-expressed as `.astro`/CSS, ds's theme-profile pattern, ds's architecture doc + review checklist. No React ports, no wholesale adoption.
- **Two packages**: `@design-sites/ui` (single package: tokens.css, Prose, `cn()`, the token contract doc) and `@design-sites/config` (tsconfig base + prettier only). No further split until a seam becomes real.
- **SEO helpers stay per-site.** Recorded trigger: revisit a shared `packages/seo` when the *second real site* (not a stub) needs metadata.
- **Stubs consume nothing** — they borrow design-books' look by copy; the extraction effort wires all three apps at once.
- ds's design docs land at `docs/design/` (repo-wide law, not package docs).

Extraction outline for the follow-on effort (out of scope for this map):
1. `@design-sites/config`: tsconfig base + prettier; all apps point at it.
2. `@design-sites/ui`: port craft's token sheet as the names-only contract; Prose as `.astro`/CSS on those tokens; move `cn()` in.
3. Theme-profile contract + per-site `theme-profile.css` — design-books' current values become its profile. (The only step with design judgment in it.)
4. design-books and stubs adopt, deleting their local copies.
5. `docs/design/` adapted from ds's architecture doc + review checklist.
