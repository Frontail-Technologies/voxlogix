"use client";

import { useRouter } from "next/navigation";
import { type FormEvent, type ReactNode, useMemo } from "react";
import { toast } from "sonner";

import { CardContent, DashboardCard } from "@/components/common/dashboard-ui";
import { FormActionBar } from "@/components/common/form-action-bar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useCreateLog, useUpdateLog } from "@/features/logs/api/log.mutations";
import { useMasterDataOptions } from "@/features/master-data-options/api/master-data-option.queries";
import type { MasterDataOption } from "@/features/master-data-options/api/master-data-option.types";
import type { AdminLogPayload } from "@/features/logs/api/log.types";
import { logLabel, logModules, optionValueOrFallback } from "@/features/logs/log.presentation";
import type { ModuleField } from "@/features/master-modules/api/module.types";
import { showApiErrorToast } from "@/lib/api/error-toast";
import { cn } from "@/lib/utils";

export type LogFormValues = {
  moduleId?: string | null;
  equipmentId?: string | null;
  equipmentName?: string | null;
  equipmentCode?: string | null;
  moduleType?: string;
  title?: string;
  description?: string | null;
  transcript?: string | null;
  issueCategory?: string | null;
  downtimeMinutes?: number;
  voiceDurationSeconds?: number;
  voiceRecordingUrl?: string | null;
  capturedAddress?: string | null;
  capturedLatitude?: string | null;
  capturedLongitude?: string | null;
  severity?: string;
  status?: string;
  extractedFields?: Record<string, unknown>;
};

type LogFormProps = {
  mode: "create" | "edit";
  logId?: string;
  values?: LogFormValues;
  moduleFields?: ModuleField[];
  schemaLoading?: boolean;
};

export function LogForm({ mode, logId, values, moduleFields = [], schemaLoading = false }: LogFormProps) {
  const router = useRouter();
  const isEdit = mode === "edit";
  const createMutation = useCreateLog();
  const updateMutation = useUpdateLog(logId ?? "");
  const isSubmitting = createMutation.isPending || updateMutation.isPending;
  const sortedModuleFields = useMemo(
    () => [...moduleFields].sort((first, second) => first.sortOrder - second.sortOrder),
    [moduleFields]
  );
  const moduleType = optionValueOrFallback(values?.moduleType, logModules, "EQUIPMENT");
  const equipmentLabel = [values?.equipmentName, values?.equipmentCode ? `(${values.equipmentCode})` : ""]
    .filter(Boolean)
    .join(" ") || "No equipment";

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const extractedFields = sortedModuleFields.length
      ? extractedFieldsValue(formData, sortedModuleFields)
      : values?.extractedFields;
    const payload: AdminLogPayload = {
      moduleId: values?.moduleId ?? null,
      moduleType,
      equipmentId: values?.equipmentId ?? null,
      title: values?.title || titleFromSchemaFields(extractedFields) || "Log update",
      description: values?.description ?? null,
      transcript: values?.transcript ?? null,
      issueCategory: values?.issueCategory ?? null,
      downtimeMinutes: values?.downtimeMinutes ?? 0,
      voiceDurationSeconds: values?.voiceDurationSeconds ?? 0,
      voiceRecordingUrl: values?.voiceRecordingUrl ?? null,
      severity: values?.severity || "MEDIUM",
      status: values?.status || "SUBMITTED",
      extractedFields,
    };

    try {
      if (isEdit && logId) {
        await updateMutation.mutateAsync(payload);
        toast.success("Log updated");
        router.push(`/admin/logs/${logId}`);
      } else {
        const response = await createMutation.mutateAsync(payload);
        toast.success("Log created");
        router.push(response.data?.id ? `/admin/logs/${response.data.id}` : "/admin/logs");
      }
    } catch (error) {
      showApiErrorToast(error, "Could not save log");
    }
  }

  return (
    <DashboardCard>
      <CardContent className="p-4 sm:p-6">
        <form className="space-y-6 pb-36" onSubmit={handleSubmit}>
          <section className="grid gap-4 lg:grid-cols-2">
            <ReadonlyField label="Module" value={logLabel(moduleType)} />
            <ReadonlyField label="Equipment" value={equipmentLabel} />
          </section>

          <section className="space-y-4 rounded-2xl border border-border bg-background/70 p-4 sm:p-5">
            <div>
              <h3 className="text-base font-semibold text-foreground">Schema Fields</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Only fields configured in this module template are editable here.
              </p>
            </div>
            {schemaLoading ? (
              <p className="text-sm text-muted-foreground">Loading module fields...</p>
            ) : sortedModuleFields.length ? (
              <div className="grid gap-5 lg:grid-cols-2">
                {sortedModuleFields.map((field) => (
                  <SchemaField key={field.id} field={field} value={values?.extractedFields?.[field.key]} />
                ))}
              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-border bg-secondary/40 p-4 text-sm text-muted-foreground">
                No schema fields are configured for this module yet.
              </div>
            )}
          </section>

          <section className="space-y-4 rounded-2xl border border-border bg-background/70 p-4 sm:p-5">
            <div>
              <h3 className="text-base font-semibold text-foreground">Capture Details</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Voice, transcript, recording, and captured location are system metadata.
              </p>
            </div>
            <div className="grid gap-4 lg:grid-cols-2">
              <ReadonlyField label="Location" value={locationLabel(values)} />
              <ReadonlyField label="Voice Recording" value={values?.voiceRecordingUrl ? "Available" : "No recording"} />
              <ReadonlyField label="Coordinates" value={coordinatesLabel(values)} />
              <ReadonlyBlock label="Transcript" value={values?.transcript || "No transcript saved."} />
            </div>
          </section>

          <FormActionBar
            cancelHref={logId ? `/admin/logs/${logId}` : "/admin/logs"}
            submitLabel={isEdit ? "Update Log" : "Create Log"}
            submitIcon={isEdit ? "settings" : "plus"}
            isSubmitting={isSubmitting}
          />
        </form>
      </CardContent>
    </DashboardCard>
  );
}

