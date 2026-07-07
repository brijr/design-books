import { getPayload } from "payload";
import { cache } from "react";
import { authorSlug, getAuthorSummaries, getBookTopics } from "@/lib/taxonomy";

import configPromise from "@payload-config";

export const queryBookBySlug = cache(async ({ slug }: { slug: string }) => {
  const payload = await getPayload({ config: configPromise });

  const result = await payload.find({
    collection: "books",
    depth: 2,
    limit: 1,
    pagination: false,
    where: {
      slug: {
        equals: slug,
      },
    },
  });

  return result.docs?.[0] || null;
});

export const queryAllBooks = cache(async () => {
  const payload = await getPayload({ config: configPromise });

  const result = await payload.find({
    collection: "books",
    depth: 2,
    sort: ["title"],
    pagination: false,
  });

  return result.docs || [];
});

export const queryAllTopics = cache(async () => {
  const payload = await getPayload({ config: configPromise });

  const result = await payload.find({
    collection: "topics",
    sort: ["title"],
    pagination: false,
  });

  return result.docs || [];
});

export const queryTopicBySlug = cache(async ({ slug }: { slug: string }) => {
  const payload = await getPayload({ config: configPromise });

  const result = await payload.find({
    collection: "topics",
    limit: 1,
    pagination: false,
    where: {
      slug: {
        equals: slug,
      },
    },
  });

  return result.docs?.[0] || null;
});

export const queryBooksByTopicSlug = cache(
  async ({ slug }: { slug: string }) => {
    const books = await queryAllBooks();

    return books.filter((book) =>
      getBookTopics(book).some((topic) => topic.slug === slug),
    );
  },
);

export const queryAllAuthors = cache(async () => {
  const books = await queryAllBooks();

  return getAuthorSummaries(books);
});

export const queryAuthorBySlug = cache(async ({ slug }: { slug: string }) => {
  const authors = await queryAllAuthors();

  return authors.find((author) => author.slug === slug) || null;
});

export const queryBooksByAuthorSlug = cache(
  async ({ slug }: { slug: string }) => {
    const books = await queryAllBooks();

    return books.filter((book) =>
      book.author
        .split(",")
        .some((author) => authorSlug(author.trim()) === slug),
    );
  },
);
