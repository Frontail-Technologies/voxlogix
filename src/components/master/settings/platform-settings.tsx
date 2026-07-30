"use client";

import { useState, type FormEvent, type ReactNode } from "react";
import { toast } from "sonner";

import { showApiErrorToast } from "@/lib/api/error-toast";

import { AppIcon } from "@/components/common/app-icon";
import { AssetUploadPanel } from "@/components/common/asset-upload-panel";
import { DeleteConfirmDialog } from "@/components/common/delete-confirm-dialog";
import { DashboardCard, DashboardPageHeader, StatusBadge } from "@/components/common/dashboard-ui";
import { MasterFormSkeleton } from "@/components/master/master-skeletons";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  useCreateAiProviderConfig,
  useDeleteAiProviderConfig,
  useSetAiProviderConfigDefault,
  useUpdateAiProviderConfig,
  useUpdateGeneralSettings,
} from "@/features/master-settings/api/settings.mutations";
import {
  useAiProviderConfigs,
  useGeneralSettings,
} from "@/features/master-settings/api/settings.queries";
import type {
  AiProviderConfig,
  GeneralSettings,
} from "@/features/master-settings/api/settings.types";
import {
  useCreateModuleType,
  useDeleteModuleType,
  useUpdateModuleType,
} from "@/features/master-module-types/api/module-type.mutations";
import { useModuleTypesList } from "@/features/master-module-types/api/module-type.queries";
import type { ModuleType } from "@/features/master-module-types/api/module-type.types";
import {
  useCreateModuleCategory,
  useDeleteModuleCategory,
  useUpdateModuleCategory,
} from "@/features/master-module-categories/api/module-category.mutations";
import { useModuleCategoriesList } from "@/features/master-module-categories/api/module-category.queries";
import type { ModuleCategory } from "@/features/master-module-categories/api/module-category.types";
import type { ImageAssetValue } from "@/features/uploads/api/upload.types";
import { isPendingImageAsset } from "@/features/uploads/api/upload.types";
import { buildMultipartPayload } from "@/lib/api/multipart";

const providerOptions = ["OpenAI", "Gemini", "Azure OpenAI", "Custom Provider"];
const providerModelOptions: Record<string, string[]> = {
  OpenAI: ["gpt-4.1-mini", "gpt-4.1", "gpt-4o-mini"],
  Gemini: ["gemini-flash-latest", "gemini-flash-lite-latest", "gemini-pro-latest"],
  "Azure OpenAI": ["gpt-4.1-mini", "gpt-4.1"],
  "Custom Provider": [],
};
const keyStatusOptions = ["Active", "Testing", "Disabled"];

