"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { DashboardCard, DashboardPageHeader, StatusBadge, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/common/dashboard-ui";
import { ResponsiveSearchControl } from "@/components/common/responsive-search-control";
import { TablePagination } from "@/components/common/table-pagination";
import { MasterTableSkeleton } from "@/components/master/master-skeletons";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select";
import type { PlatformActivity } from "@/features/master-activities/api/activity.types";
import { useActivitiesList } from "@/features/master-activities/api/activity.queries";

const activityStatuses = ["Success", "Warning", "Failed"];
const activityAreas = ["Companies", "Admins", "Modules", "Settings", "Usage"];

export function ActivitiesList() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const page = Number(searchParams.get("page") ?? "1");
  const search = searchParams.get("search") ?? "";
  const status = searchParams.get("status") ?? "all";
  const area = searchParams.get("area") ?? "all";
  const { data, isLoading, isError } = useActivitiesList({
    page,
    limit: 20,
    search,
    status: status === "all" ? undefined : status,
    area: area === "all" ? undefined : area,
  });
  const activities = data?.data ?? [];
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
      <DashboardPageHeader title="Activities" description="Track platform actions across companies, admins, modules, and AI settings" />
      <div className="space-y-3">
        <ActivitiesToolbar search={search} status={status} area={area} onSearchChange={(value) => updateQuery("search", value)} onStatusChange={(value) => updateQuery("status", value)} onAreaChange={(value) => updateQuery("area", value)} />
        <DashboardCard>
          {isLoading ? <MasterTableSkeleton columns={7} /> : null}
          {isError ? <p className="p-5 text-sm text-muted-foreground">Could not load activities.</p> : null}
          {!isLoading && !isError ? <ActivitiesTable activities={activities} /> : null}
        </DashboardCard>
        {meta ? <TablePagination page={meta.page} totalPages={meta.totalPages} startItem={meta.totalItems ? meta.offset + 1 : 0} endItem={Math.min(meta.offset + meta.limit, meta.totalItems)} totalItems={meta.totalItems} canPrevious={meta.hasPreviousPage} canNext={meta.hasNextPage} onPageChange={(nextPage) => updateQuery("page", String(nextPage))} onPrevious={() => updateQuery("page", String(Math.max(1, page - 1)))} onNext={() => updateQuery("page", String(page + 1))} /> : null}
      </div>
    </div>
  );
}

function ActivitiesToolbar({ search, status, area, onSearchChange, onStatusChange, onAreaChange }: { search: string; status: string; area: string; onSearchChange: (value: string) => void; onStatusChange: (value: string) => void; onAreaChange: (value: string) => void }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <ResponsiveSearchControl placeholder="Search activity..." desktopClassName="lg:w-72" value={search} onChange={onSearchChange} />
      <Select value={area} onValueChange={(value) => value && onAreaChange(value)}>
        <SelectTrigger className="h-10 w-36 rounded-xl bg-secondary/70"><span className="truncate">{area === "all" ? "All Areas" : area}</span></SelectTrigger>
        <SelectContent><SelectItem value="all">All Areas</SelectItem>{activityAreas.map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}</SelectContent>
      </Select>
      <Select value={status} onValueChange={(value) => value && onStatusChange(value)}>
        <SelectTrigger className="h-10 w-40 rounded-xl bg-secondary/70"><span className="truncate">{status === "all" ? "All Statuses" : status}</span></SelectTrigger>
        <SelectContent><SelectItem value="all">All Statuses</SelectItem>{activityStatuses.map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}</SelectContent>
      </Select>
    </div>
  );
}

function ActivitiesTable({ activities }: { activities: PlatformActivity[] }) {
  return (
    <Table>
      <TableHeader><TableRow><TableHead>Event</TableHead><TableHead>Area</TableHead><TableHead>Company</TableHead><TableHead>User</TableHead><TableHead>Action</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Time</TableHead></TableRow></TableHeader>
      <TableBody>
        {activities.length ? activities.map((activity) => (
          <TableRow key={activity.id}><TableCell className="font-medium text-foreground">{activity.event}</TableCell><TableCell>{activity.area}</TableCell><TableCell>{activity.company.name}</TableCell><TableCell>{activity.user}</TableCell><TableCell>{activity.action}</TableCell><TableCell><StatusBadge status={activity.status} /></TableCell><TableCell className="text-right text-muted-foreground">{formatDate(activity.occurredAt)}</TableCell></TableRow>
        )) : <TableRow><TableCell colSpan={7} className="py-8 text-center text-muted-foreground">No activities found.</TableCell></TableRow>}
      </TableBody>
    </Table>
  );
}

function formatDate(value: string) { return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" }).format(new Date(value)); }