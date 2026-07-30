"use client";

import Link from "next/link";
import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import {
  ActivityItem,
  CardContent,
  CardHeader,
  CardTitle,
  DashboardCard,
  DashboardPageHeader,
  DashboardStatCard,
} from "@/components/common/dashboard-ui";
import { MasterUsageChart } from "@/components/master/dashboard/master-usage-chart";
import { MasterCardGridSkeleton } from "@/components/master/master-skeletons";
import { buttonVariants } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useActivitiesList } from "@/features/master-activities/api/activity.queries";
import { useAdminsList } from "@/features/master-admins/api/admin.queries";
import { useCompaniesList } from "@/features/master-companies/api/company.queries";
import { useModulesList } from "@/features/master-modules/api/module.queries";
import { useUsageOverview } from "@/features/master-usage/api/usage.queries";
import { cn } from "@/lib/utils";

const MONTH_OPTIONS = [
  { label: "January", value: "1" },
  { label: "February", value: "2" },
  { label: "March", value: "3" },
  { label: "April", value: "4" },
  { label: "May", value: "5" },
  { label: "June", value: "6" },
  { label: "July", value: "7" },
  { label: "August", value: "8" },
  { label: "September", value: "9" },
  { label: "October", value: "10" },
  { label: "November", value: "11" },
  { label: "December", value: "12" },
];

export default function MasterDashboardPage() {
  return (
    <Suspense fallback={<MasterCardGridSkeleton />}>
      <MasterDashboardPageContent />
    </Suspense>
  );
}

function MasterDashboardPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentDate = new Date();
  const selectedMonth =
    parseMonth(searchParams.get("month")) ?? currentDate.getMonth() + 1;
  const selectedYear =
    parseYear(searchParams.get("year")) ?? currentDate.getFullYear();
  const usageScope = { month: selectedMonth, year: selectedYear };

  const companies = useCompaniesList({ limit: 1 });
  const activeCompanies = useCompaniesList({ limit: 1, status: "ACTIVE" });
  const admins = useAdminsList({ limit: 1, role: "ADMIN" });
  const modules = useModulesList({ limit: 1 });
  const usage = useUsageOverview(usageScope);
  const activities = useActivitiesList({ limit: 5 });
  const hasError =
    companies.isError ||
    activeCompanies.isError ||
    admins.isError ||
    modules.isError ||
    usage.isError ||
    activities.isError;

  const usageData = usage.data?.data;
  const monthLabel = `${MONTH_OPTIONS.find((month) => month.value === String(selectedMonth))?.label ?? "Selected Month"} ${selectedYear}`;
  const cards = [
    {
      label: "Companies",
      value: companies.data?.meta?.totalItems ?? 0,
      helper: "On platform",
      icon: "companies" as const,
      tone: "navy" as const,
      isLoading: companies.isLoading,
    },
    {
      label: "Active Companies",
      value: activeCompanies.data?.meta?.totalItems ?? 0,
      helper: "Currently enabled",
      icon: "status" as const,
      tone: "green" as const,
      isLoading: activeCompanies.isLoading,
    },
    {
      label: "Admins",
      value: admins.data?.meta?.totalItems ?? 0,
      helper: "Company owners",
      icon: "admins" as const,
      tone: "blue" as const,
      isLoading: admins.isLoading,
    },
    {
      label: "Modules",
      value: modules.data?.meta?.totalItems ?? 0,
      helper: "Global schemas",
      icon: "modules" as const,
      tone: "teal" as const,
      isLoading: modules.isLoading,
    },
    {
      label: "AI Logs",
      value: usageData?.stats.totalAiLogs ?? 0,
      helper: monthLabel,
      icon: "ai" as const,
      tone: "purple" as const,
      isLoading: usage.isLoading,
    },
    {
      label: "AI Failures",
      value: usageData?.stats.totalFailedRequests ?? 0,
      helper: monthLabel,
      icon: "status" as const,
      tone: "red" as const,
      isLoading: usage.isLoading,
    },
    {
      label: "Success Rate",
      value: `${usageData?.stats.successRate ?? 0}%`,
      helper: "AI processing",
      icon: "status" as const,
      tone: "green" as const,
      isLoading: usage.isLoading,
    },
    {
      label: "AI Cost",
      value: `$${usageData?.stats.estimatedCost ?? 0}`,
      helper: "Estimated",
      icon: "reports" as const,
      tone: "orange" as const,
      isLoading: usage.isLoading,
    },
  ];

  function updateDateScope(key: "month" | "year", value: string) {
    const params = new URLSearchParams(searchParams.toString());
    params.set(key, value);
    router.replace(`/master/dashboard?${params.toString()}`, { scroll: false });
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <DashboardPageHeader
        title="Master Dashboard"
        action={
          <div className="flex items-center gap-2">
            <Select
              value={String(selectedMonth)}
              onValueChange={(value) => {
                if (typeof value === "string") updateDateScope("month", value);
              }}
            >
              <SelectTrigger className="h-9 w-36 rounded-xl bg-card">
                <SelectValue />
              </SelectTrigger>
              <SelectContent align="end">
                {MONTH_OPTIONS.map((month) => (
                  <SelectItem key={month.value} value={month.value}>
                    {month.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={String(selectedYear)}
              onValueChange={(value) => {
                if (typeof value === "string") updateDateScope("year", value);
              }}
            >
              <SelectTrigger className="h-9 w-24 rounded-xl bg-card">
                <SelectValue />
              </SelectTrigger>
              <SelectContent align="end">
                {yearOptions(selectedYear).map((year) => (
                  <SelectItem key={year} value={String(year)}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        }
      />

      {hasError ? (
        <DashboardCard>
          <CardContent className="p-5 text-sm text-muted-foreground">
            Could not load Master dashboard data.
          </CardContent>
        </DashboardCard>
      ) : null}

      <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
        {cards.map((stat) => (
          <DashboardStatCard
            key={stat.label}
            {...stat}
            value={String(stat.value)}
          />
        ))}
      </div>

      <div className="grid gap-3 sm:gap-4 xl:grid-cols-[1.18fr_0.82fr]">
        <DashboardCard>
          <CardHeader className="flex flex-row items-center justify-between px-4 py-3 sm:px-5 sm:py-4">
            <div>
              <CardTitle>AI Usage Overview</CardTitle>
              <p className="text-sm text-muted-foreground">{monthLabel}</p>
            </div>
            <Link
              href="/master/usage"
              className={cn(
                buttonVariants({ variant: "outline", size: "sm" }),
                "rounded-xl",
              )}
            >
              View usage
            </Link>
          </CardHeader>
          <CardContent className="px-4 pb-4 pt-1 sm:px-5 sm:pb-5 sm:pt-2">
            <MasterUsageChart
              points={(usageData?.chart ?? []).map((point) => ({
                date: point.date,
                aiLogs: point.aiLogs,
              }))}
              isLoading={usage.isLoading}
            />
          </CardContent>
        </DashboardCard>

        <DashboardCard>
          <CardHeader className="flex flex-row items-center justify-between px-4 py-3 sm:px-5 sm:py-4">
            <CardTitle>Recent Platform Activity</CardTitle>
            <Link
              href="/master/activities"
              className={cn(
                buttonVariants({ variant: "outline", size: "sm" }),
                "rounded-xl",
              )}
            >
              View all
            </Link>
          </CardHeader>
          <CardContent className="space-y-5 px-4 pb-4 pt-1 sm:px-5 sm:pb-5 sm:pt-2">
            {activities.isLoading ? (
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <Skeleton className="size-9 shrink-0 rounded-full" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-3.5 w-3/4" />
                      <Skeleton className="h-3 w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (activities.data?.data ?? []).length ? (
              activities.data!.data!.map((item) => (
                <ActivityItem
                  key={item.id}
                  title={item.event}
                  actor={item.user}
                  time={formatDate(item.occurredAt)}
                  icon="activity"
                  tone={activityTone(item.status)}
                />
              ))
            ) : (
              <p className="text-sm text-muted-foreground">
                No platform activity yet.
              </p>
            )}
          </CardContent>
        </DashboardCard>
      </div>
    </div>
  );
}

function parseMonth(value: string | null) {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed >= 1 && parsed <= 12 ? parsed : null;
}

function parseYear(value: string | null) {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed >= 2020 && parsed <= 2100
    ? parsed
    : null;
}

function yearOptions(selectedYear: number) {
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 6 }, (_, index) => currentYear - index);
  return years.includes(selectedYear) ? years : [selectedYear, ...years];
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}

function activityTone(status: string) {
  const normalized = status.toLowerCase();
  if (normalized.includes("success")) return "green" as const;
  if (normalized.includes("warn")) return "amber" as const;
  if (normalized.includes("fail") || normalized.includes("error")) {
    return "red" as const;
  }
  return "blue" as const;
}
