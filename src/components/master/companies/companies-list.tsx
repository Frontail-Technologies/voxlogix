import Link from "next/link";

import { AppIcon } from "@/components/common/app-icon";
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
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { companies } from "@/data/mock-master";
import { cn } from "@/lib/utils";

import { CompanyActionsMenu } from "./company-actions-menu";

export function CompaniesList() {
  return (
    <div className="space-y-6">
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
        <DashboardCard>
          <div className="p-5 pb-4">
            <CompaniesToolbar />
          </div>
          <CompaniesTable />
        </DashboardCard>
        <p className="px-1 text-sm text-muted-foreground">
          Showing 1 to 5 of 24 results
        </p>
      </div>
    </div>
  );
}

function CompaniesToolbar() {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="relative w-full sm:max-w-xs">
        <AppIcon
          name="search"
          className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
        />
        <Input
          placeholder="Search company..."
          className="h-10 rounded-xl bg-background pl-9"
        />
      </div>
      <Select defaultValue="All Status">
        <SelectTrigger className="h-10 w-full rounded-xl bg-background sm:w-40">
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

function CompaniesTable() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Company</TableHead>
          <TableHead>Owner</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Plan</TableHead>
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
                  <Avatar className="size-9 rounded-xl">
                    <AvatarFallback className="rounded-xl bg-accent text-xs font-semibold text-accent-foreground">
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
              <TableCell>{company.expiryDate}</TableCell>
              <TableCell className="text-right">
                <CompanyActionsMenu companyId={companyId} />
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
