import type { QueryClient } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";

import { moduleKeys } from "@/features/master-modules/api/module.keys";
import type {
  ModuleDetail,
  ModuleField,
  ModuleListItem,
  ModuleListMeta,
  ModuleListParams,
} from "@/features/master-modules/api/module.types";
import { apiRequest } from "@/lib/api/client";
import { apiEndpoints } from "@/lib/api/endpoints";
import { detailQueryOptions, listQueryOptions, referenceQueryOptions } from "@/lib/api/query-options";

function buildSearchParams(params: ModuleListParams) {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      searchParams.set(key, String(value));
    }
  });

  const query = searchParams.toString();
  return query ? `?${query}` : "";
}

export async function getModules(params: ModuleListParams = {}) {
  return apiRequest<ModuleListItem[], ModuleListMeta>(
    `${apiEndpoints.modules.root}${buildSearchParams(params)}`,
  );
}

export async function getModuleById(moduleId: string) {
  return apiRequest<ModuleDetail>(apiEndpoints.modules.byId(moduleId));
}

export async function getModuleFields(moduleId: string) {
  return apiRequest<ModuleField[]>(apiEndpoints.modules.fields(moduleId));
}

export function useModulesList(params: ModuleListParams = {}) {
  return useQuery({
    queryKey: moduleKeys.list(params),
    queryFn: () => getModules(params),
    ...listQueryOptions,
  });
}

export function useModuleDetail(moduleId: string) {
  return useQuery({
    queryKey: moduleKeys.detail(moduleId),
    queryFn: () => getModuleById(moduleId),
    enabled: Boolean(moduleId),
    ...detailQueryOptions,
  });
}

export function useModuleFields(moduleId: string) {
  return useQuery({
    queryKey: moduleKeys.fields(moduleId),
    queryFn: () => getModuleFields(moduleId),
    enabled: Boolean(moduleId),
    ...referenceQueryOptions,
  });
}

export function prefetchModuleDetail(queryClient: QueryClient, moduleId: string) {
  return queryClient.prefetchQuery({
    queryKey: moduleKeys.detail(moduleId),
    queryFn: () => getModuleById(moduleId),
    ...detailQueryOptions,
  });
}
