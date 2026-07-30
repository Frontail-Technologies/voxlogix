"use client";

import Link from "next/link";

import { AppIcon, type AppIconName } from "@/components/common/app-icon";
import { useRegisterBreadcrumbLabel } from "@/components/common/page-header-navigation";
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
import { MasterDetailSkeleton } from "@/components/master/master-skeletons";
import { buttonVariants } from "@/components/ui/button";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useModuleDetail } from "@/features/master-modules/api/module.queries";
import { cn } from "@/lib/utils";

export function ModuleDetailView({ moduleId }: { moduleId: string }) {
  const { data, isLoading, isError } = useModuleDetail(moduleId);
  const moduleDetail = data?.data;

  useRegisterBreadcrumbLabel(moduleId, moduleDetail?.name);

  return (
    <div className="space-y-4 sm:space-y-6">
      <DashboardPageHeader
        title={moduleDetail?.name ?? "Module Detail"}
        description="Review module configuration and field schema"
        action={
          moduleDetail ? (
            <Link
              href={`/master/modules/${moduleDetail.id}/edit`}
              className={cn(buttonVariants(), "rounded-xl")}
            >
              <AppIcon name="settings" className="size-4" />
              Edit Module
            </Link>
          ) : null
        }
      />

      {isLoading ? <MasterDetailSkeleton /> : null}
      {isError ? (
        <DashboardCard>
          <p className="p-5 text-sm text-muted-foreground">Could not load module.</p>
        </DashboardCard>
      ) : null}

      {moduleDetail ? (
        <>
          <DashboardCard>
            <CardContent className="grid gap-4 p-4 sm:p-6 lg:grid-cols-[auto_1fr_auto] lg:items-center">
              <div className="flex size-14 items-center justify-center rounded-2xl bg-primary/12 text-primary">
                <AppIcon name={moduleIcon(moduleDetail.icon)} className="size-7" />
              </div>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="truncate text-xl font-semibold text-foreground">
                    {moduleDetail.name}
                  </h2>
                  <StatusBadge status={label(moduleDetail.status)} />
                </div>
                <p className="mt-1 text-sm text-muted-foreground">
                  {moduleDetail.description ?? moduleDetail.availabilityText}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm sm:grid-cols-3 lg:min-w-96">
                <Metric label="Type" value={label(moduleDetail.type)} />
                <Metric label="Category" value={moduleDetail.category} />
                <Metric label="Fields" value={String(moduleDetail.fields.length)} />
              </div>
            </CardContent>
          </DashboardCard>

          <DashboardCard>
            <CardHeader className="border-b border-border px-5 py-3">
              <CardTitle>Schema Fields</CardTitle>
            </CardHeader>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Label</TableHead>
                  <TableHead>Key</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Required</TableHead>
                  <TableHead>AI Extract</TableHead>
                  <TableHead>Source</TableHead>
                  <TableHead>Feed</TableHead>
                  <TableHead>Report</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {moduleDetail.fields.length ? (
                  moduleDetail.fields.map((field) => (
                    <TableRow key={field.id}>
                      <TableCell className="font-medium text-foreground">{field.label}</TableCell>
                      <TableCell>{field.key}</TableCell>
                      <TableCell>{field.type}</TableCell>
                      <TableCell>{field.required ? "Yes" : "No"}</TableCell>
                      <TableCell>{field.aiExtract ? "Yes" : "No"}</TableCell>
                      <TableCell>{field.sourceType === "master" ? label(field.sourceKey ?? "master") : label(field.sourceType)}</TableCell>
                      <TableCell>{field.feedVisible ? "Yes" : "No"}</TableCell>
                      <TableCell>{field.reportVisible ? "Yes" : "No"}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} className="py-8 text-center text-muted-foreground">
                      No fields configured yet.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </DashboardCard>
        </>
      ) : null}
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-secondary/70 px-3 py-2">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 truncate text-sm font-medium text-foreground">{value}</p>
    </div>
  );
}

function moduleIcon(icon: string): AppIconName {
  return (icon === "clipboard-text"
    ? "logs"
    : icon === "warning-circle"
      ? "warning"
      : icon === "gauge"
        ? "status"
        : icon === "clock-countdown"
          ? "activity"
          : icon === "sparkle"
            ? "ai"
            : icon === "git-branch"
              ? "modules"
              : icon) as AppIconName;
}

function label(value: string) {
  return value
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase());
}
