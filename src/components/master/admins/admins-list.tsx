"use client";

import Link from "next/link";
import { useQueryClient } from "@tanstack/react-query";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { AppIcon } from "@/components/common/app-icon";
import { DashboardCard, DashboardPageHeader, StatusBadge, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/common/dashboard-ui";
import { EntityAvatar } from "@/components/common/entity-avatar";
import { MoreFiltersSheet } from "@/components/common/more-filters-sheet";
import { ResponsiveSearchControl } from "@/components/common/responsive-search-control";
import { TablePagination } from "@/components/common/table-pagination";
import { MasterTableSkeleton } from "@/components/master/master-skeletons";
import { buttonVariants } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select";
import type { AdminListItem } from "@/features/master-admins/api/admin.types";
import { prefetchAdminDetail, useAdminCompanyOptions, useAdminsList } from "@/features/master-admins/api/admin.queries";
import { cn } from "@/lib/utils";

import { AdminActionsMenu } from "./admin-actions-menu";

const userStatuses = ["ACTIVE", "INACTIVE", "SUSPENDED"];
const roles = ["ADMIN", "PLANNER", "EXECUTION"];

export function AdminsList() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const page = Number(searchParams.get("page") ?? "1");
  const search = searchParams.get("search") ?? "";
  const status = searchParams.get("status") ?? "all";
  const companyId = searchParams.get("companyId") ?? "all";
  const role = searchParams.get("role") ?? "ADMIN";
  const { data, isLoading, isError } = useAdminsList({
    page,
    limit: 20,
    search,
    status: status === "all" ? undefined : status,
    companyId: companyId === "all" ? undefined : companyId,
    role: role === "all" ? undefined : role,
  });
  const { data: companyOptions } = useAdminCompanyOptions();
  const admins = data?.data ?? [];
  const meta = data?.meta;

  function updateQuery(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (!value || value === "all") params.delete(key);
    else params.set(key, value);
    if (key !== "page") params.set("page", "1");
    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname);
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <DashboardPageHeader title="Admins" description="Manage company admin accounts and access status" action={<Link href="/master/admins/new" className={cn(buttonVariants(), "rounded-xl")}><AppIcon name="plus" className="size-4" />Add Admin</Link>} />
      <div className="space-y-3">
        <AdminsToolbar search={search} status={status} role={role} companyId={companyId} companies={companyOptions?.data ?? []} onSearchChange={(value) => updateQuery("search", value)} onStatusChange={(value) => updateQuery("status", value)} onRoleChange={(value) => updateQuery("role", value)} onCompanyChange={(value) => updateQuery("companyId", value)} />
        <DashboardCard>
          {isLoading ? <MasterTableSkeleton columns={7} /> : null}
          {isError ? <p className="p-5 text-sm text-muted-foreground">Could not load admins.</p> : null}
          {!isLoading && !isError ? <AdminsTable admins={admins} /> : null}
        </DashboardCard>
        {meta ? <TablePagination page={meta.page} totalPages={meta.totalPages} startItem={meta.totalItems ? meta.offset + 1 : 0} endItem={Math.min(meta.offset + meta.limit, meta.totalItems)} totalItems={meta.totalItems} canPrevious={meta.hasPreviousPage} canNext={meta.hasNextPage} onPageChange={(nextPage) => updateQuery("page", String(nextPage))} onPrevious={() => updateQuery("page", String(Math.max(1, page - 1)))} onNext={() => updateQuery("page", String(page + 1))} /> : null}
      </div>
    </div>
  );
}