function Field({ label, children, className }: { label: string; children: ReactNode; className?: string }) {
  return (
    <div className={cn("space-y-2", className)}>
      <Label>{label}</Label>
      {children}
    </div>
  );
}

function ReadonlyField({ label, value }: { label: string; value: string }) {
  return (
    <Field label={label}>
      <div className="flex min-h-11 items-center rounded-xl border border-input bg-secondary/50 px-3 py-2 text-sm text-foreground">
        {value || "-"}
      </div>
    </Field>
  );
}

function ReadonlyBlock({ label, value }: { label: string; value: string }) {
  return (
    <Field label={label} className="lg:col-span-2">
      <div className="min-h-24 rounded-xl border border-input bg-secondary/50 px-3 py-3 text-sm leading-6 text-muted-foreground">
        {value}
      </div>
    </Field>
  );
}

function SchemaField({ field, value }: { field: ModuleField; value: unknown }) {
  const name = `extractedFields.${field.key}`;
  const fieldType = field.type.toLowerCase();
  const label = `${field.label}${field.required ? " *" : ""}`;
  const shouldLoadMasterOptions = field.sourceType === "master" && Boolean(field.sourceKey);
  const optionsQuery = useMasterDataOptions(
    { sourceKey: field.sourceKey, fieldKey: field.key },
    shouldLoadMasterOptions,
  );
  const options = useMemo(
    () => mergeOptions(field.options, optionsQuery.data?.data ?? []),
    [field.options, optionsQuery.data?.data],
  );

  if ((fieldType === "select" || shouldLoadMasterOptions) && options.length) {
    return (
      <Field label={label}>
        <Select name={name} defaultValue={fieldStringValue(value) || undefined}>
          <SelectTrigger className="h-11 w-full rounded-xl bg-secondary/70">
            <SelectValue placeholder={`Select ${field.label.toLowerCase()}`} />
          </SelectTrigger>
          <SelectContent>
            {options.map((option) => (
              <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Field>
    );
  }

  if (shouldLoadMasterOptions && optionsQuery.isLoading) {
    return (
      <Field label={label}>
        <div className="flex h-11 items-center rounded-xl border border-input bg-secondary/70 px-3 text-sm text-muted-foreground">
          Loading options...
        </div>
      </Field>
    );
  }

  if (["boolean", "bool", "checkbox"].includes(fieldType)) {
    return (
      <Field label={label}>
        <Select name={name} defaultValue={booleanStringValue(value)}>
          <SelectTrigger className="h-11 w-full rounded-xl bg-secondary/70">
            <SelectValue placeholder="Select value" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="true">Yes</SelectItem>
            <SelectItem value="false">No</SelectItem>
          </SelectContent>
        </Select>
      </Field>
    );
  }

  if (["textarea", "long_text", "multiline"].includes(fieldType)) {
    return (
      <Field label={label} className="lg:col-span-2">
        <Textarea name={name} defaultValue={fieldStringValue(value)} placeholder={field.label} className="min-h-24 rounded-xl bg-secondary/70" required={field.required} />
      </Field>
    );
  }

  return (
    <Field label={label}>
      <Input name={name} defaultValue={fieldStringValue(value)} type={fieldType === "number" ? "number" : fieldType === "date" ? "date" : "text"} placeholder={field.label} className="h-11 rounded-xl bg-secondary/70" required={field.required} />
    </Field>
  );
}

function mergeOptions(staticOptions: string[] | null, masterOptions: MasterDataOption[]) {
  const map = new Map<string, MasterDataOption>();

  for (const option of staticOptions ?? []) {
    map.set(option, { value: option, label: logLabel(option) });
  }

  for (const option of masterOptions) {
    if (!map.has(option.value)) map.set(option.value, option);
  }

  return Array.from(map.values());
}
function stringValue(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

function fieldStringValue(value: unknown) {
  if (value === undefined || value === null) return "";
  if (typeof value === "object") return JSON.stringify(value);
  return String(value);
}

function booleanStringValue(value: unknown) {
  if (typeof value === "boolean") return value ? "true" : "false";
  const stringified = fieldStringValue(value).toLowerCase();
  return stringified === "true" || stringified === "false" ? stringified : undefined;
}

function extractedFieldsValue(formData: FormData, fields: ModuleField[]) {
  return fields.reduce<Record<string, unknown>>((current, field) => {
    const rawValue = stringValue(formData, `extractedFields.${field.key}`);
    const fieldType = field.type.toLowerCase();
    if (!rawValue && !field.required) return current;
    if (fieldType === "number") {
      const value = Number(rawValue);
      current[field.key] = Number.isFinite(value) ? value : null;
      return current;
    }
    if (["boolean", "bool", "checkbox"].includes(fieldType)) {
      current[field.key] = rawValue === "true";
      return current;
    }
    current[field.key] = rawValue || null;
    return current;
  }, {});
}

function titleFromSchemaFields(fields?: Record<string, unknown>) {
  if (!fields) return "";
  for (const key of ["title", "issue", "name", "summary"]) {
    const value = fields[key];
    if (typeof value === "string" && value.trim()) return value.trim();
  }
  const firstTextValue = Object.values(fields).find((value) => typeof value === "string" && value.trim());
  return typeof firstTextValue === "string" ? firstTextValue.trim() : "";
}

function locationLabel(values?: LogFormValues) {
  return values?.capturedAddress || coordinatesLabel(values) || "No location captured";
}

function coordinatesLabel(values?: LogFormValues) {
  if (!values?.capturedLatitude || !values?.capturedLongitude) return "-";
  return `${values.capturedLatitude}, ${values.capturedLongitude}`;
}
