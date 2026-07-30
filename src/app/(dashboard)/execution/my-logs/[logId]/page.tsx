"use client";

import { useParams } from "next/navigation";

import { MyLogDetailView } from "@/components/execution/logs/my-log-detail-view";

export default function ExecutionMyLogDetailPage() {
  const params = useParams<{ logId: string }>();
  return <MyLogDetailView logId={params.logId} />;
}
