"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { showApiErrorToast } from "@/lib/api/error-toast";

import { AppIcon } from "@/components/common/app-icon";
import { CardContent, DashboardCard, DashboardPageHeader, StatusBadge } from "@/components/common/dashboard-ui";
import { DeleteConfirmDialog } from "@/components/common/delete-confirm-dialog";
import { EntityAvatar } from "@/components/common/entity-avatar";
import { MasterDetailSkeleton } from "@/components/master/master-skeletons";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { useUpdateCompany } from "@/features/master-companies/api/company.mutations";
import { useCompanyDetail } from "@/features/master-companies/api/company.queries";
import type { CompanyDetail } from "@/features/master-companies/api/company.types";
import { cn } from "@/lib/utils";

export function CompanyDetailView({ companyId }: { companyId: string }) {
  const { data, isLoading, isError } = useCompanyDetail(companyId);
  const company = data?.data;

  return (
    <div className="space-y-4 sm:space-y-6">
      <DashboardPageHeader title="Company Detail" description="Company overview, access, usage, modules, and quick actions" hideDescriptionOnMobile />
      {isLoading ? <MasterDetailSkeleton /> : null}
      {isError ? <DashboardCard><p className="p-5 text-sm text-muted-foreground">Could not load company detail.</p></DashboardCard> : null}
      {company ? <div className="grid gap-3 sm:gap-4 xl:grid-cols-[1fr_320px]"><CompanyOverviewCard company={company} /><CompanyQuickActions company={company} /></div> : null}
    </div>
  );
}

function CompanyOverviewCard({ company }: { company: CompanyDetail }) {
  return <DashboardCard><CardContent className="space-y-3 p-3 sm:space-y-6 sm:p-6"><CompanyIdentity company={company} /><CompanyStatsGrid company={company} /><CompanyInfoGrid company={company} /><EnabledModules company={company} /></CardContent></DashboardCard>;
}

function CompanyIdentity({ company }: { company: CompanyDetail }) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3 sm:gap-4">
        <EntityAvatar initials={company.logo ?? initials(company.name)} imageUrl={company.logoUrl ?? undefined} className="size-10 sm:size-14" fallbackClassName="text-base sm:text-lg" />
        <div>
          <div className="flex items-center gap-2"><h2 className="text-lg font-semibold sm:text-xl">{company.name}</h2><StatusBadge status={label(company.status)} /></div>
          <p className="text-sm text-muted-foreground">{company.plan} Plan</p>
        </div>
      </div>
      <Badge className="w-fit rounded-xl bg-primary/15 text-primary">{company.businessType}</Badge>
    </div>
  );
}

function CompanyStatsGrid({ company }: { company: CompanyDetail }) {
  const stats = [
    { label: "Admins", value: company.stats.totalAdmins },
    { label: "Logs", value: company.stats.totalLogs },
    { label: "AI Logs", value: company.stats.aiUsageThisMonthLogs },
    { label: "Est Cost", value: formatCurrency(company.stats.estimatedCost) },
  ];
  return <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">{stats.map((stat) => <div key={stat.label} className="rounded-2xl border border-border bg-background p-3 sm:p-4"><p className="text-xs text-muted-foreground">{stat.label}</p><p className="mt-1 text-lg font-semibold">{stat.value}</p></div>)}</div>;
}

function CompanyInfoGrid({ company }: { company: CompanyDetail }) {
  return (
    <div className="grid gap-3 sm:gap-4 lg:grid-cols-2">
      <div className="rounded-2xl border border-border bg-background p-3 sm:p-4"><h3 className="font-semibold">Owner</h3><div className="mt-3 space-y-2 text-sm"><p><span className="text-muted-foreground">Name:</span> {company.ownerName}</p><p><span className="text-muted-foreground">Email:</span> {company.ownerEmail}</p><p><span className="text-muted-foreground">Phone:</span> {company.ownerPhone}</p></div></div>
      <div className="rounded-2xl border border-border bg-background p-3 sm:p-4"><h3 className="font-semibold">Company Notes</h3><p className="mt-3 text-sm leading-6 text-muted-foreground">{company.notes || "No notes added."}</p><p className="mt-2 text-sm text-muted-foreground">{company.address || "No address added."}</p></div>
    </div>
  );
}

