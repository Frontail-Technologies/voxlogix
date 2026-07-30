"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { showApiErrorToast } from "@/lib/api/error-toast";

import { AppIcon } from "@/components/common/app-icon";
import { DeleteConfirmDialog } from "@/components/common/delete-confirm-dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useDeleteAdmin, useUpdateAdmin } from "@/features/master-admins/api/admin.mutations";

import { AdminResetPasswordDialog } from "./admin-reset-password-dialog";

type AdminActionsMenuProps = { adminId: string; adminName: string; adminEmail: string; adminStatus: string };

export function AdminActionsMenu({ adminId, adminName, adminEmail, adminStatus }: AdminActionsMenuProps) {
  const router = useRouter();
  const deleteMutation = useDeleteAdmin();
  const updateMutation = useUpdateAdmin(adminId);
  const baseHref = `/master/admins/${adminId}`;
  const [resetDialogOpen, setResetDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [suspendDialogOpen, setSuspendDialogOpen] = useState(false);
  const isSuspended = adminStatus === "SUSPENDED";

  async function handleDelete() {
    try {
      await deleteMutation.mutateAsync(adminId);
      toast.success("Admin deleted");
      router.refresh();
    } catch (error) {
      showApiErrorToast(error, "Could not delete admin");
    }
  }

  async function handleToggleSuspend() {
    try {
      await updateMutation.mutateAsync({ status: isSuspended ? "ACTIVE" : "SUSPENDED" });
      toast.success(isSuspended ? "Admin reactivated" : "Admin suspended");
      router.refresh();
    } catch (error) {
      showApiErrorToast(error, isSuspended ? "Could not reactivate admin" : "Could not suspend admin");
    }
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger className="inline-flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"><AppIcon name="more" className="size-5" /><span className="sr-only">Open admin actions</span></DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-52 rounded-xl">
          <DropdownMenuGroup><DropdownMenuLabel>Admin Actions</DropdownMenuLabel><DropdownMenuItem className="p-0"><Link href={baseHref} className="flex w-full items-center gap-2 px-2 py-1.5"><AppIcon name="admins" className="size-4" />View Detail</Link></DropdownMenuItem><DropdownMenuItem className="p-0"><Link href={`${baseHref}/edit`} className="flex w-full items-center gap-2 px-2 py-1.5"><AppIcon name="settings" className="size-4" />Edit Admin</Link></DropdownMenuItem><DropdownMenuItem onClick={() => setResetDialogOpen(true)}><AppIcon name="permissions" className="size-4" />Reset Password</DropdownMenuItem></DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem onClick={() => setSuspendDialogOpen(true)}><AppIcon name="warning" className="size-4" />{isSuspended ? "Reactivate Admin" : "Suspend Admin"}</DropdownMenuItem>
            <DropdownMenuItem variant="destructive" onClick={() => setDeleteDialogOpen(true)}><AppIcon name="warning" className="size-4" />Delete Admin</DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
      <AdminResetPasswordDialog adminId={adminId} adminName={adminName} adminEmail={adminEmail} open={resetDialogOpen} onOpenChange={setResetDialogOpen} />
      <DeleteConfirmDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen} title="Delete admin?" description={`This will remove ${adminName} (${adminEmail}) from the platform.`} confirmLabel={deleteMutation.isPending ? "Deleting..." : "Delete Admin"} onConfirm={handleDelete} />
      <DeleteConfirmDialog
        open={suspendDialogOpen}
        onOpenChange={setSuspendDialogOpen}
        title={isSuspended ? "Reactivate admin?" : "Suspend admin?"}
        description={isSuspended ? `${adminName} will regain access immediately.` : `${adminName} will lose access to the platform immediately.`}
        confirmLabel={updateMutation.isPending ? "Saving..." : isSuspended ? "Reactivate" : "Suspend"}
        onConfirm={handleToggleSuspend}
      />
    </>
  );
}
