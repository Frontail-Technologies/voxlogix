"use client";

import { redirect } from "next/navigation";

export default function NewExecutionPage() {
  redirect("/admin/users?tab=execution");
}
