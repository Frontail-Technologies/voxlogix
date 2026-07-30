export const adminDashboardKeys = {
  all: ["admin-dashboard"] as const,
  summary: () => [...adminDashboardKeys.all, "summary"] as const,
};
