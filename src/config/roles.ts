export const USER_ROLES = ["master", "admin", "planner", "execution"] as const;

export type UserRole = (typeof USER_ROLES)[number];

export const ROLE_LABELS: Record<UserRole, string> = {
  master: "Master",
  admin: "Admin / Owner",
  planner: "Planner",
  execution: "Execution",
};
