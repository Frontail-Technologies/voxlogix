"use client";

import { DashboardPageHeader } from "@/components/common/dashboard-ui";
import { LogForm } from "@/components/admin/logs/log-form";

export default function AdminCreateLogPage() {
  return (
    <div className="space-y-4 sm:space-y-6">
      <DashboardPageHeader
        title="Create Log"
        description="Log an equipment issue by voice or by filling in the fields below."
      />
      <LogForm mode="create" />
    </div>
  );
}
