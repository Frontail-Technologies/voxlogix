import type { AppIconName } from "@/components/common/app-icon";
import type { ColumnConfig, FilterConfig, FilterOption, ReportRow } from "@/components/report-viewer";
import type { MasterReportType } from "@/components/master/reports/master-report-types";
import { getActivities } from "@/features/master-activities/api/activity.queries";
import type { PlatformActivity } from "@/features/master-activities/api/activity.types";
import { getAdmins } from "@/features/master-admins/api/admin.queries";
import type { AdminListItem } from "@/features/master-admins/api/admin.types";
import { getCompanies, getCompanyAccess } from "@/features/master-companies/api/company.queries";
import type { CompanyAccess, CompanyListItem } from "@/features/master-companies/api/company.types";
import { getModuleCategories } from "@/features/master-module-categories/api/module-category.queries";
import { getModuleTypes } from "@/features/master-module-types/api/module-type.queries";
import { getModules } from "@/features/master-modules/api/module.queries";
import type { ModuleListItem } from "@/features/master-modules/api/module.types";
import { getUsageCompanies } from "@/features/master-usage/api/usage.queries";
import type { UsageCompanyRow, UsagePeriod } from "@/features/master-usage/api/usage.types";

export type MasterReportDefinition = {
  type: MasterReportType;
  title: string;
  description: string;
  href: string;
  sourceHref: string;
  icon: AppIconName;
  filters: FilterConfig[];
  columns: ColumnConfig[];
  totals?: string[];
  fetchRows: (filters: Record<string, string | string[]>) => Promise<ReportRow[]>;
};

const ALL = "all";
const REPORT_LIMIT = 100;

const statusOptions: FilterOption[] = [
  { label: "All Statuses", value: ALL },
  { label: "Active", value: "ACTIVE" },
  { label: "Inactive", value: "INACTIVE" },
  { label: "Suspended", value: "SUSPENDED" },
  { label: "Demo", value: "DEMO" },
  { label: "Expired", value: "EXPIRED" },
];

const adminRoleOptions: FilterOption[] = [
  { label: "All Roles", value: ALL },
  { label: "Admins", value: "ADMIN" },
  { label: "Planners", value: "PLANNER" },
  { label: "Execution Users", value: "EXECUTION" },
];

const moduleStatusOptions: FilterOption[] = [
  { label: "All Statuses", value: ALL },
  { label: "Active", value: "ACTIVE" },
  { label: "Inactive", value: "INACTIVE" },
  { label: "Coming Soon", value: "COMING_SOON" },
];

const periodOptions: FilterOption[] = [
  { label: "This Month", value: "THIS_MONTH" },
  { label: "Last Month", value: "LAST_MONTH" },
  { label: "This Quarter", value: "THIS_QUARTER" },
];

const companyStatusFilter: FilterConfig = {
  key: "status",
  label: "Company Status",
  type: "select",
  defaultValue: ALL,
  options: statusOptions,
};

const dateRangeFilter: FilterConfig = {
  key: "dateRange",
  label: "Date Range",
  type: "daterange",
  defaultValue: ["", ""],
};

const adminRoleFilter: FilterConfig = {
  key: "role",
  label: "Role",
  type: "select",
  defaultValue: ALL,
  options: adminRoleOptions,
};

const adminStatusFilter: FilterConfig = {
  key: "status",
  label: "Status",
  type: "select",
  defaultValue: ALL,
  options: statusOptions,
};

const moduleStatusFilter: FilterConfig = {
  key: "status",
  label: "Module Status",
  type: "select",
  defaultValue: ALL,
  options: moduleStatusOptions,
};

const moduleTypeFilter: FilterConfig = {
  key: "moduleTypeId",
  label: "Module Type",
  type: "select",
  defaultValue: ALL,
  options: [{ label: "All Types", value: ALL }],
  fetchOptions: async () => {
    const response = await getModuleTypes({ limit: REPORT_LIMIT, status: "ACTIVE" });
    return [
      { label: "All Types", value: ALL },
      ...(response.data ?? []).map((type) => ({ label: label(type.name), value: type.id })),
    ];
  },
};

