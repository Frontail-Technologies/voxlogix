"use client";

import Link from "next/link";
import { useQueryClient } from "@tanstack/react-query";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { AppIcon } from "@/components/common/app-icon";
import { ResponsiveSearchControl } from "@/components/common/responsive-search-control";
import { TablePagination } from "@/components/common/table-pagination";
import {
  DashboardCard,
  DashboardPageHeader,
  DashboardStatCard,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/common/dashboard-ui";
import { EntityAvatar } from "@/components/common/entity-avatar";
import {
  MasterCardGridSkeleton,
  MasterTableSkeleton,
} from "@/components/master/master-skeletons";
import { buttonVariants } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { prefetchEquipmentDetail, useEquipmentList } from "@/features/admin-equipment/api/equipment.queries";
import type { EquipmentListItem } from "@/features/admin-equipment/api/equipment.types";
import {
  equipmentCriticalities,
  equipmentInitials,
  equipmentStatuses,
  formatEquipmentDate,
  normalizeOptionValue,
  optionLabel,
} from "@/features/admin-equipment/equipment.presentation";
import { cn } from "@/lib/utils";

import { CriticalityBadge, EquipmentStatusBadge } from "./equipment-badges";
import { EquipmentActionsMenu } from "./equipment-actions-menu";

export function EquipmentList() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const page = Number(searchParams.get("page") ?? "1");
  const search = searchParams.get("search") ?? "";
  const status = searchParams.get("status") ?? "all";
  const criticality = searchParams.get("criticality") ?? "all";
  const { data, isLoading, isError } = useEquipmentList({
    page,
    limit: 20,
    search,
    status: status === "all" ? undefined : status,
    criticality: criticality === "all" ? undefined : criticality,
  });
  const equipment = data?.data ?? [];
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
        title="Equipment"
        description="Manage plant equipment, service history, and downtime"
        action={
          <Link
            href="/admin/equipment/new"
            className={cn(buttonVariants(), "rounded-xl")}
          >
            <AppIcon name="plus" className="size-4" />
            Add Equipment
          </Link>
        }
      />

      {isLoading ? (
        <MasterCardGridSkeleton />
      ) : (
        <EquipmentStatsRow
          equipment={equipment}
          totalItems={meta?.totalItems ?? equipment.length}
        />
      )}

      <div className="space-y-3">
        <EquipmentToolbar
          search={search}
          status={status}
          criticality={criticality}
          onSearchChange={(value) => updateQuery("search", value)}
          onStatusChange={(value) => updateQuery("status", value)}
          onCriticalityChange={(value) => updateQuery("criticality", value)}
        />
        {meta ? (
          <TablePagination
            page={meta.page}
            totalPages={meta.totalPages}
            startItem={meta.totalItems ? meta.offset + 1 : 0}
            endItem={Math.min(meta.offset + meta.limit, meta.totalItems)}
            totalItems={meta.totalItems}
            canPrevious={meta.hasPreviousPage}
            canNext={meta.hasNextPage}
            onPageChange={(nextPage) => updateQuery("page", String(nextPage))}
            onPrevious={() => updateQuery("page", String(Math.max(1, page - 1)))}
            onNext={() => updateQuery("page", String(page + 1))}
          />
        ) : null}
        <DashboardCard>
          {isLoading ? <MasterTableSkeleton columns={8} /> : null}
          {isError ? (
            <p className="p-5 text-sm text-muted-foreground">
              Could not load equipment.
            </p>
          ) : null}
          {!isLoading && !isError ? (
            <EquipmentTable equipment={equipment} onPrefetch={(equipmentId) => void prefetchEquipmentDetail(queryClient, equipmentId)} />
          ) : null}
        </DashboardCard>
      </div>
    </div>
  );
}