function AdminsToolbar({ search, status, role, companyId, companies, onSearchChange, onStatusChange, onRoleChange, onCompanyChange }: { search: string; status: string; role: string; companyId: string; companies: Array<{ id: string; name: string }>; onSearchChange: (value: string) => void; onStatusChange: (value: string) => void; onRoleChange: (value: string) => void; onCompanyChange: (value: string) => void }) {
  const activeCount = [companyId !== "all", role !== "all", status !== "all"].filter(Boolean).length;

  return (
    <div className="flex flex-wrap items-center gap-2">
      <ResponsiveSearchControl placeholder="Search admin..." desktopClassName="lg:w-72" value={search} onChange={onSearchChange} />
      <MoreFiltersSheet activeCount={activeCount} title="Admin Filters" description="Narrow down admins by company, role, and status.">
        <div className="space-y-2">
          <Label>Company</Label>
          <Select value={companyId} onValueChange={(value) => value && onCompanyChange(value)}>
            <SelectTrigger className="h-11 w-full rounded-xl bg-secondary/70"><span className="truncate">{companyLabel(companyId, companies)}</span></SelectTrigger>
            <SelectContent><SelectItem value="all">All Companies</SelectItem>{companies.map((company) => <SelectItem key={company.id} value={company.id}>{company.name}</SelectItem>)}</SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Role</Label>
          <Select value={role} onValueChange={(value) => value && onRoleChange(value)}>
            <SelectTrigger className="h-11 w-full rounded-xl bg-secondary/70"><span className="truncate">{role === "all" ? "All Roles" : roleLabel(role)}</span></SelectTrigger>
            <SelectContent><SelectItem value="all">All Roles</SelectItem>{roles.map((item) => <SelectItem key={item} value={item}>{roleLabel(item)}</SelectItem>)}</SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Status</Label>
          <Select value={status} onValueChange={(value) => value && onStatusChange(value)}>
            <SelectTrigger className="h-11 w-full rounded-xl bg-secondary/70"><span className="truncate">{status === "all" ? "All Statuses" : statusLabel(status)}</span></SelectTrigger>
            <SelectContent><SelectItem value="all">All Statuses</SelectItem>{userStatuses.map((item) => <SelectItem key={item} value={item}>{statusLabel(item)}</SelectItem>)}</SelectContent>
          </Select>
        </div>
      </MoreFiltersSheet>
    </div>
  );
}

function AdminsTable({ admins }: { admins: AdminListItem[] }) {
  const queryClient = useQueryClient();
  return (
    <Table>
      <TableHeader><TableRow><TableHead>Admin</TableHead><TableHead>Company</TableHead><TableHead>Email</TableHead><TableHead>Status</TableHead><TableHead>Joined Date</TableHead><TableHead>Last Login</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
      <TableBody>
        {admins.length ? admins.map((admin) => (
          <TableRow key={admin.id}>
            <TableCell><Link href={`/master/admins/${admin.id}`} className="flex items-center gap-3" onMouseEnter={() => void prefetchAdminDetail(queryClient, admin.id)} onFocus={() => void prefetchAdminDetail(queryClient, admin.id)}><EntityAvatar initials={admin.initials} imageUrl={admin.avatarUrl ?? undefined} className="size-9" fallbackClassName="text-xs" /><div><p className="font-medium text-foreground">{admin.fullName}</p><p className="text-xs text-muted-foreground">{roleLabel(admin.role ?? "ADMIN")}</p></div></Link></TableCell>
            <TableCell>{admin.company.name}</TableCell>
            <TableCell>{admin.email}</TableCell>
            <TableCell><StatusBadge status={statusLabel(admin.status)} /></TableCell>
            <TableCell>{formatDate(admin.joinedOn)}</TableCell>
            <TableCell>{formatDate(admin.lastLoginAt)}</TableCell>
            <TableCell className="text-right"><AdminActionsMenu adminId={admin.id} adminName={admin.fullName} adminEmail={admin.email} adminStatus={admin.status} /></TableCell>
          </TableRow>
        )) : <TableRow><TableCell colSpan={7} className="py-8 text-center text-muted-foreground">No admins found.</TableCell></TableRow>}
      </TableBody>
    </Table>
  );
}

function companyLabel(companyId: string, companies: Array<{ id: string; name: string }>) { return companyId === "all" ? "All Companies" : companies.find((company) => company.id === companyId)?.name ?? "Company"; }
function roleLabel(value: string) { return value.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase()); }
function statusLabel(value: string) { return value.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase()); }
function formatDate(value: string | null) { return value ? new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(new Date(value)) : "-"; }