function EnabledModules({ company }: { company: CompanyDetail }) {
  return (
    <div>
      <h3 className="mb-3 font-semibold">Enabled Modules</h3>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {company.enabledModules.length ? company.enabledModules.map((module) => <div key={module.id} className="rounded-2xl border border-border bg-background p-3 sm:p-4"><div className="flex items-center gap-2"><AppIcon name="modules" className="size-5 text-primary" /><span className="font-medium">{module.name}</span></div><StatusBadge status={label(module.status)} /></div>) : <p className="text-sm text-muted-foreground">No modules enabled yet.</p>}
      </div>
    </div>
  );
}

function CompanyQuickActions({ company }: { company: CompanyDetail }) {
  const router = useRouter();
  const baseHref = `/master/companies/${company.id}`;
  const updateMutation = useUpdateCompany(company.id);
  const [suspendDialogOpen, setSuspendDialogOpen] = useState(false);
  const isSuspended = company.status === "SUSPENDED";

  async function handleToggleSuspend() {
    try {
      await updateMutation.mutateAsync({ status: isSuspended ? "ACTIVE" : "SUSPENDED" });
      toast.success(isSuspended ? "Company reactivated" : "Company suspended");
      router.refresh();
    } catch (error) {
      showApiErrorToast(error, isSuspended ? "Could not reactivate company" : "Could not suspend company");
    }
  }

  return (
    <>
      <div className="order-first grid grid-cols-4 gap-2 xl:hidden">
        <ActionLink href={`${baseHref}/edit`} icon="companies" label="Edit" />
        <ActionLink href={`${baseHref}/access`} icon="permissions" label="Access" />
        <ActionLink href={`${baseHref}/usage`} icon="ai" label="Usage" />
        <Button
          type="button"
          variant="outline"
          className="h-14 flex-col gap-1 rounded-xl px-1 text-xs text-destructive hover:text-destructive"
          onClick={() => setSuspendDialogOpen(true)}
        >
          <AppIcon name="warning" className="size-4" />
          {isSuspended ? "Reactivate" : "Suspend"}
        </Button>
      </div>
      <DashboardCard className="hidden xl:block">
        <CardContent className="space-y-3 p-5">
          <h3 className="font-semibold">Quick Actions</h3>
          <Link href={`${baseHref}/edit`} className={cn(buttonVariants({ variant: "outline" }), "w-full justify-start rounded-xl")}><AppIcon name="companies" className="size-4" />Edit Company</Link>
          <Link href={`${baseHref}/access`} className={cn(buttonVariants({ variant: "outline" }), "w-full justify-start rounded-xl")}><AppIcon name="permissions" className="size-4" />Access Control</Link>
          <Link href={`${baseHref}/usage`} className={cn(buttonVariants({ variant: "outline" }), "w-full justify-start rounded-xl")}><AppIcon name="ai" className="size-4" />View Usage</Link>
          <Button type="button" variant="destructive" className="w-full justify-start rounded-xl" onClick={() => setSuspendDialogOpen(true)}>
            <AppIcon name="warning" className="size-4" />
            {isSuspended ? "Reactivate Company" : "Suspend Company"}
          </Button>
        </CardContent>
      </DashboardCard>
      <DeleteConfirmDialog
        open={suspendDialogOpen}
        onOpenChange={setSuspendDialogOpen}
        title={isSuspended ? "Reactivate company?" : "Suspend company?"}
        description={isSuspended ? `${company.name} will regain access to the platform immediately.` : `${company.name} and its users will lose access to the platform immediately.`}
        confirmLabel={updateMutation.isPending ? "Saving..." : isSuspended ? "Reactivate" : "Suspend"}
        onConfirm={handleToggleSuspend}
      />
    </>
  );
}

function ActionLink({ href, icon, label: actionLabel }: { href: string; icon: "companies" | "permissions" | "ai"; label: string }) {
  return <Link href={href} className={cn(buttonVariants({ variant: "outline" }), "h-14 flex-col gap-1 rounded-xl px-1 text-xs")}><AppIcon name={icon} className="size-4" />{actionLabel}</Link>;
}

function initials(value: string) { return value.split(/\s+/).slice(0, 2).map((part) => part[0]).join("").toUpperCase(); }
function label(value: string) { return value.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase()); }
function formatCurrency(value: number) { return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 2 }).format(value); }
