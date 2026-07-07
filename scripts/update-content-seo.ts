import { getPayload } from "payload";

import config from "../src/payload.config";

process.env.PAYLOAD_MIGRATING = "true";

type TopicSeed = {
  slug: string;
  title: string;
  description: string;
};

type ContentEntry = {
  description: string;
  topics: string[];
  emphasis: string;
};

const apply =
  process.env.CONTENT_SEO_APPLY === "true" ||
  process.argv.includes("--apply") ||
  process.argv.includes("apply");

const TOPICS: TopicSeed[] = [
  {
    slug: "brand-identity",
    title: "Brand Identity",
    description:
      "Books about logos, identity systems, marks, and the visual language of organizations and products.",
  },
  {
    slug: "color",
    title: "Color",
    description:
      "Books about color theory, perception, palettes, and practical color decisions in visual work.",
  },
  {
    slug: "creative-practice",
    title: "Creative Practice",
    description:
      "Books about creative confidence, discipline, taste, motivation, and sustaining original work.",
  },
  {
    slug: "design-history",
    title: "Design History",
    description:
      "Books that document influential designers, movements, objects, and the evolution of design culture.",
  },
  {
    slug: "design-systems",
    title: "Design Systems",
    description:
      "Books about modular systems, grids, programs, components, and repeatable design structures.",
  },
  {
    slug: "design-theory",
    title: "Design Theory",
    description:
      "Books that develop critical language for seeing, judging, and thinking about design decisions.",
  },
  {
    slug: "graphic-design",
    title: "Graphic Design",
    description:
      "Books about composition, layout, visual communication, posters, publishing, and graphic form.",
  },
  {
    slug: "information-design",
    title: "Information Design",
    description:
      "Books about making evidence, data, instructions, and complex information easier to see and use.",
  },
  {
    slug: "product-design",
    title: "Product Design",
    description:
      "Books about designing useful products, services, objects, interfaces, and product experiences.",
  },
  {
    slug: "professional-practice",
    title: "Professional Practice",
    description:
      "Books about client work, design business, critique, process, and the practical realities of practice.",
  },
  {
    slug: "typography",
    title: "Typography",
    description:
      "Books about type, typography, editorial systems, readable hierarchy, and typographic detail.",
  },
  {
    slug: "usability-and-ux",
    title: "Usability and UX",
    description:
      "Books about usability, user experience, interaction patterns, human behavior, and interface clarity.",
  },
  {
    slug: "visual-perception",
    title: "Visual Perception",
    description:
      "Books about how people see, organize, interpret, and respond to visual form and composition.",
  },
];

