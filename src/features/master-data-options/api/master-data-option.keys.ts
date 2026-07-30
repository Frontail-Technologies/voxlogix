import type { MasterDataOptionsParams } from "@/features/master-data-options/api/master-data-option.types";

export const masterDataOptionKeys = {
  all: ["master-data-options"] as const,
  list: (params: MasterDataOptionsParams) => [...masterDataOptionKeys.all, params] as const,
};
