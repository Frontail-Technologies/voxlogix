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
import { admins, companies } from "@/data/mock-master";
import { cn } from "@/lib/utils";

import { AdminActionsMenu } from "./admin-actions-menu";

export function AdminsList() {
  return (
    <div className="space-y-6">
      <DashboardPageHeader
        title="Admins / Owners"
        description="Manage company owner accounts and access status"
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
        <DashboardCard>
          <div className="p-5 pb-4">
            <AdminsToolbar />
          </div>
          <AdminsTable />
        </DashboardCard>
        <p className="px-1 text-sm text-muted-foreground">
          Showing 1 to 5 of 42 results
        </p>
      </div>
    </div>
  );
}

function AdminsToolbar() {
  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
      <div className="relative w-full lg:max-w-xs">
        <AppIcon
          name="search"
          className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
        />
        <Input
          placeholder="Search admin..."
          className="h-10 rounded-xl bg-background pl-9"
        />
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:flex">
        <Select defaultValue="All Companies">
          <SelectTrigger className="h-10 w-full rounded-xl bg-background lg:w-48">
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
          <SelectTrigger className="h-10 w-full rounded-xl bg-background lg:w-40">
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

function AdminsTable() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Admin</TableHead>
          <TableHead>Company</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Status</TableHead>
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
                  <Avatar className="size-9 rounded-xl">
                    <AvatarFallback className="rounded-xl bg-accent text-xs font-semibold text-accent-foreground">
                      {admin.initials}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-foreground">{admin.admin}</p>
                    <p className="text-xs text-muted-foreground">Owner Admin</p>
                  </div>
                </Link>
              </TableCell>
              <TableCell>{admin.company}</TableCell>
              <TableCell>{admin.email}</TableCell>
              <TableCell>
                <StatusBadge status={admin.status} />
              </TableCell>
              <TableCell>{admin.lastLogin}</TableCell>
              <TableCell className="text-right">
                <AdminActionsMenu adminId={adminId} />
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