const CONTENT: Record<string, ContentEntry> = {
  "a-new-program-for-graphic-design": {
    description:
      "A course-like guide to graphic design fundamentals, connecting typography, systems, history, and studio exercises.",
    topics: ["graphic-design", "design-theory", "typography"],
    emphasis:
      "turns graphic design fundamentals into a sequence of lessons that connect history, form, and studio practice",
  },
  "a-primer-of-visual-literacy": {
    description:
      "A foundational guide to visual literacy, explaining how composition, contrast, scale, and syntax create meaning.",
    topics: ["visual-perception", "graphic-design"],
    emphasis:
      "gives designers a vocabulary for reading images and building compositions that communicate deliberately",
  },
  "art-and-visual-perception": {
    description:
      "Rudolf Arnheim connects Gestalt psychology with art and design, showing how viewers organize visual form.",
    topics: ["visual-perception", "design-theory"],
    emphasis:
      "links perception and composition so designers can understand why balance, tension, and shape feel coherent",
  },
  "atomic-design": {
    description:
      "Brad Frost explains how interface systems can be built from smaller reusable parts into coherent products.",
    topics: ["design-systems", "product-design", "usability-and-ux"],
    emphasis:
      "frames interface design as a modular system, helping teams connect components to complete product experiences",
  },
  "beautiful-evidences": {
    description:
      "Edward Tufte shows how evidence, diagrams, maps, and data displays can make complex arguments visible.",
    topics: ["information-design", "visual-perception"],
    emphasis:
      "shows how visual evidence can clarify arguments, reveal patterns, and respect the intelligence of the reader",
  },
  "creative-confidence": {
    description:
      "A practical argument for design thinking, showing how teams can build courage, experimentation, and creative agency.",
    topics: ["creative-practice", "product-design"],
    emphasis:
      "treats creativity as a repeatable practice that teams can develop through prototypes, empathy, and momentum",
  },
  "design-as-art": {
    description:
      "Bruno Munari's essays connect art, objects, communication, and everyday design with wit and critical clarity.",
    topics: ["design-theory", "design-history"],
    emphasis:
      "expands design beyond style by treating everyday objects, communication, and culture as material for judgment",
  },
  "design-for-communication": {
    description:
      "A survey of graphic design principles for clear communication across hierarchy, layout, symbols, and message.",
    topics: ["graphic-design", "information-design"],
    emphasis:
      "connects core graphic design decisions to the practical work of making messages easier to understand",
  },
  "design-book": {
    description:
      "A compact survey of influential designed objects, showing how products, tools, and furniture shaped modern life.",
    topics: ["design-history", "product-design"],
    emphasis:
      "uses iconic objects to show how design decisions travel through culture, production, and daily use",
  },
  "design-of-everyday-things": {
    description:
      "Don Norman's classic guide to usability, affordances, feedback, and human-centered product design.",
    topics: ["usability-and-ux", "product-design"],
    emphasis:
      "makes usability failures visible and gives designers practical language for affordances, feedback, and mental models",
  },
  "designers-dictionary-of-color": {
    description:
      "A reference for color palettes, meanings, and historical uses that helps designers choose color with intent.",
    topics: ["color", "graphic-design"],
    emphasis:
      "turns color selection into a more informed design decision by connecting palettes to history and association",
  },
  "designing-design": {
    description:
      "Kenya Hara's essays open up Japanese design thinking, showing how emptiness and restraint shape visual work.",
    topics: ["design-theory", "graphic-design"],
    emphasis:
      "uses observation, emptiness, and restraint to sharpen how designers think about communication and experience",
  },
  "designing-programmes": {
    description:
      "Karl Gerstner presents design as a programmable system of rules, variation, structure, and controlled possibility.",
    topics: ["design-systems", "graphic-design"],
    emphasis:
      "shows how rules and variation can generate rich graphic outcomes without sacrificing clarity or control",
  },
  "dieter-rams-complete-works": {
    description:
      "A complete study of Dieter Rams's industrial design work, principles, products, and lasting design influence.",
    topics: ["product-design", "design-history"],
    emphasis:
      "documents how restraint, utility, proportion, and ethical product thinking became a durable design standard",
  },
  "dont-make-me-think": {
    description:
      "Steve Krug's direct guide to web usability, helping teams spot friction and make interfaces easier to use.",
    topics: ["usability-and-ux", "product-design"],
    emphasis:
      "keeps usability practical by focusing on obvious labels, clear navigation, and fast user comprehension",
  },
  "elements-of-typographic-style": {
    description:
      "Robert Bringhurst's classic guide to typography, covering rhythm, proportion, readability, and typographic craft.",
    topics: ["typography", "graphic-design"],
    emphasis:
      "treats typography as a craft of rhythm, proportion, hierarchy, and close attention to reading",
  },
  "emotional-design": {
    description:
      "Don Norman explains how attraction, emotion, and behavior shape the products people understand and enjoy.",
    topics: ["product-design", "usability-and-ux"],
    emphasis:
      "adds emotion to human-centered design, showing why usefulness and delight both affect how products work",
  },
  "graphic-design-manual": {
    description:
      "Armin Hofmann's manual teaches composition, contrast, rhythm, and form through disciplined visual exercises.",
    topics: ["graphic-design", "visual-perception"],
    emphasis:
      "builds visual discipline through exercises that make contrast, proportion, rhythm, and composition concrete",
  },
  "grid-system-in-graphic-design": {
    description:
      "A definitive guide to grid systems, showing how structure creates order, rhythm, and flexibility in layouts.",
    topics: ["graphic-design", "design-systems", "typography"],
    emphasis:
      "shows how grids create flexible order for typography, images, hierarchy, and publication systems",
  },
  icons: {
    description:
      "A study of Virgil Abloh's visual language at Nike, connecting fashion, signage, collaboration, and brand systems.",
    topics: ["brand-identity", "design-history"],
    emphasis:
      "uses a contemporary brand collaboration to show how symbols, objects, and references become a visual system",
  },
  "interaction-of-color": {
    description:
      "Josef Albers teaches color through perception, comparison, and exercises that reveal how color changes in context.",
    topics: ["color", "visual-perception"],
    emphasis:
      "makes color relational, showing how perception shifts when hue, value, proportion, and context change",
  },
  "its-not-how-good-you-are-its-how-good-you-want-to-be": {
    description:
      "Paul Arden's concise creative handbook pushes designers to think bigger, take risks, and sharpen ambition.",
    topics: ["creative-practice", "professional-practice"],
    emphasis:
      "compresses creative advice into direct provocations about ambition, risk, taste, and professional momentum",
  },
  "know-your-onions": {
    description:
      "A practical guide to graphic design work, covering layout, type, production, clients, and studio habits.",
    topics: ["graphic-design", "professional-practice"],
    emphasis:
      "focuses on the everyday mechanics of graphic design, from layout choices to client-ready production habits",
  },
  "laws-of-simplicity": {
    description:
      "John Maeda distills simplicity into design principles for making products, systems, and experiences clearer.",
    topics: ["product-design", "usability-and-ux", "design-theory"],
    emphasis:
      "treats simplicity as a design problem, balancing reduction, organization, time, emotion, and meaning",
  },
  "laws-of-ux": {
    description:
      "A compact reference to psychology-backed UX principles that help designers predict user behavior and friction.",
    topics: ["usability-and-ux", "product-design"],
    emphasis:
      "translates behavioral principles into practical product decisions about memory, attention, effort, and trust",
  },
  "less-and-more": {
    description:
      "A focused look at Dieter Rams's product philosophy and how restraint, systems, and ethics shaped modern design.",
    topics: ["product-design", "design-history"],
    emphasis:
      "places product minimalism in context, showing how restraint can serve function rather than decoration",
  },
  "living-with-complexity": {
    description:
      "Don Norman argues that complexity can be usable when designers create clear structure, feedback, and support.",
    topics: ["product-design", "usability-and-ux"],
    emphasis:
      "helps designers separate necessary complexity from confusion and make complicated systems feel manageable",
  },
  "logo-beginnings": {
    description:
      "A visual history of early logo design, tracing how identity systems formed through marks, symbols, and industry.",
    topics: ["brand-identity", "design-history"],
    emphasis:
      "shows how early identity work combined symbols, commerce, reproduction, and modern visual culture",
  },
  "logo-design-love": {
    description:
      "David Airey's guide to logo design covers client process, research, concepts, presentation, and durable marks.",
    topics: ["brand-identity", "professional-practice"],
    emphasis:
      "grounds logo work in research, client communication, concept development, and the discipline of durable marks",
  },
  "logo-modernism": {
    description:
      "A broad archive of modernist logo design, useful for studying marks, geometry, reduction, and identity systems.",
    topics: ["brand-identity", "design-history"],
    emphasis:
      "gives designers a dense reference for studying reduction, geometry, repetition, and identity conventions",
  },
  "massive-change": {
    description:
      "Bruce Mau frames design as a force for systems, technology, culture, and large-scale social change.",
    topics: ["design-theory", "product-design"],
    emphasis:
      "expands design from objects to systems, asking how technology, policy, and culture shape possible futures",
  },
  "principles-of-form-and-design": {
    description:
      "Wucius Wong explains form, structure, repetition, similarity, and visual organization for graphic designers.",
    topics: ["graphic-design", "visual-perception"],
    emphasis:
      "breaks visual form into reusable principles, helping designers understand structure before style",
  },
  shikake: {
    description:
      "Naohiro Matsumura explores subtle design triggers that invite behavior change without force or instruction.",
    topics: ["product-design", "usability-and-ux"],
    emphasis:
      "shows how small environmental cues can encourage behavior by making the desired action feel natural",
  },
  "the-creative-act": {
    description:
      "Rick Rubin reflects on creative attention, taste, practice, and the conditions that help original work emerge.",
    topics: ["creative-practice"],
    emphasis:
      "treats creativity as a way of paying attention, editing carefully, and staying receptive to unexpected material",
  },
  "the-language-of-graphic-design": {
    description:
      "Richard Poulin breaks visual communication into principles designers can use to create clearer graphic work.",
    topics: ["graphic-design", "visual-perception"],
    emphasis:
      "turns visual communication into a practical vocabulary of contrast, hierarchy, rhythm, scale, and meaning",
  },
  "the-process": {
    description:
      "A close look at identity design process, showing how strategy, concepts, refinement, and presentation connect.",
    topics: ["brand-identity", "professional-practice"],
    emphasis:
      "makes brand identity process visible from research and strategy through concept development and refinement",
  },
  "thinking-with-type": {
    description:
      "Ellen Lupton's typography guide covers letters, text, grids, hierarchy, and practical typographic systems.",
    topics: ["typography", "graphic-design"],
    emphasis:
      "connects type details to systems, helping designers make stronger choices about text, hierarchy, and grids",
  },
  "thoughts-on-design": {
    description:
      "Paul Rand's essays show how wit, simplicity, symbols, and judgment shaped modern graphic and identity design.",
    topics: ["graphic-design", "brand-identity", "design-history"],
    emphasis:
      "uses concise essays to show how symbols, wit, reduction, and judgment can make graphic design memorable",
  },
  "universal-principles-of-ux": {
    description:
      "A wide-ranging UX reference that connects research, psychology, interface patterns, and product decisions.",
    topics: ["usability-and-ux", "product-design"],
    emphasis:
      "organizes UX principles into a reference designers can use when diagnosing interfaces and product decisions",
  },
  "user-friendly": {
    description:
      "A history of user-friendly design, showing how human factors, technology, and interfaces shaped modern products.",
    topics: ["usability-and-ux", "product-design", "design-history"],
    emphasis:
      "places usability in cultural and technical history, showing how products became more responsive to people",
  },
  "visual-grammar": {
    description:
      "Christian Leborg introduces visual syntax, explaining abstract form, relation, activity, and composition.",
    topics: ["visual-perception", "graphic-design"],
    emphasis:
      "breaks visual language into basic parts so designers can reason about composition before adding content",
  },
  "visual-thinking": {
    description:
      "Rudolf Arnheim studies thinking through images, showing how perception, abstraction, and reasoning connect.",
    topics: ["visual-perception", "design-theory"],
    emphasis:
      "argues that seeing is a form of thinking, giving designers deeper language for image-based reasoning",
  },
  "war-of-art": {
    description:
      "Steven Pressfield's creative discipline book names resistance and gives makers a direct way to keep working.",
    topics: ["creative-practice", "professional-practice"],
    emphasis:
      "focuses on resistance, discipline, and the daily decision to do serious creative work despite friction",
  },
  "work-for-money-design-for-love": {
    description:
      "David Airey gives practical advice for running a design career, managing clients, and building better work.",
    topics: ["professional-practice", "brand-identity"],
    emphasis:
      "connects design craft with the business habits needed to handle clients, money, positioning, and trust",
  },
};

