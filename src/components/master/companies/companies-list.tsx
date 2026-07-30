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
import type { CompanyListItem } from "@/features/master-companies/api/company.types";
import { prefetchCompanyDetail, useCompaniesList } from "@/features/master-companies/api/company.queries";
import { cn } from "@/lib/utils";

import { CompanyActionsMenu } from "./company-actions-menu";

const companyStatuses = ["ACTIVE", "DEMO", "INACTIVE", "SUSPENDED", "EXPIRED"];

export function CompaniesList() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const page = Number(searchParams.get("page") ?? "1");
  const search = searchParams.get("search") ?? "";
  const status = searchParams.get("status") ?? "all";
  const { data, isLoading, isError } = useCompaniesList({
    page,
    limit: 20,
    search,
    status: status === "all" ? undefined : status,
  });
  const companies = data?.data ?? [];
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
      <DashboardPageHeader
        title="Companies"
        description="Manage all companies on the platform"
        action={<Link href="/master/companies/new" className={cn(buttonVariants(), "rounded-xl")}><AppIcon name="plus" className="size-4" />Add Company</Link>}
      />
      <div className="space-y-3">
        <CompaniesToolbar search={search} status={status} onSearchChange={(value) => updateQuery("search", value)} onStatusChange={(value) => updateQuery("status", value)} />
        <DashboardCard>
          {isLoading ? <MasterTableSkeleton columns={7} /> : null}
          {isError ? <p className="p-5 text-sm text-muted-foreground">Could not load companies.</p> : null}
          {!isLoading && !isError ? <CompaniesTable companies={companies} /> : null}
        </DashboardCard>
        {meta ? <TablePagination page={meta.page} totalPages={meta.totalPages} startItem={meta.totalItems ? meta.offset + 1 : 0} endItem={Math.min(meta.offset + meta.limit, meta.totalItems)} totalItems={meta.totalItems} canPrevious={meta.hasPreviousPage} canNext={meta.hasNextPage} onPageChange={(nextPage) => updateQuery("page", String(nextPage))} onPrevious={() => updateQuery("page", String(Math.max(1, page - 1)))} onNext={() => updateQuery("page", String(page + 1))} /> : null}
      </div>
    </div>
  );
}

function CompaniesToolbar({ search, status, onSearchChange, onStatusChange }: { search: string; status: string; onSearchChange: (value: string) => void; onStatusChange: (value: string) => void }) {
  const activeCount = status !== "all" ? 1 : 0;

  return (
    <div className="flex flex-wrap items-center gap-2">
      <ResponsiveSearchControl placeholder="Search company..." desktopClassName="sm:w-72" value={search} onChange={onSearchChange} />
      <MoreFiltersSheet activeCount={activeCount} title="Company Filters" description="Narrow down companies by status.">
        <div className="space-y-2">
          <Label>Status</Label>
          <Select value={status} onValueChange={(value) => value && onStatusChange(value)}>
            <SelectTrigger className="h-11 w-full rounded-xl bg-secondary/70"><span className="truncate">{status === "all" ? "All Statuses" : statusLabel(status)}</span></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              {companyStatuses.map((item) => <SelectItem key={item} value={item}>{statusLabel(item)}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </MoreFiltersSheet>
    </div>
  );
}

function CompaniesTable({ companies }: { companies: CompanyListItem[] }) {
  const queryClient = useQueryClient();
  return (
    <Table>
      <TableHeader><TableRow><TableHead>Company</TableHead><TableHead>Owner</TableHead><TableHead>Status</TableHead><TableHead>Plan</TableHead><TableHead>Start Date</TableHead><TableHead>Expiry Date</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
      <TableBody>
        {companies.length ? companies.map((company) => (
          <TableRow key={company.id}>
            <TableCell><Link href={`/master/companies/${company.id}`} className="flex items-center gap-3" onMouseEnter={() => void prefetchCompanyDetail(queryClient, company.id)} onFocus={() => void prefetchCompanyDetail(queryClient, company.id)}><EntityAvatar initials={company.logo ?? initials(company.name)} imageUrl={company.logoUrl ?? undefined} className="size-9" fallbackClassName="text-xs" /><div><p className="font-medium text-foreground">{company.name}</p><p className="text-xs text-muted-foreground">{company.businessType}</p></div></Link></TableCell>
            <TableCell>{company.ownerName}</TableCell>
            <TableCell><StatusBadge status={statusLabel(company.status)} /></TableCell>
            <TableCell>{company.plan}</TableCell>
            <TableCell>{formatDate(company.startDate)}</TableCell>
            <TableCell>{formatDate(company.expiryDate)}</TableCell>
            <TableCell className="text-right"><CompanyActionsMenu companyId={company.id} companyName={company.name} companyStatus={company.status} /></TableCell>
          </TableRow>
        )) : <TableRow><TableCell colSpan={7} className="py-8 text-center text-muted-foreground">No companies found.</TableCell></TableRow>}
      </TableBody>
    </Table>
  );
}

function initials(value: string) { return value.split(/\s+/).slice(0, 2).map((part) => part[0]).join("").toUpperCase(); }
function statusLabel(value: string) { return value.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase()); }
function formatDate(value: string | null) { return value ? new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(new Date(value)) : "-"; }
