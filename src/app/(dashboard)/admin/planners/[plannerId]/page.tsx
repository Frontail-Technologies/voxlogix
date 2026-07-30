"use client";

import { redirect } from "next/navigation";

export default function PlannerDetailPage() {
  redirect("/admin/users?tab=planners");
}
