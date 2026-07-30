import type { PaginationMeta } from "@/features/master-admins/api/admin.types";

export type PlatformActivity = {
  id: string;
  event: string;
  area: string;
  company: { id: string | null; name: string };
  user: string;
  action: string;
  status: string;
  occurredAt: string;
};
export type ActivityListParams = { page?: number; limit?: number; search?: string; area?: string; action?: string; status?: string };
export type ActivityListMeta = PaginationMeta;
