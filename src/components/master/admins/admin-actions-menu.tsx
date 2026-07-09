"use client";

import Link from "next/link";
import { useState } from "react";

import { AppIcon } from "@/components/common/app-icon";
import { DeleteConfirmDialog } from "@/components/common/delete-confirm-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { AdminResetPasswordDialog } from "./admin-reset-password-dialog";

type AdminActionsMenuProps = {
  adminId: string;
  adminName: string;
  adminEmail: string;
};

export function AdminActionsMenu({
  adminId,
  adminName,
  adminEmail,
}: AdminActionsMenuProps) {
  const baseHref = `/master/admins/${adminId}`;
  const [resetDialogOpen, setResetDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger className="inline-flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground">
          <AppIcon name="more" className="size-5" />
          <span className="sr-only">Open admin actions</span>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-52 rounded-xl">
          <DropdownMenuGroup>
            <DropdownMenuLabel>Admin Actions</DropdownMenuLabel>
            <DropdownMenuItem className="p-0">
              <Link
                href={baseHref}
                className="flex w-full items-center gap-2 px-2 py-1.5"
              >
                <AppIcon name="admins" className="size-4" />
                View Detail
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem className="p-0">
              <Link
                href={`${baseHref}/edit`}
                className="flex w-full items-center gap-2 px-2 py-1.5"
              >
                <AppIcon name="settings" className="size-4" />
                Edit Admin
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setResetDialogOpen(true)}>
              <AppIcon name="permissions" className="size-4" />
              Reset Password
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem
              variant="destructive"
              onClick={() => setDeleteDialogOpen(true)}
            >
              <AppIcon name="warning" className="size-4" />
              Delete Admin
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
      <AdminResetPasswordDialog
        adminName={adminName}
        adminEmail={adminEmail}
        open={resetDialogOpen}
        onOpenChange={setResetDialogOpen}
      />
      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Delete admin?"
        description={`This will remove ${adminName} (${adminEmail}) from the platform mock data. This action is only a UI placeholder for now.`}
        confirmLabel="Delete Admin"
      />
    </>
  );
}
