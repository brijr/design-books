import { getPayload } from "payload";

import config from "../src/payload.config";

process.env.PAYLOAD_MIGRATING = "true";

type BookMetadata = {
  publisher: string;
  year: string;
  pages: string;
  isbn: string;
};

const apply =
  process.env.CONTENT_METADATA_APPLY === "true" ||
  process.argv.includes("--apply") ||
  process.argv.includes("apply");

const BOOK_METADATA: Record<string, BookMetadata> = {
  "a-new-program-for-graphic-design": {
    publisher: "Inventory Press",
    year: "2019",
    pages: "256",
    isbn: "9781941753216",
  },
  "a-pattern-language": {
    publisher: "Oxford University Press",
    year: "1977",
    pages: "1171",
    isbn: "9780195019193",
  },
  "a-primer-of-visual-literacy": {
    publisher: "MIT Press",
    year: "1973",
    pages: "194",
    isbn: "9780262540292",
  },
  "about-face": {
    publisher: "Wiley",
    year: "2014",
    pages: "720",
    isbn: "9781118766576",
  },
  "art-and-visual-perception": {
    publisher: "University of California Press",
    year: "1974",
    pages: "508",
    isbn: "9780520243835",
  },
  "atomic-design": {
    publisher: "Brad Frost",
    year: "2016",
    pages: "154",
    isbn: "9780998296609",
  },
  "beautiful-evidences": {
    publisher: "Graphics Press",
    year: "2006",
    pages: "214",
    isbn: "9780961392178",
  },
  "creative-confidence": {
    publisher: "Crown Business",
    year: "2013",
    pages: "304",
    isbn: "9780385349369",
  },
  "design-as-art": {
    publisher: "Penguin",
    year: "2008",
    pages: "224",
    isbn: "9780141035819",
  },
  "design-book": {
    publisher: "Phaidon",
    year: "2013",
    pages: "544",
    isbn: "9780714865799",
  },
  "design-for-communication": {
    publisher: "Wiley",
    year: "2003",
    pages: "264",
    isbn: "9780471418290",
  },
  "design-for-the-real-world": {
    publisher: "Thames & Hudson",
    year: "2019",
    pages: "416",
    isbn: "9780500295335",
  },
  "design-is-a-job": {
    publisher: "A Book Apart",
    year: "2012",
    pages: "135",
    isbn: "9781937557041",
  },
  "design-justice": {
    publisher: "MIT Press",
    year: "2020",
    pages: "360",
    isbn: "9780262043458",
  },
  "design-of-everyday-things": {
    publisher: "Basic Books",
    year: "2013",
    pages: "368",
    isbn: "9780465050659",
  },
  "design-systems": {
    publisher: "Smashing Media",
    year: "2017",
    pages: "288",
    isbn: "9783945749586",
  },
  "designers-dictionary-of-color": {
    publisher: "Abrams",
    year: "2017",
    pages: "256",
    isbn: "9781419723919",
  },
  "designing-design": {
    publisher: "Lars Muller Publishers",
    year: "2007",
    pages: "472",
    isbn: "9783037781050",
  },
  "designing-interfaces": {
    publisher: "O'Reilly Media",
    year: "2020",
    pages: "602",
    isbn: "9781492051961",
  },
  "designing-programmes": {
    publisher: "Lars Muller Publishers",
    year: "2007",
    pages: "120",
    isbn: "9783037780930",
  },
  "dieter-rams-complete-works": {
    publisher: "Phaidon",
    year: "2020",
    pages: "344",
    isbn: "9781838661533",
  },
  "dont-make-me-think": {
    publisher: "New Riders",
    year: "2014",
    pages: "216",
    isbn: "9780321965516",
  },
  "elements-of-typographic-style": {
    publisher: "Hartley & Marks",
    year: "2012",
    pages: "398",
    isbn: "9780881792126",
  },
  "emotional-design": {
    publisher: "Basic Books",
    year: "2004",
    pages: "272",
    isbn: "9780465051366",
  },
  "envisioning-information": {
    publisher: "Graphics Press",
    year: "1990",
    pages: "126",
    isbn: "9780961392116",
  },
  "graphic-design-manual": {
    publisher: "Niggli",
    year: "1965",
    pages: "180",
    isbn: "9783721200064",
  },
  "grid-system-in-graphic-design": {
    publisher: "Niggli",
    year: "1981",
    pages: "176",
    isbn: "9783721201451",
  },
  "how-to-make-sense-of-any-mess": {
    publisher: "CreateSpace",
    year: "2014",
    pages: "176",
    isbn: "9781500615994",
  },
  icons: {
    publisher: "Taschen",
    year: "2021",
    pages: "352",
    isbn: "9783836585095",
  },
  "interaction-of-color": {
    publisher: "Yale University Press",
    year: "2013",
    pages: "208",
    isbn: "9780300179354",
  },
  "interviewing-users": {
    publisher: "Rosenfeld Media",
    year: "2023",
    pages: "176",
    isbn: "9781959029822",
  },
  "its-not-how-good-you-are-its-how-good-you-want-to-be": {
    publisher: "Phaidon",
    year: "2003",
    pages: "128",
    isbn: "9780714843377",
  },
  "just-enough-research": {
    publisher: "A Book Apart",
    year: "2013",
    pages: "154",
    isbn: "9781937557102",
  },
  "know-your-onions": {
    publisher: "BIS Publishers",
    year: "2013",
    pages: "192",
    isbn: "9789063692582",
  },
  "laws-of-simplicity": {
    publisher: "MIT Press",
    year: "2006",
    pages: "128",
    isbn: "9780262134729",
  },
  "laws-of-ux": {
    publisher: "O'Reilly Media",
    year: "2020",
    pages: "152",
    isbn: "9781492055310",
  },
  "less-and-more": {
    publisher: "Gestalten",
    year: "2015",
    pages: "808",
    isbn: "9783899555844",
  },
  "living-with-complexity": {
    publisher: "MIT Press",
    year: "2010",
    pages: "312",
    isbn: "9780262014861",
  },
  "logo-beginnings": {
    publisher: "Taschen",
    year: "2022",
    pages: "432",
    isbn: "9783836582285",
  },
  "logo-design-love": {
    publisher: "New Riders",
    year: "2014",
    pages: "240",
    isbn: "9780321985200",
  },
  "logo-modernism": {
    publisher: "Taschen",
    year: "2015",
    pages: "432",
    isbn: "9783836545303",
  },
  "massive-change": {
    publisher: "Phaidon",
    year: "2004",
    pages: "240",
    isbn: "9780714844015",
  },
  mismatch: {
    publisher: "MIT Press",
    year: "2018",
    pages: "176",
    isbn: "9780262539487",
  },
  "notes-on-the-synthesis-of-form": {
    publisher: "Harvard University Press",
    year: "1964",
    pages: "216",
    isbn: "9780674627512",
  },
  "orchestrating-experiences": {
    publisher: "Rosenfeld Media",
    year: "2018",
    pages: "336",
    isbn: "9781933820736",
  },
  "principles-of-form-and-design": {
    publisher: "Wiley",
    year: "1993",
    pages: "352",
    isbn: "9780471285526",
  },
  shikake: {
    publisher: "Rosenfeld Media",
    year: "2020",
    pages: "168",
    isbn: "9781933820958",
  },
  "the-art-of-looking-sideways": {
    publisher: "Phaidon",
    year: "2001",
    pages: "1064",
    isbn: "9780714834498",
  },
  "the-creative-act": {
    publisher: "Penguin Press",
    year: "2023",
    pages: "432",
    isbn: "9780593652886",
  },
  "the-language-of-graphic-design": {
    publisher: "Rockport Publishers",
    year: "2011",
    pages: "288",
    isbn: "9781592536764",
  },
  "the-process": {
    publisher: "Rockport Publishers",
    year: "2024",
    pages: "240",
    isbn: "9780760385913",
  },
  "the-shape-of-design": {
    publisher: "Frank Chimero",
    year: "2012",
    pages: "131",
    isbn: "9780985472207",
  },
  "the-user-experience-team-of-one": {
    publisher: "Rosenfeld Media",
    year: "2013",
    pages: "246",
    isbn: "9781933820187",
  },
  "the-visual-display-of-quantitative-information": {
    publisher: "Graphics Press",
    year: "2001",
    pages: "197",
    isbn: "9780961392147",
  },
  "thinking-in-systems": {
    publisher: "Chelsea Green Publishing",
    year: "2008",
    pages: "240",
    isbn: "9781603580557",
  },
  "thinking-with-type": {
    publisher: "Princeton Architectural Press",
    year: "2010",
    pages: "224",
    isbn: "9781568989693",
  },
  "this-is-service-design-doing": {
    publisher: "O'Reilly Media",
    year: "2018",
    pages: "568",
    isbn: "9781491927182",
  },
  "thoughts-on-design": {
    publisher: "Chronicle Books",
    year: "2014",
    pages: "96",
    isbn: "9781452130651",
  },
  "universal-principles-of-ux": {
    publisher: "Rockport Publishers",
    year: "2022",
    pages: "224",
    isbn: "9780760378045",
  },
  "user-friendly": {
    publisher: "MCD",
    year: "2019",
    pages: "416",
    isbn: "9780374279752",
  },
  "virgil-abloh-figures-of-speech": {
    publisher: "DelMonico Books",
    year: "2022",
    pages: "496",
    isbn: "9781636810744",
  },
  "visual-grammar": {
    publisher: "Princeton Architectural Press",
    year: "2006",
    pages: "96",
    isbn: "9781568985817",
  },
  "visual-thinking": {
    publisher: "University of California Press",
    year: "1969",
    pages: "352",
    isbn: "9780520242265",
  },
  "war-of-art": {
    publisher: "Black Irish Entertainment",
    year: "2012",
    pages: "190",
    isbn: "9781936891023",
  },
  "work-for-money-design-for-love": {
    publisher: "New Riders",
    year: "2012",
    pages: "288",
    isbn: "9780321844279",
  },
  "writing-is-designing": {
    publisher: "Rosenfeld Media",
    year: "2020",
    pages: "200",
    isbn: "9781933820668",
  },
};

