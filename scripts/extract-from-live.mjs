/**
 * One-time migration: reconstruct the book catalog from the live site.
 *
 * designbooks.org emits complete schema.org JSON-LD on every book page, which
 * carries every scalar field the Payload `books` collection held. The only two
 * things it omits are the purchase link and the long-form summary, both of which
 * are recoverable from the rendered HTML.
 *
 * Output:
 *   src/content/books/<slug>.mdx     frontmatter + summary prose as markdown
 *   src/content/topics/<slug>.json   { title, slug, description }
 *   src/assets/covers/<slug>.<ext>   downloaded cover art
 *
 * Usage: node scripts/extract-from-live.mjs
 */

import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";

const SITE = "https://designbooks.org";
const ROOT = new URL("..", import.meta.url).pathname;
const BOOKS_DIR = join(ROOT, "src/content/books");
const TOPICS_DIR = join(ROOT, "src/content/topics");
const COVERS_DIR = join(ROOT, "src/assets/covers");

const DELAY_MS = 250;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/** Mirrors slugify() in src/lib/taxonomy.ts so slugs stay identical to production. */
function slugify(value) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

async function fetchText(url) {
  const res = await fetch(url, {
    headers: { "User-Agent": "designbooks-migration (one-time content export)" },
  });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText} for ${url}`);
  return res.text();
}

function decodeEntities(str) {
  const named = {
    amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " ",
    mdash: "—", ndash: "–", hellip: "…", rsquo: "’", lsquo: "‘",
    ldquo: "“", rdquo: "”",
  };
  return str
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(Number(d)))
    .replace(/&([a-z]+);/gi, (m, n) => named[n.toLowerCase()] ?? m);
}

/** Extracts every JSON-LD payload on the page. */
function parseJsonLd(html) {
  const blocks = [];
  const re = /<script type="application\/ld\+json">([\s\S]*?)<\/script>/g;
  let m;
  while ((m = re.exec(html))) {
    try {
      blocks.push(JSON.parse(decodeEntities(m[1])));
    } catch {
      /* a malformed block shouldn't sink the whole page */
    }
  }
  return blocks;
}

function findNode(jsonLdBlocks, type) {
  for (const block of jsonLdBlocks) {
    const graph = block["@graph"] ?? [block];
    const hit = graph.find((n) => n?.["@type"] === type);
    if (hit) return hit;
  }
  return null;
}

/**
 * Converts the Lexical-rendered richtext HTML into markdown. The rendered output
 * only ever uses a small, closed set of tags, so a full HTML parser is overkill.
 */
function htmlToMarkdown(html) {
  let md = html
    .replace(/<div class="payload-richtext">/g, "")
    .replace(/<\/div>/g, "")
    .replace(/<h1[^>]*>([\s\S]*?)<\/h1>/g, "\n# $1\n")
    .replace(/<h2[^>]*>([\s\S]*?)<\/h2>/g, "\n## $1\n")
    .replace(/<h3[^>]*>([\s\S]*?)<\/h3>/g, "\n### $1\n")
    .replace(/<h4[^>]*>([\s\S]*?)<\/h4>/g, "\n#### $1\n")
    .replace(/<(strong|b)[^>]*>([\s\S]*?)<\/\1>/g, "**$2**")
    .replace(/<(em|i)[^>]*>([\s\S]*?)<\/\1>/g, "_$2_")
    .replace(/<code[^>]*>([\s\S]*?)<\/code>/g, "`$1`")
    .replace(/<a[^>]*href="([^"]*)"[^>]*>([\s\S]*?)<\/a>/g, "[$2]($1)")
    .replace(/<li[^>]*>([\s\S]*?)<\/li>/g, "- $1\n")
    .replace(/<\/?(ul|ol)[^>]*>/g, "\n")
    .replace(/<p[^>]*>([\s\S]*?)<\/p>/g, "\n$1\n")
    .replace(/<br\s*\/?>/g, "\n")
    .replace(/<[^>]+>/g, "");

  return decodeEntities(md)
    .split("\n")
    .map((line) => line.trim())
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function extractSummary(html) {
  const m = html.match(/<div class="prose">([\s\S]*?)<\/div><\/div>/);
  if (!m) return "";
  return htmlToMarkdown(m[1]);
}

/**
 * The purchase link is the first external target="_blank" anchor in the article
 * body. Internal links and the footer's credit links are excluded.
 */
function extractPurchaseLink(html, jsonLdUrl) {
  const re = /href="(https?:\/\/[^"]+)"[^>]*target="_blank"/g;
  const skip = ["designbooks.org", "bridger.to", "wipdes.com"];
  let m;
  while ((m = re.exec(html))) {
    const href = m[1];
    if (href === jsonLdUrl) continue;
    if (skip.some((d) => href.includes(d))) continue;
    return href;
  }
  return "";
}

function yamlString(value) {
  // Quote and escape so titles containing colons, quotes, or hashes stay valid.
  return `"${String(value).replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"`;
}

function buildFrontmatter(fields) {
  const lines = [];
  for (const [key, value] of Object.entries(fields)) {
    if (value === undefined || value === null || value === "") continue;
    if (Array.isArray(value)) {
      if (value.length === 0) continue;
      lines.push(`${key}:`);
      for (const item of value) lines.push(`  - ${yamlString(item)}`);
    } else {
      lines.push(`${key}: ${yamlString(value)}`);
    }
  }
  return lines.join("\n");
}

async function downloadCover(url, slug) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`cover ${res.status} for ${url}`);

  const contentType = res.headers.get("content-type") ?? "";
  const extFromType = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp", "image/avif": "avif" }[contentType.split(";")[0]];
  const extFromUrl = url.split(".").pop()?.split("?")[0]?.toLowerCase();
  const ext = extFromType ?? (["jpg", "jpeg", "png", "webp", "avif"].includes(extFromUrl) ? extFromUrl : "jpg");

  const buffer = Buffer.from(await res.arrayBuffer());
  if (buffer.length < 1000) throw new Error(`cover suspiciously small (${buffer.length}b)`);

  const filename = `${slug}.${ext}`;
  await writeFile(join(COVERS_DIR, filename), buffer);
  return filename;
}

async function getBookSlugs() {
  const xml = await fetchText(`${SITE}/sitemap.xml`);
  const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);

  return locs
    .map((url) => new URL(url).pathname.replace(/^\/|\/$/g, ""))
    .filter((path) => path && !path.includes("/") && !["topics", "authors"].includes(path))
    .sort();
}

async function extractBook(slug) {
  const html = await fetchText(`${SITE}/${slug}`);
  const jsonLd = parseJsonLd(html);
  const book = findNode(jsonLd, "Book");
  if (!book) throw new Error("no Book JSON-LD node");

  const authors = Array.isArray(book.author)
    ? book.author.map((a) => a.name)
    : [book.author?.name].filter(Boolean);

  const topics = (book.about ?? []).map(slugify);

  let cover = "";
  const coverError = [];
  if (book.image) {
    try {
      cover = await downloadCover(book.image, slug);
    } catch (error) {
      coverError.push(error.message);
    }
  }

  const frontmatter = buildFrontmatter({
    title: book.name,
    author: authors.join(", "),
    description: book.description,
    link: extractPurchaseLink(html, book.url),
    topics,
    cover,
    publisher: book.publisher?.name,
    year: book.datePublished,
    pages: book.numberOfPages ? String(book.numberOfPages) : "",
    isbn: book.isbn,
  });

  const summary = extractSummary(html);
  const body = `---\n${frontmatter}\n---\n${summary ? `\n${summary}\n` : ""}`;

  await writeFile(join(BOOKS_DIR, `${slug}.mdx`), body);

  return {
    slug,
    title: book.name,
    authors: authors.length,
    topics: topics.length,
    topicSlugs: topics,
    hasCover: Boolean(cover),
    hasSummary: Boolean(summary),
    hasLink: Boolean(extractPurchaseLink(html, book.url)),
    optional: {
      publisher: Boolean(book.publisher?.name),
      year: Boolean(book.datePublished),
      pages: Boolean(book.numberOfPages),
      isbn: Boolean(book.isbn),
    },
    coverError,
  };
}

async function extractTopic(slug) {
  const html = await fetchText(`${SITE}/topics/${slug}`);

  const titleMatch = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/);
  const title = titleMatch
    ? decodeEntities(titleMatch[1].replace(/<[^>]+>/g, "").trim()).replace(/\s+Books$/, "")
    : slug;

  // The page renders "{description} {N} books." — strip the trailing count sentence.
  const pMatch = html.match(/<h1[^>]*>[\s\S]*?<\/h1>\s*<p[^>]*>([\s\S]*?)<\/p>/);
  const description = pMatch
    ? decodeEntities(pMatch[1].replace(/<[^>]+>/g, "").trim())
        .replace(/\s*\d+\s+books?\.\s*$/i, "")
        .trim()
    : "";

  await writeFile(
    join(TOPICS_DIR, `${slug}.json`),
    `${JSON.stringify({ title, slug, description }, null, 2)}\n`,
  );

  return { slug, title, hasDescription: Boolean(description) };
}

async function main() {
  await Promise.all([
    mkdir(BOOKS_DIR, { recursive: true }),
    mkdir(TOPICS_DIR, { recursive: true }),
    mkdir(COVERS_DIR, { recursive: true }),
  ]);

  const slugs = await getBookSlugs();
  console.log(`Found ${slugs.length} book slugs in the sitemap.\n`);

  const results = [];
  const failures = [];

  for (const [index, slug] of slugs.entries()) {
    process.stdout.write(`[${index + 1}/${slugs.length}] ${slug} … `);
    try {
      const result = await extractBook(slug);
      results.push(result);
      const flags = [
        result.hasCover ? "cover" : "NO COVER",
        result.hasSummary ? "summary" : "no summary",
        `${result.topics} topics`,
      ];
      console.log(flags.join(", "));
    } catch (error) {
      failures.push({ slug, error: error.message });
      console.log(`FAILED — ${error.message}`);
    }
    await sleep(DELAY_MS);
  }

  // Topic slugs are derived from what the books actually reference, so the two
  // collections can never drift apart.
  const topicSlugs = [...new Set(results.flatMap((r) => r.topicSlugs ?? []))];
  const allTopics = topicSlugs.length
    ? topicSlugs
    : [
        "brand-identity", "color", "content-design", "creative-practice",
        "design-history", "design-research", "design-systems", "design-theory",
        "graphic-design", "inclusive-design", "information-design", "product-design",
        "professional-practice", "service-design", "systems-thinking", "typography",
        "usability-and-ux", "visual-perception",
      ];

  console.log(`\nExtracting ${allTopics.length} topics …`);
  const topics = [];
  for (const slug of allTopics) {
    try {
      topics.push(await extractTopic(slug));
    } catch (error) {
      failures.push({ slug: `topics/${slug}`, error: error.message });
    }
    await sleep(DELAY_MS);
  }

  const count = (pred) => results.filter(pred).length;

  console.log("\n" + "─".repeat(52));
  console.log(`Books extracted   ${results.length}/${slugs.length}`);
  console.log(`Covers downloaded ${count((r) => r.hasCover)}`);
  console.log(`With summary      ${count((r) => r.hasSummary)}`);
  console.log(`With link         ${count((r) => r.hasLink)}`);
  console.log(`With publisher    ${count((r) => r.optional.publisher)}`);
  console.log(`With year         ${count((r) => r.optional.year)}`);
  console.log(`With pages        ${count((r) => r.optional.pages)}`);
  console.log(`With isbn         ${count((r) => r.optional.isbn)}`);
  console.log(`Topics written    ${topics.length}`);
  console.log(`Topic descs       ${topics.filter((t) => t.hasDescription).length}`);

  const noTopics = results.filter((r) => r.topics === 0);
  if (noTopics.length) {
    console.log(`\nBooks with NO topics (${noTopics.length}): ${noTopics.map((r) => r.slug).join(", ")}`);
  }

  const noCover = results.filter((r) => !r.hasCover);
  if (noCover.length) {
    console.log(`\nBooks with NO cover (${noCover.length}):`);
    for (const r of noCover) console.log(`  ${r.slug} ${r.coverError.join("; ")}`);
  }

  if (failures.length) {
    console.log(`\nFAILURES (${failures.length}):`);
    for (const f of failures) console.log(`  ${f.slug}: ${f.error}`);
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error("Fatal:", error);
  process.exit(1);
});
