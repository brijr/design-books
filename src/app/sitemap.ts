import type { MetadataRoute } from "next";
import { queryAllBooks } from "@/lib/data";
import { absoluteUrl } from "@/lib/seo";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const books = await queryAllBooks();
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

  return [
    {
      url: absoluteUrl("/"),
      lastModified: latestBookUpdate ? new Date(latestBookUpdate) : new Date(),
      changeFrequency: "weekly" as const,
      priority: 1,
    },
    ...bookUrls,
  ];
}