function hasMetadata(book: {
  publisher?: string | null;
  year?: string | null;
  pages?: string | null;
  isbn?: string | null;
}) {
  return Boolean(book.publisher && book.year && book.pages && book.isbn);
}

async function main() {
  const payload = await getPayload({ config });
  const result = await payload.find({
    collection: "books",
    depth: 0,
    pagination: false,
    overrideAccess: true,
  });
  const booksBySlug = new Map(
    result.docs.map((book) => [book.slug.trim(), book]),
  );
  const errors: string[] = [];

  for (const book of result.docs) {
    if (!BOOK_METADATA[book.slug]) {
      errors.push(`Missing metadata seed for ${book.slug}`);
    }
  }

  for (const slug of Object.keys(BOOK_METADATA)) {
    if (!booksBySlug.has(slug)) {
      errors.push(`Metadata seed does not match a book: ${slug}`);
    }
  }

  if (errors.length > 0) {
    throw new Error(errors.join("\n"));
  }

  for (const [slug, metadata] of Object.entries(BOOK_METADATA)) {
    const book = booksBySlug.get(slug);

    if (!book) {
      continue;
    }

    const unchanged =
      book.publisher === metadata.publisher &&
      book.year === metadata.year &&
      book.pages === metadata.pages &&
      book.isbn === metadata.isbn;

    if (unchanged) {
      console.log(`[skip] ${slug} metadata already set`);
      continue;
    }

    if (!apply) {
      console.log(`[dry-run] set metadata for ${slug}`);
      continue;
    }

    await payload.update({
      collection: "books",
      id: book.id,
      data: metadata,
      overrideAccess: true,
    });
    console.log(`metadata updated ${slug}`);
  }

  if (apply) {
    const updatedResult = await payload.find({
      collection: "books",
      depth: 0,
      pagination: false,
      overrideAccess: true,
    });
    const missingMetadata = updatedResult.docs.filter(
      (book) => !hasMetadata(book),
    );

    if (missingMetadata.length > 0) {
      throw new Error(
        `Books still missing metadata: ${missingMetadata
          .map((book) => book.slug)
          .join(", ")}`,
      );
    }
  }

  console.log(
    apply
      ? `Book metadata update applied. ${result.docs.length} books have metadata.`
      : "Dry run complete. Re-run with apply to write changes.",
  );
}

await main();