const TOPIC_AUDIENCE: Record<string, string> = {
  "brand-identity": "identity designers, founders, and brand teams",
  color: "visual designers, illustrators, and interface designers",
  "creative-practice": "designers, writers, artists, and creative teams",
  "design-history": "designers who want historical reference and context",
  "design-systems": "product designers, design systems teams, and engineers",
  "design-theory": "designers who want sharper critical judgment",
  "graphic-design": "graphic designers, art directors, and visual designers",
  "information-design":
    "designers who work with evidence, data, and explanation",
  "product-design": "product designers, founders, and product teams",
  "professional-practice": "freelancers, studio designers, and design leads",
  typography: "typographers, editorial designers, and interface designers",
  "usability-and-ux": "UX designers, product teams, and engineers",
  "visual-perception": "visual designers, researchers, and educators",
};

const TOPIC_TAKEAWAY: Record<string, string> = {
  "brand-identity":
    "stronger identity concepts, clearer marks, and better visual systems",
  color: "more intentional palettes and better sensitivity to context",
  "creative-practice": "healthier creative habits and stronger momentum",
  "design-history":
    "reference points that make current design choices easier to judge",
  "design-systems": "repeatable structures that keep design work coherent",
  "design-theory": "better language for explaining why a design choice works",
  "graphic-design": "clearer hierarchy, composition, and communication",
  "information-design": "ways to make complex material easier to inspect",
  "product-design": "more useful products and clearer experience decisions",
  "professional-practice":
    "better client process, critique, and studio judgment",
  typography: "more careful type choices and stronger reading systems",
  "usability-and-ux":
    "clearer interfaces and better diagnosis of user friction",
  "visual-perception":
    "a sharper understanding of how people organize visual form",
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

function richText({
  title,
  topics,
  emphasis,
}: {
  title: string;
  topics: string[];
  emphasis: string;
}) {
  const topicTitles = topics.map((slug) => topicBySlug(slug).title);
  const audience = unique(
    topics.map((slug) => TOPIC_AUDIENCE[slug]).filter(Boolean),
  ).join("; ");
  const takeaways = unique(
    topics.map((slug) => TOPIC_TAKEAWAY[slug]).filter(Boolean),
  ).join("; ");

  return {
    root: {
      children: [
        heading("Why it matters"),
        paragraph(
          `${title} belongs in Design Books because it ${emphasis}. It helps readers connect ${topicTitles.join(", ")} to the choices they make in real design work.`,
        ),
        heading("Best for"),
        paragraph(
          `Best for ${audience || "designers who want a stronger foundation"}. The book is useful when you want reference material that improves judgment without changing the visual shape of your work.`,
        ),
        heading("What you'll learn"),
        paragraph(
          `You will come away with ${takeaways || "a more precise way to describe and improve design decisions"}. The value is not just inspiration; it is a stronger vocabulary for critique, selection, and follow-through.`,
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

function unique<T>(values: T[]) {
  return [...new Set(values)];
}

function normalizeSlug(value: string) {
  return value.trim();
}

function topicBySlug(slug: string) {
  const topic = TOPICS.find((candidate) => candidate.slug === slug);

  if (!topic) {
    throw new Error(`Unknown topic slug: ${slug}`);
  }

  return topic;
}

function validateContent() {
  const errors: string[] = [];
  const descriptions = new Map<string, string>();

  for (const [slug, entry] of Object.entries(CONTENT)) {
    if (entry.description.length < 90 || entry.description.length > 160) {
      errors.push(
        `${slug} description is ${entry.description.length} chars: ${entry.description}`,
      );
    }

    const existing = descriptions.get(entry.description);
    if (existing) {
      errors.push(`${slug} duplicates description from ${existing}`);
    }
    descriptions.set(entry.description, slug);

    for (const topic of entry.topics) {
      topicBySlug(topic);
    }
  }

  if (errors.length > 0) {
    throw new Error(errors.join("\n"));
  }
}

async function main() {
  validateContent();

  const payload = await getPayload({ config });
  const topicResult = await payload.find({
    collection: "topics",
    pagination: false,
    overrideAccess: true,
  });
  const existingTopics = new Map(
    topicResult.docs.map((topic) => [topic.slug, topic]),
  );
  const topicIds = new Map<string, number>();

  for (const topic of TOPICS) {
    const existing = existingTopics.get(topic.slug);
    const data = {
      title: topic.title,
      slug: topic.slug,
      description: topic.description,
    };

    if (!apply) {
      console.log(
        `[dry-run] topic ${existing ? "update" : "create"} ${topic.slug}`,
      );
      topicIds.set(topic.slug, existing?.id || 0);
      continue;
    }

    const saved = existing
      ? await payload.update({
          collection: "topics",
          id: existing.id,
          data,
          overrideAccess: true,
        })
      : await payload.create({
          collection: "topics",
          data,
          overrideAccess: true,
        });

    topicIds.set(topic.slug, saved.id);
    console.log(`topic ${existing ? "updated" : "created"} ${topic.slug}`);
  }

  const refreshedTopics = apply
    ? await payload.find({
        collection: "topics",
        pagination: false,
        overrideAccess: true,
      })
    : topicResult;

  for (const topic of refreshedTopics.docs) {
    topicIds.set(topic.slug, topic.id);
  }

  const bookResult = await payload.find({
    collection: "books",
    depth: 0,
    pagination: false,
    overrideAccess: true,
  });
  const seenSlugs = new Set<string>();

  for (const book of bookResult.docs) {
    const slug = normalizeSlug(book.slug || "");
    const entry = CONTENT[slug];

    if (!entry) {
      console.log(
        `[skip] no managed content entry for ${book.title} (${slug})`,
      );
      continue;
    }

    seenSlugs.add(slug);

    const topicValues = entry.topics.map((topic) => {
      const id = topicIds.get(topic);
      if (!id) {
        throw new Error(`No topic id for ${topic}`);
      }
      return id;
    });

    const data = {
      description: entry.description,
      summary: richText({
        title: book.title,
        topics: entry.topics,
        emphasis: entry.emphasis,
      }),
      topics: topicValues,
      slug,
      ...(slug === "icons" ? { author: "Virgil Abloh" } : {}),
    };

    if (!apply) {
      console.log(
        `[dry-run] book update ${slug} (${entry.description.length} chars, ${entry.topics.join(", ")})`,
      );
      continue;
    }

    await payload.update({
      collection: "books",
      id: book.id,
      data,
      overrideAccess: true,
    });
    console.log(`book updated ${slug}`);
  }

  const missing = Object.keys(CONTENT).filter((slug) => !seenSlugs.has(slug));
  if (missing.length > 0) {
    throw new Error(
      `Content entries did not match books: ${missing.join(", ")}`,
    );
  }

  console.log(
    apply
      ? "Content SEO update applied."
      : "Dry run complete. Re-run with --apply to write changes.",
  );
}

await main();
