import type { PaginationMeta } from "@/features/master-admins/api/admin.types";

export type LocationItem = {
  id: string;
  companyId: string;
  plant: string;
  unit: string | null;
  shiftDetails: string | null;
  department: string | null;
  section: string;
  subLocation: string;
  status: string;
  createdAt: string;
  updatedAt: string;
};

export type LocationPayload = {
  plant: string;
  unit?: string | null;
  shiftDetails?: string | null;
  department?: string | null;
  section: string;
  subLocation: string;
  status?: string;
};

export type LocationListParams = {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
};

export type IssueCategoryItem = {
  id: string;
  companyId: string;
  name: string;
  moduleType: string;
  severityDefault: string;
  status: string;
  createdAt: string;
  updatedAt: string;
};

export type IssueCategoryPayload = {
  name: string;
  moduleType?: string;
  severityDefault?: string;
  status?: string;
};

export type IssueCategoryListParams = {
  page?: number;
  limit?: number;
  search?: string;
  moduleType?: string;
  status?: string;
};

export type EquipmentCategoryItem = {
  id: string;
  companyId: string;
  name: string;
  status: string;
  createdAt: string;
  updatedAt: string;
};

export type EquipmentCategoryPayload = {
  name: string;
  status?: string;
};

export type EquipmentCategoryListParams = {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
};

export type MasterDataImportSheetSummary = {
  sheet: string;
  imported: number;
  created: number;
  updated: number;
  unchanged: number;
  skipped: number;
  errors: string[];
};

export type MasterDataImportResult = {
  fileName?: string;
  sheets: MasterDataImportSheetSummary[];
};

// --- Two-phase preview/commit model ---
export type MasterDataSheetKey =
  | "locations"
  | "equipment"
  | "issueCategories"
  | "safety"
  | "measuringPoints"
  | "meterCounters"
  | "users"
  | "kaizen";

export type PreviewRowStatus = "accepted" | "rejected";

export type PreviewRowErrorCode =
  | "REQUIRED"
  | "DUPLICATE"
  | "INVALID_FORMAT"
  | "UNKNOWN_REFERENCE"
  | "MODULE_DISABLED";

export type PreviewRowError = {
  field: string;
  code: PreviewRowErrorCode;
  message: string;
};

export type PreviewRow = {
  previewId: string;
  status: PreviewRowStatus;
  originalRowNumber: number;
  values: Record<string, string>;
  errors: PreviewRowError[];
};

export type PreviewSheet = {
  key: MasterDataSheetKey;
  label: string;
  moduleEnabled: boolean;
  gatingModule: string | null;
  rows: PreviewRow[];
  counts: {
    total: number;
    accepted: number;
    rejected: number;
  };
};

export type MasterDataImportPreview = {
  fileName?: string;
  summary: {
    // Only ever reflects enabled/importable sheets — disabled-module rows are excluded
    // from the response entirely, not counted as "rejected".
    total: number;
    accepted: number;
    rejected: number;
  };
  // Disabled-module sheets are never included here.
  sheets: PreviewSheet[];
  ignoredSheetCount: number;
};

export type CommitSheetInput = {
  key: MasterDataSheetKey;
  rows: Array<{ previewId: string; values: Record<string, string> }>;
};

export type { PaginationMeta };

