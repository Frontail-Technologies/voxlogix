"use client";

import { useState, type FormEvent } from "react";
import { toast } from "sonner";

import { DashboardCard, DashboardPageHeader } from "@/components/common/dashboard-ui";
import { MasterDetailSkeleton } from "@/components/master/master-skeletons";
import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useUpdateCompanyAccess } from "@/features/master-companies/api/company.mutations";
import { useCompanyAccess, useCompanyDetail } from "@/features/master-companies/api/company.queries";
import { useModulesList } from "@/features/master-modules/api/module.queries";
import { showApiErrorToast } from "@/lib/api/error-toast";

type AccessFlags = {
  voiceLoggingEnabled: boolean;
  aiStructuredExtractionEnabled: boolean;
  imageUploadEnabled: boolean;
  reportsEnabled: boolean;
  exportEnabled: boolean;
};

const accessFlagLabels: Array<{ key: keyof AccessFlags; label: string }> = [
  { key: "voiceLoggingEnabled", label: "Voice Logging" },
  { key: "aiStructuredExtractionEnabled", label: "AI Extraction" },
  { key: "imageUploadEnabled", label: "Image Upload" },
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
  const enabledModuleIds = enabledModuleOverride ?? access?.enabledModuleIds ?? [];
  const flags: AccessFlags = flagOverride ?? {
    voiceLoggingEnabled: access?.voiceLoggingEnabled ?? false,
    aiStructuredExtractionEnabled: access?.aiStructuredExtractionEnabled ?? false,
    imageUploadEnabled: access?.imageUploadEnabled ?? false,
    reportsEnabled: access?.reportsEnabled ?? false,
    exportEnabled: access?.exportEnabled ?? false,
  };

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    try {
      await updateMutation.mutateAsync({
        ...flags,
        userCreationLimit: numberValue(formData, "userCreationLimit"),
        aiUsageLimitMinutes: numberValue(formData, "aiUsageLimitMinutes"),
        enabledModuleIds,
      });
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
            <form className="space-y-6" onSubmit={handleSubmit}>
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
                <div className="space-y-2">
                  <Label htmlFor="user-limit">User Creation Limit</Label>
                  <Input id="user-limit" name="userCreationLimit" type="number" defaultValue={access.userCreationLimit} className="h-11 rounded-xl bg-secondary/70" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ai-limit">AI Usage Limit</Label>
                  <Input id="ai-limit" name="aiUsageLimitMinutes" type="number" defaultValue={access.aiUsageLimitMinutes} className="h-11 rounded-xl bg-secondary/70" />
                </div>
              </div>

              <div className="flex justify-end">
                <Button type="submit" className="rounded-xl" disabled={updateMutation.isPending}>{updateMutation.isPending ? "Saving..." : "Save Access Rules"}</Button>
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

