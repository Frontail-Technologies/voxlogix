"use client";

import { useMemo, useState } from "react";

import { AppIcon } from "@/components/common/app-icon";
import {
  CardContent,
  CardHeader,
  CardTitle,
  DashboardCard,
} from "@/components/common/dashboard-ui";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import type { ExtractedLogFields } from "@/features/logs/api/ai.types";
import { useMasterDataOptions } from "@/features/master-data-options/api/master-data-option.queries";
import type { MasterDataOption } from "@/features/master-data-options/api/master-data-option.types";
import type { ModuleField } from "@/features/master-modules/api/module.types";
import type { EquipmentListItem } from "@/features/admin-equipment/api/equipment.types";
import { cn } from "@/lib/utils";

type AiReviewStepProps = {
  equipment: EquipmentListItem;
  moduleFields: ModuleField[];
  extractedFields: ExtractedLogFields;
  onContinue: (fields: ExtractedLogFields) => void;
  onBack: () => void;
};

function fieldValueToString(value: string | number | null | undefined) {
  if (value === null || value === undefined) return "";
  return String(value);
}

function numericValue(value: unknown) {
  if (value === null || value === undefined || value === "") return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function stringMeta(meta: Record<string, unknown> | undefined, key: string) {
  const value = meta?.[key];
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

function numberMeta(meta: Record<string, unknown> | undefined, key: string) {
  return numericValue(meta?.[key]);
}

function applyLimitStatus(fields: ExtractedLogFields) {
  const reading = numericValue(fields.readingValue);
  const lower = numericValue(fields.lowerLimit);
  const upper = numericValue(fields.upperLimit);

  if (reading === null || (lower === null && upper === null)) return fields;

  return {
    ...fields,
    isOutOfLimit: lower !== null && reading < lower ? "Yes" : upper !== null && reading > upper ? "Yes" : "No",
  };
}

function applyMeterCounterCalculations(fields: ExtractedLogFields) {
  const currentReading = numericValue(fields.currentReading);
  const previousReading = numericValue(fields.previousReading);
  const expectedDailyConsumption = numericValue(fields.expectedDailyConsumption);
  const alertDeviationPct = numericValue(fields.alertDeviationPct);

  const next = { ...fields };
  if (currentReading !== null && previousReading !== null) {
    const consumption = Math.max(0, currentReading - previousReading);
    next.consumption = consumption;

    if (expectedDailyConsumption !== null && expectedDailyConsumption > 0) {
      const deviationPercent = Number((((consumption - expectedDailyConsumption) / expectedDailyConsumption) * 100).toFixed(2));
      next.deviationPercent = deviationPercent;
      if (alertDeviationPct !== null) {
        next.isOutOfLimit = Math.abs(deviationPercent) > alertDeviationPct ? "Yes" : "No";
      }
    }
  }

  return next;
}

export function AiReviewStep({
  equipment,
  moduleFields,
  extractedFields,
  onContinue,
  onBack,
}: AiReviewStepProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [fields, setFields] = useState<ExtractedLogFields>(extractedFields);

  function updateField(key: string, value: string | number | null, option?: MasterDataOption) {
    setFields((current) => {
      let next: ExtractedLogFields = { ...current, [key]: value };
      const meta = option?.meta;

      if (key === "measuringPoint" && meta) {
        next = {
          ...next,
          unit: stringMeta(meta, "measurementUnit") ?? next.unit,
          lowerLimit: numberMeta(meta, "lowerLimit") ?? next.lowerLimit,
          upperLimit: numberMeta(meta, "upperLimit") ?? next.upperLimit,
          alertSeverity: stringMeta(meta, "alertSeverity") ?? next.alertSeverity,
        };
      }

      if (key === "meterCounter" && meta) {
        next = {
          ...next,
          unit: stringMeta(meta, "counterUnit") ?? next.unit,
          meterType: stringMeta(meta, "meterType") ?? next.meterType,
          expectedDailyConsumption: numberMeta(meta, "expectedDailyConsumption") ?? next.expectedDailyConsumption,
          alertDeviationPct: numberMeta(meta, "alertDeviationPct") ?? next.alertDeviationPct,
        };
      }

      if (["measuringPoint", "readingValue", "lowerLimit", "upperLimit"].includes(key)) {
        next = applyLimitStatus(next);
      }

      if (["meterCounter", "currentReading", "previousReading", "expectedDailyConsumption", "alertDeviationPct"].includes(key)) {
        next = applyMeterCounterCalculations(next);
      }

      return next;
    });
  }

  return (
    <DashboardCard>
      <CardHeader className="flex flex-row items-center justify-between gap-2 border-b border-border/70 px-4 py-4 sm:px-5">
        <div className="flex items-center gap-2">
          <div className="flex size-10 items-center justify-center rounded-xl bg-primary/12 text-primary">
            <AppIcon name="ai" className="size-5" />
          </div>
          <div>
            <CardTitle>Review Log Details</CardTitle>
            <p className="mt-1 text-sm text-muted-foreground">
              Confirm each schema field before adding media and location.
            </p>
          </div>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="rounded-xl"
          onClick={() => setIsEditing((value) => !value)}
        >
          <AppIcon name="settings" className="size-4" />
          {isEditing ? "Done Editing" : "Edit Details"}
        </Button>
      </CardHeader>
      <CardContent className="space-y-5 px-4 pb-40 pt-5 sm:px-5">
        <section className="space-y-3">
          <div className="rounded-2xl border border-border bg-secondary/35 p-4">
            <div className="flex items-start gap-3">
              <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/12 text-primary">
                <AppIcon name="equipment" className="size-5" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-sm font-semibold text-foreground">{equipment.name}</h3>
                  <Badge className="rounded-full border-0 bg-primary/12 text-primary">{equipment.equipmentCode}</Badge>
                </div>
                <div className="mt-3 grid grid-cols-2 gap-3 lg:grid-cols-3">
                  <ReadOnlyField label="Section" value={equipment.section} />
                  <ReadOnlyField label="Sub Location" value={equipment.subLocation} />
                  <ReadOnlyField label="Asset Status" value="Ready for review" />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="space-y-3">
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-sm font-semibold text-foreground">Log Details</h3>
            <Badge className="rounded-full border-0 bg-emerald-500/12 text-emerald-700 dark:bg-emerald-400/15 dark:text-emerald-300">
              {moduleFields.length} fields
            </Badge>
          </div>
          <div className="grid gap-4 lg:grid-cols-2">
            {moduleFields.map((field) => {
              const value = fields[field.key];
              const isLongText = field.type === "Text" && fieldValueToString(value).length > 80;
              const spanTwo = field.type === "Text";

              return (
                <div
                  key={field.id}
                  className={cn(
                    "rounded-2xl border border-border bg-background p-3 sm:p-4",
                    spanTwo && "lg:col-span-2",
                  )}
                >
                  <div className="mb-2 flex items-center justify-between gap-2">
                    <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      {field.label}
                    </Label>
                    <Badge className="rounded-full border-0 bg-primary/10 text-[10px] text-primary">
                      {fieldSourceLabel(field)}
                    </Badge>
                  </div>
                  {isEditing ? (
                    <DynamicFieldInput field={field} value={value} onChange={(next, option) => updateField(field.key, next, option)} />
                  ) : (
                    <ReadOnlyValue value={fieldValueToString(value) || "-"} multiline={isLongText} />
                  )}
                </div>
              );
            })}
          </div>
        </section>

        <div className="fixed inset-x-0 bottom-0 z-50 flex flex-col gap-3 border-t border-border bg-card/95 px-4 pb-[calc(env(safe-area-inset-bottom)+0.75rem)] pt-3 shadow-[0_-12px_30px_rgba(15,23,42,0.08)] backdrop-blur sm:flex-row sm:items-center sm:justify-between md:left-(--sidebar-width) lg:px-8">
          <div>
            <p className="text-sm font-semibold text-foreground">Ready to continue?</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button type="button" className="rounded-xl" onClick={() => onContinue(fields)}>
              Continue to Media &amp; Location
              <AppIcon name="caret-right" className="size-4" />
            </Button>
            <Button type="button" variant="ghost" className="rounded-xl" onClick={onBack}>
              Back
            </Button>
          </div>
        </div>
      </CardContent>
    </DashboardCard>
  );
}

function fieldSourceLabel(field: ModuleField) {
  if (field.aiExtract) return "AI field";
  if (field.sourceType === "master") return "Master data";
  if (field.sourceType === "manual") return "Manual";
  if (field.sourceType === "computed") return "Computed";
  if (field.sourceType === "system") return "System";
  return "Schema";
}

function DynamicFieldInput({
  field,
  value,
  onChange,
}: {
  field: ModuleField;
  value: string | number | null | undefined;
  onChange: (value: string | number | null, option?: MasterDataOption) => void;
}) {
  const shouldLoadMasterOptions = field.sourceType === "master" && Boolean(field.sourceKey);
  const optionsQuery = useMasterDataOptions(
    { sourceKey: field.sourceKey, fieldKey: field.key },
    shouldLoadMasterOptions,
  );
  const options = useMemo(
    () => mergeOptions(field.options, optionsQuery.data?.data ?? []),
    [field.options, optionsQuery.data?.data],
  );

  if ((field.type === "Select" || shouldLoadMasterOptions) && options.length) {
    const currentValue = fieldValueToString(value);
    const currentOption = options.find((option) => option.value === currentValue);

    return (
      <Select value={currentValue} onValueChange={(next) => {
        if (!next) return;
        onChange(next, options.find((option) => option.value === next));
      }}>
        <SelectTrigger className="h-11 w-full rounded-xl bg-secondary/70">
          <span className="truncate">{currentOption?.label || currentValue || "Select value"}</span>
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    );
  }

  if (shouldLoadMasterOptions && optionsQuery.isLoading) {
    return (
      <div className="flex h-11 items-center rounded-xl border border-border bg-secondary/70 px-3 text-sm text-muted-foreground">
        Loading options...
      </div>
    );
  }

  if (field.type === "Number") {
    return (
      <Input
        type="number"
        value={fieldValueToString(value)}
        onChange={(event) => onChange(event.target.value === "" ? null : Number(event.target.value))}
        className="h-11 rounded-xl bg-secondary/70"
      />
    );
  }

  if (field.type === "Date") {
    return (
      <Input
        type="date"
        value={fieldValueToString(value)}
        onChange={(event) => onChange(event.target.value)}
        className="h-11 rounded-xl bg-secondary/70"
      />
    );
  }

  if (fieldValueToString(value).length > 80) {
    return (
      <Textarea
        value={fieldValueToString(value)}
        onChange={(event) => onChange(event.target.value)}
        className="min-h-20 rounded-xl bg-secondary/70"
      />
    );
  }

  return (
    <Input
      value={fieldValueToString(value)}
      onChange={(event) => onChange(event.target.value)}
      className="h-11 rounded-xl bg-secondary/70"
    />
  );
}

function mergeOptions(staticOptions: string[] | null, masterOptions: MasterDataOption[]) {
  const map = new Map<string, MasterDataOption>();

  for (const option of staticOptions ?? []) {
    map.set(option, { value: option, label: option });
  }

  for (const option of masterOptions) {
    if (!map.has(option.value)) map.set(option.value, option);
  }

  return Array.from(map.values());
}

function ReadOnlyValue({ value, multiline }: { value: string; multiline?: boolean }) {
  return (
    <p
      className={
        multiline
          ? "min-h-20 whitespace-pre-wrap text-sm leading-6 text-foreground"
          : "text-sm leading-6 text-foreground"
      }
    >
      {value}
    </p>
  );
}

function ReadOnlyField({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0 rounded-xl border border-border bg-background px-3 py-2">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 truncate text-sm font-medium text-foreground">{value}</p>
    </div>
  );
}
