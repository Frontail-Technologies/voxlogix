"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { QrCode } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

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
import { DeleteConfirmDialog } from "@/components/common/delete-confirm-dialog";
import { ResponsiveSearchControl } from "@/components/common/responsive-search-control";
import { TablePagination } from "@/components/common/table-pagination";
import { MasterTableSkeleton } from "@/components/master/master-skeletons";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useDeleteImportedMasterData } from "@/features/imported-master-data/api/imported-master-data.mutations";
import { useImportedMasterData } from "@/features/imported-master-data/api/imported-master-data.queries";
import type {
  ImportedMasterDataItem,
  ImportedMasterDataSource,
  LatestReadingSummary,
  PaginationMeta,
} from "@/features/imported-master-data/api/imported-master-data.types";
import { formatMasterDataDate, masterDataLabel, masterDataStatuses } from "@/features/admin-master-data/master-data.presentation";
import { QrLabelDialog } from "@/components/admin/master-data/qr-label-dialog";
import { ImportedMasterDataEditDialog } from "@/components/admin/master-data/imported-master-data-edit-dialog";
import { ImportedMasterDataHistoryDialog } from "@/components/admin/master-data/imported-master-data-history-dialog";
import { showApiErrorToast } from "@/lib/api/error-toast";

const sourceConfigs: Record<
  ImportedMasterDataSource,
  {
    title: string;
    description: string;
    icon: AppIconName;
    searchPlaceholder: string;
    emptyText: string;
    columns: Array<{ label: string; getValue: (item: ImportedMasterDataItem) => string | number | null | undefined }>;
    getUnit?: (item: ImportedMasterDataItem) => string | null | undefined;
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
    getUnit: (item) => "measurementUnit" in item ? item.measurementUnit : null,
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
    getUnit: (item) => "counterUnit" in item ? item.counterUnit : null,
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
  const hasReadingData = source === "measuringPoints" || source === "meterCounters";
  const [qrItem, setQrItem] = useState<ImportedMasterDataItem | null>(null);
  const [editItem, setEditItem] = useState<ImportedMasterDataItem | null>(null);
  const [deleteItem, setDeleteItem] = useState<ImportedMasterDataItem | null>(null);
  const [historyItem, setHistoryItem] = useState<ImportedMasterDataItem | null>(null);
  const deleteMutation = useDeleteImportedMasterData(source);
  const columnCount = config.columns.length + 3 + (hasReadingData ? 1 : 0);

  async function handleDelete() {
    if (!deleteItem) return;
    try {
      await deleteMutation.mutateAsync(deleteItem.id);
      toast.success("Record deactivated");
    } catch (error) {
      showApiErrorToast(error, "Could not delete record");
    }
  }

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
              hasReadingData={hasReadingData}
              onQr={setQrItem}
              onEdit={setEditItem}
              onDelete={setDeleteItem}
              onHistory={setHistoryItem}
            />
          ) : null}
        </DashboardCard>
      </div>
      <ImportedMasterDataEditDialog
        source={source}
        item={editItem}
        open={Boolean(editItem)}
        onOpenChange={(open) => !open && setEditItem(null)}
      />
      {historyItem && (source === "measuringPoints" || source === "meterCounters") ? (
        <ImportedMasterDataHistoryDialog
          source={source}
          item={historyItem}
          open={Boolean(historyItem)}
          onOpenChange={(open) => !open && setHistoryItem(null)}
        />
      ) : null}
      <DeleteConfirmDialog
        open={Boolean(deleteItem)}
        onOpenChange={(open) => !open && setDeleteItem(null)}
        title="Deactivate record?"
        description="This marks the record Inactive and removes it from active lists. Historical readings and logs tied to it are kept, and it can be reactivated later by editing its status."
        confirmLabel={deleteMutation.isPending ? "Deactivating..." : "Deactivate"}
        onConfirm={() => void handleDelete()}
      />
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

