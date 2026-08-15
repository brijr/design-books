# design-styles.com — locked brief

Verb: **See**. Locked 2026-08-14 (site-content effort, "Lock the design-styles
brief" ticket). Inherits [family-vision.md](family-vision.md); this brief adds
the decisions the vision left open. Amend only via the proving batch.

## Premise

A visual field guide to the movements and visual languages that shape design —
organized timeline-wise, built for **recognition**: what does this look like,
where did it come from, how do I spot it in the wild.

## Position

(From the prior-art survey, branch `research/prior-art`.) Wikipedia is deep but
visually starved; museums have imagery without narrative; trend galleries decay
and die. Nothing offers a visual field guide with a historical spine connecting
Bauhaus to neubrutalism. That connective spine — plus original specimens — is
the moat. Link out to museum collections; never compete with them.

## Content model

One collection, two types (never divided past/present):

- **Movement** — historical context, participants, geography, usually an
  articulated agenda (Bauhaus, De Stijl, Memphis).
- **Style** — a recognizable visual language, possibly diffuse, revived, or
  digitally native (neubrutalism, glassmorphism, vaporwave).

Attributes per entry: type (movement/style) · status (historical, revived,
current, emerging) · period + place · medium (graphic, editorial, identity,
interface, product) · influences and descendants.

Page anatomy — a **specimen**, not an article:

1. One-sentence definition
2. Annotated visual examples
3. Visual grammar: type, color, form, grid, imagery, material, motion
4. Origins and context
5. Key figures and works
6. "Often confused with"
7. Contemporary applications
8. Related philosophies and books (canonical-home links)

Every image carries `source` + `license` fields. Interface direction (for the
build): exploratory — visual index, timeline, filters, side-by-side compare.

## Imagery policy (locked)

**Recreations first, CC0 second, fair use sparingly** (full findings: branch
`research/imagery-rights`). Styles aren't copyrightable — original specimens
are the default and the signature. Museum CC0 (Met, Smithsonian/Cooper Hewitt,
Rijksmuseum, AIC) for pre-1931 material; small in-copyright reproductions only
inside genuine criticism; never let a page drift into "image archive with
captions." Vaporwave et al.: recreate the aesthetic, never its sampled assets.

## Recreations (locked)

**Medium-matched.** Digitally native styles get *live HTML/CSS/SVG specimens*
— the neubrutalism specimen IS neubrutalist, inspectable. Historical movements
get annotated diagrams + CC0 imagery.

## Launch scope (locked)

**2D-visual launch**: graphic, identity, interface. Editorial folds into
graphic; product-led entries (Rams-era Braun etc.) are a second wave — the
attribute exists from day one, unused.

## Voice (locked)

**Field-guide observational.** Precise, recognition-first, "how to spot it,"
short declarative sentences — a birding guide written by a designer. Not
encyclopedic (Wikipedia's register), not chatty (trend-blog register).

## Launch list (24 entries, locked)

★ = proving-batch anchor.

**Foundations 1880–1920:** Arts & Crafts (movement, historical) · Art Nouveau
(movement, historical) · Dada (movement, historical) · Constructivism
(movement, historical) · De Stijl (movement, historical)

**Modernism 1919–1975:** Bauhaus ★ (movement, historical) · The New
Typography (movement, historical) · Art Deco (movement, revived) ·
International Typographic Style (movement, revived) · New York School
(movement, historical)

**Counterculture & Postmodernism 1965–1995:** Psychedelia (style, historical)
· Punk / DIY (style, historical) · New Wave / Swiss Punk (style, historical) ·
Memphis ★ (movement, historical) · Grunge (style, historical)

**Digital & Living 1995–now:** Y2K ★ (style, revived) · Minimalism ★ (style,
current — the contested boundary with design-philosophies) · Skeuomorphism
(style, historical) · Flat Design (style, current) · Vaporwave (style,
current) · Web Brutalism (style, historical) · Neubrutalism ★ (style,
current) · Glassmorphism (style, current) · Corporate Memphis (style, current)

**Bench (post-launch):** Futurism, Plakatstil, Vienna Secession, Streamline
Moderne, Op Art, Metro/Fluent, Neumorphism, rave/techno graphics.

## Next

The proving batch (map ticket "Write the design-styles proving batch"): ~7
entries anchored on the ★ set, this file graduates to `content/design-styles/`.
