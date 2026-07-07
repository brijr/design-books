import { getPayload } from "payload";
import sharp from "sharp";

import config from "../src/payload.config";

process.env.PAYLOAD_MIGRATING = "true";

type CoverSeed = {
  slug: string;
  title: string;
  coverId?: number;
  imageUrl?: string;
  filename?: string;
};

const apply =
  process.env.CONTENT_COVERS_APPLY === "true" ||
  process.argv.includes("--apply") ||
  process.argv.includes("apply");

const COVERS: CoverSeed[] = [
  {
    slug: "the-visual-display-of-quantitative-information",
    title: "The Visual Display of Quantitative Information",
    coverId: 725045,
  },
  {
    slug: "envisioning-information",
    title: "Envisioning Information",
    coverId: 7026308,
  },
  {
    slug: "design-for-the-real-world",
    title: "Design for the Real World",
    imageUrl:
      "https://static.fnac-static.com/multimedia/PE/Images/FR/NR/06/0e/0e/921094/1540-1/tsp20240730081025/Victor-Papanek-Design-For-the-Real-World-anglais.jpg",
  },
  {
    slug: "the-art-of-looking-sideways",
    title: "The Art of Looking Sideways",
    imageUrl: "https://nostos.jp/wp-content/uploads/2025/09/nsts-01138.jpg",
  },
  {
    slug: "the-shape-of-design",
    title: "The Shape of Design",
    filename: "the-shape-of-design-book-cover.png",
    imageUrl: "https://shapeofdesignbook.com/img/cover.svg",
  },
  {
    slug: "a-pattern-language",
    title: "A Pattern Language",
    coverId: 120825,
  },
  {
    slug: "notes-on-the-synthesis-of-form",
    title: "Notes on the Synthesis of Form",
    coverId: 6256928,
  },
  {
    slug: "about-face",
    title: "About Face",
    coverId: 812295,
  },
  {
    slug: "designing-interfaces",
    title: "Designing Interfaces",
    coverId: 389022,
  },
  {
    slug: "the-user-experience-team-of-one",
    title: "The User Experience Team of One",
    coverId: 13221920,
  },
  {
    slug: "just-enough-research",
    title: "Just Enough Research",
    coverId: 7387007,
  },
  {
    slug: "interviewing-users",
    title: "Interviewing Users",
    coverId: 8778372,
  },
  {
    slug: "how-to-make-sense-of-any-mess",
    title: "How to Make Sense of Any Mess",
    coverId: 7352417,
  },
  {
    slug: "writing-is-designing",
    title: "Writing Is Designing",
    coverId: 11757386,
  },
  {
    slug: "mismatch",
    title: "Mismatch",
    coverId: 8835420,
  },
  {
    slug: "design-justice",
    title: "Design Justice",
    coverId: 12856718,
  },
  {
    slug: "design-systems",
    title: "Design Systems",
    coverId: 14619754,
  },
  {
    slug: "orchestrating-experiences",
    title: "Orchestrating Experiences",
    coverId: 12569248,
  },
  {
    slug: "this-is-service-design-doing",
    title: "This Is Service Design Doing",
    coverId: 12860075,
  },
  {
    slug: "design-is-a-job",
    title: "Design Is a Job",
    coverId: 7246307,
  },
  {
    slug: "thinking-in-systems",
    title: "Thinking in Systems",
    filename: "thinking-in-systems-open-library-cover-1603580557.jpg",
    imageUrl:
      "https://covers.openlibrary.org/b/isbn/1603580557-L.jpg?default=false",
  },
];

function coverUrl(coverId: number) {
  return `https://covers.openlibrary.org/b/id/${coverId}-L.jpg?default=false`;
}

function imageUrlFor(seed: CoverSeed) {
  if (seed.imageUrl) {
    return seed.imageUrl;
  }

  if (!seed.coverId) {
    throw new Error(`Missing cover source for ${seed.slug}`);
  }

  return coverUrl(seed.coverId);
}

function filenameFor(seed: CoverSeed) {
  if (seed.filename) {
    return seed.filename;
  }

  if (!seed.coverId) {
    return `${seed.slug}-book-cover.jpg`;
  }

  return `${seed.slug}-open-library-cover-${seed.coverId}.jpg`;
}

async function downloadCover(seed: CoverSeed) {
  const response = await fetch(imageUrlFor(seed));

  if (!response.ok) {
    throw new Error(
      `Failed to download ${seed.slug} cover: ${response.status}`,
    );
  }

  const contentType = response.headers.get("content-type") || "image/jpeg";

  if (!contentType.startsWith("image/")) {
    throw new Error(`Cover for ${seed.slug} is not an image: ${contentType}`);
  }

  const rawData = Buffer.from(await response.arrayBuffer());
  const sourceIsSvg =
    contentType.includes("svg") ||
    imageUrlFor(seed).toLowerCase().endsWith(".svg");
  const data = sourceIsSvg ? await sharp(rawData).png().toBuffer() : rawData;

  if (data.length < 1024) {
    throw new Error(`Cover for ${seed.slug} is unexpectedly small`);
  }

  return {
    data,
    mimetype: sourceIsSvg
      ? "image/png"
      : contentType.split(";")[0] || "image/jpeg",
    name: filenameFor(seed),
    size: data.length,
  };
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

  for (const seed of COVERS) {
    const book = booksBySlug.get(seed.slug);

    if (!book) {
      throw new Error(`Book not found for cover seed: ${seed.slug}`);
    }

    if (book.image) {
      console.log(`[skip] ${seed.slug} already has an image`);
      continue;
    }

    const filename = filenameFor(seed);
    const existingMedia = await payload.find({
      collection: "media",
      limit: 1,
      pagination: false,
      overrideAccess: true,
      where: {
        filename: {
          equals: filename,
        },
      },
    });

    if (!apply) {
      console.log(`[dry-run] set ${seed.slug} cover from ${imageUrlFor(seed)}`);
      continue;
    }

    const media =
      existingMedia.docs[0] ||
      (await payload.create({
        collection: "media",
        data: {
          alt: `${seed.title} book cover`,
        },
        file: await downloadCover(seed),
        overrideAccess: true,
      }));

    await payload.update({
      collection: "books",
      id: book.id,
      data: {
        image: media.id,
      },
      overrideAccess: true,
    });
    console.log(`cover updated ${seed.slug}`);
  }

  console.log(
    apply
      ? "Book cover update applied."
      : "Dry run complete. Re-run with apply to write changes.",
  );
}

await main();
