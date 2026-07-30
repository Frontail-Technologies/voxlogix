import type { QueryClient } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";

import { companyKeys } from "@/features/master-companies/api/company.keys";
import type { CompanyAccess, CompanyDetail, CompanyListItem, CompanyListMeta, CompanyListParams } from "@/features/master-companies/api/company.types";
import { apiRequest } from "@/lib/api/client";
import { apiEndpoints } from "@/lib/api/endpoints";
import { detailQueryOptions, listQueryOptions } from "@/lib/api/query-options";

export function buildSearchParams(params: Record<string, unknown>) {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") searchParams.set(key, String(value));
  });
  const query = searchParams.toString();
  return query ? `?${query}` : "";
}

export function getCompanies(params: CompanyListParams = {}) {
  return apiRequest<CompanyListItem[], CompanyListMeta>(`${apiEndpoints.companies.root}${buildSearchParams(params)}`);
}
export function getCompanyById(companyId: string) {
  return apiRequest<CompanyDetail>(apiEndpoints.companies.byId(companyId));
}
export function getCompanyAccess(companyId: string) {
  return apiRequest<CompanyAccess>(apiEndpoints.companies.access(companyId));
}
export function useCompaniesList(params: CompanyListParams = {}) {
  return useQuery({ queryKey: companyKeys.list(params), queryFn: () => getCompanies(params), ...listQueryOptions });
}
export function useCompanyDetail(companyId: string) {
  return useQuery({ queryKey: companyKeys.detail(companyId), queryFn: () => getCompanyById(companyId), enabled: Boolean(companyId), ...detailQueryOptions });
}
export function useCompanyAccess(companyId: string) {
  return useQuery({ queryKey: companyKeys.access(companyId), queryFn: () => getCompanyAccess(companyId), enabled: Boolean(companyId), ...detailQueryOptions });
}
export function prefetchCompanyDetail(queryClient: QueryClient, companyId: string) {
  return queryClient.prefetchQuery({ queryKey: companyKeys.detail(companyId), queryFn: () => getCompanyById(companyId), ...detailQueryOptions });
}
