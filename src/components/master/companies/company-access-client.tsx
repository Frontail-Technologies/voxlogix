"use client";

import { useMemo, useState, type ChangeEvent, type FormEvent } from "react";
import { toast } from "sonner";

import { DashboardCard, DashboardPageHeader } from "@/components/common/dashboard-ui";
import { FormField } from "@/components/common/form-field";
import { MasterDetailSkeleton } from "@/components/master/master-skeletons";
import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { useUpdateCompanyAccess } from "@/features/master-companies/api/company.mutations";
import { useCompanyAccess, useCompanyDetail } from "@/features/master-companies/api/company.queries";
import { useModulesList } from "@/features/master-modules/api/module.queries";
import { showApiErrorToast } from "@/lib/api/error-toast";
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

type AccessFlags = {
  voiceLoggingEnabled: boolean;
  aiStructuredExtractionEnabled: boolean;
  imageUploadEnabled: boolean;
  captureDeviceLocationEnabled: boolean;
  reportsEnabled: boolean;
  exportEnabled: boolean;
};

const accessFlagLabels: Array<{ key: keyof AccessFlags; label: string }> = [
  { key: "voiceLoggingEnabled", label: "Voice Logging" },
  { key: "aiStructuredExtractionEnabled", label: "AI Extraction" },
  { key: "imageUploadEnabled", label: "Image Upload" },
  { key: "captureDeviceLocationEnabled", label: "Device Location" },
  { key: "reportsEnabled", label: "Reports" },
  { key: "exportEnabled", label: "Export" },
];

