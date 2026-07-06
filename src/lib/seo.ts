import type { Book, Media, Topic } from "@/payload-types";
import { getBookTopics, splitAuthors } from "@/lib/taxonomy";

export const SITE_URL = "https://designbooks.org";
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

export function bookUrl(book: Pick<Book, "slug">) {
  return absoluteUrl(`/${book.slug.trim()}`);
}

export function topicAbsoluteUrl(topic: Pick<Topic, "slug">) {
  return absoluteUrl(`/topics/${topic.slug}`);
}

export function authorAbsoluteUrl(slug: string) {
  return absoluteUrl(`/authors/${slug}`);
}

export function getBookImage(book: Book): Media | null {
  return typeof book.image === "object" ? book.image : null;
}

export type BookImageMetadata = {
  url: string;
  width?: number;
  height?: number;
  alt: string;
};

export function getBookImageMetadata(book: Book): BookImageMetadata | null {
  const image = getBookImage(book);

  if (!image?.url) {
    return null;
  }

  return {
    url: absoluteUrl(image.url),
    width: image.width || undefined,
    height: image.height || undefined,
    alt: image.alt || `${book.title} book cover`,
  };
}

export function bookMetadataTitle(book: Pick<Book, "title" | "author">) {
  return `${book.title} by ${book.author}`;
}

export function serializeJsonLd(value: unknown) {
  return JSON.stringify(value)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026");
}

export function collectionJsonLd(books: Book[]) {
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
        itemListElement: books.map((book, index) => {
          const image = getBookImageMetadata(book);

          return {
            "@type": "ListItem",
            position: index + 1,
            url: bookUrl(book),
            name: bookMetadataTitle(book),
            item: {
              "@type": "Book",
              "@id": `${bookUrl(book)}#book`,
              name: book.title,
              author: {
                "@type": "Person",
                name: book.author,
              },
              url: bookUrl(book),
              image: image?.url,
            },
          };
        }),
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
  books: Book[];
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

export function bookJsonLd(book: Book) {
  const image = getBookImageMetadata(book);
  const url = bookUrl(book);
  const topics = getBookTopics(book);

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Book",
        "@id": `${url}#book`,
        name: book.title,
        author: splitAuthors(book.author).map((author) => ({
          "@type": "Person",
          name: author,
        })),
        description: book.description,
        image: image?.url,
        url,
        mainEntityOfPage: url,
        about: topics.map((topic) => topic.title),
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
            name: book.title,
            item: url,
          },
        ],
      },
    ],
  };
}
