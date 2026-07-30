export const USER_ROLES = ["master", "admin", "planner", "execution"] as const;

export type UserRole = (typeof USER_ROLES)[number];

export const ROLE_LABELS: Record<UserRole, string> = {
  master: "Master",
  admin: "Admin / Owner",
  planner: "Planner",
  execution: "Execution",
};

export const ROLE_SESSION_IDENTITY: Record<UserRole, { name: string; initials: string }> = {
  master: { name: "Master Super", initials: "MS" },
  admin: { name: "Plant Admin", initials: "PA" },
  planner: { name: "Planner Lead", initials: "PL" },
  execution: { name: "Execution User", initials: "EU" },
};
