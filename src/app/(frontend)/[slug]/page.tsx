import { queryAllBooks, queryBookBySlug } from "@/lib/data";
import { notFound } from "next/navigation";
import { RichText } from "@payloadcms/richtext-lexical/react";
import { cn } from "@/lib/cn";
import { BookCard } from "@/components/book-card";
import Link from "next/link";
import {
  bookJsonLd,
  bookMetadataTitle,
  bookUrl,
  getBookImage,
  getBookImageMetadata,
  serializeJsonLd,
  SITE_NAME,
  SITE_URL,
} from "@/lib/seo";
import {
  authorUrl,
  getBookTopics,
  splitAuthors,
  topicUrl,
} from "@/lib/taxonomy";
import type { Book } from "@/payload-types";
import type { Metadata } from "next";
import Image from "next/image";

export const revalidate = 1800;
export const dynamicParams = false;

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const books = await queryAllBooks();

  return books.map((book) => ({
    slug: book.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const book = await queryBookBySlug({ slug });

  if (!book) {
    return {
      title: "Book Not Found",
      description: "The requested book could not be found",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const title = bookMetadataTitle(book);
  const image = getBookImageMetadata(book);
  const url = bookUrl(book);

  return {
    metadataBase: new URL(SITE_URL),
    title,
    description: book.description,
    alternates: {
      canonical: `/${book.slug}`,
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
      siteName: SITE_NAME,
      title,
      description: book.description,
      url,
      images: image ? [image] : undefined,
    },
    twitter: {
      card: image ? "summary_large_image" : "summary",
      title,
      description: book.description,
      images: image ? [image.url] : undefined,
    },
  };
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const [book, allBooks] = await Promise.all([
    queryBookBySlug({ slug }),
    queryAllBooks(),
  ]);

  if (!book) {
    return notFound();
  }

  const cover = getBookImage(book);
  const authors = splitAuthors(book.author);
  const topics = getBookTopics(book);
  const metadata = getBookMetadata(book);
  const relatedBooks = getRelatedBooks(book, allBooks);
  const jsonLd = bookJsonLd(book);

  return (
    <article className="grid gap-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }}
      />

      <div>
        <h1 className="font-medium">{book.title}</h1>
        <p className="text-zinc-400">
          by{" "}
          {authors.map((author, index) => (
            <span key={author}>
              <Link className="link" href={authorUrl(author)}>
                {author}
              </Link>
              {index < authors.length - 1 ? ", " : ""}
            </span>
          ))}
        </p>
      </div>

      <div className="grid gap-4 max-w-prose">
        <p>{book.description}</p>
        {metadata.length > 0 && (
          <p className="text-sm text-zinc-400">{metadata.join(" · ")}</p>
        )}
        {topics.length > 0 && (
          <p className="text-sm text-zinc-400">
            Topics:{" "}
            {topics.map((topic, index) => (
              <span key={topic.id}>
                <Link className="link" href={topicUrl(topic)}>
                  {topic.title}
                </Link>
                {index < topics.length - 1 ? ", " : ""}
              </span>
            ))}
          </p>
        )}
        {book.link && (
          <a target="_blank" rel="noopener noreferrer" href={book.link}>
            [ <span className="link">Purchase this book</span> ]
          </a>
        )}
      </div>
      {cover?.url && (
        <a
          className={cn(
            "p-8 relative flex flex-col items-center justify-center",
            "aspect-video bg-zinc-100 border border-zinc-200 rounded-xl",
            "hover:bg-zinc-200 transition-colors duration-300",
            "relative group",
          )}
          href={book.link || bookUrl(book)}
          target={book.link ? "_blank" : undefined}
          rel={book.link ? "noopener noreferrer" : undefined}
          aria-label={
            book.link
              ? `Purchase ${book.title}`
              : `${book.title} by ${book.author}`
          }
        >
          <Image
            className="max-h-36 max-w-36 w-auto h-auto sm:max-w-64 sm:max-h-64 lg:max-w-96 lg:max-h-96"
            src={cover.url}
            alt={cover.alt || `${book.title} book cover`}
            width={cover.width || 667}
            height={cover.height || 1000}
          />
          {book.link && (
            <p className="hidden group-hover:inline-block absolute bottom-4 right-4 text-sm left-4 w-3/4">
              Purchase this book
            </p>
          )}
        </a>
      )}

      {book.summary && (
        <div className="prose">
          <RichText data={book.summary} />
        </div>
      )}

      {relatedBooks.length > 0 && (
        <section className="grid gap-6">
          <h2 className="font-medium">Related books</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {relatedBooks.map((relatedBook) => (
              <BookCard key={relatedBook.id} book={relatedBook} />
            ))}
          </div>
        </section>
      )}
    </article>
  );
}

function getBookMetadata(book: Book) {
  return [
    book.publisher,
    book.year,
    book.pages ? `${book.pages} pages` : null,
    book.isbn ? `ISBN ${book.isbn}` : null,
  ].filter(Boolean);
}

function getRelatedBooks(book: Book, books: Book[]) {
  const topicIds = new Set(getBookTopics(book).map((topic) => topic.id));

  return books
    .filter((candidate) => candidate.id !== book.id)
    .map((candidate) => {
      const score = getBookTopics(candidate).filter((topic) =>
        topicIds.has(topic.id),
      ).length;

      return { book: candidate, score };
    })
    .filter(({ score }) => score > 0)
    .sort(
      (a, b) => b.score - a.score || a.book.title.localeCompare(b.book.title),
    )
    .slice(0, 3)
    .map(({ book }) => book);
}
