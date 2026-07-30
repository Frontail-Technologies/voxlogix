import type { AdminListParams } from "@/features/master-admins/api/admin.types";

export const adminKeys = {
  all: ["master-admins"] as const,
  lists: () => [...adminKeys.all, "list"] as const,
  list: (params: AdminListParams) => [...adminKeys.lists(), params] as const,
  details: () => [...adminKeys.all, "detail"] as const,
  detail: (adminId: string) => [...adminKeys.details(), adminId] as const,
  companyOptions: () => [...adminKeys.all, "company-options"] as const,
};
