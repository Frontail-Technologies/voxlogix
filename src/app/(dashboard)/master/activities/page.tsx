"use client";

import { Suspense } from "react";

import { ActivitiesList } from "@/components/master/activities/activities-list";
import { MasterCardGridSkeleton } from "@/components/master/master-skeletons";

export default function ActivitiesPage() {
  return (
    <Suspense fallback={<MasterCardGridSkeleton />}>
      <ActivitiesList />
    </Suspense>
  );
}
