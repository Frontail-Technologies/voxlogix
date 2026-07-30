"use client";

import { useParams } from "next/navigation";

import { CompanyAccessClient } from "@/components/master/companies/company-access-client";

export default function CompanyAccessPage() {
  const params = useParams<{ companyId: string }>();
  return <CompanyAccessClient companyId={params.companyId} />;
}