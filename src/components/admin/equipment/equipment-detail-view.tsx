"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type ReactNode } from "react";
import { toast } from "sonner";

import { AppIcon } from "@/components/common/app-icon";
import {
  CardContent,
  DashboardCard,
  DashboardPageHeader,
} from "@/components/common/dashboard-ui";
import { DeleteConfirmDialog } from "@/components/common/delete-confirm-dialog";
import { EntityAvatar } from "@/components/common/entity-avatar";
import { MasterDetailSkeleton } from "@/components/master/master-skeletons";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  useDeleteEquipment,
  useUpdateEquipment,
} from "@/features/admin-equipment/api/equipment.mutations";
import { useEquipmentDetail } from "@/features/admin-equipment/api/equipment.queries";
import type { EquipmentDetail } from "@/features/admin-equipment/api/equipment.types";
import {
  equipmentInitials,
  formatEquipmentDate,
  optionLabel,
} from "@/features/admin-equipment/equipment.presentation";
import { showApiErrorToast } from "@/lib/api/error-toast";
import { cn } from "@/lib/utils";

import { CriticalityBadge, EquipmentStatusBadge } from "./equipment-badges";

const maintenanceStatus = "UNDER_MAINTENANCE";

export function EquipmentDetailView({ equipmentId }: { equipmentId: string }) {
  const { data, isLoading, isError } = useEquipmentDetail(equipmentId);
  const equipment = data?.data;

  return (
    <div className="space-y-4 sm:space-y-6">
      <DashboardPageHeader
        title="Equipment Detail"
        description="Asset overview, location, metadata, and quick actions"
        hideDescriptionOnMobile
      />

      {isLoading ? <MasterDetailSkeleton /> : null}
      {isError ? (
        <DashboardCard>
          <p className="p-5 text-sm text-muted-foreground">
            Could not load equipment detail.
          </p>
        </DashboardCard>
      ) : null}
      {equipment ? (
        <div className="grid items-start gap-3 sm:gap-4 xl:grid-cols-[1fr_320px]">
          <div className="space-y-3 sm:space-y-4">
            <EquipmentOverviewCard equipment={equipment} />
            <EquipmentNotesCard equipment={equipment} />
          </div>
          <EquipmentQuickActions equipment={equipment} />
        </div>
      ) : null}
    </div>
  );
}

function EquipmentOverviewCard({ equipment }: { equipment: EquipmentDetail }) {
  return (
    <DashboardCard>
      <CardContent className="space-y-4 p-4 sm:space-y-6 sm:p-6">
        <EquipmentIdentity equipment={equipment} />
        <EquipmentStatsGrid equipment={equipment} />
        <EquipmentInfoGrid equipment={equipment} />
      </CardContent>
    </DashboardCard>
  );
}

function EquipmentIdentity({ equipment }: { equipment: EquipmentDetail }) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3 sm:gap-4">
        <EntityAvatar
          initials={equipmentInitials(equipment.name, equipment.equipmentCode)}
          imageUrl={equipment.imageUrl ?? undefined}
          className="size-12 sm:size-14"
          fallbackClassName="text-base sm:text-lg"
        />
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-lg font-semibold sm:text-xl">
              {equipment.name}
            </h2>
            <EquipmentStatusBadge status={equipment.status} />
            <CriticalityBadge criticality={equipment.criticality} />
          </div>
          <p className="text-sm text-muted-foreground">
            {equipment.equipmentCode}
          </p>
        </div>
      </div>
      <Badge className="w-fit rounded-xl bg-primary/15 text-primary">
        {equipment.category}
      </Badge>
    </div>
  );
}

function EquipmentStatsGrid({ equipment }: { equipment: EquipmentDetail }) {
  const stats = [
    { label: "Status", value: optionLabel(equipment.status), icon: "status" },
    {
      label: "Criticality",
      value: optionLabel(equipment.criticality),
      icon: "warning",
    },
    { label: "Section", value: equipment.section, icon: "equipment" },
    {
      label: "Updated",
      value: formatEquipmentDate(equipment.updatedAt),
      icon: "calendar",
    },
  ] as const;

  return (
    <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="flex items-start gap-3 rounded-2xl border border-border bg-background p-3 sm:p-4"
        >
          <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary/12 text-primary">
            <AppIcon name={stat.icon} className="size-4" />
          </span>
          <span className="min-w-0">
            <p className="text-xs text-muted-foreground">{stat.label}</p>
            <p className="mt-1 truncate text-sm font-semibold sm:text-base">
              {stat.value || "-"}
            </p>
          </span>
        </div>
      ))}
    </div>
  );
}

