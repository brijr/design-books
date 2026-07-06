import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { BookCard } from "@/components/book-card";
import {
  queryAllAuthors,
  queryAuthorBySlug,
  queryBooksByAuthorSlug,
} from "@/lib/data";
import {
  authorAbsoluteUrl,
  collectionPageJsonLd,
  serializeJsonLd,
  SITE_NAME,
  SITE_URL,
} from "@/lib/seo";
import { getBookCountLabel } from "@/lib/taxonomy";

export const revalidate = 1800;

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const authors = await queryAllAuthors();

  return authors.map((author) => ({
    slug: author.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const author = await queryAuthorBySlug({ slug });

  if (!author) {
    return {
      title: "Author Not Found",
      description: "The requested design book author could not be found.",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const description = `Books by ${author.name} in the Design Books reading list.`;

  return {
    metadataBase: new URL(SITE_URL),
    title: `${author.name} Books`,
    description,
    alternates: {
      canonical: `/authors/${author.slug}`,
    },
    openGraph: {
      type: "website",
      siteName: SITE_NAME,
      title: `${author.name} Books | ${SITE_NAME}`,
      description,
      url: authorAbsoluteUrl(author.slug),
    },
    twitter: {
      card: "summary",
      title: `${author.name} Books | ${SITE_NAME}`,
      description,
    },
  };
}

export default async function AuthorPage({ params }: Props) {
  const { slug } = await params;
  const [author, books] = await Promise.all([
    queryAuthorBySlug({ slug }),
    queryBooksByAuthorSlug({ slug }),
  ]);

  if (!author) {
    return notFound();
  }

  const description = `Books by ${author.name} in the Design Books reading list.`;
  const url = authorAbsoluteUrl(author.slug);
  const jsonLd = collectionPageJsonLd({
    id: author.slug,
    name: `${author.name} Books`,
    url,
    description,
    books,
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }}
      />

      <section className="grid gap-12">
        <div>
          <h1 className="font-medium">{author.name}</h1>
          <p className="text-zinc-400">
            {description} {getBookCountLabel(books.length)}.
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
