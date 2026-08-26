"use client";

import { useMemo, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { CardContent, DashboardCard } from "@/components/common/dashboard-ui";
import { FormActionBar } from "@/components/common/form-action-bar";
import { FormField } from "@/components/common/form-field";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCreateIssueCategory, useUpdateIssueCategory } from "@/features/admin-master-data/api/master-data.mutations";
import type { IssueCategoryPayload } from "@/features/admin-master-data/api/master-data.types";
import { masterDataStatuses, moduleTypeOptions, normalizeMasterDataValue, severityOptions } from "@/features/admin-master-data/master-data.presentation";
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

export type IssueCategoryFormValues = Partial<IssueCategoryPayload>;

export function IssueCategoryForm({
  mode,
  issueCategoryId,
  values,
}: {
  mode: "create" | "edit";
  issueCategoryId?: string;
  values?: IssueCategoryFormValues;
}) {
  const router = useRouter();
  const createMutation = useCreateIssueCategory();
  const updateMutation = useUpdateIssueCategory(issueCategoryId ?? "");
  const isEdit = mode === "edit";
  const isSubmitting = createMutation.isPending || updateMutation.isPending;
  const initialValues = useMemo<FormValues>(() => ({
    name: values?.name ?? "",
    moduleType: normalizeMasterDataValue(values?.moduleType) || "EQUIPMENT",
    severityDefault: normalizeMasterDataValue(values?.severityDefault) || "MEDIUM",
    status: normalizeMasterDataValue(values?.status) || "ACTIVE",
  }), [values?.moduleType, values?.name, values?.severityDefault, values?.status]);
  const [formValues, setFormValues] = useState<FormValues>(initialValues);
  const [errors, setErrors] = useState<FieldErrors>({});
  const isDirty = !isEdit || isFormDirty(initialValues, formValues);
  const createReady = Boolean(formValues.name) && Boolean(formValues.moduleType) && Boolean(formValues.severityDefault) && Boolean(formValues.status);

  function updateField(key: string, value: string) {
    setFormValues((current) => ({ ...current, [key]: value }));
    setErrors((current) => clearFieldError(current, key));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    blurActiveElement();
    const nextErrors = validateRequiredFields(formValues, [{ key: "name", label: "Name" }]);
    if (hasFieldErrors(nextErrors)) {
      setErrors(nextErrors);
      focusFirstError(event.currentTarget, nextErrors);
      return;
    }

    const payload: IssueCategoryPayload = {
      name: String(formValues.name ?? "").trim(),
      moduleType: String(formValues.moduleType ?? "EQUIPMENT"),
      severityDefault: String(formValues.severityDefault ?? "MEDIUM"),
      status: String(formValues.status ?? "ACTIVE"),
    };

    try {
      if (isEdit && issueCategoryId) {
        await updateMutation.mutateAsync(payload);
        toast.success("Issue category updated");
      } else {
        await createMutation.mutateAsync(payload);
        toast.success("Issue category created");
      }
      router.push("/admin/issue-categories");
    } catch (error) {
      showApiErrorToast(error, "Could not save issue category");
    }
  }

  return (
    <DashboardCard>
      <CardContent className="p-4 sm:p-6">
        <form className="space-y-8 pb-36" onSubmit={handleSubmit} noValidate>
          <div className="grid gap-6 lg:grid-cols-2">
            <FormField label="Name" className="lg:col-span-2" fieldName="name" error={errors.name}>
              <Input
                name="name"
                value={String(formValues.name ?? "")}
                onChange={(event) => updateField("name", event.target.value)}
                placeholder="Hydraulic Leakage"
                className="h-11 rounded-xl bg-secondary/70"
                aria-invalid={Boolean(errors.name)}
              />
            </FormField>
            <FormField label="Module">
              <Select value={String(formValues.moduleType ?? "EQUIPMENT")} onValueChange={(value) => updateField("moduleType", value ?? "EQUIPMENT")}>
                <SelectTrigger className="h-11 w-full rounded-xl bg-secondary/70">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {moduleTypeOptions.map((module) => (
                    <SelectItem key={module.value} value={module.value}>{module.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormField>
            <FormField label="Default Severity">
              <Select value={String(formValues.severityDefault ?? "MEDIUM")} onValueChange={(value) => updateField("severityDefault", value ?? "MEDIUM")}>
                <SelectTrigger className="h-11 w-full rounded-xl bg-secondary/70">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {severityOptions.map((severity) => (
                    <SelectItem key={severity.value} value={severity.value}>{severity.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormField>
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
            cancelHref="/admin/issue-categories"
            submitLabel={isEdit ? "Update Category" : "Add Category"}
            submitIcon={isEdit ? "settings" : "plus"}
            isSubmitting={isSubmitting}
            submitDisabled={!isDirty || !createReady || hasFieldErrors(errors)}
          />
        </form>
      </CardContent>
    </DashboardCard>
  );
}
