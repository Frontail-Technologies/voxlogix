export const activityKeys = {
  all: ["master-activities"] as const,
  list: (params: Record<string, unknown> = {}) => [...activityKeys.all, "list", params] as const,
};
