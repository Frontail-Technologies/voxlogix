"use client";

import { Suspense } from "react";

import { EquipmentList } from "@/components/admin/equipment/equipment-list";
import { MasterCardGridSkeleton } from "@/components/master/master-skeletons";

export default function EquipmentPage() {
  return (
    <Suspense fallback={<MasterCardGridSkeleton />}>
      <EquipmentList />
    </Suspense>
  );
}
