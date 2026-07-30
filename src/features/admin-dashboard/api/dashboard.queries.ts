import type { QueryClient } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";

import { adminDashboardKeys } from "@/features/admin-dashboard/api/dashboard.keys";
import type { AdminDashboardSummary } from "@/features/admin-dashboard/api/dashboard.types";
import { apiRequest } from "@/lib/api/client";
import { apiEndpoints } from "@/lib/api/endpoints";
import { dashboardQueryOptions } from "@/lib/api/query-options";

export async function getAdminDashboardSummary() {
  return apiRequest<AdminDashboardSummary>(apiEndpoints.dashboard.summary);
}

export function useAdminDashboardSummary() {
  return useQuery({
    queryKey: adminDashboardKeys.summary(),
    queryFn: getAdminDashboardSummary,
    ...dashboardQueryOptions,
  });
}

export function prefetchAdminDashboardSummary(queryClient: QueryClient) {
  return queryClient.prefetchQuery({
    queryKey: adminDashboardKeys.summary(),
    queryFn: getAdminDashboardSummary,
    ...dashboardQueryOptions,
  });
}
