export const adminMasterDataKeys = {
  all: ["admin-master-data"] as const,
  locations: (params: Record<string, unknown> = {}) => [...adminMasterDataKeys.all, "locations", params] as const,
  issueCategories: (params: Record<string, unknown> = {}) => [...adminMasterDataKeys.all, "issue-categories", params] as const,
  equipmentCategories: (params: Record<string, unknown> = {}) => [...adminMasterDataKeys.all, "equipment-categories", params] as const,
};
