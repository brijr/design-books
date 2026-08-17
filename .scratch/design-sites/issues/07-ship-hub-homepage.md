# Ship the design-sites.com hub homepage

Type: task
Status: closed — out of scope
Blocked by: 03

## Question

Scope extension requested by Bridger mid-effort (2026-08-14): design-sites.com
(owned, zone reportedly in the WIP Cloudflare account; acquired domain,
registrar Alpine Domains) should serve a hub homepage for the family of sites.

- Scaffold `apps/design-sites`: a type-driven one-pager in the family style
  (Manrope, zinc, by copy per ADR 0001) that introduces "websites about
  design by Bridger Tower" and links the three sites — design-books.com
  (live), design-styles.com and design-reference.com (coming soon).
- Unlike the stubs, this page is real, permanent content: indexable, no
  robots Disallow.
- Own Worker (`design-sites`), own wrangler.jsonc mirroring the family
  config; domain attached via `wrangler deploy --domain design-sites.com`;
  git-connected Workers Builds project like the others.
- Done when design-sites.com serves the hub from a green Workers Builds
  deploy.

## Comments

2026-08-14: `apps/design-sites` shipped (commit `d7ec8ab`), Worker deployed and
serving at design-sites.brijr.workers.dev. **Domain blocked on DNS:** the
design-sites.com zone is NOT in the WIP Cloudflare account — nameservers are
ns1–3.power-dns.com (parking/marketplace DNS; the domain was acquired, registrar
Alpine Domains Inc.), and `wrangler deploy --domain` fails with "Can't infer
zone" (code 10082). HITL: add the zone to the WIP account, switch nameservers at
the registrar, then re-run
`CLOUDFLARE_ACCOUNT_ID=4976e8a5df6887f41b287a83e6b5c18f npx wrangler deploy --domain design-sites.com`
from `apps/design-sites`. Root workspace package renamed `design-sites-monorepo`
so the app could take the `design-sites` package name.

2026-08-14, later: **Closed as out of scope.** design-sites.com turned out not to
be owned at all — it's a third-party parked registration from 2008. Bridger
chose to drop the hub and link the sites from bridger.to later. Everything
reverted: Worker deleted from Cloudflare (no orphaned KV — the only session
namespace is design-books'), `apps/design-sites` removed (commit `7ac34b9`),
root package name reverted to `design-sites`.
