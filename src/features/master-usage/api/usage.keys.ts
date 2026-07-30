export const usageKeys = {
  all: ["master-usage"] as const,
  overview: (params?: Record<string, unknown> | string) => [...usageKeys.all, "overview", params] as const,
  companies: (params: Record<string, unknown> = {}) => [...usageKeys.all, "companies", params] as const,
  company: (companyId: string, params?: Record<string, unknown> | string) => [...usageKeys.all, "company", companyId, params] as const,
};
