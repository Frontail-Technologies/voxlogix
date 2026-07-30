"use client";

import { useState, type FormEvent, type ReactNode } from "react";
import { toast } from "sonner";

import { AssetUploadPanel } from "@/components/common/asset-upload-panel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";
import {
  useCreateAdminUser,
  useUpdateAdminUser,
} from "@/features/admin-users/api/user.api";
import {
  adminUserRoles,
  adminUserStatuses,
  normalizeAdminUserValue,
} from "@/features/admin-users/user.presentation";
import type { AdminListItem } from "@/features/master-admins/api/admin.types";
import type { ImageAssetValue } from "@/features/uploads/api/upload.types";
import { isPendingImageAsset } from "@/features/uploads/api/upload.types";
import { showApiErrorToast } from "@/lib/api/error-toast";
import { buildMultipartPayload } from "@/lib/api/multipart";
import { cn } from "@/lib/utils";

type UserFormSheetMode = "create" | "edit" | "view";

type UserFormSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: UserFormSheetMode;
  user?: AdminListItem;
  companyId: string;
};

const modeTitles: Record<UserFormSheetMode, string> = {
  create: "Add User",
  edit: "Edit User",
  view: "User Details",
};

export function UserFormSheet({
  open,
  onOpenChange,
  mode,
  user,
  companyId,
}: UserFormSheetProps) {
  const readOnly = mode === "view";
  const createMutation = useCreateAdminUser();
  const updateMutation = useUpdateAdminUser(user?.id ?? "");
  const [requirePasswordReset, setRequirePasswordReset] = useState(true);
  const [sendWelcomeEmail, setSendWelcomeEmail] = useState(true);
  const [avatarAsset, setAvatarAsset] = useState<ImageAssetValue | null>(() =>
    user?.avatarUrl
      ? {
          provider: "cloudinary",
          key: user.avatarKey ?? user.avatarUrl,
          url: user.avatarUrl,
          secureUrl: user.avatarUrl,
          mimeType: "image/*",
          bytes: 0,
        }
      : null,
  );
  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (readOnly) return;

    const formData = new FormData(event.currentTarget);
    const fullName = stringValue(formData, "fullName");
    const payload = {
      fullName,
      username: stringValue(formData, "username"),
      email: stringValue(formData, "email"),
      phone: stringValue(formData, "phone"),
      companyId,
      role: stringValue(formData, "role") || "PLANNER",
      status: stringValue(formData, "status") || "ACTIVE",
      requirePasswordReset,
      sendWelcomeEmail,
      avatarUrl: isPendingImageAsset(avatarAsset) ? user?.avatarUrl ?? null : avatarAsset?.secureUrl ?? avatarAsset?.url ?? null,
      avatarKey: isPendingImageAsset(avatarAsset) ? user?.avatarKey ?? null : avatarAsset?.key ?? null,
    };
    const avatarFile = isPendingImageAsset(avatarAsset) ? avatarAsset.file : null;

    try {
      if (mode === "create") {
        await createMutation.mutateAsync(buildMultipartPayload({
          ...payload,
          temporaryPassword: stringValue(formData, "temporaryPassword"),
          confirmPassword: stringValue(formData, "confirmPassword"),
        }, avatarFile));
        toast.success(`${fullName} added`);
      } else if (user) {
        await updateMutation.mutateAsync(buildMultipartPayload(payload, avatarFile));
        toast.success(`${fullName} updated`);
      }
      onOpenChange(false);
    } catch (error) {
      showApiErrorToast(error, "Could not save user");
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="flex w-full flex-col overflow-y-auto sm:max-w-md">
        <SheetHeader>
          <SheetTitle>{modeTitles[mode]}</SheetTitle>
        </SheetHeader>

        <form className="flex min-h-0 flex-1 flex-col" onSubmit={handleSubmit}>
          <div className="flex-1 space-y-5 overflow-y-auto px-4 pb-4">
            {!readOnly ? (
              <AssetUploadPanel
                title={user?.fullName ?? "User avatar"}
                subtitle="Choose a profile photo for this user."
                buttonLabel="Choose Avatar"
                folder="admins"
                context="admin-avatar"
                fileName={user?.fullName ?? "user-avatar"}
                initials={user?.initials ?? "US"}
                value={avatarAsset}
                onChange={setAvatarAsset}
              />
            ) : null}

            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Full Name">
                <Input
                  name="fullName"
                  defaultValue={user?.fullName}
                  placeholder="Enter full name"
                  disabled={readOnly}
                  className="h-11 rounded-xl bg-secondary/70"
                  required
                />
              </Field>

              <Field label="Username">
                <Input
                  name="username"
                  defaultValue={user?.username}
                  placeholder="username"
                  disabled={readOnly}
                  className="h-11 rounded-xl bg-secondary/70"
                  required
                />
              </Field>

              <Field label="Email">
                <Input
                  name="email"
                  defaultValue={user?.email}
                  type="email"
                  placeholder="name@company.com"
                  disabled={readOnly}
                  className="h-11 rounded-xl bg-secondary/70"
                  required
                />
              </Field>

              <Field label="Phone">
                <Input
                  name="phone"
                  defaultValue={user?.phone}
                  placeholder="+91 98765 43210"
                  disabled={readOnly}
                  className="h-11 rounded-xl bg-secondary/70"
                  required
                />
              </Field>

              <Field label="Role">
                <Select
                  name="role"
                  defaultValue={normalizeAdminUserValue(user?.role) || "PLANNER"}
                  disabled={readOnly}
                >
                  <SelectTrigger className="h-11 w-full rounded-xl bg-secondary/70">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {adminUserRoles.map((role) => (
                      <SelectItem key={role.value} value={role.value}>
                        {role.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>

              <Field label="Status">
                <Select
                  name="status"
                  defaultValue={normalizeAdminUserValue(user?.status) || "ACTIVE"}
                  disabled={readOnly}
                >
                  <SelectTrigger className="h-11 w-full rounded-xl bg-secondary/70">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {adminUserStatuses.map((status) => (
                      <SelectItem key={status.value} value={status.value}>
                        {status.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
            </div>

            {readOnly && user ? (
              <div className="grid gap-3 sm:grid-cols-2">
                <ReadOnlyBlock label="Company" value={user.company.name} />
                <ReadOnlyBlock label="Last Login" value={user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleString() : "-"} />
              </div>
            ) : null}

            {mode === "create" ? (
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Temporary Password">
                  <Input
                    name="temporaryPassword"
                    type="password"
                    defaultValue="Vox@12345"
                    className="h-11 rounded-xl bg-secondary/70"
                    required
                  />
                </Field>
                <Field label="Confirm Password">
                  <Input
                    name="confirmPassword"
                    type="password"
                    defaultValue="Vox@12345"
                    className="h-11 rounded-xl bg-secondary/70"
                    required
                  />
                </Field>
              </div>
            ) : null}

            {!readOnly ? (
              <div className="space-y-3">
                <ToggleRow
                  title="Require password reset"
                  description="User must set a new password after signing in."
                  checked={requirePasswordReset}
                  onCheckedChange={setRequirePasswordReset}
                />
                <ToggleRow
                  title="Send welcome email"
                  description="Send account instructions to the user email."
                  checked={sendWelcomeEmail}
                  onCheckedChange={setSendWelcomeEmail}
                />
              </div>
            ) : null}
          </div>

          <SheetFooter className="border-t border-border">
            {readOnly ? (
              <Button
                type="button"
                variant="outline"
                className="rounded-xl"
                onClick={() => onOpenChange(false)}
              >
                Close
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1 rounded-xl"
                  onClick={() => onOpenChange(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1 rounded-xl"
                  disabled={isSubmitting}
                >
                  {isSubmitting
                    ? "Saving..."
                    : mode === "create"
                      ? "Add User"
                      : "Save Changes"}
                </Button>
              </div>
            )}
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}

function Field({
  label,
  children,
  className,
}: {
  label: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("space-y-2", className)}>
      <Label>{label}</Label>
      {children}
    </div>
  );
}

function ToggleRow({
  title,
  description,
  checked,
  onCheckedChange,
}: {
  title: string;
  description: string;
  checked: boolean;
  onCheckedChange: (value: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-2xl border border-border bg-secondary/70 p-3">
      <div className="min-w-0">
        <p className="text-sm font-medium text-foreground">{title}</p>
        <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>
      </div>
      <Switch checked={checked} onCheckedChange={onCheckedChange} />
    </div>
  );
}

function ReadOnlyBlock({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border bg-secondary/70 p-3">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 text-sm font-medium text-foreground">{value}</p>
    </div>
  );
}

function stringValue(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

