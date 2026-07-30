"use client";

import { Suspense } from "react";

import { LocationsList } from "@/components/admin/master-data/locations-list";
import { MasterCardGridSkeleton } from "@/components/master/master-skeletons";

export default function LocationsPage() {
  return (
    <Suspense fallback={<MasterCardGridSkeleton />}>
      <LocationsList />
    </Suspense>
  );
}
