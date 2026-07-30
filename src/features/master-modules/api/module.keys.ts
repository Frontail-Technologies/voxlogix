import type { ModuleListParams } from "@/features/master-modules/api/module.types";

export const moduleKeys = {
  all: ["master-modules"] as const,
  lists: () => [...moduleKeys.all, "list"] as const,
  list: (params: ModuleListParams) => [...moduleKeys.lists(), params] as const,
  details: () => [...moduleKeys.all, "detail"] as const,
  detail: (moduleId: string) => [...moduleKeys.details(), moduleId] as const,
  fields: (moduleId: string) => [...moduleKeys.detail(moduleId), "fields"] as const,
};
