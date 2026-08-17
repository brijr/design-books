# Ship the design-philosophies stub

Type: task
Status: claimed
Blocked by: 04

## Question

Scope extension (2026-08-14, second of the day): Bridger registered
design-philosophies.com via Cloudflare Registrar (verified owned, zone in the
CF account) and wants it in the family.

Same recipe as [Ship the design-styles and design-reference stubs](05-ship-stubs.md):
scaffold `apps/design-philosophies` as a type-driven one-pager by copy,
own Worker (`design-philosophies`), domain attached via
`wrangler deploy --domain design-philosophies.com`, noindex until real,
git-connected Workers Builds project. Also add the new sibling link to the
existing stubs' footers.

Done when design-philosophies.com serves the stub from a green Workers Builds
deploy.

## Comments

2026-08-14: Shipped (commit `7b0afed`) and CLI-deployed; design-philosophies.com
and the workers.dev fallback both serve 200. Sibling footers and root README
updated. Note: the commit also swept in ~30 design-books content files Bridger
was adding concurrently (verified: design-books still builds clean). Remaining:
the Workers Builds connect, same settings as the other stubs.
