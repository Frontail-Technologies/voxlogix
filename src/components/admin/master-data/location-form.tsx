"use client";

import { useMemo, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { CardContent, DashboardCard } from "@/components/common/dashboard-ui";
import { FormActionBar } from "@/components/common/form-action-bar";
import { FormField } from "@/components/common/form-field";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCreateLocation, useUpdateLocation } from "@/features/admin-master-data/api/master-data.mutations";
import type { LocationPayload } from "@/features/admin-master-data/api/master-data.types";
import { masterDataStatuses, normalizeMasterDataValue } from "@/features/admin-master-data/master-data.presentation";
import { showApiErrorToast } from "@/lib/api/error-toast";
import {
  blurActiveElement,
  clearFieldError,
  focusFirstError,
  hasFieldErrors,
  isFormDirty,
  validateRequiredFields,
  type FieldErrors,
  type FormValues,
} from "@/lib/forms/form-state";

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
  const initialValues = useMemo<FormValues>(() => ({
    plant: values?.plant ?? "",
    unit: values?.unit ?? "",
    section: values?.section ?? "",
    subLocation: values?.subLocation ?? "",
    shiftDetails: values?.shiftDetails ?? "",
    department: values?.department ?? "",
    status: normalizeMasterDataValue(values?.status) || "ACTIVE",
  }), [values?.department, values?.plant, values?.section, values?.shiftDetails, values?.status, values?.subLocation, values?.unit]);
  const [formValues, setFormValues] = useState<FormValues>(initialValues);
  const [errors, setErrors] = useState<FieldErrors>({});
  const isDirty = !isEdit || isFormDirty(initialValues, formValues);
  const createReady = Boolean(formValues.plant) && Boolean(formValues.section) && Boolean(formValues.subLocation);

  function updateField(key: string, value: string) {
    setFormValues((current) => ({ ...current, [key]: value }));
    setErrors((current) => clearFieldError(current, key));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    blurActiveElement();
    const nextErrors = validateRequiredFields(formValues, [
      { key: "plant", label: "Plant" },
      { key: "section", label: "Section" },
      { key: "subLocation", label: "Sub location" },
    ]);
    if (hasFieldErrors(nextErrors)) {
      setErrors(nextErrors);
      focusFirstError(event.currentTarget, nextErrors);
      return;
    }

    const payload: LocationPayload = {
      plant: String(formValues.plant ?? "").trim(),
      unit: nullableValue(formValues.unit),
      section: String(formValues.section ?? "").trim(),
      subLocation: String(formValues.subLocation ?? "").trim(),
      shiftDetails: nullableValue(formValues.shiftDetails),
      department: nullableValue(formValues.department),
      status: String(formValues.status ?? "ACTIVE"),
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
        <form className="space-y-8 pb-36" onSubmit={handleSubmit} noValidate>
          <div className="grid gap-6 lg:grid-cols-2">
            <TextField label="Plant" name="plant" value={formValues.plant} error={errors.plant} placeholder="Plant 1" onChange={updateField} />
            <TextField label="Unit" name="unit" value={formValues.unit} placeholder="Unit A" onChange={updateField} />
            <TextField label="Section" name="section" value={formValues.section} error={errors.section} placeholder="Earthworks" onChange={updateField} />
            <TextField label="Sub Location" name="subLocation" value={formValues.subLocation} error={errors.subLocation} placeholder="Pit A" onChange={updateField} />
            <TextField label="Shift Details" name="shiftDetails" value={formValues.shiftDetails} placeholder="A Shift / 06:00-14:00" onChange={updateField} />
            <TextField label="Department" name="department" value={formValues.department} placeholder="Maintenance" onChange={updateField} />
            <FormField label="Status">
              <Select value={String(formValues.status ?? "ACTIVE")} onValueChange={(value) => updateField("status", value ?? "ACTIVE")}>
                <SelectTrigger className="h-11 w-full rounded-xl bg-secondary/70">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {masterDataStatuses.map((status) => (
                    <SelectItem key={status.value} value={status.value}>{status.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormField>
          </div>
          <FormActionBar
            cancelHref="/admin/locations"
            submitLabel={isEdit ? "Update Location" : "Add Location"}
            submitIcon={isEdit ? "settings" : "plus"}
            isSubmitting={isSubmitting}
            submitDisabled={!isDirty || !createReady || hasFieldErrors(errors)}
          />
        </form>
      </CardContent>
    </DashboardCard>
  );
}

function TextField({
  label,
  name,
  value,
  error,
  placeholder,
  onChange,
}: {
  label: string;
  name: string;
  value: FormValues[string];
  error?: string;
  placeholder: string;
  onChange: (key: string, value: string) => void;
}) {
  return (
    <FormField label={label} fieldName={name} error={error}>
      <Input
        name={name}
        value={String(value ?? "")}
        onChange={(event) => onChange(name, event.target.value)}
        placeholder={placeholder}
        className="h-11 rounded-xl bg-secondary/70"
        aria-invalid={Boolean(error)}
      />
    </FormField>
  );
}

function nullableValue(value: FormValues[string]) {
  const stringValue = String(value ?? "").trim();
  return stringValue || null;
}
