import { useQuery } from "@tanstack/react-query";

import { settingsKeys } from "@/features/master-settings/api/settings.keys";
import type { AiProviderConfig, GeneralSettings } from "@/features/master-settings/api/settings.types";
import { apiRequest } from "@/lib/api/client";
import { apiEndpoints } from "@/lib/api/endpoints";
import { referenceQueryOptions } from "@/lib/api/query-options";

export function getGeneralSettings() {
  return apiRequest<GeneralSettings>(apiEndpoints.settings.general);
}
export function useGeneralSettings() {
  return useQuery({ queryKey: settingsKeys.general(), queryFn: getGeneralSettings, ...referenceQueryOptions });
}

export function getAiProviderConfigs() {
  return apiRequest<AiProviderConfig[]>(apiEndpoints.settings.ai);
}
export function useAiProviderConfigs() {
  return useQuery({ queryKey: settingsKeys.ai(), queryFn: getAiProviderConfigs, ...referenceQueryOptions });
}
