import { useMutation, useQueryClient } from "@tanstack/react-query";

import { moduleTypeKeys } from "@/features/master-module-types/api/module-type.keys";
import type {
  CreateModuleTypePayload,
  ModuleType,
  UpdateModuleTypePayload,
} from "@/features/master-module-types/api/module-type.types";
import { apiRequest } from "@/lib/api/client";
import { apiEndpoints } from "@/lib/api/endpoints";

export function createModuleType(payload: CreateModuleTypePayload) {
  return apiRequest<ModuleType>(apiEndpoints.moduleTypes.root, {
    method: "POST",
    body: payload,
  });
}

export function updateModuleType(moduleTypeId: string, payload: UpdateModuleTypePayload) {
  return apiRequest<ModuleType>(apiEndpoints.moduleTypes.byId(moduleTypeId), {
    method: "PATCH",
    body: payload,
  });
}

export function deleteModuleType(moduleTypeId: string) {
  return apiRequest<{ id: string }>(apiEndpoints.moduleTypes.byId(moduleTypeId), {
    method: "DELETE",
  });
}

export function useCreateModuleType() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createModuleType,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: moduleTypeKeys.all }),
  });
}

export function useUpdateModuleType(moduleTypeId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateModuleTypePayload) => updateModuleType(moduleTypeId, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: moduleTypeKeys.all }),
  });
}

export function useDeleteModuleType() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteModuleType,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: moduleTypeKeys.all }),
  });
}
