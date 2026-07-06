import type { Book, Topic } from "@/payload-types";

export type AuthorSummary = {
  name: string;
  slug: string;
  count: number;
};

export function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export function splitAuthors(author: string) {
  return author
    .split(",")
    .map((name) => name.trim())
    .filter(Boolean);
}

export function authorSlug(author: string) {
  return slugify(author);
}

export function authorUrl(author: string) {
  return `/authors/${authorSlug(author)}`;
}

export function topicUrl(topic: Pick<Topic, "slug">) {
  return `/topics/${topic.slug}`;
}

export function getBookTopics(book: Pick<Book, "topics">): Topic[] {
  return (book.topics || []).filter(
    (topic): topic is Topic => typeof topic === "object" && topic !== null,
  );
}

export function getAuthorSummaries(books: Book[]): AuthorSummary[] {
  const authors = new Map<string, AuthorSummary>();

  for (const book of books) {
    for (const name of splitAuthors(book.author)) {
      const slug = authorSlug(name);
      const existing = authors.get(slug);

      authors.set(slug, {
        name,
        slug,
        count: existing ? existing.count + 1 : 1,
      });
    }
  }

  return [...authors.values()].sort((a, b) => a.name.localeCompare(b.name));
}

export function getBookCountLabel(count: number) {
  return `${count} ${count === 1 ? "book" : "books"}`;
}
