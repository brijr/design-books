import { defineCollection, reference, z } from "astro:content";
import { glob } from "astro/loaders";

// Topics live at src/content/topics/<slug>.json and are owned by the content
// pipeline. Slug comes from the filename.
const topics = defineCollection({
  loader: glob({ pattern: "**/*.json", base: "./src/content/topics" }),
  schema: z
    .object({
      title: z.string().min(1, "title is required"),
      slug: z.string().min(1, "slug is required"),
      description: z.string().min(1, "description is required"),
    })
    .strict(),
});

// Books live at src/content/books/<slug>.mdx and are owned by the content
// pipeline. Slug comes from the filename. The MDX body is long-form summary
// prose and is often empty.
//
// `topics` uses Astro's `reference()` helper, which validates every entry
// against the *actual* topics collection at build time. A typo'd topic slug
// fails the build with a clear "does not exist" error instead of silently
// rendering an empty topics list.
//
// `cover` uses the `image()` helper so covers are typed `ImageMetadata`
// (intrinsic width/height included) rather than a bare string, which is what
// lets Astro optimize them and emit explicit dimensions to prevent layout shift.
//
// `.strict()` on both schemas means an unrecognized frontmatter key is a build
// error too -- a typo'd field name can't silently do nothing.
const books = defineCollection({
  loader: glob({ pattern: "**/*.mdx", base: "./src/content/books" }),
  schema: ({ image }) =>
    z
      .object({
        title: z.string().min(1, "title is required"),
        author: z.string().min(1, "author is required"),
        description: z.string().min(1, "description is required"),
        // Drives the "Recently added" sort. Required on purpose: a missing
        // date fails the build loudly rather than silently sorting the book
        // to the bottom. `pnpm add-book` fills in today's date for you.
        addedAt: z.coerce.date({
          message: 'addedAt is required, as YYYY-MM-DD (e.g. "2026-08-12")',
        }),
        link: z.string().url("link must be a valid URL").optional(),
        topics: z.array(reference("topics")).default([]),
        // Path is relative to this MDX file, which is what Astro's image()
        // resolver expects. `pnpm add-book` writes it for you.
        cover: image().optional(),
        publisher: z.string().optional(),
        year: z.string().optional(),
        pages: z.string().optional(),
        isbn: z.string().optional(),
      })
      .strict(),
});

export const collections = { books, topics };