function EquipmentInfoGrid({ equipment }: { equipment: EquipmentDetail }) {
  return (
    <div className="grid gap-3 sm:gap-4 lg:grid-cols-2">
      <InfoCard title="Location">
        <InfoRow label="Plant" value={equipment.location?.plant} />
        <InfoRow label="Unit" value={equipment.location?.unit} />
        <InfoRow label="Section" value={equipment.section} />
        <InfoRow label="Sub Location" value={equipment.subLocation} />
        <InfoRow label="Latitude" value={equipment.latitude} />
        <InfoRow label="Longitude" value={equipment.longitude} />
        <EquipmentMapLink latitude={equipment.latitude} longitude={equipment.longitude} mapUrl={equipment.mapUrl} />
      </InfoCard>
      <InfoCard title="Asset Info">
        <InfoRow label="Make / Brand" value={equipment.makeBrand} />
        <InfoRow label="Model Number" value={equipment.modelNumber} />
        <InfoRow
          label="Commissioned"
          value={formatEquipmentDate(equipment.commissionedAt)}
        />
        <InfoRow label="Created" value={formatEquipmentDate(equipment.createdAt)} />
      </InfoCard>
    </div>
  );
}

function EquipmentNotesCard({ equipment }: { equipment: EquipmentDetail }) {
  return (
    <DashboardCard>
      <CardContent className="p-4 sm:p-5">
        <h3 className="font-semibold">Notes</h3>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          {equipment.notes || "No notes added for this equipment."}
        </p>
      </CardContent>
    </DashboardCard>
  );
}

function EquipmentQuickActions({ equipment }: { equipment: EquipmentDetail }) {
  const router = useRouter();
  const updateMutation = useUpdateEquipment(equipment.id);
  const deleteMutation = useDeleteEquipment();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  async function markUnderMaintenance() {
    try {
      await updateMutation.mutateAsync({ status: maintenanceStatus });
      toast.success(`${equipment.name} marked under maintenance`);
    } catch (error) {
      showApiErrorToast(error, "Could not update equipment status");
    }
  }

  async function deleteCurrentEquipment() {
    try {
      await deleteMutation.mutateAsync(equipment.id);
      toast.success(`${equipment.name} deleted`);
      router.push("/admin/equipment");
    } catch (error) {
      showApiErrorToast(error, "Could not delete equipment");
    }
  }

  const actions = (
    <>
      <ActionLink
        href={`/admin/equipment/${equipment.id}/edit`}
        icon="settings"
        label="Edit Equipment"
      />
      <ActionLink href="/admin/logs" icon="logs" label="View Logs" />
      <ActionLink href={`/admin/equipment/manuals?equipmentId=${equipment.id}`} icon="database" label="Manuals" />
      <Button
        variant="outline"
        className="h-14 flex-col gap-1 rounded-xl px-1 text-xs xl:h-11 xl:w-full xl:flex-row xl:justify-start xl:gap-2 xl:px-4"
        disabled={updateMutation.isPending}
        onClick={() => void markUnderMaintenance()}
      >
        <AppIcon name="activity" className="size-4" />
        Maintenance
      </Button>
      <Button
        variant="outline"
        className="h-14 flex-col gap-1 rounded-xl px-1 text-xs text-destructive hover:text-destructive xl:h-11 xl:w-full xl:flex-row xl:justify-start xl:gap-2 xl:px-4"
        disabled={deleteMutation.isPending}
        onClick={() => setDeleteDialogOpen(true)}
      >
        <AppIcon name="trash" className="size-4" />
        Delete
      </Button>
    </>
  );

  return (
    <>
      <div className="order-first grid grid-cols-2 gap-2 sm:grid-cols-5 xl:hidden">{actions}</div>

      <DashboardCard className="hidden xl:sticky xl:top-6 xl:block">
        <CardContent className="space-y-3 p-5">
          <h3 className="font-semibold">Quick Actions</h3>
          {actions}
        </CardContent>
      </DashboardCard>

      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Delete equipment?"
        description={`This will permanently delete ${equipment.name}. Existing logs may keep historical references, but this equipment will no longer appear in equipment lists.`}
        confirmLabel="Delete Equipment"
        onConfirm={() => void deleteCurrentEquipment()}
      />
    </>
  );
}

function InfoCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="rounded-2xl border border-border bg-background p-3 sm:p-4">
      <h3 className="font-semibold">{title}</h3>
      <div className="mt-3 space-y-2 text-sm">{children}</div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value?: string | null }) {
  return (
    <p>
      <span className="text-muted-foreground">{label}:</span> {value || "-"}
    </p>
  );
}

function EquipmentMapLink({ latitude, longitude, mapUrl }: { latitude?: string | null; longitude?: string | null; mapUrl?: string | null }) {
  const href = mapUrl || (latitude && longitude ? `https://www.google.com/maps?q=${latitude},${longitude}` : "");

  if (!href) {
    return null;
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="mt-3 inline-flex items-center gap-2 rounded-xl border border-border bg-secondary/60 px-3 py-2 text-sm font-medium text-primary hover:bg-primary/10"
    >
      <AppIcon name="planet" className="size-4" />
      Open in Google Maps
    </a>
  );
}

function ActionLink({
  href,
  icon,
  label,
}: {
  href: string;
  icon: "settings" | "logs" | "database";
  label: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        buttonVariants({ variant: "outline" }),
        "h-14 flex-col gap-1 rounded-xl px-1 text-xs xl:h-11 xl:w-full xl:flex-row xl:justify-start xl:gap-2 xl:px-4",
      )}
    >
      <AppIcon name={icon} className="size-4" />
      {label}
    </Link>
  );
}

