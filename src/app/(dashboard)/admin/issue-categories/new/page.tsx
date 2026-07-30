"use client";

import { IssueCategoryForm } from "@/components/admin/master-data/issue-category-form";
import { DashboardPageHeader } from "@/components/common/dashboard-ui";

export default function NewIssueCategoryPage() {
  return <div className="space-y-4 sm:space-y-6"><DashboardPageHeader title="Add Issue Category" description="Create category master data for modules and default severity." /><IssueCategoryForm mode="create" /></div>;
}
