"use client";

import { useMemo, useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { showApiErrorToast } from "@/lib/api/error-toast";

import { AppIcon, type AppIconName } from "@/components/common/app-icon";
import { AssetUploadPanel } from "@/components/common/asset-upload-panel";
import { DashboardCard } from "@/components/common/dashboard-ui";
import { FormActionBar } from "@/components/common/form-action-bar";
import { FormField as Field } from "@/components/common/form-field";
import { Button } from "@/components/ui/button";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { createModuleField, deleteModuleField, updateModuleField, useCreateModule, useUpdateModule } from "@/features/master-modules/api/module.mutations";
import type { CreateModuleFieldPayload, ModuleDetail, ModuleField, ModuleFieldSourceKey, ModuleFieldSourceType } from "@/features/master-modules/api/module.types";
import { useActiveModuleCategoriesOptions } from "@/features/master-module-categories/api/module-category.queries";
import { useActiveModuleTypesOptions } from "@/features/master-module-types/api/module-type.queries";
import type { ImageAssetValue } from "@/features/uploads/api/upload.types";
import { isPendingImageAsset } from "@/features/uploads/api/upload.types";
import { buildMultipartPayload } from "@/lib/api/multipart";
import {
  blurActiveElement,
  clearFieldError,
  focusFirstError,
  hasFieldErrors,
  isFormDirty,
  readFormValues,
  validateRequiredFields,
  type FieldErrors,
  type FormValues,
} from "@/lib/forms/form-state";
import { cn } from "@/lib/utils";

type ModuleFormProps = { mode: "create" | "edit"; moduleId?: string; values?: ModuleDetail };
type LocalField = { id?: string; label: string; key: string; type: string; required: boolean; aiExtract: boolean; sourceType: ModuleFieldSourceType; sourceKey: ModuleFieldSourceKey | null; feedVisible: boolean; reportVisible: boolean; sortOrder: number; options?: string[]; validationRules?: Record<string, unknown> | null };

const moduleStatuses = ["ACTIVE", "INACTIVE", "COMING_SOON"];
const fieldTypes = ["Text", "Number", "Select", "Date"];
const fieldSourceTypes: Array<{ label: string; value: ModuleFieldSourceType }> = [
  { label: "System", value: "system" },
  { label: "AI", value: "ai" },
  { label: "Master Data", value: "master" },
  { label: "Manual", value: "manual" },
  { label: "Computed", value: "computed" },
];
const fieldSourceKeys: Array<{ label: string; value: ModuleFieldSourceKey }> = [
  { label: "Equipment Master", value: "equipment_master" },
  { label: "Issue Categories", value: "issue_categories" },
  { label: "Safety Reporting", value: "safety_reporting" },
  { label: "Measuring Points", value: "measuring_points" },
  { label: "Meter Counters", value: "meter_counters" },
  { label: "Users & Roles", value: "users_roles" },
  { label: "Sections / Locations / Shift", value: "sections_locations_shift" },
  { label: "Kaizen", value: "kaizen" },
];
const moduleIconOptions: { label: string; value: AppIconName }[] = [
  { label: "Equipment", value: "equipment" },
  { label: "Safety", value: "warning" },
  { label: "Measurement", value: "status" },
  { label: "Database", value: "database" },
  { label: "Calendar", value: "calendar" },
  { label: "Planning", value: "planning" },
  { label: "AI", value: "ai" },
  { label: "Package", value: "package" },
  { label: "Activity", value: "activity" },
  { label: "Voice", value: "voice" },
  { label: "Logs", value: "logs" },
  { label: "Modules", value: "modules" },
  { label: "Reports", value: "reports" },
  { label: "Storage", value: "storage" },
  { label: "Users", value: "users" },
  { label: "Admins", value: "admins" },
  { label: "Companies", value: "companies" },
  { label: "Billing", value: "billing" },
  { label: "Rocket", value: "rocket" },
  { label: "Profile", value: "profile" },
  { label: "Image", value: "image" },
  { label: "Download", value: "download" },
  { label: "Settings", value: "settings" },
  { label: "Planet", value: "planet" },
];

export function ModuleForm({ mode, moduleId, values }: ModuleFormProps) {
  const router = useRouter();
  const isEdit = mode === "edit";
  const createMutation = useCreateModule();
  const updateMutation = useUpdateModule(moduleId ?? "");
  const formRef = useRef<HTMLFormElement>(null);
  const [errors, setErrors] = useState<FieldErrors>({});
  const moduleTypesQuery = useActiveModuleTypesOptions();
  const moduleCategoriesQuery = useActiveModuleCategoriesOptions();
  const moduleTypeOptions = useMemo(() => moduleTypesQuery.data?.data ?? [], [moduleTypesQuery.data?.data]);
  const moduleCategoryOptions = useMemo(() => moduleCategoriesQuery.data?.data ?? [], [moduleCategoriesQuery.data?.data]);
  const selectedCategory = values?.category ?? moduleCategoryOptions[0]?.name ?? "Operational";
  const [selectedIcon, setSelectedIcon] = useState<AppIconName>(moduleIcon(values?.icon) ?? "modules");
  const [mediaAsset, setMediaAsset] = useState<ImageAssetValue | null>(() => values?.mediaUrl ? { provider: "cloudinary", key: values.mediaKey ?? values.mediaUrl, url: values.mediaUrl, secureUrl: values.mediaUrl, mimeType: "image/*", bytes: 0 } : null);
  const [fields, setFields] = useState<LocalField[]>(() => mapFields(values?.fields ?? []));
  const [behavior, setBehavior] = useState({
    voiceEnabled: values?.voiceEnabled ?? true,
    feedEnabled: values?.feedEnabled ?? true,
    feedOnlyOnAlert: values?.feedOnlyOnAlert ?? false,
    requiresVoicePlayback: values?.requiresVoicePlayback ?? true,
    maxAttachments: values?.maxAttachments ?? 5,
  });
  const isSubmitting = createMutation.isPending || updateMutation.isPending;
  const uploadFileName = useMemo(() => values?.name?.trim().toLowerCase().replace(/\s+/g, "-") ?? "module-media", [values?.name]);
  const initialValues = useMemo<FormValues>(() => ({
    name: values?.name ?? "",
    moduleTypeId: values?.moduleTypeId ?? moduleTypeOptions[0]?.id ?? "",
    category: selectedCategory,
    status: values?.status ?? "INACTIVE",
    availabilityText: values?.availabilityText ?? "Available to all companies",
    color: values?.color ?? "#f7b51e",
    description: values?.description ?? "",
    promptPreview: values?.promptPreview ?? "",
    selectedIcon: moduleIcon(values?.icon) ?? "modules",
    mediaKey: values?.mediaKey ?? values?.mediaUrl ?? "",
    behavior: {
      voiceEnabled: values?.voiceEnabled ?? true,
      feedEnabled: values?.feedEnabled ?? true,
      feedOnlyOnAlert: values?.feedOnlyOnAlert ?? false,
      requiresVoicePlayback: values?.requiresVoicePlayback ?? true,
      maxAttachments: values?.maxAttachments ?? 5,
    },
    fields: mapFields(values?.fields ?? []).map(normalizeLocalField),
  }), [moduleTypeOptions, selectedCategory, values?.availabilityText, values?.color, values?.description, values?.feedEnabled, values?.feedOnlyOnAlert, values?.fields, values?.icon, values?.maxAttachments, values?.mediaKey, values?.mediaUrl, values?.moduleTypeId, values?.name, values?.promptPreview, values?.requiresVoicePlayback, values?.status, values?.voiceEnabled]);
  const [currentValues, setCurrentValues] = useState<FormValues>(initialValues);
  const isDirty = !isEdit || isFormDirty(initialValues, currentValues);
  const createReady = Boolean(currentValues.name)
    && Boolean(currentValues.moduleTypeId)
    && Boolean(currentValues.category)
    && Boolean(currentValues.availabilityText);
  const submitDisabled = !isDirty || !createReady || hasFieldErrors(errors);

  function handleFormChange(event: ChangeEvent<HTMLFormElement>) {
    const fieldName = (event.target as unknown as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement).name;
    if (fieldName) setErrors((current) => clearFieldError(current, fieldName));
    setCurrentValues(readFormValues(event.currentTarget, {
      selectedIcon,
      mediaKey: moduleMediaKey(mediaAsset, values),
      behavior,
      fields: fields.map(normalizeLocalField),
    }));
  }

  function updateBehavior(patch: Partial<typeof behavior>) {
    setBehavior((current) => {
      const nextBehavior = { ...current, ...patch };
      setCurrentValues((snapshot) => ({ ...snapshot, behavior: nextBehavior }));
      return nextBehavior;
    });
  }


  function addField() {
    setFields((current) => {
      const nextField: LocalField = { label: "", key: "", type: "Text", required: false, aiExtract: true, sourceType: "ai", sourceKey: null, feedVisible: true, reportVisible: true, sortOrder: current.length + 1 };
      const nextFields = [...current, nextField];
      setCurrentValues((snapshot) => ({ ...snapshot, fields: nextFields.map(normalizeLocalField) }));
      return nextFields;
    });
  }

  function updateLocalField(index: number, patch: Partial<LocalField>) {
    setFields((current) => {
      const nextFields = current.map((field, fieldIndex) => {
      if (fieldIndex !== index) return field;
      const next = { ...field, ...patch };
      if (patch.label !== undefined && (field.key === "" || field.key === toFieldKey(field.label))) {
        next.key = toFieldKey(patch.label);
      }
      return next;
      });
      setCurrentValues((snapshot) => ({ ...snapshot, fields: nextFields.map(normalizeLocalField) }));
      return nextFields;
    });
  }

  async function removeField(index: number) {
    const field = fields[index];
    if (field.id && moduleId) {
      try {
        await deleteModuleField(moduleId, field.id);
        toast.success("Field deleted");
      } catch (error) {
        showApiErrorToast(error, "Could not delete field");
        return;
      }
    }
    setFields((current) => {
      const nextFields = current.filter((_, fieldIndex) => fieldIndex !== index).map((item, itemIndex) => ({ ...item, sortOrder: itemIndex + 1 }));
      setCurrentValues((snapshot) => ({ ...snapshot, fields: nextFields.map(normalizeLocalField) }));
      return nextFields;
    });
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    blurActiveElement();
    const formData = new FormData(event.currentTarget);
    const nextErrors = validateRequiredFields(readFormValues(event.currentTarget), [
      { key: "name", label: "Module name" },
      { key: "moduleTypeId", label: "Module type" },
      { key: "category", label: "Category" },
      { key: "availabilityText", label: "Availability text" },
    ]);
    if (hasFieldErrors(nextErrors)) {
      setErrors(nextErrors);
      focusFirstError(event.currentTarget, nextErrors);
      return;
    }
    const payload = {
      name: stringValue(formData, "name"),
      moduleTypeId: stringValue(formData, "moduleTypeId"),
      category: stringValue(formData, "category"),
      status: stringValue(formData, "status"),
      availabilityText: stringValue(formData, "availabilityText"),
      icon: selectedIcon,
      color: stringValue(formData, "color"),
      description: optionalValue(formData, "description") ?? undefined,
      mediaUrl: isPendingImageAsset(mediaAsset) ? values?.mediaUrl ?? null : mediaAsset?.secureUrl ?? mediaAsset?.url ?? null,
      mediaKey: isPendingImageAsset(mediaAsset) ? values?.mediaKey ?? null : mediaAsset?.key ?? null,
      promptPreview: optionalValue(formData, "promptPreview") ?? undefined,
      ...behavior,
    };
    const cleanFields = fields.filter((field) => field.label.trim() && field.key.trim()).map((field, index) => ({ ...field, sortOrder: index + 1 }));

    try {
      if (isEdit && moduleId) {
        await updateMutation.mutateAsync(buildMultipartPayload(payload, isPendingImageAsset(mediaAsset) ? mediaAsset.file : null));
        await Promise.all(cleanFields.map((field) => field.id ? updateModuleField(moduleId, field.id, toFieldPayload(field)) : createModuleField(moduleId, toFieldPayload(field))));
        toast.success("Module updated");
        router.push("/master/modules");
      } else {
        await createMutation.mutateAsync(buildMultipartPayload({ ...payload, fields: cleanFields.map(toFieldPayload) }, isPendingImageAsset(mediaAsset) ? mediaAsset.file : null));
        toast.success("Module created");
        router.push("/master/modules");
      }
    } catch (error) {
      showApiErrorToast(error, "Could not save module");
    }
  }

  return (
    <form ref={formRef} className="space-y-4 pb-36 sm:space-y-6" onSubmit={handleSubmit} onChange={handleFormChange} noValidate>
      <DashboardCard>
        <CardContent className="grid gap-4 p-4 sm:p-6 xl:grid-cols-2">
          <div className="space-y-2 xl:col-span-2"><Label>Module Media</Label><AssetUploadPanel title={values?.name ?? "Module media"} buttonLabel="Choose Media" folder="modules" context="module-media" fileName={uploadFileName} previewType="image" value={mediaAsset} onChange={(asset) => { setMediaAsset(asset); setCurrentValues((snapshot) => ({ ...snapshot, mediaKey: moduleMediaKey(asset, values) })); }} /></div>
          <Field label="Module Name" fieldName="name" error={errors.name}><Input name="name" defaultValue={values?.name} placeholder="Equipment Log" className="h-11 rounded-xl bg-secondary/70" aria-invalid={Boolean(errors.name)} /></Field>
          <Field label="Module Type" fieldName="moduleTypeId" error={errors.moduleTypeId}><Select name="moduleTypeId" defaultValue={values?.moduleTypeId ?? moduleTypeOptions[0]?.id}><SelectTrigger className="h-11 w-full rounded-xl bg-secondary/70" aria-invalid={Boolean(errors.moduleTypeId)}><SelectValue /></SelectTrigger><SelectContent>{moduleTypeOptions.map((moduleType) => <SelectItem key={moduleType.id} value={moduleType.id}>{label(moduleType.name)}</SelectItem>)}</SelectContent></Select></Field>
          <Field label="Category" fieldName="category" error={errors.category}><Select name="category" defaultValue={selectedCategory}><SelectTrigger className="h-11 w-full rounded-xl bg-secondary/70" aria-invalid={Boolean(errors.category)}><SelectValue placeholder="Select category" /></SelectTrigger><SelectContent>{moduleCategoryOptions.some((category) => category.name === selectedCategory) ? null : <SelectItem value={selectedCategory}>{selectedCategory}</SelectItem>}{moduleCategoryOptions.map((category) => <SelectItem key={category.id} value={category.name}>{category.name}</SelectItem>)}</SelectContent></Select></Field>
          <Field label="Status"><Select name="status" defaultValue={values?.status ?? "INACTIVE"}><SelectTrigger className="h-11 w-full rounded-xl bg-secondary/70"><SelectValue /></SelectTrigger><SelectContent>{moduleStatuses.map((status) => <SelectItem key={status} value={status}>{label(status)}</SelectItem>)}</SelectContent></Select></Field>
          <Field label="Availability Text" fieldName="availabilityText" error={errors.availabilityText}><Input name="availabilityText" defaultValue={values?.availabilityText ?? "Available to all companies"} placeholder="Available to all companies" className="h-11 rounded-xl bg-secondary/70" aria-invalid={Boolean(errors.availabilityText)} /></Field>
          <Field label="Module Color"><div className="flex h-11 items-center gap-3 rounded-xl border border-input bg-secondary/70 px-3"><Input name="color" type="color" defaultValue={values?.color ?? "#f7b51e"} className="size-7 rounded-md border-0 bg-transparent p-0" /><span className="text-sm text-muted-foreground">{values?.color ?? "#f7b51e"}</span></div></Field>
          <div className="space-y-2 xl:col-span-2"><Label>Module Icon</Label><div className="flex flex-wrap gap-2">{moduleIconOptions.map((option) => { const active = selectedIcon === option.value; return <button key={option.value} type="button" aria-pressed={active} onClick={() => { setSelectedIcon(option.value); setCurrentValues((snapshot) => ({ ...snapshot, selectedIcon: option.value })); }} className={cn("flex h-11 min-w-[9.5rem] items-center gap-2 rounded-lg border border-border bg-secondary/70 px-2.5 text-left text-sm transition-colors hover:border-primary/50 hover:bg-primary/8 sm:min-w-[11rem]", active && "border-primary bg-primary/12 text-primary shadow-sm ring-1 ring-primary/30")}><span className={cn("flex size-7 shrink-0 items-center justify-center rounded-md bg-background text-muted-foreground", active && "bg-primary text-primary-foreground")}><AppIcon name={option.value} className="size-4" /></span><span className="min-w-0 flex-1 truncate font-medium">{option.label}</span>{active ? <AppIcon name="status" className="size-4 shrink-0 text-primary" /> : null}</button>; })}</div></div>
          <Field label="Description" className="xl:col-span-2"><Textarea name="description" defaultValue={values?.description ?? undefined} placeholder="Describe the module purpose..." className="min-h-24 rounded-xl bg-secondary/70" /></Field>
          <div className="space-y-3 xl:col-span-2">
            <Label>Module Behavior</Label>
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
              <BehaviorToggle label="Voice Input" checked={behavior.voiceEnabled} onChange={(checked) => updateBehavior({ voiceEnabled: checked })} />
              <BehaviorToggle label="Show In Feed" checked={behavior.feedEnabled} onChange={(checked) => updateBehavior({ feedEnabled: checked })} />
              <BehaviorToggle label="Alert Feed Only" checked={behavior.feedOnlyOnAlert} onChange={(checked) => updateBehavior({ feedOnlyOnAlert: checked })} />
              <BehaviorToggle label="Voice Playback" checked={behavior.requiresVoicePlayback} onChange={(checked) => updateBehavior({ requiresVoicePlayback: checked })} />
              <div className="rounded-xl border border-border bg-secondary/50 p-3">
                <Label className="text-xs text-muted-foreground">Max Attachments</Label>
                <Input
                  type="number"
                  min={0}
                  max={20}
                  value={behavior.maxAttachments}
                  onChange={(event) => updateBehavior({ maxAttachments: Number(event.target.value) || 0 })}
                  className="mt-2 h-9 rounded-lg bg-background"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </DashboardCard>

      <div className="grid gap-4 xl:grid-cols-[1fr_360px]"><ModuleFieldsBuilder fields={fields} onAdd={addField} onRemove={removeField} onChange={updateLocalField} /><ModulePromptPreview defaultValue={values?.promptPreview} /></div>
      <FormActionBar cancelHref="/master/modules" submitLabel={isEdit ? "Update Module" : "Create Module"} submitIcon={isEdit ? "settings" : "plus"} isSubmitting={isSubmitting} submitDisabled={submitDisabled} />
    </form>
  );
}

function ModuleFieldsBuilder({ fields, onAdd, onRemove, onChange }: { fields: LocalField[]; onAdd: () => void; onRemove: (index: number) => void; onChange: (index: number, patch: Partial<LocalField>) => void }) {
  return (
    <DashboardCard>
      <CardHeader className="border-b border-border px-5 py-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <CardTitle>Schema Fields</CardTitle>
            <p className="text-sm text-muted-foreground">Define capture fields and link them to AI, master data, feed, and reports.</p>
          </div>
          <Button type="button" variant="outline" className="rounded-xl" onClick={onAdd}>
            <AppIcon name="plus" className="size-4" />
            Add Field
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3 p-4 sm:p-5">
        {fields.length ? fields.map((field, index) => (
          <div key={field.id ?? index} className="rounded-2xl border border-border bg-secondary/35 p-3 sm:p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground">Field {index + 1}</p>
                <p className="mt-1 truncate text-sm font-medium text-foreground">{field.label || "Untitled field"}</p>
              </div>
              <Button type="button" variant="ghost" size="icon-sm" className="shrink-0 rounded-lg text-destructive" onClick={() => onRemove(index)}>
                <AppIcon name="trash" className="size-4" />
              </Button>
            </div>

            <div className="mt-3 grid gap-3 lg:grid-cols-12 lg:items-end">
              <Field label="Field Label" className="lg:col-span-5">
                <Input value={field.label} onChange={(event) => onChange(index, { label: event.target.value })} placeholder="Field label" className="h-10 rounded-xl bg-background" />
              </Field>
              <Field label="Field Key" className="lg:col-span-5">
                <Input value={field.key} onChange={(event) => onChange(index, { key: event.target.value })} placeholder="field_key" className="h-10 rounded-xl bg-background" />
              </Field>
              <Field label="Type" className="lg:col-span-2">
                <Select value={field.type} onValueChange={(value) => value && onChange(index, { type: value })}>
                  <SelectTrigger className="h-10 w-full rounded-xl bg-background"><SelectValue /></SelectTrigger>
                  <SelectContent>{fieldTypes.map((type) => <SelectItem key={type} value={type}>{type}</SelectItem>)}</SelectContent>
                </Select>
              </Field>
              {field.type === "Select" ? (
                <Field label="Options (comma-separated)" className="lg:col-span-12">
                  <Input
                    key={field.id ?? index}
                    defaultValue={(field.options ?? []).join(", ")}
                    onBlur={(event) => onChange(index, { options: event.target.value.split(",").map((option) => option.trim()).filter(Boolean) })}
                    placeholder="e.g. Yes, No"
                    className="h-10 rounded-xl bg-background"
                  />
                </Field>
              ) : null}
            </div>

            <div className="mt-3 grid gap-3 xl:grid-cols-12 xl:items-end">
              <Field label="Source Type" className="xl:col-span-3">
                <Select value={field.sourceType} onValueChange={(value) => value && onChange(index, { sourceType: value as ModuleFieldSourceType, sourceKey: value === "master" ? field.sourceKey : null })}>
                  <SelectTrigger className="h-10 w-full rounded-xl bg-background"><SelectValue /></SelectTrigger>
                  <SelectContent>{fieldSourceTypes.map((source) => <SelectItem key={source.value} value={source.value}>{source.label}</SelectItem>)}</SelectContent>
                </Select>
              </Field>
              <Field label="Data Source" className="xl:col-span-4">
                <Select value={field.sourceKey ?? "none"} onValueChange={(value) => onChange(index, { sourceKey: value === "none" ? null : value as ModuleFieldSourceKey })}>
                  <SelectTrigger className="h-10 w-full rounded-xl bg-background" disabled={field.sourceType !== "master"}><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No Source</SelectItem>
                    {fieldSourceKeys.map((source) => <SelectItem key={source.value} value={source.value}>{source.label}</SelectItem>)}
                  </SelectContent>
                </Select>
              </Field>
              <div className="flex flex-wrap items-end gap-2 xl:col-span-5">
                <FieldFlagToggle label="Required" checked={field.required} onChange={(checked) => onChange(index, { required: checked })} />
                <FieldFlagToggle label="AI Extract" checked={field.aiExtract} onChange={(checked) => onChange(index, { aiExtract: checked })} />
                <FieldFlagToggle label="Feed" checked={field.feedVisible} onChange={(checked) => onChange(index, { feedVisible: checked })} />
                <FieldFlagToggle label="Report" checked={field.reportVisible} onChange={(checked) => onChange(index, { reportVisible: checked })} />
              </div>
            </div>
          </div>
        )) : (
          <div className="rounded-2xl border border-dashed border-border bg-secondary/35 p-8 text-center text-sm text-muted-foreground">No fields yet. Add the first field.</div>
        )}
      </CardContent>
    </DashboardCard>
  );
}

function FieldFlagToggle({ label: toggleLabel, checked, onChange }: { label: string; checked: boolean; onChange: (checked: boolean) => void }) {
  return (
    <div className="flex h-10 min-w-[118px] flex-1 items-center justify-between gap-3 rounded-xl border border-border bg-background px-3 sm:flex-none">
      <span className="whitespace-nowrap text-xs font-medium text-foreground">{toggleLabel}</span>
      <Switch checked={checked} onCheckedChange={onChange} />
    </div>
  );
}

function ModulePromptPreview({ defaultValue }: { defaultValue?: string | null }) {
  const preview = defaultValue ?? '{\n  "equipment_id": "EQ-1031",\n  "equipment_name": "Air Compressor"\n}';

  return (
    <DashboardCard>
      <CardHeader className="border-b border-border px-4 py-3">
        <CardTitle>AI Prompt Preview</CardTitle>
        <p className="text-xs text-muted-foreground">Generated from enabled schema fields.</p>
      </CardHeader>
      <CardContent className="p-4">
        <input type="hidden" name="promptPreview" value={preview} />
        <pre className="max-h-72 overflow-auto rounded-xl border border-border bg-secondary/40 p-4 font-mono text-xs leading-5 text-muted-foreground whitespace-pre-wrap break-words">
          {preview}
        </pre>
      </CardContent>
    </DashboardCard>
  );
}

function BehaviorToggle({ label: toggleLabel, checked, onChange }: { label: string; checked: boolean; onChange: (checked: boolean) => void }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-xl border border-border bg-secondary/50 p-3">
      <span className="text-sm font-medium text-foreground">{toggleLabel}</span>
      <Switch checked={checked} onCheckedChange={onChange} />
    </div>
  );
}

