import { useMutation, useQueryClient } from "@tanstack/react-query";

import { settingsKeys } from "@/features/master-settings/api/settings.keys";
import type {
  AiProviderConfig,
  CreateAiProviderConfigPayload,
  GeneralSettings,
  UpdateAiProviderConfigPayload,
  UpdateGeneralSettingsPayload,
} from "@/features/master-settings/api/settings.types";
import { apiRequest } from "@/lib/api/client";
import { apiEndpoints } from "@/lib/api/endpoints";

export function updateGeneralSettings(payload: UpdateGeneralSettingsPayload | FormData) {
  return apiRequest<GeneralSettings>(apiEndpoints.settings.general, {
    method: "PATCH",
    body: payload,
  });
}

export function createAiProviderConfig(payload: CreateAiProviderConfigPayload) {
  return apiRequest<AiProviderConfig>(apiEndpoints.settings.ai, {
    method: "POST",
    body: payload,
  });
}

export function updateAiProviderConfig(configId: string, payload: UpdateAiProviderConfigPayload) {
  return apiRequest<AiProviderConfig>(apiEndpoints.settings.aiById(configId), {
    method: "PATCH",
    body: payload,
  });
}

export function deleteAiProviderConfig(configId: string) {
  return apiRequest<{ id: string }>(apiEndpoints.settings.aiById(configId), {
    method: "DELETE",
  });
}

export function setAiProviderConfigDefault(configId: string) {
  return apiRequest<AiProviderConfig>(apiEndpoints.settings.aiDefault(configId), {
    method: "PATCH",
  });
}

export function useUpdateGeneralSettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateGeneralSettings,
    onSuccess: async (response) => {
      queryClient.setQueryData(settingsKeys.general(), response);
      await queryClient.invalidateQueries({ queryKey: settingsKeys.general() });
    },
  });
}

export function useCreateAiProviderConfig() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createAiProviderConfig,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: settingsKeys.ai() }),
  });
}

export function useUpdateAiProviderConfig(configId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateAiProviderConfigPayload) => updateAiProviderConfig(configId, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: settingsKeys.ai() }),
  });
}

export function useDeleteAiProviderConfig() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteAiProviderConfig,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: settingsKeys.ai() }),
  });
}

export function useSetAiProviderConfigDefault() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: setAiProviderConfigDefault,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: settingsKeys.ai() }),
  });
}
