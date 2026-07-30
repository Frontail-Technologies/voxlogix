"use client";

import { useRouter } from "next/navigation";
import { type FormEvent, type ReactNode } from "react";
import { toast } from "sonner";

import { CardContent, DashboardCard } from "@/components/common/dashboard-ui";
import { FormActionBar } from "@/components/common/form-action-bar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCreateIssueCategory, useUpdateIssueCategory } from "@/features/admin-master-data/api/master-data.mutations";
import type { IssueCategoryPayload } from "@/features/admin-master-data/api/master-data.types";
import { masterDataStatuses, moduleTypeOptions, normalizeMasterDataValue, severityOptions } from "@/features/admin-master-data/master-data.presentation";
import { showApiErrorToast } from "@/lib/api/error-toast";
import { cn } from "@/lib/utils";

export type IssueCategoryFormValues = Partial<IssueCategoryPayload>;

export function IssueCategoryForm({ mode, issueCategoryId, values }: { mode: "create" | "edit"; issueCategoryId?: string; values?: IssueCategoryFormValues }) {
  const router = useRouter();
  const createMutation = useCreateIssueCategory();
  const updateMutation = useUpdateIssueCategory(issueCategoryId ?? "");
  const isEdit = mode === "edit";
  const isSubmitting = createMutation.isPending || updateMutation.isPending;
  async function handleSubmit(event: FormEvent<HTMLFormElement>) { event.preventDefault(); const formData = new FormData(event.currentTarget); const payload: IssueCategoryPayload = { name: stringValue(formData, "name"), moduleType: stringValue(formData, "moduleType") || "EQUIPMENT", severityDefault: stringValue(formData, "severityDefault") || "MEDIUM", status: stringValue(formData, "status") || "ACTIVE" }; try { if (isEdit && issueCategoryId) { await updateMutation.mutateAsync(payload); toast.success("Issue category updated"); router.push("/admin/issue-categories"); } else { await createMutation.mutateAsync(payload); toast.success("Issue category created"); router.push("/admin/issue-categories"); } } catch (error) { showApiErrorToast(error, "Could not save issue category"); } }
  return <DashboardCard><CardContent className="p-4 sm:p-6"><form className="space-y-8 pb-36" onSubmit={handleSubmit}><div className="grid gap-6 lg:grid-cols-2"><Field label="Name" className="lg:col-span-2"><Input name="name" defaultValue={values?.name} placeholder="Hydraulic Leakage" className="h-11 rounded-xl bg-secondary/70" required /></Field><Field label="Module"><Select name="moduleType" defaultValue={normalizeMasterDataValue(values?.moduleType) || "EQUIPMENT"}><SelectTrigger className="h-11 w-full rounded-xl bg-secondary/70"><SelectValue /></SelectTrigger><SelectContent>{moduleTypeOptions.map((module) => <SelectItem key={module.value} value={module.value}>{module.label}</SelectItem>)}</SelectContent></Select></Field><Field label="Default Severity"><Select name="severityDefault" defaultValue={normalizeMasterDataValue(values?.severityDefault) || "MEDIUM"}><SelectTrigger className="h-11 w-full rounded-xl bg-secondary/70"><SelectValue /></SelectTrigger><SelectContent>{severityOptions.map((severity) => <SelectItem key={severity.value} value={severity.value}>{severity.label}</SelectItem>)}</SelectContent></Select></Field><Field label="Status"><Select name="status" defaultValue={normalizeMasterDataValue(values?.status) || "ACTIVE"}><SelectTrigger className="h-11 w-full rounded-xl bg-secondary/70"><SelectValue /></SelectTrigger><SelectContent>{masterDataStatuses.map((status) => <SelectItem key={status.value} value={status.value}>{status.label}</SelectItem>)}</SelectContent></Select></Field></div><FormActionBar cancelHref="/admin/issue-categories" submitLabel={isEdit ? "Update Category" : "Add Category"} submitIcon={isEdit ? "settings" : "plus"} isSubmitting={isSubmitting} /></form></CardContent></DashboardCard>;
}

function Field({ label, children, className }: { label: string; children: ReactNode; className?: string }) { return <div className={cn("space-y-2", className)}><Label>{label}</Label>{children}</div>; }
function stringValue(formData: FormData, key: string) { return String(formData.get(key) ?? "").trim(); }
