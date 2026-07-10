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
import { admins, companies } from "@/data/mock-master";
import { usePagination } from "@/hooks/use-pagination";
import { cn } from "@/lib/utils";

import { AdminActionsMenu } from "./admin-actions-menu";

export function AdminsList() {
  const pagination = usePagination({ items: admins });

  return (
    <div className="space-y-4 sm:space-y-6">
      <DashboardPageHeader
        title="Admins"
        description="Manage company admin accounts and access status"
        action={
          <Link
            href="/master/admins/new"
            className={cn(buttonVariants(), "rounded-xl")}
          >
            <AppIcon name="plus" className="size-4" />
            Add Admin
          </Link>
        }
      />

      <div className="space-y-3">
        <AdminsToolbar />
        <DashboardCard>
          <AdminsTable admins={pagination.pageItems} />
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

function AdminsToolbar() {
  return (
    <div className="grid grid-cols-[2.25rem_minmax(0,1fr)_minmax(0,1fr)] items-center gap-2 lg:flex lg:items-center lg:justify-between">
      <ResponsiveSearchControl placeholder="Search admin..." />
      <div className="contents lg:flex lg:gap-3">
        <Select defaultValue="All Companies">
          <SelectTrigger className="h-10 w-full rounded-xl bg-secondary/70 lg:w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All Companies">All Companies</SelectItem>
            {companies.slice(0, 4).map((company) => (
              <SelectItem key={company.company} value={company.company}>
                {company.company}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select defaultValue="All Status">
          <SelectTrigger className="h-10 w-full rounded-xl bg-secondary/70 lg:w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All Status">All Status</SelectItem>
            <SelectItem value="Active">Active</SelectItem>
            <SelectItem value="Inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

function AdminsTable({ admins }: { admins: typeof import("@/data/mock-master").admins }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Admin</TableHead>
          <TableHead>Company</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Joined Date</TableHead>
          <TableHead>Last Login</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {admins.map((admin) => {
          const adminId = toId(admin.admin);

          return (
            <TableRow key={admin.email}>
              <TableCell>
                <Link
                  href={`/master/admins/${adminId}`}
                  className="flex items-center gap-3"
                >
                  <Avatar className="size-9 rounded-full border border-primary/20 bg-primary/12">
                    <AvatarFallback className="text-xs font-semibold text-primary">
                      {admin.initials}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-foreground">{admin.admin}</p>
                    <p className="text-xs text-muted-foreground">Company Admin</p>
                  </div>
                </Link>
              </TableCell>
              <TableCell>{admin.company}</TableCell>
              <TableCell>{admin.email}</TableCell>
              <TableCell>
                <StatusBadge status={admin.status} />
              </TableCell>
              <TableCell>{admin.joinedOn}</TableCell>
              <TableCell>{admin.lastLogin}</TableCell>
              <TableCell className="text-right">
                <AdminActionsMenu
                  adminId={adminId}
                  adminName={admin.admin}
                  adminEmail={admin.email}
                />
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}

function toId(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}
