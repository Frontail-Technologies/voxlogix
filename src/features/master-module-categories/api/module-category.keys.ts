import type { ModuleCategoryListParams } from "@/features/master-module-categories/api/module-category.types";

export const moduleCategoryKeys = {
  all: ["master-module-categories"] as const,
  lists: () => [...moduleCategoryKeys.all, "list"] as const,
  list: (params: ModuleCategoryListParams) => [...moduleCategoryKeys.lists(), params] as const,
};
