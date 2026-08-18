"use client";

import Link from "next/link";
import { useMemo } from "react";

import { AppIcon } from "@/components/common/app-icon";
import { DashboardPageHeader } from "@/components/common/dashboard-ui";
import { ReportViewer, type CompanyInfo } from "@/components/report-viewer";
import { buttonVariants } from "@/components/ui/button";
import { useAuth } from "@/features/auth/auth-provider";
import { useCompanyDetail } from "@/features/master-companies/api/company.queries";
import { cn } from "@/lib/utils";

import { adminReportDefinitions, reportCards, type AdminReportType } from "./report-definitions";

export function ReportsOverview() {
  return (
    <div className="space-y-4 sm:space-y-6">
      <DashboardPageHeader
        title="Reports"
        description="Generate focused operational reports and Excel exports."
        hideDescriptionOnMobile
      />

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {reportCards.map((report) => (
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

export function ReportDetail({ type }: { type: AdminReportType }) {
  const { company } = useAuth();
  const companyQuery = useCompanyDetail(company?.id ?? "");
  const report = adminReportDefinitions[type];

  const reportCompany = useMemo<CompanyInfo>(() => {
    const detail = companyQuery.data?.data;

    return {
      name: detail?.name ?? company?.name ?? "VoxLogiX",
      address: detail?.address ?? "",
      phone: detail?.ownerPhone ?? "",
      logo: detail?.logoUrl ?? undefined,
    };
  }, [company?.name, companyQuery.data?.data]);

  return (
    <div className="space-y-4 sm:space-y-6">
      <DashboardPageHeader
        title={report.title}
        description={report.description}
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
        filename={report.type}
      />
    </div>
  );
}
