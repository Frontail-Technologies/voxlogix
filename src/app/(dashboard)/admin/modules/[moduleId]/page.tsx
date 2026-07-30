"use client";

import { useParams } from "next/navigation";

import { AdminModuleSchemaView } from "@/components/admin/modules/admin-modules-view";

export default function AdminModuleDetailPage() {
  const params = useParams<{ moduleId: string }>();
  return <AdminModuleSchemaView moduleId={params.moduleId} />;
}