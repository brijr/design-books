import type { Metadata } from "next";
import Link from "next/link";

import { queryAllBooks, queryAllTopics } from "@/lib/data";
import { getBookCountLabel, getBookTopics, topicUrl } from "@/lib/taxonomy";
import {
  absoluteUrl,
  collectionIndexJsonLd,
  serializeJsonLd,
  SITE_URL,
  topicAbsoluteUrl,
} from "@/lib/seo";

export const revalidate = 1800;
export const dynamic = "force-static";

const description =
  "Browse design books by topic, including typography, usability, graphic design, brand identity, design systems, and creative practice.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Topics",
  description,
  alternates: {
    canonical: "/topics",
  },
};

export default async function TopicsPage() {
  const [topics, books] = await Promise.all([
    queryAllTopics(),
    queryAllBooks(),
  ]);
  const jsonLd = collectionIndexJsonLd({
    id: "topics",
    name: "Design Book Topics",
    url: absoluteUrl("/topics"),
    description,
    items: topics.map((topic) => ({
      name: topic.title,
      url: topicAbsoluteUrl(topic),
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
          <h1 className="font-medium">Topics</h1>
          <p className="text-zinc-400">{description}</p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {topics.map((topic) => {
            const count = books.filter((book) =>
              getBookTopics(book).some(
                (bookTopic) => bookTopic.id === topic.id,
              ),
            ).length;

            return (
              <Link
                key={topic.id}
                href={topicUrl(topic)}
                className="p-8 relative flex aspect-square flex-col justify-end rounded-xl border border-zinc-200 bg-zinc-100 transition-colors duration-300 hover:bg-zinc-200"
              >
                <h2 className="font-medium">{topic.title}</h2>
                <p className="text-sm text-zinc-400">
                  {getBookCountLabel(count)}
                </p>
              </Link>
            );
          })}
        </div>
      </section>
    </>
  );
}
