# Imagery rights and sourcing for a visual specimen site

Type: research
Status: resolved

## Question

design-styles' pages are "visual specimens" — annotated visual examples of
movements (Bauhaus, Memphis) and digital styles (neubrutalism, glassmorphism).
What can such a site legally and practically use for imagery?

Cover: open-access museum collections (Met, Rijksmuseum, Cooper Hewitt,
Smithsonian, MoMA policies), public-domain rules by era and jurisdiction,
poster/graphic-design archives, Wikimedia Commons and Flickr Commons,
CC-licensed sources, fair use for criticism/commentary (especially for recent
commercial work and UI), norms for UI screenshots of live products, and
whether recreating a style's visual grammar as original illustration sidesteps
the problem entirely.

Output: a practical sourcing matrix by entry type (historical movement ·
revived style · digitally native style · contemporary commercial work) with a
recommended default strategy and risk notes, citing primary sources (statutes,
museum open-access terms, license texts).

Findings land on branch `research/imagery-rights` as a markdown file; link it
here on resolution.

## Answer

Resolved 2026-08-14. Full findings with primary-source citations: `docs/research/imagery-rights.md` on branch `research/imagery-rights` (commit fc1279c, not pushed).

**Summary.** Copyright protects specific works, never styles: 17 USC 102(b) excludes ideas/systems, and Copyright Office Circular 33 + 37 CFR 202.1 expressly exclude typefaces, page/poster layout, and familiar symbols/patterns. So the site can draw its own annotated specimens of any style's grammar with near-zero copyright exposure. For historical material, works published before 1931 are US public domain as of 2026 (cutoff advances yearly), and the Met, Smithsonian/Cooper Hewitt, Rijksmuseum, and AIC release images of their public-domain holdings under CC0 (any use, incl. commercial, no permission). MoMA is NOT open access (permission-only via Art Resource/Scala); Letterform Archive doesn't hold rights and is a research corpus, not an image pool. Commons/Flickr Commons/Internet Archive license labels are unwarranted claims — verify upstream. Fair use (17 USC 107) supports small, reduced-size reproductions of in-copyright work inside genuine criticism (Bill Graham Archives v. DK, 2d Cir. 2006), but Warhol v. Goldsmith (2023) narrowed factor one for commercial uses that substitute for licensing markets. UI screenshots: unaltered + attributed + editorial is the industry norm; Microsoft and Google grant express permission for instructional screenshots, Apple does not (fair use only).

**Recommended default strategy: recreations first, CC0 second, fair use sparingly.**
- Historical movement (pre-1931 published): museum CC0 + verified pre-1931 scans; recreations for teaching diagrams.
- 20th-century movement still in copyright (Swiss/ITS, Memphis): recreations as primary imagery; a few small, low-res canonical works embedded in real commentary (Bill Graham pattern); license anything hero-level.
- Revived style: recreations (the revival's grammar is unprotectable; contemporary examples are fully copyrighted).
- Digitally native style (neubrutalism, glassmorphism, vaporwave): recreations — live HTML/CSS/SVG specimens; for vaporwave, recreate the aesthetic without its sampled copyrighted/trademarked assets.
- Contemporary commercial/UI: unaltered small screenshots, attributed, inside critique; never decorative; honor takedowns.

**Biggest risk to avoid:** drifting from "criticism with illustrations" into "image archive with captions" — large/high-res, lightly annotated reproductions of in-copyright work (MoMA-held, foreign/URAA-restored, or photos of 3D objects, which carry a second photographer copyright). Post-Warhol, that's the losing fact pattern. Track per-image provenance + license in the content model from day one.
