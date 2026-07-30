import { useQuery } from "@tanstack/react-query";

import { moduleTypeKeys } from "@/features/master-module-types/api/module-type.keys";
import type {
  ModuleType,
  ModuleTypeListMeta,
  ModuleTypeListParams,
} from "@/features/master-module-types/api/module-type.types";
import { apiRequest } from "@/lib/api/client";
import { apiEndpoints } from "@/lib/api/endpoints";
import { listQueryOptions, referenceQueryOptions } from "@/lib/api/query-options";

function buildSearchParams(params: ModuleTypeListParams) {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      searchParams.set(key, String(value));
    }
  });

  const query = searchParams.toString();
  return query ? `?${query}` : "";
}

export async function getModuleTypes(params: ModuleTypeListParams = {}) {
  return apiRequest<ModuleType[], ModuleTypeListMeta>(
    `${apiEndpoints.moduleTypes.root}${buildSearchParams(params)}`,
  );
}

export function useModuleTypesList(params: ModuleTypeListParams = {}) {
  return useQuery({
    queryKey: moduleTypeKeys.list(params),
    queryFn: () => getModuleTypes(params),
    ...listQueryOptions,
  });
}

export function useActiveModuleTypesOptions() {
  return useQuery({
    queryKey: moduleTypeKeys.list({ limit: 100, status: "ACTIVE" }),
    queryFn: () => getModuleTypes({ limit: 100, status: "ACTIVE" }),
    ...referenceQueryOptions,
  });
}
