import type { UserRole } from "@/config/roles";

export const PERMISSIONS: Record<string, readonly UserRole[]> = {
  managePlatform: ["master"],
  manageCompanies: ["master"],
  manageCompanySettings: ["admin"],
  manageUsers: ["master", "admin"],
  reviewPlannerLogs: ["planner"],
  createLogs: ["admin", "execution"],
  viewOwnLogs: ["execution"],
  viewReports: ["master", "admin"],
  updateLogStatus: ["admin", "planner"],
};

export type PermissionKey = keyof typeof PERMISSIONS;

export function can(role: UserRole, permission: PermissionKey) {
  return PERMISSIONS[permission].includes(role);
}
