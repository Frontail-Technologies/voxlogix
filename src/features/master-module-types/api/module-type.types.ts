import type { PaginationMeta } from "@/features/master-admins/api/admin.types";

export type ModuleType = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  status: string;
  createdAt: string;
  updatedAt: string;
};

export type ModuleTypeListParams = {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
};

export type CreateModuleTypePayload = {
  name: string;
  description?: string;
  status: string;
};

export type UpdateModuleTypePayload = Partial<CreateModuleTypePayload>;
export type ModuleTypeListMeta = PaginationMeta;
