import { queryAllBooks } from "@/lib/data";
import {
  HomeBookBrowser,
  type HomeBook,
  type HomeTopic,
} from "@/components/home-book-browser";
import { getBookTopics } from "@/lib/taxonomy";
import {
  collectionJsonLd,
  HOME_TITLE,
  serializeJsonLd,
  SITE_DESCRIPTION,
  SITE_URL,
} from "@/lib/seo";

import type { Metadata } from "next";
import type { Book, Media, Topic } from "@/payload-types";

export const dynamic = "force-static";
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

export default async function Home() {
  const allBooks = await queryAllBooks();
  const topics = getHomepageTopics(allBooks);
  const books = getHomeBooks(allBooks);
  const jsonLd = collectionJsonLd(allBooks);

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

        <HomeBookBrowser books={books} topics={topics} />
      </section>
    </>
  );
}

function getHomepageTopics(books: Book[]): HomeTopic[] {
  const topics = new Map<string, Topic>();

  for (const book of books) {
    for (const topic of getBookTopics(book)) {
      topics.set(topic.slug, topic);
    }
  }

  return [...topics.values()]
    .map(toHomeTopic)
    .sort((a, b) => a.title.localeCompare(b.title));
}

function getHomeBooks(books: Book[]): HomeBook[] {
  return books.map(
    ({
      id,
      title,
      author,
      slug,
      description,
      link,
      createdAt,
      image,
      topics,
    }) => ({
      id,
      title,
      author,
      slug,
      description,
      link,
      createdAt,
      image: getHomeBookImage(image),
      topics: getBookTopics({ topics }).map(toHomeTopic),
    }),
  );
}

function toHomeTopic(topic: Topic): HomeTopic {
  return {
    id: topic.id,
    slug: topic.slug,
    title: topic.title,
  };
}

function getHomeBookImage(image: Book["image"]) {
  if (!image || typeof image !== "object") {
    return image || null;
  }

  return {
    url: image.url,
    width: image.width,
    height: image.height,
    alt: image.alt,
  } satisfies Pick<Media, "url" | "width" | "height" | "alt">;
}
