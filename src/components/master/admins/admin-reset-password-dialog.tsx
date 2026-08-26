"use client";

import { useState, type FormEvent } from "react";
import { toast } from "sonner";

import { showApiErrorToast } from "@/lib/api/error-toast";

import { AppIcon } from "@/components/common/app-icon";
import { FormField } from "@/components/common/form-field";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { useResetAdminPassword } from "@/features/master-admins/api/admin.mutations";
import {
  blurActiveElement,
  clearFieldError,
  focusFirstError,
  hasFieldErrors,
  type FieldErrors,
} from "@/lib/forms/form-state";

type AdminResetPasswordDialogProps = { adminId: string; adminName: string; adminEmail?: string; open: boolean; onOpenChange: (open: boolean) => void };

export function AdminResetPasswordDialog({ adminId, adminName, adminEmail, open, onOpenChange }: AdminResetPasswordDialogProps) {
  const resetMutation = useResetAdminPassword(adminId);
  const [temporaryPassword, setTemporaryPassword] = useState("Vox@12345");
  const [confirmPassword, setConfirmPassword] = useState("Vox@12345");
  const [requireReset, setRequireReset] = useState(true);
  const [sendEmail, setSendEmail] = useState(true);
  const [errors, setErrors] = useState<FieldErrors>({});
  const passwordsReady = temporaryPassword.length >= 8 && temporaryPassword === confirmPassword;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    blurActiveElement();
    const nextErrors: FieldErrors = {};
    if (temporaryPassword.trim().length < 8) {
      nextErrors.temporaryPassword = "Temporary password must be at least 8 characters.";
    }
    if (confirmPassword.trim().length < 8) {
      nextErrors.confirmPassword = "Confirm password must be at least 8 characters.";
    } else if (temporaryPassword !== confirmPassword) {
      nextErrors.confirmPassword = "Passwords do not match.";
    }
    if (hasFieldErrors(nextErrors)) {
      setErrors(nextErrors);
      focusFirstError(event.currentTarget, nextErrors);
      return;
    }

    try {
      await resetMutation.mutateAsync({
        temporaryPassword,
        confirmPassword,
        requireResetOnNextLogin: requireReset,
        sendNotificationEmail: sendEmail,
      });
      toast.success("Password reset saved");
      onOpenChange(false);
    } catch (error) {
      showApiErrorToast(error, "Could not reset password");
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <form onSubmit={handleSubmit} noValidate>
          <DialogHeader><DialogTitle>Reset Admin Password</DialogTitle><DialogDescription>Create a temporary password for {adminName}{adminEmail ? ` (${adminEmail})` : ""}.</DialogDescription></DialogHeader>
          <div className="grid gap-4 py-4">
            <FormField label="Temporary Password" fieldName="temporaryPassword" error={errors.temporaryPassword}>
              <Input
                id="temporary-password"
                name="temporaryPassword"
                type="password"
                value={temporaryPassword}
                onChange={(event) => {
                  setTemporaryPassword(event.target.value);
                  setErrors((current) => clearFieldError(current, "temporaryPassword"));
                }}
                className="h-11 rounded-xl bg-secondary/70"
                minLength={8}
                aria-invalid={Boolean(errors.temporaryPassword)}
              />
            </FormField>
            <FormField label="Confirm Password" fieldName="confirmPassword" error={errors.confirmPassword}>
              <Input
                id="confirm-temporary-password"
                name="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(event) => {
                  setConfirmPassword(event.target.value);
                  setErrors((current) => clearFieldError(current, "confirmPassword"));
                }}
                className="h-11 rounded-xl bg-secondary/70"
                minLength={8}
                aria-invalid={Boolean(errors.confirmPassword)}
              />
            </FormField>
            <div className="flex items-center justify-between gap-4 rounded-xl border border-border bg-secondary/70 px-4 py-3"><div><p className="text-sm font-medium text-foreground">Require reset on next login</p><p className="text-xs text-muted-foreground">The admin must set a new password after signing in.</p></div><Switch checked={requireReset} onCheckedChange={setRequireReset} /></div>
            <div className="flex items-center justify-between gap-4 rounded-xl border border-border bg-secondary/70 px-4 py-3"><div><p className="text-sm font-medium text-foreground">Send notification email</p><p className="text-xs text-muted-foreground">Send reset instructions to the admin email.</p></div><Switch checked={sendEmail} onCheckedChange={setSendEmail} /></div>
          </div>
          <DialogFooter><DialogClose render={<Button variant="outline" className="rounded-xl" />}>Cancel</DialogClose><Button type="submit" className="rounded-xl" disabled={resetMutation.isPending || !passwordsReady || hasFieldErrors(errors)}><AppIcon name="permissions" className="size-4" />{resetMutation.isPending ? "Resetting..." : "Reset Password"}</Button></DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
