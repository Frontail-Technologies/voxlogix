"use client";

import { redirect } from "next/navigation";

export default function NewPlannerPage() {
  redirect("/admin/users?tab=planners");
}
