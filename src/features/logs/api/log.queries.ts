import type { QueryClient } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";

import { adminLogKeys } from "@/features/logs/api/log.keys";
import type { AdminLogDetail, AdminLogListItem, AdminLogListParams } from "@/features/logs/api/log.types";
import type { PaginationMeta } from "@/features/master-admins/api/admin.types";
import { apiRequest } from "@/lib/api/client";
import { apiEndpoints } from "@/lib/api/endpoints";
import { detailQueryOptions, listQueryOptions } from "@/lib/api/query-options";

function queryString(params: Record<string, unknown>) {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") searchParams.set(key, String(value));
  });
  const query = searchParams.toString();
  return query ? `?${query}` : "";
}

export function getLogs(params: AdminLogListParams = {}) {
  return apiRequest<AdminLogListItem[], PaginationMeta>(`${apiEndpoints.logs.root}${queryString(params)}`);
}
export function getLogById(logId: string) {
  return apiRequest<AdminLogDetail>(apiEndpoints.logs.byId(logId));
}
export function useLogsList(params: AdminLogListParams = {}) {
  return useQuery({ queryKey: adminLogKeys.list(params), queryFn: () => getLogs(params), ...listQueryOptions });
}
export function useLogDetail(logId: string) {
  return useQuery({ queryKey: adminLogKeys.detail(logId), queryFn: () => getLogById(logId), enabled: Boolean(logId), ...detailQueryOptions });
}
export function prefetchAdminLogDetail(queryClient: QueryClient, logId: string) {
  return queryClient.prefetchQuery({ queryKey: adminLogKeys.detail(logId), queryFn: () => getLogById(logId), ...detailQueryOptions });
}
