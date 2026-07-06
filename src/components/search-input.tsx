"use client";

import { useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useDebounce } from "use-debounce";

export function SearchInput({ defaultValue }: { defaultValue?: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const createQueryString = useCallback(
    (value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set("search", value);
      } else {
        params.delete("search");
      }
      return params.toString();
    },
    [searchParams],
  );

  const [debouncedCallback] = useDebounce((value: string) => {
    const queryString = createQueryString(value);
    router.push(queryString ? `/?${queryString}` : "/");
  }, 300);

  return (
    <input
      type="text"
      name="search"
      aria-label="Search design books"
      placeholder="Search"
      defaultValue={defaultValue}
      onChange={(e) => debouncedCallback(e.target.value)}
      className="focus:outline-none w-full"
    />
  );
}
