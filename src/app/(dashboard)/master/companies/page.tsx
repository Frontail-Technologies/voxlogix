"use client";

import { Suspense } from "react";

import { CompaniesList } from "@/components/master/companies/companies-list";
import { MasterCardGridSkeleton } from "@/components/master/master-skeletons";

export default function CompaniesPage() {
  return (
    <Suspense fallback={<MasterCardGridSkeleton />}>
      <CompaniesList />
    </Suspense>
  );
}
