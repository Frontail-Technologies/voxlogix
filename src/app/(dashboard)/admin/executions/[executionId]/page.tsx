"use client";

import { redirect } from "next/navigation";

export default function ExecutionDetailPage() {
  redirect("/admin/users?tab=execution");
}
