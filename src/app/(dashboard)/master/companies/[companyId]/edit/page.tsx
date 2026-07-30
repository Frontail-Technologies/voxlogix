"use client";

import { useParams } from "next/navigation";

import { EditCompanyClient } from "@/components/master/companies/edit-company-client";

export default function EditCompanyPage() {
  const params = useParams<{ companyId: string }>();
  return <EditCompanyClient companyId={params.companyId} />;
}