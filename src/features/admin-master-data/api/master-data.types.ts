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
  skipped: number;
  errors: string[];
};

export type MasterDataImportResult = {
  fileName: string;
  sheets: MasterDataImportSheetSummary[];
};

export type { PaginationMeta };

