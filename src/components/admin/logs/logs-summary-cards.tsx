import { DashboardStatCard } from "@/components/common/dashboard-ui";
import type { AdminLogListItem } from "@/features/logs/api/log.types";
import { normalizeLogValue } from "@/features/logs/log.presentation";

export function LogsSummaryCards({
  logs,
  totalItems,
}: {
  logs: AdminLogListItem[];
  totalItems: number;
}) {
  const submitted = logs.filter(
    (log) => normalizeLogValue(log.status) === "SUBMITTED",
  ).length;
  const inProgress = logs.filter(
    (log) => normalizeLogValue(log.status) === "IN_PROGRESS",
  ).length;
  const completed = logs.filter(
    (log) => normalizeLogValue(log.status) === "COMPLETED",
  ).length;

  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
      <DashboardStatCard
        label="Total Logs"
        value={String(totalItems)}
        helper="Company logs"
        icon="logs"
        tone="navy"
      />
      <DashboardStatCard
        label="Submitted"
        value={String(submitted)}
        helper="Visible on this page"
        icon="status"
        tone="blue"
      />
      <DashboardStatCard
        label="In Progress"
        value={String(inProgress)}
        helper="Visible on this page"
        icon="activity"
        tone="orange"
      />
      <DashboardStatCard
        label="Completed"
        value={String(completed)}
        helper="Visible on this page"
        icon="status"
        tone="green"
      />
    </div>
  );
}
