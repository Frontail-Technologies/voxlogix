"use client";

import { redirect } from "next/navigation";

export default function EditPlannerPage() {
  redirect("/admin/users?tab=planners");
}
