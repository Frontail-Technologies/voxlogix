import { DashboardPageHeader } from "@/components/common/dashboard-ui";
import { CompanyForm } from "@/components/master/companies/company-form";
import { selectedCompany } from "@/data/mock-master";

export default function EditCompanyPage() {
  return (
    <div className="space-y-6">
      <DashboardPageHeader
        title="Edit Company"
        description="Update company identity, owner contact, plan, and access status."
      />
      <CompanyForm
        mode="edit"
        values={{
          companyName: selectedCompany.company,
          logo: selectedCompany.logo,
          ownerName: selectedCompany.owner,
          ownerEmail: selectedCompany.email,
          ownerPhone: selectedCompany.phone,
          businessType: selectedCompany.businessType,
          address: selectedCompany.address,
          planType: selectedCompany.plan,
          status: selectedCompany.status,
          startDate: selectedCompany.startDate,
          expiryDate: selectedCompany.expiryDate,
          notes: selectedCompany.notes,
        }}
      />
    </div>
  );
}
