"use client";

import { useParams } from "next/navigation";

import { EditEquipmentClient } from "@/components/admin/equipment/edit-equipment-client";

export default function EditEquipmentPage() {
  const params = useParams<{ equipmentId: string }>();
  return <EditEquipmentClient equipmentId={params.equipmentId} />;
}