import type { CollectionEntry } from "astro:content";
import { getImage } from "astro:assets";
import { splitAuthors } from "./taxonomy";

type BookEntry = CollectionEntry<"books">;
type TopicEntry = CollectionEntry<"topics">;

export const SITE_URL = "https://design-books.com";
export const SITE_NAME = "Design Books";
export const HOME_TITLE = "Design Books | Essential Reading for Designers";
export const SITE_DESCRIPTION =
  "A curated reading list for product, interaction, and visual designers studying usability, systems, typography, research, and the craft of making useful things.";

export const SITE_KEYWORDS = [
  "design books",
  "UX books",
  "product design books",
  "interaction design",
  "usability",
  "visual design",
  "design reading list",
];

export function absoluteUrl(path = "/") {
  return new URL(path, SITE_URL).toString();
}

export function bookUrl(book: Pick<BookEntry, "id">) {
  return absoluteUrl(`/${book.id.trim()}`);
}

export function topicAbsoluteUrl(topic: Pick<TopicEntry, "id">) {
  return absoluteUrl(`/topics/${topic.id}`);
}

export function authorAbsoluteUrl(slug: string) {
  return absoluteUrl(`/authors/${slug}`);
}

export type BookImageMetadata = {
  url: string;
  width?: number;
  height?: number;
  alt: string;
};

export async function getBookImageMetadata(
  book: BookEntry,
): Promise<BookImageMetadata | null> {
  const cover = book.data.cover;

  if (!cover) {
    return null;
  }

  // ImageMetadata.src names the source module, but Astro does not guarantee
  // that source URL is emitted. getImage() creates the actual static asset
  // used by crawlers and returns its deployable hashed URL.
  const optimized = await getImage({ src: cover, format: "jpg" });

  return {
    url: absoluteUrl(optimized.src),
    width: Number(optimized.attributes.width ?? cover.width),
    height: Number(optimized.attributes.height ?? cover.height),
    alt: `${book.data.title} book cover`,
  };
}

export function bookMetadataTitle(book: Pick<BookEntry, "data">) {
  return `${book.data.title} by ${book.data.author}`;
}

export function serializeJsonLd(value: unknown) {
  return JSON.stringify(value)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026");
}

export async function collectionJsonLd(books: BookEntry[]) {
  const itemListElement = await Promise.all(
    books.map(async (book, index) => {
      const image = await getBookImageMetadata(book);

      return {
        "@type": "ListItem",
        position: index + 1,
        url: bookUrl(book),
        name: bookMetadataTitle(book),
        item: {
          "@type": "Book",
          "@id": `${bookUrl(book)}#book`,
          name: book.data.title,
          author: {
            "@type": "Person",
            name: book.data.author,
          },
          url: bookUrl(book),
          image: image?.url,
        },
      };
    }),
  );

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": absoluteUrl("/#organization"),
        name: "WIP",
        url: "https://wipdes.com",
        founder: {
          "@type": "Person",
          name: "Bridger Tower",
          url: "https://bridger.to",
        },
      },
      {
        "@type": "WebSite",
        "@id": absoluteUrl("/#website"),
        name: SITE_NAME,
        url: absoluteUrl("/"),
        description: SITE_DESCRIPTION,
        publisher: {
          "@id": absoluteUrl("/#organization"),
        },
        potentialAction: {
          "@type": "SearchAction",
          target: `${absoluteUrl("/")}?search={search_term_string}`,
          "query-input": "required name=search_term_string",
        },
      },
      {
        "@type": "CollectionPage",
        "@id": absoluteUrl("/#collection"),
        name: HOME_TITLE,
        url: absoluteUrl("/"),
        description: SITE_DESCRIPTION,
        isPartOf: {
          "@id": absoluteUrl("/#website"),
        },
        mainEntity: {
          "@id": absoluteUrl("/#item-list"),
        },
      },
      {
        "@type": "ItemList",
        "@id": absoluteUrl("/#item-list"),
        numberOfItems: books.length,
        itemListElement,
      },
    ],
  };
}

export function collectionPageJsonLd({
  id,
  name,
  url,
  description,
  books,
}: {
  id: string;
  name: string;
  url: string;
  description: string;
  books: BookEntry[];
}) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": `${url}#collection`,
        name,
        url,
        description,
        isPartOf: {
          "@id": absoluteUrl("/#website"),
        },
        mainEntity: {
          "@id": `${url}#item-list`,
        },
      },
      {
        "@type": "ItemList",
        "@id": `${url}#item-list`,
        name: id,
        numberOfItems: books.length,
        itemListElement: books.map((book, index) => ({
          "@type": "ListItem",
          position: index + 1,
          url: bookUrl(book),
          name: bookMetadataTitle(book),
        })),
      },
    ],
  };
}

export function collectionIndexJsonLd({
  id,
  name,
  url,
  description,
  items,
}: {
  id: string;
  name: string;
  url: string;
  description: string;
  items: { name: string; url: string }[];
}) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": `${url}#collection`,
        name,
        url,
        description,
        isPartOf: {
          "@id": absoluteUrl("/#website"),
        },
        mainEntity: {
          "@id": `${url}#item-list`,
        },
      },
      {
        "@type": "ItemList",
        "@id": `${url}#item-list`,
        name: id,
        numberOfItems: items.length,
        itemListElement: items.map((item, index) => ({
          "@type": "ListItem",
          position: index + 1,
          url: item.url,
          name: item.name,
        })),
      },
    ],
  };
}

export function bookJsonLd(
  book: BookEntry,
  topics: TopicEntry[],
  image: BookImageMetadata | null,
) {
  const url = bookUrl(book);
  const numberOfPages = book.data.pages
    ? Number.parseInt(book.data.pages, 10)
    : null;

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Book",
        "@id": `${url}#book`,
        name: book.data.title,
        author: splitAuthors(book.data.author).map((author) => ({
          "@type": "Person",
          name: author,
        })),
        description: book.data.description,
        image: image?.url,
        isbn: book.data.isbn || undefined,
        publisher: book.data.publisher
          ? {
              "@type": "Organization",
              name: book.data.publisher,
            }
          : undefined,
        datePublished: book.data.year || undefined,
        numberOfPages: numberOfPages || undefined,
        url,
        mainEntityOfPage: url,
        about: topics.map((topic) => topic.data.title),
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${url}#breadcrumbs`,
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: SITE_NAME,
            item: absoluteUrl("/"),
          },
          {
            "@type": "ListItem",
            position: 2,
            name: book.data.title,
            item: url,
          },
        ],
      },
    ],
  };
}
