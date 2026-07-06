import type { MetadataRoute } from "next";
import { queryAllAuthors, queryAllBooks, queryAllTopics } from "@/lib/data";
import { absoluteUrl, topicAbsoluteUrl } from "@/lib/seo";
import { authorAbsoluteUrl } from "@/lib/seo";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [books, topics, authors] = await Promise.all([
    queryAllBooks(),
    queryAllTopics(),
    queryAllAuthors(),
  ]);
  const latestBookUpdate = books.reduce((latest, book) => {
    const updatedAt = new Date(book.updatedAt || book.createdAt).getTime();
    return Number.isFinite(updatedAt) && updatedAt > latest
      ? updatedAt
      : latest;
  }, 0);

  const bookUrls = books.map((book) => ({
    url: absoluteUrl(`/${book.slug}`),
    lastModified: new Date(book.updatedAt || book.createdAt),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  const topicUrls = topics.map((topic) => ({
    url: topicAbsoluteUrl(topic),
    lastModified: new Date(topic.updatedAt || topic.createdAt),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const authorUrls = authors.map((author) => ({
    url: authorAbsoluteUrl(author.slug),
    lastModified: latestBookUpdate ? new Date(latestBookUpdate) : new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [
    {
      url: absoluteUrl("/"),
      lastModified: latestBookUpdate ? new Date(latestBookUpdate) : new Date(),
      changeFrequency: "weekly" as const,
      priority: 1,
    },
    {
      url: absoluteUrl("/topics"),
      lastModified: latestBookUpdate ? new Date(latestBookUpdate) : new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    },
    {
      url: absoluteUrl("/authors"),
      lastModified: latestBookUpdate ? new Date(latestBookUpdate) : new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    },
    ...bookUrls,
    ...topicUrls,
    ...authorUrls,
  ];
}
