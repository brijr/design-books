type BookSubmissionPayload = {
  title?: unknown;
  author?: unknown;
  link?: unknown;
  notes?: unknown;
  contact?: unknown;
  website?: unknown;
};

type NormalizedBookSubmission = {
  title: string;
  author: string;
  link: string;
  notes: string;
  contact: string;
};

const WEBHOOK_URL =
  process.env.DISCORD_BOOK_SUBMISSIONS_WEBHOOK_URL ||
  process.env.DISCORD_WEBHOOK_URL;

export async function POST(request: Request) {
  const payload = await readPayload(request);

  if (!payload) {
    return Response.json({ message: "Invalid submission." }, { status: 400 });
  }

  if (getText(payload.website, 200)) {
    return Response.json({
      message: "Thanks. The book was submitted.",
    });
  }

  const submission = normalizeSubmission(payload);
  const validationError = validateSubmission(submission);

  if (validationError) {
    return Response.json({ message: validationError }, { status: 400 });
  }

  if (!WEBHOOK_URL) {
    return Response.json(
      { message: "Submission notifications are not configured yet." },
      { status: 503 },
    );
  }

  try {
    const response = await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "Design Books (https://designbooks.org, 1.0)",
      },
      body: JSON.stringify(buildDiscordMessage(submission)),
    });

    if (!response.ok) {
      console.error(
        `Discord book submission failed: ${response.status} ${response.statusText}`,
      );
      return Response.json(
        { message: "Could not send the book submission." },
        { status: 502 },
      );
    }
  } catch (error) {
    console.error("Discord book submission failed:", error);
    return Response.json(
      { message: "Could not send the book submission." },
      { status: 502 },
    );
  }

  return Response.json({
    message: "Thanks. The book was submitted.",
  });
}

async function readPayload(
  request: Request,
): Promise<BookSubmissionPayload | null> {
  try {
    const body = await request.text();

    if (body.length > 5000) {
      return null;
    }

    const parsed = JSON.parse(body) as unknown;

    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
}

function normalizeSubmission(
  payload: BookSubmissionPayload,
): NormalizedBookSubmission {
  return {
    title: getText(payload.title, 160),
    author: getText(payload.author, 160),
    link: getText(payload.link, 500),
    notes: getText(payload.notes, 1000),
    contact: getText(payload.contact, 160),
  };
}

function validateSubmission(submission: NormalizedBookSubmission) {
  if (!submission.title) {
    return "Please add a book title.";
  }

  if (submission.link && !isHttpUrl(submission.link)) {
    return "Please use a valid book link.";
  }

  return null;
}

function getText(value: unknown, maxLength: number) {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

function isHttpUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

function buildDiscordMessage(submission: NormalizedBookSubmission) {
  return {
    content: "New Design Books submission",
    allowed_mentions: {
      parse: [],
    },
    embeds: [
      {
        title: submission.title,
        url: submission.link || undefined,
        color: 15844367,
        fields: [
          submission.author
            ? {
                name: "Author",
                value: submission.author,
              }
            : null,
          submission.notes
            ? {
                name: "Why",
                value: submission.notes,
              }
            : null,
          submission.link
            ? {
                name: "Link",
                value: submission.link,
              }
            : null,
          submission.contact
            ? {
                name: "Submitted by",
                value: submission.contact,
              }
            : null,
        ].filter(Boolean),
        timestamp: new Date().toISOString(),
      },
    ],
  };
}
