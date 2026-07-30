"use client";

import { DashboardPageHeader } from "@/components/common/dashboard-ui";
import { LocationForm } from "@/components/admin/master-data/location-form";

export default function NewLocationPage() {
  return <div className="space-y-4 sm:space-y-6"><DashboardPageHeader title="Add Location" description="Create plant, unit, section, and sub-location master data." /><LocationForm mode="create" /></div>;
}
