import { useMutation, useQueryClient } from "@tanstack/react-query";

import { moduleKeys } from "@/features/master-modules/api/module.keys";
import type {
  CreateModuleFieldPayload,
  CreateModulePayload,
  UpdateModuleFieldPayload,
  UpdateModulePayload,
} from "@/features/master-modules/api/module.types";
import { apiRequest } from "@/lib/api/client";
import { apiEndpoints } from "@/lib/api/endpoints";

export async function createModule(payload: CreateModulePayload | FormData) {
  return apiRequest(apiEndpoints.modules.root, {
    method: "POST",
    body: payload,
  });
}

export async function updateModule(moduleId: string, payload: UpdateModulePayload | FormData) {
  return apiRequest(apiEndpoints.modules.byId(moduleId), {
    method: "PATCH",
    body: payload,
  });
}

export async function deleteModule(moduleId: string) {
  return apiRequest(apiEndpoints.modules.byId(moduleId), {
    method: "DELETE",
  });
}

export async function createModuleField(
  moduleId: string,
  payload: CreateModuleFieldPayload,
) {
  return apiRequest(apiEndpoints.modules.fields(moduleId), {
    method: "POST",
    body: payload,
  });
}

export async function updateModuleField(
  moduleId: string,
  fieldId: string,
  payload: UpdateModuleFieldPayload,
) {
  return apiRequest(apiEndpoints.modules.fieldById(moduleId, fieldId), {
    method: "PATCH",
    body: payload,
  });
}

export async function deleteModuleField(moduleId: string, fieldId: string) {
  return apiRequest(apiEndpoints.modules.fieldById(moduleId, fieldId), {
    method: "DELETE",
  });
}

export function useCreateModule() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createModule,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: moduleKeys.all });
    },
  });
}

export function useUpdateModule(moduleId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateModulePayload | FormData) => updateModule(moduleId, payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: moduleKeys.all });
    },
  });
}

export function useDeleteModule() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteModule,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: moduleKeys.all });
    },
  });
}

export function useCreateModuleField(moduleId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateModuleFieldPayload) =>
      createModuleField(moduleId, payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: moduleKeys.detail(moduleId) });
    },
  });
}

export function useUpdateModuleField(moduleId: string, fieldId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateModuleFieldPayload) =>
      updateModuleField(moduleId, fieldId, payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: moduleKeys.detail(moduleId) });
    },
  });
}

export function useDeleteModuleField(moduleId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (fieldId: string) => deleteModuleField(moduleId, fieldId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: moduleKeys.detail(moduleId) });
    },
  });
}

