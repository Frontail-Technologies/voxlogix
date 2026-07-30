"use client";

import { useParams } from "next/navigation";

import { EquipmentDetailView } from "@/components/admin/equipment/equipment-detail-view";

export default function EquipmentDetailPage() {
  const params = useParams<{ equipmentId: string }>();
  return <EquipmentDetailView equipmentId={params.equipmentId} />;
}