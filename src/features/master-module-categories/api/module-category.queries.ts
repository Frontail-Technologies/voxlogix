import { useQuery } from "@tanstack/react-query";

import { moduleCategoryKeys } from "@/features/master-module-categories/api/module-category.keys";
import type {
  ModuleCategory,
  ModuleCategoryListMeta,
  ModuleCategoryListParams,
} from "@/features/master-module-categories/api/module-category.types";
import { apiRequest } from "@/lib/api/client";
import { apiEndpoints } from "@/lib/api/endpoints";
import { listQueryOptions, referenceQueryOptions } from "@/lib/api/query-options";

function buildSearchParams(params: ModuleCategoryListParams) {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      searchParams.set(key, String(value));
    }
  });

  const query = searchParams.toString();
  return query ? `?${query}` : "";
}

export async function getModuleCategories(params: ModuleCategoryListParams = {}) {
  return apiRequest<ModuleCategory[], ModuleCategoryListMeta>(
    `${apiEndpoints.moduleCategories.root}${buildSearchParams(params)}`,
  );
}

export function useModuleCategoriesList(params: ModuleCategoryListParams = {}) {
  return useQuery({
    queryKey: moduleCategoryKeys.list(params),
    queryFn: () => getModuleCategories(params),
    ...listQueryOptions,
  });
}

export function useActiveModuleCategoriesOptions() {
  return useQuery({
    queryKey: moduleCategoryKeys.list({ limit: 100, status: "ACTIVE" }),
    queryFn: () => getModuleCategories({ limit: 100, status: "ACTIVE" }),
    ...referenceQueryOptions,
  });
}
