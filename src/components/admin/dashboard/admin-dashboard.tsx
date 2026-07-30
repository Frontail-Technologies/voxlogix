"use client";

import type { AppIconName } from "@/components/common/app-icon";
import {
  CardContent,
  CardHeader,
  CardTitle,
  DashboardCard,
  DashboardPageHeader,
  DashboardStatCard,
  type DashboardTone,
} from "@/components/common/dashboard-ui";
import { LoadingSpinner } from "@/components/common/loading-spinner";
import { TrendAreaChart } from "@/components/common/trend-area-chart";
import { Button } from "@/components/ui/button";
import { useAdminDashboardSummary } from "@/features/admin-dashboard/api/dashboard.queries";
import type { AdminDashboardSummary } from "@/features/admin-dashboard/api/dashboard.types";
import { cn } from "@/lib/utils";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

const moduleLabels: Record<string, string> = {
  EQUIPMENT_LOG: "Equipment",
  SAFETY_LOG: "Safety",
  MEASUREMENT_POINT: "Measurement",
  METER_COUNTER: "Meter",
  SHIFT: "Shift",
  SUGGESTION: "Suggestion",
};

const statusLabels: Record<string, string> = {
  DRAFT: "Draft",
  SUBMITTED: "Submitted",
  PLANNED: "Planned",
  IN_PROGRESS: "In Progress",
  COMPLETED: "Completed",
  NEEDS_CORRECTION: "Needs Correction",
};

export function AdminDashboard() {
  const { data, isLoading, isError, refetch, isFetching } = useAdminDashboardSummary();
  const summary = data?.data;

  return (
    <div className="space-y-4 sm:space-y-6">
      <DashboardPageHeader
        title="Dashboard"
        description="Simple operational analytics for logs, equipment attention, and team activity."
      />

      {isError ? <DashboardError onRetry={() => void refetch()} retrying={isFetching} /> : null}
      {isLoading ? <DashboardSkeleton /> : null}
      {!isLoading && !isError && summary ? <DashboardContent summary={summary} /> : null}
      {!isLoading && !isError && !summary ? <DashboardEmpty /> : null}
    </div>
  );
}

function DashboardContent({ summary }: { summary: AdminDashboardSummary }) {
  return (
    <>
      <SummaryCards summary={summary} />
      <AnalyticsGrid summary={summary} />
    </>
  );
}

