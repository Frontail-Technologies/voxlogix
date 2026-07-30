import type { ImportedMasterDataListParams, ImportedMasterDataSource } from "@/features/imported-master-data/api/imported-master-data.types";

export const importedMasterDataKeys = {
  all: ["imported-master-data"] as const,
  list: (source: ImportedMasterDataSource, params: ImportedMasterDataListParams) => [...importedMasterDataKeys.all, source, params] as const,
};
