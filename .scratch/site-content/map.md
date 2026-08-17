# Map: site-content — content for the three unbuilt sites

Label: wayfinder:map
Tracker: local markdown — tickets are files in `issues/`.

## Destination

Three locked one-page content briefs — one per unbuilt site (design-styles,
design-reference, design-philosophies), each with premise, content model,
entry anatomy, voice, and a ~20-entry launch list — each **proven** by a
written batch of ~7 real entries spanning the hard cases, all living under
`content/`. Builds are out of scope; this map ends when the content is proven
and the specs are locked.

## Notes

- **Founding asset:** [`content/family-vision.md`](../../content/family-vision.md) —
  Bridger's family vision (2026-08-14). The verb framework (styles=**See**,
  reference=**Use**, philosophies=**Think**, books=**Read**), per-site content
  models, entry anatomies, and the canonical-home relationship rule are all
  settled there. Tickets grill only what it leaves open.
- design-styles organizes **timeline-wise around movements** (Bridger, at
  charting), with movements and styles as two content types in one collection.
- **Drafting mode:** the agent drafts entries and briefs AFK; Bridger reacts
  (HITL review). Bridger's taste shows in what gets rejected.
- **Proving bar:** ~7 entries per site spanning deliberate hard cases — not
  seven easy wins (e.g. styles: one canonical movement, one living digital
  style, one contested boundary case).
- File layout: `content/<site>.md` while it's all spec; graduates to
  `content/<site>/` (brief + one file per entry) when entries start.
- "A Design Source project" as the shared identity name is **tentative** —
  decided in the relationship-system ticket.
- Sibling map: `.scratch/design-sites/` (monorepo effort, nearly closed —
  three dashboard connects pending). Builds replacing the stubs will be new
  efforts after this map.
- Skills: grilling tickets use `/grilling` + `/domain-modeling`; research uses
  `/research`.

## Decisions so far

<!-- one line per closed ticket: gist + link -->

- [Imagery rights and sourcing for a visual specimen site](issues/01-imagery-rights.md) — **recreations first, CC0 second, fair use sparingly**: styles themselves aren't copyrightable (own drawn/live-code specimens are near-zero risk), pre-1931 works are public domain with CC0 museum imagery (Met, Smithsonian, Rijksmuseum, AIC; MoMA is not open access), small in-copyright reproductions only inside genuine criticism. Track per-image source + license from day one. Findings on branch `research/imagery-rights`.
- [Lock the design-styles brief and launch list](issues/03-lock-styles-brief.md) — brief locked in `content/design-styles.md`: recreations-first imagery, medium-matched specimens (live code for digital styles), 2D-visual launch scope, field-guide voice, all 24 launch entries kept with ★ anchors Bauhaus/Memphis/Y2K/Minimalism/Neubrutalism.
- [Prior art across the family's three spaces](issues/02-prior-art-survey.md) — every space is fragmented islands and dying labors of love: no visual field guide with a historical spine (SEE), no designer-side MDN unifying answers + tools + cited sources (USE), nobody maps schools of thought or steelmans (THINK). Maintenance and four-verb interconnection are the moat. Findings on branch `research/prior-art`.

## Not yet specified

- **A shared entry-format convention** (frontmatter shape, attribute naming)
  across the three sites' content, so future builds can consume it — hangs on
  the proving batches revealing what the entries actually need.
- **Voice calibration per site** beyond what the vision fixes — expected to
  sharpen inside each define ticket and its proving batch.

## Out of scope

- **Building the three sites** (replacing stubs with real apps) — one future
  effort per site, fed by this map's briefs.
- **design-reference's JSON/API/agent-readable exposure** — floated in the
  vision as an eventual direction; a build-time concern, not a content one.
- **Changes to design-books' content** — it's the Read verb's proven, live
  home; the relationship system links to it, nothing here rewrites it.
- **Producing imagery** (shooting/commissioning specimens) — sourcing rules
  are in scope via research; production belongs to the builds.
