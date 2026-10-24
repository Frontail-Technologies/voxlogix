"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { LogStatusBadge } from "@/components/admin/logs/log-badges";
import {
  DashboardCard,
  DashboardPageHeader,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/common/dashboard-ui";
import { EntityAvatar } from "@/components/common/entity-avatar";
import { MoreFiltersSheet } from "@/components/common/more-filters-sheet";
import { ResponsiveSearchControl } from "@/components/common/responsive-search-control";
import { TablePagination } from "@/components/common/table-pagination";
import { TruncatedText } from "@/components/common/truncated-text";
import { MasterTableSkeleton } from "@/components/master/master-skeletons";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { useLogsList } from "@/features/logs/api/log.queries";
import type { AdminLogListItem } from "@/features/logs/api/log.types";
import { formatLogDate, logLabel } from "@/features/logs/log.presentation";
import { useCompaniesList } from "@/features/master-companies/api/company.queries";
import { useModulesList } from "@/features/master-modules/api/module.queries";

function dateBoundaryIso(value: string, boundary: "start" | "end") {
  if (!value) return undefined;

  const time = boundary === "start" ? "00:00:00.000" : "23:59:59.999";
  const date = new Date(`${value}T${time}`);
  return Number.isNaN(date.getTime()) ? undefined : date.toISOString();
}

export function CompanyLogsView() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const page = Number(searchParams.get("page") ?? "1");
  const search = searchParams.get("search") ?? "";
  const companyId = searchParams.get("companyId") ?? "all";
  const moduleType = searchParams.get("moduleType") ?? "all";
  const dateFrom = searchParams.get("dateFrom") ?? "";
  const dateTo = searchParams.get("dateTo") ?? "";
  const logsQuery = useLogsList({
    page,
    limit: 20,
    search: search || undefined,
    companyId: companyId === "all" ? undefined : companyId,
    moduleType: moduleType === "all" ? undefined : moduleType,
    dateFrom: dateBoundaryIso(dateFrom, "start"),
    dateTo: dateBoundaryIso(dateTo, "end"),
  });
  const companiesQuery = useCompaniesList({ page: 1, limit: 100 });
  const modulesQuery = useModulesList({ page: 1, limit: 100, status: "ACTIVE" });
  const logs = logsQuery.data?.data ?? [];
  const meta = logsQuery.data?.meta;
  const moduleOptions = Array.from(
    new Map(
      (modulesQuery.data?.data ?? []).map((module) => [
        module.type,
        logLabel(module.type),
      ]),
    ).entries(),
  ).map(([value, label]) => ({ value, label }));

  function updateQuery(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());

    if (!value || value === "all") params.delete(key);
    else params.set(key, value);
    if (key !== "page") params.set("page", "1");

    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname);
  }

  const activeFilterCount = [
    companyId !== "all",
    moduleType !== "all",
    Boolean(dateFrom),
    Boolean(dateTo),
  ].filter(Boolean).length;

  return (
    <div className="space-y-4 sm:space-y-6">
      <DashboardPageHeader
        title="Company Logs"
        description="Read-only operational logs across all companies."
      />

      <div className="flex flex-wrap items-center gap-2">
        <ResponsiveSearchControl
          placeholder="Search logs, companies, equipment..."
          desktopClassName="sm:w-80"
          value={search}
          onChange={(value) => updateQuery("search", value)}
        />
        <MoreFiltersSheet
          activeCount={activeFilterCount}
          title="Company Log Filters"
          description="Narrow logs by company, module, or created date."
        >
          <FilterSelect
            label="Company"
            value={companyId}
            placeholder="All Companies"
            onChange={(value) => updateQuery("companyId", value)}
            options={(companiesQuery.data?.data ?? []).map((company) => ({
              value: company.id,
              label: company.name,
            }))}
          />
          <FilterSelect
            label="Module"
            value={moduleType}
            placeholder="All Modules"
            onChange={(value) => updateQuery("moduleType", value)}
            options={moduleOptions}
          />
          <div className="space-y-2">
            <Label htmlFor="company-logs-date-from">From Date</Label>
            <Input
              id="company-logs-date-from"
              type="date"
              value={dateFrom}
              onChange={(event) => updateQuery("dateFrom", event.target.value)}
              className="h-11 rounded-xl bg-secondary/70"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="company-logs-date-to">To Date</Label>
            <Input
              id="company-logs-date-to"
              type="date"
              value={dateTo}
              onChange={(event) => updateQuery("dateTo", event.target.value)}
              className="h-11 rounded-xl bg-secondary/70"
            />
          </div>
        </MoreFiltersSheet>
      </div>

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

      <DashboardCard>
        {logsQuery.isLoading ? <MasterTableSkeleton columns={7} /> : null}
        {logsQuery.isError ? (
          <p className="p-5 text-sm text-muted-foreground">
            Could not load company logs.
          </p>
        ) : null}
        {!logsQuery.isLoading && !logsQuery.isError ? (
          <CompanyLogsTable logs={logs} />
        ) : null}
      </DashboardCard>
    </div>
  );
}

type FilterSelectProps = {
  label: string;
  value: string;
  placeholder: string;
  options: Array<{ value: string; label: string }>;
  onChange: (value: string) => void;
};

function FilterSelect({ label, value, placeholder, options, onChange }: FilterSelectProps) {
  const selectedLabel =
    value === "all"
      ? placeholder
      : options.find((option) => option.value === value)?.label ?? logLabel(value);

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Select
        value={value}
        onValueChange={(nextValue) => nextValue && onChange(nextValue)}
      >
        <SelectTrigger className="h-11 w-full rounded-xl bg-secondary/70">
          <span className="truncate">{selectedLabel}</span>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">{placeholder}</SelectItem>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

function CompanyLogsTable({ logs }: { logs: AdminLogListItem[] }) {
  return (
    <Table className="[&_td]:py-3">
      <TableHeader>
        <TableRow>
          <TableHead>Log</TableHead>
          <TableHead>Company</TableHead>
          <TableHead>Module</TableHead>
          <TableHead>Equipment</TableHead>
          <TableHead>Creator</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {logs.length ? (
          logs.map((log) => (
            <TableRow key={log.id}>
              <TableCell className="max-w-64 whitespace-normal">
                <Link href={`/master/logs/${log.id}`} className="block">
                  <TruncatedText
                    text={log.title}
                    className="w-56 font-medium text-foreground"
                  />
                  <p className="text-xs text-muted-foreground">{log.logNumber}</p>
                </Link>
              </TableCell>
              <TableCell className="font-medium text-foreground">
                {log.company?.name ?? "-"}
              </TableCell>
              <TableCell>{logLabel(log.moduleType)}</TableCell>
              <TableCell>
                <p className="text-foreground">
                  {log.equipment?.name ?? "General activity"}
                </p>
                {log.equipment?.equipmentCode ? (
                  <p className="text-xs text-muted-foreground">
                    {log.equipment.equipmentCode}
                  </p>
                ) : null}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <EntityAvatar
                    initials={log.createdBy?.initials ?? "SY"}
                    className="size-8"
                    fallbackClassName="text-xs"
                  />
                  <span>{log.createdBy?.fullName ?? "System"}</span>
                </div>
              </TableCell>
              <TableCell className="text-muted-foreground">
                {formatLogDate(log.createdAt)}
              </TableCell>
              <TableCell>
                <LogStatusBadge status={log.status} />
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell
              colSpan={7}
              className="py-8 text-center text-muted-foreground"
            >
              No company logs found.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
