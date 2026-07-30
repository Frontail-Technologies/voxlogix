"use client";

import Link from "next/link";

import { AppIcon, type AppIconName } from "@/components/common/app-icon";
import {
  DashboardCard,
  DashboardPageHeader,
  DashboardStatCard,
  type DashboardTone,
} from "@/components/common/dashboard-ui";
import { TruncatedText } from "@/components/common/truncated-text";
import { Button, buttonVariants } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useExecutionDashboardSummary } from "@/features/execution-dashboard/api/dashboard.queries";
import { formatLogDate, logLabel } from "@/features/logs/log.presentation";
import { cn } from "@/lib/utils";

import { LogStatusBadge, SeverityBadge } from "../../admin/logs/log-badges";

export function ExecutionDashboard() {
  const { data, isLoading, isError, refetch, isFetching } = useExecutionDashboardSummary();
  const summary = data?.data;

  return (
    <div className="space-y-4 sm:space-y-6">
      <DashboardPageHeader
        title="Dashboard"
        description="Your logs, drafts, and recent activity."
        action={
          <Link href="/execution/create-log" className={cn(buttonVariants(), "rounded-xl")}>
            <AppIcon name="voice" className="size-4" />
            Create Log
          </Link>
        }
      />

      {isError ? (
        <DashboardCard>
          <div className="flex flex-col items-center gap-3 p-6 text-center">
            <p className="text-sm text-muted-foreground">Could not load your dashboard.</p>
            <Button type="button" variant="outline" className="rounded-xl" onClick={() => void refetch()} disabled={isFetching}>
              {isFetching ? "Retrying..." : "Retry"}
            </Button>
          </div>
        </DashboardCard>
      ) : null}

      {isLoading ? <ExecutionDashboardSkeleton /> : null}

      {!isLoading && !isError && summary ? (
        <>
          <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-5">
            <StatCard label="Today" value={summary.stats.todayLogs} icon="logs" tone="navy" />
            <StatCard label="Drafts" value={summary.stats.draftLogs} icon="package" tone="orange" />
            <StatCard label="Submitted" value={summary.stats.submittedLogs} icon="status" tone="blue" />
            <StatCard label="Completed" value={summary.stats.completedLogs} icon="status" tone="green" />
            <StatCard label="Needs Correction" value={summary.stats.correctionLogs} icon="warning" tone="red" />
          </div>

          <DashboardCard>
            <div className="flex items-center justify-between gap-2 p-4 sm:p-5">
              <h3 className="font-semibold text-foreground">Recent Activity</h3>
              <Link href="/execution/my-logs" className="text-sm font-medium text-primary hover:underline">
                View all
              </Link>
            </div>
            <div className="space-y-2 px-4 pb-4 sm:px-5 sm:pb-5">
              {summary.recentLogs.length ? (
                summary.recentLogs.map((log) => (
                  <Link
                    key={log.id}
                    href={`/execution/my-logs/${log.id}`}
                    className="flex flex-col gap-2 rounded-2xl border border-border bg-background p-3 transition-colors hover:border-primary/50 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="min-w-0">
                      <TruncatedText text={log.title} className="font-medium text-foreground" />
                      <p className="text-xs text-muted-foreground">
                        {log.equipment?.name ?? "General activity"} - {logLabel(log.moduleType)} - {formatLogDate(log.createdAt)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <SeverityBadge severity={log.severity} />
                      <LogStatusBadge status={log.status} />
                    </div>
                  </Link>
                ))
              ) : (
                <p className="py-6 text-center text-sm text-muted-foreground">
                  No logs yet. Create your first log to get started.
                </p>
              )}
            </div>
          </DashboardCard>
        </>
      ) : null}
    </div>
  );
}

function ExecutionDashboardSkeleton() {
  return (
    <>
      <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-5">
        {Array.from({ length: 5 }).map((_, index) => (
          <DashboardCard key={index} className="min-h-[92px] sm:min-h-[106px]">
            <div className="flex h-full flex-col items-start gap-2 p-3 sm:flex-row sm:items-center sm:gap-4 sm:p-5">
              <Skeleton className="size-9 shrink-0 rounded-xl sm:size-12" />
              <div className="min-w-0 flex-1 space-y-1">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-7 w-16" />
                <Skeleton className="hidden h-4 w-24 sm:block" />
              </div>
            </div>
          </DashboardCard>
        ))}
      </div>

      <DashboardCard>
        <div className="flex items-center justify-between gap-2 p-4 sm:p-5">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-4 w-14" />
        </div>
        <div className="space-y-2 px-4 pb-4 sm:px-5 sm:pb-5">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="flex flex-col gap-2 rounded-2xl border border-border bg-background p-3 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="min-w-0 flex-1 space-y-2">
                <Skeleton className="h-4 w-3/4 max-w-64" />
                <Skeleton className="h-3 w-1/2 max-w-48" />
              </div>
              <div className="flex items-center gap-2">
                <Skeleton className="h-6 w-16 rounded-full" />
                <Skeleton className="h-6 w-20 rounded-full" />
              </div>
            </div>
          ))}
        </div>
      </DashboardCard>
    </>
  );
}

function StatCard({
  label,
  value,
  icon,
  tone,
}: {
  label: string;
  value: number;
  icon: AppIconName;
  tone: DashboardTone;
}) {
  return <DashboardStatCard label={label} value={String(value)} helper="Your logs" icon={icon} tone={tone} />;
}
