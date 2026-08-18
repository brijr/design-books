import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const medium = z.enum(["graphic", "editorial", "identity", "interface", "product"]);
const era = z.enum(["foundations", "modernism", "postmodernism", "digital"]);

const styles = defineCollection({
  loader: glob({ pattern: "**/*.mdx", base: "./src/content/styles" }),
  schema: ({ image }) =>
    z
      .object({
        title: z.string().min(1, "title is required"),
        definition: z.string().min(1, "definition is required"),
        marks: z.array(z.string().min(1)).min(2).max(3),
        type: z.enum(["movement", "style"]),
        status: z.enum(["historical", "revived", "current", "emerging"]),
        era,
        period: z.string().min(1, "period is required"),
        yearStart: z.number().int(),
        yearEnd: z.number().int().optional(),
        place: z.string().min(1, "place is required"),
        medium: z.array(medium).min(1),
        influences: z.array(z.string()).default([]),
        descendants: z.array(z.string()).default([]),
        grammar: z
          .object({
            type: z.string(),
            color: z.string(),
            form: z.string(),
            grid: z.string(),
            imagery: z.string(),
            material: z.string(),
            motion: z.string(),
          })
          .strict(),
        figures: z
          .array(
            z
              .object({
                name: z.string(),
                note: z.string(),
              })
              .strict(),
          )
          .default([]),
        works: z
          .array(
            z
              .object({
                title: z.string(),
                year: z.string().optional(),
                note: z.string().optional(),
              })
              .strict(),
          )
          .default([]),
        confusedWith: z
          .array(
            z
              .object({
                name: z.string(),
                slug: z.string().optional(),
                why: z.string(),
              })
              .strict(),
          )
          .default([]),
        books: z
          .array(
            z
              .object({
                title: z.string(),
                href: z.string().url(),
              })
              .strict(),
          )
          .default([]),
        philosophies: z
          .array(
            z
              .object({
                title: z.string(),
                note: z.string().optional(),
              })
              .strict(),
          )
          .default([]),
        specimen: z.enum(["live", "diagram"]),
        images: z
          .array(
            z
              .object({
                src: image(),
                alt: z.string().min(1),
                source: z.string().min(1),
                license: z.string().min(1),
              })
              .strict(),
          )
          .default([]),
      })
      .strict(),
});

export const collections = { styles };
