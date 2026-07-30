"use client";

import { useParams } from "next/navigation";

import { CompanyDetailView } from "@/components/master/companies/company-detail-view";

export default function CompanyDetailPage() {
  const params = useParams<{ companyId: string }>();
  return <CompanyDetailView companyId={params.companyId} />;
}