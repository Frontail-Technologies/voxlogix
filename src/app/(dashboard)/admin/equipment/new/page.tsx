"use client";

import { DashboardPageHeader } from "@/components/common/dashboard-ui";
import { EquipmentForm } from "@/components/admin/equipment/equipment-form";

export default function NewEquipmentPage() {
  return (
    <div className="space-y-4 sm:space-y-6">
      <DashboardPageHeader
        title="Add Equipment"
        description="Register a new equipment asset for this company."
      />
      <EquipmentForm mode="create" />
    </div>
  );
}
