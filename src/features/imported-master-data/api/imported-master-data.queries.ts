import { useQuery } from "@tanstack/react-query";

import { importedMasterDataKeys } from "@/features/imported-master-data/api/imported-master-data.keys";
import type { ImportedMasterDataItem, ImportedMasterDataListParams, ImportedMasterDataSource, PaginationMeta } from "@/features/imported-master-data/api/imported-master-data.types";
import { apiRequest } from "@/lib/api/client";
import { apiEndpoints } from "@/lib/api/endpoints";
import { listQueryOptions } from "@/lib/api/query-options";

function queryString(params: Record<string, unknown>) {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") searchParams.set(key, String(value));
  });
  const query = searchParams.toString();
  return query ? `?${query}` : "";
}

const sourceEndpoints: Record<ImportedMasterDataSource, string> = {
  safetyReporting: apiEndpoints.importedMasterData.safetyReporting,
  measuringPoints: apiEndpoints.importedMasterData.measuringPoints,
  meterCounters: apiEndpoints.importedMasterData.meterCounters,
  kaizen: apiEndpoints.importedMasterData.kaizen,
};

export function getImportedMasterData(source: ImportedMasterDataSource, params: ImportedMasterDataListParams = {}) {
  return apiRequest<ImportedMasterDataItem[], PaginationMeta>(`${sourceEndpoints[source]}${queryString(params)}`);
}

export function useImportedMasterData(source: ImportedMasterDataSource, params: ImportedMasterDataListParams = {}) {
  return useQuery({
    queryKey: importedMasterDataKeys.list(source, params),
    queryFn: () => getImportedMasterData(source, params),
    ...listQueryOptions,
  });
}
