"use client";

import { redirect } from "next/navigation";

export default function ExecutionsPage() {
  redirect("/admin/users?tab=execution");
}
