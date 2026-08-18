"use client";

import { Download, FileSpreadsheet, RotateCcw } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import { DatePickerField } from "@/components/common/date-picker-field";
import { DashboardPageHeader } from "@/components/common/dashboard-ui";
import { LoadingSpinner } from "@/components/common/loading-spinner";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  downloadOutputReport,
  getOutputReportSummary,
  type OutputReportSummary,
} from "@/features/reports/api/output-report.api";
import { showApiErrorToast } from "@/lib/api/error-toast";
import { cn } from "@/lib/utils";

const summaryItems: Array<{
  key: keyof OutputReportSummary["counts"];
  label: string;
}> = [
  { key: "equipmentLog", label: "Equipment Logs" },
  { key: "safetyLog", label: "Safety Logs" },
  { key: "measuringPointsLog", label: "Measuring Point Readings" },
  { key: "meterCountersLog", label: "Meter Counter Readings" },
  { key: "shiftLog", label: "Shift Logs" },
  { key: "kaizenLog", label: "Kaizen Logs" },
  { key: "masterLog", label: "Master Log Rows" },
];

export function OutputReportView() {
  const defaults = useMemo(() => getCurrentMonthRange(), []);
  const [fromDate, setFromDate] = useState(defaults.fromDate);
  const [toDate, setToDate] = useState(defaults.toDate);
  const [summary, setSummary] = useState<OutputReportSummary | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const canDownload = Boolean(summary?.hasRecords && !isGenerating && !isDownloading);

  async function handleGenerate() {
    if (!fromDate || !toDate) {
      toast.error("Select From Date and To Date.");
      return;
    }

    try {
      setIsGenerating(true);
      const response = await getOutputReportSummary({ fromDate, toDate });
      setSummary(response.data ?? null);
    } catch (error) {
      setSummary(null);
      showApiErrorToast(error, "Could not generate report summary");
    } finally {
      setIsGenerating(false);
    }
  }

  async function handleDownload() {
    if (!canDownload) return;

    try {
      setIsDownloading(true);
      const file = await downloadOutputReport({ fromDate, toDate });
      const url = URL.createObjectURL(file.blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = file.filename;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
    } catch (error) {
      showApiErrorToast(error, "Could not download Excel report");
    } finally {
      setIsDownloading(false);
    }
  }

  function handleReset() {
    setFromDate(defaults.fromDate);
    setToDate(defaults.toDate);
    setSummary(null);
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <DashboardPageHeader
        title="VoxLogiX Output Report"
        description="Generate a date-range Excel workbook across operational modules."
        hideDescriptionOnMobile
        action={
          <Link href="/admin/reports" className={cn(buttonVariants({ variant: "outline" }), "rounded-xl")}>
            <FileSpreadsheet className="size-4" />
            Reports
          </Link>
        }
      />

      <section className="rounded-2xl border border-border bg-card p-4 shadow-sm">
        <div className="grid gap-3 md:grid-cols-[1fr_1fr_auto_auto_auto] md:items-end">
          <label className="space-y-1.5">
            <span className="text-sm font-medium text-foreground">From Date</span>
            <DatePickerField value={fromDate} onChange={setFromDate} placeholder="From date" />
          </label>
          <label className="space-y-1.5">
            <span className="text-sm font-medium text-foreground">To Date</span>
            <DatePickerField value={toDate} onChange={setToDate} placeholder="To date" />
          </label>
          <Button type="button" variant="outline" onClick={handleReset}>
            <RotateCcw className="size-4" />
            Reset
          </Button>
          <Button type="button" onClick={handleGenerate} disabled={isGenerating}>
            {isGenerating ? <LoadingSpinner className="[&_svg]:size-4" /> : <FileSpreadsheet className="size-4" />}
            Generate Report
          </Button>
          <Button type="button" onClick={handleDownload} disabled={!canDownload}>
            {isDownloading ? <LoadingSpinner className="[&_svg]:size-4" /> : <Download className="size-4" />}
            Download Excel
          </Button>
        </div>
      </section>

      <section className="rounded-2xl border border-border bg-card p-4 shadow-sm">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-base font-semibold text-foreground">Report Summary</h2>
            <p className="text-sm text-muted-foreground">
              {summary
                ? `${summary.company.name} - ${summary.range.fromDate} to ${summary.range.toDate}`
                : "Generate a report to preview module counts before downloading."}
            </p>
          </div>
          {summary ? (
            <span className="text-sm font-medium text-foreground">
              Total: {summary.counts.total.toLocaleString()}
            </span>
          ) : null}
        </div>

        {isGenerating ? (
          <div className="flex min-h-40 items-center justify-center">
            <LoadingSpinner />
          </div>
        ) : summary ? (
          summary.hasRecords ? (
            <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {summaryItems.map((item) => (
                <div key={item.key} className="rounded-xl border border-border bg-secondary/40 p-4">
                  <p className="text-sm text-muted-foreground">{item.label}</p>
                  <p className="mt-2 text-2xl font-semibold text-foreground">
                    {summary.counts[item.key].toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-4 rounded-xl border border-dashed border-border p-8 text-center">
              <p className="text-sm font-medium text-foreground">No records found for the selected date range.</p>
              <p className="mt-1 text-sm text-muted-foreground">Download is disabled until the range has report data.</p>
            </div>
          )
        ) : (
          <div
            className={cn(
              "mt-4 rounded-xl border border-dashed border-border p-8 text-center",
              "text-sm text-muted-foreground",
            )}
          >
            Select a date range and generate the summary.
          </div>
        )}
      </section>
    </div>
  );
}

function getCurrentMonthRange() {
  const now = new Date();
  const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
  const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  return {
    fromDate: toDateValue(firstDay),
    toDate: toDateValue(lastDay),
  };
}

function toDateValue(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}
