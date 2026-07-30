"use client";

import Link from "next/link";

import { AppIcon } from "@/components/common/app-icon";
import { DashboardCard, DashboardPageHeader, DashboardStatCard, Table, TableBody, TableCell, TableHead, TableHeader, TableRow, UsageProgress } from "@/components/common/dashboard-ui";
import { EntityAvatar } from "@/components/common/entity-avatar";
import { TrendAreaChart } from "@/components/common/trend-area-chart";
import { MasterCardGridSkeleton, MasterTableSkeleton } from "@/components/master/master-skeletons";
import { buttonVariants } from "@/components/ui/button";
import { useUsageCompany } from "@/features/master-usage/api/usage.queries";
import { cn } from "@/lib/utils";

export function UsageCompanyDetail({ companyId, backHref = "/master/usage" }: { companyId: string; backHref?: string }) {
  const { data, isLoading, isError } = useUsageCompany(companyId, "THIS_MONTH");
  const usage = data?.data;
  const chartPoints = usage?.breakdown.map((point) => ({ label: formatShortDay(point.date), value: point.aiLogs })) ?? [];

  return (
    <div className="space-y-4 sm:space-y-6">
      <DashboardPageHeader title="AI Usage Company Detail" description="Company-specific AI logs, failures, limits, and estimated cost" action={<Link href={backHref} className={cn(buttonVariants({ variant: "outline" }), "rounded-xl")}><AppIcon name="arrow-left" className="size-4" />Back to Usage</Link>} />
      {isLoading ? <><MasterCardGridSkeleton /><DashboardCard><MasterTableSkeleton columns={5} /></DashboardCard></> : null}
      {isError ? <DashboardCard><p className="p-5 text-sm text-muted-foreground">Could not load company usage.</p></DashboardCard> : null}
      {usage ? (
        <>
          <DashboardCard>
            <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4"><EntityAvatar initials={usage.company.logo ?? initials(usage.company.name)} className="size-14" fallbackClassName="text-lg" /><div><h2 className="text-xl font-semibold text-card-foreground">{usage.company.name}</h2><p className="text-sm text-muted-foreground">{usage.company.plan} plan · {usage.company.businessType}</p></div></div>
              <div className="rounded-2xl border border-border bg-background px-4 py-3 text-sm"><span className="text-muted-foreground">Monthly AI log limit:</span> <span className="font-medium text-foreground">{formatNumber(usage.limitSummary.monthlyAiLogLimit)} logs</span></div>
            </div>
          </DashboardCard>

          <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-3">
            <DashboardStatCard label="AI Logs" value={formatNumber(usage.stats.totalAiLogs)} helper="Structured logs generated" icon="ai" tone="blue" />
            <DashboardStatCard label="Failed Requests" value={formatNumber(usage.stats.failedRequests)} helper="Processing failures" icon="warning" tone="red" />
            <DashboardStatCard label="Estimated Cost" value={formatCurrency(usage.stats.estimatedCost)} helper={`${usage.stats.successRate}% success rate`} icon="reports" tone="orange" />
          </div>

          <div className="grid gap-3 sm:gap-4 xl:grid-cols-[1fr_360px]">
            <DashboardCard><div className="border-b border-border p-5"><h2 className="font-semibold text-card-foreground">Monthly Usage Trend</h2><p className="text-sm text-muted-foreground">AI log trend for the selected company</p></div><div className="p-5"><TrendAreaChart points={chartPoints} /></div></DashboardCard>
            <DashboardCard><div className="border-b border-border p-5"><h2 className="font-semibold text-card-foreground">Limit Usage</h2><p className="text-sm text-muted-foreground">Current month AI usage</p></div><div className="space-y-5 p-5"><LimitRow label="AI log limit" value={`${usage.limitSummary.aiLogsUsagePercent}%`} progress={usage.limitSummary.aiLogsUsagePercent} /><LimitRow label="Estimated cost limit" value={`${usage.limitSummary.estimatedCostUsagePercent}%`} progress={usage.limitSummary.estimatedCostUsagePercent} /></div></DashboardCard>
          </div>

          <DashboardCard><div className="border-b border-border p-5"><h2 className="font-semibold text-card-foreground">Daily Usage Breakdown</h2><p className="text-sm text-muted-foreground">Daily AI requests and cost</p></div><DailyBreakdownTable rows={usage.breakdown} /></DashboardCard>
        </>
      ) : null}
    </div>
  );
}

function LimitRow({ label, value, progress }: { label: string; value: string; progress: number }) {
  return <div className="space-y-2"><div className="flex items-center justify-between text-sm"><span className="font-medium text-foreground">{label}</span><span className="text-muted-foreground">{value}</span></div><UsageProgress value={progress} /></div>;
}

function DailyBreakdownTable({ rows }: { rows: Array<{ date: string; aiLogs: number; failedRequests: number; estimatedCost: number }> }) {
  return (
    <Table>
      <TableHeader><TableRow><TableHead>Date</TableHead><TableHead>AI Logs</TableHead><TableHead>Failed Requests</TableHead><TableHead className="text-right">Est Cost</TableHead></TableRow></TableHeader>
      <TableBody>{rows.length ? rows.map((day) => <TableRow key={day.date}><TableCell className="font-medium">{formatDay(day.date)}</TableCell><TableCell>{formatNumber(day.aiLogs)}</TableCell><TableCell>{formatNumber(day.failedRequests)}</TableCell><TableCell className="text-right">{formatCurrency(day.estimatedCost)}</TableCell></TableRow>) : <TableRow><TableCell colSpan={4} className="py-8 text-center text-muted-foreground">No usage breakdown found.</TableCell></TableRow>}</TableBody>
    </Table>
  );
}

function initials(value: string) { return value.split(/\s+/).slice(0, 2).map((part) => part[0]).join("").toUpperCase(); }
function formatNumber(value: number) { return new Intl.NumberFormat("en-US").format(value); }
function formatCurrency(value: number) { return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 2 }).format(value); }
function formatDay(value: string) { return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(new Date(value)); }
function formatShortDay(value: string) { return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" }).format(new Date(value)); }
