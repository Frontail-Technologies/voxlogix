"use client";

import { useMemo, useRef, useState, type ChangeEvent, type DragEvent } from "react";
import { toast } from "sonner";

import { AppIcon, type AppIconName } from "@/components/common/app-icon";
import {
  CardContent,
  CardHeader,
  CardTitle,
  DashboardCard,
  DashboardPageHeader,
  StatusBadge,
} from "@/components/common/dashboard-ui";
import { Button } from "@/components/ui/button";
import { useImportFinalMasterDataTemplate } from "@/features/admin-master-data/api/master-data.mutations";
import { useModulesList } from "@/features/master-modules/api/module.queries";
import type { MasterDataImportResult } from "@/features/admin-master-data/api/master-data.types";
import { showApiErrorToast } from "@/lib/api/error-toast";
import { apiEndpoints } from "@/lib/api/endpoints";
import { cn } from "@/lib/utils";

type WorkbookDataSource = {
  name: string;
  icon: AppIconName;
  description: string;
  requiredModules?: string[];
};

type WorkbookSheetPreview = {
  name: string;
  supported: boolean;
  accessVisible: boolean;
  totalRows: number;
  headers: string[];
  rows: string[][];
};

type WorkbookPreview = {
  sheets: WorkbookSheetPreview[];
  totalRows: number;
};

const WORKBOOK_DATA_SOURCES: WorkbookDataSource[] = [
  {
    name: "Equipment Master",
    icon: "equipment",
    description: "Assets, sections, criticality, categories, map links, and equipment metadata.",
  },
  {
    name: "Issue Categories",
    icon: "warning",
    description: "Issue labels, function, failure mode, maintenance type, severity, and impact mapping.",
  },
  {
    name: "Safety Reporting",
    icon: "permissions",
    description: "Safety categories, incident types, PPE, reportable flags, and action requirements.",
    requiredModules: ["safety log"],
  },
  {
    name: "Measuring Points",
    icon: "activity",
    description: "Manual measurement points, limits, units, frequency, and alert severity.",
    requiredModules: ["measurement point"],
  },
  {
    name: "Meter Counters",
    icon: "database",
    description: "Manual counter readings, reset values, expected consumption, and deviation limits.",
    requiredModules: ["meter counter"],
  },
  {
    name: "Users & Roles",
    icon: "users",
    description: "Company admins, planners, supervisors, operators, and execution users.",
  },
  {
    name: "Kaizen",
    icon: "ai",
    description: "Suggestion categories, department, status, and immediate-action settings.",
    requiredModules: ["kaizen"],
  },
  {
    name: "Sections/Locations/Shift",
    icon: "planning",
    description: "Plant, unit, section, sub-location, shift details, and department mapping.",
  },
];

const ACCEPTED_FILE_TYPES = [
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
];

function isSpreadsheet(file: File) {
  const lowerName = file.name.toLowerCase();
  return (
    ACCEPTED_FILE_TYPES.includes(file.type) ||
    lowerName.endsWith(".xlsx") ||
    lowerName.endsWith(".xls")
  );
}

