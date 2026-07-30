"use client";

import { EquipmentCategoryForm } from "@/components/admin/master-data/equipment-category-form";
import { DashboardPageHeader } from "@/components/common/dashboard-ui";

export default function NewEquipmentCategoryPage() {
  return <div className="space-y-4 sm:space-y-6"><DashboardPageHeader title="Add Equipment Category" description="Create a category label available on the equipment form." /><EquipmentCategoryForm mode="create" /></div>;
}
