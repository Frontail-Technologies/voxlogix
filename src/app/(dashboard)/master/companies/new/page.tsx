import { DashboardPageHeader } from "@/components/common/dashboard-ui";
import { CompanyForm } from "@/components/master/companies/company-form";

export default function NewCompanyPage() {
  return (
    <div className="space-y-6">
      <DashboardPageHeader
        title="Add Company"
        description="Create a new company profile for the VoxLogiX platform."
      />
      <CompanyForm mode="create" />
    </div>
  );
}
