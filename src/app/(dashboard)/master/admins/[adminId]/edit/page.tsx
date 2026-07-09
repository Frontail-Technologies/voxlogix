import { DashboardPageHeader } from "@/components/common/dashboard-ui";
import { AdminForm } from "@/components/master/admins/admin-form";
import { selectedAdmin } from "@/data/mock-master";

export default function EditAdminPage() {
  return (
    <div className="space-y-4 sm:space-y-6">
      <DashboardPageHeader
        title="Edit Admin"
        description="Update admin account details, company assignment, and access status."
      />
      <AdminForm
        mode="edit"
        values={{
          fullName: selectedAdmin.admin,
          initials: selectedAdmin.initials,
          username: selectedAdmin.email.split("@")[0],
          email: selectedAdmin.email,
          phone: selectedAdmin.phone,
          company: selectedAdmin.company,
          status: selectedAdmin.status,
        }}
      />
    </div>
  );
}
