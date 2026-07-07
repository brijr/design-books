import { getPayload } from "payload";

import config from "../src/payload.config";
import { slugify } from "../src/lib/taxonomy";

process.env.PAYLOAD_MIGRATING = "true";

type TopicSeed = {
  slug: string;
  title: string;
  description: string;
};

type BookSeed = {
  title: string;
  author: string;
  slug: string;
  description: string;
  topics: string[];
  emphasis: string;
  link?: string;
};

const apply =
  process.env.CONTENT_SEO_APPLY === "true" ||
  process.argv.includes("--apply") ||
  process.argv.includes("apply");

const TOPICS: TopicSeed[] = [
  {
    slug: "content-design",
    title: "Content Design",
    description:
      "Books about writing, structure, language, and content decisions in digital products and services.",
  },
  {
    slug: "design-research",
    title: "Design Research",
    description:
      "Books about research methods, interviewing, synthesis, and evidence-led design decisions.",
  },
  {
    slug: "inclusive-design",
    title: "Inclusive Design",
    description:
      "Books about accessibility, equity, participation, and designing with people historically left out.",
  },
  {
    slug: "service-design",
    title: "Service Design",
    description:
      "Books about journeys, backstage systems, service ecosystems, facilitation, and cross-channel experiences.",
  },
];

