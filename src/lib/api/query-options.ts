import { keepPreviousData } from "@tanstack/react-query";

export const listQueryOptions = {
  staleTime: 60_000,
  placeholderData: keepPreviousData,
} as const;

export const detailQueryOptions = {
  staleTime: 2 * 60_000,
} as const;

export const referenceQueryOptions = {
  staleTime: 5 * 60_000,
} as const;

export const dashboardQueryOptions = {
  staleTime: 60_000,
} as const;
