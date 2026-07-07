import type { Metadata } from "next";
import Link from "next/link";

import { queryAllAuthors } from "@/lib/data";
import { authorUrl, getBookCountLabel } from "@/lib/taxonomy";
import {
  absoluteUrl,
  authorAbsoluteUrl,
  collectionIndexJsonLd,
  serializeJsonLd,
  SITE_URL,
} from "@/lib/seo";

export const revalidate = 1800;
export const dynamic = "force-static";

const description =
  "Browse the authors represented in the Design Books reading list, from usability and interaction design to typography and brand identity.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Authors",
  description,
  alternates: {
    canonical: "/authors",
  },
};

export default async function AuthorsPage() {
  const authors = await queryAllAuthors();
  const jsonLd = collectionIndexJsonLd({
    id: "authors",
    name: "Design Book Authors",
    url: absoluteUrl("/authors"),
    description,
    items: authors.map((author) => ({
      name: author.name,
      url: authorAbsoluteUrl(author.slug),
    })),
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }}
      />

      <section className="grid gap-12">
        <div>
          <h1 className="font-medium">Authors</h1>
          <p className="text-zinc-400">{description}</p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {authors.map((author) => (
            <Link
              key={author.slug}
              href={authorUrl(author.name)}
              className="p-8 relative flex aspect-square flex-col justify-end rounded-xl border border-zinc-200 bg-zinc-100 transition-colors duration-300 hover:bg-zinc-200"
            >
              <h2 className="font-medium">{author.name}</h2>
              <p className="text-sm text-zinc-400">
                {getBookCountLabel(author.count)}
              </p>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
