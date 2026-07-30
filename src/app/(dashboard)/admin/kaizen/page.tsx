import { Suspense } from "react";

import { ImportedMasterDataList } from "@/components/admin/master-data/imported-master-data-list";
import { MasterCardGridSkeleton } from "@/components/master/master-skeletons";

export default function KaizenPage() {
  return (
    <Suspense fallback={<MasterCardGridSkeleton />}>
      <ImportedMasterDataList source="kaizen" />
    </Suspense>
  );
}
