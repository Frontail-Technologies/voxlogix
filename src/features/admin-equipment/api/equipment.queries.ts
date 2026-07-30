import type { QueryClient } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";

import { adminEquipmentKeys } from "@/features/admin-equipment/api/equipment.keys";
import type { EquipmentDetail, EquipmentListItem, EquipmentListParams } from "@/features/admin-equipment/api/equipment.types";
import type { PaginationMeta } from "@/features/master-admins/api/admin.types";
import { apiRequest } from "@/lib/api/client";
import { apiEndpoints } from "@/lib/api/endpoints";
import { detailQueryOptions, listQueryOptions } from "@/lib/api/query-options";

function queryString(params: Record<string, unknown>) {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") searchParams.set(key, String(value));
  });
  const query = searchParams.toString();
  return query ? `?${query}` : "";
}

export function getEquipment(params: EquipmentListParams = {}) {
  return apiRequest<EquipmentListItem[], PaginationMeta>(`${apiEndpoints.equipment.root}${queryString(params)}`);
}

export function getEquipmentById(equipmentId: string) {
  return apiRequest<EquipmentDetail>(apiEndpoints.equipment.byId(equipmentId));
}

export function useEquipmentList(params: EquipmentListParams = {}) {
  return useQuery({ queryKey: adminEquipmentKeys.list(params), queryFn: () => getEquipment(params), ...listQueryOptions });
}

export function useEquipmentDetail(equipmentId: string) {
  return useQuery({ queryKey: adminEquipmentKeys.detail(equipmentId), queryFn: () => getEquipmentById(equipmentId), enabled: Boolean(equipmentId), ...detailQueryOptions });
}

export function prefetchEquipmentDetail(queryClient: QueryClient, equipmentId: string) {
  return queryClient.prefetchQuery({ queryKey: adminEquipmentKeys.detail(equipmentId), queryFn: () => getEquipmentById(equipmentId), ...detailQueryOptions });
}
