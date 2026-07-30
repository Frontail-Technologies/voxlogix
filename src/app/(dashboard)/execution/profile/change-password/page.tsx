"use client";

import { ChangePasswordForm } from "@/components/common/change-password-form";
import { DashboardPageHeader } from "@/components/common/dashboard-ui";

export default function ExecutionChangePasswordPage() {
  return (
    <div className="space-y-4 sm:space-y-6">
      <DashboardPageHeader title="Change Password" description="Update your account password." />
      <ChangePasswordForm />
    </div>
  );
}
