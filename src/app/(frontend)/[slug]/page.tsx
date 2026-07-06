import { queryAllBooks, queryBookBySlug } from "@/lib/data";
import { notFound } from "next/navigation";
import { RichText } from "@payloadcms/richtext-lexical/react";
import { cn } from "@/lib/cn";
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
import type { Metadata } from "next";
import Image from "next/image";

export const revalidate = 1800;

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
  const book = await queryBookBySlug({ slug });

  if (!book) {
    return notFound();
  }

  const cover = getBookImage(book);
  const jsonLd = bookJsonLd(book);

  return (
    <article className="grid gap-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }}
      />

      <div>
        <h1 className="font-medium">{book.title}</h1>
        <p className="text-zinc-400">by {book.author}</p>
      </div>

      <div className="grid gap-4 max-w-prose">
        <p>{book.description}</p>
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
    </article>
  );
}