export function CompanyAccessClient({ companyId }: { companyId: string }) {
  const companyQuery = useCompanyDetail(companyId);
  const accessQuery = useCompanyAccess(companyId);
  const modulesQuery = useModulesList({ limit: 100 });
  const updateMutation = useUpdateCompanyAccess(companyId);
  const access = accessQuery.data?.data;
  const [enabledModuleOverride, setEnabledModuleOverride] = useState<string[] | null>(null);
  const [flagOverride, setFlagOverride] = useState<AccessFlags | null>(null);
  const [limitOverride, setLimitOverride] = useState<{ userCreationLimit?: string; aiUsageLimitMinutes?: string } | null>(null);
  const [errors, setErrors] = useState<FieldErrors>({});
  const enabledModuleIds = useMemo(
    () => enabledModuleOverride ?? access?.enabledModuleIds ?? [],
    [access?.enabledModuleIds, enabledModuleOverride],
  );
  const flags: AccessFlags = useMemo(() => flagOverride ?? {
    voiceLoggingEnabled: access?.voiceLoggingEnabled ?? false,
    aiStructuredExtractionEnabled: access?.aiStructuredExtractionEnabled ?? false,
    imageUploadEnabled: access?.imageUploadEnabled ?? false,
    captureDeviceLocationEnabled: access?.captureDeviceLocationEnabled ?? false,
    reportsEnabled: access?.reportsEnabled ?? false,
    exportEnabled: access?.exportEnabled ?? false,
  }, [
    access?.aiStructuredExtractionEnabled,
    access?.captureDeviceLocationEnabled,
    access?.exportEnabled,
    access?.imageUploadEnabled,
    access?.reportsEnabled,
    access?.voiceLoggingEnabled,
    flagOverride,
  ]);
  const initialValues = useMemo<FormValues>(() => ({
    ...defaultFlags(access),
    enabledModuleIds: [...(access?.enabledModuleIds ?? [])].sort(),
    userCreationLimit: access?.userCreationLimit ?? 0,
    aiUsageLimitMinutes: access?.aiUsageLimitMinutes ?? 0,
  }), [access]);
  const currentValues = useMemo<FormValues>(() => ({
    ...flags,
    enabledModuleIds: [...enabledModuleIds].sort(),
    userCreationLimit: limitOverride?.userCreationLimit ?? String(access?.userCreationLimit ?? 0),
    aiUsageLimitMinutes: limitOverride?.aiUsageLimitMinutes ?? String(access?.aiUsageLimitMinutes ?? 0),
  }), [access?.aiUsageLimitMinutes, access?.userCreationLimit, enabledModuleIds, flags, limitOverride?.aiUsageLimitMinutes, limitOverride?.userCreationLimit]);
  const isDirty = Boolean(access) && isFormDirty(initialValues, currentValues);
  const submitDisabled = !isDirty || hasFieldErrors(errors);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    blurActiveElement();
    if (!isDirty) return;
    const formData = new FormData(event.currentTarget);
    const nextErrors = validateRequiredFields(readFormValues(event.currentTarget), [
      { key: "userCreationLimit", label: "User creation limit" },
      { key: "aiUsageLimitMinutes", label: "AI usage limit" },
    ]);
    const userCreationLimit = numberValue(formData, "userCreationLimit");
    const aiUsageLimitMinutes = numberValue(formData, "aiUsageLimitMinutes");
    if (!Number.isFinite(userCreationLimit) || userCreationLimit < 0) nextErrors.userCreationLimit = "Enter a valid user creation limit.";
    if (!Number.isFinite(aiUsageLimitMinutes) || aiUsageLimitMinutes < 0) nextErrors.aiUsageLimitMinutes = "Enter a valid AI usage limit.";
    if (hasFieldErrors(nextErrors)) {
      setErrors(nextErrors);
      focusFirstError(event.currentTarget, nextErrors);
      return;
    }
    try {
      await updateMutation.mutateAsync({
        ...flags,
        userCreationLimit,
        aiUsageLimitMinutes,
        enabledModuleIds,
      });
      setEnabledModuleOverride(null);
      setFlagOverride(null);
      setLimitOverride(null);
      setErrors({});
      toast.success("Access rules saved");
    } catch (error) {
      showApiErrorToast(error, "Could not save access rules");
    }
  }

  function toggleModule(moduleId: string, checked: boolean) {
    setEnabledModuleOverride((current) => {
      const base = current ?? enabledModuleIds;
      return checked ? Array.from(new Set([...base, moduleId])) : base.filter((id) => id !== moduleId);
    });
  }

  function toggleFlag(key: keyof AccessFlags, checked: boolean) {
    setFlagOverride((current) => ({ ...(current ?? flags), [key]: checked }));
  }

  function handleLimitChange(event: ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    setErrors((current) => clearFieldError(current, name));
    setLimitOverride((current) => ({ ...current, [name]: value }));
  }

  const isLoading = companyQuery.isLoading || accessQuery.isLoading || modulesQuery.isLoading;
  const isError = companyQuery.isError || accessQuery.isError || modulesQuery.isError;
  const company = companyQuery.data?.data;
  const modules = modulesQuery.data?.data ?? [];

  return (
    <div className="space-y-4 sm:space-y-6">
      <DashboardPageHeader title="Company Access Control" description={`Manage access and limits for ${company?.name ?? "company"}`} />
      {isLoading ? <MasterDetailSkeleton /> : null}
      {isError ? <DashboardCard><p className="p-5 text-sm text-muted-foreground">Could not load access settings.</p></DashboardCard> : null}
      {access ? (
        <DashboardCard>
          <CardContent className="p-4 sm:p-6">
            <form className="space-y-6" onSubmit={handleSubmit} noValidate>
              <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-3">
                {accessFlagLabels.map((item) => (
                  <ToggleCard
                    key={item.key}
                    label={item.label}
                    checked={flags[item.key]}
                    onCheckedChange={(checked) => toggleFlag(item.key, checked)}
                  />
                ))}
              </div>

              <div className="space-y-3 border-t border-border pt-4 sm:pt-6">
                <h2 className="font-semibold text-card-foreground">Enabled Modules</h2>
                <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-3">
                  {modules.length ? modules.map((module) => (
                    <div key={module.id} className="flex items-center justify-between gap-3 rounded-2xl border border-border bg-secondary/70 p-3 sm:p-4">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium">{module.name}</p>
                        <p className="hidden text-xs text-muted-foreground sm:block">{module.category}</p>
                      </div>
                      <Switch checked={enabledModuleIds.includes(module.id)} onCheckedChange={(checked) => toggleModule(module.id, checked)} />
                    </div>
                  )) : <p className="col-span-full rounded-2xl border border-dashed border-border bg-secondary/50 p-4 text-sm text-muted-foreground">No modules created yet.</p>}
                </div>
              </div>

              <div className="grid gap-3 border-t border-border pt-4 sm:gap-4 sm:pt-6 md:grid-cols-2">
                <FormField label="User Creation Limit" fieldName="userCreationLimit" error={errors.userCreationLimit}>
                  <Input id="user-limit" name="userCreationLimit" type="number" min={0} value={limitOverride?.userCreationLimit ?? String(access.userCreationLimit)} onChange={handleLimitChange} className="h-11 rounded-xl bg-secondary/70" aria-invalid={Boolean(errors.userCreationLimit)} />
                </FormField>
                <FormField label="AI Usage Limit" fieldName="aiUsageLimitMinutes" error={errors.aiUsageLimitMinutes}>
                  <Input id="ai-limit" name="aiUsageLimitMinutes" type="number" min={0} value={limitOverride?.aiUsageLimitMinutes ?? String(access.aiUsageLimitMinutes)} onChange={handleLimitChange} className="h-11 rounded-xl bg-secondary/70" aria-invalid={Boolean(errors.aiUsageLimitMinutes)} />
                </FormField>
              </div>

              <div className="flex justify-end">
                <Button type="submit" className="rounded-xl" disabled={updateMutation.isPending || submitDisabled}>{updateMutation.isPending ? "Saving..." : "Save Access Rules"}</Button>
              </div>
            </form>
          </CardContent>
        </DashboardCard>
      ) : null}
    </div>
  );
}

function ToggleCard({ label, checked, onCheckedChange }: { label: string; checked: boolean; onCheckedChange: (checked: boolean) => void }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-2xl border border-border bg-secondary/70 p-3 sm:p-4">
      <div className="min-w-0">
        <p className="text-sm font-medium">{label}</p>
        <p className="hidden text-xs text-muted-foreground sm:block">Company-level permission</p>
      </div>
      <Switch checked={checked} onCheckedChange={onCheckedChange} />
    </div>
  );
}

function numberValue(formData: FormData, key: string) {
  return Number(formData.get(key) || 0);
}

function defaultFlags(access?: Partial<AccessFlags> | null): AccessFlags {
  return {
    voiceLoggingEnabled: access?.voiceLoggingEnabled ?? false,
    aiStructuredExtractionEnabled: access?.aiStructuredExtractionEnabled ?? false,
    imageUploadEnabled: access?.imageUploadEnabled ?? false,
    captureDeviceLocationEnabled: access?.captureDeviceLocationEnabled ?? false,
    reportsEnabled: access?.reportsEnabled ?? false,
    exportEnabled: access?.exportEnabled ?? false,
  };
}

