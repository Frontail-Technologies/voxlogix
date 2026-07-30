"use client";

import { Suspense } from "react";

import { MyLogsView } from "@/components/execution/logs/my-logs-view";
import { MasterCardGridSkeleton } from "@/components/master/master-skeletons";

export default function ExecutionMyLogsGridPage() {
  return (
    <Suspense fallback={<MasterCardGridSkeleton />}>
      <MyLogsView viewMode="grid" />
    </Suspense>
  );
}
