"use client";

import { useParams } from "next/navigation";

import { EditDraftLogView } from "@/components/execution/logs/edit-draft-log-view";

export default function ExecutionEditDraftLogPage() {
  const params = useParams<{ logId: string }>();
  return <EditDraftLogView logId={params.logId} />;
}
