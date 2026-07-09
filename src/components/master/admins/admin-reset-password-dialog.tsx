"use client";

import { AppIcon } from "@/components/common/app-icon";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

type AdminResetPasswordDialogProps = {
  adminName: string;
  adminEmail?: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function AdminResetPasswordDialog({
  adminName,
  adminEmail,
  open,
  onOpenChange,
}: AdminResetPasswordDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Reset Admin Password</DialogTitle>
          <DialogDescription>
            Create a temporary password for {adminName}
            {adminEmail ? ` (${adminEmail})` : ""}. This is mock UI only.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4">
          <div className="space-y-2">
            <Label htmlFor="temporary-password">Temporary Password</Label>
            <Input
              id="temporary-password"
              type="password"
              defaultValue="Vox@12345"
              className="h-11 rounded-xl bg-secondary/70"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirm-temporary-password">Confirm Password</Label>
            <Input
              id="confirm-temporary-password"
              type="password"
              defaultValue="Vox@12345"
              className="h-11 rounded-xl bg-secondary/70"
            />
          </div>
          <div className="flex items-center justify-between gap-4 rounded-xl border border-border bg-secondary/70 px-4 py-3">
            <div>
              <p className="text-sm font-medium text-foreground">
                Require reset on next login
              </p>
              <p className="text-xs text-muted-foreground">
                The admin must set a new password after signing in.
              </p>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between gap-4 rounded-xl border border-border bg-secondary/70 px-4 py-3">
            <div>
              <p className="text-sm font-medium text-foreground">
                Send notification email
              </p>
              <p className="text-xs text-muted-foreground">
                Send mock reset instructions to the admin email.
              </p>
            </div>
            <Switch defaultChecked />
          </div>
        </div>

        <DialogFooter>
          <DialogClose render={<Button variant="outline" className="rounded-xl" />}>
            Cancel
          </DialogClose>
          <Button type="button" className="rounded-xl">
            <AppIcon name="permissions" className="size-4" />
            Reset Password
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
