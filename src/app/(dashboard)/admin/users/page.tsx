"use client";

import { Suspense } from "react";

import { UsersView } from "@/components/admin/users/users-view";
import { MasterCardGridSkeleton } from "@/components/master/master-skeletons";

export default function AdminUsersPage() {
  return (
    <Suspense fallback={<MasterCardGridSkeleton />}>
      <UsersView />
    </Suspense>
  );
}
