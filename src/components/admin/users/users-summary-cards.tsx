import { DashboardStatCard } from "@/components/common/dashboard-ui";

export function UsersSummaryCards({
  totalUsers,
  activeUsers,
  planners,
  executionUsers,
}: {
  totalUsers: number;
  activeUsers: number;
  planners: number;
  executionUsers: number;
}) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
      <DashboardStatCard
        label="Total Users"
        value={String(totalUsers)}
        helper="Planner and execution"
        icon="users"
        tone="navy"
      />
      <DashboardStatCard
        label="Active Users"
        value={String(activeUsers)}
        helper="Can access the app"
        icon="status"
        tone="green"
      />
      <DashboardStatCard
        label="Planners"
        value={String(planners)}
        helper="Review and plan logs"
        icon="planning"
        tone="amber"
      />
      <DashboardStatCard
        label="Execution Users"
        value={String(executionUsers)}
        helper="Create field logs"
        icon="voice"
        tone="blue"
      />
    </div>
  );
}
