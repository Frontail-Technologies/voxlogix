"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { AppIcon } from "@/components/common/app-icon";
import { DashboardCard, DashboardPageHeader } from "@/components/common/dashboard-ui";
import { TablePagination } from "@/components/common/table-pagination";
import { MasterCardGridSkeleton, MasterTableSkeleton } from "@/components/master/master-skeletons";
import { buttonVariants } from "@/components/ui/button";
import { useAuth } from "@/features/auth/auth-provider";
import { useLogsList } from "@/features/logs/api/log.queries";
import { cn } from "@/lib/utils";

import { LogsSummaryCards } from "../../admin/logs/logs-summary-cards";
import { LogsToolbar } from "../../admin/logs/logs-toolbar";
import { MyLogsGrid } from "./my-logs-grid";
import { MyLogsTable } from "./my-logs-table";

type MyLogsViewProps = {
  viewMode: "table" | "grid";
};

export function MyLogsView({ viewMode }: MyLogsViewProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { user } = useAuth();

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
    createdById: user?.id,
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

  const otherViewHref = viewMode === "table" ? "/execution/my-logs/grid" : "/execution/my-logs/table";

  return (
    <div className="space-y-4 sm:space-y-6">
      <DashboardPageHeader
        title="My Logs"
        description="Logs you have submitted or saved as drafts."
        action={
          <div className="flex items-center gap-2">
            <Link href={otherViewHref} className={cn(buttonVariants({ variant: "outline" }), "rounded-xl")}>
              <AppIcon name={viewMode === "table" ? "package" : "logs"} className="size-4" />
              {viewMode === "table" ? "Grid View" : "Table View"}
            </Link>
            <Link href="/execution/create-log" className={cn(buttonVariants(), "rounded-xl")}>
              <AppIcon name="plus" className="size-4" />
              Create Log
            </Link>
          </div>
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
        />

        {viewMode === "table" ? (
          <DashboardCard>
            {isLoading ? <MasterTableSkeleton columns={7} /> : null}
            {isError ? <p className="p-5 text-sm text-muted-foreground">Could not load logs.</p> : null}
            {!isLoading && !isError ? <MyLogsTable logs={logs} /> : null}
          </DashboardCard>
        ) : (
          <>
            {isLoading ? <MasterCardGridSkeleton /> : null}
            {isError ? <p className="text-sm text-muted-foreground">Could not load logs.</p> : null}
            {!isLoading && !isError ? <MyLogsGrid logs={logs} /> : null}
          </>
        )}

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
      </div>
    </div>
  );
}
