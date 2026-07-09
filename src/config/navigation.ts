import type { AppIconName } from "@/components/common/app-icon";
import type { UserRole } from "@/config/roles";

export type NavItem = {
  title: string;
  href: string;
  icon: AppIconName;
};

export const ROLE_NAVIGATION: Record<UserRole, NavItem[]> = {
  master: [
    { title: "Dashboard", href: "/master/dashboard", icon: "dashboard" },
    { title: "Companies", href: "/master/companies", icon: "companies" },
    { title: "Admins", href: "/master/admins", icon: "admins" },
    { title: "Modules", href: "/master/modules", icon: "modules" },
    { title: "AI Usage", href: "/master/usage", icon: "ai" },
    { title: "Activities", href: "/master/activities", icon: "activity" },
    { title: "Settings", href: "/master/settings", icon: "settings" },
  ],
  admin: [
    { title: "Dashboard", href: "/admin/dashboard", icon: "dashboard" },
    { title: "Create Log", href: "/admin/create-log", icon: "voice" },
    { title: "Logs", href: "/admin/logs", icon: "logs" },
    { title: "Equipment", href: "/admin/equipment", icon: "equipment" },
    { title: "Modules", href: "/admin/modules", icon: "modules" },
    { title: "Users", href: "/admin/executions", icon: "users" },
    { title: "Locations", href: "/admin/locations", icon: "database" },
    { title: "Reports", href: "/admin/reports", icon: "reports" },
    { title: "Settings", href: "/admin/settings", icon: "settings" },
  ],
  planner: [
    { title: "Dashboard", href: "/planner/dashboard", icon: "dashboard" },
    { title: "Assigned Logs", href: "/planner/assigned-logs", icon: "logs" },
    { title: "Submitted Logs", href: "/planner/submitted-logs", icon: "status" },
    { title: "Planned Logs", href: "/planner/planned-logs", icon: "planning" },
    { title: "Profile", href: "/planner/profile", icon: "profile" },
  ],
  execution: [
    { title: "Dashboard", href: "/execution/dashboard", icon: "dashboard" },
    { title: "Create Log", href: "/execution/create-log", icon: "voice" },
    { title: "My Logs", href: "/execution/my-logs", icon: "logs" },
    { title: "Profile", href: "/execution/profile", icon: "profile" },
  ],
};
