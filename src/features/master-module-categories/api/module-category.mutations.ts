import { useMutation, useQueryClient } from "@tanstack/react-query";

import { moduleCategoryKeys } from "@/features/master-module-categories/api/module-category.keys";
import type {
  CreateModuleCategoryPayload,
  ModuleCategory,
  UpdateModuleCategoryPayload,
} from "@/features/master-module-categories/api/module-category.types";
import { apiRequest } from "@/lib/api/client";
import { apiEndpoints } from "@/lib/api/endpoints";

export function createModuleCategory(payload: CreateModuleCategoryPayload) {
  return apiRequest<ModuleCategory>(apiEndpoints.moduleCategories.root, {
    method: "POST",
    body: payload,
  });
}

export function updateModuleCategory(
  moduleCategoryId: string,
  payload: UpdateModuleCategoryPayload,
) {
  return apiRequest<ModuleCategory>(apiEndpoints.moduleCategories.byId(moduleCategoryId), {
    method: "PATCH",
    body: payload,
  });
}

export function deleteModuleCategory(moduleCategoryId: string) {
  return apiRequest<{ id: string }>(apiEndpoints.moduleCategories.byId(moduleCategoryId), {
    method: "DELETE",
  });
}

export function useCreateModuleCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createModuleCategory,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: moduleCategoryKeys.all }),
  });
}

export function useUpdateModuleCategory(moduleCategoryId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateModuleCategoryPayload) =>
      updateModuleCategory(moduleCategoryId, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: moduleCategoryKeys.all }),
  });
}

export function useDeleteModuleCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteModuleCategory,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: moduleCategoryKeys.all }),
  });
}
