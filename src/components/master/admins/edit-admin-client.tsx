"use client";

import { DashboardPageHeader } from "@/components/common/dashboard-ui";
import { MasterFormSkeleton } from "@/components/master/master-skeletons";
import { AdminForm } from "@/components/master/admins/admin-form";
import { useAdminDetail } from "@/features/master-admins/api/admin.queries";

export function EditAdminClient({ adminId }: { adminId: string }) {
  const { data, isLoading, isError } = useAdminDetail(adminId);
  const admin = data?.data;

  return (
    <div className="space-y-4 sm:space-y-6">
      <DashboardPageHeader title="Edit Admin" description="Update admin account details, company assignment, and access status." />
      {isLoading ? <MasterFormSkeleton /> : null}
      {isError ? <p className="text-sm text-muted-foreground">Could not load admin.</p> : null}
      {admin ? <AdminForm mode="edit" adminId={admin.id} values={{ fullName: admin.fullName, initials: admin.initials, avatarUrl: admin.avatarUrl, avatarKey: admin.avatarKey, username: admin.username, email: admin.email, phone: admin.phone, companyId: admin.company.id, role: admin.role, status: admin.status, requirePasswordReset: admin.requirePasswordReset }} /> : null}
    </div>
  );
}
