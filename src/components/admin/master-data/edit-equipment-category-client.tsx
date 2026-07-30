"use client";

import { DashboardPageHeader } from "@/components/common/dashboard-ui";
import { MasterFormSkeleton } from "@/components/master/master-skeletons";
import { useEquipmentCategoryDetail } from "@/features/admin-master-data/api/master-data.queries";
import { EquipmentCategoryForm } from "./equipment-category-form";

export function EditEquipmentCategoryClient({ equipmentCategoryId }: { equipmentCategoryId: string }) {
  const { data, isLoading, isError } = useEquipmentCategoryDetail(equipmentCategoryId);
  const category = data?.data;
  return <div className="space-y-4 sm:space-y-6"><DashboardPageHeader title="Edit Equipment Category" description="Update category name and status." />{isLoading ? <MasterFormSkeleton /> : null}{isError ? <p className="text-sm text-muted-foreground">Could not load equipment category.</p> : null}{category ? <EquipmentCategoryForm mode="edit" equipmentCategoryId={category.id} values={category} /> : null}</div>;
}