function SummaryCards({ summary }: { summary: AdminDashboardSummary }) {
  const cards: Array<{
    label: string;
    value: string;
    helper: string;
    icon: AppIconName;
    tone: DashboardTone;
  }> = [
    {
      label: "Total Logs",
      value: formatNumber(summary.stats.totalLogs),
      helper: "All submitted activity",
      icon: "logs",
      tone: "teal",
    },
    {
      label: "Pending Logs",
      value: formatNumber(summary.stats.pendingLogs),
      helper: "Needs review or action",
      icon: "status",
      tone: "amber",
    },
    {
      label: "Critical / High",
      value: formatNumber(summary.stats.criticalIssues),
      helper: "Priority issues raised",
      icon: "warning",
      tone: "red",
    },
    {
      label: "Equipment Attention",
      value: formatNumber(summary.stats.equipmentNeedingAttention),
      helper: "Maintenance or breakdown",
      icon: "equipment",
      tone: "orange",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
      {cards.map((card) => (
        <DashboardStatCard key={card.label} {...card} />
      ))}
    </div>
  );
}

function AnalyticsGrid({ summary }: { summary: AdminDashboardSummary }) {
  return (
    <div className="grid gap-3 sm:gap-4 xl:grid-cols-[1.25fr_0.75fr]">
      <DashboardCard>
        <CardHeader className="border-b border-border px-4 py-3 sm:px-5 sm:py-4">
          <CardTitle>Last 7 Days</CardTitle>
          <p className="text-sm text-muted-foreground">Log creation trend</p>
        </CardHeader>
        <CardContent className="px-4 pb-4 pt-4 sm:px-5 sm:pb-5">
          <TrendAreaChart points={summary.logsTrend.map((item) => ({ label: item.label, value: item.count }))} />
        </CardContent>
      </DashboardCard>

      <div className="grid gap-3 sm:gap-4">
        <DistributionCard
          title="Logs by Status"
          items={summary.logsByStatus.map((item) => ({
            label: statusLabel(item.status),
            value: item.count,
          }))}
        />
        <DistributionCard
          title="Logs by Module"
          items={summary.logsByModule.map((item) => ({
            label: moduleLabel(item.moduleType),
            value: item.count,
          }))}
        />
        <TeamMixCard
          planners={summary.stats.activePlanners}
          executionUsers={summary.stats.activeExecutionUsers}
        />
      </div>
    </div>
  );
}

function DistributionCard({
  title,
  items,
}: {
  title: string;
  items: Array<{ label: string; value: number }>;
}) {
  const max = Math.max(...items.map((item) => item.value), 1);
  const visibleItems = items.filter((item) => item.value > 0);
  const displayItems = visibleItems.length ? visibleItems : items.slice(0, 4);

  return (
    <DashboardCard>
      <CardHeader className="border-b border-border px-4 py-3 sm:px-5 sm:py-4">
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 px-4 pb-4 pt-4 sm:px-5 sm:pb-5">
        {displayItems.map((item) => (
          <BarRow
            key={item.label}
            label={item.label}
            value={item.value}
            percent={(item.value / max) * 100}
            muted={item.value === 0}
          />
        ))}
      </CardContent>
    </DashboardCard>
  );
}

function BarRow({
  label,
  value,
  percent,
  muted = false,
}: {
  label: string;
  value: number;
  percent: number;
  muted?: boolean;
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between gap-3 text-sm">
        <span className={cn("min-w-0 truncate", muted ? "text-muted-foreground" : "text-foreground")}>
          {label}
        </span>
        <span className={cn("font-medium", muted ? "text-muted-foreground" : "text-foreground")}>
          {formatNumber(value)}
        </span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-secondary">
        <div
          className={cn("h-full rounded-full transition-all", muted ? "bg-muted-foreground/25" : "bg-primary")}
          style={{ width: `${Math.max(percent, value > 0 ? 8 : 0)}%` }}
        />
      </div>
    </div>
  );
}

function TeamMixCard({
  planners,
  executionUsers,
}: {
  planners: number;
  executionUsers: number;
}) {
  const data = [
    { name: "Planners", value: planners, color: "#168C97" },
    { name: "Execution", value: executionUsers, color: "#F6B719" },
  ];
  const total = planners + executionUsers;

  return (
    <DashboardCard>
      <CardHeader className="border-b border-border px-4 py-3 sm:px-5 sm:py-4">
        <CardTitle>Team Mix</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-3 px-4 pb-4 pt-4 sm:px-5 sm:pb-5">
        <div className="relative h-36">
          {total ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={42}
                  outerRadius={64}
                  paddingAngle={4}
                  strokeWidth={0}
                >
                  {data.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => formatNumber(Number(value))} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
              No active team users
            </div>
          )}
          {total ? (
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-xl font-semibold text-foreground">{formatNumber(total)}</span>
              <span className="text-xs text-muted-foreground">Active</span>
            </div>
          ) : null}
        </div>
        <div className="grid grid-cols-2 gap-2 text-sm">
          {data.map((item) => (
            <div key={item.name} className="rounded-xl bg-secondary/60 p-2">
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <span className="size-2 rounded-full" style={{ backgroundColor: item.color }} />
                {item.name}
              </div>
              <p className="mt-1 font-semibold text-foreground">{formatNumber(item.value)}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </DashboardCard>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <DashboardStatCard
            key={index}
            label=""
            value=""
            helper=""
            icon="status"
            isLoading
          />
        ))}
      </div>
      <div className="grid gap-3 sm:gap-4 xl:grid-cols-[1.25fr_0.75fr]">
        <DashboardCard className="flex min-h-[360px] items-center justify-center">
          <LoadingSpinner />
        </DashboardCard>
        <div className="grid gap-3 sm:gap-4">
          <DashboardCard className="flex min-h-44 items-center justify-center">
            <LoadingSpinner />
          </DashboardCard>
          <DashboardCard className="flex min-h-44 items-center justify-center">
            <LoadingSpinner />
          </DashboardCard>
          <DashboardCard className="flex min-h-44 items-center justify-center">
            <LoadingSpinner />
          </DashboardCard>
        </div>
      </div>
    </div>
  );
}

function DashboardError({ onRetry, retrying }: { onRetry: () => void; retrying: boolean }) {
  return (
    <DashboardCard>
      <CardContent className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-medium text-card-foreground">Dashboard data could not be loaded.</p>
          <p className="text-sm text-muted-foreground">Check the backend session and try again.</p>
        </div>
        <Button variant="outline" className="rounded-xl" disabled={retrying} onClick={onRetry}>
          Retry
        </Button>
      </CardContent>
    </DashboardCard>
  );
}

function DashboardEmpty() {
  return (
    <DashboardCard>
      <CardContent className="p-5">
        <p className="text-sm text-muted-foreground">No dashboard data is available yet.</p>
      </CardContent>
    </DashboardCard>
  );
}

function moduleLabel(moduleType: string) {
  return moduleLabels[moduleType] ?? labelFromCode(moduleType);
}

function statusLabel(status: string) {
  return statusLabels[status] ?? labelFromCode(status);
}

function labelFromCode(value: string) {
  return value
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function formatNumber(value: number) {
  return new Intl.NumberFormat("en-US", { maximumFractionDigits: 1 }).format(value);
}