export function PlatformSettings() {
  const generalQuery = useGeneralSettings();
  const aiQuery = useAiProviderConfigs();
  const generalSettings = generalQuery.data?.data;
  const aiConfigs = aiQuery.data?.data;

  return (
    <div className="space-y-4 sm:space-y-6">
      <DashboardPageHeader
        title="Settings"
        description="Manage platform identity, maintenance mode, and AI defaults"
      />

      <Tabs defaultValue="general" className="gap-4">
        <div className="-mx-1 overflow-x-auto px-1 pb-1">
        <TabsList className="h-10 min-w-max justify-start rounded-xl">
          <TabsTrigger value="general" className="shrink-0 rounded-lg px-4">
            General
          </TabsTrigger>
          <TabsTrigger value="ai" className="shrink-0 rounded-lg px-4">
            AI Settings
          </TabsTrigger>
          <TabsTrigger value="module-types" className="shrink-0 rounded-lg px-4">
            Module Types
          </TabsTrigger>
          <TabsTrigger value="module-categories" className="shrink-0 rounded-lg px-4">
            Module Categories
          </TabsTrigger>
        </TabsList>
        </div>
        <TabsContent value="general">
          {generalQuery.isLoading ? <MasterFormSkeleton /> : null}
          {generalQuery.isError ? (
            <DashboardCard>
              <p className="p-5 text-sm text-muted-foreground">Could not load general settings.</p>
            </DashboardCard>
          ) : null}
          {generalSettings ? (
            <DashboardCard>
              <GeneralSettingsPanel key={`${generalSettings.id}-${generalSettings.updatedAt}`} settings={generalSettings} />
            </DashboardCard>
          ) : null}
        </TabsContent>
        <TabsContent value="ai">
          {aiQuery.isLoading ? <MasterFormSkeleton /> : null}
          {aiQuery.isError ? (
            <DashboardCard>
              <p className="p-5 text-sm text-muted-foreground">Could not load AI settings.</p>
            </DashboardCard>
          ) : null}
          {aiConfigs ? <AiProviderConfigsPanel configs={aiConfigs} /> : null}
        </TabsContent>
        <TabsContent value="module-types">
          <ModuleTypesPanel />
        </TabsContent>
        <TabsContent value="module-categories">
          <ModuleCategoriesPanel />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function GeneralSettingsPanel({ settings }: { settings: GeneralSettings }) {
  const updateMutation = useUpdateGeneralSettings();
  const [logoAsset, setLogoAsset] = useState<ImageAssetValue | null>(() =>
    settings.logoUrl && settings.logoKey
      ? {
          provider: "cloudinary",
          key: settings.logoKey,
          url: settings.logoUrl,
          secureUrl: settings.logoUrl,
          mimeType: "image/*",
          bytes: 0,
        }
      : null,
  );
  const [maintenanceMessage, setMaintenanceMessage] = useState(settings.maintenanceMessage);
  const [maintenanceModeEnabled, setMaintenanceModeEnabled] = useState(
    settings.maintenanceModeEnabled,
  );

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      await updateMutation.mutateAsync(buildMultipartPayload({
        platformName: settings.platformName,
        logoUrl: isPendingImageAsset(logoAsset) ? settings.logoUrl : logoAsset?.secureUrl ?? logoAsset?.url ?? null,
        logoKey: isPendingImageAsset(logoAsset) ? settings.logoKey : logoAsset?.key ?? null,
        maintenanceModeEnabled,
        maintenanceMessage: maintenanceMessage.trim(),
      }, isPendingImageAsset(logoAsset) ? logoAsset.file : null));
      toast.success("General settings saved");
    } catch (error) {
      showApiErrorToast(error, "Could not save general settings");
    }
  }

  return (
    <CardContent className="p-4 sm:p-6">
      <form className="space-y-6" onSubmit={handleSubmit}>
        <div className="grid gap-6 xl:grid-cols-2">
          <div className="xl:col-span-2">
            <Label>Platform Logo</Label>
            <AssetUploadPanel
              className="mt-2"
              title={settings.platformName || "VoxLogiX"}
              buttonLabel="Choose Logo"
              folder="platform"
              context="generic-image"
              fileName="platform-logo"
              initials="VX"
              value={logoAsset}
              onChange={setLogoAsset}
            />
          </div>

          <ToggleCard
            title="Maintenance Mode"
            description="Temporarily show users that the platform is unavailable."
            checked={maintenanceModeEnabled}
            onCheckedChange={setMaintenanceModeEnabled}
          />

          <Field label="Maintenance Message" className="xl:col-span-2">
            <Textarea
              name="maintenanceMessage"
              value={maintenanceMessage}
              onChange={(event) => setMaintenanceMessage(event.target.value)}
              className="min-h-24 rounded-xl bg-secondary/70"
              placeholder="We are performing scheduled maintenance. Please check back soon."
              required
            />
          </Field>
        </div>

        <div className="flex justify-end">
          <Button type="submit" className="rounded-xl" disabled={updateMutation.isPending}>
            {updateMutation.isPending ? "Saving..." : "Save General Settings"}
          </Button>
        </div>
      </form>
    </CardContent>
  );
}

function maskApiKey(apiKey: string) {
  if (apiKey.length <= 8) return "••••••••";
  return `${apiKey.slice(0, 4)}${"•".repeat(10)}${apiKey.slice(-4)}`;
}

