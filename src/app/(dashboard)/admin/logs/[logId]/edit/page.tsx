"use client";

import { useParams } from "next/navigation";

import { EditLogClient } from "@/components/admin/logs/edit-log-client";

export default function AdminEditLogPage() {
  const params = useParams<{ logId: string }>();
  return <EditLogClient logId={params.logId} />;
}