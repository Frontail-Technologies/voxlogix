import type { PaginationMeta } from "@/features/master-admins/api/admin.types";

export type ModuleCategory = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  status: string;
  createdAt: string;
  updatedAt: string;
};

export type ModuleCategoryListParams = {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
};

export type CreateModuleCategoryPayload = {
  name: string;
  description?: string;
  status: string;
};

export type UpdateModuleCategoryPayload = Partial<CreateModuleCategoryPayload>;
export type ModuleCategoryListMeta = PaginationMeta;
