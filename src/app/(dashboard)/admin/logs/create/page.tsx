"use client";

import { CreateLogFlow } from "@/components/logs/create-flow/create-log-flow";

export default function AdminLogsCreatePage() {
  return (
    <CreateLogFlow
      config={{
        logsListHref: "/admin/logs",
        logDetailHref: (logId) => `/admin/logs/${logId}`,
      }}
    />
  );
}
