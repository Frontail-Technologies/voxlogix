"use client";

import { useState, type FormEvent } from "react";
import { toast } from "sonner";

import { AppIcon } from "@/components/common/app-icon";
import { FormField } from "@/components/common/form-field";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useUpdateImportedMasterData } from "@/features/imported-master-data/api/imported-master-data.mutations";
import type {
  ImportedMasterDataItem,
  ImportedMasterDataSource,
} from "@/features/imported-master-data/api/imported-master-data.types";
import {
  masterDataLabel,
  masterDataStatuses,
  severityOptions,
} from "@/features/admin-master-data/master-data.presentation";
import {
  blurActiveElement,
  clearFieldError,
  focusFirstError,
  hasFieldErrors,
  type FieldErrors,
} from "@/lib/forms/form-state";
import { showApiErrorToast } from "@/lib/api/error-toast";

const yesNoOptions = [
  { value: "YES", label: "Yes" },
  { value: "NO", label: "No" },
] as const;

type FieldConfig = {
  name: string;
  label: string;
  type: "text" | "number" | "select" | "textarea";
  required?: boolean;
  options?: readonly { value: string; label: string }[];
};

const fieldConfigs: Record<ImportedMasterDataSource, FieldConfig[]> = {
  safetyReporting: [
    {
      name: "status",
      label: "Status",
      type: "select",
      options: masterDataStatuses,
    },
    { name: "safetyCategoryCode", label: "Category Code", type: "text" },
    {
      name: "incidentCategory",
      label: "Incident Category",
      type: "text",
      required: true,
    },
    {
      name: "incidentType",
      label: "Incident Type",
      type: "text",
      required: true,
    },
    {
      name: "severityLevel",
      label: "Severity",
      type: "select",
      options: severityOptions,
    },
    {
      name: "requiresPpe",
      label: "Requires PPE",
      type: "select",
      options: yesNoOptions,
    },
    { name: "ppeType", label: "PPE Type", type: "text" },
    {
      name: "reportable",
      label: "Reportable",
      type: "select",
      options: yesNoOptions,
    },
    {
      name: "immediateActionRequired",
      label: "Immediate Action Required",
      type: "select",
      options: yesNoOptions,
    },
    { name: "notes", label: "Notes", type: "textarea" },
  ],
  measuringPoints: [
    {
      name: "status",
      label: "Status",
      type: "select",
      options: masterDataStatuses,
    },
    { name: "pointCode", label: "Point Code", type: "text", required: true },
    {
      name: "measurementName",
      label: "Measurement Name",
      type: "text",
      required: true,
    },
    { name: "measurementUnit", label: "Unit", type: "text", required: true },
    { name: "targetValue", label: "Target Value", type: "number" },
    { name: "lowerLimit", label: "Lower Limit", type: "number" },
    { name: "upperLimit", label: "Upper Limit", type: "number" },
    { name: "measurementFrequency", label: "Frequency", type: "text" },
    {
      name: "alertSeverity",
      label: "Alert Severity",
      type: "select",
      options: severityOptions,
    },
    { name: "instrumentTag", label: "Instrument Tag", type: "text" },
    { name: "notes", label: "Notes", type: "textarea" },
  ],
  meterCounters: [
    {
      name: "status",
      label: "Status",
      type: "select",
      options: masterDataStatuses,
    },
    {
      name: "counterCode",
      label: "Counter Code",
      type: "text",
      required: true,
    },
    {
      name: "counterName",
      label: "Counter Name",
      type: "text",
      required: true,
    },
    { name: "counterUnit", label: "Unit", type: "text", required: true },
    { name: "meterType", label: "Meter Type", type: "text", required: true },
    { name: "location", label: "Location", type: "text" },
    { name: "readingFrequency", label: "Reading Frequency", type: "text" },
    { name: "initialReading", label: "Initial Reading", type: "number" },
    { name: "resetValue", label: "Reset Value", type: "number" },
    {
      name: "expectedDailyConsumption",
      label: "Expected Daily Consumption",
      type: "number",
    },
    { name: "alertDeviationPct", label: "Alert Deviation %", type: "number" },
    { name: "notes", label: "Notes", type: "textarea" },
  ],
  kaizen: [
    {
      name: "status",
      label: "Status",
      type: "select",
      options: masterDataStatuses,
    },
    { name: "kaizenCategoryCode", label: "Category Code", type: "text" },
    { name: "category", label: "Category", type: "text", required: true },
    { name: "department", label: "Department", type: "text" },
    { name: "kaizenStatus", label: "Status", type: "text" },
    {
      name: "immediateActionRequired",
      label: "Immediate Action Required",
      type: "select",
      options: yesNoOptions,
    },
    { name: "notes", label: "Notes", type: "textarea" },
  ],
};

const titles: Record<ImportedMasterDataSource, string> = {
  safetyReporting: "safety reporting record",
  measuringPoints: "measuring point",
  meterCounters: "meter counter",
  kaizen: "kaizen category",
};

