"use client";

import { useParams } from "next/navigation";

import { EditIssueCategoryClient } from "@/components/admin/master-data/edit-issue-category-client";

export default function EditIssueCategoryPage() {
  const params = useParams<{ issueCategoryId: string }>();
  return <EditIssueCategoryClient issueCategoryId={params.issueCategoryId} />;
}