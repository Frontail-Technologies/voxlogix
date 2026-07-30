export const executionDashboardKeys = {
  all: ["execution-dashboard"] as const,
  summary: () => [...executionDashboardKeys.all, "summary"] as const,
};
