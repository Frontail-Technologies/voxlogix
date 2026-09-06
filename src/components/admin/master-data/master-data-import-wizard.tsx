"use client";

import { useEffect, useRef, useState, type ChangeEvent, type DragEvent } from "react";
import { toast } from "sonner";

import { AppIcon, type AppIconName } from "@/components/common/app-icon";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  CardContent,
  CardHeader,
  CardTitle,
  DashboardCard,
  DashboardPageHeader,
} from "@/components/common/dashboard-ui";
import { Button } from "@/components/ui/button";
import {
  useCommitMasterDataImport,
  usePreviewMasterDataImport,
} from "@/features/admin-master-data/api/master-data.mutations";
import { useMasterDataImportStore } from "@/features/admin-master-data/store/master-data-import.store";
import { useModulesList } from "@/features/master-modules/api/module.queries";
import { showApiErrorToast } from "@/lib/api/error-toast";
import { apiEndpoints } from "@/lib/api/endpoints";
import { useNavigationGuardStore } from "@/lib/navigation-guard.store";
import { cn } from "@/lib/utils";

import { MasterDataImportPreviewPanel } from "./import-preview/master-data-import-preview";
import { MasterDataImportProgressOverlay } from "./import-preview/master-data-import-progress";
import {
  MasterDataImportErrorPanel,
  MasterDataImportSuccessPanel,
} from "./import-preview/master-data-import-result";

type WorkbookDataSource = {
  name: string;
  icon: AppIconName;
  description: string;
  // Which module gates this sheet, or none for core/shared sheets — mirrors the backend's
  // own SHEET_GATING matrix (master-data-import.service.ts) exactly, so this pre-upload
  // display never claims a sheet is available when the server would reject it.
  requiredModule?: string;
};

const WORKBOOK_DATA_SOURCES: WorkbookDataSource[] = [
  {
    name: "Equipment Master",
    icon: "equipment",
    description: "Assets, sections, criticality, categories, map links, and equipment metadata. Unique ID required for each record.",
  },
  {
    name: "Issue Categories",
    icon: "warning",
    description: "Issue labels, function, failure mode, maintenance type, severity, and impact mapping. Upload values only — unique ID is not required.",
    requiredModule: "equipment log",
  },
  {
    name: "Safety Reporting",
    icon: "permissions",
    description: "Safety categories, incident types, PPE, reportable flags, and action requirements. Upload values only — unique ID is not required.",
    requiredModule: "safety log",
  },
  {
    name: "Measuring Points",
    icon: "activity",
    description: "Manual measurement points, limits, units, frequency, and alert severity. Unique ID required for each record.",
    requiredModule: "measurement point",
  },
  {
    name: "Meter Counters",
    icon: "database",
    description: "Manual counter readings, reset values, expected consumption, and deviation limits. Unique ID required for each record.",
    requiredModule: "meter counter",
  },
  {
    name: "Users & Roles",
    icon: "users",
    description: "Company admins, planners, supervisors, operators, and execution users. Unique ID required for each record.",
  },
  {
    name: "Kaizen",
    icon: "ai",
    description: "Suggestion categories, department, status, and immediate-action settings. Upload values only — unique ID is not required.",
    requiredModule: "kaizen",
  },
  {
    name: "Sections/Locations/Shift",
    icon: "planning",
    description: "Plant, unit, section, sub-location, shift details, and department mapping. Upload values only — unique ID is not required.",
  },
];

const ACCEPTED_FILE_TYPES = [
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
];

function isSpreadsheet(file: File) {
  const lowerName = file.name.toLowerCase();
  return ACCEPTED_FILE_TYPES.includes(file.type) || lowerName.endsWith(".xlsx") || lowerName.endsWith(".xls");
}

