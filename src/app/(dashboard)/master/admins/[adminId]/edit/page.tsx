"use client";

import { useParams } from "next/navigation";

import { EditAdminClient } from "@/components/master/admins/edit-admin-client";

export default function EditAdminPage() {
  const params = useParams<{ adminId: string }>();
  return <EditAdminClient adminId={params.adminId} />;
}