const BOOKS: BookSeed[] = [
  {
    title: "The Visual Display of Quantitative Information",
    author: "Edward Tufte",
    slug: "the-visual-display-of-quantitative-information",
    description:
      "Edward Tufte's classic on statistical graphics shows how evidence, scale, and visual clarity shape understanding.",
    topics: ["information-design", "visual-perception"],
    emphasis:
      "gives information design its clearest foundation by showing how data displays can reveal or obscure evidence",
    link: "https://www.edwardtufte.com/tufte/books_vdqi",
  },
  {
    title: "Envisioning Information",
    author: "Edward Tufte",
    slug: "envisioning-information",
    description:
      "A dense study of maps, diagrams, layering, and small multiples for making complex information easier to inspect.",
    topics: ["information-design", "visual-perception"],
    emphasis:
      "extends visual evidence into maps, diagrams, and dense displays where readers need structure without simplification",
    link: "https://www.edwardtufte.com/tufte/books_ei",
  },
  {
    title: "Design for the Real World",
    author: "Victor Papanek",
    slug: "design-for-the-real-world",
    description:
      "Victor Papanek argues for responsible design that serves human needs, ecological limits, and social consequence.",
    topics: ["design-theory", "product-design", "professional-practice"],
    emphasis:
      "adds ethical weight to the collection by asking what design work is for and who it should serve",
  },
  {
    title: "The Art of Looking Sideways",
    author: "Alan Fletcher",
    slug: "the-art-of-looking-sideways",
    description:
      "Alan Fletcher's visual notebook collects observations, images, language, and wit into a study of how designers see.",
    topics: ["graphic-design", "visual-perception", "creative-practice"],
    emphasis:
      "turns looking into a design practice, connecting visual play, language, perception, and graphic judgment",
    link: "https://www.phaidon.com/store/design/the-art-of-looking-sideways-9780714834498/",
  },
  {
    title: "The Shape of Design",
    author: "Frank Chimero",
    slug: "the-shape-of-design",
    description:
      "Frank Chimero reflects on design as craft, conversation, systems, and making work with intention and generosity.",
    topics: ["design-theory", "creative-practice"],
    emphasis:
      "brings a contemporary voice to design craft, helping readers connect process, judgment, and meaning",
    link: "https://shapeofdesignbook.com/",
  },
  {
    title: "A Pattern Language",
    author: "Christopher Alexander, Sara Ishikawa, Murray Silverstein",
    slug: "a-pattern-language",
    description:
      "A systems classic that describes repeatable patterns for places, buildings, communities, and human-scale design.",
    topics: ["design-systems", "product-design", "design-theory"],
    emphasis:
      "shows how reusable patterns can organize complex design problems without reducing them to rigid formulas",
  },
  {
    title: "Notes on the Synthesis of Form",
    author: "Christopher Alexander",
    slug: "notes-on-the-synthesis-of-form",
    description:
      "Christopher Alexander studies form, context, constraints, and problem decomposition in complex design work.",
    topics: ["design-theory", "design-systems"],
    emphasis:
      "gives designers a sharper way to think about fit between form, context, constraints, and structure",
  },
  {
    title: "About Face",
    author: "Alan Cooper, Robert Reimann, David Cronin, Christopher Noessel",
    slug: "about-face",
    description:
      "A deep interaction design guide covering goals, behavior, interfaces, workflows, and product experience strategy.",
    topics: ["product-design", "usability-and-ux"],
    emphasis:
      "adds a heavyweight interaction design reference for connecting user goals to screens, flows, and behavior",
  },
  {
    title: "Designing Interfaces",
    author: "Jenifer Tidwell, Charles Brewer, Aynne Valencia",
    slug: "designing-interfaces",
    description:
      "A practical pattern library for interface decisions across navigation, input, feedback, layout, and information.",
    topics: ["usability-and-ux", "product-design", "design-systems"],
    emphasis:
      "turns interface knowledge into reusable patterns that help teams make consistent product decisions",
  },
  {
    title: "The User Experience Team of One",
    author: "Leah Buley",
    slug: "the-user-experience-team-of-one",
    description:
      "Leah Buley gives solo and small-team designers practical methods for research, strategy, sketching, and buy-in.",
    topics: ["usability-and-ux", "professional-practice", "design-research"],
    emphasis:
      "helps small teams practice useful UX work without waiting for a large research or design organization",
    link: "https://rosenfeldmedia.com/books/the-user-experience-team-of-one/",
  },
  {
    title: "Just Enough Research",
    author: "Erika Hall",
    slug: "just-enough-research",
    description:
      "A concise guide to practical research, helping teams ask better questions and avoid designing from assumptions.",
    topics: ["design-research", "usability-and-ux"],
    emphasis:
      "makes research approachable by focusing on the smallest useful evidence that improves design judgment",
    link: "https://abookapart.com/products/just-enough-research",
  },
  {
    title: "Interviewing Users",
    author: "Steve Portigal",
    slug: "interviewing-users",
    description:
      "Steve Portigal teaches how to plan, conduct, and learn from user interviews with care, curiosity, and rigor.",
    topics: ["design-research", "usability-and-ux"],
    emphasis:
      "deepens the research shelf by showing how better conversations produce clearer product insight",
    link: "https://rosenfeldmedia.com/books/interviewing-users-second-edition/",
  },
  {
    title: "How to Make Sense of Any Mess",
    author: "Abby Covert",
    slug: "how-to-make-sense-of-any-mess",
    description:
      "Abby Covert introduces information architecture as a way to organize complexity, language, structure, and meaning.",
    topics: ["information-design", "content-design", "usability-and-ux"],
    emphasis:
      "adds information architecture to the collection by making structure, language, and meaning easier to reason about",
    link: "https://www.howtomakesenseofanymess.com/",
  },
  {
    title: "Writing Is Designing",
    author: "Michael J. Metts, Andy Welfle",
    slug: "writing-is-designing",
    description:
      "A product writing guide that treats words, labels, flows, and interface language as core design material.",
    topics: ["content-design", "usability-and-ux"],
    emphasis:
      "fills the content design gap by showing how words shape product behavior, trust, and usability",
    link: "https://abookapart.com/products/writing-is-designing",
  },
  {
    title: "Mismatch",
    author: "Kat Holmes",
    slug: "mismatch",
    description:
      "Kat Holmes frames exclusion as a design problem and shows how inclusive methods can create better products.",
    topics: ["inclusive-design", "product-design"],
    emphasis:
      "connects accessibility and inclusion to product design decisions instead of treating them as late-stage checks",
  },
  {
    title: "Design Justice",
    author: "Sasha Costanza-Chock",
    slug: "design-justice",
    description:
      "Sasha Costanza-Chock examines how design distributes power and argues for community-led design practices.",
    topics: ["inclusive-design", "design-theory"],
    emphasis:
      "adds a necessary justice lens by asking who participates in design and who bears its consequences",
  },
  {
    title: "Design Systems",
    author: "Alla Kholmatova",
    slug: "design-systems",
    description:
      "Alla Kholmatova explains how teams create, maintain, and evolve design systems across products and organizations.",
    topics: ["design-systems", "product-design"],
    emphasis:
      "extends the systems shelf with practical guidance for maintaining coherent components, patterns, and decisions",
    link: "https://www.smashingmagazine.com/printed-books/design-systems/",
  },
  {
    title: "Orchestrating Experiences",
    author: "Chris Risdon, Patrick Quattlebaum",
    slug: "orchestrating-experiences",
    description:
      "A guide to coordinating touchpoints, journeys, channels, and teams into clearer end-to-end experiences.",
    topics: ["service-design", "product-design"],
    emphasis:
      "expands product design beyond screens by connecting touchpoints, journeys, teams, and operations",
    link: "https://rosenfeldmedia.com/books/orchestrating-experiences/",
  },
  {
    title: "This Is Service Design Doing",
    author:
      "Marc Stickdorn, Markus Edgar Hormess, Adam Lawrence, Jakob Schneider",
    slug: "this-is-service-design-doing",
    description:
      "A practical service design handbook covering research, facilitation, prototyping, journeys, and implementation.",
    topics: ["service-design", "professional-practice"],
    emphasis:
      "adds hands-on service design methods for working across people, channels, workshops, and delivery constraints",
    link: "https://www.thisisservicedesigndoing.com/",
  },
  {
    title: "Design Is a Job",
    author: "Mike Monteiro",
    slug: "design-is-a-job",
    description:
      "Mike Monteiro's direct guide to the business of design covers clients, contracts, presenting, and getting paid.",
    topics: ["professional-practice"],
    emphasis:
      "sharpens the professional practice shelf with blunt guidance on clients, money, responsibility, and trust",
    link: "https://abookapart.com/products/design-is-a-job",
  },
];

