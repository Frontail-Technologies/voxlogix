"use client";

import { redirect } from "next/navigation";

export default function EditExecutionPage() {
  redirect("/admin/users?tab=execution");
}
