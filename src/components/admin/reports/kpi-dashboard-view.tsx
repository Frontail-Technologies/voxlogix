"use client";

import {
  Activity,
  AlertTriangle,
  BarChart3,
  Download,
  FileSpreadsheet,
  Gauge,
  RotateCcw,
  ShieldAlert,
  TimerReset,
  TrendingUp,
  Wrench,
} from "lucide-react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState, type ReactNode } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { toast } from "sonner";

import { DatePickerField } from "@/components/common/date-picker-field";
import { DashboardPageHeader } from "@/components/common/dashboard-ui";
import { LoadingSpinner } from "@/components/common/loading-spinner";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  downloadOutputReport,
  getKpiDashboard,
  type KpiDashboard,
} from "@/features/reports/api/output-report.api";
import { showApiErrorToast } from "@/lib/api/error-toast";
import { cn } from "@/lib/utils";

const chartColors = ["#f8b614", "#2563eb", "#16a34a", "#dc2626", "#ea580c", "#7c3aed", "#0891b2", "#64748b"];

type ChartRow = Record<string, string | number | null>;

export function KpiDashboardView() {
  const defaults = useMemo(() => getCurrentMonthRange(), []);
  const [fromDate, setFromDate] = useState(defaults.fromDate);
  const [toDate, setToDate] = useState(defaults.toDate);
  const [queryParams, setQueryParams] = useState(defaults);
  const [isDownloading, setIsDownloading] = useState(false);

  const dashboardQuery = useQuery({
    queryKey: ["reports", "kpi-dashboard", queryParams],
    queryFn: async () => {
      const response = await getKpiDashboard(queryParams);
      return response.data ?? null;
    },
    staleTime: 60_000,
  });

  const dashboard = dashboardQuery.data ?? null;
  const isLoading = dashboardQuery.isLoading;

  function handleGenerate() {
    if (!fromDate || !toDate) {
      toast.error("Select From Date and To Date.");
      return;
    }

    setQueryParams({ fromDate, toDate });
  }

  async function handleDownload() {
    if (!fromDate || !toDate) {
      toast.error("Select From Date and To Date.");
      return;
    }

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
    setQueryParams(defaults);
  }

  const summaryCards = dashboard ? buildSummaryCards(dashboard) : [];

  return (
    <div className="space-y-4 sm:space-y-6">
      <DashboardPageHeader
        title="KPI Dashboard"
        description="Operational KPIs generated from the official Output Report workbook rules."
        hideDescriptionOnMobile
        action={
          <Link href="/admin/reports" className={cn(buttonVariants({ variant: "outline" }), "rounded-xl")}>
            <FileSpreadsheet className="size-4" />
            Reports
          </Link>
        }
      />

      <section className="rounded-2xl border border-border bg-card p-4 shadow-sm">
        <div className="grid gap-3 lg:grid-cols-[1fr_1fr_auto_auto_auto] lg:items-end">
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
          <Button type="button" onClick={handleGenerate} disabled={isLoading}>
            {isLoading ? <LoadingSpinner className="[&_svg]:size-4" /> : <BarChart3 className="size-4" />}
            Generate KPI
          </Button>
          <Button type="button" variant="outline" onClick={handleDownload} disabled={isDownloading}>
            {isDownloading ? <LoadingSpinner className="[&_svg]:size-4" /> : <Download className="size-4" />}
            Download Excel
          </Button>
        </div>
      </section>

      {dashboardQuery.isError ? (
        <section className="rounded-2xl border border-border bg-card p-8 text-center shadow-sm">
          <p className="text-sm font-medium text-foreground">Could not load KPI dashboard.</p>
          <Button className="mt-3" type="button" onClick={() => dashboardQuery.refetch()}>
            Retry
          </Button>
        </section>
      ) : isLoading ? (
        <section className="flex min-h-72 items-center justify-center rounded-2xl border border-border bg-card shadow-sm">
          <LoadingSpinner />
        </section>
      ) : dashboard ? (
        <>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {summaryCards.map((card) => (
              <div key={card.label} className="rounded-2xl border border-border bg-card p-4 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className={cn("flex size-10 shrink-0 items-center justify-center rounded-xl", card.tone)}>
                    <card.icon className="size-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm text-muted-foreground">{card.label}</p>
                    <p className="mt-1 text-2xl font-semibold tracking-normal text-foreground">{card.value}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <KpiSection title="Maintenance And Reliability">
            <ChartCard title="MTTR By Equipment Category" subtitle="Average logged downtime hours.">
              <SimpleBarChart
                data={dashboard.mttrByEquipmentCategory.map((item) => ({
                  name: item.equipmentCategory,
                  value: item.averageDowntimeHours,
                }))}
              />
            </ChartCard>
            <ChartCard title="Downtime By Section" subtitle="Share of total downtime.">
              <SimpleBarChart
                data={dashboard.downtimeBySection.map((item) => ({
                  name: item.section,
                  value: item.totalDowntimeHours,
                }))}
              />
            </ChartCard>
            <ChartCard title="Maintenance Type" subtitle="Planned vs unplanned distribution.">
              <SimplePieChart
                data={dashboard.maintenanceTypeDistribution.items.map((item) => ({
                  name: item.maintenanceType,
                  value: item.count,
                }))}
              />
            </ChartCard>
            <ChartCard title="Breakdown Impact" subtitle="Production impact for breakdown logs only.">
              <SimplePieChart
                data={dashboard.productionImpactBreakdowns.items.map((item) => ({
                  name: item.productionImpact,
                  value: item.count,
                }))}
              />
            </ChartCard>
          </KpiSection>

          <div className="grid gap-4 xl:grid-cols-2">
            <DataTable
              title="Top Repeat Failures"
              columns={["Equipment", "Function", "Failure Mode", "Count"]}
              rows={dashboard.repeatFailures.map((item) => [
                `${item.equipmentId} - ${item.equipmentName}`,
                item.equipmentFunction,
                item.failureMode,
                item.occurrenceCount,
              ])}
            />
            <DataTable
              title="MTBF Proxy"
              columns={["Equipment", "Failures", "Avg Days"]}
              rows={dashboard.mtbfProxyByEquipment.map((item) => [
                `${item.equipmentId} - ${item.equipmentName}`,
                item.failureCount,
                formatNumber(item.averageDaysBetweenFailures),
              ])}
            />
          </div>

          <KpiSection title="Safety">
            <ChartCard title="Safety Incidents By Month" subtitle="Total incidents and critical/high incidents.">
              <SafetyLineChart data={dashboard.safetyMonthlyTrend} />
            </ChartCard>
            <ChartCard title="Safety Severity" subtitle="Incident distribution by severity.">
              <SimplePieChart
                data={dashboard.safetySeverityDistribution.map((item) => ({
                  name: item.severity,
                  value: item.incidentCount,
                }))}
              />
            </ChartCard>
          </KpiSection>

          <DataTable
            title="Reportable Incidents"
            columns={["Metric", "Value"]}
            rows={[
              ["Total safety incidents", dashboard.reportableSafety.totalSafetyIncidents],
              ["Known reportability", dashboard.reportableSafety.knownReportabilityCount],
              ["Unknown reportability", dashboard.reportableSafety.unknownReportabilityCount],
              ["Reportable", dashboard.reportableSafety.reportableCount],
              ["Reportable %", formatPercent(dashboard.reportableSafety.reportablePercent)],
            ]}
          />

          <KpiSection title="Condition Monitoring">
            <ChartCard title="Measuring Points Out Of Limit" subtitle="Manual readings only; feed alerts are separate.">
              <SimpleBarChart
                data={dashboard.measuringPointOutOfLimit.items.map((item) => ({
                  name: item.measurementName,
                  value: item.outOfLimitCount,
                }))}
              />
            </ChartCard>
            <ChartCard title="Meter Counter Deviation" subtitle="Signed average deviation from expected value.">
              <SimpleBarChart
                data={dashboard.meterCounterDeviation.items.map((item) => ({
                  name: item.counterName,
                  value: percentToDisplay(item.averageDeviationPercent),
                }))}
              />
            </ChartCard>
          </KpiSection>

          <KpiSection title="Kaizen">
            <ChartCard title="Status Funnel" subtitle="Closed and implemented count toward closure.">
              <SimpleBarChart
                data={dashboard.kaizenStatusFunnel.items.map((item) => ({
                  name: item.status,
                  value: item.count,
                }))}
              />
            </ChartCard>
            <ChartCard title="Submissions By Category" subtitle="Kaizen category distribution.">
              <SimplePieChart
                data={dashboard.kaizenByCategory.map((item) => ({
                  name: item.category,
                  value: item.count,
                }))}
              />
            </ChartCard>
          </KpiSection>
        </>
      ) : (
        <section className="rounded-2xl border border-dashed border-border bg-card p-8 text-center shadow-sm">
          <p className="text-sm font-medium text-foreground">Generate KPIs for the selected date range.</p>
          <p className="mt-1 text-sm text-muted-foreground">The same backend data is used for the dashboard and Excel workbook.</p>
        </section>
      )}
    </div>
  );
}

function KpiSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="space-y-3">
      <h2 className="text-base font-semibold tracking-normal text-foreground">{title}</h2>
      <div className="grid gap-4 xl:grid-cols-2">{children}</div>
    </section>
  );
}

function ChartCard({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
      <div className="mb-3">
        <h3 className="text-sm font-semibold text-foreground">{title}</h3>
        <p className="text-xs text-muted-foreground">{subtitle}</p>
      </div>
      <div className="h-64">{children}</div>
    </div>
  );
}

function SimpleBarChart({ data }: { data: ChartRow[] }) {
  if (!data.length) return <EmptyChart />;

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 12, right: 12, left: -20, bottom: 8 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
        <XAxis dataKey="name" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
        <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
        <Tooltip />
        <Bar dataKey="value" radius={[8, 8, 0, 0]} fill="#f8b614" />
      </BarChart>
    </ResponsiveContainer>
  );
}

