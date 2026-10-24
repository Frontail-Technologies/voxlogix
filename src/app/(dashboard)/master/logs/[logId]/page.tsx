"use client";

import { useParams } from "next/navigation";

import { LogDetailView } from "@/components/admin/logs/log-detail-view";

export default function MasterCompanyLogDetailPage() {
  const params = useParams<{ logId: string }>();
  return <LogDetailView logId={params.logId} readOnly showCompany />;
}
