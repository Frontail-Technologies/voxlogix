"use client";

import { DashboardPageHeader } from "@/components/common/dashboard-ui";
import { EquipmentForm } from "@/components/admin/equipment/equipment-form";
import { MasterFormSkeleton } from "@/components/master/master-skeletons";
import { useEquipmentDetail } from "@/features/admin-equipment/api/equipment.queries";

export function EditEquipmentClient({ equipmentId }: { equipmentId: string }) {
  const { data, isLoading, isError } = useEquipmentDetail(equipmentId);
  const equipment = data?.data;

  return (
    <div className="space-y-4 sm:space-y-6">
      <DashboardPageHeader
        title="Edit Equipment"
        description="Update equipment metadata, location, criticality, and status."
      />
      {isLoading ? <MasterFormSkeleton /> : null}
      {isError ? (
        <p className="text-sm text-muted-foreground">Could not load equipment.</p>
      ) : null}
      {equipment ? (
        <EquipmentForm
          mode="edit"
          equipmentId={equipment.id}
          values={{
            locationId: equipment.locationId,
            equipmentCode: equipment.equipmentCode,
            imageUrl: equipment.imageUrl,
            name: equipment.name,
            section: equipment.section,
            subLocation: equipment.subLocation,
            category: equipment.category,
            makeBrand: equipment.makeBrand,
            modelNumber: equipment.modelNumber,
            commissionedAt: equipment.commissionedAt,
            criticality: equipment.criticality,
            notes: equipment.notes,
            status: equipment.status,
            latitude: equipment.latitude,
            longitude: equipment.longitude,
            mapUrl: equipment.mapUrl,
          }}
        />
      ) : null}
    </div>
  );
}

