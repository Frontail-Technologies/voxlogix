import type { ModuleTypeListParams } from "@/features/master-module-types/api/module-type.types";

export const moduleTypeKeys = {
  all: ["master-module-types"] as const,
  lists: () => [...moduleTypeKeys.all, "list"] as const,
  list: (params: ModuleTypeListParams) => [...moduleTypeKeys.lists(), params] as const,
};
