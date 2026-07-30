"use client";

import Link from "next/link";
import { useState } from "react";

import { AppIcon } from "@/components/common/app-icon";
import {
  DashboardCard,
  DashboardPageHeader,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  UsageProgress,
} from "@/components/common/dashboard-ui";
import { EntityAvatar } from "@/components/common/entity-avatar";
import { TablePagination } from "@/components/common/table-pagination";
import { MasterTableSkeleton } from "@/components/master/master-skeletons";
import { buttonVariants } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select";
import type { UsagePeriod, UsageCompanyRow } from "@/features/master-usage/api/usage.types";
import { useUsageCompanies } from "@/features/master-usage/api/usage.queries";
import { cn } from "@/lib/utils";

const periods: Array<{ label: string; value: UsagePeriod }> = [
  { label: "This Month", value: "THIS_MONTH" },
  { label: "Last Month", value: "LAST_MONTH" },
  { label: "This Quarter", value: "THIS_QUARTER" },
];

export function UsageDashboard() {
  const [period, setPeriod] = useState<UsagePeriod>("THIS_MONTH");
  const [page, setPage] = useState(1);
  const [companyId, setCompanyId] = useState("all");
  const companiesQuery = useUsageCompanies({ page, limit: 20, period, companyId: companyId === "all" ? undefined : companyId });
  const usageRows = companiesQuery.data?.data ?? [];
  const meta = companiesQuery.data?.meta;

  return (
    <div className="space-y-4 sm:space-y-6">
      <DashboardPageHeader
        title="AI Usage Dashboard"
        description="Monitor AI usage, cost, and success rate across companies"
      />
      <div className="flex flex-wrap items-center gap-2 sm:justify-end">
        <PeriodSelect value={period} onChange={setPeriod} />
        <CompanySelect
          value={companyId}
          rows={usageRows}
          onChange={(value) => {
            setCompanyId(value);
            setPage(1);
          }}
        />
        <Link href="/master/settings" className={cn(buttonVariants({ variant: "outline" }), "rounded-xl")}>
          <AppIcon name="settings" className="size-4" />
          AI Settings
        </Link>
      </div>

      <UsageByCompanySection rows={usageRows} isLoading={companiesQuery.isLoading} isError={companiesQuery.isError} meta={meta} page={page} onPageChange={setPage} />
    </div>
  );
}

function UsageByCompanySection({ rows, isLoading, isError, meta, page, onPageChange }: { rows: UsageCompanyRow[]; isLoading: boolean; isError: boolean; meta?: { page: number; limit: number; offset: number; totalItems: number; totalPages: number; hasPreviousPage: boolean; hasNextPage: boolean }; page: number; onPageChange: (page: number) => void }) {
  return (
    <div className="space-y-3">
      <DashboardCard>
        {isLoading ? <MasterTableSkeleton columns={7} /> : null}
        {isError ? <p className="p-5 text-sm text-muted-foreground">Could not load company usage.</p> : null}
        {!isLoading && !isError ? <UsageByCompanyTable rows={rows} /> : null}
      </DashboardCard>
      {meta ? <TablePagination page={meta.page} totalPages={meta.totalPages} startItem={meta.totalItems ? meta.offset + 1 : 0} endItem={Math.min(meta.offset + meta.limit, meta.totalItems)} totalItems={meta.totalItems} canPrevious={meta.hasPreviousPage} canNext={meta.hasNextPage} onPageChange={onPageChange} onPrevious={() => onPageChange(Math.max(1, page - 1))} onNext={() => onPageChange(page + 1)} /> : null}
    </div>
  );
}

function CompanySelect({ value, rows, onChange }: { value: string; rows: UsageCompanyRow[]; onChange: (value: string) => void }) {
  return (
    <Select value={value} onValueChange={(next) => next && onChange(next)}>
      <SelectTrigger className="h-10 min-w-40 flex-1 rounded-xl bg-secondary/70 sm:w-44 sm:flex-none">
        <span className="truncate">{value === "all" ? "All Companies" : rows.find((usage) => usage.company.id === value)?.company.name ?? "Company"}</span>
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All Companies</SelectItem>
        {rows.map((usage) => <SelectItem key={usage.company.id} value={usage.company.id}>{usage.company.name}</SelectItem>)}
      </SelectContent>
    </Select>
  );
}

function UsageByCompanyTable({ rows }: { rows: UsageCompanyRow[] }) {
  return (
    <Table>
      <TableHeader><TableRow><TableHead>Company</TableHead><TableHead>AI Logs</TableHead><TableHead>Failures</TableHead><TableHead>Success Rate</TableHead><TableHead>Last Processed</TableHead><TableHead>Share</TableHead><TableHead className="text-right">Est Cost</TableHead></TableRow></TableHeader>
      <TableBody>
        {rows.length ? rows.map((usage) => (
          <TableRow key={usage.company.id}>
            <TableCell><Link href={`/master/usage/${usage.company.id}`} className="flex items-center gap-3"><EntityAvatar initials={usage.company.logo ?? initials(usage.company.name)} className="size-9" fallbackClassName="text-xs" /><span className="font-medium text-foreground">{usage.company.name}</span></Link></TableCell>
            <TableCell>{formatNumber(usage.aiLogs)}</TableCell>
            <TableCell>{formatNumber(usage.failedRequests)}</TableCell>
            <TableCell>{usage.successRate}%</TableCell>
            <TableCell>{formatDate(usage.lastProcessedAt)}</TableCell>
            <TableCell><div className="flex items-center gap-3"><UsageProgress value={usage.sharePercentage} /><span className="w-12 text-sm text-muted-foreground">{usage.sharePercentage}%</span></div></TableCell>
            <TableCell className="text-right">{formatCurrency(usage.estimatedCost)}</TableCell>
          </TableRow>
        )) : <TableRow><TableCell colSpan={7} className="py-8 text-center text-muted-foreground">No usage records found.</TableCell></TableRow>}
      </TableBody>
    </Table>
  );
}

function PeriodSelect({ value, onChange }: { value: UsagePeriod; onChange: (value: UsagePeriod) => void }) {
  return (
    <Select value={value} onValueChange={(next) => onChange(next as UsagePeriod)}>
      <SelectTrigger className="h-10 min-w-36 flex-1 rounded-xl bg-secondary/70 sm:w-36 sm:flex-none"><span className="truncate">{periods.find((period) => period.value === value)?.label ?? "Period"}</span></SelectTrigger>
      <SelectContent>{periods.map((period) => <SelectItem key={period.value} value={period.value}>{period.label}</SelectItem>)}</SelectContent>
    </Select>
  );
}

function initials(value: string) { return value.split(/\s+/).slice(0, 2).map((part) => part[0]).join("").toUpperCase(); }
function formatNumber(value: number) { return new Intl.NumberFormat("en-US").format(value); }
function formatCurrency(value: number) { return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 2 }).format(value); }
function formatDate(value: string | null) { return value ? new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" }).format(new Date(value)) : "-"; }