function formatFileSize(size: number) {
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${Math.round(size / 1024)} KB`;
  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}

// A quick, local sheet/row count only — no accept/reject classification here, since that
// would duplicate the server's own validation rules (module gating, required fields,
// dedupe). The authoritative classification only ever comes from the preview endpoint,
// requested via "Continue to Preview" below.
async function getWorkbookSummary(file: File) {
  const ExcelJS = await import("exceljs");
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.load(await file.arrayBuffer());

  let sheetCount = 0;
  let totalRows = 0;

  workbook.eachSheet((worksheet) => {
    sheetCount += 1;
    let rowCount = 0;
    worksheet.eachRow((row) => {
      if (Array.isArray(row.values) ? row.values.slice(1).some(Boolean) : Object.values(row.values ?? {}).some(Boolean)) {
        rowCount += 1;
      }
    });
    // First 4 rows are the template's title/description/header/spacer, not data.
    totalRows += Math.max(0, rowCount - 4);
  });

  return { sheetCount, totalRows };
}

export function MasterDataImportWizard() {
  const step = useMasterDataImportStore((state) => state.step);
  const preview = useMasterDataImportStore((state) => state.preview);
  const commitResult = useMasterDataImportStore((state) => state.commitResult);
  const commitError = useMasterDataImportStore((state) => state.commitError);
  const hasUnsavedPreviewChanges = useMasterDataImportStore((state) => state.hasUnsavedPreviewChanges);
  const setPreviewInStore = useMasterDataImportStore((state) => state.setPreview);
  const goToStep = useMasterDataImportStore((state) => state.goToStep);
  const setCommitResult = useMasterDataImportStore((state) => state.setCommitResult);
  const setCommitError = useMasterDataImportStore((state) => state.setCommitError);
  const resetStore = useMasterDataImportStore((state) => state.reset);
  const getOverallCounts = useMasterDataImportStore((state) => state.getOverallCounts);
  const getCommitPayload = useMasterDataImportStore((state) => state.getCommitPayload);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [fileError, setFileError] = useState<string | null>(null);
  const [summary, setSummary] = useState<{ sheetCount: number; totalRows: number } | null>(null);
  const [isReadingWorkbook, setIsReadingWorkbook] = useState(false);
  const [isDownloadingSample, setIsDownloadingSample] = useState(false);
  const [confirmLeaveOpen, setConfirmLeaveOpen] = useState(false);

  const previewMutation = usePreviewMasterDataImport();
  const commitMutation = useCommitMasterDataImport();
  const modulesQuery = useModulesList({ page: 1, limit: 100, status: "ACTIVE" });
  const enabledModules = new Set((modulesQuery.data?.data ?? []).map((module) => module.name.trim().toLowerCase()));

  const setNavigationGuard = useNavigationGuardStore((state) => state.setGuard);
  const isImporting = step === "progress";

  // Guard both in-app navigation (sidebar links) and hard navigation (reload/close tab)
  // for the whole time a commit is in flight — a page leave here can't safely resume or be
  // retried, so it must be actively prevented rather than merely discouraged.
  useEffect(() => {
    setNavigationGuard(isImporting, "Master data import is still in progress.");
    if (!isImporting) return;

    function warnBeforeUnload(event: BeforeUnloadEvent) {
      event.preventDefault();
    }
    window.addEventListener("beforeunload", warnBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", warnBeforeUnload);
      setNavigationGuard(false);
    };
  }, [isImporting, setNavigationGuard]);

  async function selectFile(nextFile: File) {
    if (!isSpreadsheet(nextFile)) {
      setFileError("Upload a valid Excel file (.xlsx or .xls).");
      return;
    }

    setFile(nextFile);
    setFileError(null);
    setSummary(null);
    setIsReadingWorkbook(true);

    try {
      setSummary(await getWorkbookSummary(nextFile));
    } catch (error) {
      const message = error instanceof Error ? error.message : "Could not read this workbook.";
      setFileError(message);
      setFile(null);
    } finally {
      setIsReadingWorkbook(false);
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
      if (!response.ok) throw new Error("Could not download sample template.");

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

  async function handleContinueToPreview() {
    if (!file) return;
    try {
      const response = await previewMutation.mutateAsync(file);
      if (!response.data) throw new Error("Preview completed without a result.");
      setPreviewInStore(response.data, file.name);
      // The File object itself is no longer needed once we have its parsed preview.
      setFile(null);
      setSummary(null);
    } catch (error) {
      showApiErrorToast(error, "Could not read this workbook");
    }
  }

  function handleBackToUpload() {
    if (hasUnsavedPreviewChanges) {
      setConfirmLeaveOpen(true);
      return;
    }
    resetStore();
  }

  function confirmLeavePreview() {
    setConfirmLeaveOpen(false);
    resetStore();
  }

  async function handleConfirmImport() {
    goToStep("progress");
    try {
      const response = await commitMutation.mutateAsync(getCommitPayload());
      if (!response.data) throw new Error("Import completed without a summary.");
      setCommitResult(response.data);
      toast.success("Master data imported");
    } catch (error) {
      setCommitError(error instanceof Error ? error.message : "Could not import master data.");
    }
  }

  if (step === "success" && commitResult) {
    return (
      <MasterDataImportSuccessPanel
        result={commitResult}
        removedCount={getOverallCounts().removed}
        onDone={resetStore}
      />
    );
  }

  if (step === "error") {
    return (
      <MasterDataImportErrorPanel
        message={commitError ?? "Something went wrong while importing."}
        onRetry={() => void handleConfirmImport()}
        onBackToPreview={() => goToStep("preview")}
      />
    );
  }

  if ((step === "preview" || step === "progress") && preview) {
    return (
      <>
        {/* `relative` here — not on some ancestor further up the admin shell — is what lets
            the progress overlay below use `absolute inset-0` and land exactly over this
            panel (the main-content area) without ever reaching the sidebar, which lives in a
            completely separate part of the tree. */}
        <div className="relative">
          <MasterDataImportPreviewPanel
            onBack={handleBackToUpload}
            onConfirm={() => void handleConfirmImport()}
            isConfirming={commitMutation.isPending}
            isBlocked={isImporting}
          />
          {isImporting ? <MasterDataImportProgressOverlay /> : null}
        </div>
        <AlertDialog open={confirmLeaveOpen} onOpenChange={setConfirmLeaveOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Leave import preview?</AlertDialogTitle>
              <AlertDialogDescription>Your preview edits will be discarded.</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="rounded-xl">Stay</AlertDialogCancel>
              <AlertDialogAction className="rounded-xl" onClick={confirmLeavePreview}>
                Leave
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </>
    );
  }

  // Step 1 — upload only. No row-by-row preview lives here anymore; that's the review step.
  // A module-gated sheet is only ever shown once we know for certain it's enabled — never as
  // a muted "not enabled" row. Disabled domains simply aren't shown at all (2026-09 UI review).
  const visibleWorkbookSources = WORKBOOK_DATA_SOURCES.filter((sheet) => {
    if (!sheet.requiredModule) return true;
    if (modulesQuery.isLoading || modulesQuery.isError) return false;
    return enabledModules.has(sheet.requiredModule);
  });

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
            <CardTitle>Master Data Workbook</CardTitle>
            <p className="text-sm text-muted-foreground">
              Upload the complete Excel template once. You&apos;ll review exactly what will be imported before anything is saved.
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
              <div className="flex size-12 items-center justify-center rounded-2xl bg-primary/12 text-icon-strong">
                <AppIcon name="upload" className="size-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">Drop the VoxLogiX master data template here</p>
                <p className="mt-1 text-xs text-muted-foreground">Supports .xlsx and .xls files. Keep the original sheet names and headers.</p>
              </div>
              <input ref={fileInputRef} type="file" accept=".xlsx,.xls" className="hidden" onChange={handleFileInput} />
              <Button type="button" variant="outline" className="rounded-xl" onClick={() => fileInputRef.current?.click()}>
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
                <Button
                  type="button"
                  variant="ghost"
                  className="rounded-xl"
                  onClick={() => {
                    setFile(null);
                    setSummary(null);
                    setFileError(null);
                  }}
                >
                  Clear
                </Button>
              </div>
            ) : null}

            {fileError ? <p className="text-sm font-medium text-destructive">{fileError}</p> : null}

            {isReadingWorkbook ? (
              <div className="rounded-2xl border border-border bg-secondary/35 p-4 text-sm text-muted-foreground">Reading workbook...</div>
            ) : null}

            {summary ? (
              <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-border bg-secondary/40 p-4">
                <div className="text-sm">
                  <p className="font-medium text-foreground">
                    {summary.sheetCount} sheet{summary.sheetCount === 1 ? "" : "s"} detected · {summary.totalRows} total row{summary.totalRows === 1 ? "" : "s"}
                  </p>
                  <p className="text-xs text-muted-foreground">Nothing is imported yet — review what will change on the next screen.</p>
                </div>
                <Button className="rounded-xl" disabled={previewMutation.isPending} onClick={() => void handleContinueToPreview()}>
                  {previewMutation.isPending ? "Reading..." : "Continue to Preview"}
                  <AppIcon name="arrow-right" className="size-4" />
                </Button>
              </div>
            ) : null}
          </CardContent>
        </DashboardCard>

        <DashboardCard>
          <CardHeader className="px-4 py-3 sm:px-5 sm:py-4">
            <CardTitle>Worksheet Sheets Included</CardTitle>
            <p className="text-sm text-muted-foreground">Sheets available for this company&apos;s enabled modules.</p>
          </CardHeader>
          <CardContent className="grid gap-2 px-4 pb-4 sm:px-5 sm:pb-5">
            {/* Only sheets this company can actually import are ever listed here — a module
                that isn't enabled has no row, card, or badge at all (2026-09 UI review). */}
            {visibleWorkbookSources.map((sheet) => (
              <div key={sheet.name} className="flex gap-3 rounded-xl border border-border bg-secondary/40 p-3">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/12 text-icon-strong">
                  <AppIcon name={sheet.icon} className="size-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-foreground">{sheet.name}</p>
                  <p className="mt-0.5 text-xs leading-5 text-muted-foreground">{sheet.description}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </DashboardCard>
      </div>
    </div>
  );
}
