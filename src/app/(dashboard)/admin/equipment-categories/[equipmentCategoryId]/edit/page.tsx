"use client";

import { useParams } from "next/navigation";

import { EditEquipmentCategoryClient } from "@/components/admin/master-data/edit-equipment-category-client";

export default function EditEquipmentCategoryPage() {
  const params = useParams<{ equipmentCategoryId: string }>();
  return <EditEquipmentCategoryClient equipmentCategoryId={params.equipmentCategoryId} />;
}
