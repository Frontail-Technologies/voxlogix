"use client";

import { useParams } from "next/navigation";

import { EditLocationClient } from "@/components/admin/master-data/edit-location-client";

export default function EditLocationPage() {
  const params = useParams<{ locationId: string }>();
  return <EditLocationClient locationId={params.locationId} />;
}