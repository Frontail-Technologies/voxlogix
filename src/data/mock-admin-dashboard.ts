import { equipment } from "@/data/mock-admin";
import { equipmentLogs, logStatuses } from "@/data/mock-admin-logs";
import { companyUsers } from "@/data/mock-admin-users";

const completedLogs = equipmentLogs.filter((log) => log.status === "Completed");
const pendingLogs = equipmentLogs.filter(
  (log) => log.status !== "Completed" && log.status !== "Draft",
);
const aiProcessedLogs = equipmentLogs.filter((log) => log.status !== "Draft");

export const dashboardSummaryStats = {
  totalEquipment: equipment.length,
  totalLogs: equipmentLogs.length,
  pendingLogs: pendingLogs.length,
  completedLogs: completedLogs.length,
  activeUsers: companyUsers.filter((user) => user.status === "Active").length,
  aiProcessedLogs: aiProcessedLogs.length,
};

export const dashboardRecentLogs = equipmentLogs.slice(0, 6);

export const dashboardPendingActions = {
  awaitingReview: equipmentLogs.filter((log) => log.status === "Submitted").length,
  needingCorrection: equipmentLogs.filter(
    (log) => log.status === "Needs Correction",
  ).length,
  pendingEquipmentIssues: equipment.filter(
    (item) => item.status === "Breakdown" || item.status === "Critical",
  ).length,
};

export const dashboardEquipmentHealth = {
  active: equipment.filter((item) => item.status === "Active").length,
  underMaintenance: equipment.filter(
    (item) => item.status === "Under Maintenance",
  ).length,
  breakdown: equipment.filter((item) => item.status === "Breakdown").length,
  critical: equipment.filter((item) => item.status === "Critical").length,
};

export const dashboardLogsByStatus = logStatuses.map((status) => ({
  status,
  count: equipmentLogs.filter((log) => log.status === status).length,
}));

export const dashboardLogsByModule = [
  { module: "Equipment Log", count: equipmentLogs.length, active: true },
  { module: "Safety Log", count: 0, active: false },
  { module: "Measurement Point", count: 0, active: false },
  { module: "Meter Counter", count: 0, active: false },
];

export const dashboardLogsTrend = {
  labels: ["Jul 6", "Jul 7", "Jul 8", "Jul 9", "Jul 10", "Jul 11", "Jul 12"],
  points: [3, 5, 4, 6, 8, 5, 7],
};

export const dashboardCriticalIssues = equipmentLogs
  .filter((log) => log.severity === "Critical" || log.severity === "High")
  .slice(0, 5);
