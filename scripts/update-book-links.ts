import { getPayload } from "payload";

import config from "../src/payload.config";

process.env.PAYLOAD_MIGRATING = "true";

type BookLinkSeed = {
  slug: string;
  link: string;
};

const apply =
  process.env.CONTENT_LINKS_APPLY === "true" ||
  process.argv.includes("--apply") ||
  process.argv.includes("apply");

const BOOK_LINKS: BookLinkSeed[] = [
  {
    slug: "a-pattern-language",
    link: "https://www.patternlanguage.com/bookstore/pattern-language.html",
  },
  {
    slug: "about-face",
    link: "https://www.amazon.com/About-Face-Essentials-Interaction-Design/dp/1118766571",
  },
  {
    slug: "design-for-the-real-world",
    link: "https://www.thamesandhudson.com/products/design-for-the-real-world",
  },
  {
    slug: "designing-interfaces",
    link: "https://www.amazon.com/Designing-Interfaces-Patterns-Effective-Interaction/dp/1492051969",
  },
  {
    slug: "design-justice",
    link: "https://mitpress.mit.edu/9780262043458/design-justice/",
  },
  {
    slug: "massive-change",
    link: "https://www.massivechangenetwork.com/massive-change",
  },
  {
    slug: "mismatch",
    link: "https://mitpress.mit.edu/9780262539487/mismatch/",
  },
  {
    slug: "notes-on-the-synthesis-of-form",
    link: "https://www.patternlanguage.com/bookstore/synthesis-of-form.html",
  },
  {
    slug: "thinking-in-systems",
    link: "https://www.amazon.com/Thinking-Systems-Donella-H-Meadows/dp/1603580557",
  },
  {
    slug: "virgil-abloh-figures-of-speech",
    link: "https://www.amazon.com/Virgil-Abloh-Figures-Michael-Darling/dp/1636810748",
  },
];

function isHttpUrl(value: string | null | undefined) {
  if (!value) {
    return false;
  }

  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

async function main() {
  const payload = await getPayload({ config });
  const booksResult = await payload.find({
    collection: "books",
    depth: 0,
    pagination: false,
    overrideAccess: true,
  });
  const booksBySlug = new Map(
    booksResult.docs.map((book) => [book.slug.trim(), book]),
  );

  for (const seed of BOOK_LINKS) {
    const book = booksBySlug.get(seed.slug);

    if (!book) {
      throw new Error(`Book not found for link seed: ${seed.slug}`);
    }

    if (book.link === seed.link) {
      console.log(`[skip] ${seed.slug} already has a link`);
      continue;
    }

    if (!apply) {
      console.log(
        `[dry-run] set ${seed.slug} link from ${book.link || "empty"} to ${
          seed.link
        }`,
      );
      continue;
    }

    await payload.update({
      collection: "books",
      id: book.id,
      data: {
        link: seed.link,
      },
      overrideAccess: true,
    });
    console.log(`link updated ${seed.slug}`);
  }

  const updatedBooksResult = await payload.find({
    collection: "books",
    depth: 0,
    pagination: false,
    overrideAccess: true,
  });
  const missingLinks = updatedBooksResult.docs.filter(
    (book) => !isHttpUrl(book.link),
  );

  if (apply && missingLinks.length > 0) {
    throw new Error(
      `Books still missing valid links: ${missingLinks
        .map((book) => book.slug)
        .join(", ")}`,
    );
  }

  console.log(
    apply
      ? `Book link update applied. ${updatedBooksResult.docs.length} books have valid links.`
      : "Dry run complete. Re-run with apply to write changes.",
  );
}

await main();
