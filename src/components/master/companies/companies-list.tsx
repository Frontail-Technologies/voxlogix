"use client";

import Link from "next/link";

import { AppIcon } from "@/components/common/app-icon";
import { ResponsiveSearchControl } from "@/components/common/responsive-search-control";
import { TablePagination } from "@/components/common/table-pagination";
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
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { buttonVariants } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { companies } from "@/data/mock-master";
import { usePagination } from "@/hooks/use-pagination";
import { cn } from "@/lib/utils";

import { CompanyActionsMenu } from "./company-actions-menu";

export function CompaniesList() {
  const pagination = usePagination({ items: companies });

  return (
    <div className="space-y-4 sm:space-y-6">
      <DashboardPageHeader
        title="Companies"
        description="Manage all companies on the platform"
        action={
          <Link
            href="/master/companies/new"
            className={cn(buttonVariants(), "rounded-xl")}
          >
            <AppIcon name="plus" className="size-4" />
            Add Company
          </Link>
        }
      />

      <div className="space-y-3">
        <CompaniesToolbar />
        <DashboardCard>
          <CompaniesTable companies={pagination.pageItems} />
        </DashboardCard>
        <TablePagination
          page={pagination.page}
          totalPages={pagination.totalPages}
          startItem={pagination.startItem}
          endItem={pagination.endItem}
          totalItems={pagination.totalItems}
          canPrevious={pagination.canPrevious}
          canNext={pagination.canNext}
          onPageChange={pagination.goToPage}
          onPrevious={pagination.previousPage}
          onNext={pagination.nextPage}
        />
      </div>
    </div>
  );
}

function CompaniesToolbar() {
  return (
    <div className="grid grid-cols-[2.25rem_minmax(0,1fr)] items-center gap-2 sm:flex sm:items-center sm:justify-between">
      <ResponsiveSearchControl
        placeholder="Search company..."
        desktopClassName="sm:max-w-xs"
      />
      <Select defaultValue="All Status">
        <SelectTrigger className="h-10 w-full rounded-xl bg-secondary/70 sm:w-40">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="All Status">All Status</SelectItem>
          <SelectItem value="Active">Active</SelectItem>
          <SelectItem value="Demo">Demo</SelectItem>
          <SelectItem value="Suspended">Suspended</SelectItem>
          <SelectItem value="Inactive">Inactive</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}

function CompaniesTable({ companies }: { companies: typeof import("@/data/mock-master").companies }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Company</TableHead>
          <TableHead>Owner</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Plan</TableHead>
          <TableHead>Start Date</TableHead>
          <TableHead>Expiry Date</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {companies.map((company) => {
          const companyId = toCompanyId(company.company);

          return (
            <TableRow key={company.company}>
              <TableCell>
                <Link
                  href={`/master/companies/${companyId}`}
                  className="flex items-center gap-3"
                >
                  <Avatar className="size-9 rounded-full border border-primary/20 bg-primary/12">
                    <AvatarFallback className="text-xs font-semibold text-primary">
                      {company.logo}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-foreground">
                      {company.company}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {company.businessType}
                    </p>
                  </div>
                </Link>
              </TableCell>
              <TableCell>{company.owner}</TableCell>
              <TableCell>
                <StatusBadge status={company.status} />
              </TableCell>
              <TableCell>{company.plan}</TableCell>
              <TableCell>{company.startDate}</TableCell>
              <TableCell>{company.expiryDate}</TableCell>
              <TableCell className="text-right">
                <CompanyActionsMenu
                  companyId={companyId}
                  companyName={company.company}
                />
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}

function toCompanyId(companyName: string) {
  return companyName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}
