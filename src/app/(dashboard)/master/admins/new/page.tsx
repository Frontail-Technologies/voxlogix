import { DashboardPageHeader } from "@/components/common/dashboard-ui";
import { AdminForm } from "@/components/master/admins/admin-form";

export default function NewAdminPage() {
  return (
    <div className="space-y-6">
      <DashboardPageHeader
        title="Add Admin / Owner"
        description="Create a company owner account and assign access."
      />
      <AdminForm mode="create" />
    </div>
  );
}
