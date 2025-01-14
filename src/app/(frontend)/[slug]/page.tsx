import { queryBookBySlug } from "@/lib/data";
import { notFound } from "next/navigation";
import { RichText } from "@payloadcms/richtext-lexical/react";
import { cn } from "@/lib/cn";
import { Metadata } from "next";
import Image from "next/image";

export const revalidate = 1800;

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const book = await queryBookBySlug({ slug });

  if (!book) {
    return {
      title: "Book Not Found",
      description: "The requested book could not be found",
    };
  }

  return {
    title: `${book.title} | designbooks.org`,
    description: book.description,
    openGraph: {
      title: `${book.title} | designbooks.org`,
      description: book.description,
      // @ts-ignore
      images: book.image?.url ? [book.image.url] : [],
    },
  };
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const book = await queryBookBySlug({ slug });
  const cover: any = book?.image;

  if (!book) {
    return notFound();
  }

  return (
    <article className="grid gap-12">
      <div>
        <h2 className="font-medium">{book.title}</h2>
        <p className="text-zinc-400">by {book.author}</p>
      </div>

      <div className="grid gap-4 max-w-prose">
        <p>{book.description}</p>
        {book.link && (
          <a target="_blank" href={book.link}>
            [ <span className="link">Purchase this book</span> ]
          </a>
        )}
      </div>
      <a
        className={cn(
          "p-8 relative flex flex-col items-center justify-center",
          "aspect-video bg-zinc-100 border border-zinc-200 rounded-xl",
          "hover:bg-zinc-200 transition-colors duration-300",
          "relative group"
        )}
        href={book.link || "#"}
        target="_blank"
      >
        <Image
          className="max-h-36 max-w-36 w-auto h-auto sm:max-w-64 sm:max-h-64 lg:max-w-96 lg:max-h-96"
          src={cover.url}
          alt={cover.alt}
          width={cover.width}
          height={cover.height}
        />
        <p className="hidden group-hover:inline-block absolute bottom-4 right-4 text-sm left-4 w-3/4">
          Purchase this Book
        </p>
      </a>

      {book.summary && (
        <div className="prose">
          <RichText data={book.summary} />
        </div>
      )}
    </article>
  );
}
