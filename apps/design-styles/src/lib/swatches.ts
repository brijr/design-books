export type SwatchSpec = {
  colors: string[];
  ground?: string;
};

export const SWATCHES: Record<string, SwatchSpec> = {
  "arts-and-crafts": {
    colors: ["#6b3a2a", "#c4a35a", "#2f4a3a", "#e8dcc4"],
  },
  "art-nouveau": {
    colors: ["#2d6a4f", "#d4a017", "#7b2d5b", "#f3e6c8"],
  },
  dada: {
    colors: ["#111111", "#c8102e", "#f4e8c1", "#4a4a4a"],
  },
  constructivism: {
    colors: ["#c8102e", "#111111", "#f2e8d5", "#1a1a1a"],
  },
  "de-stijl": {
    colors: ["#c8102e", "#003da5", "#f0c400", "#111111"],
  },
  bauhaus: {
    colors: ["#c8102e", "#f0c400", "#003da5"],
  },
  "the-new-typography": {
    colors: ["#111111", "#c8102e", "#f4f0e6"],
  },
  "art-deco": {
    colors: ["#0b1d2a", "#c9a227", "#d6c4a8", "#7a1f2b"],
  },
  "international-typographic-style": {
    colors: ["#111111", "#e10600", "#f4f4f0"],
  },
  "new-york-school": {
    colors: ["#1c1c1c", "#e8e2d6", "#3d5a80", "#c45c26"],
  },
  psychedelia: {
    colors: ["#ff2bd6", "#7cff3e", "#2b1bff", "#ffea00"],
    ground: "#140018",
  },
  "punk-diy": {
    colors: ["#111111", "#f4f0e6", "#c8102e"],
  },
  "new-wave-swiss-punk": {
    colors: ["#ff3b00", "#00c2ff", "#111111", "#f4f4f0"],
  },
  memphis: {
    colors: ["#f4a5c0", "#2ec4b6", "#ffe14a", "#111111"],
  },
  grunge: {
    colors: ["#3b2f2a", "#8a7a4b", "#6e3b2a", "#d8c9a3"],
  },
  y2k: {
    colors: ["#5ce1ff", "#c5c8d4", "#ff2d95"],
    ground: "#12082a",
  },
  minimalism: {
    colors: ["#fafafa", "#111111", "#a1a1aa"],
  },
  skeuomorphism: {
    colors: ["#c4a574", "#6b4f2a", "#e8e0d4", "#3d2a14"],
  },
  "flat-design": {
    colors: ["#1a73e8", "#34a853", "#fbbc04", "#ea4335"],
  },
  vaporwave: {
    colors: ["#ff71ce", "#01cdfe", "#b967ff", "#05ffa1"],
    ground: "#1a0a2e",
  },
  "web-brutalism": {
    colors: ["#0000ee", "#551a8b", "#ffffff", "#000000"],
  },
  neubrutalism: {
    colors: ["#fff36a", "#ff4d8d", "#111111"],
  },
  glassmorphism: {
    colors: ["#ffffff", "#a8c0ff", "#c0c8d8"],
    ground: "#1b2744",
  },
  "corporate-memphis": {
    colors: ["#ffb3c7", "#8ecae6", "#ffd166", "#bdb2ff"],
  },
};
