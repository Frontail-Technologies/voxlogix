import { DashboardPageHeader } from "@/components/common/dashboard-ui";
import { AdminForm } from "@/components/master/admins/admin-form";

export default function NewAdminPage() {
  return (
    <div className="space-y-4 sm:space-y-6">
      <DashboardPageHeader
        title="Add Admin"
        description="Create a company admin account and assign access."
      />
      <AdminForm mode="create" />
    </div>
  );
}
