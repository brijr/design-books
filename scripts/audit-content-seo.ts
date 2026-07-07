import { getPayload } from "payload";

import config from "../src/payload.config";
import { getAuthorSummaries, getBookTopics } from "../src/lib/taxonomy";

process.env.PAYLOAD_MIGRATING = "true";

function richTextLength(value: unknown): number {
  if (!value || typeof value !== "object") {
    return 0;
  }

  let length = 0;

  function visit(node: unknown) {
    if (!node || typeof node !== "object") {
      return;
    }

    if ("text" in node && typeof node.text === "string") {
      length += node.text.length;
    }

    if ("children" in node && Array.isArray(node.children)) {
      node.children.forEach(visit);
    }

    if ("root" in node) {
      visit(node.root);
    }
  }

  visit(value);

  return length;
}

function isHttpUrl(value: string | null | undefined) {
  if (!value) {
    return false;
  }

  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

async function main() {
  const payload = await getPayload({ config });
  const [bookResult, topicResult] = await Promise.all([
    payload.find({
      collection: "books",
      depth: 2,
      pagination: false,
      overrideAccess: true,
    }),
    payload.find({
      collection: "topics",
      pagination: false,
      overrideAccess: true,
    }),
  ]);
  const books = bookResult.docs;
  const topics = topicResult.docs;
  const errors: string[] = [];
  const descriptions = new Map<string, string>();

  if (books.length !== 65) {
    errors.push(`Expected 65 books, found ${books.length}`);
  }

  for (const book of books) {
    const slug = book.slug.trim();
    const description = book.description || "";

    if (description.length < 90 || description.length > 160) {
      errors.push(`${slug} description length is ${description.length}`);
    }

    const duplicate = descriptions.get(description);
    if (duplicate) {
      errors.push(`${slug} duplicates description from ${duplicate}`);
    }
    descriptions.set(description, slug);

    if (richTextLength(book.summary) < 200) {
      errors.push(`${slug} summary is under 200 chars`);
    }

    if (getBookTopics(book).length < 1) {
      errors.push(`${slug} has no topics`);
    }

    if (!isHttpUrl(book.link)) {
      errors.push(`${slug} has no valid purchase link`);
    }
  }

  for (const topic of topics) {
    const count = books.filter((book) =>
      getBookTopics(book).some((bookTopic) => bookTopic.id === topic.id),
    ).length;

    if (count < 1) {
      errors.push(`${topic.slug} has no books`);
    }
  }

  const authors = getAuthorSummaries(books);
  for (const author of authors) {
    if (author.count < 1) {
      errors.push(`${author.slug} has no books`);
    }
  }

  if (errors.length > 0) {
    throw new Error(errors.join("\n"));
  }

  console.log(
    `Content SEO audit passed: ${books.length} books, ${topics.length} topics, ${authors.length} authors.`,
  );
}

await main();
