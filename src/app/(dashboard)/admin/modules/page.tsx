"use client";

import { Suspense } from "react";

import { AdminModulesView } from "@/components/admin/modules/admin-modules-view";
import { MasterCardGridSkeleton } from "@/components/master/master-skeletons";

export default function AdminModulesPage() {
  return (
    <Suspense fallback={<MasterCardGridSkeleton />}>
      <AdminModulesView />
    </Suspense>
  );
}
