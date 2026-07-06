import { queryAllBooks, searchBooks } from "@/lib/data";
import { SearchInput } from "@/components/search-input";
import { BookCard } from "@/components/book-card";
import {
  collectionJsonLd,
  HOME_TITLE,
  serializeJsonLd,
  SITE_DESCRIPTION,
  SITE_URL,
} from "@/lib/seo";

import type { Metadata } from "next";

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
  searchParams: Promise<{ search?: string }>;
}) {
  const { search } = await searchParams;
  const books = search
    ? await searchBooks({ query: search })
    : await queryAllBooks();
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
