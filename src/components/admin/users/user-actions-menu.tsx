"use client";

import { useState } from "react";
import { toast } from "sonner";

import { AppIcon } from "@/components/common/app-icon";
import { DeleteConfirmDialog } from "@/components/common/delete-confirm-dialog";
import { AdminResetPasswordDialog } from "@/components/master/admins/admin-reset-password-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  useDeleteAdminUser,
  useUpdateAdminUser,
} from "@/features/admin-users/api/user.api";
import type { AdminListItem } from "@/features/master-admins/api/admin.types";
import { adminUserLabel, normalizeAdminUserValue } from "@/features/admin-users/user.presentation";
import { showApiErrorToast } from "@/lib/api/error-toast";

type UserActionsMenuProps = {
  user: AdminListItem;
  onView: (user: AdminListItem) => void;
  onEdit: (user: AdminListItem) => void;
};

export function UserActionsMenu({ user, onView, onEdit }: UserActionsMenuProps) {
  const updateMutation = useUpdateAdminUser(user.id);
  const deleteMutation = useDeleteAdminUser();
  const [deactivateDialogOpen, setDeactivateDialogOpen] = useState(false);
  const [resetDialogOpen, setResetDialogOpen] = useState(false);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const normalizedStatus = normalizeAdminUserValue(user.status);
  const nextStatus = normalizedStatus === "ACTIVE" ? "INACTIVE" : "ACTIVE";

  async function toggleStatus() {
    try {
      await updateMutation.mutateAsync({ status: nextStatus });
      toast.success(`${user.fullName} marked ${adminUserLabel(nextStatus)}`);
    } catch (error) {
      showApiErrorToast(error, "Could not update user status");
    }
  }

  async function deleteUser() {
    try {
      await deleteMutation.mutateAsync(user.id);
      toast.success(`${user.fullName} deleted`);
    } catch (error) {
      showApiErrorToast(error, "Could not delete user");
    }
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger className="inline-flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground">
          <AppIcon name="more" className="size-5" />
          <span className="sr-only">Open user actions</span>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56 rounded-xl">
          <DropdownMenuGroup>
            <DropdownMenuLabel>User Actions</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => onView(user)}>
              <AppIcon name="eye" className="size-4" />
              View Details
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onEdit(user)}>
              <AppIcon name="settings" className="size-4" />
              Edit User
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setResetDialogOpen(true)}>
              <AppIcon name="permissions" className="size-4" />
              Reset Password
            </DropdownMenuItem>
            <DropdownMenuItem
              disabled={updateMutation.isPending}
              onSelect={(event) => {
                event.preventDefault();
                setStatusDialogOpen(true);
              }}
            >
              <AppIcon name="status" className="size-4" />
              Mark {adminUserLabel(nextStatus)}
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem
              variant="destructive"
              disabled={deleteMutation.isPending}
              onClick={() => setDeactivateDialogOpen(true)}
            >
              <AppIcon name="trash" className="size-4" />
              Delete User
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
      <AdminResetPasswordDialog
        adminId={user.id}
        adminName={user.fullName}
        adminEmail={user.email}
        open={resetDialogOpen}
        onOpenChange={setResetDialogOpen}
      />
      <DeleteConfirmDialog
        open={deactivateDialogOpen}
        onOpenChange={setDeactivateDialogOpen}
        title="Delete user?"
        description={`This will permanently delete ${user.fullName} and remove their access.`}
        confirmLabel="Delete User"
        onConfirm={() => void deleteUser()}
      />
      <DeleteConfirmDialog
        open={statusDialogOpen}
        onOpenChange={setStatusDialogOpen}
        title={`Mark ${adminUserLabel(nextStatus)}?`}
        description={
          nextStatus === "ACTIVE"
            ? `${user.fullName} will regain access immediately.`
            : `${user.fullName} will lose access immediately.`
        }
        confirmLabel={updateMutation.isPending ? "Saving..." : `Mark ${adminUserLabel(nextStatus)}`}
        onConfirm={() => void toggleStatus()}
      />
    </>
  );
}
