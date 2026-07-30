"use client";

import { redirect } from "next/navigation";

export default function PlannersPage() {
  redirect("/admin/users?tab=planners");
}
