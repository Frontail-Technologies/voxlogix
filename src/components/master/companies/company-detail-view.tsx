import Link from "next/link";

import { AppIcon } from "@/components/common/app-icon";
import {
  CardContent,
  DashboardCard,
  DashboardPageHeader,
  StatusBadge,
} from "@/components/common/dashboard-ui";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { globalModules, selectedCompany } from "@/data/mock-master";
import { cn } from "@/lib/utils";

export function CompanyDetailView() {
  return (
    <div className="space-y-4 sm:space-y-6">
      <DashboardPageHeader
        title="Company Detail"
        description="Company overview, access, usage, modules, and quick actions"
        hideDescriptionOnMobile
      />

      <div className="grid gap-3 sm:gap-4 xl:grid-cols-[1fr_320px]">
        <CompanyOverviewCard />
        <CompanyQuickActions />
      </div>
    </div>
  );
}

function CompanyOverviewCard() {
  return (
    <DashboardCard>
      <CardContent className="space-y-3 p-3 sm:space-y-6 sm:p-6">
        <CompanyIdentity />
        <CompanyStatsGrid />
        <CompanyInfoGrid />
        <EnabledModules />
      </CardContent>
    </DashboardCard>
  );
}

function CompanyIdentity() {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3 sm:gap-4">
        <Avatar className="size-10 rounded-full border border-primary/20 bg-primary/12 sm:size-14">
          <AvatarFallback className="text-base font-semibold text-primary sm:text-lg">
            {selectedCompany.logo}
          </AvatarFallback>
        </Avatar>
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold sm:text-xl">
              {selectedCompany.company}
            </h2>
            <StatusBadge status={selectedCompany.status} />
          </div>
          <p className="text-sm text-muted-foreground">
            {selectedCompany.plan} Plan
          </p>
        </div>
      </div>
      <Badge className="w-fit rounded-xl bg-primary/15 text-primary">
        {selectedCompany.businessType}
      </Badge>
    </div>
  );
}

function CompanyStatsGrid() {
  return (
    <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
      {selectedCompany.stats.map((stat) => (
        <div
          key={stat.label}
          className="rounded-2xl border border-border bg-background p-3 sm:p-4"
        >
          <p className="text-xs text-muted-foreground">{stat.label}</p>
          <p className="mt-1 text-lg font-semibold">{stat.value}</p>
        </div>
      ))}
    </div>
  );
}

function CompanyInfoGrid() {
  return (
    <div className="grid gap-3 sm:gap-4 lg:grid-cols-2">
      <div className="rounded-2xl border border-border bg-background p-3 sm:p-4">
        <h3 className="font-semibold">Owner</h3>
        <div className="mt-3 space-y-2 text-sm">
          <p>
            <span className="text-muted-foreground">Name:</span>{" "}
            {selectedCompany.owner}
          </p>
          <p>
            <span className="text-muted-foreground">Email:</span>{" "}
            {selectedCompany.email}
          </p>
          <p>
            <span className="text-muted-foreground">Phone:</span>{" "}
            {selectedCompany.phone}
          </p>
        </div>
      </div>
      <div className="rounded-2xl border border-border bg-background p-3 sm:p-4">
        <h3 className="font-semibold">Company Notes</h3>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          {selectedCompany.notes}
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          {selectedCompany.address}
        </p>
      </div>
    </div>
  );
}

function EnabledModules() {
  return (
    <div>
      <h3 className="mb-3 font-semibold">Enabled Modules</h3>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {globalModules.slice(0, 3).map((module) => (
          <div
            key={module.name}
            className="rounded-2xl border border-border bg-background p-3 sm:p-4"
          >
            <div className="flex items-center gap-2">
              <AppIcon name={module.icon} className="size-5 text-primary" />
              <span className="font-medium">{module.name}</span>
            </div>
            <StatusBadge status={module.status} />
          </div>
        ))}
      </div>
    </div>
  );
}

function CompanyQuickActions() {
  return (
    <>
      <div className="order-first grid grid-cols-4 gap-2 xl:hidden">
        <Link
          href="/master/companies/abc-industries/edit"
          className={cn(buttonVariants({ variant: "outline" }), "h-14 flex-col gap-1 rounded-xl px-1 text-xs")}
        >
          <AppIcon name="companies" className="size-4" />
          Edit
        </Link>
        <Link
          href="/master/companies/abc-industries/access"
          className={cn(buttonVariants({ variant: "outline" }), "h-14 flex-col gap-1 rounded-xl px-1 text-xs")}
        >
          <AppIcon name="permissions" className="size-4" />
          Access
        </Link>
        <Link
          href="/master/companies/abc-industries/usage"
          className={cn(buttonVariants({ variant: "outline" }), "h-14 flex-col gap-1 rounded-xl px-1 text-xs")}
        >
          <AppIcon name="ai" className="size-4" />
          Usage
        </Link>
        <Button
          variant="outline"
          className="h-14 flex-col gap-1 rounded-xl px-1 text-xs text-destructive hover:text-destructive"
        >
          <AppIcon name="warning" className="size-4" />
          Suspend
        </Button>
      </div>

      <DashboardCard className="hidden xl:block">
        <CardContent className="space-y-3 p-5">
          <h3 className="font-semibold">Quick Actions</h3>
          <Link
            href="/master/companies/abc-industries/edit"
            className={cn(
              buttonVariants({ variant: "outline" }),
              "w-full justify-start rounded-xl",
            )}
          >
            <AppIcon name="companies" className="size-4" />
            Edit Company
          </Link>
          <Link
            href="/master/companies/abc-industries/access"
            className={cn(
              buttonVariants({ variant: "outline" }),
              "w-full justify-start rounded-xl",
            )}
          >
            <AppIcon name="permissions" className="size-4" />
            Access Control
          </Link>
          <Link
            href="/master/companies/abc-industries/usage"
            className={cn(
              buttonVariants({ variant: "outline" }),
              "w-full justify-start rounded-xl",
            )}
          >
            <AppIcon name="ai" className="size-4" />
            View Usage
          </Link>
          <Button variant="destructive" className="w-full justify-start rounded-xl">
            <AppIcon name="warning" className="size-4" />
            Suspend Company
          </Button>
        </CardContent>
      </DashboardCard>
    </>
  );
}
