"use client";

import Link from "next/link";

import { AppIcon } from "@/components/common/app-icon";
import { ChangePasswordForm } from "@/components/common/change-password-form";
import { CardContent, CardHeader, CardTitle, DashboardCard, DashboardPageHeader } from "@/components/common/dashboard-ui";
import { MasterDetailSkeleton } from "@/components/master/master-skeletons";
import { buttonVariants } from "@/components/ui/button";
import { useCurrentUser } from "@/features/auth/api/auth.queries";
import { useCompanyDetail } from "@/features/master-companies/api/company.queries";
import type { CompanyDetail } from "@/features/master-companies/api/company.types";
import { cn } from "@/lib/utils";

export function CompanySettings() {
  const currentUserQuery = useCurrentUser();
  const companyId = currentUserQuery.data?.data?.company?.id ?? "";
  const companyQuery = useCompanyDetail(companyId);
  const company = companyQuery.data?.data;
  const isLoading = currentUserQuery.isLoading || companyQuery.isLoading;
  const isError = currentUserQuery.isError || companyQuery.isError;

  return (
    <div className="space-y-4 sm:space-y-6">
      <DashboardPageHeader
        title="Settings"
        description="Admin account security and report identity preview."
      />

      {isLoading ? <MasterDetailSkeleton /> : null}
      {isError ? (
        <DashboardCard>
          <p className="p-5 text-sm text-muted-foreground">Could not load settings.</p>
        </DashboardCard>
      ) : null}
      {!companyId && !isLoading ? (
        <DashboardCard>
          <p className="p-5 text-sm text-muted-foreground">No company is attached to this session.</p>
        </DashboardCard>
      ) : null}

      {company ? <ReportIdentityPreview company={company} /> : null}
      <ChangePasswordForm />
    </div>
  );
}

function ReportIdentityPreview({ company }: { company: CompanyDetail }) {
  return (
    <DashboardCard>
      <CardHeader className="border-b border-border/70 px-4 py-4 sm:px-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <CardTitle>Report Configuration</CardTitle>
            <p className="mt-1 text-sm text-muted-foreground">
              Reports use this Master-managed company identity.
            </p>
          </div>
          <Link href="/admin/reports" className={cn(buttonVariants({ variant: "outline" }), "rounded-xl")}>
            <AppIcon name="reports" className="size-4" />
            View Reports
          </Link>
        </div>
      </CardHeader>
      <CardContent className="grid gap-4 p-4 sm:p-5 lg:grid-cols-[minmax(0,1fr)_18rem]">
        <div className="rounded-2xl border border-border bg-background p-4">
          <div className="flex items-center gap-3">
            {company.logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={company.logoUrl} alt={company.name} className="h-12 max-w-44 object-contain" />
            ) : (
              <div className="flex size-12 items-center justify-center rounded-xl bg-primary/12 text-primary">
                <AppIcon name="companies" className="size-6" />
              </div>
            )}
            <div className="min-w-0">
              <p className="truncate font-semibold text-foreground">{company.name}</p>
              <p className="mt-1 text-sm text-muted-foreground">{company.businessType}</p>
            </div>
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <ReadOnly label="Owner" value={company.ownerName} />
            <ReadOnly label="Owner Email" value={company.ownerEmail} />
            <ReadOnly label="Owner Phone" value={company.ownerPhone} />
            <ReadOnly label="Address" value={company.address ?? "-"} />
          </div>
        </div>

        <div className="rounded-2xl border border-primary/20 bg-primary/10 p-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <AppIcon name="permissions" className="size-4 text-primary" />
            Managed by Master
          </div>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Company identity, logo, plan, access status, and limits are controlled from the Master panel. Admin users can update only their account password here.
          </p>
        </div>
      </CardContent>
    </DashboardCard>
  );
}

function ReadOnly({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0 rounded-xl border border-border bg-secondary/40 px-3 py-2">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 truncate text-sm font-medium text-foreground">{value}</p>
    </div>
  );
}
