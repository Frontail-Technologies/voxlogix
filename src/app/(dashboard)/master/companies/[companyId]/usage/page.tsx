"use client";

import { useParams } from "next/navigation";

import { UsageCompanyDetail } from "@/components/master/usage/usage-company-detail";

export default function CompanyUsagePage() {
  const params = useParams<{ companyId: string }>();
  return <UsageCompanyDetail companyId={params.companyId} />;
}