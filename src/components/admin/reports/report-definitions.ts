"use client";

import type { AppIconName } from "@/components/common/app-icon";
import type { ColumnConfig, FilterConfig, ReportRow } from "@/components/report-viewer";
import { getEquipment } from "@/features/admin-equipment/api/equipment.queries";
import type { EquipmentListItem } from "@/features/admin-equipment/api/equipment.types";
import { getAdminUsers } from "@/features/admin-users/api/user.api";
import type { AdminUserListItem } from "@/features/admin-users/api/user.api";
import { getLogs } from "@/features/logs/api/log.queries";
import type { AdminLogListItem } from "@/features/logs/api/log.types";
import { formatLogDate, logLabel, logModules, logSeverities, logStatuses } from "@/features/logs/log.presentation";

export type AdminReportType = "logs" | "equipment" | "downtime" | "users";

type UserReportRole = "PLANNER" | "EXECUTION" | "all";

export type AdminReportDefinition = {
  type: AdminReportType;
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

const statusFilter: FilterConfig = {
  key: "status",
  label: "Status",
  type: "select",
  defaultValue: ALL,
  options: [{ label: "All Statuses", value: ALL }, ...logStatuses],
};

const severityFilter: FilterConfig = {
  key: "severity",
  label: "Severity",
  type: "select",
  defaultValue: ALL,
  options: [{ label: "All Severity", value: ALL }, ...logSeverities],
};

const moduleFilter: FilterConfig = {
  key: "moduleType",
  label: "Module",
  type: "select",
  defaultValue: ALL,
  options: [{ label: "All Modules", value: ALL }, ...logModules],
};

const dateRangeFilter: FilterConfig = {
  key: "dateRange",
  label: "Date Range",
  type: "daterange",
  defaultValue: ["", ""],
};

const equipmentStatusFilter: FilterConfig = {
  key: "status",
  label: "Status",
  type: "select",
  defaultValue: ALL,
  options: [
    { label: "All Statuses", value: ALL },
    { label: "Active", value: "ACTIVE" },
    { label: "Needs Attention", value: "NEEDS_ATTENTION" },
    { label: "Maintenance", value: "MAINTENANCE" },
    { label: "Inactive", value: "INACTIVE" },
  ],
};

const criticalityFilter: FilterConfig = {
  key: "criticality",
  label: "Criticality",
  type: "select",
  defaultValue: ALL,
  options: [
    { label: "All Criticality", value: ALL },
    { label: "Critical", value: "CRITICAL" },
    { label: "High", value: "HIGH" },
    { label: "Medium", value: "MEDIUM" },
    { label: "Low", value: "LOW" },
  ],
};

const userTypeFilter: FilterConfig = {
  key: "role",
  label: "User Type",
  type: "select",
  defaultValue: ALL,
  options: [
    { label: "All Users", value: ALL },
    { label: "Planners", value: "PLANNER" },
    { label: "Execution Users", value: "EXECUTION" },
  ],
};

const userStatusFilter: FilterConfig = {
  key: "status",
  label: "Status",
  type: "select",
  defaultValue: ALL,
  options: [
    { label: "All Statuses", value: ALL },
    { label: "Active", value: "ACTIVE" },
    { label: "Inactive", value: "INACTIVE" },
    { label: "Suspended", value: "SUSPENDED" },
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

function logRow(log: AdminLogListItem): ReportRow {
  return {
    date: formatLogDate(log.createdAt),
    logNumber: log.logNumber,
    title: log.title,
    equipment: log.equipment?.name ?? "General activity",
    equipmentCode: log.equipment?.equipmentCode ?? "-",
    module: logLabel(log.moduleType),
    status: logLabel(log.status),
    severity: logLabel(log.severity),
    createdBy: log.createdBy.fullName ?? "-",
    downtimeMinutes: log.downtimeMinutes,
  };
}

function equipmentRow(equipment: EquipmentListItem): ReportRow {
  return {
    equipmentCode: equipment.equipmentCode,
    name: equipment.name,
    category: clean(equipment.category),
    section: clean(equipment.section),
    subLocation: clean(equipment.subLocation),
    criticality: logLabel(equipment.criticality),
    status: logLabel(equipment.status),
    map: equipment.mapUrl || coordinatesLabel(equipment),
    updatedAt: formatLogDate(equipment.updatedAt),
  };
}

function userRow(user: AdminUserListItem): ReportRow {
  return {
    name: user.fullName,
    email: user.email,
    phone: clean(user.phone),
    role: logLabel(user.role),
    status: logLabel(user.status),
    joinedOn: formatLogDate(user.joinedOn),
    lastLogin: user.lastLoginAt ? formatLogDate(user.lastLoginAt) : "-",
  };
}

function coordinatesLabel(equipment: EquipmentListItem) {
  if (!equipment.latitude || !equipment.longitude) return "-";
  return `${equipment.latitude}, ${equipment.longitude}`;
}

async function fetchLogReportRows(filters: Record<string, string | string[]>) {
  const response = await getLogs({
    limit: REPORT_LIMIT,
    status: normalizedFilter(filters.status),
    severity: normalizedFilter(filters.severity),
    moduleType: normalizedFilter(filters.moduleType),
  });

  return (response.data ?? [])
    .filter((log) => insideDateRange(log.createdAt, filters.dateRange))
    .map(logRow);
}

async function fetchDowntimeReportRows(filters: Record<string, string | string[]>) {
  const response = await getLogs({
    limit: REPORT_LIMIT,
    status: normalizedFilter(filters.status),
    severity: normalizedFilter(filters.severity),
    moduleType: normalizedFilter(filters.moduleType),
  });

  return (response.data ?? [])
    .filter((log) => log.downtimeMinutes > 0)
    .filter((log) => insideDateRange(log.createdAt, filters.dateRange))
    .map(logRow);
}

async function fetchEquipmentReportRows(filters: Record<string, string | string[]>) {
  const response = await getEquipment({
    limit: REPORT_LIMIT,
    status: normalizedFilter(filters.status),
    criticality: normalizedFilter(filters.criticality),
  });

  return (response.data ?? []).map(equipmentRow);
}

async function fetchUsersByRole(role: Exclude<UserReportRole, "all">, filters: Record<string, string | string[]>) {
  const response = await getAdminUsers({
    limit: REPORT_LIMIT,
    role,
    status: normalizedFilter(filters.status),
  });

  return response.data ?? [];
}

async function fetchUserReportRows(filters: Record<string, string | string[]>) {
  const role = normalizedFilter(filters.role) as UserReportRole | undefined;
  const users = role && role !== ALL
    ? await fetchUsersByRole(role, filters)
    : [
        ...(await fetchUsersByRole("PLANNER", filters)),
        ...(await fetchUsersByRole("EXECUTION", filters)),
      ];

  return users
    .filter((user) => insideDateRange(user.joinedOn, filters.joinedRange))
    .map(userRow);
}

const logColumns: ColumnConfig[] = [
  { key: "date", label: "Date" },
  { key: "logNumber", label: "Log No." },
  { key: "equipmentCode", label: "Equipment ID" },
  { key: "equipment", label: "Equipment" },
  { key: "module", label: "Module" },
  { key: "status", label: "Status" },
  { key: "severity", label: "Severity" },
  { key: "downtimeMinutes", label: "Downtime", align: "right", format: "number" },
];

const userColumns: ColumnConfig[] = [
  { key: "name", label: "Name" },
  { key: "email", label: "Email" },
  { key: "phone", label: "Phone" },
  { key: "role", label: "User Type" },
  { key: "status", label: "Status" },
  { key: "joinedOn", label: "Joined" },
  { key: "lastLogin", label: "Last Login" },
];

export const adminReportDefinitions: Record<AdminReportType, AdminReportDefinition> = {
  logs: {
    type: "logs",
    title: "Logs Report",
    description: "Generate a printable view of operational logs by status, severity, module, and date.",
    href: "/admin/reports/logs",
    sourceHref: "/admin/logs",
    icon: "logs",
    filters: [statusFilter, severityFilter, moduleFilter, dateRangeFilter],
    columns: logColumns,
    totals: ["downtimeMinutes"],
    fetchRows: fetchLogReportRows,
  },
  equipment: {
    type: "equipment",
    title: "Equipment Report",
    description: "Review equipment status, criticality, sections, and captured location references.",
    href: "/admin/reports/equipment",
    sourceHref: "/admin/equipment",
    icon: "equipment",
    filters: [equipmentStatusFilter, criticalityFilter],
    columns: [
      { key: "equipmentCode", label: "Equipment ID" },
      { key: "name", label: "Equipment" },
      { key: "category", label: "Category" },
      { key: "section", label: "Section" },
      { key: "subLocation", label: "Sub Location" },
      { key: "criticality", label: "Criticality" },
      { key: "status", label: "Status" },
      { key: "map", label: "Map / Coordinates" },
      { key: "updatedAt", label: "Updated" },
    ],
    fetchRows: fetchEquipmentReportRows,
  },
  downtime: {
    type: "downtime",
    title: "Downtime Report",
    description: "Generate downtime-focused logs for quick export and operations review.",
    href: "/admin/reports/downtime",
    sourceHref: "/admin/logs",
    icon: "activity",
    filters: [statusFilter, severityFilter, moduleFilter, dateRangeFilter],
    columns: [
      { key: "date", label: "Date" },
      { key: "logNumber", label: "Log No." },
      { key: "equipment", label: "Equipment" },
      { key: "title", label: "Issue" },
      { key: "status", label: "Status" },
      { key: "severity", label: "Severity" },
      { key: "downtimeMinutes", label: "Downtime", align: "right", format: "number" },
      { key: "createdBy", label: "Created By" },
    ],
    totals: ["downtimeMinutes"],
    fetchRows: fetchDowntimeReportRows,
  },
  users: {
    type: "users",
    title: "Users Report",
    description: "Generate planner or execution user lists from one report.",
    href: "/admin/reports/users",
    sourceHref: "/admin/users",
    icon: "users",
    filters: [
      userTypeFilter,
      userStatusFilter,
      { key: "joinedRange", label: "Joined Range", type: "daterange", defaultValue: ["", ""] },
    ],
    columns: userColumns,
    fetchRows: fetchUserReportRows,
  },
};

export const reportCards = Object.values(adminReportDefinitions).map((report) => ({
  title: report.title,
  description: report.description,
  href: report.href,
  icon: report.icon,
}));
