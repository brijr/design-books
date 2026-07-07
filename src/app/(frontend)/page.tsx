import { queryAllBooks } from "@/lib/data";
import { SearchInput } from "@/components/search-input";
import { BookCard } from "@/components/book-card";
import Link from "next/link";
import { getBookTopics } from "@/lib/taxonomy";
import {
  collectionJsonLd,
  HOME_TITLE,
  serializeJsonLd,
  SITE_DESCRIPTION,
  SITE_URL,
} from "@/lib/seo";

import type { Metadata } from "next";
import type { Book, Topic } from "@/payload-types";

export const revalidate = 600;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    absolute: HOME_TITLE,
  },
  description: SITE_DESCRIPTION,
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    type: "website",
    title: HOME_TITLE,
    description: SITE_DESCRIPTION,
    url: "/",
  },
  twitter: {
    card: "summary",
    title: HOME_TITLE,
    description: SITE_DESCRIPTION,
  },
};

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; sort?: string; topic?: string }>;
}) {
  const { search, sort, topic } = await searchParams;
  const allBooks = await queryAllBooks();
  const topics = getHomepageTopics(allBooks);
  const books = sortBooks(filterBooks(allBooks, { search, topic }), sort);
  const jsonLd = collectionJsonLd(books);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }}
      />

      <section className="grid gap-12">
        <div>
          <h1 className="font-medium">
            A curated collection of essential books on design.
          </h1>
          <p className="text-zinc-400">
            Product, interaction, visual design, usability, systems, and craft.
          </p>
        </div>

        <div className="grid grid-cols-[1fr_auto] items-center gap-4">
          <SearchInput defaultValue={search} />
          <p className="text-zinc-400">
            {books.length} {books.length === 1 ? "book" : "books"}
          </p>
        </div>

        <div className="grid gap-4">
          <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm">
            <Link
              href={homeHref({ search, sort })}
              className={!topic ? "link" : "text-zinc-400 hover:text-current"}
            >
              All
            </Link>
            {topics.map((bookTopic) => (
              <Link
                key={bookTopic.slug}
                href={homeHref({ search, sort, topic: bookTopic.slug })}
                className={
                  topic === bookTopic.slug
                    ? "link"
                    : "text-zinc-400 hover:text-current"
                }
              >
                {bookTopic.title}
              </Link>
            ))}
          </div>

          <div className="flex gap-4 text-sm">
            <Link
              href={homeHref({ search, topic })}
              className={
                sort !== "recent" ? "link" : "text-zinc-400 hover:text-current"
              }
            >
              A-Z
            </Link>
            <Link
              href={homeHref({ search, topic, sort: "recent" })}
              className={
                sort === "recent" ? "link" : "text-zinc-400 hover:text-current"
              }
            >
              Recently added
            </Link>
          </div>
        </div>

        {books.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {books.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        ) : (
          <p className="text-zinc-400">No books found</p>
        )}
      </section>
    </>
  );
}

function filterBooks(
  books: Book[],
  {
    search,
    topic,
  }: {
    search?: string;
    topic?: string;
  },
) {
  const normalizedSearch = search?.trim().toLowerCase();

  return books.filter((book) => {
    const topics = getBookTopics(book);
    const matchesTopic =
      !topic || topics.some((bookTopic) => bookTopic.slug === topic);
    const matchesSearch =
      !normalizedSearch ||
      [
        book.title,
        book.author,
        book.description,
        ...topics.map((bookTopic) => bookTopic.title),
      ]
        .join(" ")
        .toLowerCase()
        .includes(normalizedSearch);

    return matchesTopic && matchesSearch;
  });
}

function sortBooks(books: Book[], sort?: string) {
  return [...books].sort((a, b) => {
    if (sort === "recent") {
      return Date.parse(b.createdAt) - Date.parse(a.createdAt);
    }

    return a.title.localeCompare(b.title);
  });
}

function getHomepageTopics(books: Book[]) {
  const topics = new Map<string, Topic>();

  for (const book of books) {
    for (const topic of getBookTopics(book)) {
      topics.set(topic.slug, topic);
    }
  }

  return [...topics.values()].sort((a, b) => a.title.localeCompare(b.title));
}

function homeHref({
  search,
  sort,
  topic,
}: {
  search?: string;
  sort?: string;
  topic?: string;
}) {
  const params = new URLSearchParams();

  if (search) {
    params.set("search", search);
  }

  if (topic) {
    params.set("topic", topic);
  }

  if (sort === "recent") {
    params.set("sort", sort);
  }

  const query = params.toString();
  return query ? `/?${query}` : "/";
}
