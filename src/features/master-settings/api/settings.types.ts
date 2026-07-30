export type AiProviderConfig = {
  id: string;
  provider: string;
  defaultModel: string;
  apiKeyName: string;
  apiKey: string;
  keyStatus: string;
  isDefault: boolean;
  structuredExtractionEnabled: boolean;
  usageCostAlertsEnabled: boolean;
  createdAt: string;
  updatedAt: string;
};
export type CreateAiProviderConfigPayload = Omit<AiProviderConfig, "id" | "createdAt" | "updatedAt" | "isDefault"> & {
  isDefault?: boolean;
};
export type UpdateAiProviderConfigPayload = Partial<CreateAiProviderConfigPayload>;

export type GeneralSettings = {
  id: string;
  platformName: string;
  logoUrl: string | null;
  logoKey: string | null;
  maintenanceModeEnabled: boolean;
  maintenanceMessage: string;
  createdAt: string;
  updatedAt: string;
};
export type UpdateGeneralSettingsPayload = Partial<Omit<GeneralSettings, "id" | "createdAt" | "updatedAt">>;