"use client";

import { useState } from "react";
import type { FormEvent } from "react";

type SubmitState = "idle" | "submitting" | "success" | "error";

type SubmissionResponse = {
  message?: string;
};

export function BookSubmissionDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const [message, setMessage] = useState("");

  const closeDialog = () => {
    if (submitState === "submitting") {
      return;
    }

    setIsOpen(false);
    setSubmitState("idle");
    setMessage("");
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);

    setSubmitState("submitting");
    setMessage("");

    try {
      const response = await fetch("/book-submissions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(Object.fromEntries(formData)),
      });
      const result = (await response.json().catch(() => ({}))) as
        | SubmissionResponse
        | undefined;

      if (!response.ok) {
        throw new Error(result?.message || "Could not submit the book.");
      }

      form.reset();
      setSubmitState("success");
      setMessage(result?.message || "Book submitted.");
    } catch (error) {
      setSubmitState("error");
      setMessage(
        error instanceof Error ? error.message : "Could not submit the book.",
      );
    }
  };

  return (
    <>
      <button
        type="button"
        className="text-sm text-zinc-400 hover:text-current"
        onClick={() => setIsOpen(true)}
      >
        Submit a book
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-zinc-950/20 p-6"
          role="presentation"
          onClick={closeDialog}
        >
          <div
            className="grid w-full max-w-lg gap-6 rounded-xl border border-zinc-200 bg-zinc-50 p-6 shadow-sm"
            role="dialog"
            aria-modal="true"
            aria-labelledby="book-submission-title"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 id="book-submission-title" className="font-medium">
                  Submit a book
                </h2>
                <p className="text-sm text-zinc-400">
                  Send a recommendation for the reading list.
                </p>
              </div>
              <button
                type="button"
                className="text-sm text-zinc-400 hover:text-current"
                onClick={closeDialog}
                disabled={submitState === "submitting"}
              >
                Close
              </button>
            </div>

            <form className="grid gap-4" onSubmit={handleSubmit}>
              <label className="grid gap-1 text-sm">
                <span>Title</span>
                <input
                  name="title"
                  type="text"
                  required
                  maxLength={160}
                  className="rounded-md border border-zinc-200 bg-white px-3 py-2 focus:outline-none"
                />
              </label>

              <label className="grid gap-1 text-sm">
                <span>Author</span>
                <input
                  name="author"
                  type="text"
                  maxLength={160}
                  className="rounded-md border border-zinc-200 bg-white px-3 py-2 focus:outline-none"
                />
              </label>

              <label className="grid gap-1 text-sm">
                <span>Link</span>
                <input
                  name="link"
                  type="url"
                  maxLength={500}
                  className="rounded-md border border-zinc-200 bg-white px-3 py-2 focus:outline-none"
                />
              </label>

              <label className="grid gap-1 text-sm">
                <span>Why should it be included?</span>
                <textarea
                  name="notes"
                  rows={4}
                  maxLength={1000}
                  className="resize-none rounded-md border border-zinc-200 bg-white px-3 py-2 focus:outline-none"
                />
              </label>

              <label className="grid gap-1 text-sm">
                <span>Your name or email</span>
                <input
                  name="contact"
                  type="text"
                  maxLength={160}
                  className="rounded-md border border-zinc-200 bg-white px-3 py-2 focus:outline-none"
                />
              </label>

              <input
                name="website"
                type="text"
                tabIndex={-1}
                autoComplete="off"
                className="hidden"
              />

              {message && (
                <p
                  className={
                    submitState === "error"
                      ? "text-sm text-red-600"
                      : "text-sm text-zinc-400"
                  }
                >
                  {message}
                </p>
              )}

              <button
                type="submit"
                disabled={submitState === "submitting"}
                className="justify-self-start text-sm link disabled:text-zinc-400 disabled:no-underline"
              >
                {submitState === "submitting" ? "Submitting..." : "Submit"}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
