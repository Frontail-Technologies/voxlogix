"use client";

import { CreateLogFlow } from "@/components/logs/create-flow/create-log-flow";

export default function ExecutionCreateLogPage() {
  return (
    <CreateLogFlow
      config={{
        logsListHref: "/execution/my-logs",
        logDetailHref: (logId) => `/execution/my-logs/${logId}`,
      }}
    />
  );
}