function SimplePieChart({ data }: { data: ChartRow[] }) {
  if (!data.length) return <EmptyChart />;

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie data={data} dataKey="value" nameKey="name" innerRadius={52} outerRadius={86} paddingAngle={2}>
          {data.map((entry, index) => (
            <Cell key={String(entry.name)} fill={chartColors[index % chartColors.length]} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  );
}

function SafetyLineChart({ data }: { data: KpiDashboard["safetyMonthlyTrend"] }) {
  if (!data.length) return <EmptyChart />;

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} margin={{ top: 12, right: 12, left: -20, bottom: 8 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
        <XAxis dataKey="month" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
        <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
        <Tooltip />
        <Line type="monotone" dataKey="incidentCount" stroke="#f8b614" strokeWidth={2} dot={false} />
        <Line type="monotone" dataKey="criticalHighSeverityCount" stroke="#dc2626" strokeWidth={2} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  );
}

function EmptyChart() {
  return (
    <div className="flex h-full items-center justify-center rounded-xl border border-dashed border-border text-sm text-muted-foreground">
      No KPI data for this range.
    </div>
  );
}

function DataTable({
  title,
  columns,
  rows,
}: {
  title: string;
  columns: string[];
  rows: Array<Array<string | number | null>>;
}) {
  return (
    <section className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
      <div className="border-b border-border p-4">
        <h2 className="text-sm font-semibold text-foreground">{title}</h2>
      </div>
      {rows.length ? (
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-secondary/60 text-xs uppercase text-muted-foreground">
              <tr>
                {columns.map((column) => (
                  <th key={column} className="px-4 py-3 text-left font-semibold">
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {rows.map((row, rowIndex) => (
                <tr key={`${title}-${rowIndex}`}>
                  {row.map((cell, cellIndex) => (
                    <td key={`${title}-${rowIndex}-${cellIndex}`} className="px-4 py-3 text-foreground">
                      {cell ?? "-"}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="p-8 text-center text-sm text-muted-foreground">No rows for this range.</div>
      )}
    </section>
  );
}

function buildSummaryCards(dashboard: KpiDashboard) {
  return [
    {
      label: "Equipment Logs",
      value: dashboard.summary.totalEquipmentLogs.toLocaleString(),
      icon: Wrench,
      tone: "bg-amber-500/14 text-amber-700 dark:text-amber-300",
    },
    {
      label: "Downtime Hours",
      value: formatNumber(dashboard.summary.totalDowntimeHours),
      icon: TimerReset,
      tone: "bg-red-500/12 text-red-700 dark:text-red-300",
    },
    {
      label: "MTTR Proxy",
      value: `${formatNumber(dashboard.summary.averageDowntimeHours)} hrs`,
      icon: Gauge,
      tone: "bg-blue-500/12 text-blue-700 dark:text-blue-300",
    },
    {
      label: "Planned Maintenance",
      value: formatPercent(dashboard.summary.plannedMaintenancePercent),
      icon: TrendingUp,
      tone: "bg-green-500/12 text-green-700 dark:text-green-300",
    },
    {
      label: "Safety Incidents",
      value: dashboard.summary.safetyIncidents.toLocaleString(),
      icon: ShieldAlert,
      tone: "bg-orange-500/12 text-orange-700 dark:text-orange-300",
    },
    {
      label: "Critical/High Safety",
      value: dashboard.summary.criticalHighSafetyIncidents.toLocaleString(),
      icon: AlertTriangle,
      tone: "bg-red-500/12 text-red-700 dark:text-red-300",
    },
    {
      label: "Out Of Limit",
      value: dashboard.summary.outOfLimitMeasurements.toLocaleString(),
      icon: Activity,
      tone: "bg-purple-500/12 text-purple-700 dark:text-purple-300",
    },
    {
      label: "Kaizen Closure",
      value: formatPercent(dashboard.summary.kaizenClosureRate),
      icon: BarChart3,
      tone: "bg-cyan-500/12 text-cyan-700 dark:text-cyan-300",
    },
  ];
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

function formatNumber(value: number | null) {
  if (value === null) return "-";
  return value.toLocaleString(undefined, { maximumFractionDigits: 2 });
}

function formatPercent(value: number | null) {
  if (value === null) return "-";
  return `${(value * 100).toLocaleString(undefined, { maximumFractionDigits: 1 })}%`;
}

function percentToDisplay(value: number | null) {
  return value === null ? 0 : Number((value * 100).toFixed(2));
}
