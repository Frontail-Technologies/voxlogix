import { useQuery } from "@tanstack/react-query";

import { adminEquipmentManualKeys } from "@/features/admin-equipment-manuals/api/equipment-manual.keys";
import type {
  EquipmentManualDetail,
  EquipmentManualListItem,
  EquipmentManualListParams,
  PaginationMeta,
} from "@/features/admin-equipment-manuals/api/equipment-manual.types";
import { apiRequest } from "@/lib/api/client";
import { apiEndpoints } from "@/lib/api/endpoints";
import { detailQueryOptions, listQueryOptions } from "@/lib/api/query-options";

function queryString(params: Record<string, unknown>) {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      searchParams.set(key, String(value));
    }
  });
  const query = searchParams.toString();
  return query ? `?${query}` : "";
}

export function getEquipmentManuals(params: EquipmentManualListParams = {}) {
  return apiRequest<EquipmentManualListItem[], PaginationMeta>(
    `${apiEndpoints.equipmentManuals.root}${queryString(params)}`,
  );
}

export function getEquipmentManualById(manualId: string) {
  return apiRequest<EquipmentManualDetail>(apiEndpoints.equipmentManuals.byId(manualId));
}

export function useEquipmentManualsList(params: EquipmentManualListParams = {}) {
  return useQuery({
    queryKey: adminEquipmentManualKeys.list(params),
    queryFn: () => getEquipmentManuals(params),
    ...listQueryOptions,
  });
}

export function useEquipmentManualDetail(manualId: string) {
  return useQuery({
    queryKey: adminEquipmentManualKeys.detail(manualId),
    queryFn: () => getEquipmentManualById(manualId),
    enabled: Boolean(manualId),
    ...detailQueryOptions,
  });
}