const TOPIC_AUDIENCE: Record<string, string> = {
  "content-design": "content designers, UX writers, and product teams",
  "creative-practice": "designers, writers, artists, and creative teams",
  "design-research": "researchers, product designers, and founders",
  "design-systems": "design systems teams, product designers, and engineers",
  "design-theory": "designers who want sharper judgment and context",
  "graphic-design": "graphic designers, art directors, and visual designers",
  "inclusive-design": "product teams, accessibility leads, and design leaders",
  "information-design": "designers who organize evidence, data, and complexity",
  "product-design": "product designers, founders, and product teams",
  "professional-practice": "freelancers, studio designers, and design leads",
  "service-design": "service designers, product teams, and facilitators",
  "usability-and-ux": "UX designers, product teams, and engineers",
  "visual-perception": "visual designers, researchers, and educators",
};

const TOPIC_TAKEAWAY: Record<string, string> = {
  "content-design": "clearer labels, structure, voice, and product language",
  "creative-practice": "stronger creative habits and sharper ways of seeing",
  "design-research": "better questions, interviews, synthesis, and evidence",
  "design-systems": "repeatable structures that make design work coherent",
  "design-theory": "better language for explaining why design decisions matter",
  "graphic-design": "clearer composition, hierarchy, and visual communication",
  "inclusive-design":
    "methods for reducing exclusion and widening participation",
  "information-design": "ways to organize complexity so people can inspect it",
  "product-design": "more useful products and better experience decisions",
  "professional-practice":
    "stronger client process, facilitation, and judgment",
  "service-design": "clearer journeys, touchpoints, and cross-channel systems",
  "usability-and-ux": "clearer interfaces and better diagnosis of friction",
  "visual-perception": "a sharper understanding of how people read visual form",
};

function paragraph(text: string) {
  return {
    children: [
      {
        detail: 0,
        format: 0,
        mode: "normal",
        style: "",
        text,
        type: "text",
        version: 1,
      },
    ],
    direction: "ltr" as const,
    format: "left" as const,
    indent: 0,
    type: "paragraph",
    version: 1,
    textFormat: 0,
    textStyle: "",
  };
}

function heading(text: string) {
  return {
    children: [
      {
        detail: 0,
        format: 0,
        mode: "normal",
        style: "",
        text,
        type: "text",
        version: 1,
      },
    ],
    direction: "ltr" as const,
    format: "left" as const,
    indent: 0,
    type: "heading",
    version: 1,
    tag: "h2",
  };
}

function unique<T>(values: T[]) {
  return [...new Set(values)];
}

