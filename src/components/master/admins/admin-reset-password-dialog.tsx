"use client";

import { useState, type FormEvent } from "react";
import { toast } from "sonner";

import { showApiErrorToast } from "@/lib/api/error-toast";

import { AppIcon } from "@/components/common/app-icon";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useResetAdminPassword } from "@/features/master-admins/api/admin.mutations";

type AdminResetPasswordDialogProps = { adminId: string; adminName: string; adminEmail?: string; open: boolean; onOpenChange: (open: boolean) => void };

export function AdminResetPasswordDialog({ adminId, adminName, adminEmail, open, onOpenChange }: AdminResetPasswordDialogProps) {
  const resetMutation = useResetAdminPassword(adminId);
  const [requireReset, setRequireReset] = useState(true);
  const [sendEmail, setSendEmail] = useState(true);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    try {
      await resetMutation.mutateAsync({
        temporaryPassword: String(formData.get("temporaryPassword") ?? ""),
        confirmPassword: String(formData.get("confirmPassword") ?? ""),
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
        <form onSubmit={handleSubmit}>
          <DialogHeader><DialogTitle>Reset Admin Password</DialogTitle><DialogDescription>Create a temporary password for {adminName}{adminEmail ? ` (${adminEmail})` : ""}.</DialogDescription></DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2"><Label htmlFor="temporary-password">Temporary Password</Label><Input id="temporary-password" name="temporaryPassword" type="password" defaultValue="Vox@12345" className="h-11 rounded-xl bg-secondary/70" /></div>
            <div className="space-y-2"><Label htmlFor="confirm-temporary-password">Confirm Password</Label><Input id="confirm-temporary-password" name="confirmPassword" type="password" defaultValue="Vox@12345" className="h-11 rounded-xl bg-secondary/70" /></div>
            <div className="flex items-center justify-between gap-4 rounded-xl border border-border bg-secondary/70 px-4 py-3"><div><p className="text-sm font-medium text-foreground">Require reset on next login</p><p className="text-xs text-muted-foreground">The admin must set a new password after signing in.</p></div><Switch checked={requireReset} onCheckedChange={setRequireReset} /></div>
            <div className="flex items-center justify-between gap-4 rounded-xl border border-border bg-secondary/70 px-4 py-3"><div><p className="text-sm font-medium text-foreground">Send notification email</p><p className="text-xs text-muted-foreground">Send reset instructions to the admin email.</p></div><Switch checked={sendEmail} onCheckedChange={setSendEmail} /></div>
          </div>
          <DialogFooter><DialogClose render={<Button variant="outline" className="rounded-xl" />}>Cancel</DialogClose><Button type="submit" className="rounded-xl" disabled={resetMutation.isPending}><AppIcon name="permissions" className="size-4" />{resetMutation.isPending ? "Resetting..." : "Reset Password"}</Button></DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
