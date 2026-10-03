import { DashboardStatCard } from "@/components/common/dashboard-ui";

export function UsersSummaryCards({
  totalUsers,
  activeUsers,
  planners,
  executionUsers,
  seatLimit,
}: {
  totalUsers: number;
  activeUsers: number;
  planners: number;
  executionUsers: number;
  seatLimit?: number;
}) {
  const isFull = seatLimit != null && activeUsers >= seatLimit;
  const seatHelper = seatLimit != null
    ? `${activeUsers} / ${seatLimit} seats used`
    : "Can access the app";

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
        value={seatLimit != null ? `${activeUsers} / ${seatLimit}` : String(activeUsers)}
        helper={isFull ? "Seat limit reached" : seatHelper}
        icon="status"
        tone={isFull ? "amber" : "green"}
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
