import type { QueryClient } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";

import { adminMasterDataKeys } from "@/features/admin-master-data/api/master-data.keys";
import type {
  EquipmentCategoryItem,
  EquipmentCategoryListParams,
  IssueCategoryItem,
  IssueCategoryListParams,
  LocationItem,
  LocationListParams,
  PaginationMeta,
} from "@/features/admin-master-data/api/master-data.types";
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

export function getLocations(params: LocationListParams = {}) {
  return apiRequest<LocationItem[], PaginationMeta>(
    `${apiEndpoints.locations.root}${queryString(params)}`,
  );
}

export function getLocationById(locationId: string) {
  return apiRequest<LocationItem>(apiEndpoints.locations.byId(locationId));
}

export function getIssueCategories(params: IssueCategoryListParams = {}) {
  return apiRequest<IssueCategoryItem[], PaginationMeta>(
    `${apiEndpoints.issueCategories.root}${queryString(params)}`,
  );
}

export function getIssueCategoryById(issueCategoryId: string) {
  return apiRequest<IssueCategoryItem>(
    apiEndpoints.issueCategories.byId(issueCategoryId),
  );
}

export function useLocationsList(params: LocationListParams = {}) {
  return useQuery({
    queryKey: adminMasterDataKeys.locations(params),
    queryFn: () => getLocations(params),
    ...listQueryOptions,
  });
}

export function useLocationDetail(locationId: string) {
  return useQuery({
    queryKey: [...adminMasterDataKeys.all, "location", locationId] as const,
    queryFn: () => getLocationById(locationId),
    enabled: Boolean(locationId),
    ...detailQueryOptions,
  });
}

export function useIssueCategoriesList(params: IssueCategoryListParams = {}) {
  return useQuery({
    queryKey: adminMasterDataKeys.issueCategories(params),
    queryFn: () => getIssueCategories(params),
    ...listQueryOptions,
  });
}

export function useIssueCategoryDetail(issueCategoryId: string) {
  return useQuery({
    queryKey: [...adminMasterDataKeys.all, "issue-category", issueCategoryId] as const,
    queryFn: () => getIssueCategoryById(issueCategoryId),
    enabled: Boolean(issueCategoryId),
    ...detailQueryOptions,
  });
}

export function getEquipmentCategories(params: EquipmentCategoryListParams = {}) {
  return apiRequest<EquipmentCategoryItem[], PaginationMeta>(
    `${apiEndpoints.equipmentCategories.root}${queryString(params)}`,
  );
}

export function getEquipmentCategoryById(equipmentCategoryId: string) {
  return apiRequest<EquipmentCategoryItem>(
    apiEndpoints.equipmentCategories.byId(equipmentCategoryId),
  );
}

export function useEquipmentCategoriesList(params: EquipmentCategoryListParams = {}) {
  return useQuery({
    queryKey: adminMasterDataKeys.equipmentCategories(params),
    queryFn: () => getEquipmentCategories(params),
    ...listQueryOptions,
  });
}

export function useEquipmentCategoryDetail(equipmentCategoryId: string) {
  return useQuery({
    queryKey: [...adminMasterDataKeys.all, "equipment-category", equipmentCategoryId] as const,
    queryFn: () => getEquipmentCategoryById(equipmentCategoryId),
    enabled: Boolean(equipmentCategoryId),
    ...detailQueryOptions,
  });
}

export function prefetchEquipmentCategoryDetail(queryClient: QueryClient, equipmentCategoryId: string) {
  return queryClient.prefetchQuery({
    queryKey: [...adminMasterDataKeys.all, "equipment-category", equipmentCategoryId] as const,
    queryFn: () => getEquipmentCategoryById(equipmentCategoryId),
    ...detailQueryOptions,
  });
}

export function prefetchLocationDetail(queryClient: QueryClient, locationId: string) {
  return queryClient.prefetchQuery({
    queryKey: [...adminMasterDataKeys.all, "location", locationId] as const,
    queryFn: () => getLocationById(locationId),
    ...detailQueryOptions,
  });
}

export function prefetchIssueCategoryDetail(queryClient: QueryClient, issueCategoryId: string) {
  return queryClient.prefetchQuery({
    queryKey: [...adminMasterDataKeys.all, "issue-category", issueCategoryId] as const,
    queryFn: () => getIssueCategoryById(issueCategoryId),
    ...detailQueryOptions,
  });
}