function mapFields(fields: ModuleField[]): LocalField[] { return fields.map((field) => ({ id: field.id, label: field.label, key: field.key, type: field.type, required: field.required, aiExtract: field.aiExtract, sourceType: field.sourceType ?? "ai", sourceKey: field.sourceKey ?? null, feedVisible: field.feedVisible ?? true, reportVisible: field.reportVisible ?? true, validationRules: field.validationRules ?? null, sortOrder: field.sortOrder, options: field.options ?? undefined })); }
function normalizeLocalField(field: LocalField) { return { label: field.label, key: field.key, type: field.type, required: field.required, aiExtract: field.aiExtract, sourceType: field.sourceType, sourceKey: field.sourceKey, feedVisible: field.feedVisible, reportVisible: field.reportVisible, sortOrder: field.sortOrder, options: field.options ?? [], validationRules: field.validationRules ? JSON.stringify(field.validationRules) : "" }; }
function toFieldPayload(field: LocalField): CreateModuleFieldPayload { return { label: field.label, key: field.key, type: field.type, required: field.required, aiExtract: field.aiExtract, sourceType: field.sourceType, sourceKey: field.sourceType === "master" ? field.sourceKey : null, feedVisible: field.feedVisible, reportVisible: field.reportVisible, validationRules: field.validationRules ?? null, sortOrder: field.sortOrder, options: field.options }; }
function stringValue(formData: FormData, key: string) { return String(formData.get(key) ?? "").trim(); }
function optionalValue(formData: FormData, key: string) { const value = stringValue(formData, key); return value || null; }
function label(value: string) { return value.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase()); }
function toFieldKey(value: string): string {
  const words = value.trim().replace(/[^a-zA-Z0-9]+/g, " ").trim().split(/\s+/).filter(Boolean);
  if (!words.length) return "";
  return words.map((word, index) => {
    const lower = word.toLowerCase();
    return index === 0 ? lower : lower.charAt(0).toUpperCase() + lower.slice(1);
  }).join("");
}
function moduleIcon(icon?: string | null): AppIconName | null { return (icon === "clipboard-text" ? "logs" : icon === "warning-circle" ? "warning" : icon === "gauge" ? "status" : icon === "clock-countdown" ? "activity" : icon === "sparkle" ? "ai" : icon === "git-branch" ? "modules" : icon ?? null) as AppIconName | null; }
function moduleMediaKey(asset: ImageAssetValue | null, values?: ModuleDetail) {
  return isPendingImageAsset(asset)
    ? values?.mediaKey ?? values?.mediaUrl ?? ""
    : asset?.key ?? asset?.secureUrl ?? asset?.url ?? "";
}
