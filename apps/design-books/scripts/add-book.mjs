#!/usr/bin/env node
// Interactive scaffold for a new book entry. Writes a correctly-shaped MDX
// file to src/content/books/<slug>.mdx matching the schema in
// src/content.config.ts. Does not touch any other file in scripts/.

import { createInterface } from "node:readline/promises";
import { stdin, stdout } from "node:process";
import { access, readdir, readFile, writeFile } from "node:fs/promises";
import { constants } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");
const booksDir = path.join(rootDir, "src/content/books");
const topicsDir = path.join(rootDir, "src/content/topics");
const coversDir = path.join(rootDir, "src/assets/covers");

function slugify(value) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

async function pathExists(target) {
  try {
    await access(target, constants.F_OK);
    return true;
  } catch {
    return false;
  }
}

async function loadTopics() {
  if (!(await pathExists(topicsDir))) {
    return [];
  }

  const files = (await readdir(topicsDir)).filter((file) => file.endsWith(".json"));
  const topics = [];

  for (const file of files) {
    const raw = await readFile(path.join(topicsDir, file), "utf8");
    try {
      const data = JSON.parse(raw);
      topics.push({
        slug: data.slug || file.replace(/\.json$/, ""),
        title: data.title || file,
      });
    } catch {
      // Skip malformed topic files -- not this script's job to fix them.
    }
  }

  return topics.sort((a, b) => a.title.localeCompare(b.title));
}

function isHttpUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

function yamlString(value) {
  return JSON.stringify(value);
}

async function main() {
  console.log("Add a book to the Design Books reading list\n");

  // Load topics BEFORE opening any input stream: an async gap after opening
  // readline lets piped stdin reach EOF and close it mid-prompt.
  const topics = await loadTopics();

  // Two input modes. On a TTY we prompt interactively. When stdin is piped we
  // drain it up front and answer from a queue -- readline emits every buffered
  // line at once for a pipe, so sequential question() calls would silently drop
  // all but the first. The piped mode is what makes this scriptable and
  // testable (`pnpm add-book < answers.txt`).
  const interactive = stdin.isTTY;
  const rl = interactive ? createInterface({ input: stdin, output: stdout }) : null;

  let queued = [];
  if (!interactive) {
    let raw = "";
    for await (const chunk of stdin) raw += chunk;
    queued = raw.split("\n");
  }

  const ask = async (question, { required = false, validate } = {}) => {
    for (;;) {
      let answer;

      if (interactive) {
        answer = (await rl.question(question)).trim();
      } else {
        answer = (queued.shift() ?? "").trim();
        stdout.write(`${question}${answer}\n`);
      }

      if (!answer && required) {
        const message = "  This field is required.";
        if (interactive) {
          console.log(message);
          continue;
        }
        throw new Error(`${message.trim()} (no value supplied for "${question.trim()}")`);
      }

      if (answer && validate && !validate(answer)) {
        if (interactive) continue;
        throw new Error(`Invalid value for "${question.trim()}": ${answer}`);
      }

      return answer;
    }
  };

  const title = await ask("Title: ", { required: true });
  const author = await ask("Author(s), comma-separated: ", { required: true });
  const description = await ask("Description: ", { required: true });
  const link = await ask("Purchase link (optional): ", {
    validate: (value) => {
      if (!isHttpUrl(value)) {
        console.log("  Please enter a valid http(s) URL, or leave this blank.");
        return false;
      }
      return true;
    },
  });

  if (topics.length > 0) {
    console.log("\nAvailable topics:");
    for (const topic of topics) {
      console.log(`  - ${topic.slug}  (${topic.title})`);
    }
  } else {
    console.log(
      "\nNo topics found yet in src/content/topics/ -- you can leave this blank.",
    );
  }

  const validTopicSlugs = new Set(topics.map((topic) => topic.slug));
  const topicsInput = await ask(
    "Topics, comma-separated slugs from the list above (optional): ",
    {
      validate: (value) => {
        const slugs = value
          .split(",")
          .map((slug) => slug.trim())
          .filter(Boolean);
        const unknown = slugs.filter((slug) => !validTopicSlugs.has(slug));

        if (unknown.length > 0) {
          console.log(`  Unknown topic slug(s): ${unknown.join(", ")}`);
          return false;
        }

        return true;
      },
    },
  );

  const publisher = await ask("Publisher (optional): ");
  const year = await ask("Year (optional): ");
  const pages = await ask("Pages (optional): ");
  const isbn = await ask("ISBN (optional): ");
  const cover = await ask(
    "Cover filename in src/assets/covers/, e.g. my-book.jpg (optional): ",
  );

  const today = new Date().toISOString().slice(0, 10);
  const addedAt =
    (await ask(`Date added [${today}]: `, {
      validate: (value) => {
        if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
          console.log("  Please use YYYY-MM-DD, or leave blank for today.");
          return false;
        }
        return true;
      },
    })) || today;

  rl?.close();

  const slug = slugify(title);

  if (!slug) {
    console.error("Could not derive a slug from the title. Aborting.");
    process.exitCode = 1;
    return;
  }

  if (!(await pathExists(booksDir))) {
    console.error(
      "src/content/books/ does not exist yet. Create the directory before running this script.",
    );
    process.exitCode = 1;
    return;
  }

  const filePath = path.join(booksDir, `${slug}.mdx`);

  if (await pathExists(filePath)) {
    console.error(
      `A book already exists at src/content/books/${slug}.mdx. Aborting.`,
    );
    process.exitCode = 1;
    return;
  }

  if (cover && (await pathExists(coversDir))) {
    const coverExists = await pathExists(path.join(coversDir, cover));
    if (!coverExists) {
      console.warn(
        `  Warning: src/assets/covers/${cover} was not found. Add the image file there before building, or the build will fail.`,
      );
    }
  }

  const topicSlugs = topicsInput
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);

  const frontmatterLines = [
    "---",
    `title: ${yamlString(title)}`,
    `author: ${yamlString(author)}`,
    `description: ${yamlString(description)}`,
    `addedAt: ${yamlString(addedAt)}`,
  ];

  if (link) {
    frontmatterLines.push(`link: ${yamlString(link)}`);
  }

  frontmatterLines.push(
    topicSlugs.length > 0
      ? `topics:\n${topicSlugs.map((topicSlug) => `  - ${yamlString(topicSlug)}`).join("\n")}`
      : "topics: []",
  );

  // Astro's image() resolver wants a path relative to this MDX file, but asking
  // an author to type "../../assets/covers/x.jpg" is a papercut -- they give us
  // the bare filename and we expand it here.
  if (cover) {
    frontmatterLines.push(`cover: ${yamlString(`../../assets/covers/${cover}`)}`);
  }
  if (publisher) frontmatterLines.push(`publisher: ${yamlString(publisher)}`);
  if (year) frontmatterLines.push(`year: ${yamlString(year)}`);
  if (pages) frontmatterLines.push(`pages: ${yamlString(pages)}`);
  if (isbn) frontmatterLines.push(`isbn: ${yamlString(isbn)}`);

  frontmatterLines.push("---", "");

  await writeFile(filePath, frontmatterLines.join("\n"), "utf8");

  console.log(`\nCreated src/content/books/${slug}.mdx`);

  if (cover) {
    console.log(
      `Remember to add the cover image to src/assets/covers/${cover} if you haven't already.`,
    );
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
