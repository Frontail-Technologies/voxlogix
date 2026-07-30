"use client";

import { useRouter } from "next/navigation";
import { type FormEvent, type ReactNode } from "react";
import { toast } from "sonner";

import { CardContent, DashboardCard } from "@/components/common/dashboard-ui";
import { FormActionBar } from "@/components/common/form-action-bar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCreateEquipmentCategory, useUpdateEquipmentCategory } from "@/features/admin-master-data/api/master-data.mutations";
import type { EquipmentCategoryPayload } from "@/features/admin-master-data/api/master-data.types";
import { masterDataStatuses, normalizeMasterDataValue } from "@/features/admin-master-data/master-data.presentation";
import { showApiErrorToast } from "@/lib/api/error-toast";
import { cn } from "@/lib/utils";

export type EquipmentCategoryFormValues = Partial<EquipmentCategoryPayload>;

export function EquipmentCategoryForm({ mode, equipmentCategoryId, values }: { mode: "create" | "edit"; equipmentCategoryId?: string; values?: EquipmentCategoryFormValues }) {
  const router = useRouter();
  const createMutation = useCreateEquipmentCategory();
  const updateMutation = useUpdateEquipmentCategory(equipmentCategoryId ?? "");
  const isEdit = mode === "edit";
  const isSubmitting = createMutation.isPending || updateMutation.isPending;
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const payload: EquipmentCategoryPayload = { name: stringValue(formData, "name"), status: stringValue(formData, "status") || "ACTIVE" };
    try {
      if (isEdit && equipmentCategoryId) {
        await updateMutation.mutateAsync(payload);
        toast.success("Equipment category updated");
        router.push("/admin/equipment-categories");
      } else {
        await createMutation.mutateAsync(payload);
        toast.success("Equipment category created");
        router.push("/admin/equipment-categories");
      }
    } catch (error) {
      showApiErrorToast(error, "Could not save equipment category");
    }
  }
  return <DashboardCard><CardContent className="p-4 sm:p-6"><form className="space-y-8 pb-36" onSubmit={handleSubmit}><div className="grid gap-6 lg:grid-cols-2"><Field label="Name" className="lg:col-span-2"><Input name="name" defaultValue={values?.name} placeholder="Rotating Equipment" className="h-11 rounded-xl bg-secondary/70" required /></Field><Field label="Status"><Select name="status" defaultValue={normalizeMasterDataValue(values?.status) || "ACTIVE"}><SelectTrigger className="h-11 w-full rounded-xl bg-secondary/70"><SelectValue /></SelectTrigger><SelectContent>{masterDataStatuses.map((status) => <SelectItem key={status.value} value={status.value}>{status.label}</SelectItem>)}</SelectContent></Select></Field></div><FormActionBar cancelHref="/admin/equipment-categories" submitLabel={isEdit ? "Update Category" : "Add Category"} submitIcon={isEdit ? "settings" : "plus"} isSubmitting={isSubmitting} /></form></CardContent></DashboardCard>;
}

function Field({ label, children, className }: { label: string; children: ReactNode; className?: string }) { return <div className={cn("space-y-2", className)}><Label>{label}</Label>{children}</div>; }
function stringValue(formData: FormData, key: string) { return String(formData.get(key) ?? "").trim(); }
