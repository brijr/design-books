import { getEntries, type CollectionEntry } from "astro:content";

export type BookEntry = CollectionEntry<"books">;
export type TopicEntry = CollectionEntry<"topics">;

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

export function topicUrl(topic: Pick<TopicEntry, "id">) {
  return `/topics/${topic.id}`;
}

export async function getBookTopics(book: BookEntry): Promise<TopicEntry[]> {
  if (!book.data.topics || book.data.topics.length === 0) {
    return [];
  }

  return getEntries(book.data.topics);
}

export function getAuthorSummaries(books: BookEntry[]): AuthorSummary[] {
  const authors = new Map<string, AuthorSummary>();

  for (const book of books) {
    for (const name of splitAuthors(book.data.author)) {
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

/**
 * Related books: score every other book by how many topics it shares with
 * `book`, keep the top 3 (score > 0), tie-broken alphabetically by title.
 * Mirrors the original Next.js implementation's algorithm exactly.
 */
export async function getRelatedBooks(
  book: BookEntry,
  allBooks: BookEntry[],
): Promise<BookEntry[]> {
  const topics = await getBookTopics(book);
  const topicIds = new Set(topics.map((topic) => topic.id));

  const scored = await Promise.all(
    allBooks
      .filter((candidate) => candidate.id !== book.id)
      .map(async (candidate) => {
        const candidateTopics = await getBookTopics(candidate);
        const score = candidateTopics.filter((topic) =>
          topicIds.has(topic.id),
        ).length;

        return { book: candidate, score };
      }),
  );

  return scored
    .filter(({ score }) => score > 0)
    .sort(
      (a, b) =>
        b.score - a.score || a.book.data.title.localeCompare(b.book.data.title),
    )
    .slice(0, 3)
    .map(({ book }) => book);
}
