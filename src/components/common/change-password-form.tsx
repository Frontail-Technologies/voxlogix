"use client";

import { useState } from "react";
import { toast } from "sonner";

import { CardContent, CardHeader, CardTitle, DashboardCard } from "@/components/common/dashboard-ui";
import { FormField } from "@/components/common/form-field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useChangePassword } from "@/features/auth/api/auth.mutations";
import { showApiErrorToast } from "@/lib/api/error-toast";
import { blurActiveElement, type FieldErrors } from "@/lib/forms/form-state";

export function ChangePasswordForm() {
  const changePasswordMutation = useChangePassword();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [errors, setErrors] = useState<FieldErrors>({});

  const passwordsMatch = newPassword.length > 0 && newPassword === confirmNewPassword;
  const canSubmit = currentPassword.length > 0 && newPassword.length >= 8 && passwordsMatch && Object.keys(errors).length === 0;

  function updateField(field: "currentPassword" | "newPassword" | "confirmNewPassword", value: string) {
    if (field === "currentPassword") setCurrentPassword(value);
    if (field === "newPassword") setNewPassword(value);
    if (field === "confirmNewPassword") setConfirmNewPassword(value);
    setErrors((current) => {
      const next = { ...current };
      delete next[field];
      return next;
    });
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    blurActiveElement();
    const nextErrors: FieldErrors = {};
    if (!currentPassword.trim()) nextErrors.currentPassword = "Current password is required.";
    if (!newPassword.trim()) nextErrors.newPassword = "New password is required.";
    else if (newPassword.length < 8) nextErrors.newPassword = "New password must be at least 8 characters.";
    if (!confirmNewPassword.trim()) nextErrors.confirmNewPassword = "Confirm password is required.";
    else if (newPassword !== confirmNewPassword) nextErrors.confirmNewPassword = "Passwords do not match.";
    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors);
      return;
    }

    try {
      await changePasswordMutation.mutateAsync({ currentPassword, newPassword });
      toast.success("Password updated successfully");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
      setErrors({});
    } catch (error) {
      showApiErrorToast(error, "Could not update password");
    }
  }

  return (
    <DashboardCard>
      <CardHeader className="px-4 py-3 sm:px-5 sm:py-4">
        <CardTitle>Change Password</CardTitle>
      </CardHeader>
      <CardContent className="px-4 pb-4 pt-1 sm:px-5 sm:pb-5 sm:pt-2">
        <form className="space-y-4" onSubmit={(event) => void handleSubmit(event)}>
          <FormField label="Current Password" error={errors.currentPassword}>
            <Input
              id="current-password"
              type="password"
              value={currentPassword}
              onChange={(event) => updateField("currentPassword", event.target.value)}
              className="h-11 rounded-xl bg-secondary/70"
              autoComplete="current-password"
              aria-invalid={Boolean(errors.currentPassword)}
            />
          </FormField>
          <FormField label="New Password" error={errors.newPassword}>
            <Input
              id="new-password"
              type="password"
              value={newPassword}
              onChange={(event) => updateField("newPassword", event.target.value)}
              className="h-11 rounded-xl bg-secondary/70"
              autoComplete="new-password"
              aria-invalid={Boolean(errors.newPassword)}
            />
          </FormField>
          <FormField label="Confirm New Password" error={errors.confirmNewPassword}>
            <Input
              id="confirm-new-password"
              type="password"
              value={confirmNewPassword}
              onChange={(event) => updateField("confirmNewPassword", event.target.value)}
              className="h-11 rounded-xl bg-secondary/70"
              autoComplete="new-password"
              aria-invalid={Boolean(errors.confirmNewPassword)}
            />
            {newPassword && confirmNewPassword && !passwordsMatch && !errors.confirmNewPassword ? (
              <p className="text-xs text-destructive">Passwords do not match.</p>
            ) : null}
          </FormField>
          <Button type="submit" className="w-full rounded-xl sm:w-auto" disabled={!canSubmit || changePasswordMutation.isPending}>
            {changePasswordMutation.isPending ? "Updating..." : "Update Password"}
          </Button>
        </form>
      </CardContent>
    </DashboardCard>
  );
}
