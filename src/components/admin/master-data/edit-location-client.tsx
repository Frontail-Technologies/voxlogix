"use client";

import { DashboardPageHeader } from "@/components/common/dashboard-ui";
import { MasterFormSkeleton } from "@/components/master/master-skeletons";
import { useLocationDetail } from "@/features/admin-master-data/api/master-data.queries";
import { LocationForm } from "./location-form";

export function EditLocationClient({ locationId }: { locationId: string }) {
  const { data, isLoading, isError } = useLocationDetail(locationId);
  const location = data?.data;
  return <div className="space-y-4 sm:space-y-6"><DashboardPageHeader title="Edit Location" description="Update plant, unit, section, sub-location, and status." />{isLoading ? <MasterFormSkeleton /> : null}{isError ? <p className="text-sm text-muted-foreground">Could not load location.</p> : null}{location ? <LocationForm mode="edit" locationId={location.id} values={location} /> : null}</div>;
}
