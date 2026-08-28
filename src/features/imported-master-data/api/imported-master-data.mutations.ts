import { useMutation, useQueryClient } from "@tanstack/react-query";

import { importedMasterDataKeys } from "@/features/imported-master-data/api/imported-master-data.keys";
import type {
  ImportedMasterDataItem,
  ImportedMasterDataSource,
  UpdateImportedMasterDataPayload,
} from "@/features/imported-master-data/api/imported-master-data.types";
import { apiRequest } from "@/lib/api/client";
import { apiEndpoints } from "@/lib/api/endpoints";

const sourceEndpoints: Record<ImportedMasterDataSource, string> = {
  safetyReporting: apiEndpoints.importedMasterData.safetyReporting,
  measuringPoints: apiEndpoints.importedMasterData.measuringPoints,
  meterCounters: apiEndpoints.importedMasterData.meterCounters,
  kaizen: apiEndpoints.importedMasterData.kaizen,
};

export function updateImportedMasterData(source: ImportedMasterDataSource, id: string, payload: UpdateImportedMasterDataPayload) {
  return apiRequest<ImportedMasterDataItem>(`${sourceEndpoints[source]}/${id}`, {
    method: "PATCH",
    body: payload,
  });
}

export function deleteImportedMasterData(source: ImportedMasterDataSource, id: string) {
  return apiRequest<{ id: string }>(`${sourceEndpoints[source]}/${id}`, {
    method: "DELETE",
  });
}

export function useUpdateImportedMasterData(source: ImportedMasterDataSource) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateImportedMasterDataPayload }) =>
      updateImportedMasterData(source, id, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: importedMasterDataKeys.all }),
  });
}

export function useDeleteImportedMasterData(source: ImportedMasterDataSource) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteImportedMasterData(source, id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: importedMasterDataKeys.all }),
  });
}
