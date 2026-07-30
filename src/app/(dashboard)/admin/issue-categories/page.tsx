"use client";

import { Suspense } from "react";

import { IssueCategoriesList } from "@/components/admin/master-data/issue-categories-list";
import { MasterCardGridSkeleton } from "@/components/master/master-skeletons";

export default function IssueCategoriesPage() {
  return (
    <Suspense fallback={<MasterCardGridSkeleton />}>
      <IssueCategoriesList />
    </Suspense>
  );
}