function AiProviderConfigsPanel({ configs }: { configs: AiProviderConfig[] }) {
  const deleteMutation = useDeleteAiProviderConfig();
  const setDefaultMutation = useSetAiProviderConfigDefault();
  const [formOpen, setFormOpen] = useState(false);
  const [editingConfig, setEditingConfig] = useState<AiProviderConfig | null>(null);
  const [deletingConfig, setDeletingConfig] = useState<AiProviderConfig | null>(null);

  async function handleDelete(configId: string) {
    try {
      await deleteMutation.mutateAsync(configId);
      toast.success("AI provider deleted");
    } catch (error) {
      showApiErrorToast(error, "Could not delete AI provider");
    }
  }

  async function handleSetDefault(configId: string) {
    try {
      await setDefaultMutation.mutateAsync(configId);
      toast.success("Default AI provider updated");
    } catch (error) {
      showApiErrorToast(error, "Could not set default AI provider");
    }
  }

  function openCreate() {
    setEditingConfig(null);
    setFormOpen(true);
  }

  function openEdit(config: AiProviderConfig) {
    setEditingConfig(config);
    setFormOpen(true);
  }

  return (
    <div className="space-y-3">
      <DashboardCard>
        <CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div>
            <p className="font-medium text-foreground">AI Providers</p>
          </div>
          <Button type="button" className="rounded-xl" onClick={openCreate}>
            <AppIcon name="plus" className="size-4" />
            Add Provider
          </Button>
        </CardContent>
      </DashboardCard>

      {configs.length ? (
        <div className="space-y-3">
          {configs.map((config) => (
            <DashboardCard key={config.id}>
              <CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
                <div className="flex min-w-0 flex-wrap items-center gap-3">
                  <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/12 text-primary">
                    <AppIcon name="ai" className="size-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-medium text-foreground">{config.provider}</p>
                      <StatusBadge status={config.keyStatus} />
                      {config.isDefault ? (
                        <Badge className="rounded-full bg-primary/15 text-primary">Default</Badge>
                      ) : null}
                    </div>
                    <p className="text-sm text-muted-foreground">{config.defaultModel}</p>
                    <p className="text-xs text-muted-foreground">
                      {config.apiKeyName} · {maskApiKey(config.apiKey)}
                    </p>
                  </div>
                </div>
                <div className="flex shrink-0 flex-wrap gap-2">
                  {!config.isDefault ? (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="rounded-xl"
                      disabled={setDefaultMutation.isPending}
                      onClick={() => void handleSetDefault(config.id)}
                    >
                      <AppIcon name="status" className="size-4" />
                      Set Default
                    </Button>
                  ) : null}
                  <Button type="button" variant="outline" size="sm" className="rounded-xl" onClick={() => openEdit(config)}>
                    <AppIcon name="settings" className="size-4" />
                    Edit
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="rounded-xl text-destructive hover:text-destructive"
                    onClick={() => setDeletingConfig(config)}
                  >
                    <AppIcon name="trash" className="size-4" />
                    Delete
                  </Button>
                </div>
              </CardContent>
            </DashboardCard>
          ))}
        </div>
      ) : (
        <DashboardCard>
          <p className="p-8 text-center text-sm text-muted-foreground">
            No AI providers configured yet. Add one to enable AI extraction and chat.
          </p>
        </DashboardCard>
      )}

      <AiProviderConfigDialog
        key={editingConfig?.id ?? "create"}
        open={formOpen}
        onOpenChange={setFormOpen}
        config={editingConfig}
      />

      <DeleteConfirmDialog
        open={Boolean(deletingConfig)}
        onOpenChange={(open) => !open && setDeletingConfig(null)}
        title="Delete AI provider?"
        description={`This will remove "${deletingConfig?.apiKeyName ?? ""}" (${deletingConfig?.provider ?? ""}). AI features will stop using this config immediately.`}
        confirmLabel="Delete"
        onConfirm={() => {
          if (deletingConfig) {
            void handleDelete(deletingConfig.id);
          }
        }}
      />
    </div>
  );
}

