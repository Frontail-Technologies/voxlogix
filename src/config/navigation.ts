import type { AppIconName } from "@/components/common/app-icon";
import type { UserRole } from "@/config/roles";

export type NavItem = {
  title: string;
  href: string;
  icon: AppIconName;
  requiredModules?: string[];
};

export const ROLE_NAVIGATION: Record<UserRole, NavItem[]> = {
  master: [
    { title: "Dashboard", href: "/master/dashboard", icon: "dashboard" },
    { title: "Companies", href: "/master/companies", icon: "companies" },
    { title: "Admins", href: "/master/admins", icon: "admins" },
    { title: "Modules", href: "/master/modules", icon: "modules" },
    { title: "AI Usage", href: "/master/usage", icon: "ai" },
    { title: "Activities", href: "/master/activities", icon: "activity" },
    { title: "Reports", href: "/master/reports", icon: "reports" },
    { title: "Settings", href: "/master/settings", icon: "settings" },
  ],
  admin: [
    { title: "Dashboard", href: "/admin/dashboard", icon: "dashboard" },
    { title: "Logs", href: "/admin/logs", icon: "logs" },
    { title: "Master Data", href: "/admin/master-data", icon: "upload" },
    { title: "Equipment", href: "/admin/equipment", icon: "equipment", requiredModules: ["equipment log"] },
    { title: "Issue Categories", href: "/admin/issue-categories", icon: "warning" },
    { title: "Equipment Categories", href: "/admin/equipment-categories", icon: "package" },
    { title: "Safety Data", href: "/admin/safety-reporting", icon: "permissions", requiredModules: ["safety log"] },
    { title: "Measuring Points", href: "/admin/measuring-points", icon: "activity", requiredModules: ["measurement point"] },
    { title: "Meter Counters", href: "/admin/meter-counters", icon: "database", requiredModules: ["meter counter"] },
    { title: "Kaizen", href: "/admin/kaizen", icon: "ai", requiredModules: ["kaizen"] },
    { title: "Locations & Shifts", href: "/admin/locations", icon: "planning" },
    { title: "Users", href: "/admin/users", icon: "users" },
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
    { title: "AI Chat", href: "/execution/ai-chat", icon: "ai" },
    { title: "Profile", href: "/execution/profile", icon: "profile" },
  ],
};




