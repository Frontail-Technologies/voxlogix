"use client";

import { Suspense } from "react";

import { CompanyLogsView } from "@/components/master/logs/company-logs-view";
import { MasterTableSkeleton } from "@/components/master/master-skeletons";

export default function MasterCompanyLogsPage() {
  return (
    <Suspense fallback={<MasterTableSkeleton columns={7} />}>
      <CompanyLogsView />
    </Suspense>
  );
}
