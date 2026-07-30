import type { QueryClient } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";

import { apiRequest } from "@/lib/api/client";
import { apiEndpoints } from "@/lib/api/endpoints";
import type { ApiSuccessResponse } from "@/lib/api/types";
import { detailQueryOptions, listQueryOptions, referenceQueryOptions } from "@/lib/api/query-options";
import { adminKeys } from "@/features/master-admins/api/admin.keys";
import type {
  AdminCompanyOption,
  AdminDetail,
  AdminListItem,
  AdminListParams,
  PaginationMeta,
} from "@/features/master-admins/api/admin.types";

function buildSearchParams(params: AdminListParams) {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      searchParams.set(key, String(value));
    }
  });

  const query = searchParams.toString();
  return query ? `?${query}` : "";
}

export async function getAdmins(params: AdminListParams = {}) {
  return apiRequest<AdminListItem[], PaginationMeta>(
    `${apiEndpoints.admins.root}${buildSearchParams(params)}`,
  );
}

export async function getAdminById(adminId: string) {
  return apiRequest<AdminDetail>(apiEndpoints.admins.byId(adminId));
}

export async function getAdminCompanyOptions() {
  return apiRequest<AdminCompanyOption[]>(apiEndpoints.companies.options);
}

export function useAdminsList(params: AdminListParams = {}) {
  return useQuery({
    queryKey: adminKeys.list(params),
    queryFn: () => getAdmins(params),
    ...listQueryOptions,
  });
}

export function useAdminDetail(adminId: string) {
  return useQuery({
    queryKey: adminKeys.detail(adminId),
    queryFn: () => getAdminById(adminId),
    enabled: Boolean(adminId),
    ...detailQueryOptions,
  });
}

export function useAdminCompanyOptions() {
  return useQuery({
    queryKey: adminKeys.companyOptions(),
    queryFn: getAdminCompanyOptions,
    ...referenceQueryOptions,
  });
}

export function prefetchAdminDetail(queryClient: QueryClient, adminId: string) {
  return queryClient.prefetchQuery({
    queryKey: adminKeys.detail(adminId),
    queryFn: () => getAdminById(adminId),
    ...detailQueryOptions,
  });
}

export type AdminListResponse = ApiSuccessResponse<AdminListItem[], PaginationMeta>;