const moduleCategoryFilter: FilterConfig = {
  key: "category",
  label: "Category",
  type: "select",
  defaultValue: ALL,
  options: [{ label: "All Categories", value: ALL }],
  fetchOptions: async () => {
    const response = await getModuleCategories({ limit: REPORT_LIMIT, status: "ACTIVE" });
    return [
      { label: "All Categories", value: ALL },
      ...(response.data ?? []).map((category) => ({ label: category.name, value: category.name })),
    ];
  },
};

const usagePeriodFilter: FilterConfig = {
  key: "period",
  label: "Period",
  type: "select",
  defaultValue: "THIS_MONTH",
  options: periodOptions,
};

const activityAreaFilter: FilterConfig = {
  key: "area",
  label: "Area",
  type: "select",
  defaultValue: ALL,
  options: [
    { label: "All Areas", value: ALL },
    { label: "Auth", value: "Auth" },
    { label: "Companies", value: "Companies" },
    { label: "Modules", value: "Modules" },
    { label: "Settings", value: "Settings" },
    { label: "Logs", value: "Logs" },
    { label: "Equipment", value: "Equipment" },
  ],
};

const activityStatusFilter: FilterConfig = {
  key: "status",
  label: "Status",
  type: "select",
  defaultValue: ALL,
  options: [
    { label: "All Statuses", value: ALL },
    { label: "Success", value: "Success" },
    { label: "Warning", value: "Warning" },
    { label: "Failed", value: "Failed" },
  ],
};

function clean(value: string | number | null | undefined) {
  if (value === null || value === undefined || value === "") return "-";
  return String(value);
}

function normalizedFilter(value: string | string[] | undefined) {
  return typeof value === "string" && value !== ALL ? value : undefined;
}

function insideDateRange(dateValue: string, rangeValue: string | string[] | undefined) {
  if (!Array.isArray(rangeValue)) return true;
  const [from, to] = rangeValue;
  if (!from && !to) return true;

  const time = new Date(dateValue).getTime();
  if (from && time < new Date(`${from}T00:00:00`).getTime()) return false;
  if (to && time > new Date(`${to}T23:59:59`).getTime()) return false;
  return true;
}

