import type { ModuleFieldSourceKey } from "@/features/master-modules/api/module.types";

export type MasterDataOption = {
  value: string;
  label: string;
  meta?: Record<string, unknown>;
};

export type MasterDataOptionsParams = {
  sourceKey: ModuleFieldSourceKey | null;
  fieldKey?: string;
};
