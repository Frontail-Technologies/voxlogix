"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

import { AppIcon } from "@/components/common/app-icon";
import {
  DashboardCard,
  DashboardPageHeader,
} from "@/components/common/dashboard-ui";
import { TablePagination } from "@/components/common/table-pagination";
import {
  LogsCardGridSkeleton,
  MasterCardGridSkeleton,
  MasterTableSkeleton,
} from "@/components/master/master-skeletons";
import { buttonVariants } from "@/components/ui/button";
import { useLogsList } from "@/features/logs/api/log.queries";
import { cn } from "@/lib/utils";

import { LogsCards } from "./logs-cards";
import { LogsSummaryCards } from "./logs-summary-cards";
import { LogsTable } from "./logs-table";
import { LogsToolbar } from "./logs-toolbar";

export function LogsView() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [tableView, setTableView] = useState(false);
  const page = Number(searchParams.get("page") ?? "1");
  const search = searchParams.get("search") ?? "";
  const status = searchParams.get("status") ?? "all";
  const moduleType = searchParams.get("moduleType") ?? "all";
  const severity = searchParams.get("severity") ?? "all";
  const { data, isLoading, isError } = useLogsList({
    page,
    limit: 20,
    search,
    status: status === "all" ? undefined : status,
    moduleType: moduleType === "all" ? undefined : moduleType,
    severity: severity === "all" ? undefined : severity,
  });
  const logs = data?.data ?? [];
  const meta = data?.meta;

  function updateQuery(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());

    if (!value || value === "all") params.delete(key);
    else params.set(key, value);

    if (key !== "page") params.set("page", "1");

    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname);
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <DashboardPageHeader
        title="Logs"
        description="Review voice logs, AI extracted fields, and planner status."
        action={
          <Link
            href="/admin/logs/create"
            className={cn(buttonVariants(), "rounded-xl")}
          >
            <AppIcon name="plus" className="size-4" />
            Create Log
          </Link>
        }
      />

      {isLoading ? (
        <MasterCardGridSkeleton />
      ) : (
        <LogsSummaryCards logs={logs} totalItems={meta?.totalItems ?? logs.length} />
      )}

      <div className="space-y-3">
        <LogsToolbar
          search={search}
          status={status}
          moduleType={moduleType}
          severity={severity}
          onSearchChange={(value) => updateQuery("search", value)}
          onStatusChange={(value) => updateQuery("status", value)}
          onModuleTypeChange={(value) => updateQuery("moduleType", value)}
          onSeverityChange={(value) => updateQuery("severity", value)}
          tableView={tableView}
          onTableViewChange={setTableView}
        />
        {meta ? (
          <TablePagination
            page={meta.page}
            totalPages={meta.totalPages}
            startItem={meta.totalItems ? meta.offset + 1 : 0}
            endItem={Math.min(meta.offset + meta.limit, meta.totalItems)}
            totalItems={meta.totalItems}
            canPrevious={meta.hasPreviousPage}
            canNext={meta.hasNextPage}
            onPageChange={(nextPage) => updateQuery("page", String(nextPage))}
            onPrevious={() => updateQuery("page", String(Math.max(1, page - 1)))}
            onNext={() => updateQuery("page", String(page + 1))}
          />
        ) : null}
        {isLoading ? (
          tableView ? <DashboardCard><MasterTableSkeleton columns={9} /></DashboardCard> : <LogsCardGridSkeleton />
        ) : null}
        {isError ? (
          <DashboardCard>
            <p className="p-5 text-sm text-muted-foreground">
              Could not load logs.
            </p>
          </DashboardCard>
        ) : null}
        {!isLoading && !isError ? (
          tableView ? <DashboardCard><LogsTable logs={logs} /></DashboardCard> : <LogsCards logs={logs} />
        ) : null}
      </div>
    </div>
  );
}
