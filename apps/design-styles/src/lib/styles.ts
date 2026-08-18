import type { CollectionEntry } from "astro:content";

export type StyleEntry = CollectionEntry<"styles">;

export type SwatchAspect = "color" | "type" | "form";
export type Era = StyleEntry["data"]["era"];
export type Medium = StyleEntry["data"]["medium"][number];

export const ERAS = ["foundations", "modernism", "postmodernism", "digital"] as const;
export const MEDIUMS = ["graphic", "editorial", "identity", "interface", "product"] as const;

export type RailTile =
  | { kind: "specimen"; id: string; label: string }
  | { kind: "swatch"; id: string; aspect: SwatchAspect; label: string };

export function sortByYear(entries: StyleEntry[]) {
  return [...entries].sort((a, b) => {
    if (a.data.yearStart !== b.data.yearStart) {
      return a.data.yearStart - b.data.yearStart;
    }
    return a.data.title.localeCompare(b.data.title);
  });
}

export function eraLabel(era: Era) {
  switch (era) {
    case "foundations":
      return "Foundations";
    case "modernism":
      return "Modernism";
    case "postmodernism":
      return "Postmodernism";
    case "digital":
      return "Digital";
    default: {
      const _exhaustive: never = era;
      return _exhaustive;
    }
  }
}

export function mediumLabel(medium: Medium) {
  switch (medium) {
    case "graphic":
      return "Graphic";
    case "editorial":
      return "Editorial";
    case "identity":
      return "Identity";
    case "interface":
      return "Interface";
    case "product":
      return "Product";
    default: {
      const _exhaustive: never = medium;
      return _exhaustive;
    }
  }
}

export function groupByEra(entries: StyleEntry[]) {
  return ERAS.map((era) => ({
    era,
    label: eraLabel(era),
    entries: entries.filter((entry) => entry.data.era === era),
  })).filter((group) => group.entries.length > 0);
}

export function neighbors(entry: StyleEntry, sorted: StyleEntry[]) {
  const index = sorted.findIndex((item) => item.id === entry.id);

  return {
    previous: index > 0 ? sorted[index - 1] : undefined,
    next: index >= 0 && index < sorted.length - 1 ? sorted[index + 1] : undefined,
  };
}

export function titleHrefMap(entries: StyleEntry[]) {
  return new Map(entries.map((entry) => [entry.data.title, `/${entry.id}`]));
}

export function hrefForTitle(title: string, byTitle: Map<string, string>) {
  return byTitle.get(title);
}

function swatchLabel(aspect: SwatchAspect) {
  switch (aspect) {
    case "color":
      return "Color";
    case "type":
      return "Type";
    case "form":
      return "Form";
    default: {
      const _exhaustive: never = aspect;
      return _exhaustive;
    }
  }
}

export function railTiles(entry: StyleEntry): RailTile[] {
  return [
    { kind: "specimen", id: entry.id, label: "Specimen" },
    { kind: "swatch", id: entry.id, aspect: "color", label: swatchLabel("color") },
    { kind: "swatch", id: entry.id, aspect: "type", label: swatchLabel("type") },
    { kind: "swatch", id: entry.id, aspect: "form", label: swatchLabel("form") },
  ];
}
