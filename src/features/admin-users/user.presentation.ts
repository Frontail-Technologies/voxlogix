import type { AdminListItem } from "@/features/master-admins/api/admin.types";

export const adminUserRoles = [
  { value: "PLANNER", label: "Planner" },
  { value: "EXECUTION", label: "Execution" },
] as const;

export const adminUserStatuses = [
  { value: "ACTIVE", label: "Active" },
  { value: "INACTIVE", label: "Inactive" },
  { value: "SUSPENDED", label: "Suspended" },
] as const;

export function normalizeAdminUserValue(value?: string | null) {
  return String(value ?? "")
    .trim()
    .replace(/[\s-]+/g, "_")
    .toUpperCase();
}

export function adminUserLabel(value?: string | null) {
  const normalized = normalizeAdminUserValue(value);

  if (!normalized) return "-";

  return normalized
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

export function formatAdminUserDate(value?: string | null) {
  if (!value) return "-";

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

export function adminUserInitials(user: Pick<AdminListItem, "initials" | "fullName">) {
  return user.initials || user.fullName.split(/\s+/).slice(0, 2).map((part) => part[0]).join("").toUpperCase() || "US";
}
