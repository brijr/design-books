"use client";

import Link from "next/link";
import { useMemo, useSyncExternalStore } from "react";
import type { ChangeEvent, MouseEvent } from "react";

import { BookCard, type BookCardBook } from "@/components/book-card";

export type HomeTopic = {
  id: number;
  slug: string;
  title: string;
};

export type HomeBook = BookCardBook & {
  createdAt: string;
  description: string;
  topics: HomeTopic[];
};

type Filters = {
  search: string;
  sort: string;
  topic: string;
};

const emptyFilters: Filters = {
  search: "",
  sort: "",
  topic: "",
};

const locationChangeEvent = "designbooks:locationchange";

export function HomeBookBrowser({
  books,
  topics,
}: {
  books: HomeBook[];
  topics: HomeTopic[];
}) {
  const locationSearch = useSyncExternalStore(
    subscribeToLocation,
    getLocationSearch,
    getServerLocationSearch,
  );
  const filters = useMemo(
    () => readFiltersFromSearch(locationSearch),
    [locationSearch],
  );

  const visibleBooks = useMemo(
    () => sortBooks(filterBooks(books, filters), filters.sort),
    [books, filters],
  );

  const updateFilters = (nextFilters: Filters, mode: "push" | "replace") => {
    const href = homeHref(nextFilters);
    if (mode === "push") {
      window.history.pushState(null, "", href);
    } else {
      window.history.replaceState(null, "", href);
    }
    window.dispatchEvent(new Event(locationChangeEvent));
  };

  const handleSearch = (event: ChangeEvent<HTMLInputElement>) => {
    updateFilters(
      {
        ...filters,
        search: event.target.value,
      },
      "replace",
    );
  };

  const handleTopic = (event: MouseEvent<HTMLAnchorElement>, topic: string) => {
    event.preventDefault();
    updateFilters({ ...filters, topic }, "push");
  };

  const handleSort = (event: MouseEvent<HTMLAnchorElement>, sort: string) => {
    event.preventDefault();
    updateFilters({ ...filters, sort }, "push");
  };

  return (
    <>
      <div className="grid grid-cols-[1fr_auto] items-center gap-4">
        <input
          type="text"
          name="search"
          aria-label="Search design books"
          placeholder="Search"
          value={filters.search}
          onChange={handleSearch}
          className="focus:outline-none w-full"
        />
        <p className="text-zinc-400">
          {visibleBooks.length} {visibleBooks.length === 1 ? "book" : "books"}
        </p>
      </div>

      <div className="grid gap-4">
        <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm">
          <Link
            href={homeHref({ ...filters, topic: "" })}
            className={
              !filters.topic ? "link" : "text-zinc-400 hover:text-current"
            }
            onClick={(event) => handleTopic(event, "")}
          >
            All
          </Link>
          {topics.map((bookTopic) => (
            <Link
              key={bookTopic.slug}
              href={homeHref({ ...filters, topic: bookTopic.slug })}
              className={
                filters.topic === bookTopic.slug
                  ? "link"
                  : "text-zinc-400 hover:text-current"
              }
              onClick={(event) => handleTopic(event, bookTopic.slug)}
            >
              {bookTopic.title}
            </Link>
          ))}
        </div>

        <div className="flex gap-4 text-sm">
          <Link
            href={homeHref({ ...filters, sort: "" })}
            className={
              filters.sort !== "recent"
                ? "link"
                : "text-zinc-400 hover:text-current"
            }
            onClick={(event) => handleSort(event, "")}
          >
            A-Z
          </Link>
          <Link
            href={homeHref({ ...filters, sort: "recent" })}
            className={
              filters.sort === "recent"
                ? "link"
                : "text-zinc-400 hover:text-current"
            }
            onClick={(event) => handleSort(event, "recent")}
          >
            Recently added
          </Link>
        </div>
      </div>

      {visibleBooks.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {visibleBooks.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      ) : (
        <p className="text-zinc-400">No books found</p>
      )}
    </>
  );
}

function subscribeToLocation(callback: () => void) {
  window.addEventListener("popstate", callback);
  window.addEventListener(locationChangeEvent, callback);

  return () => {
    window.removeEventListener("popstate", callback);
    window.removeEventListener(locationChangeEvent, callback);
  };
}

function getLocationSearch() {
  return window.location.search;
}

function getServerLocationSearch() {
  return "";
}

function readFiltersFromSearch(search: string): Filters {
  const params = new URLSearchParams(search);

  return {
    search: params.get("search") || "",
    sort: params.get("sort") || "",
    topic: params.get("topic") || "",
  };
}

function filterBooks(books: HomeBook[], filters: Filters) {
  const normalizedSearch = filters.search.trim().toLowerCase();

  return books.filter((book) => {
    const matchesTopic =
      !filters.topic ||
      book.topics.some((bookTopic) => bookTopic.slug === filters.topic);
    const matchesSearch =
      !normalizedSearch ||
      [
        book.title,
        book.author,
        book.description,
        ...book.topics.map((bookTopic) => bookTopic.title),
      ]
        .join(" ")
        .toLowerCase()
        .includes(normalizedSearch);

    return matchesTopic && matchesSearch;
  });
}

function sortBooks(books: HomeBook[], sort: string) {
  return [...books].sort((a, b) => {
    if (sort === "recent") {
      return Date.parse(b.createdAt) - Date.parse(a.createdAt);
    }

    return a.title.localeCompare(b.title);
  });
}

function homeHref({ search, sort, topic }: Filters) {
  const params = new URLSearchParams();

  if (search) {
    params.set("search", search);
  }

  if (topic) {
    params.set("topic", topic);
  }

  if (sort === "recent") {
    params.set("sort", sort);
  }

  const query = params.toString();
  return query ? `/?${query}` : "/";
}
