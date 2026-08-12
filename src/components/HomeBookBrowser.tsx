import { useMemo, useSyncExternalStore } from "react";
import type { ChangeEvent, MouseEvent } from "react";

import { cn } from "../lib/cn";

export type HomeTopic = {
  slug: string;
  title: string;
};

export type HomeBookImage = {
  src: string;
  width: number;
  height: number;
};

export type HomeBook = {
  id: string;
  slug: string;
  title: string;
  author: string;
  description: string;
  link?: string;
  createdAt: string;
  image: HomeBookImage | null;
  topics: HomeTopic[];
};

type Filters = {
  search: string;
  sort: string;
  topic: string;
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
          <a
            href={homeHref({ ...filters, topic: "" })}
            className={
              !filters.topic ? "link" : "text-zinc-400 hover:text-current"
            }
            onClick={(event) => handleTopic(event, "")}
          >
            All
          </a>
          {topics.map((bookTopic) => (
            <a
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
            </a>
          ))}
        </div>

        <div className="flex gap-4 text-sm">
          <a
            href={homeHref({ ...filters, sort: "" })}
            className={
              filters.sort !== "recent"
                ? "link"
                : "text-zinc-400 hover:text-current"
            }
            onClick={(event) => handleSort(event, "")}
          >
            A-Z
          </a>
          <a
            href={homeHref({ ...filters, sort: "recent" })}
            className={
              filters.sort === "recent"
                ? "link"
                : "text-zinc-400 hover:text-current"
            }
            onClick={(event) => handleSort(event, "recent")}
          >
            Recently added
          </a>
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

function BookCard({ book }: { book: HomeBook }) {
  return (
    <div className="relative group">
      <a
        href={`/${book.slug}`}
        aria-label={`Read about ${book.title} by ${book.author}`}
        className={cn(
          "p-8 relative flex flex-col items-center justify-center",
          "aspect-square rounded-xl bg-zinc-100 border border-zinc-200",
          "hover:bg-zinc-200 transition-colors duration-300",
        )}
      >
        {book.image ? (
          <img
            src={book.image.src}
            width={book.image.width}
            height={book.image.height}
            alt={`${book.title} book cover`}
            className="max-w-36 w-auto h-auto max-h-36 sm:max-w-48 sm:max-h-48 -mt-8"
          />
        ) : (
          <div className="max-w-48 text-center text-lg font-medium">
            {book.title}
          </div>
        )}
        <div className="absolute bottom-4 text-sm left-4 w-3/4">
          <h3 className="truncate">{book.title}</h3>
          <h4 className="text-zinc-400">{book.author}</h4>
        </div>
      </a>
      {book.link && (
        <a
          className="hidden group-hover:inline-block absolute bottom-4 right-4"
          target="_blank"
          rel="noopener noreferrer"
          href={book.link}
        >
          <span className="sr-only">Purchase this book</span>
          <svg
            width="15"
            height="15"
            viewBox="0 0 15 15"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M4.62471 4.00001L4.56402 4.00001C4.04134 3.99993 3.70687 3.99988 3.4182 4.055C2.2379 4.28039 1.29846 5.17053 1.05815 6.33035C0.999538 6.61321 0.999604 6.93998 0.999703 7.43689L0.999711 7.50001L0.999703 7.56313C0.999604 8.06004 0.999538 8.38681 1.05815 8.66967C1.29846 9.8295 2.2379 10.7196 3.4182 10.945C3.70688 11.0001 4.04135 11.0001 4.56403 11L4.62471 11H5.49971C5.77585 11 5.99971 10.7762 5.99971 10.5C5.99971 10.2239 5.77585 10 5.49971 10H4.62471C4.02084 10 3.78907 9.99777 3.60577 9.96277C2.80262 9.8094 2.19157 9.21108 2.03735 8.46678C2.00233 8.29778 1.99971 8.08251 1.99971 7.50001C1.99971 6.91752 2.00233 6.70225 2.03735 6.53324C2.19157 5.78895 2.80262 5.19062 3.60577 5.03725C3.78907 5.00225 4.02084 5.00001 4.62471 5.00001H5.49971C5.77585 5.00001 5.99971 4.77615 5.99971 4.50001C5.99971 4.22387 5.77585 4.00001 5.49971 4.00001H4.62471ZM10.3747 5.00001C10.9786 5.00001 11.2104 5.00225 11.3937 5.03725C12.1968 5.19062 12.8079 5.78895 12.9621 6.53324C12.9971 6.70225 12.9997 6.91752 12.9997 7.50001C12.9997 8.08251 12.9971 8.29778 12.9621 8.46678C12.8079 9.21108 12.1968 9.8094 11.3937 9.96277C11.2104 9.99777 10.9786 10 10.3747 10H9.49971C9.22357 10 8.99971 10.2239 8.99971 10.5C8.99971 10.7762 9.22357 11 9.49971 11H10.3747L10.4354 11C10.9581 11.0001 11.2925 11.0001 11.5812 10.945C12.7615 10.7196 13.701 9.8295 13.9413 8.66967C13.9999 8.38681 13.9998 8.06005 13.9997 7.56314L13.9997 7.50001L13.9997 7.43688C13.9998 6.93998 13.9999 6.61321 13.9413 6.33035C13.701 5.17053 12.7615 4.28039 11.5812 4.055C11.2925 3.99988 10.9581 3.99993 10.4354 4.00001L10.3747 4.00001H9.49971C9.22357 4.00001 8.99971 4.22387 8.99971 4.50001C8.99971 4.77615 9.22357 5.00001 9.49971 5.00001H10.3747ZM5.00038 7C4.72424 7 4.50038 7.22386 4.50038 7.5C4.50038 7.77614 4.72424 8 5.00038 8H10.0004C10.2765 8 10.5004 7.77614 10.5004 7.5C10.5004 7.22386 10.2765 7 10.0004 7H5.00038Z"
              fill="currentColor"
              fillRule="evenodd"
              clipRule="evenodd"
            ></path>
          </svg>
        </a>
      )}
    </div>
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
