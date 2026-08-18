export const SPECIMEN_IDS = [
  "arts-and-crafts",
  "art-nouveau",
  "dada",
  "constructivism",
  "de-stijl",
  "bauhaus",
  "the-new-typography",
  "art-deco",
  "international-typographic-style",
  "new-york-school",
  "psychedelia",
  "punk-diy",
  "new-wave-swiss-punk",
  "memphis",
  "grunge",
  "y2k",
  "skeuomorphism",
  "vaporwave",
  "minimalism",
  "flat-design",
  "web-brutalism",
  "corporate-memphis",
  "neubrutalism",
  "glassmorphism",
] as const;

export type SpecimenId = (typeof SPECIMEN_IDS)[number];

export function hasSpecimen(id: string): id is SpecimenId {
  return (SPECIMEN_IDS as readonly string[]).includes(id);
}
