import { useMutation, useQueryClient } from "@tanstack/react-query";

import { adminMasterDataKeys } from "@/features/admin-master-data/api/master-data.keys";
import type {
  CommitSheetInput,
  EquipmentCategoryItem,
  EquipmentCategoryPayload,
  IssueCategoryItem,
  IssueCategoryPayload,
  LocationItem,
  LocationPayload,
  MasterDataImportPreview,
  MasterDataImportResult,
} from "@/features/admin-master-data/api/master-data.types";
import { adminEquipmentKeys } from "@/features/admin-equipment/api/equipment.keys";
import { adminUserKeys } from "@/features/admin-users/api/user.keys";
import { apiRequest } from "@/lib/api/client";
import { apiEndpoints } from "@/lib/api/endpoints";

export function createLocation(payload: LocationPayload) {
  return apiRequest<LocationItem>(apiEndpoints.locations.root, {
    method: "POST",
    body: payload,
  });
}

export function updateLocation(locationId: string, payload: Partial<LocationPayload>) {
  return apiRequest<LocationItem>(apiEndpoints.locations.byId(locationId), {
    method: "PATCH",
    body: payload,
  });
}

export function deleteLocation(locationId: string) {
  return apiRequest<{ id: string }>(apiEndpoints.locations.byId(locationId), {
    method: "DELETE",
  });
}

export function createIssueCategory(payload: IssueCategoryPayload) {
  return apiRequest<IssueCategoryItem>(apiEndpoints.issueCategories.root, {
    method: "POST",
    body: payload,
  });
}

export function updateIssueCategory(
  issueCategoryId: string,
  payload: Partial<IssueCategoryPayload>,
) {
  return apiRequest<IssueCategoryItem>(
    apiEndpoints.issueCategories.byId(issueCategoryId),
    { method: "PATCH", body: payload },
  );
}

export function deleteIssueCategory(issueCategoryId: string) {
  return apiRequest<{ id: string }>(
    apiEndpoints.issueCategories.byId(issueCategoryId),
    { method: "DELETE" },
  );
}

export function createEquipmentCategory(payload: EquipmentCategoryPayload) {
  return apiRequest<EquipmentCategoryItem>(apiEndpoints.equipmentCategories.root, {
    method: "POST",
    body: payload,
  });
}

export function updateEquipmentCategory(
  equipmentCategoryId: string,
  payload: Partial<EquipmentCategoryPayload>,
) {
  return apiRequest<EquipmentCategoryItem>(
    apiEndpoints.equipmentCategories.byId(equipmentCategoryId),
    { method: "PATCH", body: payload },
  );
}

export function deleteEquipmentCategory(equipmentCategoryId: string) {
  return apiRequest<{ id: string }>(
    apiEndpoints.equipmentCategories.byId(equipmentCategoryId),
    { method: "DELETE" },
  );
}

// Phase 1: upload + parse + validate only. Never writes to the database — see
// buildMasterDataImportPreview on the backend. The reviewer edits/removes rows against this
// result, then sends the confirmed rows to commitMasterDataImport below.
export function previewMasterDataImport(file: File) {
  const formData = new FormData();
  formData.append("file", file);

  return apiRequest<MasterDataImportPreview>(apiEndpoints.masterDataImports.preview, {
    method: "POST",
    body: formData,
    timeoutMs: 120_000,
  });
}

// Phase 2: write the reviewer-confirmed rows. The server re-validates everything (module
// enablement especially) against the authenticated company — this payload is never trusted
// as-is, so an edited/tampered client state can't bypass server-side rules.
export function commitMasterDataImportRequest(sheets: CommitSheetInput[]) {
  return apiRequest<MasterDataImportResult>(apiEndpoints.masterDataImports.commit, {
    method: "POST",
    body: { sheets },
    timeoutMs: 120_000,
  });
}

export function useCreateEquipmentCategory() {
  const queryClient = useQueryClient();
  return useMutation({ mutationFn: createEquipmentCategory, onSuccess: () => queryClient.invalidateQueries({ queryKey: adminMasterDataKeys.all }) });
}

export function useUpdateEquipmentCategory(equipmentCategoryId: string) {
  const queryClient = useQueryClient();
  return useMutation({ mutationFn: (payload: Partial<EquipmentCategoryPayload>) => updateEquipmentCategory(equipmentCategoryId, payload), onSuccess: () => queryClient.invalidateQueries({ queryKey: adminMasterDataKeys.all }) });
}

export function useDeleteEquipmentCategory() {
  const queryClient = useQueryClient();
  return useMutation({ mutationFn: deleteEquipmentCategory, onSuccess: () => queryClient.invalidateQueries({ queryKey: adminMasterDataKeys.all }) });
}

export function useCreateLocation() {
  const queryClient = useQueryClient();
  return useMutation({ mutationFn: createLocation, onSuccess: () => queryClient.invalidateQueries({ queryKey: adminMasterDataKeys.all }) });
}

export function useUpdateLocation(locationId: string) {
  const queryClient = useQueryClient();
  return useMutation({ mutationFn: (payload: Partial<LocationPayload>) => updateLocation(locationId, payload), onSuccess: () => queryClient.invalidateQueries({ queryKey: adminMasterDataKeys.all }) });
}

export function useDeleteLocation() {
  const queryClient = useQueryClient();
  return useMutation({ mutationFn: deleteLocation, onSuccess: () => queryClient.invalidateQueries({ queryKey: adminMasterDataKeys.all }) });
}

export function useCreateIssueCategory() {
  const queryClient = useQueryClient();
  return useMutation({ mutationFn: createIssueCategory, onSuccess: () => queryClient.invalidateQueries({ queryKey: adminMasterDataKeys.all }) });
}

export function useUpdateIssueCategory(issueCategoryId: string) {
  const queryClient = useQueryClient();
  return useMutation({ mutationFn: (payload: Partial<IssueCategoryPayload>) => updateIssueCategory(issueCategoryId, payload), onSuccess: () => queryClient.invalidateQueries({ queryKey: adminMasterDataKeys.all }) });
}

export function useDeleteIssueCategory() {
  const queryClient = useQueryClient();
  return useMutation({ mutationFn: deleteIssueCategory, onSuccess: () => queryClient.invalidateQueries({ queryKey: adminMasterDataKeys.all }) });
}

export function usePreviewMasterDataImport() {
  return useMutation({ mutationFn: previewMasterDataImport });
}

export function useCommitMasterDataImport() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: commitMasterDataImportRequest,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: adminMasterDataKeys.all });
      void queryClient.invalidateQueries({ queryKey: adminEquipmentKeys.all });
      void queryClient.invalidateQueries({ queryKey: adminUserKeys.all });
    },
  });
}
