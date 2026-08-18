"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { QrCode } from "lucide-react";
import { useMemo, useState } from "react";

import { AppIcon, type AppIconName } from "@/components/common/app-icon";
import {
  DashboardCard,
  DashboardPageHeader,
  StatusBadge,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/common/dashboard-ui";
import { ResponsiveSearchControl } from "@/components/common/responsive-search-control";
import { TablePagination } from "@/components/common/table-pagination";
import { MasterTableSkeleton } from "@/components/master/master-skeletons";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useImportedMasterData } from "@/features/imported-master-data/api/imported-master-data.queries";
import type {
  ImportedMasterDataItem,
  ImportedMasterDataSource,
  PaginationMeta,
} from "@/features/imported-master-data/api/imported-master-data.types";
import { formatMasterDataDate, masterDataLabel, masterDataStatuses } from "@/features/admin-master-data/master-data.presentation";
import { QrLabelDialog } from "@/components/admin/master-data/qr-label-dialog";

const sourceConfigs: Record<
  ImportedMasterDataSource,
  {
    title: string;
    description: string;
    icon: AppIconName;
    searchPlaceholder: string;
    emptyText: string;
    columns: Array<{ label: string; getValue: (item: ImportedMasterDataItem) => string | number | null | undefined }>;
  }
> = {
  safetyReporting: {
    title: "Safety Reporting",
    description: "Imported incident categories, PPE, reportable flags, severity, and action rules.",
    icon: "permissions",
    searchPlaceholder: "Search safety data...",
    emptyText: "No safety reporting data found.",
    columns: [
      { label: "Category", getValue: (item) => "incidentCategory" in item ? item.incidentCategory : null },
      { label: "Incident Type", getValue: (item) => "incidentType" in item ? item.incidentType : null },
      { label: "Severity", getValue: (item) => "severityLevel" in item ? item.severityLevel : null },
      { label: "PPE", getValue: (item) => "requiresPpe" in item ? item.requiresPpe : null },
      { label: "Action", getValue: (item) => "immediateActionRequired" in item ? item.immediateActionRequired : null },
    ],
  },
  measuringPoints: {
    title: "Measuring Points",
    description: "Imported manual measurement points, limits, units, frequency, and alert severity.",
    icon: "activity",
    searchPlaceholder: "Search measuring points...",
    emptyText: "No measuring points found.",
    columns: [
      { label: "Point", getValue: (item) => "measurementName" in item ? item.measurementName : null },
      { label: "Equipment", getValue: (item) => "equipmentCodeSnapshot" in item ? item.equipmentCodeSnapshot : null },
      { label: "Unit", getValue: (item) => "measurementUnit" in item ? item.measurementUnit : null },
      { label: "Lower", getValue: (item) => "lowerLimit" in item ? item.lowerLimit : null },
      { label: "Upper", getValue: (item) => "upperLimit" in item ? item.upperLimit : null },
    ],
  },
  meterCounters: {
    title: "Meter Counters",
    description: "Imported counter definitions, expected consumption, reset values, and deviation limits.",
    icon: "database",
    searchPlaceholder: "Search meter counters...",
    emptyText: "No meter counters found.",
    columns: [
      { label: "Counter", getValue: (item) => "counterName" in item ? item.counterName : null },
      { label: "Equipment", getValue: (item) => "equipmentCodeSnapshot" in item ? item.equipmentCodeSnapshot : null },
      { label: "Unit", getValue: (item) => "counterUnit" in item ? item.counterUnit : null },
      { label: "Expected", getValue: (item) => "expectedDailyConsumption" in item ? item.expectedDailyConsumption : null },
      { label: "Deviation %", getValue: (item) => "alertDeviationPct" in item ? item.alertDeviationPct : null },
    ],
  },
  kaizen: {
    title: "Kaizen",
    description: "Imported suggestion categories, departments, status mapping, and immediate action flags.",
    icon: "ai",
    searchPlaceholder: "Search kaizen data...",
    emptyText: "No kaizen data found.",
    columns: [
      { label: "Category", getValue: (item) => "category" in item ? item.category : null },
      { label: "Department", getValue: (item) => "department" in item ? item.department : null },
      { label: "Status", getValue: (item) => "kaizenStatus" in item ? item.kaizenStatus : null },
      { label: "Immediate Action", getValue: (item) => "immediateActionRequired" in item ? item.immediateActionRequired : null },
    ],
  },
};