function LatestReadingCell({ reading, unit }: { reading: LatestReadingSummary | undefined; unit?: string | null }) {
  if (!reading) {
    return <span className="text-xs text-muted-foreground">No readings yet</span>;
  }
  return (
    <div className="flex flex-col gap-0.5">
      <div className="flex items-center gap-1.5">
        <span className={`size-1.5 shrink-0 rounded-full ${reading.isAlert ? "bg-destructive" : "bg-emerald-500"}`} />
        <span className="font-medium text-foreground">
          {reading.value}
          {unit ? <span className="ml-1 text-xs text-muted-foreground">{unit}</span> : null}
        </span>
      </div>
      <span className="text-xs text-muted-foreground">{formatMasterDataDate(reading.reportedAt)}</span>
    </div>
  );
}

function ImportedDataTable({
  rows,
  config,
  columnCount,
  hasReadingData,
  onQr,
  onEdit,
  onDelete,
  onHistory,
}: {
  rows: ImportedMasterDataItem[];
  config: (typeof sourceConfigs)[ImportedMasterDataSource];
  columnCount: number;
  hasReadingData: boolean;
  onQr: (item: ImportedMasterDataItem) => void;
  onEdit: (item: ImportedMasterDataItem) => void;
  onDelete: (item: ImportedMasterDataItem) => void;
  onHistory: (item: ImportedMasterDataItem) => void;
}) {
  return (
    <Table className="[&_td]:py-3">
      <TableHeader>
        <TableRow>
          <TableHead>Record</TableHead>
          {config.columns.map((column) => (
            <TableHead key={column.label}>{column.label}</TableHead>
          ))}
          {hasReadingData ? <TableHead>Latest Reading</TableHead> : null}
          <TableHead>Updated</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.length ? rows.map((item) => (
          <ImportedDataRow
            key={item.id}
            item={item}
            config={config}
            hasReadingData={hasReadingData}
            onQr={onQr}
            onEdit={onEdit}
            onDelete={onDelete}
            onHistory={onHistory}
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
  hasReadingData,
  onQr,
  onEdit,
  onDelete,
  onHistory,
}: {
  item: ImportedMasterDataItem;
  config: (typeof sourceConfigs)[ImportedMasterDataSource];
  hasReadingData: boolean;
  onQr: (item: ImportedMasterDataItem) => void;
  onEdit: (item: ImportedMasterDataItem) => void;
  onDelete: (item: ImportedMasterDataItem) => void;
  onHistory: (item: ImportedMasterDataItem) => void;
}) {
  const title = "incidentCategory" in item ? item.incidentCategory : "measurementName" in item ? item.measurementName : "counterName" in item ? item.counterName : "category" in item ? item.category : "Imported record";
  const latestReading = "latestReading" in item ? item.latestReading : undefined;
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
      {hasReadingData ? (
        <TableCell>
          <LatestReadingCell reading={latestReading} unit={config.getUnit?.(item)} />
        </TableCell>
      ) : null}
      <TableCell className="text-muted-foreground">
        <div className="flex items-center gap-2">
          <StatusBadge status={masterDataLabel(item.status)} />
          <span>{formatMasterDataDate(item.updatedAt)}</span>
        </div>
      </TableCell>
      <TableCell className="text-right">
        <div className="flex items-center justify-end gap-1.5">
          {hasReadingData ? (
            <Button variant="ghost" size="icon" className="size-8" aria-label="View reading history" onClick={() => onHistory(item)}>
              <AppIcon name="reports" className="size-4" />
            </Button>
          ) : null}
          {hasReadingData ? (
            <Button variant="outline" size="sm" onClick={() => onQr(item)}>
              <QrCode className="size-3.5" />
              QR
            </Button>
          ) : null}
          <Button variant="ghost" size="icon" className="size-8" aria-label="Edit record" onClick={() => onEdit(item)}>
            <AppIcon name="settings" className="size-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="size-8 text-destructive hover:text-destructive"
            aria-label="Delete record"
            onClick={() => onDelete(item)}
          >
            <AppIcon name="trash" className="size-4" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}

function formatCellValue(value: string | number | null | undefined) {
  if (value === null || value === undefined || value === "") return "-";
  if (typeof value === "number") return Number.isInteger(value) ? String(value) : value.toFixed(2);
  return masterDataLabel(value);
}
