"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { AppIcon } from "@/components/common/app-icon";
import {
  DashboardCard,
  DashboardPageHeader,
} from "@/components/common/dashboard-ui";
import { DeleteConfirmDialog } from "@/components/common/delete-confirm-dialog";
import { TablePagination } from "@/components/common/table-pagination";
import {
  LogsCardGridSkeleton,
  MasterCardGridSkeleton,
  MasterTableSkeleton,
} from "@/components/master/master-skeletons";
import { Button, buttonVariants } from "@/components/ui/button";
import { useBulkDeleteLogs } from "@/features/logs/api/log.mutations";
import { useLogsList } from "@/features/logs/api/log.queries";
import { showApiErrorToast } from "@/lib/api/error-toast";
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
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);
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
  const bulkDeleteMutation = useBulkDeleteLogs();

  // Selection is page/filter-scoped — a row selected on one page shouldn't silently carry
  // into a different page or filter's results. Reset during render (React's "adjusting
  // state on prop change" pattern) rather than in an effect, so it can't flash the stale
  // selection for a frame before clearing.
  const filterKey = `${page}|${search}|${status}|${moduleType}|${severity}`;
  const [lastFilterKey, setLastFilterKey] = useState(filterKey);
  if (filterKey !== lastFilterKey) {
    setLastFilterKey(filterKey);
    setSelectedIds(new Set());
  }

  function toggleSelect(id: string) {
    setSelectedIds((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleSelectAll() {
    setSelectedIds((current) => {
      const allSelected = logs.length > 0 && logs.every((log) => current.has(log.id));
      return allSelected ? new Set() : new Set(logs.map((log) => log.id));
    });
  }

  async function handleBulkDelete() {
    const ids = [...selectedIds];
    try {
      await bulkDeleteMutation.mutateAsync(ids);
      toast.success(`${ids.length} log${ids.length === 1 ? "" : "s"} deleted`);
      setSelectedIds(new Set());
    } catch (error) {
      showApiErrorToast(error, "Could not delete the selected logs");
    }
  }

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
        {tableView && selectedIds.size > 0 ? (
          <div className="flex items-center justify-between gap-3 rounded-xl border border-border bg-muted/40 px-4 py-2.5">
            <p className="text-sm font-medium text-foreground">
              {selectedIds.size} selected
            </p>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={() => setSelectedIds(new Set())}>
                Clear
              </Button>
              <Button variant="destructive" size="sm" onClick={() => setBulkDeleteOpen(true)}>
                <AppIcon name="warning" className="size-4" />
                Delete {selectedIds.size} logs
              </Button>
            </div>
          </div>
        ) : null}
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
          tableView ? (
            <DashboardCard>
              <LogsTable
                logs={logs}
                selectedIds={selectedIds}
                onToggleSelect={toggleSelect}
                onToggleSelectAll={toggleSelectAll}
              />
            </DashboardCard>
          ) : (
            <LogsCards logs={logs} />
          )
        ) : null}
      </div>

      <DeleteConfirmDialog
        open={bulkDeleteOpen}
        onOpenChange={setBulkDeleteOpen}
        title={`Delete ${selectedIds.size} logs?`}
        description="This action cannot be undone."
        confirmLabel={bulkDeleteMutation.isPending ? "Deleting..." : `Delete ${selectedIds.size} logs`}
        onConfirm={handleBulkDelete}
      />
    </div>
  );
}
