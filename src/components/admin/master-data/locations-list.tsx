"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { AppIcon } from "@/components/common/app-icon";
import { DeleteConfirmDialog } from "@/components/common/delete-confirm-dialog";
import { ResponsiveSearchControl } from "@/components/common/responsive-search-control";
import { TablePagination } from "@/components/common/table-pagination";
import { DashboardCard, DashboardPageHeader, StatusBadge, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/common/dashboard-ui";
import { MasterTableSkeleton } from "@/components/master/master-skeletons";
import { buttonVariants } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select";
import { useDeleteLocation } from "@/features/admin-master-data/api/master-data.mutations";
import { useLocationsList } from "@/features/admin-master-data/api/master-data.queries";
import type { LocationItem } from "@/features/admin-master-data/api/master-data.types";
import { formatMasterDataDate, masterDataLabel, masterDataStatuses } from "@/features/admin-master-data/master-data.presentation";
import { showApiErrorToast } from "@/lib/api/error-toast";
import { cn } from "@/lib/utils";

export function LocationsList() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const page = Number(searchParams.get("page") ?? "1");
  const search = searchParams.get("search") ?? "";
  const status = searchParams.get("status") ?? "all";
  const { data, isLoading, isError } = useLocationsList({ page, limit: 20, search, status: status === "all" ? undefined : status });
  const locations = data?.data ?? [];
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
        title="Locations & Shifts"
        description="Manage plant, unit, section, sub-location, shift, and department master data."
        action={<Link href="/admin/locations/new" className={cn(buttonVariants(), "rounded-xl")}><AppIcon name="plus" className="size-4" />Add Location</Link>}
      />
      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <ResponsiveSearchControl placeholder="Search locations or shifts..." desktopClassName="sm:w-80" value={search} onChange={(value) => updateQuery("search", value)} />
          <Select value={status} onValueChange={(value) => value && updateQuery("status", value)}>
            <SelectTrigger className="h-10 w-44 rounded-xl bg-secondary/70"><span className="truncate">{status === "all" ? "All Statuses" : masterDataLabel(status)}</span></SelectTrigger>
            <SelectContent><SelectItem value="all">All Statuses</SelectItem>{masterDataStatuses.map((item) => <SelectItem key={item.value} value={item.value}>{item.label}</SelectItem>)}</SelectContent>
          </Select>
        </div>
        {meta ? <TablePagination page={meta.page} totalPages={meta.totalPages} startItem={meta.totalItems ? meta.offset + 1 : 0} endItem={Math.min(meta.offset + meta.limit, meta.totalItems)} totalItems={meta.totalItems} canPrevious={meta.hasPreviousPage} canNext={meta.hasNextPage} onPageChange={(nextPage) => updateQuery("page", String(nextPage))} onPrevious={() => updateQuery("page", String(Math.max(1, page - 1)))} onNext={() => updateQuery("page", String(page + 1))} /> : null}
        <DashboardCard>
          {isLoading ? <MasterTableSkeleton columns={9} /> : null}
          {isError ? <p className="p-5 text-sm text-muted-foreground">Could not load locations and shifts.</p> : null}
          {!isLoading && !isError ? <LocationsTable locations={locations} /> : null}
        </DashboardCard>
      </div>
    </div>
  );
}

function LocationsTable({ locations }: { locations: LocationItem[] }) {
  return (
    <Table className="[&_td]:py-3">
      <TableHeader>
        <TableRow>
          <TableHead>Plant</TableHead>
          <TableHead>Unit</TableHead>
          <TableHead>Section</TableHead>
          <TableHead>Sub Location</TableHead>
          <TableHead>Shift</TableHead>
          <TableHead>Department</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Updated</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {locations.length ? locations.map((location) => <LocationRow key={location.id} location={location} />) : <TableRow><TableCell colSpan={9} className="py-8 text-center text-muted-foreground">No locations or shifts found.</TableCell></TableRow>}
      </TableBody>
    </Table>
  );
}

function LocationRow({ location }: { location: LocationItem }) {
  const deleteMutation = useDeleteLocation();
  const [dialogOpen, setDialogOpen] = useState(false);
  async function handleDelete() {
    try {
      await deleteMutation.mutateAsync(location.id);
      toast.success("Location deleted");
    } catch (error) {
      showApiErrorToast(error, "Could not delete location");
    }
  }
  return (
    <TableRow>
      <TableCell className="font-medium text-foreground">{location.plant}</TableCell>
      <TableCell>{location.unit || "-"}</TableCell>
      <TableCell>{location.section}</TableCell>
      <TableCell>{location.subLocation}</TableCell>
      <TableCell>{location.shiftDetails || "-"}</TableCell>
      <TableCell>{location.department || "-"}</TableCell>
      <TableCell><StatusBadge status={masterDataLabel(location.status)} /></TableCell>
      <TableCell className="text-muted-foreground">{formatMasterDataDate(location.updatedAt)}</TableCell>
      <TableCell className="text-right">
        <div className="inline-flex items-center gap-1">
          <Link href={`/admin/locations/${location.id}/edit`} className="inline-flex size-8 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-accent-foreground"><AppIcon name="settings" className="size-4" /><span className="sr-only">Edit</span></Link>
          <button type="button" className="inline-flex size-8 items-center justify-center rounded-md text-destructive hover:bg-destructive/10" onClick={() => setDialogOpen(true)}><AppIcon name="trash" className="size-4" /><span className="sr-only">Delete</span></button>
        </div>
        <DeleteConfirmDialog open={dialogOpen} onOpenChange={setDialogOpen} title="Delete location?" description={`This will delete ${location.section} / ${location.subLocation}.`} confirmLabel="Delete Location" onConfirm={() => void handleDelete()} />
      </TableCell>
    </TableRow>
  );
}
