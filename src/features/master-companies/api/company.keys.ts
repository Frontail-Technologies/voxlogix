export const companyKeys = {
  all: ["master-companies"] as const,
  list: (params: Record<string, unknown> = {}) => [...companyKeys.all, "list", params] as const,
  detail: (companyId: string) => [...companyKeys.all, "detail", companyId] as const,
  access: (companyId: string) => [...companyKeys.all, "access", companyId] as const,
};
