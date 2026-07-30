"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

import { AppIcon, type AppIconName } from "@/components/common/app-icon";
import { DashboardCard, DashboardPageHeader, StatusBadge, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/common/dashboard-ui";
import { ResponsiveSearchControl } from "@/components/common/responsive-search-control";
import { TablePagination } from "@/components/common/table-pagination";
import { MasterTableSkeleton, ModuleCardGridSkeleton } from "@/components/master/master-skeletons";
import { buttonVariants } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import type { ModuleListItem } from "@/features/master-modules/api/module.types";
import { useModulesList } from "@/features/master-modules/api/module.queries";
import { useActiveModuleTypesOptions } from "@/features/master-module-types/api/module-type.queries";
import { cn } from "@/lib/utils";

import { ModuleActionsMenu } from "./module-actions-menu";

const moduleStatuses = ["ACTIVE", "INACTIVE", "COMING_SOON"];

export function ModulesList() {
  const [tableView, setTableView] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const page = Number(searchParams.get("page") ?? "1");
  const search = searchParams.get("search") ?? "";
  const status = searchParams.get("status") ?? "all";
  const type = searchParams.get("type") ?? "all";
  const moduleTypesQuery = useActiveModuleTypesOptions();
  const moduleTypeOptions = moduleTypesQuery.data?.data ?? [];
  const { data, isLoading, isError } = useModulesList({
    page,
    limit: 20,
    search,
    status: status === "all" ? undefined : status,
    moduleTypeId: type === "all" ? undefined : type,
  });
  const modules = data?.data ?? [];
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
      <DashboardPageHeader title="Modules" description="Manage global platform modules and field schemas" action={<Link href="/master/modules/new" className={cn(buttonVariants(), "rounded-xl")}><AppIcon name="plus" className="size-4" />New Module</Link>} />
      <div className="space-y-3">
        <ModulesToolbar search={search} status={status} type={type} typeOptions={moduleTypeOptions} onSearchChange={(value) => updateQuery("search", value)} onStatusChange={(value) => updateQuery("status", value)} onTypeChange={(value) => updateQuery("type", value)} tableView={tableView} onTableViewChange={setTableView} />
        {isLoading ? tableView ? <DashboardCard><MasterTableSkeleton columns={7} /></DashboardCard> : <ModuleCardGridSkeleton cards={6} /> : null}
        {isError ? <DashboardCard><p className="p-5 text-sm text-muted-foreground">Could not load modules.</p></DashboardCard> : null}
        {!isLoading && !isError ? tableView ? <ModulesTable modules={modules} /> : <ModulesCards modules={modules} /> : null}
        {meta ? <TablePagination page={meta.page} totalPages={meta.totalPages} startItem={meta.totalItems ? meta.offset + 1 : 0} endItem={Math.min(meta.offset + meta.limit, meta.totalItems)} totalItems={meta.totalItems} canPrevious={meta.hasPreviousPage} canNext={meta.hasNextPage} onPageChange={(nextPage) => updateQuery("page", String(nextPage))} onPrevious={() => updateQuery("page", String(Math.max(1, page - 1)))} onNext={() => updateQuery("page", String(page + 1))} /> : null}
      </div>
    </div>
  );
}