function EquipmentStatsRow({
  equipment,
  totalItems,
}: {
  equipment: EquipmentListItem[];
  totalItems: number;
}) {
  const active = equipment.filter(
    (item) => normalizeOptionValue(item.status) === "ACTIVE",
  ).length;
  const underMaintenance = equipment.filter(
    (item) => normalizeOptionValue(item.status) === "UNDER_MAINTENANCE",
  ).length;
  const critical = equipment.filter(
    (item) =>
      normalizeOptionValue(item.criticality) === "CRITICAL" ||
      normalizeOptionValue(item.status) === "CRITICAL",
  ).length;

  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
      <DashboardStatCard
        label="Total Equipment"
        value={String(totalItems)}
        helper="Company assets"
        icon="equipment"
        tone="navy"
      />
      <DashboardStatCard
        label="Active"
        value={String(active)}
        helper="Visible on this page"
        icon="status"
        tone="green"
      />
      <DashboardStatCard
        label="Maintenance"
        value={String(underMaintenance)}
        helper="Visible on this page"
        icon="activity"
        tone="amber"
      />
      <DashboardStatCard
        label="Critical"
        value={String(critical)}
        helper="Visible on this page"
        icon="warning"
        tone="red"
      />
    </div>
  );
}

function EquipmentToolbar({
  search,
  status,
  criticality,
  onSearchChange,
  onStatusChange,
  onCriticalityChange,
}: {
  search: string;
  status: string;
  criticality: string;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onCriticalityChange: (value: string) => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <ResponsiveSearchControl
        placeholder="Search equipment..."
        desktopClassName="sm:w-72"
        value={search}
        onChange={onSearchChange}
      />
      <Select value={status} onValueChange={(value) => value && onStatusChange(value)}>
        <SelectTrigger className="h-10 w-44 rounded-xl bg-secondary/70">
          <span className="truncate">
            {status === "all" ? "All Statuses" : optionLabel(status)}
          </span>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Statuses</SelectItem>
          {equipmentStatuses.map((item) => (
            <SelectItem key={item.value} value={item.value}>
              {item.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select
        value={criticality}
        onValueChange={(value) => value && onCriticalityChange(value)}
      >
        <SelectTrigger className="h-10 w-44 rounded-xl bg-secondary/70">
          <span className="truncate">
            {criticality === "all" ? "All Criticality" : optionLabel(criticality)}
          </span>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Criticality</SelectItem>
          {equipmentCriticalities.map((item) => (
            <SelectItem key={item.value} value={item.value}>
              {item.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

function EquipmentTable({ equipment, onPrefetch }: { equipment: EquipmentListItem[]; onPrefetch: (equipmentId: string) => void }) {
  return (
    <Table className="[&_td]:py-3">
      <TableHeader>
        <TableRow>
          <TableHead>Asset</TableHead>
          <TableHead>Category</TableHead>
          <TableHead>Section / Sub Location</TableHead>
          <TableHead>Map</TableHead>
          <TableHead>Criticality</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Updated</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {equipment.length ? (
          equipment.map((item) => (
            <TableRow key={item.id}>
              <TableCell>
                <Link
                  href={`/admin/equipment/${item.id}`}
                  className="flex items-center gap-3"
                  onMouseEnter={() => onPrefetch(item.id)}
                  onFocus={() => onPrefetch(item.id)}
                >
                  <EntityAvatar
                    initials={equipmentInitials(item.name, item.equipmentCode)}
                    imageUrl={item.imageUrl ?? undefined}
                    className="size-9"
                    fallbackClassName="text-xs"
                  />
                  <div>
                    <p className="font-medium text-foreground">{item.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {item.equipmentCode}
                    </p>
                  </div>
                </Link>
              </TableCell>
              <TableCell>{item.category}</TableCell>
              <TableCell>
                {item.section} / {item.subLocation}
              </TableCell>
              <TableCell>
                <MapLink latitude={item.latitude} longitude={item.longitude} mapUrl={item.mapUrl} />
              </TableCell>
              <TableCell>
                <CriticalityBadge criticality={item.criticality} />
              </TableCell>
              <TableCell>
                <EquipmentStatusBadge status={item.status} />
              </TableCell>
              <TableCell>{formatEquipmentDate(item.updatedAt)}</TableCell>
              <TableCell className="text-right">
                <EquipmentActionsMenu
                  equipmentId={item.id}
                  equipmentName={item.name}
                />
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={8} className="py-8 text-center text-muted-foreground">
              No equipment found.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}

function MapLink({ latitude, longitude, mapUrl }: { latitude?: string | null; longitude?: string | null; mapUrl?: string | null }) {
  const href = mapUrl || (latitude && longitude ? `https://www.google.com/maps?q=${latitude},${longitude}` : "");

  if (!href) {
    return <span className="text-muted-foreground">-</span>;
  }

  return (
    <a href={href} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline">
      <AppIcon name="planet" className="size-4" />
      Open
    </a>
  );
}
