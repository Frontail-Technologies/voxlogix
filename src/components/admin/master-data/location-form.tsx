"use client";

import { useRouter } from "next/navigation";
import { type FormEvent, type ReactNode } from "react";
import { toast } from "sonner";

import { CardContent, DashboardCard } from "@/components/common/dashboard-ui";
import { FormActionBar } from "@/components/common/form-action-bar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCreateLocation, useUpdateLocation } from "@/features/admin-master-data/api/master-data.mutations";
import type { LocationPayload } from "@/features/admin-master-data/api/master-data.types";
import { masterDataStatuses, normalizeMasterDataValue } from "@/features/admin-master-data/master-data.presentation";
import { showApiErrorToast } from "@/lib/api/error-toast";
import { cn } from "@/lib/utils";

export type LocationFormValues = Partial<LocationPayload>;

export function LocationForm({
  mode,
  locationId,
  values,
}: {
  mode: "create" | "edit";
  locationId?: string;
  values?: LocationFormValues;
}) {
  const router = useRouter();
  const createMutation = useCreateLocation();
  const updateMutation = useUpdateLocation(locationId ?? "");
  const isEdit = mode === "edit";
  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const payload: LocationPayload = {
      plant: stringValue(formData, "plant"),
      unit: nullableValue(formData, "unit"),
      section: stringValue(formData, "section"),
      subLocation: stringValue(formData, "subLocation"),
      shiftDetails: nullableValue(formData, "shiftDetails"),
      department: nullableValue(formData, "department"),
      status: stringValue(formData, "status") || "ACTIVE",
    };

    try {
      if (isEdit && locationId) {
        await updateMutation.mutateAsync(payload);
        toast.success("Location updated");
      } else {
        await createMutation.mutateAsync(payload);
        toast.success("Location created");
      }
      router.push("/admin/locations");
    } catch (error) {
      showApiErrorToast(error, "Could not save location");
    }
  }

  return (
    <DashboardCard>
      <CardContent className="p-4 sm:p-6">
        <form className="space-y-8 pb-36" onSubmit={handleSubmit}>
          <div className="grid gap-6 lg:grid-cols-2">
            <Field label="Plant">
              <Input name="plant" defaultValue={values?.plant} placeholder="Plant 1" className="h-11 rounded-xl bg-secondary/70" required />
            </Field>
            <Field label="Unit">
              <Input name="unit" defaultValue={values?.unit ?? undefined} placeholder="Unit A" className="h-11 rounded-xl bg-secondary/70" />
            </Field>
            <Field label="Section">
              <Input name="section" defaultValue={values?.section} placeholder="Earthworks" className="h-11 rounded-xl bg-secondary/70" required />
            </Field>
            <Field label="Sub Location">
              <Input name="subLocation" defaultValue={values?.subLocation} placeholder="Pit A" className="h-11 rounded-xl bg-secondary/70" required />
            </Field>
            <Field label="Shift Details">
              <Input name="shiftDetails" defaultValue={values?.shiftDetails ?? undefined} placeholder="A Shift / 06:00-14:00" className="h-11 rounded-xl bg-secondary/70" />
            </Field>
            <Field label="Department">
              <Input name="department" defaultValue={values?.department ?? undefined} placeholder="Maintenance" className="h-11 rounded-xl bg-secondary/70" />
            </Field>
            <Field label="Status">
              <Select name="status" defaultValue={normalizeMasterDataValue(values?.status) || "ACTIVE"}>
                <SelectTrigger className="h-11 w-full rounded-xl bg-secondary/70"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {masterDataStatuses.map((status) => <SelectItem key={status.value} value={status.value}>{status.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </Field>
          </div>
          <FormActionBar cancelHref="/admin/locations" submitLabel={isEdit ? "Update Location" : "Add Location"} submitIcon={isEdit ? "settings" : "plus"} isSubmitting={isSubmitting} />
        </form>
      </CardContent>
    </DashboardCard>
  );
}

function Field({ label, children, className }: { label: string; children: ReactNode; className?: string }) {
  return <div className={cn("space-y-2", className)}><Label>{label}</Label>{children}</div>;
}

function stringValue(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

function nullableValue(formData: FormData, key: string) {
  const value = stringValue(formData, key);
  return value || null;
}
