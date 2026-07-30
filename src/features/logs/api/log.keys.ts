export const adminLogKeys = {
  all: ["admin-logs"] as const,
  list: (params: Record<string, unknown> = {}) => [...adminLogKeys.all, "list", params] as const,
  detail: (logId: string) => [...adminLogKeys.all, "detail", logId] as const,
};
