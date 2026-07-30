import { Suspense } from "react";

import { EquipmentManualsView } from "@/components/admin/equipment/equipment-manuals-view";
import { MasterCardGridSkeleton } from "@/components/master/master-skeletons";

export default function EquipmentManualsPage() {
  return (
    <Suspense fallback={<MasterCardGridSkeleton />}>
      <EquipmentManualsView />
    </Suspense>
  );
}
