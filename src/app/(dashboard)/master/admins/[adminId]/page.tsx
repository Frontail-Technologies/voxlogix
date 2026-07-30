"use client";

import { useParams } from "next/navigation";

import { AdminDetailView } from "@/components/master/admins/admin-detail-view";

export default function AdminDetailPage() {
  const params = useParams<{ adminId: string }>();
  return <AdminDetailView adminId={params.adminId} />;
}