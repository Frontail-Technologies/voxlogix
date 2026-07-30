export const adminUserKeys = {
  all: ["admin-users"] as const,
  list: (params: Record<string, unknown> = {}) => [...adminUserKeys.all, "list", params] as const,
};
