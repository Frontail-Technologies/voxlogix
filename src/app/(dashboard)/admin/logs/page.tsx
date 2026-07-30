"use client";

import { Suspense } from "react";

import { LogsView } from "@/components/admin/logs/logs-view";
import { MasterCardGridSkeleton } from "@/components/master/master-skeletons";

export default function AdminLogsPage() {
  return (
    <Suspense fallback={<MasterCardGridSkeleton />}>
      <LogsView />
    </Suspense>
  );
}