function richText(book: BookSeed) {
  const audience = unique(
    book.topics.map((slug) => TOPIC_AUDIENCE[slug]).filter(Boolean),
  ).join("; ");
  const takeaways = unique(
    book.topics.map((slug) => TOPIC_TAKEAWAY[slug]).filter(Boolean),
  ).join("; ");

  return {
    root: {
      children: [
        heading("Why it matters"),
        paragraph(
          `${book.title} belongs in Design Books because it ${book.emphasis}. It expands the list without duplicating the books already covering the same ground.`,
        ),
        heading("Best for"),
        paragraph(
          `Best for ${audience || "designers who want a stronger foundation"}. The book is useful when you want reference material that improves judgment and gives teams more precise working language.`,
        ),
        heading("What you'll learn"),
        paragraph(
          `You will come away with ${takeaways || "a more useful way to describe and improve design decisions"}. The value is practical: better critique, better choices, and better follow-through.`,
        ),
      ],
      direction: "ltr" as const,
      format: "" as const,
      indent: 0,
      type: "root",
      version: 1,
    },
  };
}

function validateSeeds() {
  const errors: string[] = [];
  const slugs = new Set<string>();
  const descriptions = new Map<string, string>();

  for (const book of BOOKS) {
    const expectedSlug = slugify(book.title);

    if (book.slug !== expectedSlug) {
      errors.push(`${book.title} slug should be ${expectedSlug}`);
    }

    if (slugs.has(book.slug)) {
      errors.push(`${book.slug} is duplicated`);
    }
    slugs.add(book.slug);

    if (book.description.length < 90 || book.description.length > 160) {
      errors.push(
        `${book.slug} description is ${book.description.length} chars`,
      );
    }

    const duplicate = descriptions.get(book.description);
    if (duplicate) {
      errors.push(`${book.slug} duplicates description from ${duplicate}`);
    }
    descriptions.set(book.description, book.slug);
  }

  if (errors.length > 0) {
    throw new Error(errors.join("\n"));
  }
}

async function main() {
  validateSeeds();

  const payload = await getPayload({ config });
  const [existingTopics, existingBooks] = await Promise.all([
    payload.find({
      collection: "topics",
      pagination: false,
      overrideAccess: true,
    }),
    payload.find({
      collection: "books",
      depth: 0,
      pagination: false,
      overrideAccess: true,
    }),
  ]);
  const topicsBySlug = new Map(
    existingTopics.docs.map((topic) => [topic.slug, topic]),
  );
  const booksBySlug = new Map(
    existingBooks.docs.map((book) => [book.slug.trim(), book]),
  );

  for (const topic of TOPICS) {
    if (!topicsBySlug.has(topic.slug)) {
      if (!apply) {
        console.log(`[dry-run] topic create ${topic.slug}`);
        continue;
      }

      const saved = await payload.create({
        collection: "topics",
        data: topic,
        overrideAccess: true,
      });
      topicsBySlug.set(saved.slug, saved);
      console.log(`topic created ${saved.slug}`);
    }
  }

  const refreshedTopics = apply
    ? await payload.find({
        collection: "topics",
        pagination: false,
        overrideAccess: true,
      })
    : existingTopics;
  const topicIds = new Map(
    refreshedTopics.docs.map((topic) => [topic.slug, topic.id]),
  );

  for (const book of BOOKS) {
    const topicValues = book.topics.map((topic) => {
      const id = topicIds.get(topic);

      if (!id && !apply) {
        return 0;
      }

      if (!id) {
        throw new Error(`Missing topic ${topic} for ${book.slug}`);
      }

      return id;
    });
    const existing = booksBySlug.get(book.slug);
    const data = {
      title: book.title,
      author: book.author,
      slug: book.slug,
      description: book.description,
      summary: richText(book),
      topics: topicValues,
      link: book.link,
    };

    if (!apply) {
      console.log(
        `[dry-run] book ${existing ? "update" : "create"} ${book.slug}`,
      );
      continue;
    }

    if (existing) {
      await payload.update({
        collection: "books",
        id: existing.id,
        data,
        overrideAccess: true,
      });
      console.log(`book updated ${book.slug}`);
    } else {
      await payload.create({
        collection: "books",
        data,
        overrideAccess: true,
      });
      console.log(`book created ${book.slug}`);
    }
  }

  console.log(
    apply
      ? "Recommended books applied."
      : "Dry run complete. Re-run with apply to write changes.",
  );
}

await main();
