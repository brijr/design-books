import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { BookCard } from "@/components/book-card";
import {
  queryAllTopics,
  queryBooksByTopicSlug,
  queryTopicBySlug,
} from "@/lib/data";
import {
  collectionPageJsonLd,
  serializeJsonLd,
  SITE_NAME,
  SITE_URL,
  topicAbsoluteUrl,
} from "@/lib/seo";
import { getBookCountLabel } from "@/lib/taxonomy";

export const revalidate = 1800;

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const topics = await queryAllTopics();

  return topics.map((topic) => ({
    slug: topic.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const topic = await queryTopicBySlug({ slug });

  if (!topic) {
    return {
      title: "Topic Not Found",
      description: "The requested design book topic could not be found.",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  return {
    metadataBase: new URL(SITE_URL),
    title: `${topic.title} Books`,
    description: topic.description,
    alternates: {
      canonical: `/topics/${topic.slug}`,
    },
    openGraph: {
      type: "website",
      siteName: SITE_NAME,
      title: `${topic.title} Books | ${SITE_NAME}`,
      description: topic.description,
      url: topicAbsoluteUrl(topic),
    },
    twitter: {
      card: "summary",
      title: `${topic.title} Books | ${SITE_NAME}`,
      description: topic.description,
    },
  };
}

export default async function TopicPage({ params }: Props) {
  const { slug } = await params;
  const [topic, books] = await Promise.all([
    queryTopicBySlug({ slug }),
    queryBooksByTopicSlug({ slug }),
  ]);

  if (!topic) {
    return notFound();
  }

  const url = topicAbsoluteUrl(topic);
  const jsonLd = collectionPageJsonLd({
    id: topic.slug,
    name: `${topic.title} Books`,
    url,
    description: topic.description,
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
          <h1 className="font-medium">{topic.title} Books</h1>
          <p className="text-zinc-400">
            {topic.description} {getBookCountLabel(books.length)}.
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