function formatFileSize(size: number) {
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${Math.round(size / 1024)} KB`;
  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}

function normalizeSheetName(value: string) {
  return value.trim().toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, " ").trim();
}

function cellText(value: unknown) {
  if (value === null || value === undefined) return "";
  if (value instanceof Date) return value.toLocaleDateString();
  if (typeof value === "object") {
    if ("text" in value && typeof value.text === "string") return value.text;
    if ("result" in value) return cellText(value.result);
    if ("richText" in value && Array.isArray(value.richText)) {
      return value.richText.map((part: { text?: string }) => part.text ?? "").join("");
    }
    return String(value);
  }
  return String(value);
}

function compactRow(values: unknown) {
  const rawValues = Array.isArray(values) ? values.slice(1) : Object.values(values as Record<string, unknown>);
  return rawValues.map(cellText);
}

async function buildWorkbookPreview(file: File, visibleSources: WorkbookDataSource[]) {
  const ExcelJS = await import("exceljs");
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.load(await file.arrayBuffer());
  const supportedNames = new Set(WORKBOOK_DATA_SOURCES.map((source) => normalizeSheetName(source.name)));
  const visibleNames = new Set(visibleSources.map((source) => normalizeSheetName(source.name)));
  const sheets: WorkbookSheetPreview[] = [];

  workbook.eachSheet((worksheet) => {
    const sheetName = worksheet.name;
    const normalizedName = normalizeSheetName(sheetName);
    const rowValues: string[][] = [];

    worksheet.eachRow((row) => {
      const values = compactRow(row.values);
      if (values.some(Boolean)) rowValues.push(values);
    });

    const headers = rowValues[0] ?? [];
    const rows = rowValues.slice(1, 6);
    sheets.push({
      name: sheetName,
      supported: supportedNames.has(normalizedName),
      accessVisible: visibleNames.has(normalizedName),
      totalRows: Math.max(0, rowValues.length - 1),
      headers,
      rows,
    });
  });

  return {
    sheets,
    totalRows: sheets.reduce((total, sheet) => total + sheet.totalRows, 0),
  } satisfies WorkbookPreview;
}

export function MasterDataImportWizard() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [result, setResult] = useState<MasterDataImportResult | null>(null);
  const [preview, setPreview] = useState<WorkbookPreview | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [previewError, setPreviewError] = useState<string | null>(null);
  const [isParsingPreview, setIsParsingPreview] = useState(false);
  const [isDownloadingSample, setIsDownloadingSample] = useState(false);

  const importMutation = useImportFinalMasterDataTemplate();
  const modulesQuery = useModulesList({ page: 1, limit: 100, status: "ACTIVE" });
  const enabledModules = new Set(
    (modulesQuery.data?.data ?? []).map((module) => module.name.trim().toLowerCase()),
  );
  const visibleWorkbookSources = WORKBOOK_DATA_SOURCES.filter((sheet) => {
    if (!sheet.requiredModules?.length) return true;
    if (modulesQuery.isLoading || modulesQuery.isError) return false;
    return sheet.requiredModules.some((moduleName) => enabledModules.has(moduleName));
  });

  const totals = useMemo(() => {
    if (!result) return null;

    return result.sheets.reduce(
      (current, sheet) => ({
        imported: current.imported + sheet.imported,
        created: current.created + (sheet.created ?? 0),
        updated: current.updated + (sheet.updated ?? 0),
        unchanged: current.unchanged + (sheet.unchanged ?? 0),
        skipped: current.skipped + sheet.skipped,
        errors: current.errors + sheet.errors.length,
      }),
      { imported: 0, created: 0, updated: 0, unchanged: 0, skipped: 0, errors: 0 },
    );
  }, [result]);

  async function selectFile(nextFile: File) {
    if (!isSpreadsheet(nextFile)) {
      setFileError("Upload a valid Excel file (.xlsx or .xls).");
      return;
    }

    setFile(nextFile);
    setResult(null);
    setPreview(null);
    setFileError(null);
    setPreviewError(null);
    setIsParsingPreview(true);

    try {
      const nextPreview = await buildWorkbookPreview(nextFile, visibleWorkbookSources);
      setPreview(nextPreview);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Could not read workbook preview.";
      setPreviewError(message);
      toast.error(message);
    } finally {
      setIsParsingPreview(false);
    }
  }

  function handleFileInput(event: ChangeEvent<HTMLInputElement>) {
    const selectedFile = event.target.files?.[0];
    event.target.value = "";
    if (selectedFile) void selectFile(selectedFile);
  }

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setIsDragging(false);

    const droppedFile = event.dataTransfer.files?.[0];
    if (droppedFile) void selectFile(droppedFile);
  }

  async function handleDownloadSample() {
    setIsDownloadingSample(true);

    try {
      const response = await fetch(`${apiEndpoints.baseUrl}${apiEndpoints.masterDataImports.sampleTemplate}`, {
        cache: "no-store",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Could not download sample template.");
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = "VoxLogiX-Master-Data-Sample.xlsx";
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      URL.revokeObjectURL(url);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not download sample template.");
    } finally {
      setIsDownloadingSample(false);
    }
  }

  async function handleImport() {
    if (!file) {
      setFileError("Choose an Excel file before importing.");
      return;
    }

    try {
      const response = await importMutation.mutateAsync(file);
      if (!response.data) {
        throw new Error("Import completed without a summary.");
      }

      setResult(response.data);
      setFile(null);
      setPreview(null);
      setPreviewError(null);
      setFileError(null);
      toast.success("Master data imported");
    } catch (error) {
      showApiErrorToast(error, "Could not import master data");
    }
  }

  const isImporting = importMutation.isPending;

  return (
    <div className="space-y-4 sm:space-y-6">
      <DashboardPageHeader
        title="Import Master Data"
        action={(
          <Button type="button" variant="outline" className="rounded-xl" disabled={isDownloadingSample} onClick={handleDownloadSample}>
            <AppIcon name="download" className="size-4" />
            {isDownloadingSample ? "Preparing..." : "Download Sample"}
          </Button>
        )}
      />

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.05fr)_minmax(360px,0.95fr)]">
        <DashboardCard>
          <CardHeader className="px-4 py-3 sm:px-5 sm:py-4">
            <CardTitle>Final Business Template</CardTitle>
            <p className="text-sm text-muted-foreground">
              Upload the complete Excel template once. The server will map every supported sheet into company master data.
            </p>
          </CardHeader>
          <CardContent className="space-y-4 px-4 pb-4 sm:px-5 sm:pb-5">
            <div
              onDragOver={(event) => {
                event.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              className={cn(
                "flex min-h-56 flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed p-6 text-center transition-colors",
                isDragging ? "border-primary bg-primary/5" : "border-border bg-secondary/40",
              )}
            >
              <div className="flex size-12 items-center justify-center rounded-2xl bg-primary/12 text-primary">
                <AppIcon name="upload" className="size-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">
                  Drop the VoxLogiX master data template here
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Supports .xlsx and .xls files. Keep the original sheet names and headers.
                </p>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx,.xls"
                className="hidden"
                onChange={handleFileInput}
              />
              <Button
                type="button"
                variant="outline"
                className="rounded-xl"
                onClick={() => fileInputRef.current?.click()}
              >
                <AppIcon name="upload" className="size-4" />
                Choose Excel
              </Button>
            </div>

            {file ? (
              <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border bg-card px-4 py-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-foreground">{file.name}</p>
                  <p className="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="ghost"
                    className="rounded-xl"
                    disabled={isImporting}
                    onClick={() => {
                      setFile(null);
                      setResult(null);
                      setPreview(null);
                      setFileError(null);
                      setPreviewError(null);
                    }}
                  >
                    Clear
                  </Button>
                  <Button
                    type="button"
                    className="rounded-xl"
                    disabled={isImporting || isParsingPreview || !preview || Boolean(previewError)}
                    onClick={() => void handleImport()}
                  >
                    <AppIcon name="database" className="size-4" />
                    {isImporting ? "Importing..." : isParsingPreview ? "Reading..." : "Import Template"}
                  </Button>
                </div>
              </div>
            ) : null}

            {fileError ? (
              <p className="text-sm font-medium text-destructive">{fileError}</p>
            ) : null}

            {isParsingPreview ? (
              <div className="rounded-2xl border border-border bg-secondary/35 p-4 text-sm text-muted-foreground">
                Reading workbook preview...
              </div>
            ) : null}

            {previewError ? (
              <div className="rounded-2xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
                {previewError}
              </div>
            ) : null}

            {preview ? <WorkbookPreviewPanel preview={preview} /> : null}
          </CardContent>
        </DashboardCard>

        <DashboardCard>
          <CardHeader className="px-4 py-3 sm:px-5 sm:py-4">
            <CardTitle>Workbook Sheets Included</CardTitle>
            <p className="text-sm text-muted-foreground">
              Showing common sheets and sheets allowed by enabled company modules.
            </p>
          </CardHeader>
          <CardContent className="grid gap-2 px-4 pb-4 sm:px-5 sm:pb-5">
            {visibleWorkbookSources.map((sheet) => (
              <div key={sheet.name} className="flex gap-3 rounded-xl border border-border bg-secondary/40 p-3">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/12 text-primary">
                  <AppIcon name={sheet.icon} className="size-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-foreground">{sheet.name}</p>
                  <p className="mt-0.5 text-xs leading-5 text-muted-foreground">{sheet.description}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </DashboardCard>
      </div>

      {result ? (
        <DashboardCard>
          <CardHeader className="px-4 py-3 sm:px-5 sm:py-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <CardTitle>Import Summary</CardTitle>
                <p className="text-sm text-muted-foreground">{result.fileName}</p>
              </div>
              {totals ? (
                <div className="flex flex-wrap gap-2 text-xs">
                  <StatusBadge status={`${totals.imported} imported`} />
                  <StatusBadge status={`${totals.created} created`} />
                  <StatusBadge status={`${totals.updated} updated`} />
                  <StatusBadge status={`${totals.skipped} skipped`} />
                  {totals.errors ? <StatusBadge status={`${totals.errors} errors`} /> : null}
                </div>
              ) : null}
            </div>
          </CardHeader>
          <CardContent className="space-y-3 px-4 pb-4 sm:px-5 sm:pb-5">
            {result.sheets.map((sheet) => (
              <div key={sheet.sheet} className="rounded-xl border border-border bg-secondary/35 p-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-sm font-medium text-foreground">{sheet.sheet}</p>
                  <div className="flex flex-wrap gap-2 text-xs">
                    <span className="rounded-md bg-emerald-500/12 px-2 py-1 text-emerald-700 dark:text-emerald-300">
                      {sheet.imported} imported
                    </span>
                    <span className="rounded-md bg-blue-500/12 px-2 py-1 text-blue-700 dark:text-blue-300">
                      {(sheet.created ?? 0)} created
                    </span>
                    <span className="rounded-md bg-amber-500/12 px-2 py-1 text-amber-700 dark:text-amber-300">
                      {(sheet.updated ?? 0)} updated
                    </span>
                    <span className="rounded-md bg-muted px-2 py-1 text-muted-foreground">
                      {sheet.skipped} skipped
                    </span>
                    {sheet.errors.length ? (
                      <span className="rounded-md bg-destructive/12 px-2 py-1 text-destructive">
                        {sheet.errors.length} errors
                      </span>
                    ) : null}
                  </div>
                </div>
                {sheet.errors.length ? (
                  <div className="mt-3 space-y-1 border-t border-border pt-3">
                    {sheet.errors.slice(0, 5).map((error) => (
                      <p key={error} className="text-xs leading-5 text-destructive">
                        {error}
                      </p>
                    ))}
                    {sheet.errors.length > 5 ? (
                      <p className="text-xs text-muted-foreground">
                        {sheet.errors.length - 5} more error(s) hidden.
                      </p>
                    ) : null}
                  </div>
                ) : null}
              </div>
            ))}
          </CardContent>
        </DashboardCard>
      ) : null}
    </div>
  );
}






function WorkbookPreviewPanel({ preview }: { preview: WorkbookPreview }) {
  return (
    <div className="space-y-3 rounded-2xl border border-border bg-card p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <p className="text-sm font-semibold text-foreground">Preview Before Import</p>
          <p className="text-xs text-muted-foreground">
            {preview.sheets.length} sheet(s), {preview.totalRows} data row(s). Import will run only after confirmation.
          </p>
        </div>
      </div>
      <div className="space-y-3">
        {preview.sheets.map((sheet) => <WorkbookSheetPreviewCard key={sheet.name} sheet={sheet} />)}
      </div>
    </div>
  );
}

function WorkbookSheetPreviewCard({ sheet }: { sheet: WorkbookSheetPreview }) {
  return (
    <div className="rounded-xl border border-border bg-secondary/35 p-3">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-foreground">{sheet.name}</p>
          <p className="text-xs text-muted-foreground">{sheet.totalRows} data row(s)</p>
        </div>
        <div className="flex flex-wrap gap-1 text-[0.7rem]">
          <span className={cn("rounded-md px-2 py-1", sheet.supported ? "bg-emerald-500/12 text-emerald-700 dark:text-emerald-300" : "bg-destructive/10 text-destructive")}>{sheet.supported ? "Supported" : "Unsupported"}</span>
          {sheet.supported ? <span className={cn("rounded-md px-2 py-1", sheet.accessVisible ? "bg-primary/12 text-primary" : "bg-muted text-muted-foreground")}>{sheet.accessVisible ? "Allowed" : "Not enabled"}</span> : null}
        </div>
      </div>

      {sheet.headers.length ? (
        <div className="mt-3 overflow-x-auto rounded-lg border border-border bg-background">
          <table className="min-w-full text-left text-xs">
            <thead className="bg-muted/70 text-muted-foreground">
              <tr>
                {sheet.headers.slice(0, 8).map((header, index) => <th key={`${sheet.name}-header-${index}`} className="whitespace-nowrap px-3 py-2 font-medium">{header || `Column ${index + 1}`}</th>)}
              </tr>
            </thead>
            <tbody>
              {sheet.rows.length ? sheet.rows.map((row, rowIndex) => (
                <tr key={`${sheet.name}-row-${rowIndex}`} className="border-t border-border">
                  {sheet.headers.slice(0, 8).map((_, columnIndex) => <td key={`${sheet.name}-row-${rowIndex}-${columnIndex}`} className="max-w-44 truncate px-3 py-2 text-muted-foreground">{row[columnIndex] || "-"}</td>)}
                </tr>
              )) : (
                <tr><td colSpan={Math.max(1, sheet.headers.slice(0, 8).length)} className="px-3 py-3 text-center text-muted-foreground">No data rows found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="mt-3 rounded-lg border border-dashed border-border p-3 text-xs text-muted-foreground">No headers found in this sheet.</p>
      )}
    </div>
  );
}
