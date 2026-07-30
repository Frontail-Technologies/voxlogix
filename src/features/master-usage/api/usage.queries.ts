import { useQuery } from "@tanstack/react-query";

import { buildSearchParams } from "@/features/master-companies/api/company.queries";
import { usageKeys } from "@/features/master-usage/api/usage.keys";
import type { UsageCompaniesMeta, UsageCompaniesParams, UsageCompanyDetail, UsageCompanyRow, UsageDateScope, UsageOverview, UsagePeriod } from "@/features/master-usage/api/usage.types";
import { apiRequest } from "@/lib/api/client";
import { apiEndpoints } from "@/lib/api/endpoints";
import { detailQueryOptions, listQueryOptions } from "@/lib/api/query-options";

function normalizeUsageScope(scope?: UsagePeriod | UsageDateScope) {
  return typeof scope === "string" ? { period: scope } : (scope ?? {});
}

export function getUsageOverview(scope?: UsagePeriod | UsageDateScope) {
  return apiRequest<UsageOverview>(`${apiEndpoints.aiUsage.overview}${buildSearchParams(normalizeUsageScope(scope))}`);
}
export function getUsageCompanies(params: UsageCompaniesParams = {}) {
  return apiRequest<UsageCompanyRow[], UsageCompaniesMeta>(`${apiEndpoints.aiUsage.companies}${buildSearchParams(params)}`);
}
export function getUsageCompany(companyId: string, scope?: UsagePeriod | UsageDateScope) {
  return apiRequest<UsageCompanyDetail>(`${apiEndpoints.aiUsage.companyById(companyId)}${buildSearchParams(normalizeUsageScope(scope))}`);
}
export function useUsageOverview(scope?: UsagePeriod | UsageDateScope) {
  return useQuery({ queryKey: usageKeys.overview(normalizeUsageScope(scope)), queryFn: () => getUsageOverview(scope), ...detailQueryOptions });
}
export function useUsageCompanies(params: UsageCompaniesParams = {}) {
  return useQuery({ queryKey: usageKeys.companies(params), queryFn: () => getUsageCompanies(params), ...listQueryOptions });
}
export function useUsageCompany(companyId: string, scope?: UsagePeriod | UsageDateScope) {
  return useQuery({ queryKey: usageKeys.company(companyId, normalizeUsageScope(scope)), queryFn: () => getUsageCompany(companyId, scope), enabled: Boolean(companyId), ...detailQueryOptions });
}
