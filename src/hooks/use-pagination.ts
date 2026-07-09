"use client";

import { useMemo, useState } from "react";

type UsePaginationOptions<T> = {
  items: T[];
  initialPage?: number;
  pageSize?: number;
};

export function usePagination<T>({
  items,
  initialPage = 1,
  pageSize = 20,
}: UsePaginationOptions<T>) {
  const [page, setPage] = useState(initialPage);
  const totalItems = items.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const safePage = Math.min(Math.max(page, 1), totalPages);
  const startIndex = totalItems === 0 ? 0 : (safePage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalItems);

  const pageItems = useMemo(
    () => items.slice(startIndex, endIndex),
    [items, startIndex, endIndex],
  );

  function goToPage(nextPage: number) {
    setPage(Math.min(Math.max(nextPage, 1), totalPages));
  }

  return {
    page: safePage,
    pageItems,
    pageSize,
    totalItems,
    totalPages,
    startItem: totalItems === 0 ? 0 : startIndex + 1,
    endItem: endIndex,
    canPrevious: safePage > 1,
    canNext: safePage < totalPages,
    goToPage,
    nextPage: () => goToPage(safePage + 1),
    previousPage: () => goToPage(safePage - 1),
  };
}