export function ImportedMasterDataList({ source }: { source: ImportedMasterDataSource }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const page = Number(searchParams.get("page") ?? "1");
  const search = searchParams.get("search") ?? "";
  const status = searchParams.get("status") ?? "all";
  const config = sourceConfigs[source];
  const { data, isLoading, isError, isFetching } = useImportedMasterData(source, {
    page,
    limit: 20,
    search,
    status: status === "all" ? undefined : status,
  });
  const rows = data?.data ?? [];
  const meta = data?.meta;
  const hasQrAction = source === "measuringPoints" || source === "meterCounters";
  const [qrItem, setQrItem] = useState<ImportedMasterDataItem | null>(null);
  const columnCount = config.columns.length + (hasQrAction ? 3 : 2);

  const subtitle = useMemo(() => {
    if (!meta) return config.description;
    return `${config.description} Showing ${meta.totalItems} records.`;
  }, [config.description, meta]);

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
      <DashboardPageHeader title={config.title} description={subtitle} />

      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <ResponsiveSearchControl
            placeholder={config.searchPlaceholder}
            desktopClassName="sm:w-80"
            value={search}
            onChange={(value) => updateQuery("search", value)}
          />
          <Select value={status} onValueChange={(value) => value && updateQuery("status", value)}>
            <SelectTrigger className="h-10 w-44 rounded-xl bg-secondary/70">
              <span className="truncate">{status === "all" ? "All Statuses" : masterDataLabel(status)}</span>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              {masterDataStatuses.map((item) => (
                <SelectItem key={item.value} value={item.value}>{item.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {isFetching && !isLoading ? <span className="text-xs text-muted-foreground">Refreshing...</span> : null}
        </div>
        {meta ? <ImportedDataPagination meta={meta} page={page} onPageChange={(nextPage) => updateQuery("page", String(nextPage))} /> : null}
        <DashboardCard>
          {isLoading ? <MasterTableSkeleton columns={columnCount} /> : null}
          {isError ? <p className="p-5 text-sm text-muted-foreground">Could not load {config.title.toLowerCase()}.</p> : null}
          {!isLoading && !isError ? (
            <ImportedDataTable
              rows={rows}
              config={config}
              columnCount={columnCount}
              hasQrAction={hasQrAction}
              onQr={setQrItem}
            />
          ) : null}
        </DashboardCard>
      </div>
      {qrItem && "pointCode" in qrItem ? (
        <QrLabelDialog
          open={Boolean(qrItem)}
          onOpenChange={(open) => !open && setQrItem(null)}
          type="measuring-point"
          code={qrItem.pointCode}
          title={qrItem.measurementName}
          subtitle={qrItem.equipmentCodeSnapshot}
        />
      ) : null}
      {qrItem && "counterCode" in qrItem ? (
        <QrLabelDialog
          open={Boolean(qrItem)}
          onOpenChange={(open) => !open && setQrItem(null)}
          type="meter-counter"
          code={qrItem.counterCode}
          title={qrItem.counterName}
          subtitle={qrItem.equipmentCodeSnapshot}
          locationLabel={qrItem.location}
        />
      ) : null}
    </div>
  );
}

function ImportedDataPagination({ meta, page, onPageChange }: { meta: PaginationMeta; page: number; onPageChange: (page: number) => void }) {
  return (
    <TablePagination
      page={meta.page}
      totalPages={meta.totalPages}
      startItem={meta.totalItems ? meta.offset + 1 : 0}
      endItem={Math.min(meta.offset + meta.limit, meta.totalItems)}
      totalItems={meta.totalItems}
      canPrevious={meta.hasPreviousPage}
      canNext={meta.hasNextPage}
      onPageChange={onPageChange}
      onPrevious={() => onPageChange(Math.max(1, page - 1))}
      onNext={() => onPageChange(page + 1)}
    />
  );
}

function ImportedDataTable({
  rows,
  config,
  columnCount,
  hasQrAction,
  onQr,
}: {
  rows: ImportedMasterDataItem[];
  config: (typeof sourceConfigs)[ImportedMasterDataSource];
  columnCount: number;
  hasQrAction: boolean;
  onQr: (item: ImportedMasterDataItem) => void;
}) {
  return (
    <Table className="[&_td]:py-3">
      <TableHeader>
        <TableRow>
          <TableHead>Record</TableHead>
          {config.columns.map((column) => (
            <TableHead key={column.label}>{column.label}</TableHead>
          ))}
          <TableHead>Updated</TableHead>
          {hasQrAction ? <TableHead className="text-right">Actions</TableHead> : null}
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.length ? rows.map((item) => (
          <ImportedDataRow
            key={item.id}
            item={item}
            config={config}
            hasQrAction={hasQrAction}
            onQr={onQr}
          />
        )) : (
          <TableRow>
            <TableCell colSpan={columnCount} className="py-8 text-center text-muted-foreground">{config.emptyText}</TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}

function ImportedDataRow({
  item,
  config,
  hasQrAction,
  onQr,
}: {
  item: ImportedMasterDataItem;
  config: (typeof sourceConfigs)[ImportedMasterDataSource];
  hasQrAction: boolean;
  onQr: (item: ImportedMasterDataItem) => void;
}) {
  const title = "incidentCategory" in item ? item.incidentCategory : "measurementName" in item ? item.measurementName : "counterName" in item ? item.counterName : "category" in item ? item.category : "Imported record";
  return (
    <TableRow>
      <TableCell>
        <div className="flex items-center gap-3">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <AppIcon name={config.icon} className="size-4" />
          </span>
          <div className="min-w-0">
            <p className="truncate font-medium text-foreground">{title || "Untitled"}</p>
            <p className="truncate text-xs text-muted-foreground">Imported record</p>
          </div>
        </div>
      </TableCell>
      {config.columns.map((column) => (
        <TableCell key={column.label} className="text-muted-foreground">
          {formatCellValue(column.getValue(item))}
        </TableCell>
      ))}
      <TableCell className="text-muted-foreground">
        <div className="flex items-center gap-2">
          <StatusBadge status={masterDataLabel(item.status)} />
          <span>{formatMasterDataDate(item.updatedAt)}</span>
        </div>
      </TableCell>
      {hasQrAction ? (
        <TableCell className="text-right">
          <Button variant="outline" size="sm" onClick={() => onQr(item)}>
            <QrCode className="size-3.5" />
            QR
          </Button>
        </TableCell>
      ) : null}
    </TableRow>
  );
}

function formatCellValue(value: string | number | null | undefined) {
  if (value === null || value === undefined || value === "") return "-";
  if (typeof value === "number") return Number.isInteger(value) ? String(value) : value.toFixed(2);
  return masterDataLabel(value);
}
