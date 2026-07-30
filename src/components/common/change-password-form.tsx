"use client";

import { useState } from "react";
import { toast } from "sonner";

import { CardContent, CardHeader, CardTitle, DashboardCard } from "@/components/common/dashboard-ui";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useChangePassword } from "@/features/auth/api/auth.mutations";
import { showApiErrorToast } from "@/lib/api/error-toast";

export function ChangePasswordForm() {
  const changePasswordMutation = useChangePassword();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  const passwordsMatch = newPassword.length > 0 && newPassword === confirmNewPassword;
  const canSubmit = currentPassword.length > 0 && newPassword.length >= 6 && passwordsMatch;

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!canSubmit) return;

    try {
      await changePasswordMutation.mutateAsync({ currentPassword, newPassword });
      toast.success("Password updated successfully");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
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
          <div className="space-y-2">
            <Label htmlFor="current-password">Current Password</Label>
            <Input
              id="current-password"
              type="password"
              value={currentPassword}
              onChange={(event) => setCurrentPassword(event.target.value)}
              className="h-11 rounded-xl bg-secondary/70"
              autoComplete="current-password"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="new-password">New Password</Label>
            <Input
              id="new-password"
              type="password"
              value={newPassword}
              onChange={(event) => setNewPassword(event.target.value)}
              className="h-11 rounded-xl bg-secondary/70"
              autoComplete="new-password"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirm-new-password">Confirm New Password</Label>
            <Input
              id="confirm-new-password"
              type="password"
              value={confirmNewPassword}
              onChange={(event) => setConfirmNewPassword(event.target.value)}
              className="h-11 rounded-xl bg-secondary/70"
              autoComplete="new-password"
            />
            {newPassword && confirmNewPassword && !passwordsMatch ? (
              <p className="text-xs text-destructive">Passwords do not match.</p>
            ) : null}
          </div>
          <Button type="submit" className="w-full rounded-xl sm:w-auto" disabled={!canSubmit || changePasswordMutation.isPending}>
            {changePasswordMutation.isPending ? "Updating..." : "Update Password"}
          </Button>
        </form>
      </CardContent>
    </DashboardCard>
  );
}
