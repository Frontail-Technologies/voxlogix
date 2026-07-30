import { useQuery } from "@tanstack/react-query";

import { activityKeys } from "@/features/master-activities/api/activity.keys";
import type { ActivityListMeta, ActivityListParams, PlatformActivity } from "@/features/master-activities/api/activity.types";
import { buildSearchParams } from "@/features/master-companies/api/company.queries";
import { apiRequest } from "@/lib/api/client";
import { apiEndpoints } from "@/lib/api/endpoints";
import { listQueryOptions } from "@/lib/api/query-options";

export function getActivities(params: ActivityListParams = {}) {
  return apiRequest<PlatformActivity[], ActivityListMeta>(`${apiEndpoints.activities.root}${buildSearchParams(params)}`);
}
export function useActivitiesList(params: ActivityListParams = {}) {
  return useQuery({ queryKey: activityKeys.list(params), queryFn: () => getActivities(params), ...listQueryOptions });
}
