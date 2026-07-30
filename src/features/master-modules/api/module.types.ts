import type { PaginationMeta } from "@/features/master-admins/api/admin.types";

export type ModuleFieldSourceType = "system" | "ai" | "master" | "manual" | "computed";
export type ModuleFieldSourceKey =
  | "equipment_master"
  | "issue_categories"
  | "safety_reporting"
  | "measuring_points"
  | "meter_counters"
  | "users_roles"
  | "sections_locations_shift"
  | "kaizen";

export type ModuleField = {
  id: string;
  moduleId: string;
  label: string;
  key: string;
  type: string;
  required: boolean;
  aiExtract: boolean;
  sourceType: ModuleFieldSourceType;
  sourceKey: ModuleFieldSourceKey | null;
  feedVisible: boolean;
  reportVisible: boolean;
  validationRules: Record<string, unknown> | null;
  sortOrder: number;
  options: string[] | null;
  createdAt: string;
  updatedAt: string;
};

export type ModuleListItem = {
  id: string;
  name: string;
  slug: string;
  moduleTypeId: string;
  type: string;
  category: string;
  status: string;
  availabilityText: string;
  icon: string;
  color: string;
  mediaUrl: string | null;
  mediaKey: string | null;
  description: string | null;
  voiceEnabled: boolean;
  feedEnabled: boolean;
  feedOnlyOnAlert: boolean;
  requiresVoicePlayback: boolean;
  maxAttachments: number;
  fieldsCount: number;
  createdAt: string;
  updatedAt: string;
};

export type ModuleDetail = ModuleListItem & {
  promptPreview: string | null;
  fields: ModuleField[];
};

export type ModuleListParams = {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  moduleTypeId?: string;
};

export type CreateModulePayload = {
  name: string;
  moduleTypeId: string;
  category: string;
  status: string;
  availabilityText: string;
  icon: string;
  color: string;
  description?: string;
  mediaUrl?: string | null;
  mediaKey?: string | null;
  promptPreview?: string;
  voiceEnabled?: boolean;
  feedEnabled?: boolean;
  feedOnlyOnAlert?: boolean;
  requiresVoicePlayback?: boolean;
  maxAttachments?: number;
  fields?: Array<{
    label: string;
    key: string;
    type: string;
    required: boolean;
    aiExtract: boolean;
    sourceType?: ModuleFieldSourceType;
    sourceKey?: ModuleFieldSourceKey | null;
    feedVisible?: boolean;
    reportVisible?: boolean;
    validationRules?: Record<string, unknown> | null;
    sortOrder: number;
    options?: string[];
  }>;
};

export type UpdateModulePayload = Omit<CreateModulePayload, "fields">;
export type CreateModuleFieldPayload = NonNullable<CreateModulePayload["fields"]>[number];
export type UpdateModuleFieldPayload = Partial<CreateModuleFieldPayload>;
export type ModuleListMeta = PaginationMeta;
