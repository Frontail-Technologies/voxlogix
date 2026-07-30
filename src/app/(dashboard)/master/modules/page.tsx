"use client";

import { Suspense } from "react";

import { ModulesList } from "@/components/master/modules/modules-list";
import { MasterCardGridSkeleton } from "@/components/master/master-skeletons";

export default function MasterModulesPage() {
  return (
    <Suspense fallback={<MasterCardGridSkeleton />}>
      <ModulesList />
    </Suspense>
  );
}
