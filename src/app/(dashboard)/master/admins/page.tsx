"use client";

import { Suspense } from "react";

import { AdminsList } from "@/components/master/admins/admins-list";
import { MasterCardGridSkeleton } from "@/components/master/master-skeletons";

export default function AdminsPage() {
  return (
    <Suspense fallback={<MasterCardGridSkeleton />}>
      <AdminsList />
    </Suspense>
  );
}
