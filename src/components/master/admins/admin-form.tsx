"use client";

import { useMemo, useState, type FormEvent, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { showApiErrorToast } from "@/lib/api/error-toast";

import { AssetUploadPanel } from "@/components/common/asset-upload-panel";
import { CardContent, DashboardCard } from "@/components/common/dashboard-ui";
import { FormActionBar } from "@/components/common/form-action-bar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useCreateAdmin, useUpdateAdmin } from "@/features/master-admins/api/admin.mutations";
import { useAdminCompanyOptions } from "@/features/master-admins/api/admin.queries";
import type { CreateAdminPayload, UpdateAdminPayload } from "@/features/master-admins/api/admin.types";
import type { ImageAssetValue } from "@/features/uploads/api/upload.types";
import { isPendingImageAsset } from "@/features/uploads/api/upload.types";
import { buildMultipartPayload } from "@/lib/api/multipart";
import { cn } from "@/lib/utils";

export type AdminFormValues = {
  fullName?: string;
  initials?: string;
  avatarAsset?: ImageAssetValue | null;
  avatarUrl?: string | null;
  avatarKey?: string | null;
  username?: string;
  email?: string;
  phone?: string;
  companyId?: string;
  role?: string;
  status?: string;
  requirePasswordReset?: boolean;
};

type AdminFormProps = { mode: "create" | "edit"; adminId?: string; values?: AdminFormValues };
const statuses = ["ACTIVE", "INACTIVE", "SUSPENDED"];
const roles = ["ADMIN", "PLANNER", "EXECUTION"];

export function AdminForm({ mode, adminId, values }: AdminFormProps) {
  const router = useRouter();
  const isEdit = mode === "edit";
  const companyOptions = useAdminCompanyOptions();
  const createMutation = useCreateAdmin();
  const updateMutation = useUpdateAdmin(adminId ?? "");
  const [avatarAsset, setAvatarAsset] = useState<ImageAssetValue | null>(() => values?.avatarAsset ?? (values?.avatarUrl ? { provider: "cloudinary", key: values.avatarKey ?? values.avatarUrl, url: values.avatarUrl, secureUrl: values.avatarUrl, mimeType: "image/*", bytes: 0 } : null));
  const uploadFileName = useMemo(() => values?.fullName?.trim().toLowerCase().replace(/\s+/g, "-"), [values?.fullName]);
  const companyItems = companyOptions.data?.data ?? [];
  const [selectedCompanyId, setSelectedCompanyId] = useState(values?.companyId ?? "");
  const selectedCompanyName = companyItems.find((company) => company.id === selectedCompanyId)?.name;
  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const basePayload: UpdateAdminPayload = {
      fullName: stringValue(formData, "fullName"),
      username: stringValue(formData, "username"),
      email: stringValue(formData, "email"),
      phone: stringValue(formData, "phone"),
      companyId: selectedCompanyId || stringValue(formData, "companyId"),
      role: stringValue(formData, "role"),
      status: stringValue(formData, "status"),
      requirePasswordReset: formData.get("requirePasswordReset") === "on",
      sendWelcomeEmail: formData.get("sendWelcomeEmail") === "on",
      avatarUrl: isPendingImageAsset(avatarAsset) ? values?.avatarUrl ?? null : avatarAsset?.secureUrl ?? avatarAsset?.url ?? null,
      avatarKey: isPendingImageAsset(avatarAsset) ? values?.avatarKey ?? null : avatarAsset?.key ?? null,
    };

    try {
      if (isEdit && adminId) {
        await updateMutation.mutateAsync(buildMultipartPayload(basePayload, isPendingImageAsset(avatarAsset) ? avatarAsset.file : null));
        toast.success("Admin updated");
        router.push(`/master/admins/${adminId}`);
      } else {
        const payload: CreateAdminPayload = {
          ...basePayload,
          temporaryPassword: stringValue(formData, "temporaryPassword"),
          confirmPassword: stringValue(formData, "confirmPassword"),
        } as CreateAdminPayload;
        await createMutation.mutateAsync(buildMultipartPayload(payload, isPendingImageAsset(avatarAsset) ? avatarAsset.file : null));
        toast.success("Admin created");
        router.push("/master/admins");
      }
    } catch (error) {
      showApiErrorToast(error, "Could not save admin");
    }
  }

  return (
    <DashboardCard>
      <CardContent className="p-4 sm:p-6">
        <form className="space-y-8 pb-36" onSubmit={handleSubmit}>
          <AssetUploadPanel title={values?.fullName ?? "Admin profile preview"} buttonLabel="Choose Avatar" folder="admins" context="admin-avatar" fileName={uploadFileName} initials={values?.initials ?? "AD"} value={avatarAsset} onChange={setAvatarAsset} />

          <div className="grid gap-6 lg:grid-cols-2">
            <Field label="Full Name"><Input name="fullName" defaultValue={values?.fullName} placeholder="Enter full name" className="h-11 rounded-xl bg-secondary/70" required /></Field>
            <Field label="Username"><Input name="username" defaultValue={values?.username} placeholder="john.doe" className="h-11 rounded-xl bg-secondary/70" required /></Field>
            <Field label="Email"><Input name="email" defaultValue={values?.email} placeholder="admin@company.com" type="email" className="h-11 rounded-xl bg-secondary/70" required /></Field>
            <Field label="Phone"><Input name="phone" defaultValue={values?.phone} placeholder="+91 98765 43210" className="h-11 rounded-xl bg-secondary/70" required /></Field>
            <Field label="Company"><Select name="companyId" value={selectedCompanyId} onValueChange={(value) => setSelectedCompanyId(value ?? "")}><SelectTrigger className="h-11 w-full rounded-xl bg-secondary/70"><span className="truncate">{selectedCompanyName ?? (selectedCompanyId ? "Loading company..." : "Select company")}</span></SelectTrigger><SelectContent>{companyItems.map((company) => <SelectItem key={company.id} value={company.id}>{company.name}</SelectItem>)}</SelectContent></Select></Field>
            <Field label="Role"><Select name="role" defaultValue={values?.role ?? "ADMIN"}><SelectTrigger className="h-11 w-full rounded-xl bg-secondary/70"><SelectValue placeholder="Select role" /></SelectTrigger><SelectContent>{roles.map((role) => <SelectItem key={role} value={role}>{label(role)}</SelectItem>)}</SelectContent></Select></Field>
            <Field label="Status"><Select name="status" defaultValue={values?.status ?? "ACTIVE"}><SelectTrigger className="h-11 w-full rounded-xl bg-secondary/70"><SelectValue placeholder="Select status" /></SelectTrigger><SelectContent>{statuses.map((status) => <SelectItem key={status} value={status}>{label(status)}</SelectItem>)}</SelectContent></Select></Field>
            {!isEdit ? <><Field label="Temporary Password"><Input name="temporaryPassword" placeholder="Set temporary password" type="password" className="h-11 rounded-xl bg-secondary/70" required /></Field><Field label="Confirm Password"><Input name="confirmPassword" placeholder="Confirm temporary password" type="password" className="h-11 rounded-xl bg-secondary/70" required /></Field></> : null}
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <ToggleCard title="Send Welcome Email" description="Notify the assigned company admin." control={<Switch name="sendWelcomeEmail" defaultChecked={!isEdit} />} />
            <ToggleCard title={isEdit ? "Require Password Reset" : "Force First Login Reset"} description="User will change password on the next sign-in." control={<Switch name="requirePasswordReset" defaultChecked={values?.requirePasswordReset ?? true} />} />
          </div>

          <FormActionBar cancelHref="/master/admins" submitLabel={isEdit ? "Update Admin" : "Create Admin"} submitIcon={isEdit ? "settings" : "plus"} isSubmitting={isSubmitting} />
        </form>
      </CardContent>
    </DashboardCard>
  );
}

function Field({ label, children, className }: { label: string; children: ReactNode; className?: string }) { return <div className={cn("space-y-2", className)}><Label>{label}</Label>{children}</div>; }
function ToggleCard({ title, description, control }: { title: string; description: string; control: ReactNode }) { return <div className="flex items-center justify-between gap-4 rounded-2xl border border-border bg-secondary/70 p-4"><div><p className="text-sm font-medium text-foreground">{title}</p><p className="mt-1 text-xs text-muted-foreground">{description}</p></div>{control}</div>; }
function stringValue(formData: FormData, key: string) { return String(formData.get(key) ?? "").trim(); }
function label(value: string) { return value.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase()); }





