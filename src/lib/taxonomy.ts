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

  const entries = await getEntries(book.data.topics);

  // getEntries() yields undefined for a reference it cannot resolve. Astro logs
  // its own "does not exist" message but does not halt, so without this guard
  // the run dies later with an opaque "Cannot read properties of undefined".
  // Fail here instead, naming the file and the offending slug.
  const unresolved = book.data.topics
    .map((ref, index) => (entries[index] ? null : ref.id))
    .filter((id): id is string => id !== null);

  if (unresolved.length > 0) {
    throw new Error(
      `Book "${book.id}" references unknown topic(s): ${unresolved.join(", ")}.\n` +
        `Fix the topics list in src/content/books/${book.id}.mdx, or add the ` +
        `missing topic at src/content/topics/<slug>.json.`,
    );
  }

  return entries;
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
