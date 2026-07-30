"use client";

import { DashboardPageHeader } from "@/components/common/dashboard-ui";
import { MasterFormSkeleton } from "@/components/master/master-skeletons";
import { CompanyForm } from "@/components/master/companies/company-form";
import { useCompanyDetail } from "@/features/master-companies/api/company.queries";

export function EditCompanyClient({ companyId }: { companyId: string }) {
  const { data, isLoading, isError } = useCompanyDetail(companyId);
  const company = data?.data;

  return (
    <div className="space-y-4 sm:space-y-6">
      <DashboardPageHeader title="Edit Company" description="Update company identity, owner contact, plan, and access status." />
      {isLoading ? <MasterFormSkeleton /> : null}
      {isError ? <p className="text-sm text-muted-foreground">Could not load company.</p> : null}
      {company ? <CompanyForm mode="edit" companyId={company.id} values={{ companyName: company.name, logo: company.logo, logoUrl: company.logoUrl, logoKey: company.logoKey, ownerName: company.ownerName, ownerEmail: company.ownerEmail, ownerPhone: company.ownerPhone, businessType: company.businessType, address: company.address, planType: company.plan, status: company.status, startDate: company.startDate, expiryDate: company.expiryDate, notes: company.notes }} /> : null}
    </div>
  );
}