function ModulesToolbar({ search, status, type, typeOptions, onSearchChange, onStatusChange, onTypeChange, tableView, onTableViewChange }: { search: string; status: string; type: string; typeOptions: Array<{ id: string; name: string }>; onSearchChange: (value: string) => void; onStatusChange: (value: string) => void; onTypeChange: (value: string) => void; tableView: boolean; onTableViewChange: (value: boolean) => void }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <ResponsiveSearchControl placeholder="Search modules..." desktopClassName="min-w-44 sm:w-72" value={search} onChange={onSearchChange} />
      <Select value={type} onValueChange={(value) => value && onTypeChange(value)}>
        <SelectTrigger className="h-10 min-w-40 flex-1 rounded-xl bg-secondary/70 sm:w-44 sm:flex-none"><span className="truncate">{type === "all" ? "All Types" : statusLabel(typeOptions.find((option) => option.id === type)?.name ?? type)}</span></SelectTrigger>
        <SelectContent><SelectItem value="all">All Types</SelectItem>{typeOptions.map((item) => <SelectItem key={item.id} value={item.id}>{statusLabel(item.name)}</SelectItem>)}</SelectContent>
      </Select>
      <Select value={status} onValueChange={(value) => value && onStatusChange(value)}>
        <SelectTrigger className="h-10 min-w-40 flex-1 rounded-xl bg-secondary/70 sm:w-40 sm:flex-none"><span className="truncate">{status === "all" ? "All Statuses" : statusLabel(status)}</span></SelectTrigger>
        <SelectContent><SelectItem value="all">All Statuses</SelectItem>{moduleStatuses.map((item) => <SelectItem key={item} value={item}>{statusLabel(item)}</SelectItem>)}</SelectContent>
      </Select>
      <div className="flex w-full items-center justify-end gap-3 sm:ml-auto sm:w-auto"><span className="text-sm font-medium text-muted-foreground">Cards</span><Switch checked={tableView} onCheckedChange={onTableViewChange} /><span className="text-sm font-medium text-foreground">Table</span></div>
    </div>
  );
}

function ModulesCards({ modules }: { modules: ModuleListItem[] }) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 xl:grid-cols-3">
      {modules.length ? modules.map((module) => (
        <DashboardCard key={module.id} className="rounded-xl">
          <div className="space-y-3 p-3 sm:space-y-5 sm:p-4">
            <div className="flex items-start justify-between gap-3">
              <Link href={`/master/modules/${module.id}/edit`} className="flex min-w-0 items-center gap-2 sm:gap-3">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary/14 text-primary sm:size-12 sm:rounded-2xl"><AppIcon name={moduleIcon(module.icon)} className="size-5 sm:size-6" /></div>
                <div className="min-w-0"><h2 className="truncate text-sm font-semibold text-card-foreground">{module.name}</h2><p className="mt-1 text-xs text-muted-foreground">{module.category}</p></div>
              </Link>
              <ModuleActionsMenu module={module} />
            </div>
            <div className="flex items-center justify-between gap-3"><span className="truncate text-xs font-medium text-muted-foreground">{module.availabilityText} - {formatDate(module.createdAt)}</span><StatusBadge status={statusLabel(module.status)} /></div>
          </div>
        </DashboardCard>
      )) : <DashboardCard><p className="p-5 text-sm text-muted-foreground">No modules found.</p></DashboardCard>}
    </div>
  );
}

function ModulesTable({ modules }: { modules: ModuleListItem[] }) {
  return (
    <DashboardCard>
      <Table>
        <TableHeader><TableRow><TableHead>Module</TableHead><TableHead>Category</TableHead><TableHead>Availability</TableHead><TableHead>Fields</TableHead><TableHead>Created Date</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
        <TableBody>
          {modules.length ? modules.map((module) => (
            <TableRow key={module.id}>
              <TableCell><Link href={`/master/modules/${module.id}/edit`} className="flex items-center gap-3"><div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary/14 text-primary"><AppIcon name={moduleIcon(module.icon)} className="size-5" /></div><span className="font-medium text-foreground">{module.name}</span></Link></TableCell>
              <TableCell>{module.category}</TableCell><TableCell>{module.availabilityText}</TableCell><TableCell>{module.fieldsCount}</TableCell><TableCell>{formatDate(module.createdAt)}</TableCell><TableCell><StatusBadge status={statusLabel(module.status)} /></TableCell>
              <TableCell className="text-right"><ModuleActionsMenu module={module} /></TableCell>
            </TableRow>
          )) : <TableRow><TableCell colSpan={7} className="py-8 text-center text-muted-foreground">No modules found.</TableCell></TableRow>}
        </TableBody>
      </Table>
    </DashboardCard>
  );
}

function moduleIcon(icon: string): AppIconName { return (icon === "clipboard-text" ? "logs" : icon === "warning-circle" ? "warning" : icon === "gauge" ? "status" : icon === "clock-countdown" ? "activity" : icon === "sparkle" ? "ai" : icon === "git-branch" ? "modules" : icon) as AppIconName; }
function statusLabel(value: string) { return value.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase()); }
function formatDate(value: string) { return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(new Date(value)); }