function toFormValues(
  item: ImportedMasterDataItem,
  fields: FieldConfig[],
): Record<string, string> {
  const record = item as unknown as Record<string, unknown>;
  const values: Record<string, string> = {};
  for (const field of fields) {
    const raw = record[field.name];
    values[field.name] = raw === null || raw === undefined ? "" : String(raw);
  }
  return values;
}

export function ImportedMasterDataEditDialog({
  source,
  item,
  open,
  onOpenChange,
}: {
  source: ImportedMasterDataSource;
  item: ImportedMasterDataItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  if (!item) return null;
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[85vh] overflow-y-auto">
        <EditForm
          key={item.id}
          source={source}
          item={item}
          onOpenChange={onOpenChange}
        />
      </DialogContent>
    </Dialog>
  );
}

function EditForm({
  source,
  item,
  onOpenChange,
}: {
  source: ImportedMasterDataSource;
  item: ImportedMasterDataItem;
  onOpenChange: (open: boolean) => void;
}) {
  const fields = fieldConfigs[source];
  const updateMutation = useUpdateImportedMasterData(source);
  const [values, setValues] = useState<Record<string, string>>(() =>
    toFormValues(item, fields),
  );
  const [errors, setErrors] = useState<FieldErrors>({});

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    blurActiveElement();
    const nextErrors: FieldErrors = {};
    for (const field of fields) {
      if (field.required && !values[field.name]?.trim()) {
        nextErrors[field.name] = `${field.label} is required.`;
      }
      if (
        field.type === "number" &&
        values[field.name] &&
        Number.isNaN(Number(values[field.name]))
      ) {
        nextErrors[field.name] = `${field.label} must be a number.`;
      }
    }
    if (hasFieldErrors(nextErrors)) {
      setErrors(nextErrors);
      focusFirstError(event.currentTarget, nextErrors);
      return;
    }

    const payload: Record<string, string | number | null> = {};
    for (const field of fields) {
      const raw = values[field.name] ?? "";
      if (field.type === "number") {
        payload[field.name] = raw.trim() === "" ? null : Number(raw);
      } else {
        payload[field.name] = raw.trim() === "" ? "" : raw;
      }
    }

    try {
      await updateMutation.mutateAsync({ id: item.id, payload });
      toast.success("Changes saved");
      onOpenChange(false);
    } catch (error) {
      showApiErrorToast(error, `Could not update ${titles[source]}`);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <DialogHeader>
        <DialogTitle>Edit {masterDataLabel(titles[source])}</DialogTitle>
        <DialogDescription>
          Update the fields below and save your changes.
        </DialogDescription>
      </DialogHeader>
      <div className="grid gap-4 py-4">
        {fields.map((field) => (
          <FormField
            key={field.name}
            label={field.label}
            fieldName={field.name}
            error={errors[field.name]}
          >
            {field.type === "textarea" ? (
              <Textarea
                id={field.name}
                name={field.name}
                value={values[field.name] ?? ""}
                onChange={(event) => {
                  setValues((current) => ({
                    ...current,
                    [field.name]: event.target.value,
                  }));
                  setErrors((current) => clearFieldError(current, field.name));
                }}
                className="rounded-xl bg-secondary/70"
                rows={3}
              />
            ) : field.type === "select" ? (
              <Select
                value={values[field.name] ?? ""}
                onValueChange={(value) => {
                  if (!value) return;
                  setValues((current) => ({ ...current, [field.name]: value }));
                  setErrors((current) => clearFieldError(current, field.name));
                }}
              >
                <SelectTrigger
                  id={field.name}
                  className="h-11 w-full rounded-xl bg-secondary/70"
                >
                  <span className="truncate">
                    {values[field.name]
                      ? masterDataLabel(values[field.name])
                      : `Select ${field.label.toLowerCase()}`}
                  </span>
                </SelectTrigger>
                <SelectContent>
                  {field.options?.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <Input
                id={field.name}
                name={field.name}
                type={field.type === "number" ? "number" : "text"}
                step={field.type === "number" ? "any" : undefined}
                value={values[field.name] ?? ""}
                onChange={(event) => {
                  setValues((current) => ({
                    ...current,
                    [field.name]: event.target.value,
                  }));
                  setErrors((current) => clearFieldError(current, field.name));
                }}
                className="h-11 rounded-xl bg-secondary/70"
                aria-invalid={Boolean(errors[field.name])}
              />
            )}
          </FormField>
        ))}
      </div>
      <DialogFooter>
        <DialogClose
          render={<Button variant="outline" className="rounded-xl" />}
        >
          Cancel
        </DialogClose>
        <Button
          type="submit"
          className="rounded-xl"
          disabled={updateMutation.isPending}
        >
          <AppIcon name="settings" className="size-4" />
          {updateMutation.isPending ? "Saving..." : "Save Changes"}
        </Button>
      </DialogFooter>
    </form>
  );
}