function formatDate(value: string | null | undefined) {
  if (!value) return "-";
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

function label(value: string) {
  return value
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function yesNo(value: boolean) {
  return value ? "Yes" : "No";
}

function companyRow(company: CompanyListItem): ReportRow {
  return {
    company: company.name,
    owner: company.ownerName,
    email: company.ownerEmail,
    phone: company.ownerPhone,
    businessType: clean(company.businessType),
    plan: label(company.plan),
    status: label(company.status),
    startDate: formatDate(company.startDate),
    expiryDate: formatDate(company.expiryDate),
    createdAt: formatDate(company.createdAt),
  };
}

function adminRow(admin: AdminListItem): ReportRow {
  return {
    name: admin.fullName,
    username: admin.username,
    email: admin.email,
    phone: clean(admin.phone),
    role: label(admin.role),
    status: label(admin.status),
    company: admin.company.name,
    joinedOn: formatDate(admin.joinedOn),
    lastLogin: formatDate(admin.lastLoginAt),
  };
}

function moduleRow(module: ModuleListItem): ReportRow {
  return {
    module: module.name,
    type: label(module.type),
    category: module.category,
    status: label(module.status),
    voiceEnabled: yesNo(module.voiceEnabled),
    feedEnabled: yesNo(module.feedEnabled),
    alertFeedOnly: yesNo(module.feedOnlyOnAlert),
    maxAttachments: module.maxAttachments,
    fields: module.fieldsCount,
    updatedAt: formatDate(module.updatedAt),
  };
}

function usageRow(row: UsageCompanyRow): ReportRow {
  return {
    company: row.company.name,
    aiLogs: row.aiLogs,
    failedRequests: row.failedRequests,
    successRate: row.successRate,
    sharePercentage: row.sharePercentage,
    estimatedCost: row.estimatedCost,
    lastProcessedAt: formatDate(row.lastProcessedAt),
  };
}

function accessRow(company: CompanyListItem, access: CompanyAccess): ReportRow {
  return {
    company: company.name,
    status: label(company.status),
    voiceLogging: yesNo(access.voiceLoggingEnabled),
    aiExtraction: yesNo(access.aiStructuredExtractionEnabled),
    imageUpload: yesNo(access.imageUploadEnabled),
    reports: yesNo(access.reportsEnabled),
    export: yesNo(access.exportEnabled),
    enabledModules: access.enabledModules.map((module) => module.name).join(", ") || "-",
    userLimit: access.userCreationLimit,
    aiLogLimit: access.aiUsageLimitMinutes,
  };
}

function activityRow(activity: PlatformActivity): ReportRow {
  return {
    occurredAt: formatDate(activity.occurredAt),
    event: activity.event,
    area: activity.area,
    company: activity.company.name,
    user: activity.user,
    action: activity.action,
    status: activity.status,
  };
}

async function fetchCompanyReportRows(filters: Record<string, string | string[]>) {
  const response = await getCompanies({
    limit: REPORT_LIMIT,
    status: normalizedFilter(filters.status),
  });

  return (response.data ?? [])
    .filter((company) => insideDateRange(company.createdAt, filters.dateRange))
    .map(companyRow);
}

async function fetchAdminReportRows(filters: Record<string, string | string[]>) {
  const response = await getAdmins({
    limit: REPORT_LIMIT,
    role: normalizedFilter(filters.role),
    status: normalizedFilter(filters.status),
  });

  return (response.data ?? [])
    .filter((admin) => insideDateRange(admin.joinedOn, filters.dateRange))
    .map(adminRow);
}

async function fetchModuleReportRows(filters: Record<string, string | string[]>) {
  const category = normalizedFilter(filters.category);
  const response = await getModules({
    limit: REPORT_LIMIT,
    status: normalizedFilter(filters.status),
    moduleTypeId: normalizedFilter(filters.moduleTypeId),
  });

  return (response.data ?? [])
    .filter((module) => !category || module.category === category)
    .map(moduleRow);
}

async function fetchUsageReportRows(filters: Record<string, string | string[]>) {
  const period = (normalizedFilter(filters.period) ?? "THIS_MONTH") as UsagePeriod;
  const response = await getUsageCompanies({ limit: REPORT_LIMIT, period });

  return (response.data ?? []).map(usageRow);
}

async function fetchCompanyAccessReportRows(filters: Record<string, string | string[]>) {
  const companyResponse = await getCompanies({
    limit: REPORT_LIMIT,
    status: normalizedFilter(filters.status),
  });
  const companies = companyResponse.data ?? [];
  const accessRows = await Promise.all(
    companies.map(async (company) => {
      const access = await getCompanyAccess(company.id);
      return access.data ? accessRow(company, access.data) : null;
    }),
  );

  return accessRows.filter((row): row is ReportRow => Boolean(row));
}

async function fetchActivityReportRows(filters: Record<string, string | string[]>) {
  const response = await getActivities({
    limit: REPORT_LIMIT,
    area: normalizedFilter(filters.area),
    status: normalizedFilter(filters.status),
  });

  return (response.data ?? [])
    .filter((activity) => insideDateRange(activity.occurredAt, filters.dateRange))
    .map(activityRow);
}

export const masterReportDefinitions: Record<MasterReportType, MasterReportDefinition> = {
  companies: {
    type: "companies",
    title: "Companies Report",
    description: "Export company status, ownership, plan, and lifecycle data.",
    href: "/master/reports/companies",
    sourceHref: "/master/companies",
    icon: "companies",
    filters: [companyStatusFilter, dateRangeFilter],
    columns: [
      { key: "company", label: "Company" },
      { key: "owner", label: "Owner" },
      { key: "email", label: "Email" },
      { key: "phone", label: "Phone" },
      { key: "businessType", label: "Business Type" },
      { key: "plan", label: "Plan" },
      { key: "status", label: "Status" },
      { key: "startDate", label: "Start" },
      { key: "expiryDate", label: "Expiry" },
      { key: "createdAt", label: "Created" },
    ],
    fetchRows: fetchCompanyReportRows,
  },
  admins: {
    type: "admins",
    title: "Admins Report",
    description: "Export company admins, planners, execution users, and login status.",
    href: "/master/reports/admins",
    sourceHref: "/master/admins",
    icon: "admins",
    filters: [adminRoleFilter, adminStatusFilter, dateRangeFilter],
    columns: [
      { key: "name", label: "Name" },
      { key: "username", label: "Username" },
      { key: "email", label: "Email" },
      { key: "phone", label: "Phone" },
      { key: "role", label: "Role" },
      { key: "status", label: "Status" },
      { key: "company", label: "Company" },
      { key: "joinedOn", label: "Joined" },
      { key: "lastLogin", label: "Last Login" },
    ],
    fetchRows: fetchAdminReportRows,
  },
  modules: {
    type: "modules",
    title: "Modules Report",
    description: "Export module configuration, category, behavior flags, and schema field counts.",
    href: "/master/reports/modules",
    sourceHref: "/master/modules",
    icon: "modules",
    filters: [moduleTypeFilter, moduleCategoryFilter, moduleStatusFilter],
    columns: [
      { key: "module", label: "Module" },
      { key: "type", label: "Type" },
      { key: "category", label: "Category" },
      { key: "status", label: "Status" },
      { key: "voiceEnabled", label: "Voice" },
      { key: "feedEnabled", label: "Feed" },
      { key: "alertFeedOnly", label: "Alert Only" },
      { key: "maxAttachments", label: "Max Media", align: "right", format: "number" },
      { key: "fields", label: "Fields", align: "right", format: "number" },
      { key: "updatedAt", label: "Updated" },
    ],
    totals: ["maxAttachments", "fields"],
    fetchRows: fetchModuleReportRows,
  },
  "ai-usage": {
    type: "ai-usage",
    title: "AI Usage Report",
    description: "Export company-wise AI logs, failures, success rate, share, and estimated cost.",
    href: "/master/reports/ai-usage",
    sourceHref: "/master/usage",
    icon: "ai",
    filters: [usagePeriodFilter],
    columns: [
      { key: "company", label: "Company" },
      { key: "aiLogs", label: "AI Logs", align: "right", format: "number" },
      { key: "failedRequests", label: "Failures", align: "right", format: "number" },
      { key: "successRate", label: "Success %", align: "right", format: "number" },
      { key: "sharePercentage", label: "Share %", align: "right", format: "number" },
      { key: "estimatedCost", label: "Est. Cost", align: "right", format: "currency" },
      { key: "lastProcessedAt", label: "Last Processed" },
    ],
    totals: ["aiLogs", "failedRequests", "estimatedCost"],
    fetchRows: fetchUsageReportRows,
  },
  "company-access": {
    type: "company-access",
    title: "Company Access Report",
    description: "Export access flags, enabled modules, and configured company limits.",
    href: "/master/reports/company-access",
    sourceHref: "/master/companies",
    icon: "permissions",
    filters: [companyStatusFilter],
    columns: [
      { key: "company", label: "Company" },
      { key: "status", label: "Status" },
      { key: "voiceLogging", label: "Voice" },
      { key: "aiExtraction", label: "AI Extraction" },
      { key: "imageUpload", label: "Images" },
      { key: "reports", label: "Reports" },
      { key: "export", label: "Export" },
      { key: "enabledModules", label: "Enabled Modules" },
      { key: "userLimit", label: "User Limit", align: "right", format: "number" },
      { key: "aiLogLimit", label: "AI Log Limit", align: "right", format: "number" },
    ],
    totals: ["userLimit", "aiLogLimit"],
    fetchRows: fetchCompanyAccessReportRows,
  },
  activities: {
    type: "activities",
    title: "Activities Report",
    description: "Export platform activity by area, status, company, user, and date.",
    href: "/master/reports/activities",
    sourceHref: "/master/activities",
    icon: "activity",
    filters: [activityAreaFilter, activityStatusFilter, dateRangeFilter],
    columns: [
      { key: "occurredAt", label: "Date" },
      { key: "event", label: "Event" },
      { key: "area", label: "Area" },
      { key: "company", label: "Company" },
      { key: "user", label: "User" },
      { key: "action", label: "Action" },
      { key: "status", label: "Status" },
    ],
    fetchRows: fetchActivityReportRows,
  },
};

export const masterReportCards = Object.values(masterReportDefinitions).map((report) => ({
  title: report.title,
  description: report.description,
  href: report.href,
  icon: report.icon,
}));
