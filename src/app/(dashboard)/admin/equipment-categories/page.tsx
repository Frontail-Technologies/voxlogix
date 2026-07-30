"use client";

import { Suspense } from "react";

import { EquipmentCategoriesList } from "@/components/admin/master-data/equipment-categories-list";
import { MasterCardGridSkeleton } from "@/components/master/master-skeletons";

export default function EquipmentCategoriesPage() {
  return (
    <Suspense fallback={<MasterCardGridSkeleton />}>
      <EquipmentCategoriesList />
    </Suspense>
  );
}
