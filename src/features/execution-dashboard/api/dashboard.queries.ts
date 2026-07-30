import { useQuery } from "@tanstack/react-query";

import { executionDashboardKeys } from "@/features/execution-dashboard/api/dashboard.keys";
import type { ExecutionDashboardSummary } from "@/features/execution-dashboard/api/dashboard.types";
import { apiRequest } from "@/lib/api/client";
import { apiEndpoints } from "@/lib/api/endpoints";
import { dashboardQueryOptions } from "@/lib/api/query-options";

export async function getExecutionDashboardSummary() {
  return apiRequest<ExecutionDashboardSummary>(apiEndpoints.dashboard.executionSummary);
}

export function useExecutionDashboardSummary() {
  return useQuery({
    queryKey: executionDashboardKeys.summary(),
    queryFn: getExecutionDashboardSummary,
    ...dashboardQueryOptions,
  });
}