function AiProviderConfigDialog({
  open,
  onOpenChange,
  config,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  config: AiProviderConfig | null;
}) {
  const isEditing = Boolean(config);
  const createMutation = useCreateAiProviderConfig();
  const updateMutation = useUpdateAiProviderConfig(config?.id ?? "");
  const [showApiKey, setShowApiKey] = useState(false);
  const [provider, setProvider] = useState(config?.provider ?? providerOptions[0]);
  const [structuredExtractionEnabled, setStructuredExtractionEnabled] = useState(
    config?.structuredExtractionEnabled ?? true,
  );
  const [usageCostAlertsEnabled, setUsageCostAlertsEnabled] = useState(
    config?.usageCostAlertsEnabled ?? true,
  );

  const isPending = createMutation.isPending || updateMutation.isPending;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    const payload = {
      provider,
      defaultModel: stringValue(formData, "defaultModel"),
      apiKeyName: stringValue(formData, "apiKeyName"),
      apiKey: stringValue(formData, "apiKey"),
      keyStatus: stringValue(formData, "keyStatus"),
      structuredExtractionEnabled,
      usageCostAlertsEnabled,
    };

    try {
      if (isEditing && config) {
        await updateMutation.mutateAsync(payload);
        toast.success("AI provider updated");
      } else {
        await createMutation.mutateAsync(payload);
        toast.success("AI provider added");
      }
      onOpenChange(false);
    } catch (error) {
      showApiErrorToast(error, isEditing ? "Could not update AI provider" : "Could not add AI provider");
    }
  }

  const modelSuggestions = providerModelOptions[provider] ?? [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{isEditing ? "Edit AI Provider" : "Add AI Provider"}</DialogTitle>
            <DialogDescription>
              {isEditing ? "Update this provider's model, key, and status." : "Register a new AI provider config."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Field label="AI Provider">
              <Select value={provider} onValueChange={(value) => value && setProvider(value)}>
                <SelectTrigger className="h-11 w-full rounded-xl bg-secondary/70"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {providerOptions.map((option) => (
                    <SelectItem key={option} value={option}>{option}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <Field label="Default Model">
              <Input
                name="defaultModel"
                defaultValue={config?.defaultModel}
                placeholder={modelSuggestions[0] ?? "model-name"}
                list="ai-model-suggestions"
                className="h-11 rounded-xl bg-secondary/70"
                required
              />
              <datalist id="ai-model-suggestions">
                {modelSuggestions.map((model) => (
                  <option key={model} value={model} />
                ))}
              </datalist>
            </Field>
            <Field label="API Key Name">
              <Input name="apiKeyName" defaultValue={config?.apiKeyName} className="h-11 rounded-xl bg-secondary/70" required />
            </Field>
            <Field label="API Key">
              <div className="relative">
                <Input
                  name="apiKey"
                  type={showApiKey ? "text" : "password"}
                  defaultValue={config?.apiKey}
                  className="h-11 rounded-xl bg-secondary/70 pr-11"
                  minLength={8}
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  className="absolute right-2 top-1/2 size-7 -translate-y-1/2 rounded-md border-0 bg-transparent p-0 text-muted-foreground shadow-none hover:bg-transparent hover:text-foreground focus-visible:ring-0"
                  onClick={() => setShowApiKey((value) => !value)}
                >
                  <AppIcon name={showApiKey ? "eye-off" : "eye"} className="size-4" />
                  <span className="sr-only">{showApiKey ? "Hide API key" : "Show API key"}</span>
                </Button>
              </div>
            </Field>
            <Field label="Key Status">
              <Select name="keyStatus" defaultValue={config?.keyStatus ?? "Testing"}>
                <SelectTrigger className="h-11 w-full rounded-xl bg-secondary/70"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {keyStatusOptions.map((status) => (
                    <SelectItem key={status} value={status}>{status}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <ToggleCard title="AI Structured Extraction" description="Use this provider for structured log extraction." checked={structuredExtractionEnabled} onCheckedChange={setStructuredExtractionEnabled} />
            <ToggleCard title="Usage Cost Alerts" description="Notify Master when usage crosses limits." checked={usageCostAlertsEnabled} onCheckedChange={setUsageCostAlertsEnabled} />
          </div>
          <DialogFooter>
            <DialogClose render={<Button type="button" variant="outline" className="rounded-xl" />}>Cancel</DialogClose>
            <Button type="submit" className="rounded-xl" disabled={isPending}>
              {isPending ? "Saving..." : isEditing ? "Save Changes" : "Add Provider"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function ModuleTypesPanel() {
  const { data, isLoading, isError } = useModuleTypesList({ limit: 100 });
  const moduleTypes = data?.data ?? [];
  const deleteMutation = useDeleteModuleType();
  const [formOpen, setFormOpen] = useState(false);
  const [editingType, setEditingType] = useState<ModuleType | null>(null);
  const [deletingType, setDeletingType] = useState<ModuleType | null>(null);

  async function handleDelete(moduleTypeId: string) {
    try {
      await deleteMutation.mutateAsync(moduleTypeId);
      toast.success("Module type deleted");
    } catch (error) {
      showApiErrorToast(error, "Could not delete module type");
    }
  }

  function openCreate() {
    setEditingType(null);
    setFormOpen(true);
  }

  function openEdit(moduleType: ModuleType) {
    setEditingType(moduleType);
    setFormOpen(true);
  }

  return (
    <div className="space-y-3">
      <DashboardCard>
        <CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div>
            <p className="font-medium text-foreground">Module Types</p>
          </div>
          <Button type="button" className="rounded-xl" onClick={openCreate}>
            <AppIcon name="plus" className="size-4" />
            Add Module Type
          </Button>
        </CardContent>
      </DashboardCard>

      {isLoading ? <MasterFormSkeleton /> : null}
      {isError ? (
        <DashboardCard>
          <p className="p-5 text-sm text-muted-foreground">Could not load module types.</p>
        </DashboardCard>
      ) : null}

      {!isLoading && !isError ? (
        moduleTypes.length ? (
          <div className="space-y-3">
            {moduleTypes.map((moduleType) => (
              <DashboardCard key={moduleType.id}>
                <CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-medium text-foreground">{moduleType.name}</p>
                      <StatusBadge status={moduleType.status} />
                    </div>
                    {moduleType.description ? (
                      <p className="text-sm text-muted-foreground">{moduleType.description}</p>
                    ) : null}
                  </div>
                  <div className="flex shrink-0 gap-2">
                    <Button type="button" variant="outline" size="sm" className="rounded-xl" onClick={() => openEdit(moduleType)}>
                      <AppIcon name="settings" className="size-4" />
                      Edit
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="rounded-xl text-destructive hover:text-destructive"
                      onClick={() => setDeletingType(moduleType)}
                    >
                      <AppIcon name="trash" className="size-4" />
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </DashboardCard>
            ))}
          </div>
        ) : (
          <DashboardCard>
            <p className="p-8 text-center text-sm text-muted-foreground">
              No module types configured yet. Add one to make it available on the module form.
            </p>
          </DashboardCard>
        )
      ) : null}

      <ModuleTypeDialog
        key={editingType?.id ?? "create"}
        open={formOpen}
        onOpenChange={setFormOpen}
        moduleType={editingType}
      />

      <DeleteConfirmDialog
        open={Boolean(deletingType)}
        onOpenChange={(open) => !open && setDeletingType(null)}
        title="Delete module type?"
        description={`This will remove "${deletingType?.name ?? ""}". Modules already using this type will need to be reassigned first.`}
        confirmLabel="Delete"
        onConfirm={() => {
          if (deletingType) {
            void handleDelete(deletingType.id);
          }
        }}
      />
    </div>
  );
}

function ModuleTypeDialog({
  open,
  onOpenChange,
  moduleType,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  moduleType: ModuleType | null;
}) {
  const isEditing = Boolean(moduleType);
  const createMutation = useCreateModuleType();
  const updateMutation = useUpdateModuleType(moduleType?.id ?? "");
  const [status, setStatus] = useState(moduleType?.status ?? "ACTIVE");

  const isPending = createMutation.isPending || updateMutation.isPending;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    const payload = {
      name: stringValue(formData, "name"),
      description: stringValue(formData, "description") || undefined,
      status,
    };

    try {
      if (isEditing && moduleType) {
        await updateMutation.mutateAsync(payload);
        toast.success("Module type updated");
      } else {
        await createMutation.mutateAsync(payload);
        toast.success("Module type added");
      }
      onOpenChange(false);
    } catch (error) {
      showApiErrorToast(error, isEditing ? "Could not update module type" : "Could not add module type");
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{isEditing ? "Edit Module Type" : "Add Module Type"}</DialogTitle>
            <DialogDescription>
              {isEditing ? "Update this module type's name, description, or status." : "Register a new module type."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Field label="Name">
              <Input name="name" defaultValue={moduleType?.name} placeholder="Equipment Log" className="h-11 rounded-xl bg-secondary/70" required />
            </Field>
            <Field label="Description">
              <Textarea name="description" defaultValue={moduleType?.description ?? undefined} placeholder="What kind of modules use this type..." className="min-h-20 rounded-xl bg-secondary/70" />
            </Field>
            <Field label="Status">
              <Select value={status} onValueChange={(value) => value && setStatus(value)}>
                <SelectTrigger className="h-11 w-full rounded-xl bg-secondary/70"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="ACTIVE">Active</SelectItem>
                  <SelectItem value="INACTIVE">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </Field>
          </div>
          <DialogFooter>
            <DialogClose render={<Button type="button" variant="outline" className="rounded-xl" />}>Cancel</DialogClose>
            <Button type="submit" className="rounded-xl" disabled={isPending}>
              {isPending ? "Saving..." : isEditing ? "Save Changes" : "Add Module Type"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function ModuleCategoriesPanel() {
  const { data, isLoading, isError } = useModuleCategoriesList({ limit: 100 });
  const moduleCategories = data?.data ?? [];
  const deleteMutation = useDeleteModuleCategory();
  const [formOpen, setFormOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<ModuleCategory | null>(null);
  const [deletingCategory, setDeletingCategory] = useState<ModuleCategory | null>(null);

  async function handleDelete(moduleCategoryId: string) {
    try {
      await deleteMutation.mutateAsync(moduleCategoryId);
      toast.success("Module category deleted");
    } catch (error) {
      showApiErrorToast(error, "Could not delete module category");
    }
  }

  function openCreate() {
    setEditingCategory(null);
    setFormOpen(true);
  }

  function openEdit(moduleCategory: ModuleCategory) {
    setEditingCategory(moduleCategory);
    setFormOpen(true);
  }

  return (
    <div className="space-y-3">
      <DashboardCard>
        <CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div>
            <p className="font-medium text-foreground">Module Categories</p>
          </div>
          <Button type="button" className="rounded-xl" onClick={openCreate}>
            <AppIcon name="plus" className="size-4" />
            Add Category
          </Button>
        </CardContent>
      </DashboardCard>

      {isLoading ? <MasterFormSkeleton /> : null}
      {isError ? (
        <DashboardCard>
          <p className="p-5 text-sm text-muted-foreground">Could not load module categories.</p>
        </DashboardCard>
      ) : null}

      {!isLoading && !isError ? (
        moduleCategories.length ? (
          <div className="space-y-3">
            {moduleCategories.map((moduleCategory) => (
              <DashboardCard key={moduleCategory.id}>
                <CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-medium text-foreground">{moduleCategory.name}</p>
                      <StatusBadge status={moduleCategory.status} />
                    </div>
                    {moduleCategory.description ? (
                      <p className="text-sm text-muted-foreground">{moduleCategory.description}</p>
                    ) : null}
                  </div>
                  <div className="flex shrink-0 gap-2">
                    <Button type="button" variant="outline" size="sm" className="rounded-xl" onClick={() => openEdit(moduleCategory)}>
                      <AppIcon name="settings" className="size-4" />
                      Edit
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="rounded-xl text-destructive hover:text-destructive"
                      onClick={() => setDeletingCategory(moduleCategory)}
                    >
                      <AppIcon name="trash" className="size-4" />
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </DashboardCard>
            ))}
          </div>
        ) : (
          <DashboardCard>
            <p className="p-8 text-center text-sm text-muted-foreground">
              No module categories configured yet. Add one to make it available on the module form.
            </p>
          </DashboardCard>
        )
      ) : null}

      <ModuleCategoryDialog
        key={editingCategory?.id ?? "create"}
        open={formOpen}
        onOpenChange={setFormOpen}
        moduleCategory={editingCategory}
      />

      <DeleteConfirmDialog
        open={Boolean(deletingCategory)}
        onOpenChange={(open) => !open && setDeletingCategory(null)}
        title="Delete module category?"
        description={`This will remove "${deletingCategory?.name ?? ""}". Modules already using this category must be reassigned first.`}
        confirmLabel="Delete"
        onConfirm={() => {
          if (deletingCategory) {
            void handleDelete(deletingCategory.id);
          }
        }}
      />
    </div>
  );
}

function ModuleCategoryDialog({
  open,
  onOpenChange,
  moduleCategory,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  moduleCategory: ModuleCategory | null;
}) {
  const isEditing = Boolean(moduleCategory);
  const createMutation = useCreateModuleCategory();
  const updateMutation = useUpdateModuleCategory(moduleCategory?.id ?? "");
  const [status, setStatus] = useState(moduleCategory?.status ?? "ACTIVE");

  const isPending = createMutation.isPending || updateMutation.isPending;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    const payload = {
      name: stringValue(formData, "name"),
      description: stringValue(formData, "description") || undefined,
      status,
    };

    try {
      if (isEditing && moduleCategory) {
        await updateMutation.mutateAsync(payload);
        toast.success("Module category updated");
      } else {
        await createMutation.mutateAsync(payload);
        toast.success("Module category added");
      }
      onOpenChange(false);
    } catch (error) {
      showApiErrorToast(error, isEditing ? "Could not update module category" : "Could not add module category");
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{isEditing ? "Edit Module Category" : "Add Module Category"}</DialogTitle>
            <DialogDescription>
              {isEditing ? "Update this module category." : "Create a reusable category for modules."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Field label="Name">
              <Input name="name" defaultValue={moduleCategory?.name} placeholder="Operational" className="h-11 rounded-xl bg-secondary/70" required />
            </Field>
            <Field label="Description">
              <Textarea name="description" defaultValue={moduleCategory?.description ?? undefined} placeholder="Where this category should be used..." className="min-h-20 rounded-xl bg-secondary/70" />
            </Field>
            <Field label="Status">
              <Select value={status} onValueChange={(value) => value && setStatus(value)}>
                <SelectTrigger className="h-11 w-full rounded-xl bg-secondary/70"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="ACTIVE">Active</SelectItem>
                  <SelectItem value="INACTIVE">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </Field>
          </div>
          <DialogFooter>
            <DialogClose render={<Button type="button" variant="outline" className="rounded-xl" />}>Cancel</DialogClose>
            <Button type="submit" className="rounded-xl" disabled={isPending}>
              {isPending ? "Saving..." : isEditing ? "Save Changes" : "Add Category"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function Field({ label, children, className }: { label: string; children: ReactNode; className?: string }) {
  return <div className={className ? `space-y-2 ${className}` : "space-y-2"}><Label>{label}</Label>{children}</div>;
}

function ToggleCard({ title, description, checked, onCheckedChange }: { title: string; description: string; checked: boolean; onCheckedChange: (checked: boolean) => void }) {
  return <div className="flex items-center justify-between gap-4 rounded-xl bg-secondary/70 px-4 py-3"><div><p className="text-sm font-medium">{title}</p><p className="text-xs text-muted-foreground">{description}</p></div><Switch checked={checked} onCheckedChange={onCheckedChange} /></div>;
}

function stringValue(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}
