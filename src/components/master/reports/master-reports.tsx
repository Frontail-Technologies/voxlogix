"use client";

import Link from "next/link";
import { useMemo } from "react";

import { AppIcon } from "@/components/common/app-icon";
import { DashboardPageHeader } from "@/components/common/dashboard-ui";
import { ReportViewer, type CompanyInfo } from "@/components/report-viewer";
import { buttonVariants } from "@/components/ui/button";
import { useGeneralSettings } from "@/features/master-settings/api/settings.queries";
import { cn } from "@/lib/utils";

import {
  masterReportCards,
  masterReportDefinitions,
} from "./master-report-definitions";
import type { MasterReportType } from "./master-report-types";

export function MasterReportsOverview() {
  return (
    <div className="space-y-4 sm:space-y-6">
      <DashboardPageHeader title="Reports" />

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {masterReportCards.map((report) => (
          <Link
            key={report.href}
            href={report.href}
            className="rounded-2xl border border-border bg-card p-4 shadow-sm transition-colors hover:border-primary/50"
          >
            <div className="flex size-10 items-center justify-center rounded-xl bg-primary/12 text-primary">
              <AppIcon name={report.icon} className="size-5" />
            </div>
            <h2 className="mt-3 text-base font-semibold text-foreground">{report.title}</h2>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">{report.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}

export function MasterReportDetail({ type }: { type: MasterReportType }) {
  const settingsQuery = useGeneralSettings();
  const report = masterReportDefinitions[type];

  const reportCompany = useMemo<CompanyInfo>(() => {
    const settings = settingsQuery.data?.data;

    return {
      name: settings?.platformName ?? "VoxLogiX Platform",
      address: "Platform-level report",
      phone: "",
      logo: settings?.logoUrl ?? undefined,
    };
  }, [settingsQuery.data?.data]);

  return (
    <div className="space-y-4 sm:space-y-6">
      <DashboardPageHeader
        title={report.title}
        action={
          <Link
            href={report.sourceHref}
            className={cn(buttonVariants({ variant: "outline" }), "rounded-xl")}
          >
            <AppIcon name={report.icon} className="size-4" />
            Open Source Data
          </Link>
        }
      />

      <ReportViewer
        title={report.title}
        filters={report.filters}
        columns={report.columns}
        fetchData={report.fetchRows}
        totals={report.totals}
        company={reportCompany}
        filename={`master-${report.type}`}
      />
    </div>
  );
}
